import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import { useAuthStore } from '@/modules/auth/stores/auth.store';

import { authRoutes } from '@/modules/auth/router';
import { dashboardRoutes } from '@/modules/dashboard/router';
import { postsRoutes } from '@/modules/posts/router';
import { aiAgentRoutes } from '@/modules/ai-agent/router';
import { productsRoutes } from '@/modules/products/router';
import { playlistsRoutes } from '@/modules/playlists/router';
import { mediaRoutes } from '@/modules/media/router';
import { usersRoutes } from '@/modules/users/router';
import { settingsRoutes } from '@/modules/settings/router';

const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...postsRoutes,
  ...aiAgentRoutes,
  ...productsRoutes,
  ...playlistsRoutes,
  ...mediaRoutes,
  ...usersRoutes,
  ...settingsRoutes,
];

export function setupRouter(app: App) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach(async (to) => {
    const token = localStorage.getItem('token');

    if (to.meta.requiresAuth && !token) {
      return { name: 'login' };
    }

    if (to.meta.requiresGuest && token) {
      return { name: 'home' };
    }

    if (token) {
      const authStore = useAuthStore();
      if (!authStore.user) {
        await authStore.fetchProfile();
      }
    }
  });

  app.use(router);
  return router;
}
