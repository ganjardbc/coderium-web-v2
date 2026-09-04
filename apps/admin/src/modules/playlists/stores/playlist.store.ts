import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/lib/api';

export interface Playlist {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  cover?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; avatarUrl?: string | null };
  _count?: { posts: number };
}

export interface PlaylistMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const usePlaylistStore = defineStore('playlists', () => {
  const playlists = ref<Playlist[]>([]);
  const meta = ref<PlaylistMeta>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const loading = ref(false);

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

  async function fetchPlaylistBySlug(slug: string): Promise<Playlist> {
    const { data } = await api.get(`/admin/playlists/${slug}`);
    return data.data as Playlist;
  }

  return {
    playlists,
    meta,
    loading,
    fetchPlaylists,
    fetchPlaylistBySlug,
  };
});
