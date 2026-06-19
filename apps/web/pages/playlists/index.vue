<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-gray-900">Curated Playlists</h1>
      <p class="text-gray-500 mt-1">Accelerate your knowledge with structured learning paths</p>
    </div>

    <div v-if="pending" class="grid sm:grid-cols-2 gap-8">
      <div v-for="i in 4" :key="i" class="animate-pulse space-y-4">
        <div class="bg-gray-200 h-48 rounded-2xl w-full"></div>
        <div class="h-4 bg-gray-200 rounded-sm w-3/4"></div>
      </div>
    </div>

    <div v-else-if="playlists.length === 0" class="text-center py-12 text-gray-500">
      No playlists created yet. Check back later!
    </div>

    <div v-else class="grid sm:grid-cols-2 gap-8">
      <NuxtLink
        v-for="pl in playlists"
        :key="pl.id"
        :to="`/playlists/${pl.slug}`"
        class="group flex flex-col bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="aspect-video bg-gray-100 overflow-hidden relative">
          <img v-if="pl.cover" :src="pl.cover" :alt="pl.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl bg-gray-50">PLAYLIST</div>
          <span class="absolute bottom-3 right-3 px-3 py-1 bg-black/60 text-white text-xs font-semibold rounded-lg backdrop-blur-xs">
            {{ pl._count?.posts || 0 }} stories
          </span>
        </div>
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
            {{ pl.title }}
          </h2>
          <p v-if="pl.description" class="text-gray-500 text-sm mt-2 line-clamp-2">{{ pl.description }}</p>
          <div class="flex items-center gap-2 mt-4 text-xs text-gray-400">
            <span>By {{ pl.user?.name }}</span>
          </div>
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
  title: 'Playlists - Curated Tech Guides',
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
