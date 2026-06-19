<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Manage Posts</h1>
      <router-link to="/playlists" class="text-sm text-gray-500 hover:underline">Back to playlists</router-link>
    </div>

    <!-- Add posts section -->
    <div class="bg-white rounded-xl border p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Add Posts</h2>
      <div class="flex gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search posts..."
          class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="onSearch"
        />
        <button @click="attachSelected" :disabled="selectedPostIds.length === 0" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">
          Add Selected ({{ selectedPostIds.length }})
        </button>
      </div>

      <div v-if="availablePosts.length > 0" class="mt-4 max-h-64 overflow-y-auto">
        <label v-for="post in availablePosts" :key="post.id" class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
          <input type="checkbox" :value="post.id" v-model="selectedPostIds" class="w-4 h-4 text-blue-600" />
          <span class="text-sm">{{ post.title }}</span>
          <span class="text-xs text-gray-400 ml-auto">{{ post.type }}</span>
        </label>
      </div>
      <p v-else-if="searchQuery" class="text-gray-500 text-sm mt-4">No posts found</p>
    </div>

    <!-- Current posts section -->
    <div class="bg-white rounded-xl border p-6">
      <h2 class="text-lg font-semibold mb-4">Current Posts ({{ playlistPosts.length }})</h2>

      <div v-if="playlistPosts.length === 0" class="text-center py-8 text-gray-500 text-sm">
        No posts in this playlist yet
      </div>

      <div v-else class="space-y-2">
        <div v-for="(item, index) in playlistPosts" :key="item.id" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <span class="text-gray-400 text-sm w-6 text-center">{{ index + 1 }}</span>
          <img v-if="item.post.cover" :src="item.post.cover" class="w-10 h-10 rounded object-cover" />
          <div class="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs" v-else>IMG</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ item.post.title }}</p>
            <p class="text-xs text-gray-400">{{ item.post.type }}</p>
          </div>
          <button @click="detachPost(item.postId)" class="text-xs text-red-600 hover:underline px-3 py-1">Remove</button>
        </div>
      </div>
    </div>

    <p v-if="message" class="text-green-600 text-sm mt-4 text-center">{{ message }}</p>
    <p v-if="error" class="text-red-500 text-sm mt-4 text-center">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/lib/api';

const route = useRoute();
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
const message = ref('');
const error = ref('');
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
  error.value = '';
  message.value = '';
  try {
    await api.post(`/admin/playlists/${slug}/posts`, { postIds: selectedPostIds.value });
    message.value = `${selectedPostIds.value.length} post(s) added`;
    selectedPostIds.value = [];
    await fetchPlaylistPosts();
    searchPosts(searchQuery.value);
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Failed to attach posts';
  }
}

async function detachPost(postId: string) {
  error.value = '';
  message.value = '';
  try {
    await api.delete(`/admin/playlists/${slug}/posts`, { data: { postIds: [postId] } });
    message.value = 'Post removed';
    await fetchPlaylistPosts();
    searchPosts(searchQuery.value);
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Failed to detach post';
  }
}
</script>
