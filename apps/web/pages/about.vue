<template>
  <div class="page-shell">
    <PageHeader title="Tentang Coderium" lead="Agency kecil yang memasang AI di tim engineering Indonesia." />

    <!-- Apa itu Coderium -->
    <section class="split-section pt-0!">
      <h2 class="section-title">Apa itu Coderium</h2>
      <div>
        <p class="body-copy">
          Coderium adalah agency kecil yang memasang AI di tim engineering Indonesia, di server tim itu sendiri. Kami membangun dua alat:
        </p>
        <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <article v-for="product in products" :key="product.name" class="card p-6 md:p-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ product.name }}</h3>
            <p class="mt-2 text-base text-gray-600 dark:text-gray-400 leading-relaxed">{{ product.description }}</p>
          </article>
        </div>
        <p class="mt-5 body-copy">
          Alatnya gratis dan open source untuk dipasang sendiri. Pemasangan dan penyesuaian oleh Coderium berbayar, dengan penawaran tertulis setelah audit gratis.
        </p>
        <NuxtLink to="/products" class="text-link gap-2 mt-3 text-sm">
          Lihat detail tiap produk
          <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>

    <!-- Pendiri -->
    <section class="split-section">
      <h2 class="section-title">Pendiri</h2>
      <div class="flex flex-col sm:flex-row gap-5 sm:gap-6">
        <FounderPhoto />
        <div class="space-y-4">
          <p class="body-copy">
            Coderium didirikan oleh <span class="font-semibold text-gray-900 dark:text-white">Ganjar Hadiatna</span>, frontend developer dan tech lead. Ganjar membangun CAF dan AI Code Reviewer, lalu memakai keduanya di repo sendiri.
          </p>
          <p class="body-copy">
            Coderium belum punya klien. Angka di situs ini berasal dari pemakaian internal kami sendiri pada dua repo.
          </p>
        </div>
      </div>
    </section>

    <!-- Cara kerja -->
    <section class="split-section">
      <h2 class="section-title">Cara kerja</h2>
      <div>
        <ol class="divide-y divide-gray-100 dark:divide-gray-800 border-y border-gray-100 dark:border-gray-800">
          <li v-for="(step, index) in steps" :key="step.title" class="flex gap-4 py-4">
            <span class="font-mono text-sm font-medium text-primary dark:text-indigo-300 pt-1" aria-hidden="true">0{{ index + 1 }}</span>
            <div>
              <h3 class="text-base md:text-lg font-bold text-gray-900 dark:text-white">{{ step.title }}</h3>
              <p class="mt-1 body-copy">{{ step.description }}</p>
            </div>
          </li>
        </ol>
        <NuxtLink to="/work-with-us" class="text-link gap-2 mt-3 text-sm">
          Lihat cara kerja sama dan syarat dari klien
          <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>

    <!-- Artikel: supporting notes, not the main identity -->
    <section class="split-section">
      <h2 class="section-title">Catatan</h2>
      <div>
        <p class="body-copy">
          Kami juga menulis artikel dan series. Isinya catatan pelengkap dari pekerjaan kami, bukan layanan utama Coderium.
        </p>
        <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <NuxtLink
            v-for="link in readingLinks"
            :key="link.to"
            :to="link.to"
            class="group card flex items-center justify-between gap-4 p-6 md:p-8 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <span class="text-lg font-bold text-gray-900 dark:text-white">{{ link.label }}</span>
            <Icon name="lucide:arrow-right" class="w-5 h-5 shrink-0 text-gray-400 dark:text-gray-700 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Kontak -->
    <section class="py-10 md:py-16">
      <div class="card flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 md:p-10">
        <div>
          <h2 class="section-title">Kontak</h2>
          <p class="mt-2 body-copy">Kontak hanya lewat email: {{ CONTACT_EMAIL }}. Tidak ada form, tidak perlu membuat akun.</p>
        </div>
        <a :href="mailtoHref(AUDIT_SUBJECT)" class="btn btn-solid gap-2 shrink-0">
          <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
          Pesan audit gratis
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

// Contact helpers come from composables/useContact.ts. Claims on this page
// stay within .caf/tasks/CDR-AGENCY/requirements.md; do not add new figures.

const products = [
  {
    name: 'CAF (Coderium Agent Framework)',
    description: 'Mengerjakan tiket menjadi pull request. Merge tetap keputusan manusia.',
  },
  {
    name: 'AI Code Reviewer',
    description: 'Mereview pull request dengan AI. Keputusan merge tetap di tim Anda.',
  },
];

const steps = [
  { title: 'Audit gratis', description: '30-60 menit. Kita lihat bersama apakah AI memang membantu tim Anda.' },
  { title: 'Pasang dan sesuaikan', description: 'Di server Anda. Lama pengerjaan disepakati setelah audit.' },
  { title: 'Dukungan', description: 'Opsional, dengan jam kerja terbatas per bulan.' },
];

const readingLinks = [
  { to: '/articles', label: 'Artikel' },
  { to: '/playlists', label: 'Series' },
];

useSeo({
  title: 'Tentang',
  description:
    'Coderium adalah agency kecil yang memasang AI di tim engineering Indonesia. Didirikan oleh Ganjar Hadiatna, pembuat CAF (Coderium Agent Framework) dan AI Code Reviewer.',
});
</script>
