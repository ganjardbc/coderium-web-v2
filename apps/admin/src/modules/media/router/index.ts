import type { RouteRecordRaw } from 'vue-router';

export const mediaRoutes: RouteRecordRaw[] = [
  {
    path: '/media',
    name: 'media',
    component: () => import('../pages/index.vue'),
    meta: {
      title: 'Media Library',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_all_media'],
    },
  },
];
