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

    <div v-else-if="product" class="relative isolate">
      <!-- Decorative backdrop: same full-bleed grid and glow as the homepage hero. -->
      <div
        class="pointer-events-none absolute -top-6 md:-top-18 left-1/2 -z-10 h-144 w-screen -translate-x-1/2 overflow-hidden"
        aria-hidden="true"
      >
        <div class="hero-grid absolute inset-0" />
        <div class="hero-glow absolute -top-40 right-[8%] h-136 w-136 rounded-full blur-3xl" />
      </div>

      <BackButton
        label="Kembali"
        link-class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        class="mb-6 md:mb-8"
      />

      <!-- Hero -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 lg:items-center pb-10 md:pb-16 border-b border-gray-100 dark:border-gray-800">
        <div>
          <p
            v-if="product.badge"
            class="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 dark:bg-indigo-300/10 px-3.5 py-1.5 font-mono text-xs font-medium text-primary dark:text-indigo-300"
          >
            {{ product.badge }}
          </p>
          <h1 class="mt-5 md:mt-6 text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-balance text-gray-900 dark:text-white">
            {{ product.name }}
          </h1>
          <p v-if="product.tagline" class="mt-4 md:mt-5 text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ product.tagline }}
          </p>
          <a
            :href="product.ctaUrl"
            :target="ctaIsMailto ? undefined : '_blank'"
            :rel="ctaIsMailto ? undefined : 'noopener noreferrer'"
            class="btn btn-solid gap-2 mt-6 md:mt-8 shadow-lg shadow-primary/30"
          >
            <Icon v-if="ctaIsMailto" name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
            {{ product.ctaLabel || 'Kirim email' }}
          </a>
        </div>
        <div
          v-if="product.cover"
          class="w-full aspect-video rounded-2xl overflow-hidden bg-gray-50 dark:bg-dark-secondary ring-1 ring-primary/20 dark:ring-indigo-300/20 shadow-2xl shadow-primary/20"
        >
          <img :src="product.cover" :alt="product.name" class="w-full h-full object-cover" />
        </div>
      </section>

      <!-- Description -->
      <section v-if="descriptionHtml" class="split-section">
        <h2 class="section-title">Tentang produk</h2>
        <div class="rich-copy" v-html="descriptionHtml"></div>
      </section>

      <!-- Pipeline steps: vertical timeline -->
      <section v-if="product.pipelineSteps && product.pipelineSteps.length > 0" class="split-section">
        <h2 class="section-title">Cara kerja</h2>
        <ol>
          <li
            v-for="(step, index) in product.pipelineSteps"
            :key="index"
            class="relative pl-14 pb-8 last:pb-0"
          >
            <!-- Connector to the next node -->
            <span
              v-if="index < product.pipelineSteps.length - 1"
              class="absolute left-[17px] top-9 bottom-0 w-px bg-linear-to-b from-primary/50 to-primary/5 dark:from-indigo-300/50 dark:to-indigo-300/5"
              aria-hidden="true"
            />
            <span
              class="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 dark:bg-indigo-300/10 ring-1 ring-primary/40 dark:ring-indigo-300/40 shadow-[0_0_18px] shadow-primary/30 font-mono text-xs font-medium text-primary dark:text-indigo-300"
              aria-hidden="true"
            >
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <h3 class="pt-1 text-lg md:text-xl font-bold text-gray-900 dark:text-white">{{ step.title }}</h3>
            <p v-if="step.description" class="mt-1.5 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ step.description }}
            </p>
          </li>
        </ol>
      </section>

      <!-- Features: vertical bullet list -->
      <section v-if="product.features && product.features.length > 0" class="split-section">
        <h2 class="section-title">Fitur</h2>
        <ul class="glass-card divide-y divide-gray-100 dark:divide-gray-800">
          <li
            v-for="(feature, index) in product.features"
            :key="index"
            class="flex gap-4 px-5 py-5 md:px-7 md:py-6"
          >
            <span
              class="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary dark:bg-indigo-300 shadow-[0_0_12px] shadow-primary dark:shadow-indigo-300"
              aria-hidden="true"
            />
            <div class="min-w-0">
              <h3 class="text-base md:text-lg font-bold text-gray-900 dark:text-white">{{ feature.title }}</h3>
              <p v-if="feature.description" class="mt-1 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          </li>
        </ul>
      </section>

      <!-- Proof: numbers from our own usage (filled in via admin) -->
      <section v-if="hasProof" class="py-10 md:py-16 border-b border-gray-100 dark:border-gray-800">
        <h2 class="section-title mb-6 md:mb-8">Hasil dari pemakaian kami sendiri</h2>
        <dl v-if="proofMetrics.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div
            v-for="(metric, index) in proofMetrics"
            :key="index"
            class="glass-card flex flex-col-reverse justify-end p-6 md:p-8"
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

      <!-- Bukti: related series and posts -->
      <section v-if="hasBukti" class="split-section">
        <h2 class="section-title">Bukti</h2>
        <div class="space-y-8">
          <!-- Sub-list: Dipelajari lewat -->
          <div v-if="hasPlaylist">
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
          <div v-if="hasRelatedPosts">
            <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3">Bacaan & konten terkait</h3>
            <div class="space-y-3">
              <NuxtLink
                v-for="post in relatedPosts"
                :key="post.id"
                :to="`/posts/${post.slug}`"
                class="group card flex items-center gap-3 p-4 md:p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <div class="flex-1 min-w-0">
                  <span class="text-xs text-primary dark:text-indigo-300 font-bold uppercase tracking-wider">
                    {{ postTypeLabel(post.type) }}
                  </span>
                  <h4 class="text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors mt-0.5 leading-snug line-clamp-2">
                    {{ post.title }}
                  </h4>
                </div>
                <Icon name="lucide:arrow-right" class="w-5 h-5 text-gray-400 dark:text-gray-700 group-hover:text-gray-900 dark:group-hover:text-white transition-colors shrink-0" aria-hidden="true" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section v-if="faqItems.length > 0" class="split-section">
        <h2 class="section-title">Yang sering ditanyakan</h2>
        <FaqAccordion :items="faqItems" />
      </section>

      <!-- CTA penutup -->
      <section class="py-10 md:py-16">
        <div class="glass-card relative isolate overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 md:p-10">
          <div class="hero-glow pointer-events-none absolute -top-32 -right-24 -z-10 h-80 w-80 rounded-full blur-3xl" aria-hidden="true" />
          <div>
            <p class="section-title">Siap memulai uji coba?</p>
            <p v-if="product.tagline" class="mt-2 body-copy">{{ product.tagline }}</p>
          </div>
          <a
            :href="product.ctaUrl"
            :target="ctaIsMailto ? undefined : '_blank'"
            :rel="ctaIsMailto ? undefined : 'noopener noreferrer'"
            class="btn btn-solid gap-2 shrink-0"
          >
            <Icon v-if="ctaIsMailto" name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
            {{ product.ctaLabel || 'Kirim email' }}
          </a>
        </div>
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
