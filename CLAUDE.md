# CLAUDE.md

> **DRAFT — wajib direview.** File ini digenerate otomatis oleh `caf-initiator`
> berdasarkan deteksi repo. Isi bagian TODO sebelum dipakai tim/agent.

## Project

- Tipe: monorepo (Turborepo)
- Package manager: pnpm
- Tracker: Linear
- Database: postgresql (terdeteksi via apps/api/prisma/schema.prisma)

## Apps

- `apps/admin` — Vue
- `apps/api` — NestJS
- `apps/web` — Nuxt
- `packages/eslint-config` — TODO: framework belum terdeteksi
- `packages/shared-types` — TODO: framework belum terdeteksi
- `packages/shared-utils` — TODO: framework belum terdeteksi
- `packages/tsconfig` — TODO: framework belum terdeteksi
- `packages/ui` — TODO: framework belum terdeteksi

## Konvensi Kode

TODO: isi konvensi kode konkret (naming, struktur folder, pola error handling, dst).
Jangan tulis hal umum yang AI sudah tahu — fokus ke keputusan spesifik project ini.

## Konteks Bisnis

TODO: jelaskan domain bisnis, siapa user, batasan penting yang harus dipahami agent
sebelum mengubah kode.

## Perintah Verifikasi

TODO: isi command aktual dari `package.json` (jangan asumsi nama script):
- typecheck: `pnpm run TODO`
- lint: `pnpm run TODO`
- test: `pnpm run TODO`
- build: `pnpm run TODO`

## Referensi

- Lihat `AGENTS.md` untuk aturan cross-tool.
- Lihat `docs/golden-examples/` untuk referensi kode.
- Lihat `docs/decisions/` untuk ADR.
- Lihat `.ai/tasks/README.md` untuk struktur artifact handoff.
