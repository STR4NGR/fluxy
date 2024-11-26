<template>
  <v-container class="d-flex align-center justify-center fill-height" fluid>
    <v-card max-width="600" class="pa-6">
      <v-card-title class="text-h4 font-weight-bold text-center">
        Добро пожаловать на <span class="text-primary">Fluxy</span>
      </v-card-title>

      <v-form @submit.prevent="isRegistering ? register() : login()">
        <v-text-field
          class="custom-text-field"
          v-model="email"
          label="E-Mail"
          type="email"
          required
          variant="outlined"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>

        <v-text-field
          v-if="isRegistering"
          v-model="name"
          label="Имя"
          type="text"
          required
          variant="outlined"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Пароль"
          type="password"
          required
          variant="outlined"
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>

        <v-text-field
          v-if="isRegistering"
          v-model="confirmPassword"
          label="Подтвердите пароль"
          type="password"
          required
          variant="outlined"
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>

        <v-btn
          class="mt-4 custom-btn"
          type="submit"
          block
        >
          {{ isRegistering ? 'Зарегистрироваться' : 'Войти' }}
        </v-btn>
      </v-form>

      <AlertForm v-if="error" :message="error" :type="errorType" class="mt-4" />
    </v-card>
  </v-container>
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
          } else if (role == 'manager') {
            this.$router.push({ name: 'manager' });
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
          this.$router.push({ name: 'manager' });
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
.v-container {
  background-color: #F6F5F8;
}

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

.custom-btn {
    font-size: 1rem;
    padding: 0.6rem 0;
    background-color: #836AF9 !important; /* Если нужно изменить фон */
    color: #ffffff !important;
}

/* Для фокуса на компоненте */
.custom-text-field >>> .v-input--is-focused .v-input__control {
  border: 2px solid #836AF9 !important; /* Цвет обводки при фокусе */
}

/* Для текста в фокусе */
.custom-text-field >>> .v-input--is-focused .v-text-field__control input {
  border-color: #836AF9 !important; /* Цвет обводки при фокусе */
}

/* Основной фон компонента */
.custom-text-field >>> .v-input__control {
  background-color: #ffffff !important; /* Цвет фона */
  border-radius: 8px !important; /* Закругление углов */
}

/* Цвет текста */
.custom-text-field >>> .v-text-field__control input {
  color: #333 !important;
}

/* Общие отступы */
.custom-text-field >>> .v-input__slot {
  padding: 12px !important;
}

.text-danger {
  font-size: 0.9rem;
}

.text-primary {
  color: #836AF9 !important;
}
</style>
