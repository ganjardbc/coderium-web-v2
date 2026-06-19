import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => import('@/views/posts/PostListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/posts/new/:type',
    name: 'posts-new',
    component: () => import('@/views/posts/PostFormView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/posts/edit/:slug',
    name: 'posts-edit',
    component: () => import('@/views/posts/PostFormView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/media',
    name: 'media',
    component: () => import('@/views/media/MediaLibraryView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/playlists',
    name: 'playlists',
    component: () => import('@/views/playlists/PlaylistListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/playlists/new',
    name: 'playlists-new',
    component: () => import('@/views/playlists/PlaylistFormView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/playlists/edit/:slug',
    name: 'playlists-edit',
    component: () => import('@/views/playlists/PlaylistFormView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/playlists/:slug/posts',
    name: 'playlists-posts',
    component: () => import('@/views/playlists/PlaylistPostsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('@/views/analytics/AnalyticsDashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/users/UserManagementView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/profile',
    name: 'settings-profile',
    component: () => import('@/views/settings/ProfileSettingsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/password',
    name: 'settings-password',
    component: () => import('@/views/settings/PasswordSettingsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/appearance',
    name: 'settings-appearance',
    component: () => import('@/views/settings/AppearanceSettingsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/2fa',
    name: 'settings-2fa',
    component: () => import('@/views/settings/TwoFASettingsView.vue'),
    meta: { requiresAuth: true },
  },
];

export function setupRouter(app: App) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach((to) => {
    const token = localStorage.getItem('token');

    if (to.meta.requiresAuth && !token) {
      return { name: 'login' };
    }

    if (to.meta.requiresGuest && token) {
      return { name: 'home' };
    }
  });

  app.use(router);
}
