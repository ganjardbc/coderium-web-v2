# Requirements — Ticket #25: Frontend "AI Agent" Module

## Status: PLAN

## Sumber
- GitHub issue #25 (body ticket, apa adanya — lihat prompt asli)
- Discovery `.caf/discovery/generate-artikel-ai/prd.md` + `flow.md` (revisi UX Designer)
- Kontrak backend final ticket #24 (dari deskripsi ticket #25, section "KONTEKS PENTING" —
  `.caf/tasks/24/review-notes.md` TIDAK ditemukan di working tree branch `ai-agent/25` ini,
  jadi kontrak dipakai apa adanya dari kutipan di body ticket, bukan dibaca ulang dari file asli)

## Ruang Lingkup
Murni frontend `apps/admin`. Tidak ada perubahan backend di ticket ini — modul
`apps/api/src/ai-content/` sudah selesai di ticket #24 (branch terpisah, PR #26 belum
merge), dikerjakan berdasarkan kontrak API yang sudah final, bukan dengan membaca kode
implementasinya (kode itu tidak ada di branch `ai-agent/25`).

## Kontrak Backend (dipakai apa adanya, JANGAN diasumsikan berubah)

### POST /admin/ai-content/generate
- Tanpa body request.
- JWT-protected, permission `manage_own_posts` / `manage_all_posts` (sama seperti create Post,
  tidak ada permission baru).
- Response sukses: `{ success, message, data: { title, content, coverUrl, sourceUrl } }`.
  - `content` adalah HTML fragment (konsisten dengan `RichTextEditor.vue` yang pakai
    `contenteditable`/`innerHTML`).
  - `coverUrl` = URL eksternal, HANYA untuk preview (`<img src="coverUrl">`). JANGAN pernah
    dikirim langsung sebagai field `cover` ke `POST /admin/posts`.
- Error: 500 (config LLM belum diisi di backend — di luar kendali frontend, tampilkan sebagai
  error generik), 502 (provider/parsing gagal).

### POST /admin/ai-content/cover
- Body: `{ imageUrl: string }` (isi dengan `coverUrl` hasil `generate`).
- JWT-protected, permission sama seperti di atas.
- Response sukses: `{ success, message, data: { url: string, mediaId: string } }`.
  - `data.url` adalah URL internal WAJIB dipakai sebagai field `cover` (string) saat commit ke
    `POST /admin/posts`.
- Dipanggil HANYA saat user klik "Publish Post" atau "Save as Draft" di preview — TIDAK saat
  preview pertama kali tampil.
- Error: 400 (bukan image / >10MB), 502 (fetch gagal), 500 (upload gagal).

### POST /admin/posts (reuse existing, TIDAK diubah)
- `CreatePostDto` existing (lihat `apps/admin/src/modules/posts/stores/post.store.ts` ->
  `CreatePostPayload`).
- Payload commit dari fitur ini:
  - `title`: dari hasil generate, apa adanya.
  - `content`: dari hasil generate, apa adanya (HTML fragment).
  - `type`: `'article'` (hardcode — hanya card Article yang fungsional).
  - `cover`: `data.url` hasil `POST /admin/ai-content/cover` (BUKAN `coverUrl` mentah).
  - `sourceUrl`: dari hasil generate, apa adanya (field ini sudah ada di skema Post dari fitur
    hermes-article-ingest, dipakai untuk membedakan artikel dari fitur ini).
  - `isPublished`: `true` untuk tombol "Publish Post", `false` untuk tombol "Save as Draft".
- Setelah sukses: redirect ke halaman detail/edit Post yang baru dibuat (pola sama seperti
  `create.vue` existing yang redirect ke `/posts` setelah create — TAPI ticket #25 minta
  redirect ke halaman **detail/edit** post baru, bukan ke list `/posts`. Route edit existing:
  `/posts/:slug/edit` — response `createPost` mengembalikan objek `Post` termasuk `slug`,
  dipakai untuk membangun path redirect).

## Requirement Fungsional

1. Modul baru `apps/admin/src/modules/ai-agent/` (struktur mengikuti pola modul existing:
   `pages/`, `router/`, `stores/`), TIDAK menyentuh `apps/admin/src/modules/posts/` kecuali
   reuse (`usePostStore().createPost`, tipe `CreatePostPayload`, `UploadedMedia`).
2. Route baru terdaftar di `apps/admin/src/core/global-routes.ts` (tambah import
   `aiAgentRoutes` dari `@/modules/ai-agent/router`), mengikuti pola `postsRoutes` dkk.
   - `/ai-agent` — halaman grid card.
   - `/ai-agent/article/preview` — halaman loading/preview/error untuk generate Article.
   - Meta tiap route: `{ title, layout: 'admin', requiresAuth: true, permission: ['manage_own_posts'] }`
     (dan `backTo: '/ai-agent'` untuk halaman preview), konsisten dengan pola `postsRoutes`.
3. Item menu sidebar baru "AI Agent" ditambahkan ke `menuSections` (section "Main Menu") dan
   `iconMap` di `apps/admin/src/layouts/admin/AdminLayout.vue`, path `/ai-agent`, icon
   primeicons yang belum dipakai section lain (mis. `pi-sparkles` atau `pi-bolt` — final
   ditentukan saat implementasi, bukan blocking).
4. Halaman grid card (`pages/index.vue`):
   - 4 card statis (BUKAN fetch dinamis dari backend): Article (aktif, ditampilkan pertama),
     carousel, video, stack_gallery (disabled/coming-soon) — urutan dan status hardcode di
     frontend, tidak bergantung pada `PostType` enum di-fetch runtime.
   - Card Article: visual normal, hover effect, cursor pointer, klik → panggil action generate
     di store lalu `router.push('/ai-agent/article/preview')`.
   - Card lain: opacity rendah (~50%), badge "Segera Hadir", cursor `not-allowed`, tanpa hover
     effect, klik tidak memicu apapun (tidak ada `@click` handler efektif / guard eksplisit).
5. Store baru `stores/ai-content.store.ts` (Pinia, pola `defineStore` dengan `ref`/composition
   API mengikuti gaya `post.store.ts`):
   - State: `preview` (`{ title, content, coverUrl, sourceUrl } | null`), `status`
     (`'idle' | 'loading' | 'preview' | 'error'`), `errorMessage`, `committing` (boolean),
     `commitError`.
   - Action `generateArticle()`: `POST /admin/ai-content/generate`, set `status='loading'` lalu
     `status='preview'` + isi `preview` kalau sukses, atau `status='error'` + `errorMessage`
     generik-ramah kalau gagal (mapping status code backend TIDAK ditampilkan mentah ke user).
   - Action `reset()`: kembalikan store ke `idle` (dipanggil saat "Batal"/kembali ke grid,
     dan setelah commit sukses).
   - Action `commitPost(isPublished: boolean)`:
     1. `POST /admin/ai-content/cover` dengan `{ imageUrl: preview.coverUrl }` → dapat
        `data.url`. Kalau gagal, set `commitError`, JANGAN hilangkan `preview`, re-enable
        kedua tombol commit (state `committing=false`), STOP (jangan lanjut ke posts).
     2. `usePostStore().createPost({ title, content, type: 'article', cover: data.url,
        sourceUrl, isPublished })`. Kalau gagal, sama seperti di atas — preview tetap ada,
        pesan error dekat tombol commit, kedua tombol re-enable.
     3. Sukses → return `Post` yang dibuat (untuk redirect di halaman preview), panggil
        `reset()`.
6. Halaman preview (`pages/article-preview.vue`):
   - Saat masuk halaman (mounted) dan store masih `idle` → langsung panggil
     `generateArticle()` (bukan halaman grid yang memanggil, supaya refresh di halaman preview
     bisa retry — tapi PERHATIKAN: refresh akan kehilangan preview existing per requirement
     "state preview di frontend saja", itu memang perilaku yang diharapkan/expected, bukan bug).
   - State `loading`: spinner indeterminate, pesan bertahap ("Mencari artikel trending..." →
     "Menulis ulang artikel dalam Bahasa Indonesia..." setelah beberapa detik, `setTimeout`
     murni kosmetik di frontend, bukan status real dari backend), tombol "Batal" →
     `reset()` + `router.push('/ai-agent')` (request backend boleh tetap berjalan di
     background, frontend cukup berhenti menunggu).
   - State `preview`: title (read-only teks), content (read-only, di-render sebagai HTML —
     REUSE styling prose dari `RichTextEditor.vue` `.rich-editor-content` class, tapi tanpa
     `contenteditable` dan tanpa toolbar, cukup `<div class="rich-editor-content" v-html="preview.content">` di container non-editable), cover candidate sebagai `<img :src="preview.coverUrl">` dengan badge "dari sumber eksternal" dan `@error` fallback ke placeholder generik ("Preview cover tidak tersedia") — TIDAK memblokir commit kalau gambar gagal load di browser. Link `sourceUrl` (`<a target="_blank" rel="noopener noreferrer">`). Tombol tersier "Generate Ulang" → panggil `generateArticle()` lagi (replace preview lama, bukan append). Dua tombol commit: "Save as Draft" (secondary/outline, kiri) dan "Publish Post" (primary/solid, kanan) — urutan render kiri-ke-kanan sesuai hierarki di `flow.md`. Indikator status persisten kecil: "Hasil ini belum disimpan — refresh atau tinggalkan halaman akan menghapusnya."
   - State `error`: pesan generik-ramah (bukan raw error), tombol "Coba Lagi" (tanpa cooldown,
     panggil `generateArticle()` lagi), tombol kembali ke `/ai-agent` (`reset()` + push).
   - Konfirmasi keluar halaman: `window.onbeforeunload` (untuk reload/close tab) DAN
     `router.beforeEach`/`onBeforeRouteLeave` (untuk navigasi internal Vue Router) — keduanya
     HANYA aktif saat `status === 'preview'` (bukan saat `loading` atau `error`), pesan:
     "Yakin ingin meninggalkan halaman ini? Hasil generate akan hilang." (catatan teknis:
     browser modern tidak menampilkan custom message pada `beforeunload`, cukup
     `e.preventDefault(); e.returnValue = ''`; untuk navigasi internal pakai
     `window.confirm(...)` di guard `onBeforeRouteLeave`).
   - Setelah commit sukses: redirect ke `/posts/${post.slug}/edit`.
7. Tidak ada perubahan pada halaman list Post (`apps/admin/src/modules/posts/pages/list.vue`)
   atau `create.vue` — tombol "New Post"/"Generate by AI" TIDAK ditambahkan ke sana (kalau
   memang ada tombol serupa existing yang perlu dihapus, itu di luar scope kecuali ditemukan
   saat implementasi — verifikasi manual saat implementasi, PRD lama sudah direvisi jadi entry
   point sepenuhnya di modul baru).

## Non-Functional / Konvensi
- Ikuti gaya kode existing: Composition API (`<script setup lang="ts">`), PrimeVue components
  auto-import (lihat `create.vue` import eksplisit dari `primevue`), Tailwind utility classes,
  dark mode variant (`dark:`) konsisten dengan file lain.
- Reuse `api` instance dari `@/lib/api` untuk request baru (`ai-content.store.ts`), JANGAN buat
  instance axios baru.
- Reuse `usePostStore().createPost` untuk commit — JANGAN duplikasi logic `POST /admin/posts`
  di store baru.
- Tidak ada test otomatis di `apps/admin` (tidak ada script `test` di `package.json`) — verifikasi
  manual/smoke test sesuai `## Perintah Verifikasi` di `tasks.md`.

## Out-of-Scope (mengikuti ticket & PRD)
- Generate untuk carousel/video/stack_gallery — card tampil, non-fungsional.
- Editor WYSIWYG tambahan di halaman preview.
- Kustomisasi system prompt dari frontend.
- Perubahan skema/kontrak `CreatePostDto` atau endpoint backend manapun.

## Pertanyaan Terbuka
Tidak ada pertanyaan terbuka yang memblokir breakdown ini — seluruh keputusan UX
(loading, hierarki tombol, state error) sudah difinalkan di `flow.md`, dan kontrak backend
sudah final di deskripsi ticket. Detail kecil non-blocking yang boleh diputuskan bebas saat
implementasi (tidak perlu izin manusia dulu): pilihan icon primeicons untuk menu sidebar,
copy persis pesan loading bertahap, styling badge "Segera Hadir"/"dari sumber eksternal".
