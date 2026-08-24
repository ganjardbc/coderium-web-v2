# Tasks — Ticket 12: Product CRUD API (apps/api)

Rujuk `requirements.md` di folder ini untuk detail keputusan field/endpoint/
validasi sebelum eksekusi tiap task. Semua task ada di `apps/api` — tidak ada
task di `apps/admin`/`apps/web`.

## Urutan Agent

1. **caf-coder** (implementasi tunggal, backend-only) — task 1–7 di bawah,
   berurutan.
2. **caf-reviewer** (kalau dipakai di pipeline ini) — review diff sebelum
   dianggap selesai.
3. Tidak butuh UX/PM/frontend agent — ticket ini murni backend, keputusan UX
   sudah final di `flow.md` (sudah dikonsumsi jadi keputusan data di
   `requirements.md`, tidak perlu dibaca ulang oleh coder untuk bagian
   UI/visual).

## Task Breakdown

### 1. Investigasi pola modul Posts existing (WAJIB sebelum menulis kode)

- Baca struktur modul Posts di `apps/api` (controller, service, DTO, module,
  guard/strategy auth yang dipakai untuk endpoint admin, path prefix routing
  publik vs admin, pola exception/validation error response).
- Catat pola penamaan file/folder yang dipakai supaya modul Product konsisten
  (mis. `products.controller.ts`, `products.service.ts`, `products.module.ts`,
  `dto/create-product.dto.ts`, dst — ikuti persis pola Posts, jangan bikin
  konvensi baru).
- Kalau ada perbedaan signifikan dari asumsi di `requirements.md` (mis. guard
  admin ternyata pakai role granular per-modul, bukan role generik), catat
  dan sesuaikan implementasi — tidak perlu stop kecuali menemukan blocker
  yang mengubah scope ticket.

### 2. Prisma schema — model `Product` + enum `ProductStatus`

- Tambahkan enum `ProductStatus { draft published archived }` dan model
  `Product` di `apps/api/prisma/schema.prisma`, field sesuai tabel di
  `requirements.md`.
- Ikuti konvensi existing: `@map`/`@@map` snake_case untuk kolom/tabel,
  `@@index` untuk `slug`, `status`, kombinasi `status + order` (dipakai query
  listing public), `featured` (dipakai query homepage featured — meski query
  itu di luar scope ticket, index tetap wajar disiapkan karena field dan
  filter query publik ada di ticket ini).
- Tidak menyentuh model lain di file yang sama.

### 3. Migration

- Generate migration Prisma untuk perubahan di atas.
- Jalankan migration di lingkungan dev, pastikan tidak ada breaking change ke
  tabel lain (migration harus additive-only: `CREATE TYPE`, `CREATE TABLE`).

### 4. DTO + validasi

- `CreateProductDto`: `name`, `slug` (optional — kalau kosong, service yang
  generate dari `name`), field lain optional sesuai tabel requirements.
  `status` optional, default `draft` kalau tidak dikirim (dan kalau dikirim
  `published`, tunduk validasi publish — lihat task 5).
- `UpdateProductDto`: partial dari create.
- Validasi format dasar (mis. `ctaUrl` harus string URL valid kalau diisi)
  pakai class-validator/pola validasi yang sama dengan DTO Posts.
- Validasi publish (field wajib: `cover`, `ctaUrl`, minimal 1 `pipelineSteps`,
  minimal 1 `features`) **bukan** di level DTO decorator biasa (karena field
  ini optional untuk draft) — implementasikan sebagai validasi kondisional di
  service, dijalankan setiap kali transisi ke `status = published` terjadi
  (create langsung published, update yang set published, maupun endpoint
  dedicated `/publish`).

### 5. Service layer

- CRUD dasar: create (default `status: draft`), findAll (admin: semua status
  + sort; public: `published` saja + sort `order` asc), findOne (admin: by
  id; public: by slug, hanya `published`), update.
- Slug: auto-generate dari `name` kalau `slug` tidak dikirim di create;
  validasi unique (reuse util slug generator existing kalau ada di codebase,
  jangan tulis ulang kalau util-nya sudah ada dipakai Posts/Playlist).
- Validasi publish dijalankan di titik yang tepat (lihat task 4), return
  error terstruktur (daftar nama field yang gagal) kalau tidak lolos —
  jangan silently downgrade ke draft.
- Action publish/unpublish/archive/restore sebagai method service terpisah
  (bukan cuma update generik), supaya controller bisa expose endpoint
  dedicated dengan jelas sesuai `requirements.md`.
- `findOne` publik untuk slug yang tidak ditemukan ATAU statusnya bukan
  `published`: lempar `NotFoundException` (404) di kedua kasus, jangan bocor
  informasi produk exist-tapi-draft/archived.

### 6. Controller + routing + auth

- Controller public: endpoint tanpa guard, sesuai path di `requirements.md`
  (atau path final hasil investigasi task 1 kalau pola Posts pakai prefix
  beda).
- Controller admin: pasang guard/strategy yang sama dengan endpoint admin
  Posts. Semua endpoint admin (list, detail, create, update, publish,
  unpublish, archive, restore) di belakang guard ini.
- Register module baru ke root module aplikasi (`app.module.ts` atau
  setara).

### 7. Test

- Unit test service: validasi publish gagal kalau field wajib kosong (per
  field: cover kosong, ctaUrl kosong, pipelineSteps kosong, features kosong)
  dan lolos kalau lengkap.
- Unit/integration test: archive lalu restore mengembalikan ke `draft`, data
  tetap ada (tidak terhapus).
- Controller/e2e test (ikuti pola test existing Posts kalau ada e2e untuk
  modul itu): endpoint public hanya mengembalikan produk `published`;
  endpoint admin menolak request tanpa auth (401/403).
- Jalankan test/lint/typecheck/build sesuai command aktual di
  `apps/api/package.json` (isi TODO di `CLAUDE.md` root belum lengkap — cek
  langsung ke package.json, jangan asumsi nama script root monorepo).

## Definition of Done (ringkas, detail lihat requirements.md)

- [ ] Migration jalan bersih, additive-only.
- [ ] Endpoint public hanya expose `published`, urut `order`.
- [ ] Endpoint admin penuh (CRUD + publish/unpublish/archive/restore) di
      belakang auth yang sama dengan Posts.
- [ ] Validasi publish konsisten di semua jalur yang menghasilkan
      `status = published`.
- [ ] Test unit/e2e untuk validasi publish, archive/restore, dan proteksi
      auth admin lulus.
- [ ] Lint, typecheck, build `apps/api` lulus.
