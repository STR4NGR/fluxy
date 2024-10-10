import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from '../views/AuthView.vue';
import AdminPage from '@/views/AdminView.vue';
import SellerPage from '@/views/SellerView.vue';
import AboutView from '@/views/AboutView.vue';
import ForbiddenPage from '@/views/ForbiddenView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthPage
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage
  },
  {
    path: '/seller',
    name: 'seller',
    component: SellerPage
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: ForbiddenPage,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
