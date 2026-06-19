<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Media Library</h1>
    </div>

    <MediaUploader :multiple="true" @uploaded="onUploaded" class="mb-6" />

    <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

    <div v-else-if="mediaItems.length === 0" class="text-center py-12 text-gray-500">
      No media yet. Upload your first image!
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div
        v-for="item in mediaItems"
        :key="item.id"
        class="group relative rounded-lg overflow-hidden border bg-gray-50 aspect-square"
      >
        <img :src="item.url" :alt="item.originalName" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
          <div class="text-white text-xs truncate flex-1">{{ item.originalName }}</div>
          <button @click="handleDelete(item.id)" class="text-red-400 hover:text-red-300 text-xs ml-2">Delete</button>
        </div>
        <div class="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
          {{ formatSize(item.size) }}
        </div>
      </div>
    </div>

    <div v-if="meta.totalPages > 1" class="flex justify-center gap-2 mt-6">
      <button
        v-for="p in meta.totalPages"
        :key="p"
        @click="fetchMedia(p, meta.limit)"
        :class="p === meta.page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        class="px-3 py-1 rounded text-sm transition-colors"
      >{{ p }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/lib/api';
import MediaUploader from '@/components/MediaUploader.vue';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

interface MediaMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const mediaItems = ref<MediaItem[]>([]);
const meta = ref<MediaMeta>({ page: 1, limit: 20, total: 0, totalPages: 0 });
const loading = ref(false);

onMounted(() => fetchMedia());

async function fetchMedia(page = 1, limit = 20) {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/media', { params: { page, limit } });
    mediaItems.value = data.data;
    meta.value = data.meta;
  } finally {
    loading.value = false;
  }
}

function onUploaded(newMedia: Record<string, unknown>[]) {
  mediaItems.value.unshift(...(newMedia as unknown as MediaItem[]));
  meta.value.total += newMedia.length;
}

async function handleDelete(id: string) {
  if (confirm('Delete this media?')) {
    await api.delete(`/admin/media/${id}`);
    mediaItems.value = mediaItems.value.filter(m => m.id !== id);
    meta.value.total--;
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
</script>
