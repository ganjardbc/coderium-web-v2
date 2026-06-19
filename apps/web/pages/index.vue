<template>
  <div class="space-y-16">
    <!-- Hero Section -->
    <section class="text-center py-20 bg-linear-to-r from-blue-50 to-indigo-50 rounded-3xl px-6">
      <h1 class="text-5xl font-black tracking-tight text-gray-900 mb-6">
        Coderium <span class="text-blue-600">V2</span>
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Discover articles, video tutorials, stack galleries, and curated playlists on modern web development and software architecture.
      </p>
      <div class="flex justify-center gap-4">
        <NuxtLink to="/explore" class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
          Explore Content
        </NuxtLink>
        <NuxtLink to="/playlists" class="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border hover:bg-gray-50 transition-colors">
          Browse Playlists
        </NuxtLink>
      </div>
    </section>

    <!-- Recent Content Grid -->
    <section>
      <div class="flex justify-between items-end mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Recent Stories</h2>
          <p class="text-gray-500 mt-1">Our latest publications and guides</p>
        </div>
        <NuxtLink to="/explore" class="text-blue-600 hover:underline font-medium text-sm">
          View all &rarr;
        </NuxtLink>
      </div>

      <div v-if="pending" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="animate-pulse space-y-4">
          <div class="bg-gray-200 h-48 rounded-2xl w-full"></div>
          <div class="h-4 bg-gray-200 rounded-sm w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded-sm w-1/2"></div>
        </div>
      </div>

      <div v-else-if="recentPosts.length === 0" class="text-center py-12 text-gray-500">
        No stories published yet.
      </div>

      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <article v-for="post in recentPosts" :key="post.id" class="group flex flex-col bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow">
          <NuxtLink :to="`/posts/${post.slug}`" class="block aspect-video bg-gray-100 overflow-hidden relative">
            <img v-if="post.cover" :src="post.cover" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl bg-gray-50">CODERIUM</div>
            <span class="absolute top-3 left-3 px-2.5 py-0.5 text-xs font-semibold uppercase rounded-full bg-white/95 text-gray-800 backdrop-blur-xs shadow-xs">{{ post.type }}</span>
          </NuxtLink>
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div class="space-y-2">
              <span class="text-xs text-gray-400 font-medium">{{ formatDate(post.publishedAt) }}</span>
              <h3 class="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                <NuxtLink :to="`/posts/${post.slug}`">{{ post.title }}</NuxtLink>
              </h3>
              <p v-if="post.subtitle" class="text-gray-500 text-sm line-clamp-2">{{ post.subtitle }}</p>
            </div>
            <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <span class="text-xs text-gray-600 font-medium">{{ post.user?.name }}</span>
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <span>{{ post.viewsCount }} views</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Popular and Spotlight Section -->
    <div class="grid lg:grid-cols-3 gap-12">
      <!-- Popular Posts -->
      <section class="lg:col-span-2 space-y-6">
        <h2 class="text-2xl font-bold text-gray-900">Popular on Coderium</h2>
        <div v-if="pendingPopular" class="space-y-4">
          <div v-for="i in 3" :key="i" class="animate-pulse flex gap-4">
            <div class="bg-gray-200 w-24 h-16 rounded-xl flex-shrink-0"></div>
            <div class="flex-1 space-y-2 py-1">
              <div class="h-4 bg-gray-200 rounded-sm w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded-sm w-1/2"></div>
            </div>
          </div>
        </div>
        <div v-else-if="popularPosts.length === 0" class="text-gray-500 py-4">No popular posts yet.</div>
        <div v-else class="divide-y divide-gray-100">
          <div v-for="(post, index) in popularPosts" :key="post.id" class="flex gap-4 py-4 first:pt-0 last:pb-0 group">
            <span class="text-3xl font-black text-gray-200 w-8 text-center flex-shrink-0 align-top">{{ index + 1 }}</span>
            <div class="flex-1 min-w-0">
              <span class="text-xs text-blue-600 font-semibold uppercase">{{ post.type }}</span>
              <h3 class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mt-0.5">
                <NuxtLink :to="`/posts/${post.slug}`">{{ post.title }}</NuxtLink>
              </h3>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(post.publishedAt) }} &bull; {{ post.viewsCount }} views</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Sidebar Promo -->
      <section class="bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between aspect-square lg:aspect-auto">
        <div>
          <span class="px-2.5 py-1 bg-blue-600 text-xs font-semibold rounded-full uppercase tracking-wider">Curated Playlists</span>
          <h2 class="text-2xl font-bold mt-4 leading-tight">Master Topics with Curated Playlists</h2>
          <p class="text-slate-400 text-sm mt-3">
            Accelerate your learning path. Playlists guide you step-by-step from core concepts to advanced production setups.
          </p>
        </div>
        <NuxtLink to="/playlists" class="mt-8 px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl text-center hover:bg-slate-100 transition-colors block">
          Browse Playlists
        </NuxtLink>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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
  publishedAt: string;
  viewsCount: number;
  user?: Author;
}

// Fetch recent posts
const { data: recentRes, pending } = await useAsyncData<{ data: Post[] }>(
  'recentPosts',
  () => $fetch(`${apiBase}/posts/recent`)
);
const recentPosts = computed(() => recentRes.value?.data || []);

// Fetch popular posts
const { data: popularRes, pending: pendingPopular } = await useAsyncData<{ data: Post[] }>(
  'popularPosts',
  () => $fetch(`${apiBase}/posts/popular`)
);
const popularPosts = computed(() => popularRes.value?.data || []);

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>
