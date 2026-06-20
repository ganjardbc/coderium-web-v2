<template>
  <div class="p-6 max-w-4xl mx-auto">
    <Toast />

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Manage Posts</h1>
      <router-link to="/playlists" class="text-sm text-gray-500 dark:text-gray-400 hover:underline">
        &larr; Back to playlists
      </router-link>
    </div>

    <Card class="!shadow-none border border-gray-200 dark:border-gray-700 mb-6">
      <template #title>
        <span class="text-base font-semibold">Add Posts</span>
      </template>
      <template #content>
        <div class="flex gap-2 mb-4">
          <InputGroup class="flex-1">
            <InputGroupAddon>
              <i class="pi pi-search text-gray-400"></i>
            </InputGroupAddon>
            <InputText v-model="searchQuery" placeholder="Search posts..." class="w-full" @input="onSearch" />
          </InputGroup>
          <Button
            label="Add Selected"
            icon="pi pi-plus"
            :disabled="selectedPostIds.length === 0"
            :badge="selectedPostIds.length > 0 ? String(selectedPostIds.length) : undefined"
            @click="attachSelected"
          />
        </div>

        <div v-if="availablePosts.length > 0" class="max-h-64 overflow-y-auto space-y-1">
          <label
            v-for="post in availablePosts"
            :key="post.id"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          >
            <Checkbox :value="post.id" v-model="selectedPostIds" />
            <span class="text-sm flex-1">{{ post.title }}</span>
            <Tag :value="post.type" severity="secondary" class="capitalize text-xs" />
          </label>
        </div>
        <p v-else-if="searchQuery" class="text-gray-500 dark:text-gray-400 text-sm py-4 text-center">No posts found</p>
        <p v-else class="text-gray-400 dark:text-gray-500 text-sm py-4 text-center">Search to find posts to add</p>
      </template>
    </Card>

    <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
      <template #title>
        <span class="text-base font-semibold">Current Posts ({{ playlistPosts.length }})</span>
      </template>
      <template #content>
        <div v-if="playlistPosts.length === 0" class="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
          No posts in this playlist yet
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="(item, index) in playlistPosts"
            :key="item.id"
            class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <span class="text-gray-400 text-sm w-6 text-center font-mono">{{ index + 1 }}</span>
            <img v-if="item.post.cover" :src="item.post.cover" class="w-10 h-10 rounded object-cover" />
            <div v-else class="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-xs">IMG</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ item.post.title }}</p>
              <Tag :value="item.post.type" severity="secondary" class="capitalize text-xs mt-0.5" />
            </div>
            <Button icon="pi pi-trash" size="small" text severity="danger" title="Remove" @click="detachPost(item.postId)" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { InputText, InputGroup, InputGroupAddon, Checkbox, Button, Tag, Card, Toast } from 'primevue';
import { useToast } from 'primevue/usetoast';
import api from '@/lib/api';

const route = useRoute();
const toast = useToast();
const slug = route.params.slug as string;

interface PostItem {
  id: string;
  title: string;
  type: string;
  cover?: string | null;
}

interface PlaylistPostItem {
  id: string;
  postId: string;
  order: number;
  post: PostItem;
}

const playlistPosts = ref<PlaylistPostItem[]>([]);
const availablePosts = ref<PostItem[]>([]);
const selectedPostIds = ref<string[]>([]);
const searchQuery = ref('');
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  fetchPlaylistPosts();
  searchPosts('');
});

async function fetchPlaylistPosts() {
  try {
    const { data } = await api.get(`/playlists/${slug}`);
    playlistPosts.value = data.data.posts || [];
  } catch {
    playlistPosts.value = [];
  }
}

function onSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => searchPosts(searchQuery.value), 300);
}

async function searchPosts(query: string) {
  try {
    const { data } = await api.get('/posts', { params: { limit: 50, search: query } });
    const attachedIds = new Set(playlistPosts.value.map(p => p.postId));
    availablePosts.value = (data.data || []).filter((p: PostItem) => !attachedIds.has(p.id));
  } catch {
    availablePosts.value = [];
  }
}

async function attachSelected() {
  try {
    await api.post(`/admin/playlists/${slug}/posts`, { postIds: selectedPostIds.value });
    toast.add({ severity: 'success', summary: 'Added', detail: `${selectedPostIds.value.length} post(s) added`, life: 3000 });
    selectedPostIds.value = [];
    await fetchPlaylistPosts();
    searchPosts(searchQuery.value);
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    toast.add({ severity: 'error', summary: 'Error', detail: axiosErr.response?.data?.message || 'Failed to attach posts', life: 4000 });
  }
}

async function detachPost(postId: string) {
  try {
    await api.delete(`/admin/playlists/${slug}/posts`, { data: { postIds: [postId] } });
    toast.add({ severity: 'info', summary: 'Removed', detail: 'Post removed from playlist', life: 3000 });
    await fetchPlaylistPosts();
    searchPosts(searchQuery.value);
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    toast.add({ severity: 'error', summary: 'Error', detail: axiosErr.response?.data?.message || 'Failed to remove post', life: 4000 });
  }
}
</script>
