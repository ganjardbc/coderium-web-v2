<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Playlists</h1>
      <router-link to="/playlists/create" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
        + New Playlist
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

    <div v-else-if="playlists.length === 0" class="text-center py-12 text-gray-500">
      No playlists yet. Create your first playlist!
    </div>

    <div v-else class="bg-white rounded-xl border overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Posts</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Created</th>
            <th class="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pl in playlists" :key="pl.id" class="border-b last:border-0 hover:bg-gray-50">
            <td class="px-4 py-3">
              <router-link :to="`/playlists/${pl.slug}/edit`" class="text-blue-600 hover:underline font-medium">
                {{ pl.title }}
              </router-link>
            </td>
            <td class="px-4 py-3">
              <span :class="pl.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'" class="px-2 py-1 text-xs rounded-full">
                {{ pl.isPublished ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ pl._count?.posts || 0 }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ new Date(pl.createdAt).toLocaleDateString() }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <router-link :to="`/playlists/${pl.slug}/posts`" class="text-xs text-purple-600 hover:underline">Manage Posts</router-link>
                <router-link :to="`/playlists/${pl.slug}/edit`" class="text-xs text-blue-600 hover:underline">Edit</router-link>
                <button @click="handleDelete(pl.slug)" class="text-xs text-red-600 hover:underline">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="meta.totalPages > 1" class="flex justify-center gap-2 mt-6">
      <button
        v-for="p in meta.totalPages"
        :key="p"
        @click="fetchPlaylists(p, meta.limit)"
        :class="p === meta.page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        class="px-3 py-1 rounded text-sm transition-colors"
      >{{ p }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/lib/api';

interface PlaylistItem {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  _count?: { posts: number };
}

interface PlaylistMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const playlists = ref<PlaylistItem[]>([]);
const meta = ref<PlaylistMeta>({ page: 1, limit: 10, total: 0, totalPages: 0 });
const loading = ref(false);

onMounted(() => fetchPlaylists());

async function fetchPlaylists(page = 1, limit = 10) {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/playlists', { params: { page, limit } });
    playlists.value = data.data;
    meta.value = data.meta;
  } finally {
    loading.value = false;
  }
}

async function handleDelete(slug: string) {
  if (confirm('Are you sure you want to delete this playlist?')) {
    await api.delete(`/admin/playlists/${slug}`);
    await fetchPlaylists(meta.value.page, meta.value.limit);
  }
}
</script>
