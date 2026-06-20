import type { RouteRecordRaw } from 'vue-router';

export const usersRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'users',
    component: () => import('../pages/index.vue'),
    meta: {
      title: 'User Management',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_users'],
    },
  },
];
