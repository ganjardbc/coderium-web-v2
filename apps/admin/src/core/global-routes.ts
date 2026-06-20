import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import { authRoutes } from '@/modules/auth/router';
import { dashboardRoutes } from '@/modules/dashboard/router';
import { postsRoutes } from '@/modules/posts/router';
import { playlistsRoutes } from '@/modules/playlists/router';
import { mediaRoutes } from '@/modules/media/router';
import { analyticsRoutes } from '@/modules/analytics/router';
import { usersRoutes } from '@/modules/users/router';
import { settingsRoutes } from '@/modules/settings/router';

const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...postsRoutes,
  ...playlistsRoutes,
  ...mediaRoutes,
  ...analyticsRoutes,
  ...usersRoutes,
  ...settingsRoutes,
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
