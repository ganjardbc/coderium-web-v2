<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <!-- Header -->
    <div class="border-b border-gray-100 pb-6 mb-8">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Series</h1>
      <p class="text-gray-500 mt-1 text-sm">Curated reading paths on web development and architecture</p>
    </div>

    <!-- Skeleton -->
    <div v-if="pending" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="animate-pulse border border-gray-100 rounded-lg overflow-hidden">
        <div class="aspect-[4/3] bg-gray-200 w-full"></div>
        <div class="p-4 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="playlists.length === 0" class="text-center py-16 text-gray-400">
      <p>No series created yet. Check back later!</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="pl in playlists"
        :key="pl.id"
        :to="`/playlists/${pl.slug}`"
        class="group block border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors"
      >
        <!-- Cover -->
        <div class="aspect-[4/3] bg-gray-100 overflow-hidden relative">
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
            <span class="text-5xl font-black text-gray-200 select-none">
              {{ pl.title.charAt(0).toUpperCase() }}
            </span>
          </div>
          <span class="absolute top-3 left-3 px-2 py-0.5 bg-black/60 text-white text-xs font-medium rounded">
            {{ pl._count?.posts || 0 }} stories
          </span>
        </div>

        <!-- Body -->
        <div class="p-4">
          <h2 class="font-bold text-gray-900 leading-snug group-hover:text-gray-600 transition-colors line-clamp-2">
            {{ pl.title }}
          </h2>
          <p v-if="pl.description" class="text-sm text-gray-500 mt-1 line-clamp-2">
            {{ pl.description }}
          </p>
          <p class="text-xs text-gray-400 mt-3">By {{ pl.user?.name }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Series - Curated Tech Guides | Coderium',
  meta: [
    { name: 'description', content: 'Browse step-by-step guides and curated stories on web development and architecture.' },
  ],
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

const { data: playlistsRes, pending } = await useAsyncData<{ data: Playlist[] }>(
  'playlists',
  () => $fetch(`${apiBase}/playlists`)
);
const playlists = computed(() => playlistsRes.value?.data || []);
</script>
