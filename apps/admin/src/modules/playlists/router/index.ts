import type { RouteRecordRaw } from 'vue-router';

export const playlistsRoutes: RouteRecordRaw[] = [
  {
    path: '/playlists',
    name: 'playlists',
    component: () => import('../pages/list.vue'),
    meta: {
      title: 'Playlists',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_all_playlists'],
    },
  },
  {
    path: '/playlists/create',
    name: 'playlists-new',
    component: () => import('../pages/create.vue'),
    meta: {
      title: 'Create Playlist',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_all_playlists'],
    },
  },
  {
    path: '/playlists/:slug/edit',
    name: 'playlists-edit',
    component: () => import('../pages/edit.vue'),
    meta: {
      title: 'Edit Playlist',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_all_playlists'],
    },
  },
  {
    path: '/playlists/:slug/posts',
    name: 'playlists-posts',
    component: () => import('../pages/posts.vue'),
    meta: {
      title: 'Manage Playlist Posts',
      layout: 'admin',
      requiresAuth: true,
      permission: ['manage_all_playlists'],
    },
  },
];
