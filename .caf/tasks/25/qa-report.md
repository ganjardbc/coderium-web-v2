# QA Report — Ticket #25: Frontend "AI Agent" Module

## Status: PASS

## Ringkasan
Klaim di `verify-report.md` diverifikasi ulang terhadap kode aktual di
`apps/admin/src/modules/ai-agent/` dan file terkait (`global-routes.ts`,
`AdminLayout.vue`, `modules/posts/stores/post.store.ts`). Typecheck dan build
dijalankan ulang secara independen dari root repo — keduanya PASS tanpa error,
konsisten dengan klaim Coder.

## Verifikasi yang Dilakukan

### 1. Command re-run (independen, bukan percaya klaim)
- `pnpm --filter coderium-admin run typecheck` → PASS, tanpa output error.
- `pnpm --filter coderium-admin run build` → PASS (`vue-tsc -b && vite build`,
  687 modules, build sukses dalam 1.27s). Warning chunk >500kB
  (`index-D8-ErfIT.js`, 535.90 kB) memang pre-existing, tidak terkait modul
  `ai-agent` (chunk-chunk baru `article-preview-*.js` ukurannya kecil, 1.5–5.86 kB).

### 2. `stores/ai-content.store.ts` — urutan commit
Dibaca baris demi baris (`commitPost`, baris 57-96):
- Step 1: `POST /admin/ai-content/cover` dengan `{ imageUrl: preview.value.coverUrl }`
  dipanggil LEBIH DULU → hasil `data.data.url` disimpan ke variabel lokal `coverUrl`.
- Step 2: `usePostStore().createPost({ ..., cover: coverUrl, ... })` — field `cover`
  yang dikirim adalah `data.url` internal, BUKAN `preview.value.coverUrl` (URL
  eksternal mentah). Confirmed benar sesuai kontrak `requirements.md`.
- Kegagalan step manapun → `commitError` diisi pesan generik, `committing=false`,
  `preview` tidak di-null-kan, tidak lanjut ke step berikutnya. Sesuai spec.
- `reset()` dipanggil setelah `createPost` sukses (baris 88), sebelum return —
  sesuai requirement #5.3.
- Catatan: `sourceUrl` di-extend via type lokal `CreatePostWithSourceUrl` (bukan
  mengubah `CreatePostPayload` shared di `modules/posts`) — pendekatan valid,
  tidak menyentuh module `posts`, dan lolos typecheck karena TypeScript hanya
  menjalankan excess-property-check pada object literal langsung, bukan pada
  variabel — jadi tidak ada error meski `CreatePostPayload` belum punya field
  `sourceUrl` di level tipe. Sesuai batasan scope (`apps/api` dan
  `modules/posts` tidak diubah).

### 3. `pages/index.vue` — 4 card
- 4 card hardcode array literal (`article`/`carousel`/`video`/`stack_gallery`),
  Article `enabled: true` tampil pertama, 3 lainnya `enabled: false`.
- Card disabled: `@click` di template selalu terikat (`@click="card.enabled ?
  handleCardClick(card) : undefined"`) — TAPI ketika `enabled=false`, ekspresi
  di sisi kanan `undefined`, bukan handler, jadi klik tidak memicu apapun.
  `handleCardClick()` sendiri juga punya guard tambahan (`if (card.type !==
  'article') return;`) sebagai lapis kedua. Efektif non-fungsional, sesuai spec.
- Styling disabled: `opacity-50`, `cursor-not-allowed`, badge "Segera Hadir" —
  sesuai requirement #4.

### 4. `pages/article-preview.vue` — 3 state + guard
- 3 state (`loading`/`error`/`preview` dengan `v-else-if` chain) — sesuai.
- `onMounted`: generate hanya dipanggil kalau `status === 'idle'` (baris 149-155)
  — tidak double-generate dari grid + preview.
- Guard leave-confirmation:
  - `handleBeforeUnload` (baris 177-182) cek `status.value === 'preview'` sebelum
    `preventDefault()`.
  - `onBeforeRouteLeave` (baris 192-197) cek `status.value === 'preview'` sebelum
    `window.confirm(...)`, return `true` (lolos tanpa konfirmasi) di state lain.
  - Kedua guard TIDAK aktif saat `loading`/`error` — sesuai requirement.
- Redirect setelah commit sukses: `router.push(\`/posts/${post.slug}/edit\`)`
  (baris 166-171), hanya dieksekusi kalau `commitPost` mengembalikan `Post`
  (truthy) — kalau gagal (`undefined`), tidak redirect, `commitError` tampil di
  template dekat tombol commit. Sesuai spec.

### 5. Routing & menu
- `apps/admin/src/core/global-routes.ts`: import `aiAgentRoutes` dari
  `@/modules/ai-agent/router` (baris 10) dan di-spread ke array `routes` (baris
  21) — terdaftar beneran, bukan cuma diimpor tanpa dipakai.
- `apps/admin/src/modules/ai-agent/router/index.ts`: 2 route (`/ai-agent`,
  `/ai-agent/article/preview`), meta `{ title, layout: 'admin', requiresAuth:
  true, permission: ['manage_own_posts'] }` + `backTo: '/ai-agent'` di halaman
  preview — pola sama dengan `postsRoutes`.
- Path file layout dikonfirmasi: `apps/admin/src/layouts/AdminLayout.vue` (bukan
  `layouts/admin/AdminLayout.vue` yang disebut di `tasks.md`/`CLAUDE.md` —
  direktori `layouts/admin/` memang tidak ada di repo ini; koreksi Coder di
  verify-report.md akurat, diverifikasi via `ls`).
- Menu item "AI Agent" (`to: '/ai-agent'`) benar ada di `menuSections` section
  "Main Menu" (baris 272-275) dan `iconMap['/ai-agent'] = 'pi-sparkles'` (baris
  331) — icon tidak collide dengan section lain (`/`, `/posts`, `/products`,
  `/playlists`, `/media`, `/users`, `/settings/profile` semua icon berbeda).

### 6. Scope compliance
- `git diff --stat main...HEAD -- apps/api apps/admin/src/modules/posts` →
  kosong (tidak ada perubahan). Confirmed TIDAK ada modifikasi backend atau
  modul `posts`, hanya reuse `usePostStore`, `CreatePostPayload`, `Post` type.
- File yang diubah di luar modul baru hanya `global-routes.ts` (tambah
  import+route) dan `AdminLayout.vue` (tambah menu+icon) — sesuai scope T1.
- Perubahan tambahan di working tree (`README.md`, `docs/api/api-contract.md`,
  `docs/architecture/module-breakdown.md`, `docs/development/backlog.md`,
  `docs/development/progress.md`) berisi dokumentasi kontrak fitur AI Agent
  (bukan perubahan kode/scope) — tidak melanggar batasan scope ticket.

## NON-CRITICAL

1. **Smoke test end-to-end di-skip** — sesuai dan dinilai sah. Backend ticket
   #24 (`apps/api/src/ai-content/`) belum ada di branch `ai-agent/25` (PR #26
   belum merge), sehingga endpoint `/admin/ai-content/generate` dan
   `/admin/ai-content/cover` tidak bisa dites langsung. Ini gap yang sudah
   didokumentasikan dengan jelas di `verify-report.md`, bukan kelalaian Coder.
   Review kode manual (di atas) mengonfirmasi logic sudah benar terhadap
   kontrak — tidak ditemukan bug fungsional independen yang akan gagal setelah
   backend tersedia. **Rekomendasi**: jalankan smoke test manual begitu PR #26
   (backend) merge, sebelum ticket #25 dianggap selesai secara fungsional
   end-to-end (sudah dicatat juga oleh Coder di catatan reviewer).
2. `permission: ['manage_own_posts']` di meta route `aiAgentRoutes` tidak
   di-enforce oleh `router.beforeEach` di `global-routes.ts` (guard di sana
   hanya cek `requiresAuth`/`requiresGuest`, bukan `permission`). Ini BUKAN
   regresi dari ticket ini — pola yang sama persis (field `permission` di meta
   tanpa enforcement level router) sudah ada di `modules/posts/router/index.ts`
   sebelum ticket ini, jadi konsisten dengan konvensi existing repo (enforcement
   kemungkinan terjadi di level backend/komponen lain, di luar scope temuan ini).

## Kesimpulan
Semua acceptance criteria fungsional di `requirements.md` yang bisa diverifikasi
tanpa backend live sudah terpenuhi dan cocok dengan kode aktual (bukan cuma klaim
di `verify-report.md`). Typecheck dan build lolos saat dijalankan ulang secara
independen. Tidak ditemukan bug fungsional independen. Smoke test end-to-end
yang di-skip adalah gap non-critical yang sudah diketahui dan didokumentasikan,
sesuai dependency backend ticket #24 yang belum merge.
