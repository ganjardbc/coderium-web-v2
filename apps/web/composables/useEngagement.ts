// Single source for the three ways to work with Coderium, shown on the
// homepage and on /work-with-us so the two pages can never disagree.
// No prices here on purpose: the tools are free, the audit is free, and the
// installation is quoted in a written fixed-scope offer after the audit.

import { AUDIT_SUBJECT } from './useContact';

export interface EngagementOption {
  id: 'self-install' | 'installed' | 'support';
  name: string;
  summary: string;
  points: string[];
  action:
    | { kind: 'link'; label: string; to: string }
    | { kind: 'mailto'; label: string; subject: string };
}

export const engagementOptions: EngagementOption[] = [
  {
    id: 'self-install',
    name: 'Pasang sendiri',
    summary: 'Gratis dan open source.',
    points: [
      'Tim Anda memasang CAF atau AI Code Reviewer sendiri.',
      'Berjalan di server Anda.',
    ],
    action: { kind: 'link', label: 'Lihat produk', to: '/products' },
  },
  {
    id: 'installed',
    name: 'Dipasang Coderium',
    summary: 'Mulai dari audit gratis, lalu penawaran tertulis.',
    points: [
      'Audit gratis 30-60 menit untuk melihat apakah AI memang membantu tim Anda.',
      'Penawaran tertulis dengan lingkup tetap.',
      'Kami memasang dan menyesuaikan di server Anda.',
    ],
    action: { kind: 'mailto', label: 'Pesan audit gratis', subject: AUDIT_SUBJECT },
  },
  {
    id: 'support',
    name: 'Dukungan bulanan',
    summary: 'Opsional, setelah pemasangan.',
    points: ['Pilihan setelah pemasangan selesai.', 'Jam kerja terbatas per bulan.'],
    action: { kind: 'mailto', label: 'Tanya soal dukungan', subject: 'Dukungan bulanan Coderium' },
  },
];

// The option shown with a filled button wherever the cards are listed.
export const HIGHLIGHTED_ENGAGEMENT_ID: EngagementOption['id'] = 'installed';

export const CLIENT_COST_NOTE = 'Biaya server dan model ditanggung klien dan dibayar langsung oleh klien.';
