<template>
  <div class="max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-6">
    <div v-if="pending" class="animate-pulse space-y-6">
      <div class="h-6 bg-gray-200 dark:bg-slate-800 rounded-sm w-1/4"></div>
      <div class="h-10 bg-gray-200 dark:bg-slate-800 rounded-sm w-3/4"></div>
      <div class="h-4 bg-gray-200 dark:bg-slate-800 rounded-sm w-1/2"></div>
      <div class="h-64 bg-gray-200 dark:bg-slate-800 rounded-2xl w-full"></div>
    </div>

    <div v-else-if="error" class="text-center py-10 md:py-20 bg-gray-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-800">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Playlist Not Found</h1>
      <p class="text-gray-500 dark:text-slate-400 mt-2">The playlist you are looking for might have been removed or unpublished.</p>
      <NuxtLink to="/playlists" class="mt-6 inline-block px-6 py-2.5 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-700 dark:hover:bg-blue-650">
        Back to Playlists
      </NuxtLink>
    </div>

    <div v-else-if="playlist" class="space-y-8 md:space-y-12">
      <!-- Back Link -->
      <NuxtLink to="/playlists" class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        &larr; Back to Playlists
      </NuxtLink>

      <!-- Playlist Info Header -->
      <header class="flex flex-col md:flex-row gap-4 md:gap-8 items-start pb-6 md:pb-8 border-b dark:border-slate-800">
        <div v-if="playlist.cover" class="w-full md:w-64 aspect-video md:aspect-square rounded-2xl overflow-hidden border dark:border-slate-800 flex-shrink-0 bg-gray-50 dark:bg-slate-900">
          <img :src="playlist.cover" :alt="playlist.title" class="w-full h-full object-cover" />
        </div>
        <div class="space-y-3 md:space-y-4 flex-1">
          <span class="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full uppercase tracking-wider">Playlist</span>
          <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">{{ playlist.title }}</h1>
          <p v-if="playlist.description" class="text-gray-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">{{ playlist.description }}</p>
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
            <span>By {{ playlist.user?.name }}</span>
            <span>&bull;</span>
            <span>{{ playlist.posts?.length || 0 }} stories</span>
          </div>
        </div>
      </header>

      <!-- Playlist Posts List -->
      <section class="space-y-4 md:space-y-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Curated Stories in this Playlist</h2>

        <div v-if="!playlist.posts || playlist.posts.length === 0" class="text-gray-500 dark:text-slate-405 py-6 md:py-8 text-center bg-gray-50 dark:bg-slate-905 rounded-2xl border dark:border-slate-800">
          No stories added to this playlist yet.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(item, index) in playlist.posts"
            :key="item.id"
            class="group flex gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-sm transition-shadow relative"
          >
            <div class="text-xl md:text-2xl font-black text-gray-200 dark:text-slate-800 w-6 md:w-8 text-center flex-shrink-0 flex items-center justify-center">
              {{ index + 1 }}
            </div>
            <div v-if="item.post.cover" class="w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 border dark:border-slate-800 bg-gray-50 dark:bg-slate-955">
              <img :src="item.post.cover" :alt="item.post.title" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0 flex flex-col justify-center">
              <span class="text-[10px] md:text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">{{ item.post.type }}</span>
              <h3 class="text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5 leading-snug line-clamp-2">
                <NuxtLink :to="`/posts/${item.post.slug}`" class="after:absolute after:inset-0">{{ item.post.title }}</NuxtLink>
              </h3>
            </div>
            <div class="flex items-center flex-shrink-0 pr-1 md:pr-2">
              <span class="text-gray-350 dark:text-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg md:text-xl font-bold">&rarr;</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const slug = route.params.slug as string;

const config = useRuntimeConfig();
const apiBase = config.public.apiBase as string;

interface Author {
  name: string;
}

interface PostItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  cover?: string | null;
}

interface PlaylistPostItem {
  id: string;
  postId: string;
  order: number;
  post: PostItem;
}

interface PlaylistData {
  id: string;
  title: string;
  description?: string | null;
  cover?: string | null;
  user?: Author;
  posts?: PlaylistPostItem[];
}

const { data: playlistRes, pending, error } = await useAsyncData<{ data: PlaylistData }>(
  `playlist-${slug}`,
  () => $fetch(`${apiBase}/playlists/${slug}`)
);
const playlist = computed(() => playlistRes.value?.data);

// Setup SEO
if (playlistRes.value?.data) {
  const pl = playlistRes.value.data;
  useHead({
    title: `${pl.title} - Playlist`,
    meta: [
      { name: 'description', content: pl.description || '' },
      { property: 'og:title', content: pl.title },
      { property: 'og:description', content: pl.description || '' },
      { property: 'og:image', content: pl.cover || '' },
    ],
  });
}
</script>
