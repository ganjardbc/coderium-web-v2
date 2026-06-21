<template>
  <!-- Reading progress bar -->
  <div
    class="reading-progress-bar"
    :style="{ width: readingProgress + '%' }"
    aria-hidden="true"
  />

  <div class="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-12">
    <!-- Loading skeleton -->
    <div v-if="pending" class="animate-pulse space-y-6">
      <div class="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/4"></div>
      <div class="h-8 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/2"></div>
      <div class="h-64 bg-gray-200 dark:bg-slate-800 rounded-xl w-full"></div>
    </div>

    <!-- Not found -->
    <div v-else-if="error" class="text-center py-10 md:py-20">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Story Not Found</h1>
      <p class="text-gray-500 dark:text-slate-400 mt-2">The article you are looking for might have been removed or unpublished.</p>
      <NuxtLink to="/" class="mt-6 inline-block px-5 py-2 rounded-full bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-slate-200 transition-colors">
        Back Home
      </NuxtLink>
    </div>

    <article v-else-if="post">
      <!-- Back link -->
      <NuxtLink to="/explore" class="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-slate-455 hover:text-gray-700 dark:hover:text-white transition-colors mb-6 md:mb-8">
        &larr; Back to Explore
      </NuxtLink>

      <!-- Post header -->
      <header class="space-y-3 md:space-y-4 mb-6 md:mb-8">
        <!-- Author row -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-slate-350 flex-shrink-0">
            {{ post.user?.name?.charAt(0).toUpperCase() ?? '?' }}
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ post.user?.name }}</p>
            <p class="text-xs text-gray-400 dark:text-slate-500">
              {{ formatDate(post.publishedAt) }} &bull; {{ readingTimeDisplay }}
            </p>
          </div>
        </div>

        <!-- Title & subtitle -->
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">{{ post.title }}</h1>
        <p v-if="post.subtitle" class="text-lg md:text-xl text-gray-500 dark:text-slate-400 leading-relaxed">{{ post.subtitle }}</p>

        <!-- Stats row -->
        <div class="flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-4">
          <div class="flex items-center gap-3 text-sm text-gray-400 dark:text-slate-500">
            <span class="px-2 py-0.5 rounded-full border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-xs capitalize">{{ post.type }}</span>
            <span>{{ post.viewsCount }} views</span>
          </div>
          <!-- Mobile like button -->
          <button
            @click="toggleLike"
            :disabled="likeLoading"
            class="lg:hidden inline-flex items-center gap-1.5 text-sm transition-colors cursor-pointer"
            :class="[liked ? 'text-red-500' : 'text-gray-400 dark:text-slate-500 hover:text-red-400', { 'clap-animate': liked }]"
          >
            <span class="text-base">♥</span>
            <span>{{ post.likesCount }}</span>
          </button>
        </div>
      </header>

      <!-- Cover Image -->
      <div v-if="post.cover" class="rounded-lg overflow-hidden aspect-video bg-gray-100 dark:bg-slate-900 mb-10 border border-gray-100 dark:border-slate-800">
        <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover" />
      </div>

      <!-- Content -->
      <section v-if="post.content" class="prose-medium">
        <div v-html="renderMarkdown(post.content)"></div>
      </section>

      <!-- Tags -->
      <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 pt-8 mt-8 border-t border-gray-100 dark:border-slate-800">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="px-3 py-1 text-xs rounded-full border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:border-gray-450 dark:hover:border-slate-600 transition-colors"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Written by -->
      <div class="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-2xl font-bold text-gray-500 dark:text-slate-405 flex-shrink-0">
            {{ post.user?.name?.charAt(0).toUpperCase() ?? '?' }}
          </div>
          <div class="flex justify-between items-center flex-1">
            <div class="flex-1">
              <p class="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider font-medium">Written by</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{{ post.user?.name }}</p>
            </div>
            <NuxtLink
              to="/explore"
              class="mt-2 inline-block text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              More stories &rarr;
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- More from Coderium -->
      <div class="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800 text-center">
        <p class="text-sm text-gray-400 dark:text-slate-500 mb-3">Enjoyed this story?</p>
        <NuxtLink
          to="/explore"
          class="inline-block px-5 py-2 rounded-full border border-gray-300 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-slate-300 hover:border-gray-500 dark:hover:border-slate-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Explore all stories
        </NuxtLink>
      </div>
    </article>
  </div>

  <!-- Floating clap button (desktop only) -->
  <div
    v-if="post && !pending && !error"
    class="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-2 z-40"
  >
    <button
      @click="toggleLike"
      :disabled="likeLoading"
      class="w-10 h-10 rounded-full border flex items-center justify-center transition-colors group cursor-pointer"
      :class="[
        liked ? 'border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/20' : 'border-gray-200 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600',
        { 'clap-animate': liked }
      ]"
      :aria-label="liked ? 'Unlike' : 'Like'"
    >
      <span
        class="text-lg transition-colors"
        :class="liked ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-700 dark:group-hover:text-slate-200'"
      >♥</span>
    </button>
    <span class="text-xs text-gray-400 dark:text-slate-550">{{ post?.likesCount }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const slug = route.params.slug as string;

const config = useRuntimeConfig();
const apiBase = config.public.apiBase as string;

interface Author {
  name: string;
  avatarUrl?: string | null;
}

interface PostData {
  id: string;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  type: string;
  cover?: string | null;
  tags?: string[];
  publishedAt: string;
  viewsCount: number;
  likesCount: number;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  user?: Author;
}

const { data: postRes, pending, error } = await useAsyncData<{ data: PostData }>(
  `post-${slug}`,
  () => $fetch(`${apiBase}/posts/${slug}`)
);
const post = computed(() => postRes.value?.data);

if (postRes.value?.data) {
  const p = postRes.value.data;
  useHead({
    title: `${p.title} - Coderium`,
    meta: [
      { name: 'description', content: p.metaDescription || p.subtitle || '' },
      { name: 'keywords', content: p.metaKeywords || (p.tags || []).join(', ') },
      { property: 'og:title', content: p.title },
      { property: 'og:description', content: p.metaDescription || p.subtitle || '' },
      { property: 'og:image', content: p.cover || '' },
      { property: 'og:type', content: 'article' },
    ],
  });
}

// Reading progress
const readingProgress = ref(0);

function updateProgress() {
  const el = document.documentElement;
  const scrollTop = el.scrollTop || document.body.scrollTop;
  const scrollHeight = el.scrollHeight - el.clientHeight;
  readingProgress.value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true });
  $fetch(`${apiBase}/posts/${slug}/view`, { method: 'POST' }).catch(() => {});
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress);
});

// Reading time
const readingTimeDisplay = computed(() => {
  const text = post.value?.content ?? post.value?.subtitle ?? post.value?.title ?? '';
  const mins = Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
  return `${mins} min read`;
});

// Like/clap
const liked = ref(false);
const likeLoading = ref(false);

async function toggleLike() {
  if (likeLoading.value || !post.value) return;
  likeLoading.value = true;
  try {
    const { data } = await $fetch<{ data: { liked: boolean } }>(`${apiBase}/posts/${slug}/like`, { method: 'POST' });
    liked.value = data.liked;
    if (data.liked) {
      post.value.likesCount++;
    } else {
      post.value.likesCount--;
    }
  } catch {
    // ignore
  } finally {
    likeLoading.value = false;
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderMarkdown(content: string): string {
  return content
    .replace(/\n\n/g, '</p><p class="mt-4">')
    .replace(/\n/g, '<br />')
    .replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
</script>
