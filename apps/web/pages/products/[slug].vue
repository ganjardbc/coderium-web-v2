<template>
  <div class="w-full mx-auto px-4 md:px-6 py-6 md:py-12">
    <!-- Loading -->
    <div v-if="pending" class="max-w-3xl mx-auto space-y-6">
      <SkeletonBlock class="h-4 rounded w-1/4" />
      <SkeletonBlock class="h-10 rounded w-3/4" />
      <SkeletonBlock class="h-4 rounded w-1/2" />
      <SkeletonBlock class="h-10 rounded-full w-40" />
    </div>

    <!-- Not found -->
    <div v-else-if="error" class="max-w-3xl mx-auto">
      <NotFoundState
        title="Product Not Found"
        message="The product you are looking for might have been removed or unpublished."
        back-label="Back to Products"
      />
    </div>

    <div v-else-if="product" class="max-w-3xl mx-auto">
      <BackButton
        label="Back to Products"
        link-class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        class="mb-6 md:mb-8"
      />

      <!-- Section 1: Hero -->
      <section class="pb-8 md:pb-12 border-b border-gray-100 dark:border-gray-800">
        <h1 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          {{ product.name }}
        </h1>
        <p v-if="product.tagline" class="mt-3 md:mt-4 text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
          {{ product.tagline }}
        </p>
        <a
          :href="product.ctaUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-6 inline-block px-6 py-2.5 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
        >
          {{ product.ctaLabel || 'Request pilot' }}
        </a>
      </section>

      <!-- Section 2: Pipeline strip -->
      <section
        v-if="product.pipelineSteps && product.pipelineSteps.length > 0"
        class="py-8 md:py-12 border-b border-gray-100 dark:border-gray-800"
      >
        <h2 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">How it works</h2>
        <div class="space-y-6">
          <div
            v-for="(step, index) in product.pipelineSteps"
            :key="index"
            class="flex gap-4 md:gap-5"
          >
            <span class="text-2xl font-black text-gray-300 dark:text-gray-700 w-8 shrink-0 leading-none select-none">
              0{{ index + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <h3 class="text-base md:text-lg font-bold text-gray-900 dark:text-white">{{ step.title }}</h3>
              <p v-if="step.description" class="mt-1 text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: Features -->
      <section
        v-if="product.features && product.features.length > 0"
        class="py-8 md:py-12 border-b border-gray-100 dark:border-gray-800"
      >
        <h2 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div
            v-for="(feature, index) in product.features"
            :key="index"
            class="p-4 md:p-5 rounded-xl border border-gray-100 dark:border-gray-800"
          >
            <h3 class="text-base font-bold text-gray-900 dark:text-white">{{ feature.title }}</h3>
            <p v-if="feature.description" class="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Section 4: Bukti -->
      <section v-if="hasBukti" class="py-8 md:py-12 border-b border-gray-100 dark:border-gray-800 space-y-8">
        <h2 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Bukti</h2>

        <!-- Sub-list: Dipelajari lewat -->
        <div v-if="hasPlaylist">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3">Dipelajari lewat</h3>
          <NuxtLink
            :to="`/playlists/${playlist?.slug}`"
            class="group flex gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <div
              v-if="playlist?.cover"
              class="w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-secondary"
            >
              <img :src="playlist.cover" :alt="playlist.title" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0 flex flex-col justify-center">
              <span class="text-[10px] md:text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">Playlist</span>
              <h4 class="text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors mt-0.5 leading-snug line-clamp-2">
                {{ playlist?.title }}
              </h4>
            </div>
          </NuxtLink>
        </div>

        <!-- Sub-list: Bacaan & konten terkait -->
        <div v-if="hasRelatedPosts">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3">Bacaan & konten terkait</h3>
          <div class="space-y-3">
            <NuxtLink
              v-for="post in relatedPosts"
              :key="post.id"
              :to="`/posts/${post.slug}`"
              class="group flex items-center gap-3 p-3 md:p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div class="flex-1 min-w-0">
                <span class="inline-block px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-800 text-[10px] md:text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1.5">
                  {{ postTypeLabel(post.type) }}
                </span>
                <h4 class="text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors leading-snug line-clamp-2">
                  {{ post.title }}
                </h4>
              </div>
              <Icon name="lucide:arrow-right" class="w-5 h-5 text-gray-400 dark:text-gray-700 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors shrink-0" />
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Section 5: CTA penutup -->
      <section class="py-8 md:py-12 text-center">
        <p class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Ready to piloting?</p>
        <a
          :href="product.ctaUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block px-6 py-2.5 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
        >
          {{ product.ctaLabel || 'Request pilot' }}
        </a>
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

interface ProductStep {
  title: string;
  description?: string;
}

interface ProductFeature {
  title: string;
  description?: string;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  cover?: string | null;
  pipelineSteps?: ProductStep[];
  features?: ProductFeature[];
  ctaLabel?: string | null;
  ctaUrl?: string;
}

interface PlaylistData {
  id: string;
  slug: string;
  title: string;
  cover?: string | null;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  type: string;
}

const { data: productRes, pending, error } = await useAsyncData<{ data: ProductData }>(
  `product-${slug}`,
  () => $fetch(`${apiBase}/products/${slug}`)
);
const product = computed(() => productRes.value?.data);

const { data: playlistRes, error: playlistError } = await useAsyncData<{ data: PlaylistData }>(
  `product-playlist-${slug}`,
  () => $fetch(`${apiBase}/playlists/${slug}`),
  { default: () => null }
);
const playlist = computed(() => playlistRes.value?.data);
const hasPlaylist = computed(() => !!playlist.value && !playlistError.value);

const { data: relatedRes } = await useAsyncData<{ data: RelatedPost[] }>(
  `product-related-${slug}`,
  () => $fetch(`${apiBase}/search?tags=${slug}&limit=6`),
  { default: () => ({ data: [] }) }
);
const relatedPosts = computed(() => relatedRes.value?.data || []);
const hasRelatedPosts = computed(() => relatedPosts.value.length > 0);

const hasBukti = computed(() => hasPlaylist.value || hasRelatedPosts.value);

const postTypeLabels: Record<string, string> = {
  article: 'Article',
  carousel: 'Carousel',
  video: 'Video',
  stack_gallery: 'Stack Gallery',
};

function postTypeLabel(type: string): string {
  return postTypeLabels[type] || type;
}

if (productRes.value?.data) {
  const p = productRes.value.data;
  useHead({
    title: `${p.name} - Coderium`,
    meta: [
      { name: 'description', content: p.tagline || p.description || '' },
      { property: 'og:title', content: p.name },
      { property: 'og:description', content: p.tagline || p.description || '' },
      { property: 'og:image', content: p.cover || '' },
    ],
  });
}
</script>
