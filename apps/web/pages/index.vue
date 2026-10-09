<template>
  <div class="w-full mx-auto px-4 md:px-6 py-6 md:py-10 space-y-16 md:space-y-24">
    <!-- Hero -->
    <section>
      <h1 class="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[0.95] text-gray-900 dark:text-white">
        Coderium.<br />
        <span class="text-primary dark:text-indigo-300">AI Agency.</span>
      </h1>
      <p class="mt-6 md:mt-8 text-lg md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
        Kami membuat CAF (Coderium Agent Framework) dan AI Code Reviewer untuk tim engineering, lalu memasangnya di server Anda.
      </p>
      <div class="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
        <a
          :href="mailto('Diskusi pilot')"
          class="inline-flex items-center justify-center min-h-11 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Kirim email
        </a>
        <NuxtLink
          to="/products"
          class="inline-flex items-center justify-center min-h-11 px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold hover:border-gray-500 dark:hover:border-gray-500 transition-colors"
        >
          Lihat layanan
        </NuxtLink>
      </div>

      <ul class="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 py-6 md:py-8 border-y border-gray-100 dark:border-gray-800">
        <li
          v-for="promise in promises"
          :key="promise.title"
          class="flex items-center gap-3 text-base font-semibold text-gray-900 dark:text-white"
        >
          <Icon :name="promise.icon" class="w-5 h-5 shrink-0 text-primary dark:text-indigo-300" aria-hidden="true" />
          <span>{{ promise.title }}</span>
        </li>
      </ul>
    </section>

    <!-- Terhubung dengan -->
    <section aria-labelledby="home-integrations">
      <h2 id="home-integrations" class="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
        Terhubung dengan
      </h2>
      <ul class="mt-4 flex flex-wrap gap-x-8 gap-y-3 md:gap-x-12">
        <li
          v-for="name in integrations"
          :key="name"
          class="text-lg md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {{ name }}
        </li>
      </ul>
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Jira dan GitLab untuk CAF: segera, belum tersedia.
      </p>
    </section>

    <!-- 01 Apa itu Coderium -->
    <section>
      <HomeSectionHeading number="01" title="Apa itu Coderium" />
      <p class="text-xl md:text-3xl font-semibold tracking-tight leading-snug text-gray-900 dark:text-white max-w-4xl">
        Coderium adalah AI agency untuk tim engineering. Kami membuat dua produk, CAF (Coderium Agent Framework) dan AI Code Reviewer, lalu memasangnya di server Anda lewat pilot di satu repo. CAF mengerjakan tiket menjadi pull request. Merge tetap keputusan manusia di tim Anda.
      </p>
    </section>

    <!-- 02 Dua produk unggulan -->
    <section v-if="pendingProducts || homeProducts.length > 0">
      <HomeSectionHeading number="02" title="Produk unggulan" />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <template v-if="pendingProducts">
          <SkeletonBlock v-for="i in 2" :key="i" class="h-72 rounded-2xl w-full" />
        </template>
        <article
          v-for="(product, index) in homeProducts"
          v-else
          :key="product.id"
          class="flex flex-col rounded-2xl border p-6 md:p-10"
          :class="panelTone(index).panel"
        >
          <span
            v-if="product.badge"
            class="mb-4 inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-semibold"
            :class="panelTone(index).badge"
          >
            {{ product.badge }}
          </span>
          <h3 class="text-2xl md:text-4xl font-black tracking-tight leading-tight" :class="panelTone(index).title">
            {{ product.name }}
          </h3>
          <p v-if="product.tagline" class="mt-3 text-base md:text-lg leading-relaxed" :class="panelTone(index).body">
            {{ product.tagline }}
          </p>

          <dl
            v-if="panelMetrics(product).length > 0"
            class="mt-6 md:mt-8 grid grid-cols-3 gap-4 pt-6 md:pt-8 border-t"
            :class="panelTone(index).divider"
          >
            <div v-for="metric in panelMetrics(product)" :key="metric.label" class="flex flex-col-reverse justify-end">
              <dt class="mt-1 text-xs md:text-sm leading-snug" :class="panelTone(index).body">{{ metric.label }}</dt>
              <dd class="text-2xl md:text-4xl font-black tracking-tight" :class="panelTone(index).title">{{ metric.value }}</dd>
            </div>
          </dl>

          <NuxtLink
            :to="`/products/${product.slug}`"
            class="mt-6 md:mt-auto md:pt-8 inline-flex items-center gap-2 min-h-11 w-fit text-sm font-semibold underline underline-offset-4 hover:no-underline"
            :class="panelTone(index).title"
          >
            Lihat {{ product.name }}
            <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
          </NuxtLink>
        </article>
      </div>
      <p v-if="proofNote" class="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
        {{ proofNote }}
      </p>
    </section>

    <!-- 03 Diskusi, pilot, laporan -->
    <section>
      <HomeSectionHeading number="03" title="Diskusi, pilot, laporan" />
      <ol class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        <li v-for="(step, index) in steps" :key="step.title">
          <span class="block text-6xl md:text-7xl font-black leading-none text-gray-200 dark:text-gray-800 select-none" aria-hidden="true">
            {{ index + 1 }}
          </span>
          <h3 class="mt-4 text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ step.title }}</h3>
          <p class="mt-2 text-base text-gray-600 dark:text-gray-400 leading-relaxed">{{ step.description }}</p>
        </li>
      </ol>
      <p class="mt-8 text-sm md:text-base text-gray-700 dark:text-gray-300">
        Pilot mulai {{ startingPlan.price }}, harga perintis mulai {{ startingPlan.pioneerPrice }}.
        <NuxtLink to="/kerja-sama" class="inline-flex items-center min-h-11 font-semibold text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline">
          Lihat harga dan syarat
        </NuxtLink>
      </p>
    </section>

    <!-- 04 Pasang sendiri vs pilot -->
    <section>
      <HomeSectionHeading number="04" title="Pasang sendiri atau pilot" />

      <!-- Desktop: table -->
      <table class="hidden md:table w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-800">
            <th scope="col" class="w-1/5 py-4 pr-6"><span class="sr-only">Aspek</span></th>
            <th scope="col" class="w-2/5 py-4 pr-6 text-lg font-bold text-gray-600 dark:text-gray-400">Pasang sendiri</th>
            <th scope="col" class="w-2/5 py-4 text-lg font-bold text-gray-900 dark:text-white">Pilot bersama Coderium</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in comparison" :key="row.aspect" class="border-b border-gray-100 dark:border-gray-800 align-top">
            <th scope="row" class="py-5 pr-6 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              {{ row.aspect }}
            </th>
            <td class="py-5 pr-6 text-base text-gray-600 dark:text-gray-400 leading-relaxed">{{ row.self }}</td>
            <td class="py-5 text-base text-gray-900 dark:text-white leading-relaxed">{{ row.pilot }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile: one column -->
      <div class="md:hidden divide-y divide-gray-100 dark:divide-gray-800 border-y border-gray-100 dark:border-gray-800">
        <div v-for="row in comparison" :key="row.aspect" class="py-5">
          <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">{{ row.aspect }}</h3>
          <dl class="mt-3 space-y-3">
            <div>
              <dt class="text-sm font-semibold text-gray-600 dark:text-gray-400">Pasang sendiri</dt>
              <dd class="mt-0.5 text-base text-gray-600 dark:text-gray-400 leading-relaxed">{{ row.self }}</dd>
            </div>
            <div>
              <dt class="text-sm font-semibold text-gray-900 dark:text-white">Pilot bersama Coderium</dt>
              <dd class="mt-0.5 text-base text-gray-900 dark:text-white leading-relaxed">{{ row.pilot }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- 05 Paket dan harga -->
    <section>
      <HomeSectionHeading number="05" title="Paket dan harga" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <article
          v-for="plan in pricingPlans"
          :key="plan.id"
          class="flex flex-col p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800"
        >
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ plan.name }}</h3>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 first-letter:uppercase">{{ plan.scope }}</p>
          <p class="mt-5 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            {{ plan.price }}
            <span v-if="plan.priceUnit" class="text-base font-semibold text-gray-600 dark:text-gray-400">{{ plan.priceUnit }}</span>
          </p>
          <p v-if="plan.pioneerPrice" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Harga perintis: <span class="font-semibold text-gray-900 dark:text-white">{{ plan.pioneerPrice }}</span>
          </p>
          <p v-if="plan.note" class="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ plan.note }}</p>
          <div class="mt-auto pt-6">
            <a
              :href="mailto(plan.subject)"
              :aria-label="`Kirim email soal ${plan.name}`"
              class="flex items-center justify-center min-h-11 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Kirim email
            </a>
          </div>
        </article>
      </div>
      <p class="mt-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        Harga perintis: {{ PIONEER_PRICE_NOTE }} {{ CLIENT_COST_NOTE }}
        <NuxtLink to="/kerja-sama" class="inline-flex items-center min-h-11 font-semibold text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline">
          Lihat syarat lengkap
        </NuxtLink>
      </p>
    </section>

    <!-- 06 Tentang -->
    <section>
      <HomeSectionHeading number="06" title="Tentang" />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        <p class="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] text-gray-900 dark:text-white">
          Agency awal. Pendirinya yang membangun.
        </p>
        <div class="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
          <p>
            Coderium belum punya klien. Angka di halaman ini berasal dari pemakaian internal kami sendiri pada dua repo.
          </p>
          <p>
            Karena itu kami membuka harga perintis: diskon 30% dengan izin studi kasus.
          </p>
          <NuxtLink
            to="/about"
            class="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline"
          >
            Tentang Coderium
            <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 07 FAQ -->
    <section>
      <HomeSectionHeading number="07" title="FAQ" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10">
        <FaqAccordion :items="faqColumns[0]" />
        <!-- -mt-px merges the two accordions' borders when stacked on mobile. -->
        <FaqAccordion :items="faqColumns[1]" class="-mt-px md:mt-0" />
      </div>
    </section>

    <!-- 08 Catatan terbaru -->
    <section v-if="pending || recentPosts.length > 0">
      <div class="flex justify-between items-baseline gap-4">
        <HomeSectionHeading number="08" title="Catatan terbaru" />
        <NuxtLink to="/explore" class="inline-flex items-center gap-2 min-h-11 shrink-0 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          Semua artikel <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <template v-if="pending">
          <div v-for="i in 3" :key="i" class="space-y-3">
            <SkeletonBlock class="aspect-video rounded-xl w-full" />
            <SkeletonBlock class="h-3 rounded w-24" />
            <SkeletonBlock class="h-5 rounded w-3/4" />
          </div>
        </template>
        <NuxtLink
          v-for="post in recentPosts"
          v-else
          :key="post.id"
          :to="`/posts/${post.slug}`"
          class="group block"
        >
          <div class="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-secondary">
            <img
              v-if="post.cover"
              :src="post.cover"
              :alt="post.title"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Icon name="lucide:file-text" class="w-8 h-8 text-gray-300 dark:text-gray-700" aria-hidden="true" />
            </div>
          </div>
          <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">{{ formatDate(post.publishedAt || post.createdAt) }}</p>
          <h3 class="mt-1 text-lg md:text-xl font-bold leading-snug text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-3">
            {{ post.title }}
          </h3>
        </NuxtLink>
      </div>
    </section>

    <!-- 09 Kontak (dark block in both themes) -->
    <section class="rounded-2xl bg-gray-900 dark:bg-dark-secondary border border-gray-900 dark:border-gray-800 px-6 py-10 md:px-14 md:py-20">
      <HomeSectionHeading number="09" title="Kontak" inverse />
      <p class="text-3xl md:text-6xl font-black tracking-tight leading-[1.05] text-white max-w-4xl">
        Ceritakan apa yang ingin Anda kerjakan.
      </p>
      <p class="mt-4 md:mt-6 text-base md:text-lg text-gray-300 leading-relaxed">
        Tidak ada form, tidak perlu membuat akun.
      </p>
      <a
        :href="mailto('Diskusi pilot')"
        class="mt-6 md:mt-8 inline-flex items-center justify-center gap-2 min-h-11 px-6 py-2.5 rounded-full bg-primary text-white text-sm md:text-base font-semibold hover:bg-primary/90 transition-colors"
      >
        <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
        {{ CONTACT_EMAIL }}
      </a>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProductFaqItem, ProductProof, ProductProofMetric } from '@coderium/shared-types';

definePageMeta({
  layout: 'default',
});

useSeo({
  title: 'Coderium - AI agency untuk tim engineering',
  titleSuffix: false,
  description:
    'Coderium adalah AI agency untuk tim engineering. CAF (Coderium Agent Framework) dan AI Code Reviewer, dipasang di server Anda lewat pilot berharga tetap.',
});

// Every figure, price, and limitation on this page comes from the "Data yang
// boleh dipakai" / "Di luar lingkup" sections of
// docs/development/agency-pivot/requirements.md. Do not add new claims here.
// Prices come from composables/usePricing.ts, shared with /kerja-sama.
const CONTACT_EMAIL = 'hello@coderium.id';

function mailto(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

const config = useRuntimeConfig();
// SSR uses the internal API URL; browser calls remain same-origin.
const apiBase = import.meta.server
  ? (config.apiInternalBase as string)
  : (config.public.apiBase as string);

// ─── Produk unggulan ──────────────────────────────────────────────────────────

interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  cover?: string | null;
  featured?: boolean;
  order?: number;
  badge?: string | null;
  proof?: ProductProof | null;
}

const HOME_PRODUCT_COUNT = 2;
const PANEL_METRIC_COUNT = 3;

const { data: productsRes, pending: pendingProducts } = await useAsyncData<{ data: Product[] }>(
  'homepageProducts',
  () => $fetch(`${apiBase}/products?limit=24`),
  { default: () => ({ data: [] }) }
);

// GET /products is already ordered by `order` asc.
const homeProducts = computed(() => (productsRes.value?.data ?? []).slice(0, HOME_PRODUCT_COUNT));

// The featured product (CAF) gets the dark panel; the other one stays light.
const darkPanelIndex = computed(() => Math.max(0, homeProducts.value.findIndex((p) => p.featured)));

const DARK_PANEL = {
  panel: 'bg-gray-900 dark:bg-dark-secondary border-gray-900 dark:border-gray-800',
  badge: 'bg-white/10 text-white',
  title: 'text-white',
  body: 'text-gray-300',
  divider: 'border-white/15',
};

const LIGHT_PANEL = {
  panel: 'bg-gray-50 border-gray-100 dark:border-gray-800',
  badge: 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300',
  title: 'text-gray-900 dark:text-white',
  body: 'text-gray-600 dark:text-gray-400',
  divider: 'border-gray-200 dark:border-gray-800',
};

function panelTone(index: number) {
  return index === darkPanelIndex.value ? DARK_PANEL : LIGHT_PANEL;
}

// Numbers are filled in via admin (`proof`), so they can be updated without a deploy.
function panelMetrics(product: Product): ProductProofMetric[] {
  return (product.proof?.metrics ?? []).slice(0, PANEL_METRIC_COUNT);
}

// Honest footnote for the numbers above. The admin-entered note wins; the
// fallback repeats the figures recorded in requirements.md.
const FALLBACK_PROOF_NOTE =
  'Dari pemakaian internal kami pada dua repo. 7 PR masih menunggu review dan 2 ditutup (keduanya tiket keamanan).';

const proofNote = computed(() => {
  const product = homeProducts.value[darkPanelIndex.value];
  if (!product || panelMetrics(product).length === 0) return '';
  return product.proof?.note || FALLBACK_PROOF_NOTE;
});

// ─── Konten statis ────────────────────────────────────────────────────────────

const promises = [
  { icon: 'lucide:server', title: 'Berjalan di server Anda' },
  { icon: 'lucide:git-merge', title: 'Merge tetap keputusan manusia' },
  { icon: 'lucide:tag', title: 'Pilot berharga tetap' },
];

const integrations = ['Linear', 'GitHub Issues', 'GitHub', 'GitLab', 'Claude Code'];

// The cheapest pilot, used for the "mulai dari" lines.
const startingPlan = pricingPlans[0];

const steps = [
  {
    title: 'Diskusi',
    description: `Kirim email ke ${CONTACT_EMAIL} dan ceritakan repo serta tim Anda.`,
  },
  {
    title: 'Pilot',
    description: 'Pilot di satu repo: AI Code Review 4 minggu, atau CAF 6-8 minggu yang dibuka dengan fit check di minggu 1.',
  },
  {
    title: 'Laporan',
    description: 'Pilot ditutup dengan laporan hasil di repo Anda.',
  },
];

const comparison = [
  {
    aspect: 'Pemasangan',
    self: 'Tim Anda memasang dan mengonfigurasi sendiri.',
    pilot: 'Kami yang memasang di server Anda, pada satu repo.',
  },
  {
    aspect: 'Penyesuaian',
    self: 'Tim Anda menyesuaikan sendiri dengan repo dan alur kerjanya.',
    pilot: 'Kami menyesuaikan dengan repo dan tiket Anda selama pilot.',
  },
  {
    aspect: 'Ukuran keberhasilan',
    self: 'Tim Anda menentukan dan mengukur sendiri.',
    pilot: 'Disepakati di awal pilot dan dilaporkan di akhir.',
  },
  {
    aspect: 'Kendala operasional',
    self: 'Ditangani tim Anda. Pada pemakaian kami sendiri, worker sempat tertahan dan kuota model sempat habis.',
    pilot: 'Kami tangani selama pilot.',
  },
  {
    aspect: 'Biaya',
    self: 'Biaya server dan model, ditambah waktu tim Anda.',
    pilot: `Harga pilot tetap, mulai ${startingPlan.price}. Biaya server dan model ditanggung klien.`,
  },
];

const faq: ProductFaqItem[] = [
  {
    question: 'Apa yang dikerjakan CAF?',
    answer: 'CAF (Coderium Agent Framework) mengerjakan tiket menjadi pull request. Tim Anda yang mereview dan memutuskan merge.',
  },
  {
    question: 'Di mana tool dijalankan?',
    answer: 'Di server Anda. Biaya server dan model ditanggung klien.',
  },
  {
    question: 'Apakah merge dilakukan otomatis?',
    answer: 'Tidak. Merge tetap keputusan manusia di tim Anda.',
  },
  {
    question: 'Tiket seperti apa yang belum kami kerjakan?',
    answer: 'Tiket keamanan dan hak akses, serta tiket besar lintas sistem.',
  },
  {
    question: 'Terhubung dengan apa saja?',
    answer: 'Linear, GitHub Issues, GitHub, GitLab, dan Claude Code. Jira dan GitLab untuk CAF ada di rencana, belum tersedia.',
  },
  {
    question: 'Bagaimana cara memulai?',
    answer: `Kirim email ke ${CONTACT_EMAIL}. Tidak ada form atau pendaftaran akun.`,
  },
];

const FAQ_PER_COLUMN = 3;
const faqColumns = [faq.slice(0, FAQ_PER_COLUMN), faq.slice(FAQ_PER_COLUMN)];

useJsonLd(faqPageJsonLd(faq));

// ─── Catatan terbaru ──────────────────────────────────────────────────────────

interface Post {
  id: string;
  title: string;
  slug: string;
  cover?: string | null;
  createdAt?: string;
  publishedAt: string;
}

const RECENT_LIMIT = 3;

const { data: recentRes, pending } = await useAsyncData<{ data: Post[] }>(
  'recentPosts',
  () => $fetch(`${apiBase}/posts?page=1&limit=${RECENT_LIMIT}`),
  { default: () => ({ data: [] }) }
);

const recentPosts = computed(() => (recentRes.value?.data ?? []).slice(0, RECENT_LIMIT));
</script>
