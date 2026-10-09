<template>
  <div class="page-shell">
    <PageHeader title="Artikel" lead="Artikel, video, carousel, dan galeri tentang AI dan pengembangan software." />

    <!-- Search and type filter -->
    <div class="mb-6 md:mb-8 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
      <div class="relative lg:w-96 lg:shrink-0">
        <Icon
          name="lucide:search"
          class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
        />
        <input
          v-model="searchInput"
          type="search"
          placeholder="Cari artikel..."
          aria-label="Cari artikel"
          class="w-full min-h-11 pl-11 pr-4 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-indigo-300/40 transition-shadow"
          @input="onSearch"
        />
      </div>

      <div class="flex flex-wrap gap-2" role="group" aria-label="Filter tipe">
        <button
          v-for="t in types"
          :key="t.value"
          type="button"
          :aria-pressed="filterType === t.value"
          :class="filterType === t.value ? 'topic-pill-active' : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-500 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white'"
          class="inline-flex items-center min-h-11 px-4 rounded-full border text-sm font-semibold transition-colors cursor-pointer"
          @click="setType(t.value)"
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <!-- Active tag filter -->
    <div v-if="filterTag" class="flex flex-wrap items-center gap-2 mb-6 md:mb-8">
      <span class="text-sm text-gray-600 dark:text-gray-400">Difilter dengan tag:</span>
      <button
        type="button"
        :aria-label="`Hapus filter tag ${filterTag}`"
        class="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-full bg-primary text-white text-sm font-semibold cursor-pointer hover:bg-primary/90 transition-colors"
        @click="clearTag"
      >
        #{{ filterTag }} <Icon name="lucide:x" class="w-4 h-4" aria-hidden="true" />
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
      <p v-if="searchQuery" class="text-base">Tidak ada hasil untuk "<strong class="text-gray-600 dark:text-gray-400">{{ searchQuery }}</strong>"</p>
      <p v-else-if="filterTag" class="text-base">Belum ada artikel dengan tag "<strong class="text-gray-600 dark:text-gray-400">#{{ filterTag }}</strong>"</p>
      <p v-else class="text-base">Belum ada artikel. Silakan cek lagi nanti.</p>
    </EmptyState>

    <!-- Results -->
    <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
      <PostListItem v-for="post in items" :key="post.id" :post="post" />
    </div>

    <!-- Infinite scroll sentinel / loader / end message -->
    <InfiniteScrollLoader v-if="loading" />
    <EndOfListMessage v-else-if="finished && items.length > 0" message="Sudah sampai akhir. Tidak ada artikel lain." />
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
// same underlying content — keep only the bare /articles page indexable so
// search engines don't treat every query combination as a distinct page.
useSeo(() => ({
  title: 'Artikel',
  description: 'Telusuri dan cari artikel, video, carousel, dan galeri Coderium tentang AI dan pengembangan software.',
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
  { value: '', label: 'Semua' },
  { value: 'article', label: 'Artikel' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'video', label: 'Video' },
  { value: 'stack_gallery', label: 'Galeri' },
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
