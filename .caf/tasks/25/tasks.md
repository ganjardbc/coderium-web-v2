# Tasks — Ticket #25: Frontend "AI Agent" Module

Lihat `requirements.md` untuk kontrak API lengkap dan detail perilaku. File ini adalah urutan
kerja konkret untuk agent berikutnya (Coder). Tidak ada scope backend — semua task di bawah
ada di `apps/admin`.

## Urutan Agent
1. **Coder** — implementasi sesuai breakdown task di bawah (PIV: plan tertulis singkat dulu
   kalau ada keputusan struktur file yang belum jelas, baru implement).
2. **Reviewer** — review diff, cek terhadap `requirements.md` (terutama: `coverUrl` tidak
   pernah dikirim langsung ke `POST /admin/posts`, urutan panggilan
   cover→createPost saat commit, guard leave-confirmation hanya aktif saat status `preview`).
3. Tidak ada agent QA/test-runner otomatis terpisah — verifikasi manual jadi bagian dari
   Verify Checklist Coder (lihat di bawah), karena `apps/admin` tidak punya test suite.

## Breakdown Task

### T1 — Routing & Navigasi
- Buat `apps/admin/src/modules/ai-agent/router/index.ts`, ekspor `aiAgentRoutes:
  RouteRecordRaw[]` dengan 2 route (`/ai-agent`, `/ai-agent/article/preview`), pola meta sama
  seperti `apps/admin/src/modules/posts/router/index.ts`.
- Daftarkan `aiAgentRoutes` di `apps/admin/src/core/global-routes.ts` (tambah import + masukkan
  ke array `routes`).
- Tambah item menu "AI Agent" (path `/ai-agent`) ke `menuSections` (section "Main Menu") dan
  entry baru di `iconMap` di `apps/admin/src/layouts/admin/AdminLayout.vue`.

### T2 — Store `ai-content.store.ts`
- Buat `apps/admin/src/modules/ai-agent/stores/ai-content.store.ts`.
- Implement state + actions sesuai requirement #5 di `requirements.md`
  (`generateArticle`, `reset`, `commitPost`).
- Import `usePostStore` dari `@/modules/posts/stores/post.store` untuk `createPost` — jangan
  duplikasi call `POST /admin/posts`.
- Mapping error backend → pesan generik-ramah di frontend (JANGAN tampilkan raw
  `err.response.data.message` dari `/admin/ai-content/generate` maupun `/cover` ke user;
  boleh dipakai untuk `console.error`/logging dev saja).

### T3 — Halaman Grid Card (`pages/index.vue`)
- 4 card statis (Article + 3 disabled), sesuai visual spec di requirement #4.
- Klik Article → `store.generateArticle()` (fire-and-await tidak wajib — cukup panggil lalu
  langsung `router.push('/ai-agent/article/preview')`, biar halaman preview yang menampilkan
  loading state sampai response datang) atau panggil generate dari `onMounted` halaman preview
  (pilih SALAH SATU pola, jangan generate 2x — direkomendasikan: grid card hanya navigasi,
  `article-preview.vue` yang trigger generate di `onMounted`, supaya "Coba Lagi"/"Generate
  Ulang" di halaman preview reuse fungsi yang sama tanpa duplikasi logic navigasi).
- Card disabled: tidak ada `@click` handler yang melakukan apapun (atau `@click.prevent` kosong
  + `disabled`-like styling), tidak console error.

### T4 — Halaman Preview (`pages/article-preview.vue`)
- 3 sub-state (`loading` / `preview` / `error`) sesuai requirement #6.
- `onMounted`: kalau `store.status === 'idle'`, panggil `store.generateArticle()`.
- Loading: spinner indeterminate (PrimeVue `ProgressSpinner` sudah dipakai di tempat lain di
  admin — cek konvensi existing, reuse kalau ada) + pesan bertahap pakai `setTimeout` lokal di
  komponen (bukan di store — ini murni kosmetik UI, tidak perlu masuk state global).
- Preview: title, content (`v-html` + reuse class `.rich-editor-content` untuk styling prose,
  TANPA `contenteditable`), cover `<img>` + badge + `@error` fallback placeholder, link
  `sourceUrl`, indikator status persisten, tombol "Generate Ulang" + dua tombol commit.
- Error: pesan generik + tombol "Coba Lagi" + tombol kembali.
- Commit handler: panggil `store.commitPost(isPublished)`, redirect
  `router.push(\`/posts/${post.slug}/edit\`)` setelah sukses; tampilkan `commitError` dekat
  tombol kalau gagal, re-enable kedua tombol (jangan biarkan stuck di state loading tombol).
- Guard keluar halaman: `window.addEventListener('beforeunload', ...)` (pasang/lepas sesuai
  `status`) + `onBeforeRouteLeave` dari `vue-router` dengan `window.confirm(...)` — HANYA aktif
  saat `store.status === 'preview'`.
- Tombol "Batal" (di state loading) dan tombol kembali (di state error): `store.reset()` lalu
  `router.push('/ai-agent')` — tidak perlu `window.confirm` di titik ini (belum ada preview
  untuk hilang, sesuai `flow.md`).

### T5 — Cleanup / Cross-check (opsional, verifikasi saat implementasi)
- Cek `apps/admin/src/modules/posts/pages/list.vue` — kalau ada tombol
  "New Post"/"Generate by AI" yang mengarah ke flow lama, evaluasi apakah perlu dihapus
  (PRD revisi memindahkan entry point sepenuhnya ke modul `ai-agent`). Kalau ternyata tidak ada
  tombol seperti itu (sudah bersih), tidak perlu perubahan apapun di modul `posts`.

## Perintah Verifikasi
Jalankan dari root repo (pnpm workspace, filter ke `apps/admin` — package name `coderium-admin`):
- Typecheck: `pnpm --filter coderium-admin run typecheck` (`vue-tsc --noEmit`)
- Build: `pnpm --filter coderium-admin run build` (`vue-tsc -b && vite build`)
- Tidak ada script `lint` di `apps/admin/package.json` dan tidak ada script `test` — SKIP kedua
  perintah ini, jangan asumsikan ada.
- Smoke test manual (wajib, tidak bisa diotomatisasi tanpa backend berjalan — backend ticket
  #24 ada di branch lain, PR #26 belum merge):
  1. Jalankan `apps/api` dari branch/worktree yang sudah punya modul `ai-content` (mis. checkout
     sementara PR #26 di worktree terpisah, atau tunggu merge) + `apps/admin` dev server, login
     sebagai user dengan permission `manage_own_posts`.
  2. Buka `/ai-agent`, verifikasi 4 card tampil, 3 card disabled tidak bisa diklik.
  3. Klik card Article → verifikasi loading state → preview muncul dengan title/content/cover/
     sourceUrl.
  4. Klik "Publish Post" → verifikasi redirect ke `/posts/:slug/edit`, cek `Post.cover` di
     response adalah URL internal (`{APP_URL}/uploads/...`), bukan URL sumber eksternal.
  5. Ulangi generate → klik "Save as Draft" → verifikasi `isPublished: false` di post yang
     dibuat.
  6. Coba navigasi keluar dari halaman preview sebelum commit → verifikasi muncul konfirmasi
     native browser.
  - Kalau backend ticket #24 belum bisa dijalankan di environment implementasi saat ini,
    dokumentasikan di `verify-report.md` bahwa smoke test end-to-end di-skip karena dependency
    backend belum merge — typecheck + build + review kode manual (mock response bentuk kontrak)
    tetap wajib dilakukan sebagai gantinya, JANGAN mengaku selesai tanpa catatan ini.

## Retry Logic
Ikuti default `.claude/agents/caf-planner.md`: verify gagal → perbaiki → retry maks 3x → kalau
masih gagal, stop dan tulis `.caf/tasks/25/verify-report.md` dengan `## Status: NEEDS_HUMAN`,
jelaskan kegagalan spesifik (typecheck error / build error / smoke test blocked karena
dependency #24 belum merge, dll).
