<template>
  <div class="w-full mx-auto px-4 md:px-0 pt-6 md:pt-10 pb-4 md:pb-8 space-y-16 md:space-y-28">
    <!-- Hero -->
    <section class="relative isolate pt-4 md:pt-10">
      <!-- Decorative backdrop: full-bleed grid and glow, starting right under the site header. -->
      <div
        class="pointer-events-none absolute -top-12 md:-top-18 -bottom-10 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden"
        aria-hidden="true"
      >
        <div class="hero-grid absolute inset-0" />
        <div class="hero-glow absolute -top-40 right-[8%] h-136 w-136 rounded-full blur-3xl" />
        <div class="hero-glow absolute top-1/3 -left-40 h-96 w-96 rounded-full opacity-60 blur-3xl" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-10 lg:gap-16 lg:items-end">
        <div>
          <p class="inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 dark:bg-indigo-300/10 px-3.5 py-1.5 font-mono text-xs font-medium text-primary dark:text-indigo-300">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full rounded-full bg-primary dark:bg-indigo-300 opacity-60 motion-safe:animate-ping" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-primary dark:bg-indigo-300" />
            </span>
            Coderium · AI agency untuk tim engineering
          </p>
          <h1 class="mt-6 md:mt-8 text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.02] text-balance text-gray-900 dark:text-white">
            Kami memasang AI di tim engineering Indonesia,
            <span class="bg-linear-to-r from-primary to-indigo-400 dark:from-indigo-200 dark:to-indigo-400 bg-clip-text text-transparent">di server Anda sendiri.</span>
          </h1>
          <p class="mt-6 md:mt-8 text-lg md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
            Coderium membuat CAF (Coderium Agent Framework) dan AI Code Reviewer. Alatnya gratis untuk Anda pasang sendiri. Jika ingin dipasang dan disesuaikan oleh Coderium, mulai dengan audit gratis.
          </p>
          <div class="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
            <a :href="mailtoHref(AUDIT_SUBJECT)" class="btn btn-solid gap-2 shadow-lg shadow-primary/30">
              Pesan audit gratis
              <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
            </a>
            <!-- Falls back to /products when the homepage has no product section to jump to. -->
            <a :href="homeProducts.length > 0 ? '#produk' : '/products'" class="btn btn-outline backdrop-blur-sm">Lihat produk</a>
          </div>
        </div>

        <ul class="space-y-3">
          <li
            v-for="(promise, index) in promises"
            :key="promise.title"
            class="glass-card flex items-center gap-4 px-5 py-4"
          >
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-indigo-300/10">
              <Icon :name="promise.icon" class="w-5 h-5 text-primary dark:text-indigo-300" aria-hidden="true" />
            </span>
            <span class="text-base md:text-lg font-semibold text-gray-900 dark:text-white">{{ promise.title }}</span>
            <span class="ml-auto font-mono text-xs text-gray-500 dark:text-gray-400" aria-hidden="true">0{{ index + 1 }}</span>
          </li>
        </ul>
      </div>

      <!-- Terhubung dengan -->
      <div class="mt-12 md:mt-20 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
        <h2 class="shrink-0 font-mono text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
          Terhubung dengan
        </h2>
        <ul class="flex flex-wrap gap-2 md:gap-3">
          <li
            v-for="name in integrations"
            :key="name"
            class="glass-card rounded-full! px-4 py-2 text-sm md:text-base font-semibold text-gray-900 dark:text-white"
          >
            {{ name }}
          </li>
        </ul>
      </div>
      <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Jira dan GitLab untuk CAF: segera, belum tersedia.
      </p>
    </section>

    <!-- 01 Apa itu Coderium -->
    <section :class="SPLIT_SECTION">
      <HomeSectionHeading number="01" label="Apa itu Coderium" title="AI agency untuk tim engineering." />
      <p class="text-md md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
        Kami membuat dua produk, CAF (Coderium Agent Framework) dan AI Code Reviewer, gratis untuk dipasang sendiri. Jika Anda ingin kami yang memasang dan menyesuaikannya di server Anda, kita mulai dari audit gratis. CAF mengerjakan tiket menjadi pull request. Merge tetap keputusan manusia di tim Anda.
      </p>
    </section>

    <!-- 02 Produk: every published product from the API, no fixed count. -->
    <section v-if="pendingProducts || homeProducts.length > 0" id="produk" class="scroll-mt-24">
      <HomeSectionHeading number="02" title="Produk" lead="Alat yang kami bangun dan pakai sendiri." class="mb-8 md:mb-12" />
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
          <h3 class="text-2xl md:text-3xl font-black tracking-tight leading-tight text-balance" :class="panelTone(index).title">
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
          <!-- A product without numbers shows its first features instead, so both panels stay balanced. -->
          <ul
            v-else-if="panelFeatures(product).length > 0"
            class="mt-6 md:mt-8 space-y-3 pt-6 md:pt-8 border-t"
            :class="panelTone(index).divider"
          >
            <li
              v-for="feature in panelFeatures(product)"
              :key="feature.title"
              class="flex gap-3 text-base font-semibold leading-snug"
              :class="panelTone(index).title"
            >
              <Icon name="lucide:check" class="w-5 h-5 mt-0.5 shrink-0" :class="panelTone(index).body" aria-hidden="true" />
              <span>{{ feature.title }}</span>
            </li>
          </ul>

          <div class="mt-auto pt-6 md:pt-8 flex flex-col sm:flex-row gap-3">
            <a :href="mailtoHref(productAuditSubject(product.name))" class="btn btn-solid gap-2">
              <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
              Pesan audit gratis
            </a>
            <NuxtLink
              :to="`/products/${product.slug}`"
              class="btn gap-2 border"
              :class="panelTone(index).secondaryButton"
              :aria-label="`Lihat detail ${product.name}`"
            >
              Lihat detail
              <Icon name="lucide:arrow-right" class="w-4 h-4 shrink-0" aria-hidden="true" />
            </NuxtLink>
          </div>
        </article>
      </div>
      <p v-if="proofNote" class="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
        {{ proofNote }}
      </p>
    </section>

    <!-- 03 Proses: audit, pasang, dukungan -->
    <section>
      <HomeSectionHeading number="03" label="Proses" title="Audit, pasang, dukungan." class="mb-8 md:mb-12" />
      <ol class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        <li v-for="(step, index) in steps" :key="step.title" class="border-t-2 border-gray-900 dark:border-white pt-5">
          <span class="block font-mono text-sm font-medium text-primary dark:text-indigo-300" aria-hidden="true">
            Langkah {{ index + 1 }}
          </span>
          <h3 class="mt-2 text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ step.title }}</h3>
          <p class="mt-2 text-base text-gray-600 dark:text-gray-400 leading-relaxed">{{ step.description }}</p>
        </li>
      </ol>
      <p class="mt-8 text-sm md:text-base text-gray-700 dark:text-gray-300">
        Tidak ada harga paket tetap: setelah audit, Anda menerima penawaran tertulis dengan lingkup tetap.
        <NuxtLink to="/work-with-us" class="text-link">Lihat cara kerja sama</NuxtLink>
      </p>
    </section>

    <!-- 04 Pasang sendiri vs dipasang Coderium -->
    <section>
      <HomeSectionHeading number="04" label="Perbandingan" title="Pasang sendiri, atau dipasang Coderium." class="mb-8 md:mb-12" />

      <!-- Desktop: table -->
      <table class="hidden md:table w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-800">
            <th scope="col" class="w-1/5 py-4 pr-6"><span class="sr-only">Aspek</span></th>
            <th scope="col" class="w-2/5 py-4 pr-6 text-lg font-bold text-gray-600 dark:text-gray-400">{{ SELF_COLUMN }}</th>
            <th scope="col" class="w-2/5 py-4 text-lg font-bold text-gray-900 dark:text-white">{{ CODERIUM_COLUMN }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in comparison" :key="row.aspect" class="border-b border-gray-100 dark:border-gray-800 align-top">
            <th scope="row" class="py-5 pr-6 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              {{ row.aspect }}
            </th>
            <td class="py-5 pr-6 text-base text-gray-600 dark:text-gray-400 leading-relaxed">{{ row.self }}</td>
            <td class="py-5 text-base text-gray-900 dark:text-white leading-relaxed">{{ row.coderium }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile: one column -->
      <div class="md:hidden divide-y divide-gray-100 dark:divide-gray-800 border-y border-gray-100 dark:border-gray-800">
        <div v-for="row in comparison" :key="row.aspect" class="py-5">
          <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">{{ row.aspect }}</h3>
          <dl class="mt-3 space-y-3">
            <div>
              <dt class="text-sm font-semibold text-gray-600 dark:text-gray-400">{{ SELF_COLUMN }}</dt>
              <dd class="mt-0.5 text-base text-gray-600 dark:text-gray-400 leading-relaxed">{{ row.self }}</dd>
            </div>
            <div>
              <dt class="text-sm font-semibold text-gray-900 dark:text-white">{{ CODERIUM_COLUMN }}</dt>
              <dd class="mt-0.5 text-base text-gray-900 dark:text-white leading-relaxed">{{ row.coderium }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- 05 Cara kerja sama (no prices; options come from composables/useEngagement.ts) -->
    <section>
      <HomeSectionHeading number="05" label="Kerja sama" title="Cara kerja sama." class="mb-8 md:mb-12" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <EngagementCard
          v-for="option in engagementOptions"
          :key="option.id"
          :option="option"
          :highlighted="option.id === HIGHLIGHTED_ENGAGEMENT_ID"
        />
      </div>
      <DesignPartnerNote class="mt-4 md:mt-6" />
      <p class="mt-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {{ CLIENT_COST_NOTE }}
        <NuxtLink to="/work-with-us" class="text-link">Lihat syarat lengkap</NuxtLink>
      </p>
    </section>

    <!-- 06 Tentang -->
    <section :class="SPLIT_SECTION">
      <HomeSectionHeading number="06" label="Tentang" title="Agency kecil. Pendirinya yang membangun." />
      <div class="text-md md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <FounderPhoto />
          <p>
            Coderium didirikan oleh <span class="font-semibold text-gray-900 dark:text-white">Ganjar Hadiatna</span>, frontend developer dan tech lead yang membangun CAF dan AI Code Reviewer.
          </p>
        </div>
        <p>
          Coderium belum punya klien. Angka di halaman ini berasal dari pemakaian internal kami sendiri pada dua repo.
        </p>
        <p>
          Karena itu kami membuka program design partner: harga khusus untuk 3 klien pertama, dengan izin menulis studi kasus.
        </p>
        <NuxtLink to="/about" class="text-link gap-2 text-sm">
          Tentang Coderium
          <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>

    <!-- 07 FAQ -->
    <section>
      <HomeSectionHeading number="07" label="FAQ" title="Yang sering ditanyakan." class="mb-8 md:mb-12" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10">
        <FaqAccordion :items="faqColumns[0]" />
        <!-- -mt-px merges the two accordions' borders when stacked on mobile. -->
        <FaqAccordion :items="faqColumns[1]" class="-mt-px md:mt-0" />
      </div>
    </section>

    <!-- 08 Catatan terbaru: articles are supporting notes, so they sit last, right before contact. -->
    <section v-if="pending || recentPosts.length > 0">
      <div class="mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-6">
        <HomeSectionHeading number="08" label="Catatan" title="Catatan terbaru." />
        <NuxtLink to="/articles" class="inline-flex items-center gap-2 min-h-11 shrink-0 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          Semua artikel <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
        </NuxtLink>
      </div>

      <!-- Same list UI as /articles. -->
      <div v-if="pending" class="divide-y divide-gray-100 dark:divide-gray-800">
        <div v-for="i in 3" :key="i" class="py-6 md:py-8 first:pt-0">
          <div class="flex gap-4 items-start justify-between">
            <div class="flex-1 space-y-3">
              <div class="flex items-center gap-2">
                <SkeletonBlock class="w-6 h-6 rounded-full" />
                <SkeletonBlock class="h-3 rounded w-24" />
              </div>
              <SkeletonBlock class="h-5 rounded w-3/4" />
              <SkeletonBlock class="h-3 rounded w-full" />
            </div>
            <SkeletonBlock class="w-16 h-16 rounded shrink-0 ml-4" />
          </div>
        </div>
      </div>
      <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
        <PostListItem v-for="post in recentPosts" :key="post.id" :post="post" />
      </div>
    </section>

    <!-- 09 Kontak: a standalone dark card in both themes. -->
    <section class="relative isolate overflow-hidden rounded-2xl bg-gray-900 dark:bg-dark-secondary dark:border dark:border-gray-800 px-6 py-10 md:px-14 md:py-20">
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="hero-grid hero-grid-inverse absolute inset-0" />
        <div class="hero-glow absolute -top-40 -right-20 h-112 w-md rounded-full blur-3xl" />
      </div>
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">
        <HomeSectionHeading number="09" label="Kontak" title="Ceritakan apa yang ingin Anda kerjakan." inverse />
        <div class="shrink-0">
          <p class="text-base md:text-lg text-gray-300 leading-relaxed">
            Tidak ada form, tidak perlu membuat akun.
          </p>
          <a :href="mailtoHref(AUDIT_SUBJECT)" class="btn btn-solid mt-4 gap-2 w-full sm:w-auto">
            <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
            {{ CONTACT_EMAIL }}
          </a>
        </div>
      </div>
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
  title: 'Coderium - Memasang AI di tim engineering Indonesia',
  titleSuffix: false,
  description:
    'Coderium memasang AI di tim engineering Indonesia, di server Anda sendiri. CAF (Coderium Agent Framework) dan AI Code Reviewer gratis untuk dipasang sendiri, atau dipasang Coderium setelah audit gratis.',
});

// Every figure, price, and limitation on this page comes from the "Data yang
// boleh dipakai" / "Di luar lingkup" sections of
// docs/development/agency-pivot/requirements.md. Do not add new claims here.
// Contact address and mailto helpers come from composables/useContact.ts.

// ─── Kelas bersama ────────────────────────────────────────────────────────────

// Heading on the left, body copy on the right (stacked below lg).
const SPLIT_SECTION = 'grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16';

const config = useRuntimeConfig();
// SSR uses the internal API URL; browser calls remain same-origin.
const apiBase = import.meta.server
  ? (config.apiInternalBase as string)
  : (config.public.apiBase as string);

// ─── Produk ──────────────────────────────────────────────────────────

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
  features?: Array<{ title: string; description?: string | null }> | null;
}

const PANEL_METRIC_COUNT = 3;
const PANEL_FEATURE_COUNT = 3;

const { data: productsRes, pending: pendingProducts } = await useAsyncData<{ data: Product[] }>(
  'homepageProducts',
  () => $fetch(`${apiBase}/products?limit=24`),
  { default: () => ({ data: [] }) }
);

// GET /products only returns published products, already ordered by `order` asc.
// All of them are shown; no product card is ever added from code.
const homeProducts = computed(() => productsRes.value?.data ?? []);

// The featured product (CAF) gets the dark panel; the others stay light.
const darkPanelIndex = computed(() => Math.max(0, homeProducts.value.findIndex((p) => p.featured)));

const DARK_PANEL = {
  panel: 'bg-gray-900 dark:bg-dark-secondary border-gray-900 dark:border-gray-800',
  badge: 'bg-white/10 text-white',
  title: 'text-white',
  body: 'text-gray-300',
  divider: 'border-white/15',
  secondaryButton: 'border-white/30 text-white hover:border-white/60',
};

const LIGHT_PANEL = {
  panel: 'bg-gray-50 border-gray-100 dark:border-gray-800',
  badge: 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300',
  title: 'text-gray-900 dark:text-white',
  body: 'text-gray-600 dark:text-gray-400',
  divider: 'border-gray-200 dark:border-gray-800',
  secondaryButton: 'border-gray-300 text-gray-800 hover:border-gray-500 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-500',
};

function panelTone(index: number) {
  return index === darkPanelIndex.value ? DARK_PANEL : LIGHT_PANEL;
}

// Numbers are filled in via admin (`proof`), so they can be updated without a deploy.
function panelMetrics(product: Product): ProductProofMetric[] {
  return (product.proof?.metrics ?? []).slice(0, PANEL_METRIC_COUNT);
}

function panelFeatures(product: Product) {
  return (product.features ?? []).filter((feature) => feature.title).slice(0, PANEL_FEATURE_COUNT);
}

// Honest footnote for the numbers above. The admin-entered note wins; the
// fallback repeats the figures recorded in .caf/tasks/CDR-AGENCY/requirements.md.
const FALLBACK_PROOF_NOTE =
  'Dari pemakaian internal kami pada dua repo. 7 PR masih menunggu review dan 2 ditutup (keduanya tiket keamanan).';

// Limitations that must always sit next to the numbers. Each one is appended
// only when the note (admin or fallback) does not already say it.
const PROOF_CAVEATS = [
  { mentionedBy: /\b5 run\b/i, sentence: '5 run perlu perhatian.' },
  {
    mentionedBy: /infrastruktur/i,
    sentence: 'Sebagian run sempat lama karena masalah infrastruktur (worker tertahan, kuota model habis).',
  },
];

const proofNote = computed(() => {
  const product = homeProducts.value[darkPanelIndex.value];
  if (!product || panelMetrics(product).length === 0) return '';
  const note = (product.proof?.note || FALLBACK_PROOF_NOTE).trim();
  const caveats = PROOF_CAVEATS.filter((caveat) => !caveat.mentionedBy.test(note)).map((caveat) => caveat.sentence);
  return [note, ...caveats].join(' ');
});

// ─── Konten statis ────────────────────────────────────────────────────────────

const promises = [
  { icon: 'lucide:server', title: 'Berjalan di server Anda' },
  { icon: 'lucide:git-merge', title: 'Merge tetap keputusan manusia' },
  { icon: 'lucide:wrench', title: 'Dibuat dan dipakai sendiri oleh pembuatnya' },
];

const integrations = ['Linear', 'GitHub Issues', 'GitHub', 'GitLab', 'Claude Code'];

// No prices or week counts here: duration and price are agreed after the audit.
const steps = [
  {
    title: 'Audit gratis',
    description: '30-60 menit. Kita lihat bersama apakah AI memang membantu tim Anda.',
  },
  {
    title: 'Pasang dan sesuaikan',
    description: 'Kami memasang dan menyesuaikan alatnya di server Anda. Lama pengerjaan disepakati setelah audit.',
  },
  {
    title: 'Dukungan',
    description: 'Opsional, dengan jam kerja terbatas per bulan.',
  },
];

const SELF_COLUMN = 'Pasang sendiri (gratis)';
const CODERIUM_COLUMN = 'Dipasang Coderium';

const comparison = [
  {
    aspect: 'Pemasangan',
    self: 'Tim Anda memasang dan mengonfigurasi sendiri.',
    coderium: 'Kami yang memasang di server Anda.',
  },
  {
    aspect: 'Penyesuaian ke tim Anda',
    self: 'Tim Anda menyesuaikan sendiri dengan repo dan alur kerjanya.',
    coderium: 'Kami menyesuaikan dengan repo, tiket, dan alur kerja tim Anda.',
  },
  {
    aspect: 'Ukuran keberhasilan',
    self: 'Tim Anda menentukan dan mengukur sendiri.',
    coderium: 'Disepakati saat audit dan dilaporkan setelah pemasangan.',
  },
  {
    aspect: 'Kendala operasional',
    self: 'Ditangani tim Anda. Pada pemakaian kami sendiri, worker sempat tertahan dan kuota model sempat habis.',
    coderium: 'Kami tangani selama pemasangan, dan selama dukungan bila Anda memilihnya.',
  },
  {
    aspect: 'Biaya',
    self: 'Gratis. Biaya server dan model ditanggung tim Anda.',
    coderium: 'Audit gratis, lalu penawaran tertulis dengan lingkup tetap. Biaya server dan model tetap ditanggung klien.',
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
    answer: `Pesan audit gratis lewat email ke ${CONTACT_EMAIL}. Tidak ada form atau pendaftaran akun.`,
  },
];

const FAQ_PER_COLUMN = 3;
const faqColumns = [faq.slice(0, FAQ_PER_COLUMN), faq.slice(FAQ_PER_COLUMN)];

useJsonLd(faqPageJsonLd(faq));

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
