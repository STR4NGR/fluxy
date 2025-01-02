<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  watch: {
    // Следите за изменениями в маршрутах, чтобы обновить заголовок страницы
    '$route'(to) {
      document.title = to.meta.title || 'Fluxy'; // Установите заголовок по умолчанию
    }
  },
  mounted() {
    // При первом монтировании компонента установите заголовок
    document.title = this.$route.meta.title || 'Fluxy';
  }
}
</script>

<style>
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

.shift-btn {
  color: #413E4F;
  box-shadow: none;
  min-height: 75px;
  min-width: 70px;
  width: 100%;
  display: block;
  text-align: center;
}

/* class="custom-cell flex-grow h-full w-full py-1 px-1 bg-white text-sm" */
.pinned-sellers {
  height: 100%;
  width: 75px;
  min-width: 50px;
  max-width: 75px;
  font-size: 16px;
  border-right: 2px solid #E6E5E7;
  border-top: 6px solid #E6E5E7;
  word-wrap: break-word;
  /* Перенос слов на новую строку */
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
  /* Горизонтальное выравнивание */
  line-height: 10vh;
}

th,
td {
  border-right: 1px solid #ddd;
}

/* Настроить прокрутку */
.v-col.overflow-x-auto {
  max-width: 40px;
  overflow-x: auto;
}

.holiday {
  background-color: #F3F3F4 !important;
}

.solo {
  background-color: orange !important;
  /* Цвет фона как у bg-gray-500 */
  position: relative;
  /* Для позиционирования псевдоэлемента */
  padding: 40px;
  /* Добавляем отступы для размещения иконки */
  text-align: center;
  /* Центрируем текст и иконку */
}

.solo::before {
  content: "";
  /* Пустое содержимое для псевдоэлемента */
  display: inline-block;
  /* Отображаем как блочный элемент */
  width: 24px;
  /* Ширина иконки */
  height: 24px;
  /* Высота иконки */
  /* background-image: url('https://www.svgrepo.com/show/152241/exclamation-mark-inside-a-circle.svg'); */
  background-size: contain;
  /* Масштабирование изображения, чтобы оно помещалось внутри */
  background-repeat: no-repeat;
  /* Отключить повторение изображения */
  position: absolute;
  /* Позволяет размещать иконку */
  top: 50%;
  /* Центрирование по вертикали */
  left: 50%;
  /* Центрирование по горизонтали */
  transform: translate(-50%, -50%);
  /* Центрирование иконки */
}
</style>
