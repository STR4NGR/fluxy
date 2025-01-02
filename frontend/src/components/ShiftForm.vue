<template>
    <v-container style="max-width: 100%; max-height: 120%;" class="pa-4 mt-16">
        <v-card class="rounded-lg" elevation="1" style="overflow-x: auto;" flat>
            <v-row>
                <v-col v-if="days.length" class="mb-2">
                    <thead>
                        <tr>
                            <th class="table-header-seller">Продавец</th>
                            <th class="table-header">Общее количество часов</th>
                            <th class="table-header">Общее количество смен</th>
                            <th v-for="(day, index) in filteredDays" :key="index" :class="getDayClass(day)"
                                class="calendar-header">
                                {{ day.getDate() }}<br>({{ day.toLocaleDateString('ru-RU', { weekday: 'short' })
                                }})<br>{{ calculateTotalHoursForDay(day) }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(seller, sellerIndex) in store.pinnedSellers" :key="sellerIndex">
                            <!-- Имя продавца -->
                            <td @click="openEditSellerModal(sellerIndex)" class="pinned-sellers-side">
                                {{ seller.name }}
                            </td>

                            <!-- Общее количество часов -->
                            <td class="pinned-sellers-side">
                                {{ store.getMonthHours(seller.name) }}
                            </td>

                            <!-- Общее количество смен -->
                            <td class="pinned-sellers-side">
                                {{ store.getMonthShifts(seller.name) }}
                            </td>

                            <!-- Ячейки для каждого дня -->
                            <td v-for="(day, index) in filteredDays" :key="index" class="pinned-sellers">
                                <v-btn :class="getCellClass(day, sellerIndex)" :style="getCellStyle(day)"
                                    @click.stop="openDatePicker(sellerIndex, day)" :disabled="isCellLocked(day)"
                                    class="shift-btn">
                                    <span v-if="getShiftForDay(seller, day)" v-html="getShiftForDay(seller, day)">
                                    </span>
                                    <span v-else class="opacity-0">9 - 19 <br> (10)</span>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-col>
            </v-row>
        </v-card>
    </v-container>

    <v-container>
        <v-dialog v-model="isEditSellerModalOpen" persistent max-width="400px">
            <v-card>
                <v-card-title>Редактирование продавца</v-card-title>
                <v-card-text>
                    <v-text-field v-model="editedSellerName" label="Имя продавца"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" @click="deleteSeller">Удалить продавца</v-btn>
                    <v-btn @click="closeEditSellerModal">Отмена</v-btn>
                    <v-btn color="primary" @click="saveEditedSeller">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>

    <v-container>
        <v-dialog v-model="isShiftTimeModalOpen" persistent max-width="550px" min-width="500px">
            <v-card>
                <v-card-title>Установить время смены</v-card-title>
                <v-card-text>
                    <v-row>
                        <!-- Время начала смены -->
                        <v-col cols="12" sm="6">
                            <v-row class="d-flex align-center justify-between">
                                <v-col class="text-gray-600 text-lg">Начало смены</v-col>
                                <v-col class="d-flex align-center justify-center">
                                    <v-btn @click="decrementHour('start')" icon class="purple-btn text-gray-300">
                                        <v-icon>mdi-chevron-left</v-icon>
                                    </v-btn>
                                    <span class="text-xl px-2">{{ shiftStart.hours }}</span>
                                    <v-btn @click="incrementHour('start')" icon class="purple-btn text-gray-300">
                                        <v-icon>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>

                        <!-- Время конца смены -->
                        <v-col cols="12" sm="6">
                            <v-row class="d-flex align-center justify-between">
                                <v-col class="text-gray-600 text-lg">Конец смены</v-col>
                                <v-col class="d-flex align-center justify-center">
                                    <v-btn @click="decrementHour('end')" icon class="purple-btn text-gray-300">
                                        <v-icon>mdi-chevron-left</v-icon>
                                    </v-btn>
                                    <span class="text-xl px-2">{{ shiftEnd.hours }}</span>
                                    <v-btn @click="incrementHour('end')" icon class="purple-btn text-gray-300">
                                        <v-icon>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-btn color="primary" @click="saveShift('clear')">Очистить</v-btn>

                <v-card-actions>
                    <v-btn v-if="!isShiftExist" color="red" @click="saveShift('holiday', null, null)">
                        Отдыхаю
                    </v-btn>
                    <v-btn v-if="!isShiftExist" color="green" @click="saveShift('workday', null, null)">
                        Работаю
                    </v-btn>
                    <v-btn @click="closeShiftTimeModal">Отмена</v-btn>
                    <v-btn color="primary" @click="saveShift('workday', shiftStart.hours, shiftEnd.hours)">
                        Подтвердить время
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch, watchEffect } from 'vue';
import { useStore } from '@/stores/store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const days = ref([]);
const isShiftExist = ref(false);
const editedSellerName = ref('');
const shiftStart = ref({ hours: 9 });
const shiftEnd = ref({ hours: 19 });
const isEditSellerModalOpen = ref(false);
const isShiftTimeModalOpen = ref(false);
const selectedSellerIndex = ref(null);
const selectedDay = ref();
const minTime = '9';
const maxTime = '19';
const selectedDateRange = ref([null, null]);

const store = useStore();

const filteredDays = computed({
    get: () => store.filteredDays,
    set: (value) => {
        store.filteredDays = value;
    },
});

const selectedMonth = computed({
    get: () => store.selectedMonth,
    set: (value) => {
        store.selectedMonth = value;
    }
});

const selectedYear = computed({
    get: () => store.selectedYear,
    set: (value) => {
        store.selectedYear = value;
    }
});

const pinnedSellers = computed({
    get: () => store.pinnedSellers,
    set: (value) => {
        store.pinnedSellers = value;
    },
});

const workingSellers = computed({
    get: () => store.workingSellers,
    set: (value) => {
        store.workingSellers = [...value];
    },
});

const openDatePicker = (sellerIndex, day) => {
    selectedSellerIndex.value = sellerIndex;
    selectedDay.value = day;
    isShiftTimeModalOpen.value = true;
    const formattedDate = selectedDay.value.toLocaleDateString('en-CA'); // Используем формат "YYYY-MM-DD"

    // Получаем текущего продавца
    const seller = store.pinnedSellers[selectedSellerIndex.value];
    if (!seller) {
        console.error('Продавец не найден по данному индексу:', selectedSellerIndex);
        return;
    }

    const existingShiftIndex = seller.schedule.findIndex(s => s.date === formattedDate);

    if (existingShiftIndex === -1) {
        isShiftExist.value = false;
    } else if (seller.schedule[existingShiftIndex].shiftStart != null) {
        isShiftExist.value = true;
    } else {
        isShiftExist.value = false;
    }
}

const calculateTotalWorkDay = async (seller) => {
    let totalHours = 0;
    let totalShifts = 0;

    const updateSeller = workingSellers.value.find(findSeller =>
        findSeller.name === seller.name
    );

    updateSeller.result.find(item => {
        if (Number(item.month) === selectedMonth.value && Number(item.year) === selectedYear.value) {
            totalHours = item.month_hours;
            totalShifts = item.month_shifts;
        }
    });

    store.setTotalHours(updateSeller.name, totalHours);
    store.setTotalShifts(updateSeller.name, totalShifts);

};

// Переработать систему добавления (нужно чтобы проверились соло дни)
// Ошибка при добавлении и очистке смены (clear не появляется при нажатии на очистить)
// Заменить delete на unpin
// Избавиться от clear (засоряют базу)
// Изменять schedule всех продавцов в pinnedSellers и потом Update в базе
// eslint-disable-next-line

// eslint-disable-next-line
const calculateTotalHours = (seller) => {
    let totalHours = 0;
    seller.schedule.forEach(shift => {
        const shiftDate = new Date(shift.date);
        if (shiftDate.getMonth() === selectedMonth.value && shift.user_id === store.userID) {
            const start = shift.start_time;
            const end = shift.end_time;

            if (!isNaN(start) && !isNaN(end)) {
                const hours = (end - start);
                totalHours += hours;
            }
        }
    });
    return Math.round(totalHours);
};

// eslint-disable-next-line
const updateTotalHours = (seller, totalHours) => {
    const editedIndex = seller.result.findIndex(item =>
        item.month === String(store.selectedMonth) && item.year === String(store.selectedYear));

    const editedResult = seller.result[editedIndex];
    console.log(totalHours);

    //editedResult.total_hours = editedResult.total_hours + totalHours; 
    editedResult.month_hours = totalHours; 

    const savedSeller = workingSellers.value.find(findSeller =>
        findSeller.name === seller.name
    );

    updateSellerSchedule(savedSeller); 
}

// eslint-disable-next-line
const calculateTotalShifts = (seller, selectedMonth) => {
    let totalShifts = 0;

    seller.schedule.forEach(shift => {
        const shiftDate = new Date(shift.date);
        if ((shiftDate.getMonth() === selectedMonth) && (shift.shiftStart != null)) {
            totalShifts++;
        }
    });

    return totalShifts;
};

const updateTotal = () => {
    store.workingSellers.forEach(seller => {
        saveTotal(seller);
    });
}

// eslint-disable-next-line
const saveTotal = (seller) => {

    let totalHours = 0;

    seller.schedule.forEach(shift => {
        const shiftDate = new Date(shift.date);
        if (shiftDate.getMonth() === selectedMonth.value && shift.user_id === store.userID) {
            const start = shift.start_time;
            const end = shift.end_time;

            if (!isNaN(start) && !isNaN(end)) {
                const hours = (end - start);
                totalHours += hours;
            }
        }
    });

    store.setMonthHours(seller.name, totalHours);
    
    //updateTotalHours(seller, store.getTotalHours(seller.name));

    /*seller.schedule.forEach(shift => {
        const shiftDate = new Date(shift.date);
        if (shiftDate.getMonth() === selectedMonth.value) {
            const start = shift.start_time;
            const end = shift.end_time;

            if (!isNaN(start) && !isNaN(end)) {
                const hours = (end - start);
                totalHours.value += hours;
                totalShifts.value += 1;
            }
        }
    });

    store.setTotalHours(seller.name, totalHours);
    store.setTotalShifts(seller.name, totalShifts);

    const editedIndex = seller.result.findIndex(item =>
        item.month === String(store.selectedMonth) && item.year === String(store.selectedYear));

    const editedResult = seller.result[editedIndex];

    const newResult = {
        _id: editedResult._id,
        month: String(store.selectedMonth),
        year: String(store.selectedYear),
        total_hours: totalHours,
        total_shifts: totalShifts,
        points_57: editedResult.points_57,
        points_1517: editedResult.points_1517,
        points_2527: editedResult.points_2527,
        points_yamarket: editedResult.points_yamarket,
        points_ozonmarket: editedResult.points_ozonmarket,
    };

    seller.result[editedIndex] = newResult;

    /*const savedSeller = workingSellers.value.find(findSeller =>
        findSeller.name === seller.name
    );*/

    //updateSellerSchedule(savedSeller); */
};

// Обновление расписания продавца
const updateSellerSchedule = async (seller) => {
    try {
        await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, seller);
    } catch (error) {
        console.error('Ошибка при обновлении расписания:', error);
    }
};

// Пересчет всех данных
const recalculateAll = () => {
    console.log(pinnedSellers.value);
};

// Обновление имени продавца на сервере
const updateSellerName = async (seller) => {
    try {
        await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, { name: seller.name });
    } catch (error) {
        console.error('Ошибка при обновлении имени продавца:', error);
    }
};

// Функция закрытия модального окна
const closeShiftTimeModal = () => {
    isShiftTimeModalOpen.value = false;
};

const incrementHour = (timeType) => {
    const name = localStorage.getItem('name');
    let localMax = 23;
    if (name !== "Склад") localMax = maxTime;
    if (timeType === 'start') {
        if (shiftStart.value.hours < localMax) {
            shiftStart.value.hours = (shiftStart.value.hours + 1) % 24;
        }
    } else {
        if (shiftEnd.value.hours < localMax) {
            shiftEnd.value.hours = (shiftEnd.value.hours + 1) % 24;
        }
    }
};

const decrementHour = (timeType) => {
    const name = localStorage.getItem('name');
    let localMin = 0;
    if (name !== "Склад") localMin = minTime;
    if (timeType === 'start') {
        if (shiftStart.value.hours > localMin) {
            shiftStart.value.hours = (shiftStart.value.hours - 1 + 24) % 24;
        }
    } else {
        if (shiftEnd.value.hours > localMin) {
            shiftEnd.value.hours = (shiftEnd.value.hours - 1 + 24) % 24;
        }
    }
};

const checkCalendarShift = () => {
    const formattedDate = selectedDay.value ? selectedDay.value.toLocaleDateString('en-CA') : null;
    const sellerWorkDay = pinnedSellers.value.filter(seller =>
        seller.schedule.some(shift => shift.date === formattedDate && (shift.pre_shift === 'workday'))
    ).length;

    if (sellerWorkDay === 1) {
        pinnedSellers.value.forEach(seller => {
            seller.schedule.forEach((shift, index) => {
                if (shift.date === formattedDate && shift.pre_shift === 'workday') {
                    const preshift = { date: formattedDate, pre_shift: 'soloday' };
                    seller.schedule[index] = preshift;
                    updateSellerSchedule(seller);
                }
            });
        });
    }
}
// eslint-disable-next-line
const colorShift = (dayType, shift, startShift, endShift) => {
    const date = new Date(Date.UTC(store.selectedYear, store.selectedMonth, selectedDay.value.getDate()));
    const formattedDate = date.toLocaleDateString('en-CA');
    const updatingSeller = pinnedSellers.value[selectedSellerIndex.value];

    if (!updatingSeller) {
        console.error('Продавец не найден по данному индексу:', selectedSellerIndex);
        return;
    }

    const seller = workingSellers.value.find(findSeller =>
        findSeller.name === updatingSeller.name
    );

    const currentShift = seller.schedule.find(s => s.date === formattedDate);

    let sellerSoloDay = pinnedSellers.value.filter(seller =>
        seller.schedule.some(
            shift => shift.date === formattedDate &&
                (shift.pre_shift === 'soloday'))).length;

    let sellerWorkDay = pinnedSellers.value.filter(seller =>
        seller.schedule.some(
            shift => shift.date === formattedDate &&
                (shift.pre_shift === 'workday'))).length;

    switch (dayType) {
        case 'holiday':
            if (sellerWorkDay == 2) {
                if ((currentShift) && (currentShift.pre_shift === 'workday')) {
                    delete shift.start_time;
                    delete shift.end_time;
                    shift.pre_shift = 'holiday';
                    updateCalendarShifts('workday', 'soloday');
                }
            }
            break;
        case 'workday':
            if (sellerWorkDay < 1) {
                if ((sellerSoloDay >= 1)) {
                    if ((currentShift) && (currentShift.pre_shift === 'soloday')) {
                        if ((startShift === null) && (endShift === null)) {
                            delete shift.start_time;
                            delete shift.end_time;
                            shift.pre_shift = 'soloday';
                        } else if ((startShift !== null) && (endShift !== null)) {
                            shift.start_time = startShift;
                            shift.end_time = endShift;
                            shift.pre_shift = 'soloday'
                        }
                    } else {
                        if ((startShift === null) && (endShift === null)) {
                            delete shift.start_time;
                            delete shift.end_time;
                            shift.pre_shift = 'workday';
                        } else if ((startShift !== null) && (endShift !== null)) {
                            shift.start_time = startShift;
                            shift.end_time = endShift;
                            shift.pre_shift = 'workday'
                        }
                        updateCalendarShifts('soloday', 'workday');
                    }
                } else {
                    if ((startShift === null) && (endShift === null)) {
                        delete shift.start_time;
                        delete shift.end_time;
                        shift.pre_shift = 'soloday';
                    } else if ((startShift !== null) && (endShift !== null)) {
                        shift.start_time = startShift;
                        shift.end_time = endShift;
                        shift.pre_shift = 'soloday'
                    }
                }
            } else {
                if ((startShift === null) && (endShift === null)) {
                    delete shift.start_time;
                    delete shift.end_time;
                    shift.pre_shift = 'workday';
                } else if ((startShift !== null) && (endShift !== null)) {
                    shift.start_time = startShift;
                    shift.end_time = endShift;
                    shift.pre_shift = 'workday'
                }
            }
            break;
        case 'clear':
            if (sellerWorkDay == 2) {
                if ((currentShift) && (currentShift.pre_shift === 'workday')) {
                    if ((startShift === null) && (endShift === null)) {
                        delete shift.start_time;
                        delete shift.end_time;
                        shift.pre_shift = '';
                    } else if ((startShift !== null) && (endShift !== null)) {
                        shift.start_time = startShift;
                        shift.end_time = endShift;
                        shift.pre_shift = '';
                    }
                    updateCalendarShifts('workday', 'soloday');
                }
            }
            break
        default:
            break;
    }
}

const saveShift = async (dayType, startShift, endShift) => {
    const date = new Date(Date.UTC(store.selectedYear, store.selectedMonth, selectedDay.value.getDate()));
    const formattedDate = date.toLocaleDateString('en-CA');

    await store.fetchWorkingSellers();
    await store.fetchPinnedSellers();

    const updatingSeller = store.workingSellers.find(findSeller =>
        findSeller._id === store.pinnedSellers[selectedSellerIndex.value]._id
    );

    const savingPreShift = await checkShift(updatingSeller, dayType);

    const shift = {
        date: formattedDate,
        pre_shift: savingPreShift,
        user_id: store.userID,
    };

    if (startShift !== null && endShift !== null) {
        shift.start_time = startShift;
        shift.end_time = endShift;
    }

    await updatePinnedShift(updatingSeller, shift);

    /*if (existingShiftIndex !== -1) {
        updatingSeller.schedule[existingShiftIndex] = shift;
    } else {
        updatingSeller.schedule.push(shift);
    }*/

    //updateWorkingSellers(updatingSeller, shift);
    //updateSellerSchedule(updatingSeller);

    //pinnedSellers.value = filterPinnedSellers(workingSellers.value, userID, store.selectedMonth);

    saveTotal(updatingSeller);
    closeShiftTimeModal();
};

const updatePinnedShift = async (seller, shift) => {
    store.updateSellerSchedule({ sellerId: seller._id, shift });
    await store.modifySellerSchedule(seller);
    await store.fetchPinnedSellers();
};

const checkShift = async (seller, dayType) => {
    const date = new Date(Date.UTC(store.selectedYear, store.selectedMonth, selectedDay.value.getDate()));
    const formattedDate = date.toLocaleDateString('en-CA');

    const existingShift = seller.schedule.find(s => s.date === formattedDate && s.user_id === store.userID) || {};

    const workdaySellerCount = store.getWorkingSellersCount(formattedDate);
    const solodaySellerCount = store.getSoloSellersCount(formattedDate);

    if (workdaySellerCount === 0 && solodaySellerCount === 0) {
        if (dayType === 'clear' || dayType === 'holiday') {
            existingShift.pre_shift = dayType;
        } else {
            existingShift.pre_shift = 'soloday';
        }
    } else if (workdaySellerCount === 0 && solodaySellerCount === 1) {
        if (dayType === 'clear' || dayType === 'holiday') {
            existingShift.pre_shift = dayType;
            updateCalendarShifts('workday', 'soloday');
        } else {
            console.log(existingShift.pre_shift);
            if (existingShift.pre_shift !== 'soloday') {
                existingShift.pre_shift = 'workday';
                updateCalendarShifts('soloday', 'workday');
            }
        }
    } else if (workdaySellerCount === 1 && solodaySellerCount === 0) {
        existingShift.pre_shift = dayType;
        if (dayType !== 'clear' && dayType !== 'holiday') {
            updateCalendarShifts('soloday', 'workday');
        }
    } else if (workdaySellerCount === 2) {
        if (dayType === 'clear' || dayType === 'holiday') {
            existingShift.pre_shift = dayType;
            updateCalendarShifts('workday', 'soloday');
        }
    }

    /*
    if (workdaySellerCount === 1 && solodaySellerCount === 0) {
        if (dayType === 'clear' || dayType === 'holiday') {
            existingShift.pre_shift = dayType;
            updateCalendarShifts('workday', 'soloday');
            //await updatePinnedShift(seller, shift);
            //pinnedSellers.value = store.filterPinnedSellers(workingSellers.value, userID);
        } else {
            existingShift.pre_shift = dayType;
            //seller.schedule[seller.schedule.indexOf(existingShift)] = shift;
            //await updatePinnedShift(seller, shift);
            //pinnedSellers.value = store.filterPinnedSellers(workingSellers.value, userID);
        }
    } else if (workdaySellerCount === 0 && solodaySellerCount === 1) {
        if (dayType === 'clear' || dayType === 'holiday') {
            existingShift.pre_shift = dayType;
            updateCalendarShifts('workday', 'soloday');
            //await updatePinnedShift(seller, shift);
            //pinnedSellers.value = store.filterPinnedSellers(workingSellers.value, userID);
        } 
    } else if (workdaySellerCount === 1 && solodaySellerCount === 1) {
        //shift.pre_shift = 'workday';
        //seller.schedule[seller.schedule.indexOf(existingShift)] = shift;
        updateCalendarShifts('soloday', 'workday');
        //await updatePinnedShift(seller, shift);
        //pinnedSellers.value = store.filterPinnedSellers(workingSellers.value, userID);

        // не правильно работает clear 
        // не корректно выполняется смена цвета смены
        // проверить все типы pre_shift (вроде не работает красный)
        // при добавлении в workingSellers обновлять filteredSellers
        // проверить смену store.selectedMonth и store.selectedYear
    
    } */

    return existingShift.pre_shift;

};
// eslint-disable-next-line
const updateCalendarShifts = async (fromShift, toShift) => {
    const date = new Date(Date.UTC(store.selectedYear, store.selectedMonth, selectedDay.value.getDate()));
    const formattedDate = date.toLocaleDateString('en-CA');
    const userID = localStorage.getItem('id');

    for (const seller of workingSellers.value) {
        for (const [index, shift] of seller.schedule.entries()) {
            if (shift.date === formattedDate &&
                shift.pre_shift === fromShift &&
                shift.user_id === userID) {

                // Меняем тип смены на toShift
                shift.pre_shift = toShift;

                /*
                if (shift.start_time && shift.end_time) {
                    shift.start_time = shift.start_time;
                    shift.end_time = shift.end_time;
                } else {
                    // Если времени нет, удаляем старые значения времени
                    delete shift.start_time;
                    delete shift.end_time;
                } */

                // Обновляем конкретную смену в расписании
                seller.schedule[index] = shift;

                await updatePinnedShift(seller, shift);
                //await store.modifySellerSchedule(seller); // Предполагается, что seller - это обновленный объект
                //updateSellerSchedule(seller);
            }
        }
    }
};


// eslint-disable-next-line
const updateWorkingSellers = (updatingSeller, updatingShift) => {
    const index = workingSellers.value.findIndex(seller => seller._id === updatingSeller._id);
    if (index !== -1) {
        const updatedSeller = { ...workingSellers.value[index] };
        updatedSeller.schedule = [...updatedSeller.schedule, updatingShift];
        workingSellers.value.splice(index, 1, updatedSeller);
        workingSellers.value = [...workingSellers.value];
    }
}

// Сохранение измененного имени продавца
const saveEditedSeller = async () => {
    if (selectedSellerIndex.value !== null) {
        pinnedSellers.value[selectedSellerIndex.value].name = editedSellerName.value;
        await updateSellerName(pinnedSellers.value[selectedSellerIndex.value]);

        closeEditSellerModal(); // Закрыть модальное окно после сохранения
    }
};

// Генерация календаря
const generateCalendar = async () => {
    selectedMonth.value = new Date().getMonth();
    selectedYear.value = new Date().getFullYear();
    const year = selectedYear.value;
    const month = selectedMonth.value;
    const date = new Date(year, month, 1);

    days.value = [];

    while (date.getMonth() === month) {
        days.value.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    // Установить начальный диапазон как первый и последний день месяца
    selectedDateRange.value = [...[days.value[0], days.value[days.value.length - 1]]];
    updateFilteredDays();
    await fetchPinnedSellers();
};

const fetchWorkingSellers = async () => {
    try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/sellers`);
        workingSellers.value = response.data;
    } catch (error) {
        console.error("Ошибка при получении продавцов:", error);
    }
}

const filterPinnedSellers = (sellers, userID, selectedMonth) => {
    return pinnedSellers.value = sellers
        .filter((seller) =>
            seller.schedule.some((shift) => {
                const shiftDate = new Date(shift.date);
                return (
                    shiftDate.getMonth() === selectedMonth &&
                    shift.user_id === userID
                );
            })
        )
        .map((seller) => ({
            ...seller,
            schedule: seller.schedule
                .filter((shift) => {
                    const shiftDate = new Date(shift.date);
                    return (
                        shiftDate.getMonth() === selectedMonth &&
                        shift.user_id === userID
                    );
                })
                .map((shift) => ({ ...shift })),
        }));
};

const fetchPinnedSellers = async () => {
    await fetchWorkingSellers();
    const userID = localStorage.getItem('id');
    pinnedSellers.value = filterPinnedSellers(workingSellers.value, userID, store.selectedMonth);
    workingSellers.value.forEach((seller) => {
        calculateTotalWorkDay(seller);
    });
};

const deleteSeller = async () => {
    if (selectedSellerIndex.value !== null) {
        const userId = localStorage.getItem('id'); // Получаем userID
        try {
            //const seller = await SellerForm.getSellerByName(pinnedSellers.value[selectedSellerIndex].name);
            const seller = null
            // Отправляем запрос на удаление продавца
            await axios.delete(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, {
                data: { userID: userId } // Передаем userID в теле запроса
            });

            // Удаляем продавца из локального массива только после успешного ответа
            pinnedSellers.value.splice(selectedSellerIndex.value, 1);

            recalculateAll();
            checkCalendarShift();
            closeEditSellerModal();

        } catch (error) {
            console.error('Ошибка при удалении продавца:', error);
        }
    }
};

// Обновление отображаемых дней на основе выбранного диапазона
const updateFilteredDays = () => {
    const startIndex = days.value.findIndex(day => {
        return day.setHours(0, 0, 0, 0) === selectedDateRange.value[0].setHours(0, 0, 0, 0);
    });

    const endIndex = days.value.findIndex(day => {
        return day.setHours(0, 0, 0, 0) === selectedDateRange.value[1].setHours(0, 0, 0, 0);
    });

    if (startIndex === -1 || endIndex === -1) {
        console.error("Selected date range contains dates not found in days.");
        return;
    }

    filteredDays.value = days.value.slice(startIndex, endIndex + 1);
};

// Метод для определения стиля заблокированных ячеек
const getCellStyle = (day) => {
    if (isCellLocked(day)) {
        return {
            backgroundImage: 'repeating-linear-gradient(45deg, #d1d5db 0, #d1d5db 10px, #e5e7eb 10px, #e5e7eb 20px)',
        };
    }
    return '';
};

// Класс для выходных
const getDayClass = (day) => {
    const dayOfWeek = day.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6 ? 'holiday' : '';
};

// Метод для определения класса цвета ячейки
const getCellClass = (day, sellerIndex) => {
    const date = new Date(Date.UTC(store.selectedYear, store.selectedMonth, day.getDate()));
    const formattedDate = date.toLocaleDateString('en-CA');
    const seller = pinnedSellers.value[sellerIndex];

    if (!seller) {
        console.error('Продавец не найден по данному индексу:', sellerIndex);
        return;
    }

    let color = '';

    if (seller) {
        const colorIndex = seller?.schedule.findIndex(s => s.date === formattedDate);
        color = colorIndex !== -1 ? seller.schedule[colorIndex].pre_shift : ''; // Добавлено получение цвета
    }

    // Возвращаем класс в зависимости от цвета
    return {
        'bg-red': color === 'holiday',
        'bg-green': color === 'workday',
        'solo': color === 'soloday',
        'bg-white': !color,  // Если цвет не выбран, оставляем белый фон
    };
};

// Расчет общего количества часов за выбранный день для всех продавцов

// отфильтровать pinnedSellers по selectedDate
const calculateTotalHoursForDay = (selectedDate) => {
    let totalHours = 0;
    const targetDate = new Date(Date.UTC(selectedYear.value, selectedMonth.value, selectedDate.getDate()));
    const formattedDate = targetDate.toLocaleDateString('en-CA');

    pinnedSellers.value.forEach(seller => {
        seller.schedule.forEach(shift => {
            if (shift.date === formattedDate) {
                const start = shift.start_time;
                const end = shift.end_time;

                if (!isNaN(start) && !isNaN(end)) {
                    const hours = (end - start);
                    totalHours += hours;
                }
            }
        });
    });
    return Math.round(totalHours); //
};

// Блокировка клеток для определенных дней
const isCellLocked = (day) => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    const now = new Date();
    const currentHourMoscow = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Moscow',
        hour: 'numeric',
        hour12: false,
    }).format(now);

    const currentDateMoscow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));

    if (decodedToken.role === 'seller' && day < currentDateMoscow.setHours(0, 0, 0, 0)) {
        return false;
        // здесь верни true для блокировки ячейки
    }

    const dayInMoscow = new Date(day.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
    const isToday = dayInMoscow.toDateString() === currentDateMoscow.toDateString();

    if (decodedToken.role === 'seller' && isToday && currentHourMoscow >= 11) {
        return false;
        // здесь верни true для блокировки ячейки
    }

    return false;
};

// Получение смены для конкретного дня
const getShiftForDay = (seller, day) => {
    const date = new Date(Date.UTC(store.selectedYear, store.selectedMonth, day.getDate()));
    const formattedDate = date.toLocaleDateString('en-CA');
    const shift = seller.schedule.find(shift => shift.date === formattedDate);
    let shiftForDay = '';
    let shiftHour = 0;
    if (shift) {
        shiftHour = shift.end_time - shift.start_time;
        shiftForDay = `${shift.start_time} - ${shift.end_time} <br> (${shiftHour})`;
    }

    if (shift?.start_time === undefined || shift?.end_time === undefined) {
        shiftForDay = '';
    }

    return shiftForDay;
    //return shift ? `${shift.shiftStart} - ${shift.shiftEnd}` : '';
};

// Закрытие модального окна
const closeEditSellerModal = () => {
    isEditSellerModalOpen.value = false;
};

// Открытие модального окна для изменения имени продавца
const openEditSellerModal = (sellerIndex) => {
    selectedSellerIndex.value = sellerIndex;
    editedSellerName.value = pinnedSellers.value[sellerIndex].name;
    isEditSellerModalOpen.value = true;
};

watch(selectedMonth, () => {
    fetchPinnedSellers();
});

onMounted(async () => {
    await store.fetchWorkingSellers();
    await store.fetchPinnedSellers();
    await generateCalendar();
});

watchEffect(() => {
    updateTotal();
});

</script>

<style scoped>
.table-header {
    min-width: 80px;
    font-size: 12px;
    border-right: 2px solid #E6E5E7;
    padding-left: 10px;
    padding-right: 10px;
}

.table-header-seller {
    min-width: 120px;
    font-size: 12px;
    border-right: 2px solid #E6E5E7;
    padding-left: 10px;
    padding-right: 10px;
}

.calendar-header {
    height: 100%;
    width: 120px;
    min-width: 70px;
    font-size: 12px;
    border-right: 2px solid #E6E5E7;
}

.v-input {
    width: 100%;
    /* Заполнить ширину контейнера */
    height: 100%;
    /* Заполнить высоту контейнера */
    text-align: center;
    /* Центрирование текста */
}

.my-app {
    background-color: #F8F7FA;
    /* Использование предустановленного цвета Vuetify */
}

.custom-bg {
    background-color: #ffffff;
    /* Выберите ваш цвет */
}

.custom-btn:hover {
    background-color: black !important;
    color: white !important;
}

.custom-cell {
    all: unset;
    /* Убирает все стили */
    /* Дополнительные стили для этой ячейки */
}

.work-label {
    margin-bottom: 10px;
}

.work-button {
    color: #413E4F;
    border-radius: 20px;
    /* Закругление углов */
    box-shadow: none;
    margin-bottom: 10px;
}

.purple-btn {
    /*border: 2px solid #413E4F;  Цвет и толщина обводки */
    color: #413E4F;
    border-radius: 0px;
    /* Закругление углов */
    box-shadow: none;
}

.purple-btn:hover {
    /* border: 2px solid #413E4F;  Цвет и толщина обводки */
    background-color: #E5E4E7;
    color: #413E4F;
    border-radius: 0px;
    /* Закругление углов */
    box-shadow: none;
}

.shift-btn {
    color: #413E4F;
    box-shadow: none;
    width: 70px;
    height: 70px;
    display: flex;
    /* Flexbox для центрирования */
    align-items: center;
    /* Центрирование по вертикали */
    justify-content: center;
    /* Центрирование по горизонтали */
    text-align: center;
    /* Центрирование текста */
    border-radius: 0 !important;
}

/* class="custom-cell flex-grow h-full w-full py-1 px-1 bg-white text-sm" */
.pinned-sellers {
    height: 100%;
    width: 75px;
    min-width: 70px;
    max-width: 75px;
    font-size: 16px;
    border-right: 1px solid #E6E5E7;
    border-top: 6px solid #E6E5E7;
    word-wrap: break-word;
}

.pinned-sellers-side {
    height: 100%;
    width: 150px;
    min-height: 65px;
    min-width: 50px;
    font-size: 16px;
    cursor: pointer;
    border-right: 2px solid #E6E5E7;
    border-top: 6px solid #E6E5E7;
    text-align: center;
    line-height: 3.5vh;
    padding-left: 20px;
    padding-right: 20px;
}

th,
td {
    border-right: 1px solid #ddd;
}

/* Настроить прокрутку */
.v-col.overflow-x-auto {
    max-width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.holiday {
    background-color: #F3F3F4 !important;
}

.solo {
    background-color: orange !important;
    position: relative;
    text-align: center;
    border-right: 2px solid #E6E5E7;
}

.solo::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>