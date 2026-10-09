<template>
  <div class="w-full mx-auto px-4 md:px-6 py-6 md:py-10 space-y-12 md:space-y-20">
    <!-- 1. Hero -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div>
        <h1 class="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.05]">
          Tiket jadi pull request. Merge tetap keputusan manusia.
        </h1>
        <p class="mt-4 md:mt-5 text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
          Coderium adalah AI agency untuk tim engineering, dengan dua produk: CAF (Coderium Agent Framework) dan AI Code Reviewer.
        </p>
        <div class="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
          <a
            :href="mailto('Diskusi pilot')"
            class="inline-flex items-center justify-center min-h-11 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Kirim email untuk diskusi
          </a>
          <NuxtLink
            to="/products"
            class="inline-flex items-center justify-center min-h-11 px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold hover:border-gray-500 dark:hover:border-gray-500 transition-colors"
          >
            Lihat produk
          </NuxtLink>
        </div>
      </div>
      <HeroTerminal />
    </section>

    <!-- 2. Strip angka -->
    <section aria-labelledby="home-numbers">
      <h2 id="home-numbers" class="sr-only">Angka dari pemakaian kami sendiri</h2>
      <dl class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-6 md:py-8 border-y border-gray-100 dark:border-gray-800">
        <div v-for="metric in numbers.metrics" :key="metric.label" class="flex flex-col-reverse">
          <dt class="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-snug">{{ metric.label }}</dt>
          <dd class="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">{{ metric.value }}</dd>
        </div>
      </dl>
      <p v-if="numbers.note" class="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
        {{ numbers.note }}
      </p>
    </section>

    <!-- 3. Produk -->
    <section v-if="pendingProducts || homeProducts.length > 0">
      <div class="flex justify-between items-center mb-6">
        <h2 class="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">Produk</h2>
        <NuxtLink to="/products" class="inline-flex items-center gap-2 min-h-11 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          Semua produk <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <template v-if="pendingProducts">
          <SkeletonBlock v-for="i in 2" :key="i" class="aspect-video rounded-lg w-full" />
        </template>
        <ProductCard v-for="product in homeProducts" v-else :key="product.id" :product="product" />
      </div>
    </section>

    <!-- 4. Cara kerja -->
    <section>
      <h2 class="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm mb-6">Cara kerja</h2>
      <ol class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <li
          v-for="(step, index) in steps"
          :key="step.title"
          class="p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-800"
        >
          <span class="text-2xl font-black text-gray-300 dark:text-gray-700 leading-none select-none">0{{ index + 1 }}</span>
          <h3 class="mt-3 text-base md:text-lg font-bold text-gray-900 dark:text-white">{{ step.title }}</h3>
          <p class="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ step.description }}</p>
        </li>
      </ol>
      <p class="mt-5 md:mt-6 text-sm md:text-base text-gray-700 dark:text-gray-300">
        Pilot mulai Rp13.000.000, harga perintis mulai Rp9.100.000.
        <NuxtLink to="/kerja-sama" class="font-semibold text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline">
          Lihat harga dan syarat
        </NuxtLink>
      </p>
    </section>

    <!-- 5. Yang belum kami kerjakan -->
    <section>
      <h2 class="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm mb-6">Yang belum kami kerjakan</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="item in notYet"
          :key="item.title"
          class="p-5 rounded-2xl border border-gray-100 dark:border-gray-800"
        >
          <h3 class="text-base font-bold text-gray-900 dark:text-white leading-snug">{{ item.title }}</h3>
          <p class="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ item.description }}</p>
        </div>
      </div>
    </section>

    <!-- 6. Ajakan email (dark block in both themes) -->
    <section class="rounded-2xl bg-gray-900 dark:bg-dark-secondary border border-gray-900 dark:border-gray-800 px-6 py-10 md:px-12 md:py-14 text-center">
      <h2 class="text-2xl md:text-3xl font-black tracking-tight text-white">Mau coba di satu repo dulu?</h2>
      <p class="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">
        Kirim email ke {{ CONTACT_EMAIL }}. Tidak ada form, tidak perlu membuat akun.
      </p>
      <a
        :href="mailto('Diskusi pilot')"
        class="mt-6 inline-flex items-center justify-center min-h-11 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Kirim email
      </a>
    </section>

    <!-- 7. Catatan terbaru -->
    <section v-if="pending || recentPosts.length > 0">
      <div class="flex justify-between items-center mb-6">
        <h2 class="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">Catatan terbaru</h2>
        <NuxtLink to="/explore" class="inline-flex items-center gap-2 min-h-11 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          Semua artikel <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>

      <div v-if="pending" class="divide-y divide-gray-100 dark:divide-gray-800">
        <div v-for="i in 3" :key="i" class="py-6 md:py-8 first:pt-0 space-y-3">
          <SkeletonBlock class="h-3 rounded w-24" />
          <SkeletonBlock class="h-5 rounded w-3/4" />
          <SkeletonBlock class="h-3 rounded w-1/2" />
        </div>
      </div>
      <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
        <PostListItem v-for="post in recentPosts" :key="post.id" :post="post" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProductProof } from '@coderium/shared-types';

definePageMeta({
  layout: 'default',
});

useSeo({
  title: 'Coderium - AI agency untuk tim engineering',
  titleSuffix: false,
  description:
    'Tiket jadi pull request, merge tetap keputusan manusia. CAF (Coderium Agent Framework) dan AI Code Reviewer untuk tim engineering.',
});

// Every figure, price, and limitation on this page comes from the "Data yang
// boleh dipakai" / "Di luar lingkup" sections of
// docs/development/agency-pivot/requirements.md. Do not add new claims here.
const CONTACT_EMAIL = 'hello@coderium.id';

function mailto(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

const config = useRuntimeConfig();
// SSR uses the internal API URL; browser calls remain same-origin.
const apiBase = import.meta.server
  ? (config.apiInternalBase as string)
  : (config.public.apiBase as string);

// ─── Produk ───────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  cover?: string | null;
  featured?: boolean;
  order?: number;
  proof?: ProductProof | null;
}

const HOME_PRODUCT_COUNT = 2;

const { data: productsRes, pending: pendingProducts } = await useAsyncData<{ data: Product[] }>(
  'homepageProducts',
  () => $fetch(`${apiBase}/products?limit=24`),
  { default: () => ({ data: [] }) }
);

// GET /products is already ordered by `order` asc.
const homeProducts = computed(() => (productsRes.value?.data ?? []).slice(0, HOME_PRODUCT_COUNT));

// ─── Strip angka ──────────────────────────────────────────────────────────────

// Fallback copy of the dashboard numbers recorded in requirements.md. The
// featured product's `proof` (filled in via admin) takes precedence, so the
// strip can be updated without a deploy.
const FALLBACK_NUMBERS: ProductProof = {
  metrics: [
    { value: '24', label: 'Tiket dikerjakan' },
    { value: '15', label: 'PR di-merge' },
    { value: '11 mnt', label: 'Median pemrosesan' },
    { value: '~$10', label: 'Biaya model per tiket' },
  ],
  note: 'Dari pemakaian internal kami pada dua repo. 7 PR masih menunggu review dan 2 ditutup.',
};

const numbers = computed<ProductProof>(() => {
  const proof = productsRes.value?.data?.find((p) => p.featured)?.proof;
  if (!proof?.metrics?.length) return FALLBACK_NUMBERS;
  return { metrics: proof.metrics.slice(0, 4), note: proof.note };
});

// ─── Konten statis ────────────────────────────────────────────────────────────

const steps = [
  {
    title: 'Kirim email',
    description: `Ceritakan repo dan tim Anda lewat ${CONTACT_EMAIL}.`,
  },
  {
    title: 'Pilot di satu repo',
    description: 'Pilot AI Code Review 4 minggu, atau pilot CAF 6-8 minggu yang dibuka dengan fit check di minggu 1.',
  },
  {
    title: 'Review dan merge di tim Anda',
    description: 'Tiket dikerjakan menjadi pull request. Tim Anda yang mereview dan memutuskan merge.',
  },
];

const notYet = [
  {
    title: 'Tiket keamanan dan hak akses',
    description: 'Dua PR yang ditutup pada pemakaian kami sendiri adalah tiket keamanan.',
  },
  {
    title: 'Merge otomatis',
    description: 'Merge tetap keputusan manusia.',
  },
  {
    title: 'Jira dan GitLab untuk CAF',
    description: 'Ada di rencana, belum tersedia.',
  },
  {
    title: 'Tiket besar lintas sistem',
    description: 'Pilot berjalan di satu repo.',
  },
];

// ─── Catatan terbaru ──────────────────────────────────────────────────────────

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
  createdAt?: string;
  updatedAt?: string;
  publishedAt: string;
  viewsCount: number;
  user?: Author;
}

const RECENT_LIMIT = 3;

const { data: recentRes, pending } = await useAsyncData<{ data: Post[] }>(
  'recentPosts',
  () => $fetch(`${apiBase}/posts?page=1&limit=${RECENT_LIMIT}`),
  { default: () => ({ data: [] }) }
);

const recentPosts = computed(() => (recentRes.value?.data ?? []).slice(0, RECENT_LIMIT));
</script>
