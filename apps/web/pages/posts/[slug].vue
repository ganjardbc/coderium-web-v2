<template>
  <!-- Reading progress bar -->
  <div
    class="reading-progress-bar"
    :style="{ width: readingProgress + '%' }"
    aria-hidden="true"
  />

  <div class="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-12">
    <!-- Loading skeleton -->
    <div v-if="pending" class="space-y-6">
      <SkeletonBlock class="h-4 rounded w-1/4" />
      <SkeletonBlock class="h-8 rounded w-3/4" />
      <SkeletonBlock class="h-4 rounded w-1/2" />
      <SkeletonBlock class="h-64 rounded-xl w-full" />
    </div>

    <!-- Not found -->
    <div v-else-if="error" class="text-center py-10 md:py-20">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Story Not Found</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">The article you are looking for might have been removed or unpublished.</p>
    </div>

    <article v-else-if="post">
      <!-- Back link -->
      <BackButton
        label="Back"
        link-class="text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
        class="mb-6 md:mb-8"
      />

      <!-- Post header -->
      <header class="space-y-3 md:space-y-4 mb-6">
        <!-- Author row -->
        <div class="flex items-center gap-3">
          <UserAvatar :name="post.user?.name" :avatar-url="post.user?.avatarUrl" size="md" />
          <div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ post.user?.name }}</p>
            <p class="text-xs text-gray-400 dark:text-gray-500">
              {{ formatDate(post.publishedAt, 'long') }} &bull; {{ readingTimeDisplay }}
            </p>
          </div>
        </div>

        <!-- Title & subtitle -->
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">{{ post.title }}</h1>
        <p v-if="post.subtitle" class="text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed">{{ post.subtitle }}</p>

        <!-- Action Bar (Top) -->
        <PostActionBar
          :likes-count="post.likesCount"
          :views-count="post.viewsCount"
          :liked="liked"
          :like-loading="likeLoading"
          :copied-link="copiedLink"
          @toggle-like="toggleLike"
          @share="copyShareLink"
        />
      </header>

      <!-- Cover Image -->
      <div v-if="post.cover" class="rounded-lg overflow-hidden aspect-video bg-gray-100 dark:bg-dark-secondary mb-10 border border-gray-100 dark:border-gray-800">
        <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover" />
      </div>

      <!-- View Original Article -->
      <a
        v-if="post.sourceUrl"
        :href="post.sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        View Original Article <Icon name="lucide:external-link" class="w-4 h-4" />
      </a>

      <!-- Content -->
      <section v-if="post.content" class="prose-medium">
        <div v-html="renderContent(post.content)"></div>
      </section>

      <!-- Tags -->
      <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 pt-8 mt-8 border-t border-gray-100 dark:border-gray-800">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="px-3 py-1 text-xs rounded-full border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Action Bar (Bottom) -->
      <PostActionBar
        :likes-count="post.likesCount"
        :views-count="post.viewsCount"
        :liked="liked"
        :like-loading="likeLoading"
        :copied-link="copiedLink"
        @toggle-like="toggleLike"
        @share="copyShareLink"
      />

      <!-- Written by -->
      <div class="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-5">
          <UserAvatar :name="post.user?.name" :avatar-url="post.user?.avatarUrl" size="lg" />
          <div class="flex justify-between items-center flex-1">
            <div class="flex-1">
              <p class="text-xs text-gray-400 dark:text-gray-400 uppercase tracking-wider font-medium">Written by</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{{ post.user?.name }}</p>
            </div>
            <NuxtLink
              to="/explore"
              class="mt-2 inline-block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              More stories <Icon name="lucide:arrow-right" class="w-4 h-4 inline" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Related Articles -->
      <div v-if="relatedPosts.length > 0" class="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
        <h2 class="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm mb-5">Related Articles</h2>
        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <PostListItem v-for="related in relatedPosts" :key="related.id" :post="related" />
        </div>
      </div>

      <!-- More from Coderium -->
      <div class="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
        <p class="text-sm text-gray-400 dark:text-gray-500 mb-3">Enjoyed this story?</p>
        <NuxtLink
          to="/explore"
          class="inline-block px-5 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Explore all stories
        </NuxtLink>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import DOMPurify from 'isomorphic-dompurify';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const router = useRouter();
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
  sourceUrl?: string | null;
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

// Related articles: prefer posts sharing a tag, then fill up with posts
// of the same type. Always excludes the current post itself.
interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  type: string;
  cover?: string | null;
  publishedAt: string;
  viewsCount: number;
  likesCount?: number;
  user?: Author;
}

const RELATED_LIMIT = 4;

const { data: relatedRes } = await useAsyncData<{ data: RelatedPost[] }>(
  `post-related-${slug}`,
  async () => {
    const current = post.value;
    if (!current) return { data: [] };

    const results: RelatedPost[] = [];
    const seenIds = new Set<string>();

    function addResults(list: RelatedPost[]) {
      for (const item of list) {
        if (item.slug === slug || seenIds.has(item.id)) continue;
        seenIds.add(item.id);
        results.push(item);
        if (results.length >= RELATED_LIMIT) break;
      }
    }

    const tags = (current.tags || []).filter(Boolean);
    if (tags.length > 0) {
      const byTags = await $fetch<{ data: RelatedPost[] }>(
        `${apiBase}/search?tags=${encodeURIComponent(tags.join(','))}&limit=${RELATED_LIMIT + 1}`
      );
      addResults(byTags.data);
    }

    if (results.length < RELATED_LIMIT) {
      const byType = await $fetch<{ data: RelatedPost[] }>(
        `${apiBase}/search?type=${current.type}&limit=${RELATED_LIMIT + 1 + results.length}`
      );
      addResults(byType.data);
    }

    return { data: results.slice(0, RELATED_LIMIT) };
  },
  { default: () => ({ data: [] }) }
);
const relatedPosts = computed(() => relatedRes.value?.data || []);

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
const readingTimeDisplay = computed(() =>
  readingTime(post.value?.content ?? post.value?.subtitle ?? post.value?.title ?? '')
);

// Like/clap
const liked = ref(false);
const likeLoading = ref(false);
const copiedLink = ref(false);

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

function copyShareLink() {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href);
    copiedLink.value = true;
    setTimeout(() => {
      copiedLink.value = false;
    }, 2000);
  }
}

// Post content is authored as HTML by the admin's rich text editor.
// Older posts stored as plain markdown-ish text (no HTML tags) still get
// a minimal conversion so they render correctly too.
const ALLOWED_TAGS = [
  'p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote',
  'a', 'b', 'i', 'u', 'strong', 'em', 's', 'strike', 'br', 'img',
  'code', 'pre', 'hr', 'span', 'div',
];
const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'title'];

function legacyMarkdownToHtml(content: string): string {
  return content
    .split(/\n{2,}/)
    .map((block) => {
      const heading = block.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        return `<h${level}>${heading[2]}</h${level}>`;
      }
      return `<p>${block.replace(/\n/g, '<br />')}</p>`;
    })
    .join('')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function renderContent(content: string): string {
  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(content);
  const html = looksLikeHtml ? content : legacyMarkdownToHtml(content);
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
</script>
