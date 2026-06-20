import type { RouteRecordRaw } from 'vue-router';

export const analyticsRoutes: RouteRecordRaw[] = [
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('../pages/index.vue'),
    meta: {
      title: 'Analytics Dashboard',
      layout: 'admin',
      requiresAuth: true,
      permission: ['view_analytics'],
    },
  },
];
