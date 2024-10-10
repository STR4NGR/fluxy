<template>
    <div class="container mt-5">
      <div class="card text-center shadow-sm">
        <div class="card-body">
          <h1 class="display-4 text-danger">403</h1>
          <h2 class="card-title">Доступ запрещен</h2>
          <p class="card-text">У вас нет прав для доступа к этой странице.</p>
          <router-link to="/" class="btn btn-primary">Вернуться на главную страницу</router-link>
        </div>
      </div>
    </div>
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
  </style>
  