<template>
  <!-- Reading progress bar -->
  <div
    class="reading-progress-bar"
    :style="{ width: readingProgress + '%' }"
    aria-hidden="true"
  />

  <div class="page-shell">
    <!-- Loading skeleton -->
    <div v-if="pending" class="max-w-3xl space-y-6">
      <SkeletonBlock class="h-4 rounded w-1/4" />
      <SkeletonBlock class="h-8 rounded w-3/4" />
      <SkeletonBlock class="h-4 rounded w-1/2" />
      <SkeletonBlock class="h-64 rounded-xl w-full" />
    </div>

    <!-- Not found -->
    <NotFoundState
      v-else-if="error"
      title="Artikel tidak ditemukan"
      message="Artikel yang Anda cari mungkin sudah dihapus atau tidak lagi dipublikasikan."
    />

    <article v-else-if="post" class="relative isolate">
      <!-- Decorative backdrop: same full-bleed grid and glow as the homepage hero. -->
      <div
        class="pointer-events-none absolute -top-6 md:-top-18 left-1/2 -z-10 h-144 w-screen -translate-x-1/2 overflow-hidden"
        aria-hidden="true"
      >
        <div class="hero-grid absolute inset-0" />
        <div class="hero-glow absolute -top-40 right-[8%] h-136 w-136 rounded-full blur-3xl" />
      </div>

      <!-- Back link -->
      <BackButton
        label="Kembali"
        link-class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        class="mb-6 md:mb-8"
      />

      <!-- Post header -->
      <header>
        <p class="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full border border-primary/20 bg-primary/5 dark:bg-indigo-300/10 px-3.5 py-1.5 font-mono text-xs font-medium text-primary dark:text-indigo-300">
          <span>{{ postTypeLabel(post.type) }}</span>
          <span aria-hidden="true">&bull;</span>
          <span>{{ formatDate(post.publishedAt || post.createdAt, 'long') }}</span>
          <span aria-hidden="true">&bull;</span>
          <span>{{ readingTimeDisplay }}</span>
        </p>
        <h1 class="mt-5 md:mt-6 text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-balance text-gray-900 dark:text-white">
          {{ post.title }}
        </h1>
        <p v-if="post.subtitle" class="mt-4 md:mt-5 max-w-3xl text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
          {{ post.subtitle }}
        </p>
      </header>

      <!-- Cover Image -->
      <div
        v-if="post.cover"
        class="mt-8 md:mt-12 aspect-video md:aspect-21/9 rounded-2xl overflow-hidden bg-gray-100 dark:bg-dark-secondary ring-1 ring-primary/20 dark:ring-indigo-300/20 shadow-2xl shadow-primary/20"
      >
        <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover" />
      </div>

      <!-- Meta on the left, article body on the right (stacked below lg). -->
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] gap-8 lg:gap-16 py-8 md:py-12 border-b border-gray-100 dark:border-gray-800">
        <aside class="glass-card lg:sticky lg:top-24 lg:self-start space-y-6 p-5 md:p-6">
          <div class="flex items-center gap-4">
            <UserAvatar :name="post.user?.name" :avatar-url="post.user?.avatarUrl" size="lg" />
            <div class="min-w-0">
              <p class="font-mono text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">Ditulis oleh</p>
              <p class="mt-0.5 text-lg font-bold text-gray-900 dark:text-white">{{ post.user?.name }}</p>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="tag in post.tags"
              :key="tag"
              :to="{ path: '/articles', query: { tags: tag } }"
              class="inline-flex items-center min-h-11 lg:min-h-0 px-3 py-1 text-sm rounded-full border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              #{{ tag }}
            </NuxtLink>
          </div>

          <!-- View Original Article -->
          <a
            v-if="post.sourceUrl"
            :href="post.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline gap-2"
          >
            Lihat artikel asli<template v-if="sourceDomain"> di {{ sourceDomain }}</template>
            <Icon name="lucide:external-link" class="w-4 h-4 shrink-0" aria-hidden="true" />
          </a>
        </aside>

        <!-- Content -->
        <section v-if="post.content" class="prose-medium min-w-0">
          <div v-html="renderContent(post.content)"></div>
        </section>
      </div>

      <!-- Related Articles -->
      <section v-if="relatedPosts.length > 0" class="py-10 md:py-16 border-b border-gray-100 dark:border-gray-800">
        <h2 class="section-title mb-6 md:mb-8">Artikel terkait</h2>
        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <PostListItem v-for="related in relatedPosts" :key="related.id" :post="related" />
        </div>
      </section>

      <!-- More from Coderium -->
      <section class="py-10 md:py-16">
        <div class="glass-card relative isolate overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 md:p-10">
          <div class="hero-glow pointer-events-none absolute -top-32 -right-24 -z-10 h-80 w-80 rounded-full blur-3xl" aria-hidden="true" />
          <div>
            <p class="section-title">Suka artikel ini?</p>
            <p class="mt-2 body-copy">Baca artikel dan series lainnya dari Coderium.</p>
          </div>
          <NuxtLink to="/articles" class="btn btn-solid gap-2 shrink-0 shadow-lg shadow-primary/30">
            Lihat semua artikel
            <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
          </NuxtLink>
        </div>
      </section>

      <!-- Floating Action Bar: like, views, share -->
      <PostActionBar
        :likes-count="post.likesCount"
        :views-count="post.viewsCount"
        :liked="liked"
        :like-loading="likeLoading"
        :like-error="likeError"
        :copied-link="copiedLink"
        @toggle-like="toggleLike"
        @share="copyShareLink"
      />
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
  createdAt?: string;
  updatedAt?: string;
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

if (post.value) {
  const p = post.value;
  const description = p.metaDescription || p.subtitle || undefined;

  useSeo({
    title: p.title,
    description,
    keywords: p.metaKeywords || (p.tags || []).join(', ') || undefined,
    image: p.cover,
    type: 'article',
  });

  const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '');
  const postUrl = `${siteUrl}/articles/${slug}`;
  useJsonLd([
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description,
      image: p.cover ? [p.cover] : undefined,
      datePublished: p.publishedAt || p.createdAt,
      dateModified: p.updatedAt || p.publishedAt || p.createdAt,
      author: p.user?.name ? { '@type': 'Person', name: p.user.name } : undefined,
      publisher: { '@type': 'Organization', name: 'Coderium', logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.png` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    },
    breadcrumbJsonLd([
      { name: 'Beranda', url: siteUrl },
      { name: 'Artikel', url: `${siteUrl}/articles` },
      { name: p.title, url: postUrl },
    ]),
  ]);
} else if (error.value) {
  if (import.meta.server) {
    const event = useRequestEvent();
    if (event) setResponseStatus(event, 404);
  }
  useHead({ meta: [{ name: 'robots', content: 'noindex' }] });
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

// Hostname shown on the "View Original Article" button, e.g. "example.com"
const sourceDomain = computed(() => {
  if (!post.value?.sourceUrl) return '';
  try {
    return new URL(post.value.sourceUrl).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
});

// Like/clap
const liked = ref(false);
const likeLoading = ref(false);
const likeError = ref(false);
const copiedLink = ref(false);
let likeErrorTimeout: ReturnType<typeof setTimeout> | undefined;

async function toggleLike() {
  if (likeLoading.value || !post.value) return;

  // Optimistic update: flip the UI immediately, reconcile/revert once the
  // request settles so the interaction feels instant.
  const previousLiked = liked.value;
  const previousCount = post.value.likesCount;
  liked.value = !previousLiked;
  post.value.likesCount += liked.value ? 1 : -1;
  likeLoading.value = true;
  likeError.value = false;

  try {
    const { data } = await $fetch<{ data: { liked: boolean } }>(`${apiBase}/posts/${slug}/like`, { method: 'POST' });
    liked.value = data.liked;
  } catch {
    liked.value = previousLiked;
    post.value.likesCount = previousCount;
    likeError.value = true;
    clearTimeout(likeErrorTimeout);
    likeErrorTimeout = setTimeout(() => {
      likeError.value = false;
    }, 3000);
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
