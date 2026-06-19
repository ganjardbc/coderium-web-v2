<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

    <template v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl border p-5">
          <p class="text-sm text-gray-500">Total Posts</p>
          <p class="text-2xl font-bold mt-1">{{ totalPosts }}</p>
        </div>
        <div class="bg-white rounded-xl border p-5">
          <p class="text-sm text-gray-500">Drafts</p>
          <p class="text-2xl font-bold mt-1 text-yellow-600">{{ draftCount }}</p>
        </div>
        <div class="bg-white rounded-xl border p-5">
          <p class="text-sm text-gray-500">Views</p>
          <p class="text-2xl font-bold mt-1 text-blue-600">{{ viewsCount }}</p>
        </div>
        <div class="bg-white rounded-xl border p-5">
          <p class="text-sm text-gray-500">Likes</p>
          <p class="text-2xl font-bold mt-1 text-red-600">{{ likesCount }}</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border p-5">
          <h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
          <div class="space-y-3">
            <router-link to="/posts/new/article" class="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm font-medium">+ New Article</router-link>
            <router-link to="/posts" class="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm font-medium">Manage Posts</router-link>
            <router-link to="/media" class="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm font-medium">Media Library</router-link>
            <router-link to="/playlists" class="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm font-medium">Manage Playlists</router-link>
            <router-link to="/analytics" class="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm font-medium">View Analytics</router-link>
          </div>
        </div>
        <div class="bg-white rounded-xl border p-5">
          <h2 class="text-lg font-semibold mb-4">Account</h2>
          <div class="space-y-3">
            <router-link to="/settings/profile" class="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm font-medium">Profile Settings</router-link>
            <router-link to="/settings/password" class="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm font-medium">Change Password</router-link>
            <router-link to="/users" class="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm font-medium">User Management</router-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/lib/api';

const totalPosts = ref(0);
const draftCount = ref(0);
const viewsCount = ref(0);
const likesCount = ref(0);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/analytics');
    totalPosts.value = data.data.totalPosts;
    draftCount.value = data.data.draftPosts;
    viewsCount.value = data.data.totalViews;
    likesCount.value = data.data.totalLikes;
  } finally {
    loading.value = false;
  }
});
</script>
