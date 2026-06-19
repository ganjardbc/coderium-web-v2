import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
];

export function setupRouter(app: App) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  app.use(router);
}
