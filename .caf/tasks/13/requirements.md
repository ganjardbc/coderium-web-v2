# Requirements — Ticket #13: Product Admin — List & Form (apps/admin)

## Status: PLAN

## Sumber
GitHub Issue #13 (ganjardbc/coderium-web-v2). Dependency: Ticket #12 (Product CRUD API)
sudah SELESAI dan merge ke `main` (PR #15) — endpoint admin sudah tersedia di `apps/api`.

## Problem
Admin butuh UI untuk mengelola entity Product (create/edit/publish/archive). Saat ini
data Product cuma bisa diisi lewat seed manual — tidak scalable.

## Target User
Internal — admin/tim produk Coderium yang mengisi konten produk (kemungkinan
non-teknis, tim marketing/produk). Implikasi: pesan error harus jelas/manusiawi
(banner ringkas, bukan raw JSON/stack trace).

## Scope (in)

### 1. List Product (`/products` di apps/admin, module baru `src/modules/products`)
- Tabel kolom: `name`, `slug`, `status` (badge warna beda per status — draft/published/archived),
  `order`, `updatedAt`.
- Aksi per baris:
  - Edit → navigasi ke form edit.
  - Publish/Unpublish (toggle) — **aktif (enabled) hanya kalau field wajib publish
    sudah lolos validasi** (lihat "Validasi publish" di bawah). Kalau tidak lolos,
    tombol Publish disabled dengan tooltip alasan singkat (opsional tapi disarankan),
    ATAU klik tetap dikirim ke server dan server yang menolak dengan 400 terstruktur
    (lihat kontrak API) — pilih salah satu pendekatan konsisten, disarankan: kirim ke
    server dan tangani error 400 dengan toast/list field yang kurang (lebih murah
    diimplementasikan daripada replikasi validasi publish di frontend, dan tetap
    konsisten dengan behavior form create/edit).
  - Archive.
- Aksi global: "+ Tambah Produk" → navigasi ke form create.
- Default sort `order` ascending. Toggle/switch untuk ganti ke `updatedAt` descending
  (query param `sort` + `dir` ke endpoint list — lihat kontrak API).

### 2. Form Product (create & edit)
Field & urutan (top to bottom):
1. Identitas: `name`, `slug` (auto-generate slug dari `name` — client-side slugify
   sederhana: lowercase, strip non-alnum jadi `-`; TETAP editable manual oleh user;
   server juga auto-generate ulang kalau `slug` dikirim kosong, tapi UI harus
   menampilkan preview slug sebelum submit).
2. Konten: `tagline` (text), `description` (rich text — **reuse
   `apps/admin/src/components/RichTextEditor.vue`**, pola sama seperti field
   `content` di Posts form), `cover` (**reuse
   `apps/admin/src/components/MediaUploader.vue`** dengan `:multiple="false"`, pola
   sama seperti field cover di Posts form — catatan: komponen ini v-model array
   `UploadedMedia[]`, payload API `cover` adalah string tunggal → ambil
   `cover[0]?.url`, sama seperti pola di `posts/pages/create.vue` & `edit.vue`).
3. `pipelineSteps` — repeatable list field (BUKAN raw JSON editor): tiap row =
   input "Judul" (text) + textarea "Deskripsi", tombol tambah row, tombol
   reorder (naik/turun atau drag), tombol hapus row per item. Field belum ada
   komponen reusable di codebase — komponen baru, tapi pola sama persis dipakai
   dua kali (pipelineSteps & features), jadi buat SATU komponen generik
   reusable (mis. `RepeatableListField.vue`) dipakai untuk keduanya.
4. `features` — repeatable list field, pola identik dengan `pipelineSteps`
   (title + description per item) → pakai komponen generik yang sama di atas.
5. CTA: `ctaLabel` (text), `ctaUrl` (text + validasi format URL sebelum bisa
   Publish — cukup client-side basic URL check, mis. regex/`new URL()` try-catch;
   validasi definitif tetap di server lewat `class-validator @IsUrl()`).
6. `order` (number input), `status` (select: draft/published/archived — TAPI
   catatan: status field ini idealnya read-only/derived dari aksi Publish/
   Unpublish/Archive di List, BUKAN dropdown bebas di form, supaya konsisten
   dengan endpoint aksi (`/publish`, `/unpublish`, `/archive`) yang sudah ada
   di API. Rekomendasi: form hanya punya 2 tombol submit ("Simpan sebagai
   Draft" / "Simpan & Publish") seperti dijelaskan ticket — status di-derive
   dari tombol mana yang diklik, bukan dari field select terpisah. Implementer
   final call ada di sini, tapi HARUS konsisten: kalau tetap pakai select
   status manual di form, JANGAN duplikasi dengan tombol submit yang juga
   set status berbeda — pilih satu sumber kebenaran).
7. `featured` (checkbox/toggle).

Tombol submit:
- "Simpan sebagai Draft" — payload `status: 'draft'`, validasi minim (hanya
  `name` wajib, sesuai `CreateProductDto` yang cuma mewajibkan `name`).
- "Simpan & Publish" — payload `status: 'published'`, validasi penuh
  client-side SEBELUM submit (opsional, untuk UX cepat) DAN server tetap
  validasi ulang (`assertPublishable` di `products.service.ts` — lihat
  kontrak API). Kalau publish gagal di server, form TIDAK reset, tetap draft,
  banner error tampil.

### Validasi form
- Row `pipelineSteps`/`features` kosong (judul kosong): validasi inline
  per-row (border merah + pesan di bawah field terkait), BUKAN alert global
  untuk kasus ini.
- Gagal publish (field wajib kosong: `cover`, `ctaUrl` tidak valid URL,
  `pipelineSteps` minimal 1 item, `features` minimal 1 item): tampilkan
  BANNER ringkas di atas form berisi daftar nama field yang kurang/gagal,
  DAN highlight field terkait. Status tetap draft (tidak ikut berubah ke
  published), input yang sudah diisi user TIDAK HILANG (jangan reset form
  atau redirect saat gagal publish).

## Scope (out)
- Endpoint API — sudah selesai (Ticket #12, merged). Ticket ini murni konsumsi.
- Halaman publik `/products`, `/products/[slug]` (apps/web) — Ticket #3, app
  berbeda (Nuxt), TIDAK disentuh di sini.
- Role/permission admin baru — pakai auth existing (permission `manage_products`
  yang sudah dipasang di `products.controller.ts` via `@Permissions('manage_products')`).
  Kalau role admin yang login belum punya permission ini di seed/DB, itu bug
  terpisah di luar scope UI ticket ini — TAPI kalau saat implementasi ternyata
  tidak ada role manapun yang punya permission `manage_products`, catat sebagai
  blocker/finding di verify-report, jangan diam-diam menambah permission ke seed
  tanpa instruksi eksplisit (itu perubahan API/DB, di luar scope frontend ticket ini).

## Kontrak API (dari apps/api, sudah ada — Ticket #12 merged)

Base path admin: `/admin/products` (Bearer auth + permission `manage_products`).

| Method | Path | Guna |
|---|---|---|
| GET | `/admin/products?page&limit&sort=order\|updatedAt&dir=asc\|desc` | List, response `{ success, message, data: Product[], meta: {page,limit,total,totalPages} }` |
| GET | `/admin/products/:id` | Detail, response `{ success, message, data: Product }` |
| POST | `/admin/products` | Create, body `CreateProductDto`, response `{ success, message, data: Product }` |
| PATCH | `/admin/products/:id` | Update, body `UpdateProductDto` (partial), response `{ success, message, data: Product }` |
| POST | `/admin/products/:id/publish` | Publish (server re-validasi field wajib) |
| POST | `/admin/products/:id/unpublish` | Set status → `draft` |
| POST | `/admin/products/:id/archive` | Set status → `archived` |
| POST | `/admin/products/:id/restore` | Set status → `draft` (dipakai untuk un-archive; tidak disebut eksplisit di ticket tapi tersedia di API — pertimbangkan dipakai untuk aksi "Un-archive" kalau list butuh, opsional) |

**PENTING — routing pakai `:id`, BUKAN `:slug`** (berbeda dari module Posts yang
pakai `:slug` di URL admin). Rute Vue Router untuk edit produk harus pakai
param `id`, bukan `slug` seperti pola Posts.

Field `Product` (dari Prisma/DTO, `apps/api/src/products/dto/create-product.dto.ts`,
`pipeline-step.dto.ts`, `feature-item.dto.ts`):
```ts
{
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  cover?: string;               // URL string
  pipelineSteps?: { title: string; description?: string }[];
  features?: { title: string; description?: string }[];
  ctaLabel?: string;
  ctaUrl?: string;
  order?: number;
  featured?: boolean;
  updatedAt: string;
  createdAt: string;
}
```

**Kontrak error publish gagal** (dari `products.service.ts` — `assertPublishable`):
`BadRequestException` dengan body berbentuk (kira-kira, verifikasi actual shape
saat implementasi lewat Swagger/curl karena Nest membungkus objek yang dilempar
ke `BadRequestException`):
```json
{
  "statusCode": 400,
  "message": "Validasi publish gagal",
  "fields": ["cover", "ctaUrl", "pipelineSteps", "features"],
  "error": "Bad Request"
}
```
`fields` berisi subset dari `['cover', 'ctaUrl', 'pipelineSteps', 'features']` yang
gagal. Frontend HARUS parse `error.response.data.fields` (bukan cuma `.message`)
untuk highlight field spesifik di banner — ini beda dari pola error generik di
Posts (`postsStore` cuma pakai `.message` string).

## Konvensi yang harus diikuti (dari codebase existing, module Posts sebagai referensi pola)
- Struktur module: `apps/admin/src/modules/products/{router,pages,stores}` — ikuti
  persis struktur `apps/admin/src/modules/posts/`.
- Router didaftarkan di `apps/admin/src/core/global-routes.ts` (tambah
  `productsRoutes` import + spread ke array `routes`, ikuti pola `postsRoutes`).
- Store: Pinia `defineStore` dengan Composition API style (lihat
  `apps/admin/src/modules/posts/stores/post.store.ts`), pakai `api` instance dari
  `@/lib/api`.
- UI kit: PrimeVue (DataTable, Column, Button, Tag, Toast, ConfirmDialog,
  ProgressSpinner, InputText, Textarea, Select, ToggleSwitch, Message).
- Reuse komponen: `@/components/RichTextEditor.vue`, `@/components/MediaUploader.vue`
  (import `type { UploadedMedia }` dari MediaUploader).
- `FormField`/`SidebarCard` sub-component lokal (didefinisikan inline via `h()`
  di dalam `<script setup>` tiap halaman form) BUKAN komponen shared terpisah
  di codebase saat ini — boleh replikasi pola yang sama di form Product, atau
  (lebih baik, opsional) diekstrak jadi shared component kalau Implementer mau
  investasi refactor kecil; tidak wajib untuk scope ticket ini.
- Tidak ada script `lint`/`test` di `apps/admin/package.json` — hanya `dev`,
  `build` (`vue-tsc -b && vite build`), `preview`, `typecheck` (`vue-tsc --noEmit`),
  `clean`. Verifikasi realistis untuk ticket ini = `typecheck` + `build` lolos
  (lihat tasks.md Verify Checklist).

## Pertanyaan Terbuka (tidak blocking, catatan untuk Implementer)
1. Apakah field `status` di form (select manual) tetap ditampilkan sebagai
   dropdown independen, atau di-derive murni dari tombol submit yang diklik?
   Rekomendasi Planner: derive dari tombol submit (lebih konsisten dengan
   endpoint `/publish` `/unpublish`), tapi tidak fatal kalau Implementer pilih
   pendekatan lain selama konsisten dan didokumentasikan di kode.
2. Konfirmasi bentuk pasti body error 400 publish (`fields` di top-level atau
   nested di `message`) — cek langsung via Swagger (`apps/api` biasanya expose
   `/api` atau `/docs`) atau curl manual saat implementasi, jangan asumsi buta
   dari baca kode NestJS exception filter.
3. Permission `manage_products` — pastikan user admin yang dipakai untuk test
   manual punya permission ini (cek seed/role assignment); kalau tidak ada,
   laporkan sebagai blocker terpisah, jangan ubah seed tanpa instruksi.

Karena pertanyaan di atas tidak menghalangi implementasi (ada rekomendasi default
yang jelas untuk masing-masing), status tetap `PLAN`, bukan `NEEDS_HUMAN`.
