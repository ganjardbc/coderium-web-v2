import type { RouteRecordRaw } from 'vue-router';

export const aiAgentRoutes: RouteRecordRaw[] = [
  {
    path: '/ai-agent',
    name: 'ai-agent',
    component: () => import('../pages/index.vue'),
    meta: {
      title: 'AI Agent',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_own_posts'],
    },
  },
  {
    path: '/ai-agent/article/preview',
    name: 'ai-agent-article-preview',
    component: () => import('../pages/article-preview.vue'),
    meta: {
      title: 'Generate Article',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_own_posts'],
      backTo: '/ai-agent',
    },
  },
];
