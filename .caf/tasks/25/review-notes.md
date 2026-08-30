# Review Notes — Ticket #25: Frontend "AI Agent" Module

## Keputusan: APPROVE

Diff diverifikasi langsung terhadap kode aktual (working tree `ai-agent/25`, belum ada commit
baru — perubahan masih uncommitted: `git diff` pada file existing + file baru untracked di
`apps/admin/src/modules/ai-agent/`). Konsisten dengan klaim `verify-report.md` dan temuan
`qa-report.md`. Tidak ditemukan temuan BLOCKING baru.

## Ruang Lingkup yang Direview
- `apps/admin/src/modules/ai-agent/router/index.ts` (baru)
- `apps/admin/src/modules/ai-agent/stores/ai-content.store.ts` (baru)
- `apps/admin/src/modules/ai-agent/pages/index.vue` (baru)
- `apps/admin/src/modules/ai-agent/pages/article-preview.vue` (baru)
- `apps/admin/src/core/global-routes.ts` (diff: +2 baris, import + registrasi `aiAgentRoutes`)
- `apps/admin/src/layouts/AdminLayout.vue` (diff: +5 baris, menu item + `iconMap` entry)
- Dibandingkan dengan referensi existing: `apps/admin/src/modules/posts/router/index.ts`,
  `apps/admin/src/modules/posts/stores/post.store.ts`, `apps/admin/src/components/RichTextEditor.vue`.

## Temuan BLOCKING
Tidak ada.

## Temuan Non-Blocking / Catatan

1. **Urutan commit (cover → createPost) — sesuai kontrak, KRUSIAL, sudah benar.**
   Dibaca baris demi baris di `ai-content.store.ts` `commitPost()`: `POST /admin/ai-content/cover`
   dipanggil lebih dulu dengan `imageUrl: preview.value.coverUrl`, hasil `data.data.url` disimpan
   ke variabel `coverUrl`, baru dikirim sebagai field `cover` ke `usePostStore().createPost(...)`.
   `preview.value.coverUrl` (URL eksternal mentah) tidak pernah dikirim ke `createPost`. Kegagalan
   di step manapun menyisakan `preview` tetap ada, `commitError` terisi, `committing=false`, tidak
   lanjut ke step berikutnya — cocok persis dengan requirement #5.3 dan kontrak lintas-ticket #24.
   Tidak ada penyimpangan.

2. **Type lokal `CreatePostWithSourceUrl` — pendekatan diterima, cukup rapi untuk scope ticket ini.**
   `CreatePostPayload` shared di `modules/posts/stores/post.store.ts` memang belum punya field
   `sourceUrl` di level tipe, meski backend (`Post` entity, fitur hermes-article-ingest) sudah
   mendukungnya. Intersection type lokal (`CreatePostPayload & { sourceUrl?: string }`) adalah
   pilihan yang tepat untuk tidak menyentuh `modules/posts` (di luar scope #25) sambil tetap type-safe
   pada sisi pemanggil dan tetap reuse `createPost` tanpa duplikasi logic. Catatan tambahan yang
   perlu diperhatikan pembaca berikutnya (bukan blocking untuk #25): karena TypeScript hanya
   menjalankan excess-property-check pada literal objek langsung, assignment via variabel bertipe
   ini lolos structural typing tanpa keluhan compiler — ini bukan celah bug, tapi berarti kontrak
   `CreatePostPayload` shared sekarang "diam-diam" tidak lengkap dan bergantung pada kedisiplinan
   siapa pun yang menambah field baru di masa depan untuk melakukan hal serupa. **Rekomendasi
   (non-blocking, tiket terpisah)**: update `CreatePostPayload` di `modules/posts/stores/post.store.ts`
   untuk menambah `sourceUrl?: string` secara resmi begitu ada waktu, supaya type lokal ini bisa
   dihapus dan tipe payload create-post kembali satu sumber kebenaran.

3. **Duplikasi CSS `.rich-editor-content` di `article-preview.vue` — trade-off wajar, diverifikasi identik.**
   Dibandingkan langsung dengan blok `<style scoped>` di `apps/admin/src/components/RichTextEditor.vue`
   (baris 238-313): seluruh 13 selector prose (`h1/h2/h3/p/ul/ol/blockquote/a/li/hr/img/code/pre/pre code`)
   disalin byte-for-byte identik ke `article-preview.vue`, hanya mengecualikan aturan
   `.rich-editor-content:empty::before` (placeholder saat kosong) yang memang tidak relevan untuk
   tampilan read-only. Ada komentar eksplisit di file yang menjelaskan ini duplikasi sengaja karena
   keterbatasan Vue `<style scoped>` (tidak bisa di-share lintas komponen tanpa ekstraksi
   utility/global CSS). Ini trade-off yang wajar untuk scope ticket sebesar ini — mengekstrak ke
   file CSS/komponen shared akan menyentuh `RichTextEditor.vue` (dipakai modul lain) di luar scope
   #25. **Risiko non-blocking**: kedua blok CSS bisa "drift" di masa depan kalau salah satu diubah
   tanpa mengubah yang lain — tidak ada mekanisme sinkronisasi otomatis (tidak ada test visual).
   Cukup dicatat sebagai technical debt kecil, bukan alasan menahan merge.

4. **Konsistensi pola dengan modul `posts` — baik.**
   - `router/index.ts`: struktur, penamaan (`name`, `meta.title/layout/requiresAuth/permission/backTo`)
     identik pola dengan `postsRoutes`.
   - `stores/ai-content.store.ts`: gaya composition API (`ref` + `defineStore` dengan setup function)
     sama dengan `post.store.ts`, memakai instance `api` yang sama (`@/lib/api`), tidak membuat axios
     instance baru.
   - `pages/index.vue` & `pages/article-preview.vue`: pemakaian Tailwind utility class, varian `dark:`,
     komponen PrimeVue (`Button`, `Message`, `ProgressSpinner`) konsisten dengan halaman `posts`
     existing (`ProgressSpinner` sudah dipakai di `posts/list.vue`, reuse bukan komponen baru).
   - `global-routes.ts` dan `AdminLayout.vue`: diff minimal (+2 baris, +5 baris), pola registrasi
     import/route dan menu/iconMap identik dengan entry `products`/`playlists`/`media` yang sudah ada.
   - Path file layout dikonfirmasi benar oleh Coder/QA: `apps/admin/src/layouts/AdminLayout.vue`
     (bukan `layouts/admin/AdminLayout.vue` seperti disebut di `tasks.md`/`CLAUDE.md` — direktori itu
     memang tidak ada di repo, koreksi sudah akurat).

5. **Guard leave-confirmation & error handling — sesuai `flow.md`.**
   `handleBeforeUnload` dan `onBeforeRouteLeave` di `article-preview.vue` sama-sama mengecek
   `status.value === 'preview'` sebelum memblokir navigasi/reload — tidak aktif saat `loading`
   atau `error`, sesuai requirement #6. Tombol "Batal" (state loading) dan "Kembali" (state error)
   memanggil `reset()` + `router.push('/ai-agent')` tanpa `window.confirm`, juga sesuai spec (belum
   ada preview yang perlu dikonfirmasi hilang). Redirect setelah commit sukses
   (`router.push(\`/posts/${post.slug}/edit\`)`) hanya dieksekusi kalau `commitPost` mengembalikan
   `Post` truthy — kegagalan commit tidak memicu redirect, `commitError` tampil dekat tombol, kedua
   tombol commit re-enable (`committing` di-reset ke `false` di store). Semua sesuai `flow.md`.

6. **Item non-blocking dari QA yang saya setujui/konfirmasi ulang:**
   - Smoke test e2e di-skip karena backend #24 (PR #26) belum merge — sah dan sudah didokumentasikan
     dengan baik di `verify-report.md`. **Wajib dijalankan ulang setelah PR #26 merge**, sebelum
     ticket #25 dianggap selesai secara fungsional end-to-end. Ini bukan alasan menahan merge kode
     frontend murni ini, tapi harus jadi item tindak lanjut eksplisit (rekomendasi: catat sebagai
     checklist di PR description atau ticket linked).
   - `permission: ['manage_own_posts']` di meta route tidak di-enforce oleh `router.beforeEach` —
     dikonfirmasi ini pola pre-existing yang sama persis di `postsRoutes` (guard di
     `global-routes.ts` baris ~35-38 hanya mengecek `requiresAuth`, bukan `permission`). Bukan
     regresi dari ticket ini, tidak perlu diperbaiki di sini.

## Verifikasi Tambahan yang Dilakukan Reviewer
- `git diff -- apps/admin/src/core/global-routes.ts apps/admin/src/layouts/AdminLayout.vue` —
  dikonfirmasi diff minimal (+7 baris total), tidak ada perubahan tak terduga di file existing.
- Dikonfirmasi tidak ada perubahan di `apps/api/**` atau `apps/admin/src/modules/posts/**` (scope
  ticket murni frontend baru + 2 file existing yang disentuh minimal, sesuai `requirements.md`).
- Dibaca isi penuh `ai-content.store.ts`, `router/index.ts`, `pages/index.vue`,
  `pages/article-preview.vue`, dan dibandingkan langsung line-by-line dengan
  `posts/router/index.ts`, `posts/stores/post.store.ts` (`CreatePostPayload`/`Post`/`createPost`),
  dan `components/RichTextEditor.vue` (`.rich-editor-content` CSS block).

## Rekomendasi Tindak Lanjut (di luar scope merge #25, tidak blocking)
1. Tiket terpisah: tambahkan `sourceUrl?: string` ke `CreatePostPayload` shared di
   `modules/posts/stores/post.store.ts`, lalu hapus type lokal `CreatePostWithSourceUrl` di
   `ai-content.store.ts`.
2. Jalankan smoke test manual end-to-end (lihat `tasks.md` bagian "Perintah Verifikasi") begitu
   backend ticket #24 (PR #26) merge, khususnya verifikasi `Post.cover` menjadi URL internal
   (`{APP_URL}/uploads/...`) bukan URL sumber eksternal, dan konfirmasi native browser saat
   keluar halaman preview.
