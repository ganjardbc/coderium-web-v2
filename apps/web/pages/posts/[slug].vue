<template>
  <div class="max-w-3xl mx-auto py-12 px-4">
    <div v-if="pending" class="animate-pulse space-y-6">
      <div class="h-6 bg-gray-200 rounded-sm w-1/4"></div>
      <div class="h-10 bg-gray-200 rounded-sm w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded-sm w-1/2"></div>
      <div class="h-64 bg-gray-200 rounded-2xl w-full"></div>
    </div>

    <div v-else-if="error" class="text-center py-20 bg-gray-50 rounded-2xl border">
      <h1 class="text-2xl font-bold text-gray-800">Story Not Found</h1>
      <p class="text-gray-500 mt-2">The article you are looking for might have been removed or unpublished.</p>
      <NuxtLink to="/" class="mt-6 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700">
        Back Home
      </NuxtLink>
    </div>

    <article v-else-if="post" class="space-y-8">
      <!-- Back Link -->
      <NuxtLink to="/explore" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
        &larr; Back to Explore
      </NuxtLink>

      <!-- Post Header -->
      <header class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 text-xs font-semibold uppercase rounded-full bg-blue-50 text-blue-700">
            {{ post.type }}
          </span>
          <span class="text-xs text-gray-400">Published {{ formatDate(post.publishedAt) }}</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 leading-tight">{{ post.title }}</h1>
        <p v-if="post.subtitle" class="text-xl text-gray-500 font-medium leading-relaxed">{{ post.subtitle }}</p>

        <!-- Author / Views -->
        <div class="flex items-center justify-between border-y border-gray-100 py-4 mt-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {{ post.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ post.user?.name }}</p>
              <p class="text-xs text-gray-400">Author</p>
            </div>
          </div>
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span>{{ post.viewsCount }} views</span>
            <button @click="toggleLike" :disabled="likeLoading" class="inline-flex items-center gap-1 hover:text-red-500 transition-colors" :class="{ 'text-red-500': liked }">
              <span>❤️</span>
              <span>{{ post.likesCount }}</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Cover Image -->
      <div v-if="post.cover" class="rounded-3xl overflow-hidden aspect-video bg-gray-100 border">
        <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover" />
      </div>

      <!-- Content -->
      <section v-if="post.content" class="prose max-w-none text-gray-800 leading-relaxed space-y-6">
        <div v-html="renderMarkdown(post.content)"></div>
      </section>

      <!-- Tags -->
      <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
        <span v-for="tag in post.tags" :key="tag" class="px-2.5 py-1 text-xs rounded-lg bg-gray-50 border text-gray-600">
          #{{ tag }}
        </span>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

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

// Fetch post detail
const { data: postRes, pending, error } = await useAsyncData<{ data: PostData }>(
  `post-${slug}`,
  () => $fetch(`${apiBase}/posts/${slug}`)
);
const post = computed(() => postRes.value?.data);

// Setup SEO
if (postRes.value?.data) {
  const p = postRes.value.data;
  useHead({
    title: `${p.title} - Coderium`,
    meta: [
      { name: 'description', content: p.metaDescription || p.subtitle || '' },
      { name: 'keywords', content: p.metaKeywords || (p.tags || []).join(', ') },
      // Open Graph
      { property: 'og:title', content: p.title },
      { property: 'og:description', content: p.metaDescription || p.subtitle || '' },
      { property: 'og:image', content: p.cover || '' },
      { property: 'og:type', content: 'article' },
    ],
  });
}

// Engagement tracking
const liked = ref(false);
const likeLoading = ref(false);

onMounted(() => {
  // Track view on client mount
  $fetch(`${apiBase}/posts/${slug}/view`, { method: 'POST' }).catch(() => {});
});

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

// Very simple raw text to HTML converter (since we don't have markdown parser library installed)
function renderMarkdown(content: string): string {
  return content
    .replace(/\n\n/g, '</p><p class="mt-4">')
    .replace(/\n/g, '<br />')
    .replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-black text-gray-900 mt-8 mb-4">$1</h1>')
    .replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-6 mb-3">$1</h2>')
    .replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-semibold text-gray-900 mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
</script>
