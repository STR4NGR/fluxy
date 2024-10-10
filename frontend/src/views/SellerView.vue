<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-4">
        <label for="month-select">Выберите месяц:</label>
        <select v-model="selectedMonth" @change="generateCalendar" id="month-select" class="form-select form-select-sm">
          <option v-for="(month, index) in months" :key="index" :value="index">
            {{ month }}
          </option>
        </select>
      </div>
    </div>

    <div class="table-responsive mt-3" v-if="days.length">
      <table class="table table-bordered table-sm text-center" style="font-size: 12px; min-width: 800px;">
        <thead>
          <tr>
            <th class="position-relative">
              Продавец
              <button class="btn btn-sm btn-primary" @click="addSeller" style="transform: translate(0%, 0%);">
                +
              </button>
            </th>
            <th v-for="(day, index) in days" :key="index" :class="getDayClass(day)" style="width: 40px;">
              {{ day.getDate() }}<br>({{ day.toLocaleDateString('ru-RU', { weekday: 'short' }) }})
            </th>
            <th>Общее количество часов</th>
            <th>Общее количество смен</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(seller, sellerIndex) in sellers" :key="sellerIndex">
            <td 
              @click="openEditSellerModal(sellerIndex)" 
              class="seller-name" 
              style="cursor: pointer;"
              title="Нажмите, чтобы редактировать">
              {{ seller.name }}
            </td>
            <td v-for="(day, index) in days" :key="index">
              <button 
                class="btn btn-light btn-sm w-100 p-1" 
                @click.stop="openTimePicker(sellerIndex, day)" 
                :disabled="isCellLocked(day)">
                {{ getShiftForDay(seller, day) || '0' }}
              </button>
            </td>
            <td>{{ calculateTotalHours(seller, selectedMonth) }}</td>
            <td>{{ calculateTotalShifts(seller, selectedMonth) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для выбора времени смены -->
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
    </div>

    <!-- Модальное окно для редактирования продавца -->
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
  </div>

    <!-- Модальное окно подтверждения удаления -->
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
    </div>
  </div>

</template>

<script setup>
import { jwtDecode } from 'jwt-decode';
import { ref, onMounted, watch } from 'vue';  
//import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

//const router = useRouter();

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const selectedMonth = ref(new Date().getMonth());
const days = ref([]);
const sellers = ref([]);
const shiftStart = ref('09');
const shiftEnd = ref('19');
let selectedSellerIndex = null;
let selectedDay = null;
const editedSellerName = ref('');

// Текущая дата для проверки
const currentDate = new Date();

const totalHours = ref({});
const totalShifts = ref({});
const sellerIndexToDelete = ref(null);

// Получение продавцов с сервера
const fetchSellers = async () => {
  try {
    const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/sellers`);
    sellers.value = response.data;
    recalculateAll(); // Пересчет часов и смен после загрузки продавцов
  } catch (error) {
    console.error('Ошибка при получении продавцов:', error);
  }
};

// Генерация календаря
const generateCalendar = () => {
  const year = new Date().getFullYear();
  const month = selectedMonth.value;
  const date = new Date(year, month, 1);
  days.value = [];

  while (date.getMonth() === month) {
    days.value.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
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

// Открытие модального окна для выбора времени
const openTimePicker = (sellerIndex, day) => {
  selectedSellerIndex = sellerIndex;
  selectedDay = day;

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);

  // Ограничение редактирования прошедших дней
  if (decodedToken.role === 'seller' && selectedDay < currentDate) {
    alert('Вы не можете редактировать прошедшие дни');
    return;
  }

  // Ограничение редактирования текущего дня после 11:00
  if (decodedToken.role === 'seller' && selectedDay.toDateString() === currentDate.toDateString()) {
    const currentHour = currentDate.getHours();
    if (currentHour >= 11) {
      alert('Вы не можете редактировать расписание за сегодняшний день после 11:00');
      return;
    }
  }

  shiftStart.value = '09';
  shiftEnd.value = '19';
  new Modal(document.getElementById('timeModal')).show();
};

// Сохранение смены
const saveShift = () => {
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

  const modal = Modal.getInstance(document.getElementById('timeModal'));
  modal.hide();
};

// Обновление расписания продавца
const updateSellerSchedule = async (seller) => {
  try {
    await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, seller);
  } catch (error) {
    console.error('Ошибка при обновлении расписания:', error);
  }
};

// Открытие модального окна для изменения имени
const openEditSellerModal = (sellerIndex) => {
  console.log(sellerIndex);
  selectedSellerIndex = sellerIndex;
  editedSellerName.value = sellers.value[sellerIndex].name;
  new Modal(document.getElementById('editSellerModal')).show();
};

// Сохранение измененного имени продавца
const saveEditedSeller = async () => {
  sellers.value[selectedSellerIndex].name = editedSellerName.value;
  await updateSellerName(sellers.value[selectedSellerIndex]);
  
  recalculateAll();

  const modal = Modal.getInstance(document.getElementById('editSellerModal'));
  modal.hide();
};

// Обновление имени продавца
const updateSellerName = async (seller) => {
  try {
    await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, seller);
  } catch (error) {
    console.error('Ошибка при обновлении имени продавца:', error);
  }
};

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
  return shift ? `${shift.shiftStart} - ${shift.shiftEnd}` : '0';
};

// Блокировка клеток для определенных дней
const isCellLocked = (day) => {
  const token = localStorage.getItem('token');
  console.log(" isCellLocked Token is " + token);
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

const deleteSeller = async () => {
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
      const modal = Modal.getInstance(document.getElementById('confirmDeleteModal'));
      modal.hide();
    } catch (error) {
      console.error('Ошибка при удалении продавца:', error);
    }
  }
};

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
</script>


<style scoped>
.seller-name:hover {
  color: #007bff;
  text-decoration: underline;
}
</style>

