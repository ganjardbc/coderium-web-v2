# Tasks — Ticket #13: Product Admin — List & Form (apps/admin)

## Routing / Scope Kerja
**FRONTEND ONLY — single app: `apps/admin` (Vue 3 + Vite + PrimeVue, bukan Nuxt).**
Tidak ada perubahan di `apps/api` (backend/DB sudah selesai di Ticket #12, merged
ke `main`). Tidak menyentuh `apps/web`. Main thread: routing implementasi
langsung ke Coder untuk `apps/admin`, TIDAK perlu menyentuh service lain.

## Butuh Architect stage?
**Tidak.** Single app, tidak ada schema/migration baru, tidak ada endpoint baru,
tidak ada keputusan arsitektur lintas service. Murni UI module baru yang
mengikuti pola module Posts yang sudah ada persis di codebase yang sama. Bisa
langsung ke Coder setelah Planner.

## Urutan Kerja

### Task 1 — Module skeleton & routing
- Buat `apps/admin/src/modules/products/router/index.ts` — 3 rute:
  `/products` (list), `/products/create` (create), `/products/:id/edit` (edit —
  **pakai param `id`, bukan `slug`**, beda dari pola Posts). Ikuti persis shape
  meta (`title`, `layout: 'admin'`, `requiresAuth: true`, `permission: ['manage_products']`)
  seperti `apps/admin/src/modules/posts/router/index.ts`.
- Daftarkan `productsRoutes` di `apps/admin/src/core/global-routes.ts` (tambah
  import + spread ke array `routes`, sejajar dengan `postsRoutes`).
- (Opsional tapi disarankan) tambah entry menu/sidebar navigasi ke "Products"
  kalau ada komponen nav admin terpusat — cek dulu apakah ada
  `apps/admin/src/components/*Sidebar*.vue` atau layout admin yang list menu
  statis; kalau ada, tambahkan entry di situ supaya halaman ini reachable dari
  UI, bukan cuma via URL langsung.

### Task 2 — Store (Pinia)
- Buat `apps/admin/src/modules/products/stores/product.store.ts`. Ikuti pola
  `apps/admin/src/modules/posts/stores/post.store.ts` (Composition API style,
  pakai `api` dari `@/lib/api`).
- Interface `Product`, `ProductMeta`, `CreateProductPayload`/`UpdateProductPayload`
  sesuai kontrak di `requirements.md`.
- Actions: `fetchProducts(page, limit, sort, dir)`, `fetchProductById(id)`,
  `createProduct(payload)`, `updateProduct(id, payload)`, `publishProduct(id)`,
  `unpublishProduct(id)`, `archiveProduct(id)`. Semua ke endpoint
  `/admin/products*` sesuai tabel di requirements.md.
- Publish action HARUS membiarkan error axios (400 dengan `fields`) propagate
  ke caller (pages) apa adanya — jangan ditelan/di-generalize di store, karena
  page perlu baca `err.response.data.fields` untuk banner.

### Task 3 — Komponen reusable: `RepeatableListField.vue`
- Lokasi: `apps/admin/src/components/RepeatableListField.vue` (level shared
  component, bukan di dalam module `products`, supaya jelas ini generik dan
  bisa dipakai module lain di masa depan).
- Props: `modelValue: { title: string; description?: string }[]`, `label`,
  optional `itemLabel` (mis. "Step" / "Feature").
- Emits: `update:modelValue`.
- Fitur wajib: tombol tambah row, tombol hapus per-row, tombol reorder
  (naik/turun cukup, drag-drop tidak wajib), input "Judul" (text/InputText) +
  textarea "Deskripsi" per row, validasi inline per-row (border merah + pesan
  kalau judul kosong DAN field sudah "touched"/di-submit — jangan tampilkan
  error sebelum interaksi).
- Dipakai 2x: satu instance untuk `pipelineSteps`, satu untuk `features`, di
  form yang sama (Task 4/5).

### Task 4 — Halaman List: `apps/admin/src/modules/products/pages/list.vue`
- Ikuti pola `apps/admin/src/modules/posts/pages/list.vue` (DataTable, Toast,
  ConfirmDialog untuk aksi Archive — konfirmasi dulu sebelum archive karena
  destructive-ish).
- Kolom: `name` (link ke edit), `slug`, `status` (Tag dengan severity berbeda
  per status — draft=warn/secondary, published=success, archived=secondary/
  danger — pilih mapping warna yang jelas beda 3 status), `order`, `updatedAt`
  (format tanggal).
- Kontrol sort: toggle/dropdown kecil di header tabel untuk switch
  `order asc` (default) ↔ `updatedAt desc`, panggil ulang `fetchProducts` dengan
  param baru.
- Aksi per baris: Edit (navigate `/products/:id/edit`), Publish/Unpublish
  (toggle icon button, mirip pola posts list `handlePublish`/`handleUnpublish`,
  TAPI tangani error 400 dari `publishProduct` — kalau gagal, tampilkan toast
  error yang menyebutkan field-field yang kurang, mis. join `err.response.data.fields`,
  JANGAN biarkan silent fail), Archive (dengan confirm dialog).
- Tombol global "+ Tambah Produk" → navigate `/products/create`.

### Task 5 — Halaman Create: `apps/admin/src/modules/products/pages/create.vue`
- Ikuti pola `apps/admin/src/modules/posts/pages/create.vue` (2-kolom layout,
  `FormField`/`SidebarCard` inline sub-component via `h()`).
- Semua field sesuai urutan di requirements.md section "Form Product".
- Slug: input text dengan tombol "Regenerate from name" ATAU auto-sync
  reaktif selama user belum mengetik manual di field slug (pilih salah satu,
  yang penting: field tetap editable, dan initial value slug auto-terisi dari
  `name` tanpa perlu klik apapun untuk UX yang smooth).
- `description` → `RichTextEditor`, `cover` → `MediaUploader :multiple="false"`.
- `pipelineSteps`, `features` → 2x `RepeatableListField` dari Task 3.
- `ctaUrl` → validasi basic client-side (format URL) sebelum enable tombol
  "Simpan & Publish" (boleh tetap enabled dan biarkan gagal di server + banner,
  yang penting UX tidak buntu).
- 2 tombol submit: "Simpan sebagai Draft" (`status: 'draft'`, POST minimal
  payload — hanya `name` yang benar-benar wajib sesuai `CreateProductDto`) dan
  "Simpan & Publish" (`status: 'published'`, submit dulu — server yang
  validasi via `assertPublishable`).
- Handle error create+publish: kalau API balas 400 dengan `fields`, JANGAN
  redirect, tampilkan banner ringkas daftar field yang kurang (map field key →
  label manusiawi, mis. `cover` → "Cover image", `ctaUrl` → "CTA URL",
  `pipelineSteps` → "minimal 1 pipeline step", `features` → "minimal 1
  feature") + highlight (scroll ke / border merah) field terkait, form tetap
  terisi.
- Kalau berhasil (draft ATAU publish) → redirect ke `/products`.

### Task 6 — Halaman Edit: `apps/admin/src/modules/products/pages/edit.vue`
- Ikuti pola `apps/admin/src/modules/posts/pages/edit.vue`: `onMounted` fetch
  by `id` (dari `route.params.id`, BUKAN `.slug`), populate form, loading
  skeleton, not-found state.
- Field & validasi sama seperti Create (reuse sebanyak mungkin logic/komponen
  dari Task 5 — pertimbangkan ekstrak form fields jadi komponen bersama
  `ProductForm.vue` yang dipakai baik oleh `create.vue` maupun `edit.vue` kalau
  duplikasinya besar; Posts module TIDAK melakukan ini (create.vue/edit.vue
  duplikat penuh) jadi tidak wajib, tapi disarankan untuk product form yang
  lebih kompleks (banyak field + 2 repeatable list) supaya maintenance lebih
  mudah — keputusan implementasi ada di Coder).
- Submit → `updateProduct(id, payload)` (PATCH, partial payload boleh full
  object juga karena DTO partial). Tombol submit tetap dua: "Simpan sebagai
  Draft" / "Simpan & Publish" dengan behavior sama seperti Create.
- Error handling identik dengan Create (banner + field highlight, no reset).

### Task 7 — Cross-check kontrak error publish
- Sebelum Task 4-6 dianggap selesai, verifikasi actual response body 400 dari
  `POST /admin/products/:id/publish` saat field wajib kosong (via curl/Postman/
  Swagger UI kalau `apps/api` expose docs, atau baca ulang NestJS exception
  filter behavior) — pastikan path `err.response.data.fields` benar sebelum
  dipakai di banner. Kalau shape beda dari dugaan di requirements.md
  (`fields` mungkin nested di `message` object, bukan top-level), sesuaikan
  kode, tapi TIDAK PERLU mengubah `apps/api` — ini murni penyesuaian parsing
  di frontend.

## Verify Checklist
- [ ] `pnpm --filter coderium-admin run typecheck` (`vue-tsc --noEmit`) lolos
      tanpa error baru di file yang ditambah/diubah.
- [ ] `pnpm --filter coderium-admin run build` (`vue-tsc -b && vite build`)
      lolos.
- [ ] Tidak ada script `lint`/`test` di `apps/admin/package.json` — TIDAK perlu
      dijalankan, jangan invent command yang tidak ada.
- [ ] Manual/read-through check: routing pakai `:id` (bukan `:slug`) konsisten
      di router, store, dan pemanggilan API di halaman edit.
- [ ] Manual/read-through check: field `cover` dikonversi dari
      `UploadedMedia[]` (frontend) ke `string` tunggal (payload API) di titik
      submit, sama seperti pola Posts.
- [ ] Manual/read-through check: error 400 publish di-parse dari
      `err.response.data.fields` (bukan cuma `.message`), ditampilkan sebagai
      banner + field highlight, form tidak reset.
- [ ] Manual/read-through check: `RepeatableListField.vue` divalidasi inline
      per-row (bukan alert global) untuk row kosong.

Kalau verify gagal setelah 3x percobaan perbaikan → stop, tulis
`.caf/tasks/13/verify-report.md` dengan `Status: NEEDS_HUMAN` dan detail
kegagalannya (mengikuti kontrak Retry Logic di `caf-planner.md` — ini berlaku
untuk Coder/Verifier stage berikutnya, bukan dieksekusi oleh Planner).
