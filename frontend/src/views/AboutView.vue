<template>

  <div class="container mx-auto flex justify-between items-center">
  
    <div class="flex items-center pl-5 pt-1">
      <!-- Кнопка влево -->
      <button 
        @click="changeMonth(-1)" 
        class=" text-gray-300 px-2 py-2 hover:text-black transition-colors duration-300 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 15l-5-5 5-5" />
        </svg>
      </button>
  
      <!-- Текст месяца и года с верхней и нижней линией -->
      <span 
        class=" text-gray-600 text-xl px-3 py-1 "
      >
        {{ months[selectedMonth] }} {{ currentYear }}
      </span>
  
      <!-- Кнопка вправо -->
      <button 
        @click="changeMonth(1)" 
        class=" text-gray-300 px-2 py-2 hover:text-black transition-colors duration-300 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 15l5-5-5-5" />
        </svg>
      </button>  
  
    <!-- Первая группа чисел (слева) -->
    <div class="flex items-center pl-5 pt-1">
      <!-- Кнопка влево -->
      <button 
        @click="changeDayRange('left', -1)" 
        class=" text-gray-300 px-2 py-2 hover:text-black transition-colors duration-300 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 15l-5-5 5-5" />
        </svg>
      </button>
  
      <!-- Текущий день с верхней и нижней линией -->
      <span class=" text-gray-600 text-xl px-3 py-1">
        {{ leftDay }}
      </span>
  
      <!-- Кнопка вправо -->
      <button 
        @click="changeDayRange('left', 1)" 
        class=" text-gray-300 px-2 py-2 hover:text-black transition-colors duration-300 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 15l5-5-5-5" />
        </svg>
      </button>
    </div>
  
   <!-- Вторая группа чисел (справа) -->
   <div class="flex items-center pl-5 pt-1">
      <button 
        @click="changeDayRange('right', -1)" 
        class=" text-gray-300 px-2 py-2 hover:text-black transition-colors duration-300 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 15l-5-5 5-5" />
        </svg>
      </button>
  
      <span class=" text-gray-600 text-xl px-3 py-1">
        {{ rightDay }}
      </span>
  
      <button 
        @click="changeDayRange('right', 1)" 
        class=" text-gray-300 px-2 py-2 hover:text-black transition-colors duration-300 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 15l5-5-5-5" />
        </svg>
      </button>
    </div>
  
    </div> 
  
  
    <div class="flex items-center">
      <!-- Текст Магазин -->
      <span class="text-gray-800 text-3xl"> Магазин 1 </span> 
    </div>
  
    <div class="flex items-centers mr-6">    
        <button  
          class="custom-btn text-black px-1 py-1 border border-gray-300 rounded-md hover:bg-black hover:text-white transition-colors duration-300 flex items-center"
          @click="addSeller"
        >
          <!-- Иконка + -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m-8-8h16" />
          </svg>
        
          <!-- Текст Продавец -->
          <span class="text-s font-semibold">
            Продавец
          </span>
        </button>
  
        <!-- Кнопка Выйти -->
        <button 
          @click="logout" 
          class="custom-btn ml-4 font-semibold text-s text-black px-3 py-1 border border-gray-300 rounded-md hover:bg-black hover:text-white transition-colors duration-300"
        >
          Выйти
        </button>
    </div>
  </div>
  
  <div class="container">
    <div class="bg-white p-6 rounded-lg -mt-8">
      <div class="overflow-x-auto mt-3" v-if="days.length">
        <table class="min-w-full table-auto border-collapse border border-gray-300 text-center text-xs" style="table-layout: fixed;"> <!-- Добавлено table-layout: fixed -->
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 py-2 text-gray-700 font-semibold bg-gray-200 z-10" style="width: 150px;"> <!-- Фиксированная ширина для первого столбца -->
                Продавец
              </th>
              <th class="border border-gray-300 py-2" style="width: 150px;">Общее количество часов</th> <!-- Фиксированная ширина -->
              <th class="border border-gray-300 py-2" style="width: 150px;">Общее количество смен</th> <!-- Фиксированная ширина -->
              <th
                v-for="(day, index) in filteredDays"
                :key="index"
                :class="getDayClass(day)"
                class="border border-gray-300 py-2"
                style="width: 100px;"> <!-- Фиксированная ширина для дней -->
                {{ day.getDate() }}<br>({{ day.toLocaleDateString('ru-RU', { weekday: 'short' }) }})
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(seller, sellerIndex) in sellers" :key="sellerIndex" class="border-t-4 border-gray-400">
              <td
                @click="openEditSellerModal(sellerIndex)"
                class="cursor-pointer py-4 px-3 bg-gray-100 border-r border-gray-300 font-semibold text-center"
                title="Нажмите, чтобы редактировать"
                style="width: 150px;"> <!-- Фиксированная ширина -->
                {{ seller.name }}
              </td>
              <td class="text-sm border border-gray-300" style="width: 150px;">{{ calculateTotalHours(seller, selectedMonth) }}</td> <!-- Фиксированная ширина -->
              <td class="text-sm border border-gray-300" style="width: 150px;">{{ calculateTotalShifts(seller, selectedMonth) }}</td> <!-- Фиксированная ширина -->
              <td
                v-for="(day, index) in filteredDays"
                :key="index"
                class="border border-gray-300 p-0"
                style="height: 100%; width: 100px;"> <!-- Фиксированная ширина -->
                <div class="flex items-center justify-center w-full h-full">
                  <button
                    class="flex-grow h-full w-full py-1 px-1 bg-white border border-gray-300 text-sm"
                    :class="{
                      'bg-gray-50': !isCellLocked(day),
                    }"
                    :style="isCellLocked(day) ? {
                      backgroundImage: 'repeating-linear-gradient(45deg, #d1d5db 0, #d1d5db 10px, #e5e7eb 10px, #e5e7eb 20px)'
                    } : ''"
                    @click.stop="openDatePicker(sellerIndex, day)"
                    :disabled="isCellLocked(day)"
                    style="min-height: 63px; min-width: 55px;">
                    <span v-if="getShiftForDay(seller, day)">
                      {{ getShiftForDay(seller, day) }}
                    </span>
                    <span v-else class="opacity-0">9 - 19 (10)</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  
    <v-container>
      <v-dialog v-model="isEditSellerModalOpen" persistent max-width="400px">
        <v-card>
          <v-card-title>Редактирование продавца</v-card-title>
          <v-card-text>
            <v-text-field v-model="editedSellerName" label="Имя продавца"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="danger" @click="deleteSeller">Удалить продавца</v-btn>
            <v-btn @click="closeEditSellerModal">Отмена</v-btn>
            <v-btn color="primary" @click="saveEditedSeller">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  
    <v-container>
      <v-dialog v-model="isShiftTimeModalOpen" persistent max-width="400px">
        <v-card>
          <v-card-title>Установить время смены</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 text-lg">Начало смены</span>
                  <div class="flex items-center">
                    <button 
                      @click="decrementHour('start')" 
                      class="text-gray-300 px-2 py-2 hover:text-black transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 15l-5-5 5-5" />
                      </svg>
                    </button>
                    <span class="text-xl px-2">{{ shiftStart.hours }}</span>
                    <button 
                      @click="incrementHour('start')" 
                      class="text-gray-300 px-2 py-2 hover:text-black transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 15l5-5-5-5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 text-lg">Конец смены</span>
                  <div class="flex items-center">
                    <button 
                      @click="decrementHour('end')" 
                      class="text-gray-300 px-2 py-2 hover:text-black transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 15l-5-5 5-5" />
                      </svg>
                    </button>
                    <span class="text-xl px-2">{{ shiftEnd.hours }}</span>
                    <button 
                      @click="incrementHour('end')" 
                      class="text-gray-300 px-2 py-2 hover:text-black transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 15l5-5-5-5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closeShiftTimeModal">Отмена</v-btn>
            <v-btn color="primary" @click="saveShift">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  
    <!-- Модальное окно для выбора времени смены 
    <div class="modal fade" id="timeModal" tabindex="-1" aria-labelledby="timeModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="timeModalLabel">Выберите время смены</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label for="start-time">Начало:</label>
            <input type="time" v-model="shiftStart" id="start-time" min="09" max="19" class="form-control form-control-sm">
  
            <label for="end-time" class="mt-2">Конец:</label>
            <input type="time" v-model="shiftEnd" id="end-time" min="09" max="19" class="form-control form-control-sm">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Отмена</button>
            <button type="button" class="btn btn-primary btn-sm" @click="saveShift">Сохранить</button>
          </div>
        </div>
      </div>
    </div> -->
  
    <!-- Модальное окно для редактирования продавца 
    <div class="modal fade" id="editSellerModal" tabindex="-1" aria-labelledby="editSellerModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editSellerModalLabel">Изменить имя продавца</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label for="seller-name">Имя продавца:</label>
            <input type="text" v-model="editedSellerName" id="seller-name" class="form-control form-control-sm">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Отмена</button>
            
            <button type="button" class="btn btn-primary btn-sm" @click="saveEditedSeller">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </div> -->
  
    <!-- Модальное окно подтверждения удаления 
    <div class="modal fade" id="confirmDeleteModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Подтверждение удаления</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Вы уверены, что хотите удалить продавца?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
          <button type="button" class="btn btn-danger" @click="deleteSeller">Удалить</button>
        </div>
      </div>
    </div>-->
  </div> 
  
  </template>
  
  <script setup>
  import { jwtDecode } from 'jwt-decode';
  import { ref, onMounted, watch } from 'vue';
  import { computed } from 'vue';
  //import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  //const router = useRouter();
  
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  let selectedDateRange = ref([null, null]);
  const filteredDays = ref([]);
  const selectedMonth = ref(new Date().getMonth());
  const currentYear = ref(new Date().getFullYear());
  const days = ref([]);
  const sellers = ref([]);
  
  const isShiftTimeModalOpen = ref(false);
  const shiftStart = ref({ hours: 9});
  const shiftEnd = ref({ hours: 19});
  
  const minTime = '9';
  const maxTime = '19';
  
  const selectedDay = ref();
  const editedSellerName = ref('');
  const isEditSellerModalOpen = ref(false);
  let selectedSellerIndex = null;
  
  const totalHours = ref({});
  const totalShifts = ref({});
  //const sellerIndexToDelete = ref(null);
  
  // Числа для диапазона дней
  // Логика для отображения текущих дней слева и справа
  const leftDay = computed(() => selectedDateRange.value[0]?.getDate() || 'N/A');
  const rightDay = computed(() => selectedDateRange.value[1]?.getDate() || 'N/A');
  
  // Открытие модального окна для изменения имени продавца
  const openEditSellerModal = (sellerIndex) => {
    selectedSellerIndex = sellerIndex;
    editedSellerName.value = sellers.value[sellerIndex].name;
    isEditSellerModalOpen.value = true;
  };
  
  const openDatePicker = (sellerIndex, day) => {
    selectedSellerIndex = sellerIndex;
    selectedDay.value = day;
    console.log(day);
    isShiftTimeModalOpen.value = true;
  }
  
  // Закрытие модального окна
  const closeEditSellerModal = () => {
    isEditSellerModalOpen.value = false;
  };
  
  // Сохранение измененного имени продавца
  const saveEditedSeller = async () => {
    if (selectedSellerIndex !== null) {
      sellers.value[selectedSellerIndex].name = editedSellerName.value;
      await updateSellerName(sellers.value[selectedSellerIndex]);
  
      closeEditSellerModal(); // Закрыть модальное окно после сохранения
    }
  };
  
  const deleteSeller = async () => {
    if (selectedSellerIndex !== null) {
      try {
        const seller = sellers.value[selectedSellerIndex]; // Получаем выбранного продавца
        await axios.delete(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`); // Удаляем с сервера
  
        // Удаляем из локального массива
        sellers.value.splice(selectedSellerIndex, 1);
        
        // Пересчитываем данные или обновляем интерфейс, если нужно
        recalculateAll();
  
        // Закрываем модальное окно
        closeEditSellerModal();
      } catch (error) {
        console.error('Ошибка при удалении продавца:', error);
      }
    }
  };
  
  // Обновление имени продавца на сервере
  const updateSellerName = async (seller) => {
    try {
      await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, { name: seller.name });
    } catch (error) {
      console.error('Ошибка при обновлении имени продавца:', error);
    }
  };
  
  // Пример использования
  const fetchSellers = async () => {
    try {
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/sellers`);
      sellers.value = response.data;
    } catch (error) {
      console.error('Ошибка при получении продавцов:', error);
    }
  };
  
  // Функция для изменения месяца
  const changeMonth = (direction) => {
    selectedMonth.value += direction;
    if (selectedMonth.value < 0) {
      selectedMonth.value = 11; // Переход на декабрь
      currentYear.value--; // Уменьшаем год
    } else if (selectedMonth.value > 11) {
      selectedMonth.value = 0; // Переход на январь
      currentYear.value++; // Увеличиваем год
    }
    generateCalendar();
  };
  
  // Генерация календаря
  const generateCalendar = () => {
    const year = currentYear.value;
    const month = selectedMonth.value;
    const date = new Date(year, month, 1);
    days.value = [];
  
    while (date.getMonth() === month) {
      days.value.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
  
    // Установить начальный диапазон как первый и последний день месяца
    selectedDateRange.value = [...[days.value[0], days.value[days.value.length - 1]]];
    console.log("Selected Range: ", selectedDateRange.value);
    console.log("Days Array: ", days.value);
    updateFilteredDays();
  };
  
  // Обновление отображаемых дней на основе выбранного диапазона
  const updateFilteredDays = () => {
    const startIndex = days.value.findIndex(day => {
      return day.setHours(0, 0, 0, 0) === selectedDateRange.value[0].setHours(0, 0, 0, 0);
    });

    const endIndex = days.value.findIndex(day => {
      return day.setHours(0, 0, 0, 0) === selectedDateRange.value[1].setHours(0, 0, 0, 0);
    });

    console.error("startIndex " + startIndex);
    console.error("endIndex " + endIndex);


  if (startIndex === -1 || endIndex === -1) {
    console.error("Selected date range contains dates not found in days.");
    return;
  }

  filteredDays.value = days.value.slice(startIndex, endIndex + 1);
  console.log("Start Index:", startIndex);
  console.log("End Index:", endIndex);
  console.log("Filtered Days (before slice):", days.value);
  console.log("Filtered Days (after slice):", filteredDays.value);
};
  
const changeDayRange = (side, direction) => {
  const indexStart = days.value.indexOf(selectedDateRange.value[0]);
  const indexEnd = days.value.indexOf(selectedDateRange.value[1]);

  console.log("Current Range:", selectedDateRange.value); // Лог текущего диапазона

  if (side === 'left') {
    const newStartIndex = indexStart + direction;
    console.log("New Start Index:", newStartIndex);

    // Проверка, чтобы новый индекс начала не превышал индекс конца
    if (newStartIndex >= 0 && newStartIndex <= indexEnd) {
      selectedDateRange.value[0] = days.value[newStartIndex];
    }
  } else { // right
    const newEndIndex = indexEnd + direction;
    console.log("New End Index:", newEndIndex);

    // Проверка, чтобы новый индекс конца не был меньше индекса начала
    if (newEndIndex < days.value.length && newEndIndex >= indexStart) {
      selectedDateRange.value[1] = days.value[newEndIndex];
    }
  }
  
  updateFilteredDays(); // Обновляем отображение фильтрованных дней

  console.log("Updated Range:", selectedDateRange.value); // Лог обновленного диапазона
  console.log("Filtered Days:", filteredDays.value); // Лог отфильтрованных дней
};
  
  // Класс для выходных
  const getDayClass = (day) => {
    const dayOfWeek = day.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6 ? 'bg-warning' : '';
  };
  
  // Добавление нового продавца
  const addSeller = async () => {
    const newSeller = {
      name: `Продавец ${sellers.value.length + 1}`,
      schedule: [],
    };
  
    try {
      const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/sellers`, newSeller);
      sellers.value.push(response.data);
    } catch (error) {
      console.error('Ошибка при добавлении продавца:', error);
    }
  };
  
  // Функция закрытия модального окна
  const closeShiftTimeModal = () => {
    isShiftTimeModalOpen.value = false;
  };
  
  const incrementHour = (timeType) => {
    if (timeType === 'start') {
      if (shiftStart.value.hours < maxTime) {
        shiftStart.value.hours = (shiftStart.value.hours + 1) % 24;
      }
    } else {
      if (shiftEnd.value.hours < maxTime) {
        shiftEnd.value.hours = (shiftEnd.value.hours + 1) % 24;
      }
    }
  };
  
  const decrementHour = (timeType) => {
    if (timeType === 'start') {
      if (shiftStart.value.hours > minTime) {
        shiftStart.value.hours = (shiftStart.value.hours - 1 + 24) % 24;
      }
    } else {
      if (shiftEnd.value.hours > minTime) {
        shiftEnd.value.hours = (shiftEnd.value.hours - 1 + 24) % 24;
      }
    }
  };

// Сохранение смены
/*const saveShift = () => {
  const formattedDate = selectedDay.toISOString().split('T')[0];
  const shift = { date: formattedDate, shiftStart: shiftStart.value, shiftEnd: shiftEnd.value };

  const seller = sellers.value[selectedSellerIndex];
  const existingShiftIndex = seller.schedule.findIndex(s => s.date === formattedDate);

  if (existingShiftIndex !== -1) {
    seller.schedule[existingShiftIndex] = shift;
  } else {
    seller.schedule.push(shift);
  }

  updateSellerSchedule(seller);
  recalculateAll();

  //const modal = Modal.getInstance(document.getElementById('timeModal'));
  //modal.hide();
}; */
  
  // Сохранение смены
  const saveShift = () => {
    if (shiftStart.value && shiftEnd.value && selectedDay.value && selectedSellerIndex.value !== null) {
  
      const formattedDate = selectedDay.value.toLocaleDateString('en-CA'); // Используем формат "YYYY-MM-DD"
      console.log("Сохраняем дату:", formattedDate);
      const shift = { date: formattedDate, shiftStart: `${shiftStart.value.hours}`, shiftEnd: `${shiftEnd.value.hours}` };
      // Получаем текущего продавца
      const seller = sellers.value[selectedSellerIndex];
      if (!seller) {
      console.error('Продавец не найден по данному индексу:', selectedSellerIndex);
      return;
    }
      const existingShiftIndex = seller.schedule.findIndex(s => s.date === formattedDate);


  
      // Обновляем или добавляем смену
      if (existingShiftIndex !== -1) {
        seller.schedule[existingShiftIndex] = shift;
      } else {
        seller.schedule.push(shift);
      }
  
      // Обновляем расписание продавца
      updateSellerSchedule(seller);
      recalculateAll();
      closeShiftTimeModal();

    } else {
      alert('Пожалуйста, выберите корректное время и дату.');
    }
  };

/*const updateSellerSchedule = async (seller) => {
  try {
    await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, seller);
  } catch (error) {
    console.error('Ошибка при обновлении расписания:', error);
  }
}; */
  
  // Обновление расписания продавца
  const updateSellerSchedule = async (seller) => {
  try {
    await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, seller);
  } catch (error) {
    console.error('Ошибка при обновлении расписания:', error);
  }
};
  
  // Открытие модального окна для изменения имени
  /*const openEditSellerModal = (sellerIndex) => {
    console.log(sellerIndex);
    selectedSellerIndex = sellerIndex;
    editedSellerName.value = sellers.value[sellerIndex].name;
    //new Modal(document.getElementById('editSellerModal')).show();
  }; */
  
  // Сохранение измененного имени продавца
  /*const saveEditedSeller = async () => {
    sellers.value[selectedSellerIndex].name = editedSellerName.value;
    await updateSellerName(sellers.value[selectedSellerIndex]);
    
    recalculateAll();
  
    //const modal = Modal.getInstance(document.getElementById('editSellerModal'));
    //modal.hide();
  };*/
  
  // Обновление имени продавца
  /*const updateSellerName = async (seller) => {
    try {
      await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, seller);
    } catch (error) {
      console.error('Ошибка при обновлении имени продавца:', error);
    }
  };*/
  
  // Расчет общего количества часов за выбранный месяц
  const calculateTotalHours = (seller, selectedMonth) => {
    let totalHours = 0;
  
    seller.schedule.forEach(shift => {
      const shiftDate = new Date(shift.date);
      if (shiftDate.getMonth() === selectedMonth) {
        const start = new Date(`${shift.date}T${shift.shiftStart}:00`);
        const end = new Date(`${shift.date}T${shift.shiftEnd}:00`);
  
        if (!isNaN(start) && !isNaN(end)) {
          const hours = (end - start) / 3600000;
          totalHours += hours;
        }
      }
    });
  
    return Math.round(totalHours);
  };
  
  // Расчет общего количества смен
  const calculateTotalShifts = (seller, selectedMonth) => {
    let totalShifts = 0;
  
    seller.schedule.forEach(shift => {
      const shiftDate = new Date(shift.date);
      if (shiftDate.getMonth() === selectedMonth) {
        totalShifts++;
      }
    });
  
    return totalShifts;
  };
  
  // Получение смены для конкретного дня
  const getShiftForDay = (seller, day) => {
    const formattedDate = day.toISOString().split('T')[0];
    const shift = seller.schedule.find(shift => shift.date === formattedDate);
    let shiftHour = 0;
    if (shift) {
      shiftHour = shift.shiftEnd - shift.shiftStart; 
    }
  
    return shift ? `${shift.shiftStart} - ${shift.shiftEnd} (${shiftHour})` : '';
    //return shift ? `${shift.shiftStart} - ${shift.shiftEnd}` : '';
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
      return true;
    }
  
    const dayInMoscow = new Date(day.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
    const isToday = dayInMoscow.toDateString() === currentDateMoscow.toDateString();
  
    if (decodedToken.role === 'seller' && isToday && currentHourMoscow >= 11) {
      return true;
    }
  
    return false;
  };
  
  // Пересчет всех данных
  const recalculateAll = () => {
    sellers.value.forEach(seller => {
      totalHours.value[seller._id] = calculateTotalHours(seller, selectedMonth.value);
      totalShifts.value[seller._id] = calculateTotalShifts(seller, selectedMonth.value);
    });
  };
  
  
  /*const confirmDeleteSeller = (sellerIndex) => {
    sellerIndexToDelete.value = sellerIndex;  // Запоминаем индекс продавца
    console.log('Индекс продавца для удаления:', sellerIndexToDelete.value);
    const modal = new Modal(document.getElementById('confirmDeleteModal'));
    modal.show();  // Показываем модальное окно
  };*/
  
  /*const deleteSeller = async () => {
    console.log('sellerIndexToDelete:', sellerIndexToDelete.value);
    console.log('sellers array:', sellers.value);
    if (sellerIndexToDelete.value !== null) {
      try {
        const seller = sellers.value[sellerIndexToDelete.value];  // Получаем нужного продавца
        await axios.delete(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`);
        
        // Удаляем продавца из локального массива
        sellers.value.splice(sellerIndexToDelete.value, 1);
        
        // Очищаем индекс после удаления
        sellerIndexToDelete.value = null;
        
        // Закрываем модальное окно
        //const modal = Modal.getInstance(document.getElementById('confirmDeleteModal'));
        //modal.hide();
      } catch (error) {
        console.error('Ошибка при удалении продавца:', error);
      }
    }
  };*/
  
  // Наблюдение за изменением диапазона дат и обновление таблицы
  watch(selectedDateRange, (newValue, oldValue) => {
    if (newValue[0] !== oldValue[0] || newValue[1] !== oldValue[1]) {
      if (newValue[0] && newValue[1]) {
        recalculateAll();
      }
    }
  });
  
  // Наблюдение за изменением месяца
  watch(selectedMonth, () => {
    generateCalendar();
    recalculateAll();
  });
  
  // Загрузка данных при монтировании
  onMounted(async () => {
    await fetchSellers();
    generateCalendar();
  });
  
  // Защита маршрутов
  /*router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    console.log("Token is " + token);
    if (!token) {
      next({ name: 'login' });
    } else {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role !== 'seller') {
        next({ name: 'forbidden' });
      } else {
        next(); 
      }
    }
  });*/

// Обновление расписания продавца


// Открытие модального окна для изменения имени
/*const openEditSellerModal = (sellerIndex) => {
  console.log(sellerIndex);
  selectedSellerIndex = sellerIndex;
  editedSellerName.value = sellers.value[sellerIndex].name;
  //new Modal(document.getElementById('editSellerModal')).show();
}; */

// Сохранение измененного имени продавца
/*const saveEditedSeller = async () => {
  sellers.value[selectedSellerIndex].name = editedSellerName.value;
  await updateSellerName(sellers.value[selectedSellerIndex]);
  
  recalculateAll();

  //const modal = Modal.getInstance(document.getElementById('editSellerModal'));
  //modal.hide();
};*/

// Обновление имени продавца
/*const updateSellerName = async (seller) => {
  try {
    await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, seller);
  } catch (error) {
    console.error('Ошибка при обновлении имени продавца:', error);
  }
};*/

  </script>
  <style scoped>
  .custom-btn:hover {
    background-color: black !important;
    color: white !important;
  }
  </style>