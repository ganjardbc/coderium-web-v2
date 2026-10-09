<template>
  <div class="page-shell">
    <PageHeader title="Tentang Coderium" lead="AI agency untuk tim engineering." />

    <!-- Apa yang kami buat -->
    <section class="split-section pt-0!">
      <h2 class="section-title">Apa yang kami buat</h2>
      <div>
        <p class="body-copy">Kami membuat dua produk untuk tim engineering.</p>
        <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <article v-for="product in products" :key="product.name" class="card p-6 md:p-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ product.name }}</h3>
            <p class="mt-2 text-base text-gray-600 dark:text-gray-400 leading-relaxed">{{ product.description }}</p>
          </article>
        </div>
        <NuxtLink to="/products" class="text-link gap-2 mt-3 text-sm">
          Lihat detail tiap produk
          <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>

    <!-- Cara kerja pilot -->
    <section class="split-section">
      <h2 class="section-title">Cara kerja uji coba</h2>
      <div>
        <ul class="divide-y divide-gray-100 dark:divide-gray-800 border-y border-gray-100 dark:border-gray-800">
          <li v-for="item in pilotSteps" :key="item" class="flex gap-3 py-4 body-copy">
            <Icon name="lucide:check" class="w-5 h-5 mt-1 shrink-0 text-primary dark:text-indigo-300" aria-hidden="true" />
            <span>{{ item }}</span>
          </li>
        </ul>
        <NuxtLink to="/work-with-us" class="text-link gap-2 mt-3 text-sm">
          Lihat harga dan syarat dari klien
          <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
        </NuxtLink>
      </div>
    </section>

    <!-- Artikel -->
    <section class="split-section">
      <h2 class="section-title">Artikel</h2>
      <div>
        <p class="body-copy">Kami juga menulis artikel dan series sebagai pelengkap.</p>
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
          <p class="mt-2 body-copy">Kontak hanya lewat email: {{ CONTACT_EMAIL }}.</p>
        </div>
        <a :href="contactMailto" class="btn btn-solid gap-2 shrink-0">
          <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
          Kirim email
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

const CONTACT_EMAIL = 'hello@coderium.id';
const contactMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Diskusi uji coba')}`;

const products = [
  {
    name: 'CAF (Coderium Agent Framework)',
    description: 'Tiket dikerjakan menjadi pull request. Merge tetap keputusan manusia.',
  },
  {
    name: 'AI Code Reviewer',
    description: 'Review kode dengan AI.',
  },
];

const pilotSteps = [
  'Kami mulai dari uji coba di satu repo.',
  'Uji coba AI Code Review berjalan 4 minggu.',
  'Uji coba CAF berjalan 6-8 minggu dan dibuka dengan fit check di minggu 1.',
  'Tim Anda yang mereview pull request dan memutuskan merge.',
];

const readingLinks = [
  { to: '/explore', label: 'Artikel' },
  { to: '/playlists', label: 'Series' },
];

useSeo({
  title: 'Tentang',
  description:
    'Coderium adalah AI agency untuk tim engineering. Kami membuat CAF (Coderium Agent Framework) dan AI Code Reviewer, dan bekerja lewat uji coba di satu repo.',
});
</script>
