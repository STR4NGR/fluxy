<template>
  <v-container class="d-flex align-center justify-center fill-height" fluid>
    <v-card class="text-center elevation-2">
      <v-card-title>
        <h1 class="display-4 red--text">403</h1>
      </v-card-title>
      <v-card-text>
        <h2 class="headline">Доступ запрещен</h2>
        <p>У вас нет прав для доступа к этой странице.</p>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" to="/">Вернуться на главную страницу</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
  
  <script>
  export default {
    name: "ForbiddenPage",
  };
  </script>
  
  <style scoped>
  .card {
    border-radius: 10px;
  }
  
  h1 {
    font-size: 5rem;
  }
  
  .btn-primary {
    font-size: 1rem;
    padding: 0.6rem 1.5rem;
  }

  .v-container {
    background-color: #F6F5F8;
  }
  </style>
  