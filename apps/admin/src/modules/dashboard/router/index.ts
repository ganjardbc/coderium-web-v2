import type { RouteRecordRaw } from 'vue-router';

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/index.vue'),
    meta: {
      title: 'Dashboard',
      layout: 'admin',
      requiresAuth: true,
    },
  },
];
