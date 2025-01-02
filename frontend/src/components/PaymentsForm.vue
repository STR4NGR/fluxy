<template>
    <v-container style="max-width: 98%;" class="pa-0 mb-0 custom-bg" fluid>
        <v-card class="rounded-lg overflow-x-auto" elevation="1" flat>
            <v-row class="d-flex justify-center align-center" no-gutters>
                <!-- Центр: Название магазина -->
                <v-col class="d-flex align-center mt-4" cols="auto">
                    <span class="display-1 text-h4">{{ shopName }}</span>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <template v-slot:default>
                        <thead>
                            <tr class="bg-gray-200">
                                <th colspan="6" class="overdraft-minus-header"></th>
                                <th colspan="2" class="overdraft-minus-header">Минус два месяца</th>
                                <th colspan="1" class="overdraft-minus-header"></th>
                            </tr>
                            <tr>
                                <th class="overdraft-header">Продавец</th>
                                <th class="overdraft-header">Общее количество часов</th>
                                <th class="overdraft-header">Общее количество смен</th>
                                <th colspan="1" class="overdraft-header">Получено с 5 по 7</th>
                                <th colspan="1" class="overdraft-header">Получено с 15 по 17</th>
                                <th colspan="1" class="overdraft-header">Получено с 25 по 27</th>
                                <th colspan="1" class="overdraft-header">ЯМаркет</th>
                                <th colspan="1" class="overdraft-header">Озон</th>
                                <th class="overdraft-header">Итого</th>
                            </tr>
                        </thead>
                        <tbody v-for="(seller, sellerIndex) in workingMonthSellers" :key="sellerIndex">
                            <tr v-for="result in seller.result" :key="result.id">
                                <td class="overdraft-seller">
                                    {{ seller.name }}
                                </td>
                                <td class="overdraft-seller">
                                    {{ store.getTotalHours(seller.name) }}
                                </td>
                                <td class="overdraft-seller">
                                    {{ store.getTotalShifts(seller.name) }}
                                </td>
                                <td class="overdraft-field">
                                    <v-text-field v-model="result.points_57" min="0" @input="saveCalculation(seller)"
                                        class="overdraft-text-field" type="number" hide-spin-buttons variant="filled" />
                                </td>
                                <td class="overdraft-field">
                                    <v-text-field v-model="result.points_1517" min="0" @input="saveCalculation(seller)"
                                        class="overdraft-text-field" type="number" hide-spin-buttons variant="filled" />
                                </td>
                                <td class="overdraft-field">
                                    <v-text-field v-model="result.points_2527" min="0" @input="saveCalculation(seller)"
                                        class="overdraft-text-field" type="number" hide-spin-buttons variant="filled" />
                                </td>
                                <td class="overdraft-field">
                                    <v-text-field v-model="result.points_yamarket" min="0"
                                        @input="saveCalculation(seller)" class="overdraft-text-field" type="number"
                                        hide-spin-buttons variant="filled" />
                                </td>
                                <td class="overdraft-field">
                                    <v-text-field v-model="result.points_ozonmarket" min="0"
                                        @input="saveCalculation(seller)" class="overdraft-text-field" type="number"
                                        hide-spin-buttons variant="filled" />
                                </td>
                                <td class="overdraft-seller">
                                    {{ calculateTotalReceived(seller) }}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';
import { useStore } from '@/stores/store';

const selectedSellerIndex = null;
const shopName = ref('');
const store = useStore();

const workingSellers = computed({
    get: () => store.workingSellers,
    set: (value) => {
        store.workingSellers = value;
    },
});

const workingMonthSellers = computed({
    get: () => store.workingMonthSellers,
    set: (value) => {
        store.workingMonthSellers = value;
    },
});

const selectedMonth = computed({
    get: () => store.selectedMonth,
    set: (value) => {
        store.selectedMonth = value;
    }
})

// нужно изменить saveCalculations. Отсутствует месяц. Возможно вынести в отдельный файл. 
const saveCalculation = async (seller) => {
    try {

        if (!seller) {
            console.error('Продавец не найден по данному индексу:', selectedSellerIndex);
            return;
        }

        const updatingSeller = workingSellers.value.find(findSeller =>
            findSeller._id === seller._id
        );

        updateSellerSchedule(updatingSeller);


    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
    }
};

// eslint-disable-next-line
const updateSellerSchedule = async (seller) => {
    try {
        await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, seller);
    } catch (error) {
        console.error('Ошибка при обновлении расписания:', error);
    }
};

const calculateTotalReceived = (seller) => {
    if (!seller.result || !Array.isArray(seller.result)) {
        return 0; // Если данных нет, возвращаем 0
    }

    return seller.result.reduce((total, result) => {
        return total +
            (result.points_57 ?? 0) +
            (result.points_1517 ?? 0) +
            (result.points_2527 ?? 0) +
            (result.points_yamarket ?? 0) +
            (result.points_ozonmarket ?? 0);
    }, 0); // Начальное значение total = 0
};

const getName = () => {
    const name = localStorage.getItem('name');
    shopName.value = name;
};


// eslint-disable-next-line
const updateSellerResult = async (seller) => {
    try {
        await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, seller);
    } catch (error) {
        console.error("Ошибка при обновлении результата:", error);
    }
};

// eslint-disable-next-line
const addSellerToMonth = (seller) => {
    console.log(seller)

}

// eslint-disable-next-line
const isSellerWorkMonth = async (seller, index) => {
    let matchedSeller = workingMonthSellers.value.find(item =>
        item.result.month === seller.result.month
    );
    if (matchedSeller) {
        return matchedSeller.result[index];
    }
    else {
        return null;
    }
}

const getWorkingSeller = async () => {
    const userId = localStorage.getItem("id");

    workingMonthSellers.value = workingSellers.value
        .filter((seller) => seller.user_id === userId) 
        .map((seller) => {
            const filteredResults = seller.result.filter(
                (result) =>
                    result.month === String(store.selectedMonth) &&
                    result.year === String(store.selectedYear)
            );
            return filteredResults.length > 0
                ? { ...seller, result: filteredResults }
                : null;
        })
        .filter((seller) => seller !== null);

    const missingSellers = workingSellers.value
        .filter((seller) => seller.user_id === userId) 
        .filter((seller) => {
            const hasMatchingResult = seller.result.some(
                (result) =>
                    result.month === String(store.selectedMonth) &&
                    result.year === String(store.selectedYear)
            );
            return !hasMatchingResult;
        });

    const newSellers = missingSellers.map((seller) => {
        const newResult = {
            month: String(store.selectedMonth),
            year: String(store.selectedYear),
            month_hours: 0,
            month_shifts: 0,
            points_57: 0,
            points_1517: 0,
            points_2527: 0,
            points_yamarket: 0,
            points_ozonmarket: 0,
        };

        seller.result = [...seller.result, newResult];
        updateSellerResult(seller); // Обновляем данные продавца
        return { ...seller, result: [newResult] };
    });

    workingMonthSellers.value = [...workingMonthSellers.value, ...newSellers];
};


const fetchWorkingSellers = async () => {
    try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/sellers`);
        workingSellers.value = response.data;
    } catch (error) {
        console.error("Ошибка при получении продавцов:", error);
    }
}

onMounted(async () => {
    getName();
    await fetchWorkingSellers();
    await getWorkingSeller();
});

watch(selectedMonth, () => {
    fetchWorkingSellers();
});

watch(workingSellers, async () => {
    await getWorkingSeller();
});

</script>

<style scoped>
.overdraft-header {
    min-width: 168px;
    font-size: 12px;
    border-right: 2px solid #E6E5E7;
    border-bottom: 2px solid #E6E5E7;
    padding: 10px;
    text-align: center;
}

.overdraft-seller {
    width: 60px;
    font-size: 16px;
    border-right: 2px solid #E6E5E7;
    border-bottom: 4px solid #E6E5E7;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;
}

.overdraft-minus-header {
    min-width: 60px;
    width: 80px;
    font-size: 22px;
    border-top: 2px solid #E6E5E7;
    border-right: 2px solid #E6E5E7;
    border-bottom: 2px solid #E6E5E7;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;
}

.overdraft-table-header {
    width: 20px;
    font-size: 12px;
    border-right: 2px solid #E6E5E7;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;
}

.overdraft-table-header-seller {
    min-width: 120px;
    font-size: 12px;
    border-right: 2px solid #E6E5E7;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;
}

.overdraft-table-header-taken {
    min-width: 60px;
    font-size: 12px;
    border-right: 2px solid #E6E5E7;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;
}

.overdraft-field {
    height: 60px;
    border-bottom: 2px solid #E6E5E7;
    border-right: 2px solid #E6E5E7;
}

.overdraft-text-field {
    height: 100%;
    width: 100%;
    border-bottom: 2px solid #E6E5E7;
    text-align: center;
}
</style>