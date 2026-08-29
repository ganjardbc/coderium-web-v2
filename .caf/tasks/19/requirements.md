# Requirements — Ticket #19: Admin UI — tampilkan atribusi sumber draft hermes

## Status: PLAN

## Sumber
GitHub Issue #19 (ganjardbc/coderium-web-v2, repo `apps/admin` — Vue). Tidak bisa fetch body
issue via `gh issue view 19` di run ini (tool `gh`/Bash tidak tersedia untuk Planner di
sesi ini — hanya `Read`/`Write`). Requirement di bawah disusun dari:
- Title ticket: "Admin UI — tampilkan atribusi sumber draft hermes".
- `.caf/discovery/hermes-article-ingest/prd.md` (`## Scope`, baris terkait "menampilkan field
  ini di admin dashboard (list/detail post existing)").
- `.caf/discovery/hermes-article-ingest/flow.md` (`## Keputusan UX Designer` — UX Designer
  Agent sengaja TIDAK dipakai, alasan: cukup 1 field tambahan di halaman list/edit existing).
- `.caf/tasks/18/requirements.md` (kontrak data `sourceUrl`/`externalId`, SELESAI & MERGE).
- Investigasi langsung kode `apps/admin` dan `apps/api` (lihat `## Konvensi` di bawah).

**Catatan untuk Implementer:** kalau saat pickup ticket ternyata `gh issue view 19` tersedia
dan body issue punya detail yang bertentangan dengan dokumen ini (mis. lokasi badge yang
diminta beda), body issue asli menang — requirement ini disusun dari sumber terbaik yang bisa
diakses Planner saat itu, bukan pengganti body issue.

## Problem
Ticket #18 (SELESAI, merge ke `main`) sudah menambah field `sourceUrl` (String?, atribusi
URL artikel sumber) dan `externalId` (String? @unique, basis dedup) ke model `Post`, dan
field ini sudah otomatis ikut ter-serialize di response `GET /admin/posts` dan
`GET /admin/posts/:slug` (diverifikasi: `PostsService.findAdminAll`/`findAdminBySlug` di
`apps/api/src/posts/posts.service.ts` memakai `prisma.post.findMany`/`findFirst` TANPA
klausa `select` — semua kolom Prisma ikut return apa adanya, tidak ada DTO response yang
whitelist field). Masalahnya: sisi UI (`apps/admin`) belum menampilkan field ini sama sekali
— interface `Post` di `apps/admin/src/modules/posts/stores/post.store.ts` tidak punya
`sourceUrl`/`externalId`, dan baik halaman list (`pages/list.vue`) maupun edit
(`pages/edit.vue`) tidak menampilkannya. Akibatnya user tidak bisa membedakan draft dari
hermes vs draft manual tanpa buka Telegram/log VPS — padahal ini success metric eksplisit di
`prd.md` (baris 26-28).

## Target User
Sama seperti PRD: pemilik/pengelola konten coderium (juga operator hermes), login ke
`apps/admin` sebagai content reviewer.

## Verifikasi Prasyarat (Dependency Ticket #18)
- [x] `sourceUrl` (String?, nullable) dan `externalId` (String? @unique) sudah ada di
      `apps/api/prisma/schema.prisma:104-138` (`Post` model, sudah di-migrate & merge).
- [x] `GET /api/v1/admin/posts` (list) dan `GET /api/v1/admin/posts/:slug` (detail, dipakai
      halaman edit) sudah mengembalikan `sourceUrl` apa adanya tanpa perubahan tambahan di
      `apps/api` — diverifikasi lewat baca `PostsService.findAdminAll`/`findAdminBySlug`,
      TIDAK ADA `select` whitelist di query Prisma-nya.
- **Kesimpulan: TIDAK ADA perubahan di `apps/api` dalam scope ticket ini.** Seluruh scope
  murni `apps/admin` (frontend Vue).

## Acceptance Criteria
- [ ] Interface `Post` di `apps/admin/src/modules/posts/stores/post.store.ts` punya field baru
      `sourceUrl?: string | null;` (dan opsional `externalId?: string | null;` untuk
      kelengkapan tipe, meski tidak wajib ditampilkan di UI — lihat Celah & Ambiguitas #2).
- [ ] Halaman list post (`apps/admin/src/modules/posts/pages/list.vue`) menampilkan penanda
      visual (badge/Tag) di baris post yang `sourceUrl` terisi (truthy), menandakan draft
      tersebut berasal dari hermes. Post dengan `sourceUrl` kosong/null (draft manual) TIDAK
      menampilkan badge ini.
- [ ] Halaman edit post (`apps/admin/src/modules/posts/pages/edit.vue`) menampilkan field
      `sourceUrl` sebagai read-only info (bukan input form yang bisa diedit user — field ini
      milik hermes, bukan konten yang user tulis) ketika `sourceUrl` terisi. Ditampilkan
      sebagai link yang bisa diklik (`<a href target="_blank" rel="noopener">`) ke URL artikel
      sumber, supaya user bisa cross-check langsung ke artikel asal tanpa buka Telegram/VPS.
      Kalau `sourceUrl` kosong/null, section ini tidak ditampilkan sama sekali (bukan tampil
      kosong/dash) — post manual tidak perlu melihat UI kosong yang tidak relevan.
- [ ] `sourceUrl` TIDAK dikirim balik ke `PUT /admin/posts/:slug` sebagai bagian dari
      `updatePost` payload di `edit.vue` — field ini read-only dari sisi admin UI, bukan
      bagian dari `UpdatePostDto`/`CreatePostPayload` yang user edit.
- [ ] Tidak ada perubahan file di `apps/api` — verifikasi ini bagian dari Verify Checklist
      Implementer (diff harus 100% terbatas ke `apps/admin`).
- [ ] `pnpm --filter coderium-admin run typecheck` dan `pnpm --filter coderium-admin run build`
      lolos tanpa error baru.

## Di Luar Scope
- Perubahan apapun di `apps/api` (endpoint, DTO, service, schema) — sudah SELESAI di ticket
  #18, tidak dikerjakan ulang.
- Menampilkan `externalId` di UI — field ini internal (basis dedup hermes), bukan atribusi
  yang perlu dilihat user secara visual; tidak ada requirement eksplisit untuk menampilkannya
  (lihat Celah & Ambiguitas #2 untuk opsi kalau Implementer/user tetap mau).
- Filter/search post berdasarkan sumber (mis. "tampilkan hanya draft dari hermes") di halaman
  list — tidak disebut di scope PRD manapun (`prd.md` hanya minta "bisa membedakan", bukan
  "bisa filter"); kalau dibutuhkan, jadi permintaan terpisah.
- Editorial tooling baru (rich text editor upgrade, dst.) — eksplisit out-of-scope di
  `prd.md`.
- Desain UX baru dari nol (UX Designer Agent) — sudah diputuskan tidak diperlukan di
  `flow.md`, perubahan ini sekadar menambah field/badge kecil ke halaman existing dengan pola
  komponen (PrimeVue `Tag`) yang sudah dipakai di tempat lain di file yang sama.
- Notifikasi in-app untuk draft baru dari hermes — eksplisit out-of-scope di `prd.md`.

## Celah & Ambiguitas
1. **Body issue GitHub #19 tidak terbaca oleh Planner** (lihat `## Sumber` di atas) — kalau
   Implementer/`gh issue view 19` menunjukkan detail tambahan (mis. copy text badge spesifik,
   posisi kolom tertentu di tabel) yang berbeda dari requirement ini, ikuti body issue asli.
   Requirement ini disusun dari discovery docs + investigasi kode langsung sebagai fallback
   terbaik yang tersedia, bukan pengganti otoritatif body issue. Tidak blocking untuk mulai
   implementasi — cukup jadi catatan verifikasi tambahan Implementer di awal PIV.
2. **Apakah `externalId` perlu ditampilkan juga** — PRD (`prd.md` baris 26-28) hanya
   menyebut atribusi via "field `sourceUrl`/`source`", tidak menyebut `externalId` sebagai
   sesuatu yang perlu dilihat user. **Rekomendasi Planner:** tidak perlu, `externalId` murni
   basis dedup teknis (server-side), bukan sesuatu yang informatif buat content reviewer.
   Final call Implementer boleh beda (mis. tooltip kecil di badge list menampilkan
   `externalId` untuk debugging), tidak blocking.
3. **Bentuk visual badge di list.vue** — tidak ada mockup/desain spesifik (UX Designer Agent
   tidak dipakai). **Rekomendasi Planner:** pakai komponen `Tag` PrimeVue yang sudah
   diimport & dipakai di file yang sama (`list.vue:106`, dipakai untuk kolom Type & Status),
   severity `info`, label singkat seperti `"Hermes"` atau ikon `pi-bolt`/`pi-sparkles` +
   tooltip "Sourced from Hermes" — konsisten dengan pola Tag existing di tabel yang sama,
   ditaruh berdekatan dengan title (kolom Title, di bawah/samping judul) supaya kelihatan
   tanpa nambah kolom baru yang mepetkan tabel. Final placement/label text keputusan
   Implementer, tidak blocking — yang wajib cuma "ada penanda visual yang jelas".
4. **Link sourceUrl di edit.vue — sidebar card baru atau inline di dekat field lain** — tidak
   ada instruksi spesifik. **Rekomendasi Planner:** tambah `SidebarCard` baru (komponen lokal
   yang sudah dipakai berulang di file yang sama, `edit.vue:220-232`, label "Source" icon
   `pi-link`) berisi link `sourceUrl`, ditaruh di kolom sidebar (`edit.vue:109-180`) sebelum
   atau sesudah "Cover Image" — konsisten dengan pola SidebarCard existing lainnya di file
   yang sama. Tidak blocking, Implementer boleh pilih lokasi lain asal read-only dan hanya
   muncul saat `sourceUrl` ada.
5. Tidak ada Pertanyaan Terbuka yang blocking dari prd.md/flow.md — status tetap `PLAN`.

## Konvensi yang harus diikuti (referensi codebase existing)
- App: `apps/admin` (Vue 3 + Vite + PrimeVue + Pinia). Package name: `coderium-admin`
  (`apps/admin/package.json`).
- File terdampak (SEMUA di `apps/admin`, TIDAK ADA file `apps/api` yang disentuh):
  - `apps/admin/src/modules/posts/stores/post.store.ts` — interface `Post`, tambah field baru.
  - `apps/admin/src/modules/posts/pages/list.vue` — badge/Tag di baris post dari hermes.
  - `apps/admin/src/modules/posts/pages/edit.vue` — SidebarCard/read-only display `sourceUrl`.
- Komponen UI: PrimeVue auto-import (`unplugin-vue-components` + `PrimeVueResolver`, lihat
  `apps/admin/vite.config.ts:12-16`) — komponen PrimeVue bisa dipakai tanpa import manual di
  template, tapi kode existing di kedua file (`list.vue`, `edit.vue`) tetap eksplisit
  mengimpor named exports dari `primevue` di `<script setup>` (lihat `list.vue:106`,
  `edit.vue:188-196`) — ikuti pola import eksplisit yang sama, jangan campur gaya auto-import
  di file yang sudah pakai pola eksplisit.
- Pola komponen lokal reusable (`FormField`, `SidebarCard`) didefinisikan inline di
  `<script setup>` pakai `defineComponent`+`h()` langsung di `edit.vue` (baris 204-232) — kalau
  nambah section baru di edit.vue, pakai `SidebarCard` yang sudah ada, bukan bikin komponen
  terpisah baru (scope kecil, tidak perlu file baru).
- Routing tidak berubah — tidak ada halaman/route baru (`apps/admin/src/modules/posts/router/index.ts`
  tetap 3 route existing: `/posts`, `/posts/create`, `/posts/:slug/edit`).
- Verifikasi realistis: `typecheck` (`vue-tsc --noEmit`) dan `build` (`vue-tsc -b && vite build`)
  di `apps/admin`, dijalankan via `pnpm --filter coderium-admin run typecheck` /
  `run build` dari root repo (Turborepo monorepo, `pnpm` package manager — lihat
  `apps/admin/package.json:6-11`). TIDAK ADA script `test`/`lint` terlihat di
  `apps/admin/package.json` — jangan invent command yang tidak ada.
