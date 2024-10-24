import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from '../views/AuthView.vue';
import AdminPage from '@/views/AdminView.vue';
import SellerPage from '@/views/SellerView.vue';
import AboutView from '@/views/AboutView.vue';
import ForbiddenPage from '@/views/ForbiddenView.vue';
import { jwtDecode } from 'jwt-decode';

const routes = [
  {
    path: '/',
    redirect: '/login' // Редирект на страницу входа
  },
  {
    path: '/login',
    name: 'login',
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
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (isAuthenticated) {
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    if (to.name === 'login') {
      if (role === 'admin') {
        next({ name: 'admin' });
      } else {
        next({ name: 'seller' });
      }
    } else if (role === 'admin' && to.name === 'admin') {
      next();
    } else if (role !== 'admin' && to.name === 'admin') {
      next({ name: 'forbidden' });
    } else {
      next();
    }
  } else {
    // Если не авторизован и не пытается зайти на login или forbidden, перенаправляем на forbidden
    if (to.name !== 'login' && to.name !== 'forbidden') {
      next({ name: 'forbidden' });
    } else {
      next();
    }
  }
});

export default router;
