<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Analytics Dashboard</h1>

    <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

    <template v-else>
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl border p-5">
          <p class="text-sm text-gray-500">Total Posts</p>
          <p class="text-2xl font-bold mt-1">{{ overview.totalPosts }}</p>
          <p class="text-xs text-green-600 mt-1">{{ overview.publishedPosts }} published</p>
        </div>
        <div class="bg-white rounded-xl border p-5">
          <p class="text-sm text-gray-500">Total Views</p>
          <p class="text-2xl font-bold mt-1">{{ formatNumber(overview.totalViews) }}</p>
        </div>
        <div class="bg-white rounded-xl border p-5">
          <p class="text-sm text-gray-500">Total Likes</p>
          <p class="text-2xl font-bold mt-1">{{ formatNumber(overview.totalLikes) }}</p>
        </div>
        <div class="bg-white rounded-xl border p-5">
          <p class="text-sm text-gray-500">Media & Playlists</p>
          <p class="text-2xl font-bold mt-1">{{ overview.totalMedia }} / {{ overview.totalPlaylists }}</p>
        </div>
      </div>

      <!-- Top Posts -->
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border p-5">
          <h2 class="text-lg font-semibold mb-4">Top Posts by Views</h2>
          <div v-if="topByViews.length === 0" class="text-gray-500 text-sm py-4 text-center">No data yet</div>
          <div v-else class="space-y-3">
            <div v-for="(post, i) in topByViews" :key="post.id" class="flex items-center gap-3">
              <span class="text-gray-400 text-sm w-5">{{ i + 1 }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ post.title }}</p>
                <p class="text-xs text-gray-400">{{ post.type }}</p>
              </div>
              <span class="text-sm font-semibold text-blue-600">{{ formatNumber(post.viewsCount) }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border p-5">
          <h2 class="text-lg font-semibold mb-4">Top Posts by Likes</h2>
          <div v-if="topByLikes.length === 0" class="text-gray-500 text-sm py-4 text-center">No data yet</div>
          <div v-else class="space-y-3">
            <div v-for="(post, i) in topByLikes" :key="post.id" class="flex items-center gap-3">
              <span class="text-gray-400 text-sm w-5">{{ i + 1 }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ post.title }}</p>
                <p class="text-xs text-gray-400">{{ post.type }}</p>
              </div>
              <span class="text-sm font-semibold text-red-600">{{ formatNumber(post.likesCount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Posts -->
      <div class="bg-white rounded-xl border p-5 mt-6">
        <h2 class="text-lg font-semibold mb-4">Recent Posts</h2>
        <div v-if="overview.recentPosts?.length === 0" class="text-gray-500 text-sm py-4 text-center">No posts yet</div>
        <div v-else class="space-y-3">
          <div v-for="post in overview.recentPosts" :key="post.id" class="flex items-center gap-3">
            <span class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">{{ post.type }}</span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ post.title }}</p>
            </div>
            <span class="text-xs text-gray-400">{{ post.viewsCount }} views</span>
            <span class="text-xs text-gray-400">{{ post.likesCount }} likes</span>
            <span class="text-xs text-gray-400">{{ post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '' }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
