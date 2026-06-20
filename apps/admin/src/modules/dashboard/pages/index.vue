<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">Dashboard</h1>

    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-24"></div>
    </div>

    <template v-else>
      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
          <template #content>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
            <p class="text-2xl font-bold mt-1">{{ totalPosts }}</p>
          </template>
        </Card>
        <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
          <template #content>
            <p class="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
            <p class="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">{{ draftCount }}</p>
          </template>
        </Card>
        <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
          <template #content>
            <p class="text-sm text-gray-500 dark:text-gray-400">Views</p>
            <p class="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{{ viewsCount }}</p>
          </template>
        </Card>
        <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
          <template #content>
            <p class="text-sm text-gray-500 dark:text-gray-400">Likes</p>
            <p class="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{{ likesCount }}</p>
          </template>
        </Card>
      </div>

      <!-- Quick actions -->
      <div class="grid md:grid-cols-2 gap-6">
        <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
          <template #title><span class="text-base">Quick Actions</span></template>
          <template #content>
            <div class="space-y-2">
              <router-link v-slot="{ navigate }" to="/posts/create" custom>
                <Button label="New Post" icon="pi pi-plus" severity="secondary" variant="outlined" size="small" class="w-full !justify-start" @click="navigate" />
              </router-link>
              <router-link v-slot="{ navigate }" to="/posts" custom>
                <Button label="Manage Posts" icon="pi pi-list" severity="secondary" variant="outlined" size="small" class="w-full !justify-start" @click="navigate" />
              </router-link>
              <router-link v-slot="{ navigate }" to="/media" custom>
                <Button label="Media Library" icon="pi pi-images" severity="secondary" variant="outlined" size="small" class="w-full !justify-start" @click="navigate" />
              </router-link>
              <router-link v-slot="{ navigate }" to="/playlists" custom>
                <Button label="Manage Playlists" icon="pi pi-bars" severity="secondary" variant="outlined" size="small" class="w-full !justify-start" @click="navigate" />
              </router-link>
              <router-link v-slot="{ navigate }" to="/analytics" custom>
                <Button label="View Analytics" icon="pi pi-chart-bar" severity="secondary" variant="outlined" size="small" class="w-full !justify-start" @click="navigate" />
              </router-link>
            </div>
          </template>
        </Card>

        <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
          <template #title><span class="text-base">Account</span></template>
          <template #content>
            <div class="space-y-2">
              <router-link v-slot="{ navigate }" to="/settings/profile" custom>
                <Button label="Profile Settings" icon="pi pi-user" severity="secondary" variant="outlined" size="small" class="w-full !justify-start" @click="navigate" />
              </router-link>
              <router-link v-slot="{ navigate }" to="/settings/password" custom>
                <Button label="Change Password" icon="pi pi-lock" severity="secondary" variant="outlined" size="small" class="w-full !justify-start" @click="navigate" />
              </router-link>
              <router-link v-slot="{ navigate }" to="/users" custom>
                <Button label="User Management" icon="pi pi-users" severity="secondary" variant="outlined" size="small" class="w-full !justify-start" @click="navigate" />
              </router-link>
            </div>
          </template>
        </Card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Card, Button } from 'primevue';
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
