<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">
          Выберите магазин
        </h2>
  
        <v-select
        v-model="selectedUser"
          :items="sellerNamesArray"
          item-text="name"
          item-value="_id"
          @change="fetchSelected(selectedUser)"
          label="Нажмите сюда для выбора"
          class="mb-4"
        >
          <template #selection="{ item }">
            <v-list-item>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
  
        <button
          @click="submitSelection"
          class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Подтвердить выбор
        </button>

        <button
          @click="logout"
          class="w-full bg-white text-black py-2 rounded-md hover:bg-black transition-colors duration-300"
        >
          Выйти
        </button>

      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const selectedUser = ref(null);
  const users = ref([]);
  const sellerNames = ref([]);
  const sellerNamesArray = ref([]);
  const sellerIDArray = ref([]);
  
  onMounted(async () => {
  const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/users`);
  users.value = response.data;
  sellerNames.value = users.value
      .filter(user => user.role === 'seller')
      .map(user => ({ name: user.name, _id: user._id }));

  // Теперь sellerNames.value уже заполнен, создаем массив имен
  sellerNamesArray.value = sellerNames.value.map(seller => seller.name);
  sellerIDArray.value = sellerNames.value.map(seller => seller._id);
});

  const fetchSelected = (value) => {
    console.log(value);
  }

  const submitSelection = () => {
  if (selectedUser.value) {
    // Здесь вы можете использовать selectedUser.value для получения ID
    const user = users.value.find(user => user.name === selectedUser.value);
    const foundedUserId = user ? user._id : null; 

    localStorage.setItem('id', foundedUserId);
    localStorage.setItem('name', selectedUser.value);

    router.push({ name: 'seller' });
  }
}

  const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('id');
      router.push({ path: '/' });
  };
  
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (!isAuthenticated && to.name !== 'login') {
      next({ name: 'login' });
    } else if (isAuthenticated && to.name === 'login') {
      next({ name: 'admin' });
    } else {
      next();
    }
  });
  </script>
  