<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-bold mb-6">Explore</h1>

    <!-- Search bar -->
    <div class="flex gap-3 mb-8">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search posts..."
        class="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        @input="onSearch"
      />
      <select v-model="filterType" @change="onSearch" class="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">All Types</option>
        <option value="article">Article</option>
        <option value="carousel">Carousel</option>
        <option value="video">Video</option>
        <option value="stack_gallery">Gallery</option>
      </select>
    </div>

    <!-- Results -->
    <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

    <div v-else-if="posts.length === 0" class="text-center py-12 text-gray-500">
      <p v-if="searchQuery">No results for "{{ searchQuery }}"</p>
      <p v-else>No posts yet</p>
    </div>

    <div v-else class="space-y-6">
      <NuxtLink
        v-for="post in posts"
        :key="post.id"
        :to="`/posts/${post.slug}`"
        class="block bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex gap-4">
          <div v-if="post.cover" class="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">{{ post.type }}</span>
              <span class="text-xs text-gray-400">{{ formatDate(post.publishedAt) }}</span>
            </div>
            <h2 class="text-lg font-semibold truncate">{{ post.title }}</h2>
            <p v-if="post.subtitle" class="text-gray-500 text-sm mt-1 line-clamp-2">{{ post.subtitle }}</p>
            <div class="flex items-center gap-3 mt-2 text-sm text-gray-400">
              <span>{{ post.user?.name }}</span>
              <span>{{ post.viewsCount }} views</span>
              <span>{{ post.likesCount }} likes</span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Pagination -->
    <div v-if="meta.totalPages > 1" class="flex justify-center gap-2 mt-8">
      <button
        v-for="p in meta.totalPages"
        :key="p"
        @click="fetchPosts(p)"
        :class="p === meta.page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        class="px-3 py-1 rounded text-sm transition-colors"
      >{{ p }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

useHead({ title: 'Explore - Coderium' });

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  type: string;
  cover?: string | null;
  publishedAt: string;
  viewsCount: number;
  likesCount: number;
  user?: { id: string; name: string; avatarUrl?: string | null };
}

interface SearchMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const config = useRuntimeConfig();
const apiBase = config.public.apiBase as string;

const searchQuery = ref('');
const filterType = ref('');
const posts = ref<SearchResult[]>([]);
const meta = ref<SearchMeta>({ page: 1, limit: 10, total: 0, totalPages: 0 });
const loading = ref(false);

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

onMounted(() => fetchPosts());

function onSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchPosts(), 300);
}

async function fetchPosts(page = 1) {
  loading.value = true;
  try {
    const params: Record<string, string> = { page: String(page), limit: '10' };
    if (searchQuery.value) params.q = searchQuery.value;
    if (filterType.value) params.type = filterType.value;

    const url = `${apiBase}/search?${new URLSearchParams(params).toString()}`;
    const { data, meta: responseMeta } = await $fetch<{ data: SearchResult[]; meta: SearchMeta }>(url);
    posts.value = data;
    meta.value = responseMeta;
  } catch {
    posts.value = [];
  } finally {
    loading.value = false;
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
</script>
