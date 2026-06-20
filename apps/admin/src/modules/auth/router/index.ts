import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login.vue'),
    meta: {
      title: 'Login',
      layout: 'auth',
      requiresGuest: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/register.vue'),
    meta: {
      title: 'Register',
      layout: 'auth',
      requiresGuest: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../pages/forgot.vue'),
    meta: {
      title: 'Forgot Password',
      layout: 'auth',
      requiresGuest: true,
    },
  },
];
