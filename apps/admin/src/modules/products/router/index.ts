import type { RouteRecordRaw } from 'vue-router';

// NOTE: unlike posts (which routes by :slug), the admin product endpoints
// route by :id (see apps/api products.controller.ts — GET/PATCH
// /admin/products/:id). Keep this route param as :id, not :slug.
export const productsRoutes: RouteRecordRaw[] = [
  {
    path: '/products',
    name: 'products',
    component: () => import('../pages/list.vue'),
    meta: {
      title: 'Products',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_products'],
    },
  },
  {
    path: '/products/create',
    name: 'products-new',
    component: () => import('../pages/create.vue'),
    meta: {
      title: 'Create Product',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_products'],
    },
  },
  {
    path: '/products/:id/edit',
    name: 'products-edit',
    component: () => import('../pages/edit.vue'),
    meta: {
      title: 'Edit Product',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_products'],
    },
  },
];
