# Requirements — Ticket 12: Product CRUD API (apps/api)

## Status: PLAN

## Sumber

- Ticket tracker: https://github.com/ganjardbc/coderium-web-v2/issues/12
- Discovery: `.caf/discovery/product-crud/prd.md`, `.caf/discovery/product-crud/flow.md`
- Tidak ada Pertanyaan Terbuka yang menghambat scope ticket ini secara teknis.
  Tiga Pertanyaan Terbuka di `prd.md` (target CTR, role admin khusus, sumber
  `ctaUrl`) semuanya di luar scope backend Product CRUD: dua pertama soal
  metrik/organisasi non-teknis, yang ketiga soal isi data (bukan kontrak API).
  Asumsi yang dipakai untuk yang ketiga sudah eksplisit ditulis PM di
  Dependency ticket: "auth/role admin existing, pola sama dengan modul Posts,
  tidak butuh role baru" — dipakai sebagai keputusan kerja untuk ticket ini.

## Ringkasan Scope

Backend murni. Tidak ada perubahan `apps/admin` atau `apps/web` di ticket ini.

1. Model `Product` baru di `apps/api/prisma/schema.prisma`.
2. Migration untuk model tersebut.
3. Endpoint public (baca produk `published` saja).
4. Endpoint admin (full CRUD + publish/unpublish/archive/restore, butuh auth),
   mengikuti pola modul Posts yang sudah ada di `apps/api`.

## Keputusan Desain Data (diturunkan dari prd.md + flow.md, WAJIB diikuti implementer)

### Field model `Product`

Field persis sesuai daftar di ticket — jangan menambah field di luar daftar ini
tanpa alasan teknis kuat (mis. `id`, `createdAt`, `updatedAt` yang memang wajib
ada di semua model existing):

| Field           | Tipe                                   | Wajib diisi saat draft? | Catatan |
|-----------------|-----------------------------------------|--------------------------|---------|
| `id`            | String (uuid, PK)                       | auto                     | konsisten pola `User`/`Post`/`Playlist` |
| `slug`          | String, unique                          | ya                       | auto-generate dari `name` di layer admin/service, tetap bisa diedit manual — validasi unique |
| `name`          | String                                  | ya                       | |
| `tagline`       | String?                                 | tidak                    | |
| `description`   | String? (text)                          | tidak                    | rich text/markdown disimpan sebagai string mentah, tidak ada parsing khusus di API |
| `status`        | enum `ProductStatus` (`draft`, `published`, `archived`), default `draft` | — | **enum, bukan `isPublished` boolean** — beda pola dari `Post`/`Playlist`, ini keputusan eksplisit ticket, jangan disamakan dengan pola Posts |
| `cover`         | String?                                 | tidak untuk draft, **wajib untuk publish** | |
| `pipelineSteps` | Json?, default `[]`                     | tidak untuk draft, **minimal 1 item untuk publish** | array of `{ title: string, description: string }`, urutan = urutan render, tidak ada sorting field terpisah |
| `features`      | Json?, default `[]`                     | tidak untuk draft, **minimal 1 item untuk publish** | array of `{ title: string, description: string }` |
| `ctaLabel`      | String?                                 | tidak                    | fallback "Request pilot" adalah tanggung jawab frontend `apps/web`, API tidak perlu default value |
| `ctaUrl`        | String?                                 | tidak untuk draft, **wajib + valid URL format untuk publish** | |
| `order`         | Int, default `0`                        | tidak                    | dipakai sort listing public (asc) dan admin (default asc, bisa switch ke `updatedAt` desc — sorting `updatedAt` desc cukup lewat query param di endpoint admin, tidak perlu field baru) |
| `featured`      | Boolean, default `false`                | tidak                    | hanya efektif untuk homepage kalau `status = published` — API tidak perlu logic khusus, cukup expose field; kombinasi filter `published + featured` jadi tanggung jawab query endpoint public/ticket Web |
| `createdAt`/`updatedAt` | DateTime                        | auto                     | pola standar existing |

**Tidak ada `deletedAt`/soft-delete terpisah.** Status `archived` sudah
berfungsi sebagai mekanisme "hilang dari publik tapi data tetap ada, bisa
di-restore" sesuai flow.md bagian C.5. Tidak ada hard-delete endpoint di
scope ticket ini — kata "CRUD" di judul ticket tidak berarti ada `DELETE`
fisik; "D" dipenuhi lewat transisi status ke `archived` (dan restore = update
status kembali ke `draft`/`published`). Kalau implementer menemukan indikasi
kuat butuh hard-delete, stop dan tanyakan — jangan berasumsi.

### Validasi publish (berlaku di titik manapun status berubah jadi `published`)

Berdasar flow.md "Gagal publish karena field wajib kosong": field wajib untuk
publish adalah `cover`, `ctaUrl` (format URL valid), minimal 1 `pipelineSteps`,
minimal 1 `features`. `name` dan `slug` sudah wajib sejak draft jadi otomatis
terpenuhi.

Validasi ini berlaku **bukan hanya di endpoint dedicated `publish`**, tapi di
mana pun request menghasilkan `status = published` — termasuk lewat endpoint
update biasa (`PATCH`/`PUT`) kalau body-nya menyertakan `status: published`.
Ini konsisten dengan flow.md: "perubahan ke published lewat aksi submit form
biasa DIPERBOLEHKAN asal validasi field wajib lolos".

Response error validasi publish: HTTP 400/422 dengan daftar field yang gagal
(array of field name), supaya frontend admin (ticket lain) bisa render
"Lengkapi dulu sebelum publish: Cover, CTA URL" tanpa parsing pesan bebas.
Bentuk pasti response body mengikuti konvensi error response existing di
`apps/api` kalau ada (implementer cek pola exception filter/DTO validation
yang sudah dipakai modul Posts, jangan bikin format baru sendiri).

### Endpoint

Public (tanpa auth):
- `GET /products` — list `status = published`, urut `order` asc.
- `GET /products/:slug` — detail, hanya kalau `status = published`; kalau
  tidak ditemukan ATAU status `draft`/`archived`, return 404 (rendering UI
  404 itu tanggung jawab `apps/web`, API cukup konsisten kembalikan 404 utk
  kedua kasus supaya tidak bocor info existence produk non-published).

Admin (butuh auth, pola sama modul Posts — guard/strategy yang sama, cek
implementasi existing sebelum menulis guard baru):
- `GET /admin/products` — list semua status, default sort `order` asc, bisa
  query param sort ke `updatedAt` desc.
- `GET /admin/products/:id` — detail (by id, bukan slug, untuk konsistensi
  form edit admin).
- `POST /admin/products` — create, default `status = draft` kalau tidak
  dikirim eksplisit.
- `PATCH /admin/products/:id` — update, termasuk perubahan `status` (validasi
  publish berlaku kalau `status` di body = `published`, lihat di atas).
- `POST /admin/products/:id/publish` — dedicated action, sama efeknya dengan
  `PATCH` yang set `status: published` (shortcut untuk toggle di List Product,
  tetap tunduk validasi publish).
- `POST /admin/products/:id/unpublish` — set `status: draft` (tidak ada
  validasi field wajib untuk turun status).
- `POST /admin/products/:id/archive` — set `status: archived`.
- `POST /admin/products/:id/restore` — set `status: draft` (default aman;
  admin bisa langsung publish lagi lewat aksi publish terpisah kalau field
  masih lengkap — tidak auto-restore ke `published` untuk menghindari produk
  tiba-tiba tampil publik tanpa aksi eksplisit admin).

Path prefix (`/products` vs `/admin/products`, atau pola lain seperti
`/posts` + guard berbeda per route) mengikuti konvensi routing modul Posts
yang sudah ada — implementer WAJIB cek pola tersebut dulu (nama controller,
prefix, penempatan guard) sebelum menulis controller baru, jangan menebak.

### Reuse Post/Playlist

Tidak ada foreign key baru ke Post/Playlist. Tidak ada endpoint baru untuk
pencarian by tag/slug — endpoint tersebut (`GET /search?tags={slug}&limit={n}`
dan playlist-by-slug) sudah ada dan dipakai oleh ticket Web, bukan bagian
ticket ini sama sekali (tidak disentuh, tidak direferensikan dari controller
Product).

## Out of Scope (ikut ticket)

- Payment/checkout.
- Perubahan skema/endpoint Post atau Playlist.
- Perubahan Prisma di luar model `Product` (+ enum `ProductStatus` yang
  menyertainya).
- Seed data CAF.
- UI apapun (`apps/admin`, `apps/web`).
- Role/permission baru — reuse role admin existing seperti modul Posts.

## Definition of Done

- Migration Prisma untuk `Product` + enum `ProductStatus` berhasil dijalankan
  di lingkungan dev tanpa merusak model lain.
- Endpoint public hanya mengekspos produk `published`.
- Endpoint admin memerlukan auth yang sama dengan modul Posts (request tanpa
  auth ke endpoint admin ditolak).
- Validasi publish (cover, ctaUrl valid, minimal 1 pipelineSteps, minimal 1
  features) berlaku konsisten di semua jalur yang menghasilkan
  `status = published`.
- Archive lalu restore mengembalikan produk ke status `draft` tanpa
  menghilangkan data.
- Verifikasi lint/typecheck/test/build (command aktual dari `apps/api/package.json`,
  bukan asumsi nama script root) lulus.
