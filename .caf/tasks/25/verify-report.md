# Verify Report — Ticket #25: Frontend "AI Agent" Module

## Status: OK (with noted smoke-test gap)

## Ringkasan Implementasi
- Modul baru `apps/admin/src/modules/ai-agent/` dibuat dengan struktur `router/`, `pages/`,
  `stores/`, mengikuti pola modul `posts` existing.
- Route baru didaftarkan di `apps/admin/src/core/global-routes.ts` (import + push
  `aiAgentRoutes`).
- Item menu sidebar "AI Agent" (`/ai-agent`, icon `pi-sparkles`) ditambahkan ke `menuSections`
  (section "Main Menu") dan `iconMap` di `apps/admin/src/layouts/AdminLayout.vue` (path file:
  `apps/admin/src/layouts/AdminLayout.vue`, bukan `layouts/admin/AdminLayout.vue` — file itu
  tidak ada di repo ini, lokasi aktual sudah diverifikasi via `find`).
- `stores/ai-content.store.ts`: state `preview/status/errorMessage/committing/commitError`,
  action `generateArticle()` (`POST /admin/ai-content/generate`, mapping error ke pesan
  generik-ramah, raw error hanya di `console.error`), `reset()`, `commitPost(isPublished)`
  (urutan wajib: `POST /admin/ai-content/cover` dengan `imageUrl: preview.coverUrl` → ambil
  `data.url` → `usePostStore().createPost({..., cover: data.url, sourceUrl, isPublished})`
  BUKAN `coverUrl` mentah; gagal di step manapun → `commitError` terisi, `preview` tetap ada,
  `committing=false`, tidak lanjut ke step berikutnya).
  - Catatan teknis: `CreatePostPayload` (di `modules/posts/stores/post.store.ts`) belum
    mendeklarasikan field `sourceUrl` di level tipe (meski backend/`Post` entity sudah
    mendukungnya dari fitur hermes-article-ingest sebelumnya). Untuk menghindari menyentuh
    `modules/posts` (di luar scope ticket ini), dibuat type lokal
    `CreatePostWithSourceUrl = CreatePostPayload & { sourceUrl?: string }` di dalam
    `ai-content.store.ts` — tidak ada duplikasi logic `POST /admin/posts`, tetap reuse
    `usePostStore().createPost` apa adanya.
- `pages/index.vue`: 4 card statis hardcode (Article aktif; carousel/video/stack_gallery
  disabled, opacity rendah, badge "Segera Hadir", tidak ada `@click` efektif). Klik Article →
  langsung `router.push('/ai-agent/article/preview')` (grid card TIDAK memanggil generate —
  sesuai rekomendasi `tasks.md` T3, supaya generate hanya terjadi sekali dari `onMounted`
  halaman preview, dipakai ulang juga oleh "Coba Lagi"/"Generate Ulang").
- `pages/article-preview.vue`: 3 sub-state (loading/preview/error).
  - `onMounted`: panggil `generateArticle()` kalau `status === 'idle'`.
  - Loading: `ProgressSpinner` (PrimeVue, konsisten dengan `posts/list.vue`) + pesan bertahap
    (`setTimeout` lokal di komponen, bukan di store) + tombol "Batal" (`reset()` +
    `router.push('/ai-agent')`).
  - Preview: title, `<div class="rich-editor-content" v-html="preview.content">` (styling
    prose di-duplikasi manual dari `RichTextEditor.vue` karena `<style scoped>` tidak bisa
    dipakai lintas komponen — class name sama, block CSS sama persis, dikomentari di file agar
    jelas ini duplikasi sengaja, bukan drift), cover `<img>` dengan badge "dari sumber
    eksternal" + `@error` fallback placeholder "Preview cover tidak tersedia" (tidak
    memblokir commit), link `sourceUrl` (`target="_blank" rel="noopener noreferrer"`),
    indikator status persisten, tombol "Generate Ulang", dua tombol commit ("Save as Draft"
    kiri/outline, "Publish Post" kanan/primary).
  - Error: pesan generik-ramah dari store + tombol "Coba Lagi" + tombol "Kembali" (keduanya
    `reset()` + push tanpa `window.confirm`, sesuai requirement).
  - Commit handler: `store.commitPost(isPublished)` → redirect `/posts/${post.slug}/edit`
    kalau sukses; kalau gagal, `commitError` ditampilkan dekat tombol, kedua tombol
    re-enable (`committing` di-reset ke `false` di dalam store saat gagal).
  - Guard keluar halaman: `window.addEventListener('beforeunload', ...)` (pasang di
    `onMounted`, lepas di `onBeforeUnmount`) + `onBeforeRouteLeave` dengan
    `window.confirm(...)` — keduanya cek `status.value === 'preview'` sebelum
    memblokir/prevent-default.
- T5 cross-check: `apps/admin/src/modules/posts/pages/list.vue` dan `create.vue` sudah
  diperiksa — tidak ada tombol "New Post"/"Generate by AI" yang perlu dihapus (list.vue hanya
  punya "Create New Post" → `/posts/create`, tidak diubah).

## File yang Diubah/Dibuat
- `apps/admin/src/modules/ai-agent/router/index.ts` (baru)
- `apps/admin/src/modules/ai-agent/stores/ai-content.store.ts` (baru)
- `apps/admin/src/modules/ai-agent/pages/index.vue` (baru)
- `apps/admin/src/modules/ai-agent/pages/article-preview.vue` (baru)
- `apps/admin/src/core/global-routes.ts` (tambah import + entry `aiAgentRoutes`)
- `apps/admin/src/layouts/AdminLayout.vue` (tambah menu item "AI Agent" + `iconMap` entry)

Tidak ada perubahan di `apps/api/**` atau `apps/admin/src/modules/posts/**`.

## Verify Checklist
- [x] `pnpm --filter coderium-admin run typecheck` — PASS, tanpa error.
- [x] `pnpm --filter coderium-admin run build` — PASS (`vue-tsc -b && vite build`), build sukses
  (hanya warning ukuran chunk >500kB pada `index-D8-ErfIT.js`, sudah ada sebelum perubahan ini,
  bukan regresi dari modul baru).
- [ ] Lint — TIDAK ADA script `lint` di `apps/admin/package.json`, SKIP sesuai catatan
  `tasks.md`/`requirements.md`.
- [ ] Test otomatis — TIDAK ADA script `test` di `apps/admin/package.json`, SKIP sesuai catatan
  `tasks.md`/`requirements.md`.
- [ ] Smoke test manual end-to-end (buka `/ai-agent`, generate, publish/draft, cek redirect,
  cek `Post.cover` jadi URL internal, cek konfirmasi keluar halaman) — **DI-SKIP**. Backend
  ticket #24 (`apps/api/src/ai-content/`) tidak ada di branch `ai-agent/25` ini (PR #26 belum
  merge, sesuai catatan di deskripsi ticket dan `requirements.md`), sehingga endpoint
  `/admin/ai-content/generate` dan `/admin/ai-content/cover` tidak bisa dipanggil dari
  environment implementasi saat ini. Sebagai gantinya, verifikasi dilakukan lewat:
  - Review kode manual terhadap kontrak API di `requirements.md` (bentuk request/response,
    urutan panggilan cover→createPost, field `cover` yang dikirim adalah `data.url` bukan
    `coverUrl` mentah).
  - Typecheck + build sukses (memvalidasi tipe request/response yang diasumsikan konsisten
    dengan kontrak, serta tidak ada broken import/reference).
  - Review visual manual pada kode template (struktur card, state loading/preview/error,
    guard leave-confirmation) dibandingkan spesifikasi di `requirements.md`/`flow.md`.

## Retry Log
Tidak ada retry — typecheck dan build lolos pada percobaan pertama.

## Catatan untuk Reviewer
1. `coverUrl` (dari `generate`) hanya pernah dipakai sebagai `<img src>` di preview dan sebagai
   `imageUrl` di request `POST /admin/ai-content/cover` — TIDAK pernah dikirim langsung ke
   `createPost`/`POST /admin/posts`. Field `cover` yang dikirim ke `createPost` selalu
   `data.url` hasil response `/admin/ai-content/cover`. Lihat
   `apps/admin/src/modules/ai-agent/stores/ai-content.store.ts` fungsi `commitPost`.
2. Guard leave-confirmation (`beforeunload` + `onBeforeRouteLeave`) hanya aktif ketika
   `status.value === 'preview'` — dicek eksplisit di kedua handler, tidak aktif saat
   `loading`/`error`.
3. `sourceUrl` di-extend secara lokal (bukan mengubah `CreatePostPayload` shared) — lihat
   catatan teknis di atas, untuk direview apakah pendekatan ini cukup atau reviewer ingin
   `CreatePostPayload` di `modules/posts` diupdate langsung di ticket terpisah (di luar scope
   #25 menurut instruksi awal).
4. Backend ticket #24 belum ada di branch ini — smoke test end-to-end wajib dijalankan ulang
   begitu PR #26 (backend) merge atau tersedia di environment staging/dev sebelum ticket #25
   dianggap benar-benar selesai secara fungsional.
