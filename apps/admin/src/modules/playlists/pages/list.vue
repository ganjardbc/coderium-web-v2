<template>
  <div class="p-6">
    <Toast />
    <ConfirmDialog />

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Playlists</h1>
      <router-link v-slot="{ navigate }" to="/playlists/create" custom>
        <Button label="New Playlist" icon="pi pi-plus" @click="navigate" />
      </router-link>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <ProgressSpinner />
    </div>

    <div v-else-if="playlists.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500">
      No playlists yet. Create your first playlist!
    </div>

    <DataTable
      v-else
      :value="playlists"
      class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
      stripedRows
    >
      <Column field="title" header="Title" class="min-w-48">
        <template #body="{ data }">
          <router-link :to="`/playlists/${data.slug}/edit`" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            {{ data.title }}
          </router-link>
        </template>
      </Column>
      <Column field="isPublished" header="Status" class="w-32">
        <template #body="{ data }">
          <Tag :value="data.isPublished ? 'Published' : 'Draft'" :severity="data.isPublished ? 'success' : 'warn'" />
        </template>
      </Column>
      <Column header="Posts" class="w-24">
        <template #body="{ data }">
          {{ data._count?.posts || 0 }}
        </template>
      </Column>
      <Column field="createdAt" header="Created" class="w-36">
        <template #body="{ data }">
          {{ new Date(data.createdAt).toLocaleDateString() }}
        </template>
      </Column>
      <Column header="Actions" class="w-44">
        <template #body="{ data }">
          <div class="flex gap-1">
            <router-link v-slot="{ navigate }" :to="`/playlists/${data.slug}/posts`" custom>
              <Button icon="pi pi-list" size="small" text severity="help" title="Manage Posts" @click="navigate" />
            </router-link>
            <router-link v-slot="{ navigate }" :to="`/playlists/${data.slug}/edit`" custom>
              <Button icon="pi pi-pencil" size="small" text severity="info" title="Edit" @click="navigate" />
            </router-link>
            <Button
              icon="pi pi-trash"
              size="small"
              text
              severity="danger"
              title="Delete"
              @click="handleDelete(data.slug, data.title)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <div v-if="meta.totalPages > 1" class="flex justify-center gap-2 mt-6">
      <Button
        v-for="p in meta.totalPages"
        :key="p"
        :label="String(p)"
        size="small"
        :severity="p === meta.page ? 'primary' : 'secondary'"
        :outlined="p !== meta.page"
        @click="fetchPlaylists(p, meta.limit)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { DataTable, Column, Button, Tag, Toast, ConfirmDialog, ProgressSpinner } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
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
const confirm = useConfirm();
const toast = useToast();

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

function handleDelete(slug: string, title: string) {
  confirm.require({
    message: `Delete "${title}"? This cannot be undone.`,
    header: 'Delete Playlist',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Delete', severity: 'danger' },
    accept: async () => {
      await api.delete(`/admin/playlists/${slug}`);
      await fetchPlaylists(meta.value.page, meta.value.limit);
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Playlist removed', life: 3000 });
    },
  });
}
</script>
