<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">
        Добро пожаловать на <span class="text-blue-500">Fluxy</span>
      </h2>

      <form @submit.prevent="isRegistering ? register() : login()">
        <div class="mb-4">
          <input 
            type="email" 
            v-model="email" 
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            id="email" 
            required 
            placeholder="E-Mail"
          />
        </div>
        
        <div class="mb-4" v-if="isRegistering">
          <input 
            type="text" 
            v-model="name" 
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            id="name" 
            required 
            placeholder="Имя"
          />
        </div>
        
        <div class="mb-4">
          <input 
            type="password" 
            v-model="password" 
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            id="password" 
            required 
            placeholder="Пароль"
          />
        </div>
        
        <div class="mb-4" v-if="isRegistering">
          <input 
            type="password" 
            v-model="confirmPassword" 
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            id="confirmPassword" 
            required 
            placeholder="Подтвердите пароль"
          />
        </div>

        <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
          {{ isRegistering ? 'Зарегистрироваться' : 'Войти' }}
        </button>
      </form>

      <div class="text-center mt-4">
        <span v-if="!isRegistering">Нет аккаунта? </span>
        <span v-if="isRegistering">Уже есть аккаунт? </span>
        <a href="#" class="text-blue-500 hover:text-blue-600 transition-colors duration-300 font-semibold"
           @click.prevent="toggleForm"> 
          {{ isRegistering ? 'Войти' : 'Зарегистрироваться' }}
        </a>
      </div>

      <AlertForm v-if="error" :message="error" :type="errorType" class="mt-4" />
    </div>
  </div>
</template>
  
<script>
import AlertForm from '@/components/AlertForm.vue';
import { jwtDecode } from 'jwt-decode';

export default {
  data() {
    return {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      error: null,
      errorType: "danger",
      isRegistering: false
    };
  },
  components: {
    AlertForm
  },
  watch: {
    email() {
      this.error = null;
    },
    name() {
      this.error = null;
    },
    password() {
      this.error = null;
    },
    confirmPassword() {
      this.error = null;
    }
  },
  methods: {
    toggleForm() {
      this.isRegistering = !this.isRegistering; 
      this.error = null;
      this.email = null;
      this.name = null;
      this.password = null;
    },
    async login() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          const decodedToken = jwtDecode(data.token);
          localStorage.setItem('name', data.name);
          localStorage.setItem('id', decodedToken.id);
          const role = decodedToken.role;
          if (role == 'admin') {
            this.$router.push({ name: 'admin' });
          } else if (role == 'seller') {
            this.$router.push({ name: 'seller' });
          } else {
            this.error = "role is: " + data.role;
          }
        } else {
          this.error = data.message || 'Ошибка авторизации.';
        }
      } catch (err) {
        this.error = "error is:" + err.message;
      }
    },
    async register() {
      if (this.password !== this.confirmPassword) {
        this.error = 'Пароли не совпадают!';
        return;
      }
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            name: this.name,
            password: this.password
          })
        });

        const data = await response.json();
        const decodedToken = jwtDecode(data.token);
        this.errorType = data.errorType;

        if (response.ok) {
          this.$router.push({ name: 'seller' });
          localStorage.setItem('token', data.token);
          localStorage.setItem('name', this.name);
          localStorage.setItem('id', decodedToken.id);
          this.isRegistering = false;
          this.email = '';
          this.name = '';
          this.password = '';
          this.confirmPassword = '';
        } else {
          this.error = data.message || 'Ошибка авторизации.';
        }

      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: auto;
}

.register-link:hover {
  color: blue; 
  text-decoration: underline; 
}

.card {
  border-radius: 10px;
}

h2 {
  font-size: 1.5rem;
}

.small-label {
  font-size: 0.85rem;
}

.form-control-sm {
  padding: 0.5rem;
  font-size: 0.9rem;
}

.btn-primary {
  font-size: 1rem;
  padding: 0.6rem 0;
}

.text-danger {
  font-size: 0.9rem;
}
</style>
