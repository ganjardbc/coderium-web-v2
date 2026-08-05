<template>
  <div class="w-full mx-auto px-4 md:px-6 py-6 md:py-10">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">Explore</h1>

    <!-- Search bar -->
    <div class="relative mb-5 flex items-center">
      <Icon name="lucide:search" class="absolute left-4 top-3 md:top-4 w-5 h-5 text-gray-400 dark:text-gray-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search stories..."
        class="w-full pl-11 pr-4 py-2.5 md:py-3 border border-gray-200 dark:border-gray-800 rounded-full bg-gray-50 dark:bg-dark-secondary focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 focus:bg-white dark:focus:bg-gray-800 text-sm md:text-base dark:text-gray-100 transition-colors"
        @input="onSearch"
      />
    </div>

    <!-- Type filter chips -->
    <div class="flex gap-2 flex-wrap mb-6 md:mb-8">
      <button
        v-for="t in types"
        :key="t.value"
        @click="setType(t.value)"
        :class="filterType === t.value ? 'topic-pill-active' : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-500 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white'"
        class="px-4 py-1.5 rounded-full border text-xs md:text-sm font-medium transition-colors cursor-pointer"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="divide-y divide-gray-100 dark:divide-gray-800">
      <div v-for="i in 5" :key="i" class="py-6 md:py-8 first:pt-0">
        <div class="flex gap-4 items-start justify-between">
          <div class="flex-1 space-y-3">
            <div class="flex items-center gap-2">
              <SkeletonBlock class="w-6 h-6 rounded-full" />
              <SkeletonBlock class="h-3 rounded w-24" />
            </div>
            <SkeletonBlock class="h-5 rounded w-3/4" />
            <SkeletonBlock class="h-3 rounded w-full" />
          </div>
          <SkeletonBlock class="w-16 h-16 rounded shrink-0 ml-4" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <EmptyState v-else-if="posts.length === 0" padding="py-16">
      <p v-if="searchQuery" class="text-base">No results for "<strong class="text-gray-600 dark:text-gray-400">{{ searchQuery }}</strong>"</p>
      <p v-else class="text-base">No stories yet. Check back soon.</p>
    </EmptyState>

    <!-- Results -->
    <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
      <PostListItem v-for="post in posts" :key="post.id" :post="post" />
    </div>

    <!-- Pagination -->
    <div v-if="meta.totalPages > 1" class="flex justify-between items-center mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 text-sm">
      <button
        v-if="meta.page > 1"
        @click="fetchPosts(meta.page - 1)"
        class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <Icon name="lucide:arrow-left" class="w-4 h-4 inline" /> Previous
      </button>
      <span v-else class="text-gray-300 dark:text-gray-700"><Icon name="lucide:arrow-left" class="w-4 h-4 inline" /> Previous</span>

      <span class="text-gray-400 dark:text-gray-500 text-xs">Page {{ meta.page }} of {{ meta.totalPages }}</span>

      <button
        v-if="meta.page < meta.totalPages"
        @click="fetchPosts(meta.page + 1)"
        class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        Next <Icon name="lucide:arrow-right" class="w-4 h-4 inline" />
      </button>
      <span v-else class="text-gray-300 dark:text-gray-700">Next <Icon name="lucide:arrow-right" class="w-4 h-4 inline" /></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

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

const route = useRoute();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase as string;

const searchQuery = ref((route.query.q as string) ?? '');
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

watch(
  () => route.query.q,
  (q) => {
    searchQuery.value = (q as string) ?? '';
    fetchPosts();
  }
);

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

</script>
