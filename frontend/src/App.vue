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
