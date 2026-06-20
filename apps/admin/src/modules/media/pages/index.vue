<template>
  <div class="p-6">
    <Toast />
    <ConfirmDialog />

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Media Library</h1>
    </div>

    <MediaUploader :multiple="true" @uploaded="onUploaded" class="mb-6" />

    <div v-if="loading" class="flex justify-center py-16">
      <ProgressSpinner />
    </div>

    <div v-else-if="mediaItems.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500">
      No media yet. Upload your first image!
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div
        v-for="item in mediaItems"
        :key="item.id"
        class="group relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 aspect-square"
      >
        <img :src="item.url" :alt="item.originalName" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
          <div class="text-white text-xs truncate flex-1">{{ item.originalName }}</div>
          <Button
            icon="pi pi-trash"
            size="small"
            text
            severity="danger"
            class="!text-red-300"
            @click="handleDelete(item.id)"
          />
        </div>
        <div class="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
          {{ formatSize(item.size) }}
        </div>
      </div>
    </div>

    <div v-if="meta.totalPages > 1" class="flex justify-center gap-2 mt-6">
      <Button
        v-for="p in meta.totalPages"
        :key="p"
        :label="String(p)"
        size="small"
        :severity="p === meta.page ? 'primary' : 'secondary'"
        :outlined="p !== meta.page"
        @click="fetchMedia(p, meta.limit)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button, Toast, ConfirmDialog, ProgressSpinner } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
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
const confirm = useConfirm();
const toast = useToast();

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

function handleDelete(id: string) {
  confirm.require({
    message: 'Delete this media file? This cannot be undone.',
    header: 'Delete Media',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Delete', severity: 'danger' },
    accept: async () => {
      await api.delete(`/admin/media/${id}`);
      mediaItems.value = mediaItems.value.filter(m => m.id !== id);
      meta.value.total--;
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Media file removed', life: 3000 });
    },
  });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
</script>
