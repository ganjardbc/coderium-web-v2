<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Analytics Dashboard</h1>

    <div v-if="loading" class="flex justify-center py-16">
      <ProgressSpinner />
    </div>

    <template v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
          <template #content>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
            <p class="text-2xl font-bold mt-1">{{ overview.totalPosts }}</p>
            <p class="text-xs text-green-600 mt-1">{{ overview.publishedPosts }} published</p>
          </template>
        </Card>
        <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
          <template #content>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
            <p class="text-2xl font-bold mt-1">{{ formatNumber(overview.totalViews) }}</p>
          </template>
        </Card>
        <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
          <template #content>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Likes</p>
            <p class="text-2xl font-bold mt-1">{{ formatNumber(overview.totalLikes) }}</p>
          </template>
        </Card>
        <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
          <template #content>
            <p class="text-sm text-gray-500 dark:text-gray-400">Media / Playlists</p>
            <p class="text-2xl font-bold mt-1">{{ overview.totalMedia }} / {{ overview.totalPlaylists }}</p>
          </template>
        </Card>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
          <template #title>
            <span class="text-base font-semibold">Top Posts by Views</span>
          </template>
          <template #content>
            <div v-if="topByViews.length === 0" class="text-gray-400 dark:text-gray-500 text-sm py-4 text-center">No data yet</div>
            <div v-else class="space-y-3">
              <div v-for="(post, i) in topByViews" :key="post.id" class="flex items-center gap-3">
                <span class="text-gray-400 text-sm font-mono w-6">{{ String(i + 1).padStart(2, '0') }}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ post.title }}</p>
                  <Tag :value="post.type" severity="secondary" class="capitalize text-xs mt-0.5" />
                </div>
                <span class="text-sm font-semibold text-blue-600">{{ formatNumber(post.viewsCount) }}</span>
              </div>
            </div>
          </template>
        </Card>

        <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
          <template #title>
            <span class="text-base font-semibold">Top Posts by Likes</span>
          </template>
          <template #content>
            <div v-if="topByLikes.length === 0" class="text-gray-400 dark:text-gray-500 text-sm py-4 text-center">No data yet</div>
            <div v-else class="space-y-3">
              <div v-for="(post, i) in topByLikes" :key="post.id" class="flex items-center gap-3">
                <span class="text-gray-400 text-sm font-mono w-6">{{ String(i + 1).padStart(2, '0') }}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ post.title }}</p>
                  <Tag :value="post.type" severity="secondary" class="capitalize text-xs mt-0.5" />
                </div>
                <span class="text-sm font-semibold text-red-600">{{ formatNumber(post.likesCount) }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <Card class="!shadow-none border border-gray-200 dark:border-gray-700 mt-6">
        <template #title>
          <span class="text-base font-semibold">Recent Posts</span>
        </template>
        <template #content>
          <div v-if="!overview.recentPosts?.length" class="text-gray-400 dark:text-gray-500 text-sm py-4 text-center">No posts yet</div>
          <div v-else class="space-y-3">
            <div v-for="post in overview.recentPosts" :key="post.id" class="flex items-center gap-3">
              <Tag :value="post.type" severity="secondary" class="capitalize text-xs shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ post.title }}</p>
              </div>
              <span class="text-xs text-gray-400 whitespace-nowrap">{{ formatNumber(post.viewsCount) }} views</span>
              <span class="text-xs text-gray-400 whitespace-nowrap">{{ formatNumber(post.likesCount) }} likes</span>
              <span class="text-xs text-gray-400 whitespace-nowrap">{{ post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '' }}</span>
            </div>
          </div>
        </template>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Card, Tag, ProgressSpinner } from 'primevue';
import api from '@/lib/api';

interface PostItem {
  id: string;
  title: string;
  type: string;
  viewsCount: number;
  likesCount: number;
  createdAt?: string;
}

interface OverviewData {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalMedia: number;
  totalPlaylists: number;
  recentPosts: PostItem[];
}

const overview = ref<OverviewData>({
  totalPosts: 0, publishedPosts: 0, draftPosts: 0,
  totalViews: 0, totalLikes: 0, totalMedia: 0, totalPlaylists: 0, recentPosts: [],
});
const topByViews = ref<PostItem[]>([]);
const topByLikes = ref<PostItem[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const [overviewRes, viewsRes, likesRes] = await Promise.all([
      api.get('/admin/analytics'),
      api.get('/admin/analytics/posts', { params: { sort: 'views', limit: 10 } }),
      api.get('/admin/analytics/posts', { params: { sort: 'likes', limit: 10 } }),
    ]);
    overview.value = overviewRes.data.data;
    topByViews.value = viewsRes.data.data;
    topByLikes.value = likesRes.data.data;
  } finally {
    loading.value = false;
  }
});

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}
</script>
