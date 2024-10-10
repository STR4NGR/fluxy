<template>
  <div class="container mt-5 login-form">
    <div class="card p-4 shadow-sm">
      <h2 class="text-center mb-4">
        Добро пожаловать на <strong>Fluxy</strong>
      </h2>
      
      <form @submit.prevent="isRegistering ? register() : login()">
        <div class="mb-3">
          <input 
            type="text" 
            v-model="email" 
            class="form-control" 
            id="email" 
            required 
            placeholder="E-Mail"
          />
        </div>
        <div class="mb-3" v-if="isRegistering">
          <input 
            type="text" 
            v-model="name" 
            class="form-control" 
            id="name" 
            required 
            placeholder="Имя"
          />
        </div>
        <div class="mb-3">
          <input 
            type="password" 
            v-model="password" 
            class="form-control" 
            id="password" 
            required 
            placeholder="Пароль"
          />
        </div>
        <div class="mb-3" v-if="isRegistering">
          <input 
            type="password" 
            v-model="confirmPassword" 
            class="form-control" 
            id="confirmPassword" 
            required 
            placeholder="Подтвердите пароль"
          />
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-3">
          {{ isRegistering ? 'Зарегистрироваться' : 'Войти' }}
        </button>
      </form>

      <div class="text-center">
        <span v-if="!isRegistering">Нет аккаунта? </span>
        <span v-if="isRegistering">Уже есть аккаунт? </span>
        <a href="#" class="text-decoration-none text-secondary text-center d-inline-block mt-3" 
           @click.prevent="toggleForm"
           style="transition: color 0.3s ease-in-out;"> 
          <strong class="register-link">{{ isRegistering ? 'Войти' : 'Зарегистрироваться' }}</strong>
        </a>
      </div>

      <AlertForm v-if="error" :message="error" :type="errorType" />
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
          const role = decodedToken.role;
          console.log("Token is " +  data.token);
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
        this.errorType = data.errorType;

        if (response.ok) {
          this.$router.push({ name: 'seller' });
          localStorage.setItem('token', data.token);
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
