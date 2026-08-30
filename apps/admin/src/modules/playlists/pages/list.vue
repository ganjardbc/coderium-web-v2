<template>
  <div class="p-6">
    <Toast />
    <ConfirmDialog />

    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <h1 class="text-2xl font-bold">Playlists</h1>
      <div class="flex items-center gap-3 flex-wrap">
        <IconField icon-position="left">
          <InputIcon class="pi pi-search" />
          <InputText v-model="search" placeholder="Search playlists..." size="small" @input="onSearchInput" />
        </IconField>
        <router-link v-slot="{ navigate }" to="/playlists/create" custom>
          <Button label="New Playlist" icon="pi pi-plus" size="small" @click="navigate" />
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <ProgressSpinner />
    </div>

    <EmptyState
      v-else-if="playlists.length === 0"
      icon="pi-list"
      :title="search ? 'No playlists match your search' : 'No playlists yet'"
      :description="search ? undefined : 'Create your first playlist to see it listed here.'"
    />

    <div v-else class="space-y-3">
      <div
        v-for="playlist in playlists"
        :key="playlist.id"
        class="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-surface-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      >
        <!-- Cover thumbnail -->
        <div class="hidden sm:block shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-surface-800">
          <img v-if="playlist.cover" :src="playlist.cover" :alt="playlist.title" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <i class="pi pi-list text-2xl text-gray-300 dark:text-gray-600" />
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <router-link
                :to="`/playlists/${playlist.slug}/edit`"
                class="font-semibold text-gray-900 dark:text-white hover:underline line-clamp-2"
              >
                {{ playlist.title }}
              </router-link>
              <p v-if="playlist.description" class="text-sm text-gray-400 dark:text-gray-500 line-clamp-2 mt-0.5">
                {{ playlist.description }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-1 shrink-0">
              <router-link v-slot="{ navigate }" :to="`/playlists/${playlist.slug}/posts`" custom>
                <Button icon="pi pi-list" size="small" text rounded severity="help" title="Manage Posts" @click="navigate" />
              </router-link>
              <router-link v-slot="{ navigate }" :to="`/playlists/${playlist.slug}/edit`" custom>
                <Button icon="pi pi-pencil" size="small" text rounded severity="info" title="Edit" @click="navigate" />
              </router-link>
              <Button
                icon="pi pi-trash"
                size="small"
                text
                rounded
                severity="danger"
                title="Delete"
                @click="handleDelete(playlist.slug, playlist.title)"
              />
            </div>
          </div>

          <!-- Badges + meta -->
          <div class="flex items-center flex-wrap gap-2 mt-3">
            <Tag :value="playlist.isPublished ? 'Published' : 'Draft'" :severity="playlist.isPublished ? 'success' : 'warn'" />

            <span class="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1 ml-auto">
              <i class="pi pi-file text-xs" /> {{ playlist._count?.posts || 0 }} posts
            </span>
            <span class="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <i class="pi pi-calendar text-xs" /> {{ new Date(playlist.createdAt).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <AdminPagination :meta="meta" @change="(p) => fetchPlaylists(p, meta.limit)" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Button,
  Tag,
  Toast,
  ConfirmDialog,
  ProgressSpinner,
  IconField,
  InputIcon,
  InputText,
} from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import api from '@/lib/api';
import EmptyState from '@/components/EmptyState.vue';
import AdminPagination from '@/components/AdminPagination.vue';

interface PlaylistItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  cover?: string | null;
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
const search = ref('');
const confirm = useConfirm();
const toast = useToast();
let searchTimeout: ReturnType<typeof setTimeout> | undefined;

onMounted(() => fetchPlaylists());

async function fetchPlaylists(page = 1, limit = 10) {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/playlists', {
      params: { page, limit, search: search.value || undefined },
    });
    playlists.value = data.data;
    meta.value = data.meta;
  } finally {
    loading.value = false;
  }
}

function onSearchInput() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchPlaylists(1, meta.value.limit), 350);
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
