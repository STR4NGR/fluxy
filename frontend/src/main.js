import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css';
import { loadFonts } from './plugins/webfontloader'
import { createVuetify } from 'vuetify';
import { createPinia } from 'pinia'
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

loadFonts()

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi', // Используем 'mdi' для Material Design Icons
  },
})

const pinia = createPinia()

createApp(App)
  .use(router)
  .use(pinia)
  .use(vuetify)
  .mount('#app')
