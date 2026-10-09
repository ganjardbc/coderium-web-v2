<template>
  <div class="w-full max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-12">
    <!-- Header -->
    <section class="pb-8 md:pb-12 border-b border-gray-100 dark:border-gray-800">
      <h1 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
        Kerja Sama
      </h1>
      <p class="mt-3 md:mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
        Kami mulai dari pilot di satu repo, dengan harga yang terbuka. Kontak lewat email.
      </p>
      <a
        :href="mailto('Diskusi pilot')"
        class="mt-6 inline-flex items-center min-h-11 px-6 py-2.5 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
      >
        Kirim email untuk diskusi
      </a>
    </section>

    <!-- Pilot dan harga -->
    <section class="py-8 md:py-12 border-b border-gray-100 dark:border-gray-800">
      <h2 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Pilot dan harga</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <article
          v-for="pilot in pilots"
          :key="pilot.name"
          class="flex flex-col p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-800"
        >
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ pilot.name }}</h3>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ pilot.scope }}</p>
          <p class="mt-4 text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {{ pilot.price }}
          </p>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Harga perintis: <span class="font-semibold text-gray-900 dark:text-white">{{ pilot.pioneerPrice }}</span>
          </p>
          <p v-if="pilot.note" class="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ pilot.note }}
          </p>
          <a
            :href="mailto(pilot.subject)"
            class="mt-5 md:mt-auto md:pt-5 inline-flex items-center min-h-11 text-sm font-semibold text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline"
          >
            Kirim email soal {{ pilot.name }}
          </a>
        </article>
      </div>

      <div class="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div class="p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <h3 class="text-base font-bold text-gray-900 dark:text-white">Harga perintis</h3>
          <p class="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ PIONEER_PRICE_NOTE }}
          </p>
        </div>
        <div v-if="retainer" class="p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <h3 class="text-base font-bold text-gray-900 dark:text-white">Retainer (opsional)</h3>
          <p class="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ retainer.price }} {{ retainer.priceUnit }}, {{ retainer.scope }}.
          </p>
        </div>
      </div>
    </section>

    <!-- Syarat dari klien -->
    <section class="py-8 md:py-12 border-b border-gray-100 dark:border-gray-800">
      <h2 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">
        Yang kami butuhkan dari Anda
      </h2>
      <ul class="space-y-3">
        <li
          v-for="item in clientRequirements"
          :key="item"
          class="flex gap-3 text-base text-gray-700 dark:text-gray-300 leading-relaxed"
        >
          <Icon name="lucide:check" class="w-5 h-5 mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </section>

    <!-- FAQ -->
    <section class="py-8 md:py-12 border-b border-gray-100 dark:border-gray-800">
      <h2 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">FAQ</h2>
      <FaqAccordion :items="faq" />
    </section>

    <!-- CTA penutup -->
    <section class="py-8 md:py-12 text-center">
      <p class="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Mau diskusi pilot?</p>
      <p class="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
        Kirim email ke
        <a :href="mailto('Diskusi pilot')" class="text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline">{{ CONTACT_EMAIL }}</a>.
      </p>
      <a
        :href="mailto('Diskusi pilot')"
        class="mt-5 inline-flex items-center min-h-11 px-6 py-2.5 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
      >
        Kirim email
      </a>
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

// Shared with the homepage pricing cards (composables/usePricing.ts).
const pilots = pricingPlans.filter((plan) => plan.id !== 'retainer');
const retainer = pricingPlans.find((plan) => plan.id === 'retainer');

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
    answer: 'Diskon 30% dari harga pilot, dengan izin dari Anda untuk menuliskan studi kasus.',
  },
  {
    question: 'Bagaimana cara memulai?',
    answer: `Kirim email ke ${CONTACT_EMAIL}. Tidak ada form atau pendaftaran akun.`,
  },
];

useSeo({
  title: 'Kerja Sama',
  description:
    'Pilot AI Code Review dan pilot CAF untuk tim engineering: harga terbuka, syarat dari klien, dan kontak lewat email hello@coderium.id.',
});

useJsonLd(faqPageJsonLd(faq));
</script>
