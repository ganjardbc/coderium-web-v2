import type { RouteRecordRaw } from 'vue-router';

export const settingsRoutes: RouteRecordRaw[] = [
  {
    path: '/settings/profile',
    name: 'settings-profile',
    component: () => import('../pages/profile.vue'),
    meta: {
      title: 'Profile Settings',
      layout: 'admin',
      requiresAuth: true,
    },
  },
  {
    path: '/settings/password',
    name: 'settings-password',
    component: () => import('../pages/password.vue'),
    meta: {
      title: 'Change Password',
      layout: 'admin',
      requiresAuth: true,
    },
  },
  {
    path: '/settings/appearance',
    name: 'settings-appearance',
    component: () => import('../pages/appearance.vue'),
    meta: {
      title: 'Appearance Settings',
      layout: 'admin',
      requiresAuth: true,
    },
  },
  {
    path: '/settings/two-factor',
    name: 'settings-2fa',
    component: () => import('../pages/two-factor.vue'),
    meta: {
      title: 'Two-Factor Auth',
      layout: 'admin',
      requiresAuth: true,
    },
  },
  // Redirect old 2fa path
  {
    path: '/settings/2fa',
    redirect: '/settings/two-factor',
  },
];
