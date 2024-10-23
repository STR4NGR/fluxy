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
      <span class="text-gray-800 text-3xl"> {{ shopName  }} </span> 
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

         <!-- Кнопка Выбор продавца -->
         <button 
          v-if="isAdmin"
          @click="selectShop"  
          class="custom-btn ml-4 font-semibold text-s text-black px-3 py-1 border border-gray-300 rounded-md hover:bg-black hover:text-white transition-colors duration-300"
        >
          Выбор продавца
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
      <table class="min-w-full table-auto border-collapse border border-gray-300 text-center text-xs" style="table-layout: fixed;">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 py-2 text-gray-700 font-semibold bg-gray-200 z-10" style="width: 150px;">Продавец</th>
            <th class="border border-gray-300 py-2" style="width: 150px;">Общее количество часов</th>
            <th class="border border-gray-300 py-2" style="width: 150px;">Общее количество смен</th>
            <th
              v-for="(day, index) in filteredDays"
              :key="index"
              :class="getDayClass(day)"
              class="border border-gray-300 py-2"
              style="width: 100px;">
              {{ day.getDate() }}<br>({{ day.toLocaleDateString('ru-RU', { weekday: 'short' }) }})<br>{{ calculateTotalHoursForDay(day) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(seller, sellerIndex) in sellers" :key="sellerIndex" class="border-t-4 border-gray-400">
            <!-- Имя продавца -->
            <td
              @click="openEditSellerModal(sellerIndex)"
              class="cursor-pointer py-4 px-3 bg-gray-100 border-r border-gray-300 font-semibold text-center"
              title="Нажмите, чтобы редактировать"
              style="width: 150px;">
              {{ seller.name }}
            </td>

            <!-- Общее количество часов -->
            <td class="text-sm border border-gray-300" style="width: 150px;">
              {{ calculateTotalHours(seller, selectedMonth) }}
            </td>

            <!-- Общее количество смен -->
            <td class="text-sm border border-gray-300" style="width: 150px;">
              {{ calculateTotalShifts(seller, selectedMonth) }}
            </td>

            <!-- Ячейки для каждого дня -->
            <td
              v-for="(day, index) in filteredDays"
              :key="index"
              class="border border-gray-300 p-0"
              style="height: 100%; width: 100px;">
              <div class="flex items-center justify-center w-full h-full">
                <!-- Кнопка для каждой ячейки -->
                <button
                  class="custom-cellflex-grow h-full w-full py-1 px-1 bg-white border border-gray-300 text-sm"
                  :class="getCellClass(day, seller._id)" 
                  :style="getCellStyle(day)" 
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

  <div class="container mt-6">
  <div class="bg-white p-6 rounded-lg">
    <div class="overflow-x-auto mt-3">
      <table class="min-w-full table-auto border-collapse border border-gray-300 text-center text-xs" style="table-layout: fixed;">
        <thead>
          <tr class="bg-gray-200">
            <th colspan="6" class="border border-gray-300 py-2"></th>
            <th colspan="2" class="border border-gray-300 py-2 text-xl" style="width: 200px;">Минус два месяца</th>
            <th colspan="1" class="border border-gray-300 py-2"></th>
          </tr>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 py-2 text-gray-700 font-semibold" style="width: 150px;">Продавец</th>
            <th class="border border-gray-300 py-2" style="width: 150px;">Всего часов</th>
            <th class="border border-gray-300 py-2" style="width: 150px;">Всего смен</th>
            <th colspan="1" class="border border-gray-300 py-2" style="width: 200px;">Получено с 5 по 7</th>
            <th colspan="1" class="border border-gray-300 py-2" style="width: 200px;">Получено с 15 по 17</th>
            <th colspan="1" class="border border-gray-300 py-2" style="width: 200px;">Получено с 25 по 27</th>
            <th colspan="1" class="border border-gray-300 py-2" style="width: 200px;">ЯМаркет</th>
            <th colspan="1" class="border border-gray-300 py-2" style="width: 200px;">Озон</th>
            <th class="border border-gray-300 py-2" style="width: 100px;">Итого</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(seller, sellerIndex) in sellers" :key="sellerIndex" class="border-t-4 border-gray-400">
            <td class="py-4 px-3 bg-gray-100 border-r border-gray-300 font-semibold text-center" style="width: 150px;">
              {{ seller.name }}
            </td>
            <td class="text-sm border border-gray-300" style="width: 150px;">
              {{ calculateTotalHours(seller, selectedMonth) }}
            </td>
            <td class="text-sm border border-gray-300" style="width: 150px;">
              {{ calculateTotalShifts(seller, selectedMonth) }}
            </td>
            <td class="text-sm border border-gray-300" style="width: 150px;">
              <input type="number" 
              v-model="seller.result.received5to7"
              min="0"
              @input="saveCalculation(seller)"
              class="w-full text-center" />
            </td>
            <td class="text-sm border border-gray-300" style="width: 150px;">
              <input type="number" 
              v-model="seller.result.received15to17" 
              min="0"
              @input="saveCalculation(seller)"
              class="w-full text-center" />
            </td>
            <td class="text-sm border border-gray-300" style="width: 150px;">
              <input type="number" 
              v-model="seller.result.received25to27" 
              min="0"
              @input="saveCalculation(seller)"
              class="w-full text-center" />
            </td>
            <td class="text-sm border border-gray-300" style="width: 150px;">
              <input type="number" 
              v-model="seller.result.receivedYaMarket" 
              min="0"
              @input="saveCalculation(seller)"
              class="w-full text-center" />
            </td>
            <td class="text-sm border border-gray-300" style="width: 150px;">
              <input type="number" 
              v-model="seller.result.receivedOzonMarket"
              min="0"
              @input="saveCalculation(seller)" 
              class="w-full text-center" />
            </td>
            <td class="text-sm border border-gray-300" style="width: 150px;">
              {{ calculateTotalReceived(seller) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
            <v-btn color="red" @click="deleteSeller">Удалить продавца</v-btn>
            <v-btn @click="closeEditSellerModal">Отмена</v-btn>
            <v-btn color="primary" @click="saveEditedSeller">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  
    <v-container>
      <v-dialog v-model="isShiftTimeModalOpen" persistent max-width="500px">
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
          <v-btn v-if="isAdmin" color="primary" @click="saveShift('clear')">Очистить</v-btn>
          <v-card-actions>
            <v-btn v-if="!isShiftExist" color="red" @click="saveShift('holiday', null, null)">Отдыхаю</v-btn>
            <v-btn v-if="!isShiftExist" color="green" @click="saveShift('workday', null, null)">Работаю</v-btn>
            <v-btn @click="closeShiftTimeModal">Отмена</v-btn>
            <v-btn color="primary" @click="saveShift('workday', shiftStart.hours, shiftEnd.hours)">Подтвердить время</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div> 
  
  </template>
  
  <script setup>
  import { jwtDecode } from 'jwt-decode';
  import { ref, onMounted, watch } from 'vue';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';      
  
  const router = useRouter();
  
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
  const isShiftExist = ref(false);
  const isAdmin = ref(false);
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

  const shopName = ref('');
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
    isShiftTimeModalOpen.value = true;
    const formattedDate = selectedDay.value.toLocaleDateString('en-CA'); // Используем формат "YYYY-MM-DD"

    // Получаем текущего продавца
    const seller = sellers.value[selectedSellerIndex];
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
  
  // Закрытие модального окна
  const closeEditSellerModal = () => {
    isEditSellerModalOpen.value = false;
  };

  // Метод для определения класса цвета ячейки
  const getCellClass = (day, sellerId) => {
    const formattedDate = day.toLocaleDateString('en-CA'); // Используем формат "YYYY-MM-DD"
    const seller = sellers.value.find(seller => seller._id === sellerId);
    const colorIndex = seller?.schedule.findIndex(s => s.date === formattedDate);
    let color = colorIndex !== -1 ? seller.schedule[colorIndex].preshift : ''; // Добавлено получение цвета

    // Возвращаем класс в зависимости от цвета
    return {
      'bg-red': color === 'holiday',
      'bg-green': color === 'workday',
      'solo': color === 'soloday',
      'bg-white': !color,  // Если цвет не выбран, оставляем белый фон
    };
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


  const saveCalculation = async (seller) => {
  try {
    if (!seller) {
      console.error('Продавец не найден по данному индексу:', selectedSellerIndex);
      return;
    }

    // Обновляем только поля внутри объекта result
    seller.result = {
      ...seller.result,  // сохраняем существующие поля внутри result
      received5to7: seller.result?.received5to7 ?? 0,
      received15to17: seller.result?.received15to17 ?? 0,
      received25to27: seller.result?.received25to27 ?? 0,
      receivedYaMarket: seller.result?.receivedYaMarket ?? 0,
      receivedOzonMarket: seller.result?.receivedOzonMarket ?? 0
    };

    // Теперь вызываем обновление продавца в базе данных или в хранилище
    updateSellerSchedule(seller);
    
  } catch (error) {
    console.error('Ошибка при сохранении данных:', error);
  }
};

  const calculateTotalReceived = (seller) => {
  return (seller.result?.received5to7 ?? 0) +
         (seller.result?.received15to17 ?? 0) +
         (seller.result?.received25to27 ?? 0) +
         (seller.result?.receivedYaMarket ?? 0) +
         (seller.result?.receivedOzonMarket ?? 0);
        };

  const saveShift = (dayType, startShift, endShift) => {
    if (selectedDay.value && selectedSellerIndex.value !== null) {
      const formattedDate = selectedDay.value.toLocaleDateString('en-CA');
      const seller = sellers.value[selectedSellerIndex];

      if (!seller) {
        console.error('Продавец не найден по данному индексу:', selectedSellerIndex);
        return;     
      }

      let sellerSoloDay = sellers.value.filter(seller => 
        seller.schedule.some(
          shift => shift.date === formattedDate && 
            (shift.preshift === 'soloday'))).length;
      
      let sellerWorkDay = sellers.value.filter(seller => 
        seller.schedule.some(
          shift => shift.date === formattedDate && 
            (shift.preshift === 'workday'))).length;

      const currentShift = seller.schedule.find(s => s.date === formattedDate);
      const existingShiftIndex = seller.schedule.findIndex(s => s.date === formattedDate);

      const shift = { date: formattedDate,   
        preshift: dayType};

      switch (dayType) {
        case 'holiday':
          if (sellerWorkDay == 2) {
            if ((currentShift) && (currentShift.preshift === 'workday')) {
                delete shift.shiftStart;
                delete shift.shiftEnd;
                shift.preshift = 'holiday';
                updateCalendarShifts('workday', 'soloday');
            } 
          }
          break;
          case 'workday':
            if (sellerWorkDay < 1) {
              if ((sellerSoloDay >= 1)) {
                if ((currentShift) && (currentShift.preshift === 'soloday')) {
                  if ((startShift === null) && (endShift === null)) {
                    delete shift.shiftStart;
                    delete shift.shiftEnd;
                    shift.preshift = 'soloday';
                  } else if ((startShift !== null) && (endShift !== null)) {
                    shift.shiftStart = startShift;
                    shift.shiftEnd = endShift;
                    shift.preshift = 'soloday'   
                  }
                } else {
                  if ((startShift === null) && (endShift === null)) {
                    delete shift.shiftStart;
                    delete shift.shiftEnd;
                    shift.preshift = 'workday';
                  } else if ((startShift !== null) && (endShift !== null)) {
                    shift.shiftStart = startShift;
                    shift.shiftEnd = endShift;
                    shift.preshift = 'workday'   
                  }
                updateCalendarShifts('soloday', 'workday');
                }
              } else {
                if ((startShift === null) && (endShift === null)) {
                  delete shift.shiftStart;
                  delete shift.shiftEnd;
                  shift.preshift = 'soloday';
                  } else if ((startShift !== null) && (endShift !== null)) {
                    shift.shiftStart = startShift;
                    shift.shiftEnd = endShift;
                    shift.preshift = 'soloday'
                  }
              }
            } else {
              if ((startShift === null) && (endShift === null)) {
                delete shift.shiftStart;
                delete shift.shiftEnd;
                shift.preshift = 'workday';
              } else if ((startShift !== null) && (endShift !== null)) {
                shift.shiftStart = startShift;
                shift.shiftEnd = endShift;
                shift.preshift = 'workday'   
              }
            }
            break;
            case 'clear':
              if (sellerWorkDay == 2) {
                if ((currentShift) && (currentShift.preshift === 'workday')) {
                  if ((startShift === null) && (endShift === null)) {
                    delete shift.shiftStart;
                    delete shift.shiftEnd;
                    shift.preshift = '';
                  } else if ((startShift !== null) && (endShift !== null)) {
                    shift.shiftStart = startShift;
                    shift.shiftEnd = endShift;
                    shift.preshift = '';
                  }
                  updateCalendarShifts('workday', 'soloday');
                }
              }
            break
            default:
            break;
          }

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
    }
  }

  const checkCalendarShift = () => {
    const formattedDate = selectedDay.value ? selectedDay.value.toLocaleDateString('en-CA') : null;
    const sellerWorkDay = sellers.value.filter(seller =>
      seller.schedule.some(shift => shift.date === formattedDate && (shift.preshift === 'workday'))
    ).length;

    if (sellerWorkDay === 1) {
      sellers.value.forEach(seller => {
      seller.schedule.forEach((shift, index) => {
      if (shift.date === formattedDate && shift.preshift === 'workday') {
        const preshift = { date: formattedDate, preshift: 'soloday' };
        seller.schedule[index] = preshift;
        updateSellerSchedule(seller);
      }
    });
  }); 
    }
    
  }

  const updateCalendarShifts = (fromShift, toShift) => {
  const formattedDate = selectedDay.value.toLocaleDateString('en-CA'); // Используем формат "YYYY-MM-DD"
  
  sellers.value.forEach(seller => {
    seller.schedule.forEach((shift, index) => {
      // Проверяем смены на совпадение с выбранной датой и типом fromShift
      if (shift.date === formattedDate && shift.preshift === fromShift) {
        
        // Копируем текущий shift, чтобы избежать перезаписи данных
        const updatedShift = { ...shift }; 
        
        // Меняем тип смены на toShift
        updatedShift.preshift = toShift;
        
        // Только если в текущей смене есть время, сохраняем его
        if (shift.shiftStart && shift.shiftEnd) {
          updatedShift.shiftStart = shift.shiftStart;
          updatedShift.shiftEnd = shift.shiftEnd;
        } else {
          // Если времени нет, удаляем старые значения времени
          delete updatedShift.shiftStart;
          delete updatedShift.shiftEnd;
        }

        // Обновляем конкретную смену в расписании
        seller.schedule[index] = updatedShift;

        // Обновляем расписание продавца
        updateSellerSchedule(seller);
      }
    });
  });
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
    const userId = localStorage.getItem('id'); // Получаем userID
    try {
      const seller = sellers.value[selectedSellerIndex];
      
      // Отправляем запрос на удаление продавца
      await axios.delete(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, {
        data: { userID: userId } // Передаем userID в теле запроса
      });

      // Удаляем продавца из локального массива только после успешного ответа
      sellers.value.splice(selectedSellerIndex, 1);

      recalculateAll();
      checkCalendarShift();
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
      const userId = localStorage.getItem('id');
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/sellers`, {
      params: { userId } // Pass user ID as a query parameter (if your API accepts it)
    });
      sellers.value = response.data.map(seller => ({
      ...seller, // сохраняем все существующие поля продавца
      result: {
        ...seller.result, // работаем с полями внутри result
        received5to7: seller.result?.received5to7 ?? 0,
        received15to17: seller.result?.received15to17 ?? 0,
        received25to27: seller.result?.received25to27 ?? 0,
        receivedYaMarket: seller.result?.receivedYaMarket ?? 0,
        receivedOzonMarket: seller.result?.receivedOzonMarket ?? 0
      }
    }));
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

// Получение названия магазина
const getName = () => {
  const name = localStorage.getItem('name'); 
  shopName.value = name;
};

  //Выход из системы
  const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('id');
      router.push({ path: '/' });
  };

    //Выбор магазина
    const selectShop = () => {
      router.push({ name: 'admin' });
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

  if (startIndex === -1 || endIndex === -1) {
    console.error("Selected date range contains dates not found in days.");
    return;
  }

  filteredDays.value = days.value.slice(startIndex, endIndex + 1);
};
  
const changeDayRange = (side, direction) => {
  const indexStart = days.value.indexOf(selectedDateRange.value[0]);
  const indexEnd = days.value.indexOf(selectedDateRange.value[1]);

  if (side === 'left') {
    const newStartIndex = indexStart + direction;

    // Проверка, чтобы новый индекс начала не превышал индекс конца
    if (newStartIndex >= 0 && newStartIndex <= indexEnd) {
      selectedDateRange.value[0] = days.value[newStartIndex];
    }
  } else { // right
    const newEndIndex = indexEnd + direction;

    // Проверка, чтобы новый индекс конца не был меньше индекса начала
    if (newEndIndex < days.value.length && newEndIndex >= indexStart) {
      selectedDateRange.value[1] = days.value[newEndIndex];
    }
  }
  
  updateFilteredDays(); // Обновляем отображение фильтрованных дней
};
  
  // Класс для выходных
  const getDayClass = (day) => {
    const dayOfWeek = day.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6 ? 'holiday' : '';
  };
  
  // Добавление нового продавца
  const addSeller = async () => {
    const userId = localStorage.getItem('id');
    const newSeller = {
      userID: userId,
      name: `Продавец ${sellers.value.length + 1}`,
      schedule: [],
      result: {
        received5to7: 0,
        received15to17: 0,
        received25to27: 0,
        receivedYaMarket: 0,
        receivedOzonMarket: 0
      } 
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
  
  // Обновление расписания продавца
  const updateSellerSchedule = async (seller) => {
  try {
    await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, seller);
  } catch (error) {
    console.error('Ошибка при обновлении расписания:', error);
  }
};

// Расчет общего количества часов за выбранный день для всех продавцов
const calculateTotalHoursForDay = (selectedDate) => {
  let totalHours = 0;
  const targetDate = new Date(selectedDate).setHours(0, 0, 0, 0); // Установка времени на начало дня

  sellers.value.forEach(seller => {
    seller.schedule.forEach(shift => {
      const shiftDate = new Date(shift.date).setHours(0, 0, 0, 0); // Установка времени на начало дня
      if (shiftDate === targetDate) {
        const start = shift.shiftStart;
        const end = shift.shiftEnd;

        if (!isNaN(start) && !isNaN(end)) {
          const hours = (end - start);
          totalHours += hours;
        }
      }
    });
  });

  return Math.round(totalHours);
};
  
  // Расчет общего количества часов за выбранный месяц
  const calculateTotalHours = (seller, selectedMonth) => {
    let totalHours = 0;
    seller.schedule.forEach(shift => {
      const shiftDate = new Date(shift.date);
      if (shiftDate.getMonth() === selectedMonth) {
        const start = shift.shiftStart;
        const end = shift.shiftEnd;

        if (!isNaN(start) && !isNaN(end)) {
          const hours = (end - start);
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
      if ((shiftDate.getMonth() === selectedMonth) && (shift.shiftStart != null)) {
        totalShifts++;
      }
    });
  
    return totalShifts;
  };
  
  // Получение смены для конкретного дня
  const getShiftForDay = (seller, day) => {
    const formattedDate = day.toLocaleDateString('en-CA');
    const shift = seller.schedule.find(shift => shift.date === formattedDate);
    let shiftForDay = '';
    let shiftHour = 0;
    if (shift) {
      shiftHour = shift.shiftEnd - shift.shiftStart; 
      shiftForDay = `${shift.shiftStart} - ${shift.shiftEnd} (${shiftHour})`;
    }

    if (shift?.shiftStart === undefined || shift?.shiftEnd === undefined) {
      shiftForDay = '';
    }
  
    return shiftForDay;
    //return shift ? `${shift.shiftStart} - ${shift.shiftEnd}` : '';
  };

  const checkRole = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    if (decodedToken.role === 'admin') {
      isAdmin.value = true;
    }

  }
  
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
  
  // Пересчет всех данных
  const recalculateAll = () => {
    sellers.value.forEach(seller => {
      totalHours.value[seller._id] = calculateTotalHours(seller, selectedMonth.value);
      totalShifts.value[seller._id] = calculateTotalShifts(seller, selectedMonth.value);
    });
  };
  
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
    getName();
    checkRole();
  });
  
  router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (!isAuthenticated && to.name !== 'login') {
    next({ name: 'login' });
  } else if (isAuthenticated && to.name === 'login') {
    next({ name: 'admin' });
  } else {
    next();
  }
});

// Обновление расписания продавца
  </script>

  <style scoped>
  .custom-btn:hover {
    background-color: black !important;
    color: white !important;
  }
  .custom-cell {
    all: unset; /* Убирает все стили */
    /* Дополнительные стили для этой ячейки */
  }
.holiday {
  background-color: #D1D5DB !important;
}
.solo {
    background-color: orange !important; /* Цвет фона как у bg-gray-500 */
    position: relative; /* Для позиционирования псевдоэлемента */
    padding: 40px; /* Добавляем отступы для размещения иконки */
    text-align: center; /* Центрируем текст и иконку */
}

.solo::before {
    content: ""; /* Пустое содержимое для псевдоэлемента */
    display: inline-block; /* Отображаем как блочный элемент */
    width: 24px; /* Ширина иконки */
    height: 24px; /* Высота иконки */
    /* background-image: url('https://www.svgrepo.com/show/152241/exclamation-mark-inside-a-circle.svg'); */
    background-size: contain; /* Масштабирование изображения, чтобы оно помещалось внутри */
    background-repeat: no-repeat; /* Отключить повторение изображения */
    position: absolute; /* Позволяет размещать иконку */
    top: 50%; /* Центрирование по вертикали */
    left: 50%; /* Центрирование по горизонтали */
    transform: translate(-50%, -50%); /* Центрирование иконки */
}
  </style>