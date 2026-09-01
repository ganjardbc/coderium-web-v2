<template>
  <div class="w-full mx-auto px-4 md:px-6 py-6 md:py-10 space-y-10 md:space-y-14">
    <!-- Hero Section -->
    <section class="border-b border-gray-100 dark:border-gray-800 pb-8 md:pb-12">
      <h1 class="text-4xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
        Stay curious.
      </h1>
      <p class="mt-3 md:mt-4 text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md">
        Coderium curates trustworthy articles, tutorials, and insights on AI and software development — all in one place.
      </p>
      <div class="mt-6 flex gap-3">
        <NuxtLink
          to="/explore"
          class="px-5 py-2 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
        >
          Start reading
        </NuxtLink>
        <NuxtLink
          to="/playlists"
          class="px-5 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-gray-500 dark:hover:border-gray-500 transition-colors"
        >
          Browse series
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Product -->
    <section v-if="pendingProducts" class="border-b border-gray-100 dark:border-gray-800 pb-8 md:pb-12">
      <SkeletonBlock class="aspect-16/7 rounded-2xl w-full" />
    </section>
    <section v-else-if="featuredProduct" class="border-b border-gray-100 dark:border-gray-800 pb-8 md:pb-12">
      <FeaturedProductCard :product="featuredProduct" />
    </section>

    <!-- Recent Stories + Sidebar -->
    <div class="grid lg:grid-cols-3 gap-8 md:gap-12">
      <!-- Main: Recent Stories -->
      <section class="order-2 lg:order-1 lg:col-span-2">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">Recent Stories</h2>
          <NuxtLink to="/explore" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2">
            See all <Icon name="lucide:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Skeleton -->
        <div v-if="pending" class="divide-y divide-gray-100 dark:divide-gray-800">
          <div v-for="i in 3" :key="i" class="py-6 md:py-8 first:pt-0">
            <div class="flex gap-4 items-start justify-between">
              <div class="flex-1 space-y-3">
                <div class="flex items-center gap-2">
                  <SkeletonBlock class="w-6 h-6 rounded-full" />
                  <SkeletonBlock class="h-3 rounded w-24" />
                </div>
                <SkeletonBlock class="h-5 rounded w-3/4" />
                <SkeletonBlock class="h-3 rounded w-full" />
                <SkeletonBlock class="h-3 rounded w-1/2" />
              </div>
              <SkeletonBlock class="w-16 h-16 rounded shrink-0 ml-4" />
            </div>
          </div>
        </div>

        <!-- Empty -->
        <EmptyState v-else-if="recentPosts.length === 0" message="No stories published yet." padding="py-8 md:py-12" />

        <!-- Article list -->
        <template v-else>
          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <PostListItem v-for="post in recentPosts" :key="post.id" :post="post" />
          </div>

          <InfiniteScrollLoader v-if="loadingMore" />
          <EndOfListMessage v-else-if="recentFinished" message="You've reached the end. No more stories to show." />
          <div ref="recentSentinel" aria-hidden="true" class="h-px" />
        </template>
      </section>

      <!-- Sidebar -->
      <aside class="order-1 lg:order-2 space-y-10">
        <!-- Popular on Coderium -->
        <section>
          <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-5">Popular on Coderium</h3>

          <div v-if="pendingPopular" class="space-y-5">
            <div v-for="i in 3" :key="i" class="flex gap-3">
              <SkeletonBlock class="w-6 h-4 rounded shrink-0 mt-1" />
              <div class="flex-1 space-y-2">
                <SkeletonBlock class="h-3 rounded w-full" />
                <SkeletonBlock class="h-3 rounded w-2/3" />
              </div>
            </div>
          </div>

          <EmptyState v-else-if="popularPosts.length === 0" message="No popular posts yet." padding="" :center="false" />

          <div v-else class="space-y-5">
            <PopularPostItem
              v-for="(post, index) in popularPosts"
              :key="post.id"
              :post="post"
              :rank="index + 1"
            />
          </div>
        </section>

        <!-- Series CTA -->
        <section class="border border-gray-100 dark:border-gray-800 rounded-xl p-5 bg-gray-50/50 dark:bg-dark-secondary/30">
          <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Curated Series</p>
          <h3 class="mt-2 text-base font-bold text-gray-900 dark:text-white leading-snug">
            Master topics with guided reading paths
          </h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Step-by-step series guide you from core concepts to advanced production setups.
          </p>
          <NuxtLink
            to="/playlists"
            class="mt-4 text-sm font-medium text-gray-900 dark:text-white hover:underline flex items-center gap-2"
          >
            Browse all series <Icon name="lucide:arrow-right" class="w-4 h-4 inline" />
          </NuxtLink>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { InfiniteListMeta } from '~/composables/useInfiniteList';

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Coderium - Web Development Resources & Guides',
  meta: [
    { name: 'description', content: 'Explore high quality web development articles, carousel summaries, video tutorials, and interactive galleries.' },
  ],
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase as string;

interface Author {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  type: string;
  cover?: string | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt: string;
  viewsCount: number;
  user?: Author;
}

const RECENT_LIMIT = 6;

const { data: recentFirstPage, pending } = await useAsyncData<{ data: Post[]; meta: InfiniteListMeta }>(
  'recentPosts',
  () => $fetch(`${apiBase}/posts?page=1&limit=${RECENT_LIMIT}`)
);

async function fetchRecentPage(page: number) {
  return $fetch<{ data: Post[]; meta: InfiniteListMeta }>(`${apiBase}/posts?page=${page}&limit=${RECENT_LIMIT}`);
}

const {
  items: recentPosts,
  loading: loadingMore,
  finished: recentFinished,
  sentinel: recentSentinel,
} = useInfiniteList(fetchRecentPage, recentFirstPage.value ?? null);

const { data: popularRes, pending: pendingPopular } = await useAsyncData<{ data: Post[] }>(
  'popularPosts',
  () => $fetch(`${apiBase}/posts/popular`)
);
const popularPosts = computed(() => popularRes.value?.data || []);

interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  cover?: string | null;
  featured?: boolean;
  order?: number;
}

const { data: productsRes, pending: pendingProducts } = await useAsyncData<{ data: Product[] }>(
  'homepageProducts',
  () => $fetch(`${apiBase}/products?limit=24`)
);
const featuredProduct = computed(() => productsRes.value?.data?.find((p) => p.featured) ?? null);
</script>
