<template>
  <div class="page-shell">
    <PageHeader title="Tentang Coderium" lead="AI agency untuk tim engineering." />

    <div class="max-w-3xl space-y-8 md:space-y-10 body-copy">
      <section>
        <h2 class="section-title mb-3">Apa yang kami buat</h2>
        <p>Kami membuat dua produk untuk tim engineering:</p>
        <ul class="mt-2 list-disc pl-5 space-y-1">
          <li><strong>CAF (Coderium Agent Framework)</strong>: tiket dikerjakan menjadi pull request. Merge tetap keputusan manusia.</li>
          <li><strong>AI Code Reviewer</strong>: review kode dengan AI.</li>
        </ul>
        <p class="mt-3">
          Detail tiap produk ada di halaman
          <NuxtLink to="/products" class="text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline">Produk</NuxtLink>.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">Cara kerja pilot</h2>
        <ul class="list-disc pl-5 space-y-1">
          <li>Kami mulai dari pilot di satu repo.</li>
          <li>Pilot AI Code Review berjalan 4 minggu.</li>
          <li>Pilot CAF berjalan 6-8 minggu dan dibuka dengan fit check di minggu 1.</li>
          <li>Tim Anda yang mereview pull request dan memutuskan merge.</li>
        </ul>
        <p class="mt-3">
          Harga dan syarat dari klien ada di halaman
          <NuxtLink to="/kerja-sama" class="text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline">Kerja Sama</NuxtLink>.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">Artikel</h2>
        <p>
          Kami juga menulis
          <NuxtLink to="/explore" class="text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline">artikel</NuxtLink>
          dan
          <NuxtLink to="/playlists" class="text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline">series</NuxtLink>
          sebagai pelengkap.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">Kontak</h2>
        <p>
          Kontak hanya lewat email:
          <a :href="contactMailto" class="text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline">{{ CONTACT_EMAIL }}</a>.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

const CONTACT_EMAIL = 'hello@coderium.id';
const contactMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Diskusi pilot')}`;

useSeo({
  title: 'Tentang',
  description:
    'Coderium adalah AI agency untuk tim engineering. Kami membuat CAF (Coderium Agent Framework) dan AI Code Reviewer, dan bekerja lewat pilot di satu repo.',
});
</script>
