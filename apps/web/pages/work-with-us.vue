<template>
  <div class="page-shell">
    <PageHeader
      title="Kerja Sama"
      lead="Alatnya gratis untuk dipasang sendiri. Jika ingin dipasang dan disesuaikan oleh Coderium, kita mulai dari audit gratis. Kontak lewat email."
    />

    <!-- Cara kerja sama (no prices; options come from composables/useEngagement.ts) -->
    <section class="pb-10 md:pb-16 border-b border-gray-100 dark:border-gray-800">
      <h2 class="section-title mb-6 md:mb-8">Cara kerja sama</h2>
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
        Dukungan bulanan bersifat opsional. {{ CLIENT_COST_NOTE }}
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
          <p class="section-title">Mau mulai dengan audit gratis?</p>
          <p class="mt-2 body-copy">
            Kirim email ke {{ CONTACT_EMAIL }}. Tidak ada form, tidak perlu membuat akun.
          </p>
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
import type { ProductFaqItem } from '@coderium/shared-types';

definePageMeta({
  layout: 'default',
});

// No fixed prices on this page: the tools are free, the audit is free, and the
// installation is quoted in a written fixed-scope offer after the audit. Terms
// come from .caf/tasks/CDR-AGENCY/requirements.md; do not add new figures.
// Contact helpers come from composables/useContact.ts.

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
    question: 'Berapa biayanya?',
    answer:
      'Alatnya gratis untuk dipasang sendiri, dan audit juga gratis. Setelah audit, Anda menerima penawaran tertulis dengan lingkup tetap. Biaya server dan model dibayar klien langsung.',
  },
  {
    question: 'Apa itu program design partner?',
    answer: 'Untuk 3 klien pertama, kami memberi harga khusus dengan imbalan izin menulis studi kasus.',
  },
  {
    question: 'Bagaimana cara memulai?',
    answer: `Pesan audit gratis lewat email ke ${CONTACT_EMAIL}. Tidak ada form atau pendaftaran akun.`,
  },
];

useSeo({
  title: 'Kerja Sama',
  description:
    'Cara kerja sama dengan Coderium: pasang sendiri gratis, dipasang Coderium mulai dari audit gratis, atau dukungan bulanan. Syarat dari klien dan kontak lewat email.',
});

useJsonLd(faqPageJsonLd(faq));
</script>
