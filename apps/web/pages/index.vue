<template>
  <div class="max-w-5xl mx-auto px-6 py-10 space-y-14">
    <!-- Hero Section -->
    <section class="border-b border-gray-100 pb-12">
      <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-none">
        Stay curious.
      </h1>
      <p class="mt-4 text-lg text-gray-500 max-w-md">
        Discover stories, thinking, and expertise from writers on web development and software architecture.
      </p>
      <div class="mt-6 flex gap-3">
        <NuxtLink
          to="/explore"
          class="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Start reading
        </NuxtLink>
        <NuxtLink
          to="/playlists"
          class="px-5 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-500 transition-colors"
        >
          Browse series
        </NuxtLink>
      </div>
    </section>

    <!-- Recent Stories + Sidebar -->
    <div class="grid lg:grid-cols-3 gap-12">
      <!-- Main: Recent Stories -->
      <section class="lg:col-span-2">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-base font-bold text-gray-900 uppercase tracking-wider text-sm">Recent Stories</h2>
          <NuxtLink to="/explore" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            See all &rarr;
          </NuxtLink>
        </div>

        <!-- Skeleton -->
        <div v-if="pending" class="divide-y divide-gray-100">
          <div v-for="i in 3" :key="i" class="py-8 first:pt-0 animate-pulse">
            <div class="flex gap-4 items-start justify-between">
              <div class="flex-1 space-y-3">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-gray-200"></div>
                  <div class="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div class="h-5 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded w-full"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div class="w-20 h-20 bg-gray-200 rounded flex-shrink-0 ml-4"></div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="recentPosts.length === 0" class="py-12 text-center text-gray-400 text-sm">
          No stories published yet.
        </div>

        <!-- Article list -->
        <div v-else class="divide-y divide-gray-100">
          <article v-for="post in recentPosts" :key="post.id" class="py-8 first:pt-0 group">
            <div class="flex items-start gap-4 justify-between">
              <div class="flex-1 min-w-0">
                <!-- Author row -->
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                    {{ post.user?.name?.charAt(0).toUpperCase() ?? '?' }}
                  </div>
                  <span class="text-sm text-gray-700 font-medium truncate">{{ post.user?.name }}</span>
                  <span class="text-gray-300 text-sm">·</span>
                  <span class="text-sm text-gray-400 flex-shrink-0">{{ formatDate(post.publishedAt) }}</span>
                </div>

                <!-- Title + subtitle -->
                <NuxtLink :to="`/posts/${post.slug}`" class="block">
                  <h2 class="text-xl font-bold text-gray-900 leading-snug group-hover:text-gray-600 transition-colors line-clamp-2">
                    {{ post.title }}
                  </h2>
                  <p v-if="post.subtitle" class="mt-1 text-gray-500 text-sm line-clamp-2">
                    {{ post.subtitle }}
                  </p>
                </NuxtLink>

                <!-- Meta row -->
                <div class="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span class="px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 capitalize">
                    {{ post.type }}
                  </span>
                  <span>{{ readingTime(post.subtitle ?? post.title) }}</span>
                  <span>{{ post.viewsCount }} views</span>
                </div>
              </div>

              <!-- Thumbnail -->
              <NuxtLink v-if="post.cover" :to="`/posts/${post.slug}`" class="w-20 h-20 md:w-28 md:h-28 rounded-sm overflow-hidden flex-shrink-0 ml-4 bg-gray-100">
                <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover" />
              </NuxtLink>
            </div>
          </article>
        </div>
      </section>

      <!-- Sidebar -->
      <aside class="space-y-10">
        <!-- Popular on Coderium -->
        <section>
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Popular on Coderium</h3>

          <div v-if="pendingPopular" class="space-y-5">
            <div v-for="i in 3" :key="i" class="animate-pulse flex gap-3">
              <div class="w-6 h-4 bg-gray-200 rounded flex-shrink-0 mt-1"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3 bg-gray-200 rounded w-full"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>

          <div v-else-if="popularPosts.length === 0" class="text-sm text-gray-400">
            No popular posts yet.
          </div>

          <div v-else class="space-y-5">
            <div
              v-for="(post, index) in popularPosts"
              :key="post.id"
              class="flex gap-3 group"
            >
              <span class="text-2xl font-black text-gray-100 w-7 flex-shrink-0 leading-none mt-0.5 select-none">
                0{{ index + 1 }}
              </span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 mb-1">
                  <div class="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                    {{ post.user?.name?.charAt(0).toUpperCase() ?? '?' }}
                  </div>
                  <span class="text-xs text-gray-500 truncate">{{ post.user?.name }}</span>
                </div>
                <NuxtLink :to="`/posts/${post.slug}`">
                  <h4 class="text-sm font-bold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 leading-snug">
                    {{ post.title }}
                  </h4>
                </NuxtLink>
                <p class="text-xs text-gray-400 mt-1">{{ formatDate(post.publishedAt) }} &bull; {{ post.viewsCount }} views</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Series CTA -->
        <section class="border border-gray-100 rounded-xl p-5">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Curated Series</p>
          <h3 class="mt-2 text-base font-bold text-gray-900 leading-snug">
            Master topics with guided reading paths
          </h3>
          <p class="mt-2 text-sm text-gray-500">
            Step-by-step series guide you from core concepts to advanced production setups.
          </p>
          <NuxtLink
            to="/playlists"
            class="mt-4 inline-block text-sm font-medium text-gray-900 hover:underline"
          >
            Browse all series &rarr;
          </NuxtLink>
        </section>
      </aside>
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

const { data: recentRes, pending } = await useAsyncData<{ data: Post[] }>(
  'recentPosts',
  () => $fetch(`${apiBase}/posts/recent`)
);
const recentPosts = computed(() => recentRes.value?.data || []);

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

function readingTime(text?: string | null): string {
  if (!text) return '1 min read';
  const mins = Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
  return `${mins} min read`;
}
</script>
