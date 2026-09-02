<template>
  <div class="w-full mx-auto px-4 md:px-6 py-6 md:py-10">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">Explore</h1>

    <!-- Search bar -->
    <div class="relative mb-5 flex items-center">
      <Icon name="lucide:search" class="absolute left-4 top-3 md:top-4 w-5 h-5 text-gray-400 dark:text-gray-400" />
      <input
        v-model="searchInput"
        type="text"
        placeholder="Search stories..."
        class="w-full pl-11 pr-4 py-2.5 md:py-3 border border-gray-200 dark:border-gray-800 rounded-full bg-gray-50 dark:bg-dark-secondary focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 focus:bg-white dark:focus:bg-gray-800 text-sm md:text-base dark:text-gray-100 transition-colors"
        @input="onSearch"
      />
    </div>

    <!-- Type filter chips -->
    <div class="flex gap-2 flex-wrap mb-4">
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

    <!-- Active tag filter -->
    <div v-if="filterTag" class="flex items-center gap-2 mb-6 md:mb-8">
      <span class="text-xs md:text-sm text-gray-500 dark:text-gray-400">Filtered by tag:</span>
      <button
        @click="clearTag"
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs md:text-sm font-medium cursor-pointer"
      >
        #{{ filterTag }} <Icon name="lucide:x" class="w-3.5 h-3.5" />
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
    <EmptyState v-else-if="items.length === 0" padding="py-16">
      <p v-if="searchQuery" class="text-base">No results for "<strong class="text-gray-600 dark:text-gray-400">{{ searchQuery }}</strong>"</p>
      <p v-else-if="filterTag" class="text-base">No stories tagged "<strong class="text-gray-600 dark:text-gray-400">#{{ filterTag }}</strong>"</p>
      <p v-else class="text-base">No stories yet. Check back soon.</p>
    </EmptyState>

    <!-- Results -->
    <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
      <PostListItem v-for="post in items" :key="post.id" :post="post" />
    </div>

    <!-- Infinite scroll sentinel / loader / end message -->
    <InfiniteScrollLoader v-if="loading" />
    <EndOfListMessage v-else-if="finished && items.length > 0" message="You've reached the end. No more stories to show." />
    <div ref="sentinel" aria-hidden="true" class="h-px" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { InfiniteListMeta } from '~/composables/useInfiniteList';

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

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase as string;

// The URL query string is the single source of truth for search state
// (q, type, tags) so the current search is shareable/bookmarkable and
// survives refresh/back-forward navigation.
const searchQuery = computed(() => (route.query.q as string) ?? '');
const filterType = computed(() => (route.query.type as string) ?? '');
const filterTag = computed(() => (route.query.tags as string) ?? '');

// A specific search/filter result is a thin, ever-changing subset of the
// same underlying content — keep only the bare /explore page indexable so
// search engines don't treat every query combination as a distinct page.
useSeo(() => ({
  title: 'Explore',
  description: 'Browse and search Coderium stories — articles, videos, carousels, and galleries on AI and software development.',
  noindex: Boolean(searchQuery.value || filterType.value || filterTag.value),
}));

// Local buffer for the text input so typing feels instant; debounced into
// the URL rather than writing on every keystroke.
const searchInput = ref(searchQuery.value);
watch(searchQuery, (val) => {
  if (val !== searchInput.value) searchInput.value = val;
});

function updateQuery(patch: Record<string, string | undefined>) {
  router.replace({ query: { ...route.query, ...patch } });
}

async function fetchSearchPage(page: number) {
  const params: Record<string, string> = { page: String(page), limit: '10' };
  if (searchQuery.value) params.q = searchQuery.value;
  if (filterType.value) params.type = filterType.value;
  if (filterTag.value) params.tags = filterTag.value;

  const url = `${apiBase}/search?${new URLSearchParams(params).toString()}`;
  return $fetch<{ data: SearchResult[]; meta: InfiniteListMeta }>(url);
}

const { items, loading, finished, sentinel, reset } = useInfiniteList(fetchSearchPage);

const types = [
  { value: '', label: 'All' },
  { value: 'article', label: 'Articles' },
  { value: 'carousel', label: 'Carousels' },
  { value: 'video', label: 'Videos' },
  { value: 'stack_gallery', label: 'Galleries' },
];

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

watch(
  () => [route.query.q, route.query.type, route.query.tags],
  () => reset(),
  { immediate: true }
);

function onSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    updateQuery({ q: searchInput.value || undefined });
  }, 300);
}

function setType(val: string) {
  updateQuery({ type: val || undefined });
}

function clearTag() {
  updateQuery({ tags: undefined });
}
</script>
