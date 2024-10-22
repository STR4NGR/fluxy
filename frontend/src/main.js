import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/main.css';
import { loadFonts } from './plugins/webfontloader'
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Импорт стилей Vuetify

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(createVuetify())
  .mount('#app')
