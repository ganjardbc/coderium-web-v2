<template>
  <div class="w-full mx-auto px-4 md:px-6 py-6 md:py-10">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Products</h1>
    <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
      Explore what we've built and the pilots you can start today.
    </p>

    <!-- Loading -->
    <div v-if="pending" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <SkeletonBlock class="aspect-video w-full" />
        <div class="p-4 md:p-5 space-y-2">
          <SkeletonBlock class="h-5 rounded w-3/4" />
          <SkeletonBlock class="h-4 rounded w-1/2" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <EmptyState v-else-if="items.length === 0" message="No products created yet. Check back later!" padding="py-16" />

    <!-- Grid -->
    <template v-else>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard v-for="product in items" :key="product.id" :product="product" />
      </div>

      <InfiniteScrollLoader v-if="loading" />
      <EndOfListMessage v-else-if="finished" message="You've reached the end. No more products to show." />
      <div ref="sentinel" aria-hidden="true" class="h-px" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { InfiniteListMeta } from '~/composables/useInfiniteList';

definePageMeta({
  layout: 'default',
});

useHead({ title: 'Products - Coderium' });

const config = useRuntimeConfig();
const apiBase = config.public.apiBase as string;

interface ProductListItem {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  cover?: string | null;
}

const LIMIT = 12;

const { data: firstPage, pending } = await useAsyncData<{ data: ProductListItem[]; meta: InfiniteListMeta }>(
  'products-index',
  () => $fetch(`${apiBase}/products?page=1&limit=${LIMIT}`)
);

async function fetchProductsPage(page: number) {
  return $fetch<{ data: ProductListItem[]; meta: InfiniteListMeta }>(`${apiBase}/products?page=${page}&limit=${LIMIT}`);
}

const { items, loading, finished, sentinel } = useInfiniteList(fetchProductsPage, firstPage.value ?? null);
</script>
