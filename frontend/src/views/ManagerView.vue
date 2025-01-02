<template>
  <v-app class="my-app">
    <v-app-bar app class="pa-0 mb-0 custom-bg" elevation="1">
      <v-row class="flex items-center" align="center" no-gutters>
        <!-- Левый блок: Стрелки с месяцем, стрелки с началом и концом месяца -->
        <v-col class="d-flex align-center" cols="auto">
          <!-- Стрелки с месяцем -->
          <v-btn @click="changeMonth(-1)" icon rounded="0" size="small"
            class="purple-btn text-gray-300 hover:text-black transition-colors duration-300">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span class="text-gray-600 text-xl px-3 py-1">
            {{ months[store.selectedMonth] }} {{ currentYear }}
          </span>
          <v-btn @click="changeMonth(1)" icon rounded="0" size="small"
            class="purple-btn text-gray-300 hover:text-black transition-colors duration-300">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>

        <!-- Стрелки с началом и концом месяца -->
        <v-col class="d-flex align-center" cols="auto">
          <!-- Стрелки для начала месяца -->
          <v-btn @click="changeDayRange('left', -1)" icon rounded="0" size="small"
            class="purple-btn text-gray-300 hover:text-black transition-colors duration-300">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span class="text-gray-600 text-xl px-3 py-1">
            {{ leftDay }}
          </span>
          <v-btn @click="changeDayRange('left', 1)" icon rounded="0" size="small"
            class="purple-btn text-gray-300 hover:text-black transition-colors duration-300">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <!-- Стрелки для конца месяца -->
          <v-btn @click="changeDayRange('right', -1)" icon rounded="0" size="small"
            class="purple-btn text-gray-300 hover:text-black transition-colors duration-300">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span class="text-gray-600 text-xl px-3 py-1">
            {{ rightDay }}
          </span>
          <v-btn @click="changeDayRange('right', 1)" icon rounded="0" size="small"
            class="purple-btn text-gray-300 hover:text-black transition-colors duration-300">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>

        <v-spacer></v-spacer>

        <!-- Центр: Название магазина -->
        <v-col class="d-flex align-center" cols="auto">
          <span class="display-1 text-h4">{{ shopName }}</span>
        </v-col>

        <v-spacer></v-spacer>

        <!-- Правый блок -->
        <v-col class="d-flex align-center" cols="auto">
          <!-- Кнопка Выбор продавца -->
          <v-btn v-if="isAdmin" @click="selectShop"
            class="purple-btn text-gray-300 hover:text-black transition-colors duration-300" outlined icon
            style="width: 200px;">
            <span class="text-s font-semibold">Выбор магазина</span>
          </v-btn>
          <!-- Кнопка + Продавец -->
          <v-btn @click="addNewSeller" class="purple-btn text-gray-300 hover:text-black transition-colors duration-300"
            outlined icon style="width: 150px;">
            <v-icon left>mdi-plus</v-icon>
            <span class="text-s font-semibold">Продавец</span>
          </v-btn>
          <!-- Кнопка Выйти -->
          <v-btn @click="logout" class="purple-btn text-gray-300 hover:text-black transition-colors duration-300"
            outlined icon style="width: 100px;">
            <span class="text-s font-semibold">Выйти</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <ShiftForm />

    <PaymentsForm />

    <SellerForm />

  </v-app>

</template>

<script setup>
import { jwtDecode } from 'jwt-decode';
import { ref, onMounted, watch } from 'vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/stores/store';
import axios from 'axios';

import SellerForm from '@/components/SellerForm.vue';
import ShiftForm from '@/components/ShiftForm.vue';
import PaymentsForm from '@/components/PaymentsForm.vue';

const router = useRouter();
const store = useStore();

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const pinnedSellers = computed({
  get: () => store.pinnedSellers,
  set: (value) => {
    store.pinnedSellers = value;
  },
});

let selectedDateRange = ref([null, null]);
const filteredDays = computed({
  get: () => store.filteredDays,
  set: (value) => {
    store.filteredDays = value;
  },
});
const currentYear = ref(new Date().getFullYear());
const days = ref([]);
// const sellers = ref([]);

const isAdmin = ref(false);
const totalHours = ref({});
const totalShifts = ref({});








const shopName = ref('');
//const sellerIndexToDelete = ref(null);

// Числа для диапазона дней
// Логика для отображения текущих дней слева и справа
const leftDay = computed(() => selectedDateRange.value[0]?.getDate() || 'N/A');
const rightDay = computed(() => selectedDateRange.value[1]?.getDate() || 'N/A');

const searchQuery = ref(''); // Запрос для поиска

// Метод для открытия диалога добавления нового продавца
function addNewSeller() {
  store.isAddNewSeller = true;
  loadSellers();
}

// Функция для фильтрации опций на основе введенного текста
const filterOptions = (query) => {
  // Ваши данные для фильтрации

  const options = [
    { name: 'Option 1', value: 1 },
    { name: 'Option 2', value: 2 },
    { name: 'Option 3', value: 3 },
  ];

  return options.filter(option =>
    option.name.toLowerCase().includes(query.toLowerCase())
  );
};

const loadSellers = async () => {
  try {
    const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/sellers`);
    store.updateFilteredSellers(response.data.map((seller) => ({
      name: seller.name,
      user_id: seller._id,
      schedule: seller.schedule,
      result: seller.result
    })));
  } catch (error) {
    console.error('Ошибка при загрузке продавцов: ', error);
  }
}


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


// Генерация календаря
const generateCalendar = () => {
  const year = currentYear.value;
  const month = store.selectedMonth;
  const date = new Date(year, month, 1);
  store.selectedYear = currentYear;
  days.value = [];

  while (date.getMonth() === month) {
    days.value.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  // Установить начальный диапазон как первый и последний день месяца
  selectedDateRange.value = [...[days.value[0], days.value[days.value.length - 1]]];
  updateFilteredDays();
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
const workSellerNewMonth = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_URL}/api/sellers`
    );
    // eslint-disable-next-line
    const updatedSellers = response.data.map((seller) => ({
      ...seller,
      result: [
        ...seller.result,
        {
          month: String(store.selectedMonth),
          year: String(store.selectedYear), // seller.result?.received5to7 ?? 0,
          month_hours: 0,
          month_shifts: 0,
          points_57: -1,
          points_1517: 0,
          points_2527: 0,
          points_yamarket: 0,
          points_ozonmarket: 0,
        },
      ],
    }));

    //добавить фильтр и потом в workingSellers

    /* workingMonthSellers.value = updatedSellers
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

    await updatedSellers.map(updateSellerResult);
    console.log(updatedSellers) */
    // workingSellers.value = [];
    // workingSellers.value = updatedSellers;
    //await fetchWorkingSellers();

    // Обновляем состояние

    //this.workingSellers = updatedSellers;
  } catch (error) {
    console.error("Ошибка при добавлении нового месяца продавцам:", error);
  }
}



// Функция для изменения месяца
const changeMonth = async (direction) => {
  store.selectedMonth += direction;
  if (store.selectedMonth < 0) {
    store.selectedMonth = 11; // Переход на декабрь
    currentYear.value--; // Уменьшаем год
  } else if (store.selectedMonth > 11) {
    store.selectedMonth = 0; // Переход на январь
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

const checkRole = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);

  if (decodedToken.role === 'admin') {
    isAdmin.value = true;
  }

}

// eslint-disable-next-line
const recalculateAll = () => {
  pinnedSellers.value.forEach(seller => {
    totalHours.value[seller._id] = calculateTotalHours(seller, store.selectedMonth);
    totalShifts.value[seller._id] = calculateTotalShifts(seller, store.selectedMonth);
  });
  console.log(pinnedSellers.value);
};

// Слушаем изменения в searchQuery и фильтруем опции
watch(searchQuery, (newQuery) => {
  filterOptions.value = filterOptions(newQuery);
});

// Наблюдение за изменением диапазона дат и обновление таблицы
/* watch(selectedDateRange, (newValue, oldValue) => {
  console.log(selectedDateRange.value);
  if (newValue[0] !== oldValue[0] || newValue[1] !== oldValue[1]) {
    if (newValue[0] && newValue[1]) {
      console.log(selectedDateRange.value);
    }
  }
}); */

watch(() => selectedDateRange.value, () => {
  updateFilteredDays();
}, { deep: true }
);

/*watch(store.isAddN, ewSeller, (newVal) => {
   if (newVal) {
     loadSellers(); 
   }
 });
 
 // Наблюдение за изменением месяца
 watch(store.selectedMonth, () => {
   generateCalendar();
   recalculateAll();
 }); */

// Загрузка данных при монтировании
onMounted(async () => {
  generateCalendar();
  getName();
  checkRole();
  store.selectedMonth = ref(new Date().getMonth());
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (isAuthenticated) {
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    if (to.name === 'login') {
      if (role === 'admin') {
        next({ name: 'admin' });
      } else {
        next({ name: 'seller' });
      }
    } else if (role === 'admin' && to.name === 'admin') {
      next();
    } else if (role !== 'admin' && to.name === 'admin') {
      next({ name: 'forbidden' });
    } else {
      next();
    }
  } else {
    // Если не авторизован и не пытается зайти на login или forbidden, перенаправляем на forbidden
    if (to.name !== 'login' && to.name !== 'forbidden') {
      next({ name: 'forbidden' });
    } else {
      next();
    }
  }
});

// Обновление расписания продавца
</script>

<style scoped>

.purple-btn {
  /*border: 2px solid #413E4F;  Цвет и толщина обводки */
  color: #413E4F;
  border-radius: 20px;
  /* Закругление углов */
  box-shadow: none;
}

.purple-btn:hover {
  /* border: 2px solid #413E4F;  Цвет и толщина обводки */
  background-color: #E5E4E7;
  color: #413E4F;
  border-radius: 20px;
  /* Закругление углов */
  box-shadow: none;
}

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
