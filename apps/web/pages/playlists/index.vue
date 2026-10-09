<template>
  <div class="page-shell">
    <PageHeader title="Series" lead="Kumpulan bacaan berurutan tentang pengembangan web dan arsitektur." />

    <!-- Skeleton -->
    <div v-if="pending" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div v-for="i in 6" :key="i" class="card overflow-hidden">
        <SkeletonBlock class="aspect-video w-full" />
        <div class="p-5 md:p-6 space-y-2">
          <SkeletonBlock class="h-3 rounded w-20" />
          <SkeletonBlock class="h-5 rounded w-3/4" />
          <SkeletonBlock class="h-3 rounded w-full" />
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
          class="group card flex flex-col overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
        >
          <!-- Cover -->
          <div class="aspect-video bg-gray-50 dark:bg-dark-secondary overflow-hidden">
            <img
              v-if="pl.cover"
              :src="pl.cover"
              :alt="pl.title"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-5xl font-black text-gray-200 dark:text-gray-800 select-none" aria-hidden="true">
                {{ pl.title.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>

          <!-- Body -->
          <div class="flex flex-1 flex-col p-5 md:p-6">
            <p class="font-mono text-xs font-medium uppercase tracking-wider text-primary dark:text-indigo-300">
              Series &bull; {{ pl._count?.posts || 0 }} artikel
            </p>
            <h2 class="mt-2 text-lg md:text-xl font-bold leading-snug text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
              {{ pl.title }}
            </h2>
            <p v-if="pl.description" class="mt-2 text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
              {{ pl.description }}
            </p>
            <div class="mt-auto pt-5 flex items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span v-if="pl.user?.name" class="truncate">Oleh {{ pl.user.name }}</span>
              <Icon name="lucide:arrow-right" class="ml-auto w-5 h-5 shrink-0 text-gray-400 dark:text-gray-700 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" aria-hidden="true" />
            </div>
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
