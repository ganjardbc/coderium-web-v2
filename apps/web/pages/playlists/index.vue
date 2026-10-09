<template>
  <div class="page-shell">
    <PageHeader title="Series" lead="Kumpulan bacaan berurutan tentang pengembangan web dan arsitektur." />

    <!-- Skeleton -->
    <div v-if="pending" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div v-for="i in 6" :key="i" class="card overflow-hidden">
        <SkeletonBlock class="aspect-4/3 w-full" />
        <div class="p-4 space-y-2">
          <SkeletonBlock class="h-4 rounded w-3/4" />
          <SkeletonBlock class="h-3 rounded w-full" />
          <SkeletonBlock class="h-3 rounded w-1/2" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <EmptyState v-else-if="items.length === 0" message="Belum ada series. Silakan cek lagi nanti." padding="py-16" />

    <!-- Grid -->
    <template v-else>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <NuxtLink
        v-for="pl in items"
        :key="pl.id"
        :to="`/playlists/${pl.slug}`"
        class="group block card overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
      >
        <!-- Cover -->
        <div class="aspect-square bg-gray-100 dark:bg-dark overflow-hidden relative">
          <img
            v-if="pl.cover"
            :src="pl.cover"
            :alt="pl.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
          >
            <span class="text-5xl font-black text-gray-200 dark:text-gray-800 select-none">
              {{ pl.title.charAt(0).toUpperCase() }}
            </span>
          </div>
          <span class="absolute top-3 left-3 px-2 py-0.5 bg-black/60 text-white text-xs font-semibold rounded-full">
            {{ pl._count?.posts || 0 }} artikel
          </span>
        </div>

        <!-- Body -->
        <div class="p-5">
          <h2 class="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-snug group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
            {{ pl.title }}
          </h2>
          <p v-if="pl.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {{ pl.description }}
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-3">Oleh {{ pl.user?.name }}</p>
        </div>
      </NuxtLink>
      </div>

      <InfiniteScrollLoader v-if="loading" />
      <EndOfListMessage v-else-if="finished" message="Sudah sampai akhir. Tidak ada series lain." />
      <div ref="sentinel" aria-hidden="true" class="h-px" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { InfiniteListMeta } from '~/composables/useInfiniteList';

definePageMeta({
  layout: 'default',
});

useSeo({
  title: 'Series - Panduan teknologi pilihan',
  description: 'Telusuri panduan langkah demi langkah dan artikel pilihan tentang pengembangan web dan arsitektur.',
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase as string;

interface Author {
  name: string;
}

interface Playlist {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  cover?: string | null;
  user?: Author;
  _count?: { posts: number };
}

const LIMIT = 12;

const { data: firstPage, pending } = await useAsyncData<{ data: Playlist[]; meta: InfiniteListMeta }>(
  'playlists',
  () => $fetch(`${apiBase}/playlists?page=1&limit=${LIMIT}`)
);

async function fetchPlaylistsPage(page: number) {
  return $fetch<{ data: Playlist[]; meta: InfiniteListMeta }>(`${apiBase}/playlists?page=${page}&limit=${LIMIT}`);
}

const { items, loading, finished, sentinel } = useInfiniteList(fetchPlaylistsPage, firstPage.value ?? null);
</script>
