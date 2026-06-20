import type { RouteRecordRaw } from 'vue-router';

export const postsRoutes: RouteRecordRaw[] = [
  {
    path: '/posts',
    name: 'posts',
    component: () => import('../pages/list.vue'),
    meta: {
      title: 'Posts',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_own_posts'],
    },
  },
  {
    path: '/posts/create',
    name: 'posts-new',
    component: () => import('../pages/create.vue'),
    meta: {
      title: 'Create Post',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_own_posts'],
    },
  },
  {
    path: '/posts/:slug/edit',
    name: 'posts-edit',
    component: () => import('../pages/edit.vue'),
    meta: {
      title: 'Edit Post',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_own_posts'],
    },
  },
];
