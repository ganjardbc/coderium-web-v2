<template>
  <div class="page-shell">
    <PageHeader title="Kerja Sama" lead="Kami mulai dari uji coba di satu repo, dengan harga yang terbuka. Kontak lewat email." />

    <!-- Paket dan harga -->
    <section class="pb-10 md:pb-16 border-b border-gray-100 dark:border-gray-800">
      <h2 class="section-title mb-6 md:mb-8">Paket dan harga</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <PricingCard
          v-for="plan in pricingPlans"
          :key="plan.id"
          :plan="plan"
          :highlighted="plan.id === HIGHLIGHTED_PLAN_ID"
        />
      </div>
      <p class="mt-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        Harga perintis: {{ PIONEER_PRICE_NOTE }} Retainer bersifat opsional. {{ CLIENT_COST_NOTE }}
      </p>
    </section>

    <!-- Syarat dari klien -->
    <section class="split-section">
      <h2 class="section-title">Yang kami butuhkan dari Anda</h2>
      <ul class="divide-y divide-gray-100 dark:divide-gray-800 border-y border-gray-100 dark:border-gray-800">
        <li
          v-for="item in clientRequirements"
          :key="item"
          class="flex gap-3 py-4 body-copy"
        >
          <Icon name="lucide:check" class="w-5 h-5 mt-1 shrink-0 text-primary dark:text-indigo-300" aria-hidden="true" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </section>

    <!-- FAQ -->
    <section class="split-section">
      <h2 class="section-title">Yang sering ditanyakan</h2>
      <FaqAccordion :items="faq" />
    </section>

    <!-- CTA penutup -->
    <section class="py-10 md:py-16">
      <div class="card flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 md:p-10">
        <div>
          <p class="section-title">Mau diskusi uji coba?</p>
          <p class="mt-2 body-copy">
            Kirim email ke {{ CONTACT_EMAIL }}. Tidak ada form, tidak perlu membuat akun.
          </p>
        </div>
        <a :href="mailto('Diskusi uji coba')" class="btn btn-solid gap-2 shrink-0">
          <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
          Kirim email
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ProductFaqItem } from '@coderium/shared-types';

definePageMeta({
  layout: 'default',
});

// Prices, durations, and terms on this page come from the "Data yang boleh
// dipakai" section of docs/development/agency-pivot/requirements.md. Do not
// add figures or claims that are not recorded there.
const CONTACT_EMAIL = 'hello@coderium.id';

function mailto(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

// Prices come from composables/usePricing.ts, shared with the homepage cards.

const clientRequirements = [
  'Satu penanggung jawab dari tim Anda.',
  'Akses ke repo dan server.',
  'Tiket yang jelas.',
  'Feedback PR maksimal 1 hari kerja.',
  CLIENT_COST_NOTE,
];

const faq: ProductFaqItem[] = [
  {
    question: 'Apakah merge dilakukan otomatis?',
    answer: 'Tidak. Merge tetap keputusan manusia di tim Anda.',
  },
  {
    question: 'Tiket seperti apa yang belum kami kerjakan?',
    answer: 'Tiket keamanan dan hak akses, serta tiket besar lintas sistem.',
  },
  {
    question: 'Apakah CAF mendukung Jira dan GitLab?',
    answer: 'Belum tersedia. Keduanya ada di rencana.',
  },
  {
    question: 'Apakah ada SLA dukungan?',
    answer: 'Belum ada SLA dukungan.',
  },
  {
    question: 'Apa itu harga perintis?',
    answer: 'Diskon 30% dari harga uji coba, dengan izin dari Anda untuk menuliskan studi kasus.',
  },
  {
    question: 'Bagaimana cara memulai?',
    answer: `Kirim email ke ${CONTACT_EMAIL}. Tidak ada form atau pendaftaran akun.`,
  },
];

useSeo({
  title: 'Kerja Sama',
  description:
    'Uji coba AI Code Review dan uji coba CAF untuk tim engineering: harga terbuka, syarat dari klien, dan kontak lewat email hello@coderium.id.',
});

useJsonLd(faqPageJsonLd(faq));
</script>
