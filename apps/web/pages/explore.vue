<template>
  <div class="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">Explore</h1>

    <!-- Search bar -->
    <div class="relative mb-5">
      <svg class="absolute left-4 top-3 md:top-3.5 w-5 h-5 text-gray-400 dark:text-slate-550" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search stories..."
        class="w-full pl-11 pr-4 py-2.5 md:py-3 border border-gray-200 dark:border-slate-800 rounded-full bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-slate-700 focus:bg-white dark:focus:bg-slate-850 text-sm md:text-base dark:text-slate-100 transition-colors"
        @input="onSearch"
      />
    </div>

    <!-- Type filter chips -->
    <div class="flex gap-2 flex-wrap mb-6 md:mb-8">
      <button
        v-for="t in types"
        :key="t.value"
        @click="setType(t.value)"
        :class="filterType === t.value ? 'topic-pill-active' : 'border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-gray-500 dark:hover:border-slate-500 hover:text-gray-900 dark:hover:text-white'"
        class="px-4 py-1.5 rounded-full border text-xs md:text-sm font-medium transition-colors cursor-pointer"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="divide-y divide-gray-100 dark:divide-slate-800">
      <div v-for="i in 5" :key="i" class="py-6 md:py-8 first:pt-0 animate-pulse">
        <div class="flex gap-4 items-start justify-between">
          <div class="flex-1 space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-800"></div>
              <div class="h-3 bg-gray-200 dark:bg-slate-800 rounded w-24"></div>
            </div>
            <div class="h-5 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 dark:bg-slate-800 rounded w-full"></div>
          </div>
          <div class="w-16 h-16 bg-gray-200 dark:bg-slate-800 rounded flex-shrink-0 ml-4"></div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="posts.length === 0" class="text-center py-16 text-gray-400 dark:text-slate-550">
      <p v-if="searchQuery" class="text-base">No results for "<strong class="text-gray-655 dark:text-slate-450">{{ searchQuery }}</strong>"</p>
      <p v-else class="text-base">No stories yet. Check back soon.</p>
    </div>

    <!-- Results -->
    <div v-else class="divide-y divide-gray-100 dark:divide-slate-850">
      <article
        v-for="post in posts"
        :key="post.id"
        class="py-5 md:py-8 first:pt-0 group"
      >
        <div class="flex items-start gap-4 justify-between">
          <div class="flex-1 min-w-0">
            <!-- Author row -->
            <div class="flex items-center gap-2 mb-3">
              <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-slate-350 flex-shrink-0">
                {{ post.user?.name?.charAt(0).toUpperCase() ?? '?' }}
              </div>
              <span class="text-sm text-gray-700 dark:text-slate-300 font-medium truncate">{{ post.user?.name }}</span>
              <span class="text-gray-300 dark:text-slate-800 text-sm">·</span>
              <span class="text-sm text-gray-400 dark:text-slate-500 flex-shrink-0">{{ formatDate(post.publishedAt) }}</span>
            </div>

            <!-- Title + subtitle -->
            <NuxtLink :to="`/posts/${post.slug}`" class="block">
              <h2 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors line-clamp-2">
                {{ post.title }}
              </h2>
              <p v-if="post.subtitle" class="mt-1 text-gray-505 dark:text-slate-405 text-sm line-clamp-2">
                {{ post.subtitle }}
              </p>
            </NuxtLink>

            <!-- Meta -->
            <div class="flex items-center gap-3 mt-3 text-xs text-gray-400 dark:text-slate-505">
              <span class="px-2 py-0.5 rounded-full border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-404 capitalize">
                {{ post.type }}
              </span>
              <span>{{ readingTime(post.subtitle ?? post.title) }}</span>
              <span>{{ post.viewsCount }} views</span>
              <span>{{ post.likesCount }} likes</span>
            </div>
          </div>

          <!-- Thumbnail -->
          <NuxtLink v-if="post.cover" :to="`/posts/${post.slug}`" class="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-sm overflow-hidden flex-shrink-0 ml-3 sm:ml-4 bg-gray-100 dark:bg-slate-900 border dark:border-slate-800">
            <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover" />
          </NuxtLink>
        </div>
      </article>
    </div>

    <!-- Pagination -->
    <div v-if="meta.totalPages > 1" class="flex justify-between items-center mt-10 pt-6 border-t border-gray-100 dark:border-slate-850 text-sm">
      <button
        v-if="meta.page > 1"
        @click="fetchPosts(meta.page - 1)"
        class="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        &larr; Previous
      </button>
      <span v-else class="text-gray-300 dark:text-slate-850">&larr; Previous</span>

      <span class="text-gray-400 dark:text-slate-500 text-xs">Page {{ meta.page }} of {{ meta.totalPages }}</span>

      <button
        v-if="meta.page < meta.totalPages"
        @click="fetchPosts(meta.page + 1)"
        class="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        Next &rarr;
      </button>
      <span v-else class="text-gray-300 dark:text-slate-850">Next &rarr;</span>
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

const types = [
  { value: '', label: 'All' },
  { value: 'article', label: 'Articles' },
  { value: 'carousel', label: 'Carousels' },
  { value: 'video', label: 'Videos' },
  { value: 'stack_gallery', label: 'Galleries' },
];

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

onMounted(() => fetchPosts());

function onSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchPosts(), 300);
}

function setType(val: string) {
  filterType.value = val;
  fetchPosts();
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

function readingTime(text?: string | null): string {
  if (!text) return '1 min read';
  const mins = Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
  return `${mins} min read`;
}
</script>
