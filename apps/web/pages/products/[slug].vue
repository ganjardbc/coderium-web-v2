<template>
  <div class="page-shell">
    <!-- Loading -->
    <div v-if="pending" class="max-w-3xl space-y-6">
      <SkeletonBlock class="h-4 rounded w-1/4" />
      <SkeletonBlock class="h-10 rounded w-3/4" />
      <SkeletonBlock class="h-4 rounded w-1/2" />
      <SkeletonBlock class="h-10 rounded-full w-40" />
    </div>

    <!-- Not found -->
    <div v-else-if="error" class="text-center py-10 md:py-20">
      <h1 class="section-title">Produk tidak ditemukan</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Produk yang Anda cari mungkin sudah dihapus atau tidak lagi dipublikasikan.</p>
    </div>

    <div v-else-if="product">
      <BackButton
        label="Kembali"
        link-class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        class="mb-6 md:mb-8"
      />

      <!-- Section 1: Hero -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 lg:items-center pb-8 md:pb-12 border-b border-gray-100 dark:border-gray-800">
        <div>
          <p
            v-if="product.badge"
            class="mb-3 md:mb-4 text-sm font-bold uppercase tracking-wider text-primary dark:text-indigo-300"
          >
            {{ product.badge }}
          </p>
          <h1 class="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] text-balance text-gray-900 dark:text-white">
            {{ product.name }}
          </h1>
          <p v-if="product.tagline" class="mt-4 md:mt-5 text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ product.tagline }}
          </p>
          <a
            :href="product.ctaUrl"
            :target="ctaIsMailto ? undefined : '_blank'"
            :rel="ctaIsMailto ? undefined : 'noopener noreferrer'"
            class="btn btn-solid mt-6 md:mt-8"
          >
            {{ product.ctaLabel || 'Kirim email' }}
          </a>
        </div>
        <div
          v-if="product.cover"
          class="w-full aspect-video rounded-2xl overflow-hidden bg-gray-50 dark:bg-dark-secondary"
        >
          <img :src="product.cover" :alt="product.name" class="w-full h-full object-cover" />
        </div>
      </section>

      <!-- Description -->
      <section
        v-if="descriptionHtml"
        class="prose-medium py-8 md:py-12 border-b border-gray-100 dark:border-gray-800"
      >
        <div class="max-w-3xl" v-html="descriptionHtml"></div>
      </section>

      <!-- Section 2: Pipeline strip -->
      <section
        v-if="product.pipelineSteps && product.pipelineSteps.length > 0"
        class="py-8 md:py-12 border-b border-gray-100 dark:border-gray-800"
      >
        <h2 class="section-title mb-6 md:mb-8">Cara kerja</h2>
        <div class="max-w-3xl space-y-6">
          <div
            v-for="(step, index) in product.pipelineSteps"
            :key="index"
            class="flex gap-4 md:gap-5"
          >
            <span class="font-mono text-sm font-medium text-primary dark:text-indigo-300 w-8 shrink-0 pt-1 select-none">
              0{{ index + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <h3 class="text-base md:text-lg font-bold text-gray-900 dark:text-white">{{ step.title }}</h3>
              <p v-if="step.description" class="mt-1 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
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
        <h2 class="section-title mb-6 md:mb-8">Fitur</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div
            v-for="(feature, index) in product.features"
            :key="index"
            class="card p-6 md:p-8"
          >
            <h3 class="text-base md:text-lg font-bold text-gray-900 dark:text-white">{{ feature.title }}</h3>
            <p v-if="feature.description" class="mt-1.5 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Proof: numbers from our own usage (filled in via admin) -->
      <section v-if="hasProof" class="py-8 md:py-12 border-b border-gray-100 dark:border-gray-800">
        <h2 class="section-title mb-6 md:mb-8">
          Hasil dari pemakaian kami sendiri
        </h2>
        <dl v-if="proofMetrics.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div
            v-for="(metric, index) in proofMetrics"
            :key="index"
            class="card flex flex-col-reverse p-6 md:p-8"
          >
            <dt class="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-snug">{{ metric.label }}</dt>
            <dd class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">{{ metric.value }}</dd>
          </div>
        </dl>
        <p
          v-if="proofNote"
          class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line"
          :class="proofMetrics.length > 0 ? 'mt-4 md:mt-6' : ''"
        >
          {{ proofNote }}
        </p>
      </section>

      <!-- Section 4: Bukti -->
      <section v-if="hasBukti" class="py-8 md:py-12 border-b border-gray-100 dark:border-gray-800 space-y-8">
        <h2 class="section-title">Bukti</h2>

        <!-- Sub-list: Dipelajari lewat -->
        <div v-if="hasPlaylist" class="max-w-3xl">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3">Dipelajari lewat</h3>
          <NuxtLink
            :to="`/playlists/${playlist?.slug}`"
            class="group card flex gap-3 md:gap-4 p-4 md:p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <div
              v-if="playlist?.cover"
              class="w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-secondary"
            >
              <img :src="playlist.cover" :alt="playlist.title" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0 flex flex-col justify-center">
              <span class="text-xs text-primary dark:text-indigo-300 font-bold uppercase tracking-wider">Series</span>
              <h4 class="text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors mt-0.5 leading-snug line-clamp-2">
                {{ playlist?.title }}
              </h4>
            </div>
          </NuxtLink>
        </div>

        <!-- Sub-list: Bacaan & konten terkait -->
        <div v-if="hasRelatedPosts" class="max-w-3xl">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3">Bacaan & konten terkait</h3>
          <div class="space-y-3">
            <NuxtLink
              v-for="post in relatedPosts"
              :key="post.id"
              :to="`/posts/${post.slug}`"
              class="group card flex items-center gap-3 p-4 md:p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
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

      <!-- FAQ -->
      <section v-if="faqItems.length > 0" class="py-8 md:py-12 border-b border-gray-100 dark:border-gray-800">
        <h2 class="section-title mb-6 md:mb-8">FAQ</h2>
        <FaqAccordion :items="faqItems" class="max-w-3xl" />
      </section>

      <!-- Section 5: CTA penutup -->
      <section class="py-8 md:py-12">
        <p class="section-title mb-5">Siap memulai pilot?</p>
        <a
          :href="product.ctaUrl"
          :target="ctaIsMailto ? undefined : '_blank'"
          :rel="ctaIsMailto ? undefined : 'noopener noreferrer'"
          class="btn btn-solid"
        >
          {{ product.ctaLabel || 'Kirim email' }}
        </a>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DOMPurify from 'isomorphic-dompurify';
import type { ProductProof, ProductFaqItem } from '@coderium/shared-types';

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
  badge?: string | null;
  proof?: ProductProof | null;
  faq?: ProductFaqItem[] | null;
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
// mailto: opens the mail client in place; only real web links get a new tab.
const ctaIsMailto = computed(() => product.value?.ctaUrl?.toLowerCase().startsWith('mailto:') ?? false);

// `description` is rich-text HTML authored in the admin editor.
const descriptionHtml = computed(() => {
  const raw = product.value?.description;
  if (!raw) return '';
  const html = DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
  // An "empty" editor still saves markup like <p></p>; treat that as no description.
  return html.replace(/<[^>]*>/g, '').trim() ? html : '';
});

const proofMetrics = computed(() => product.value?.proof?.metrics ?? []);
const proofNote = computed(() => product.value?.proof?.note?.trim() ?? '');
const hasProof = computed(() => proofMetrics.value.length > 0 || proofNote.value !== '');
const faqItems = computed(() => product.value?.faq ?? []);

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

if (product.value) {
  const p = product.value;
  useSeo({
    title: p.name,
    description: p.tagline || p.description?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || undefined,
    image: p.cover,
  });

  const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '');
  useJsonLd(
    breadcrumbJsonLd([
      { name: 'Beranda', url: siteUrl },
      { name: 'Produk', url: `${siteUrl}/products` },
      { name: p.name, url: `${siteUrl}/products/${p.slug}` },
    ])
  );
  if (p.faq && p.faq.length > 0) {
    useJsonLd(faqPageJsonLd(p.faq));
  }
} else if (error.value) {
  if (import.meta.server) {
    const event = useRequestEvent();
    if (event) setResponseStatus(event, 404);
  }
  useHead({ meta: [{ name: 'robots', content: 'noindex' }] });
}
</script>
