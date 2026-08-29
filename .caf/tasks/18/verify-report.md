# Verify Report — Ticket #18: Extend Post API — atribusi sumber, dedup, kontrak untuk hermes

## Status: PASS

## Ringkasan implementasi
- `apps/api/prisma/schema.prisma`: model `Post` — tambah `sourceUrl String? @map("source_url")`
  dan `externalId String? @unique @map("external_id")`, ditaruh setelah `cover`, sebelum `type`.
- Migration baru: `apps/api/prisma/migrations/20260829183715_add_post_source_url_external_id/migration.sql`
  (`ALTER TABLE posts ADD COLUMN source_url, external_id` + `CREATE UNIQUE INDEX posts_external_id_key`).
- `apps/api/src/posts/dto/create-post.dto.ts`: tambah `sourceUrl?: string` dan `externalId?: string`,
  keduanya `@IsString() @IsOptional()` + `@ApiPropertyOptional`, mengikuti pola `cover` yang sudah
  ada. `UpdatePostDto` (`update-post.dto.ts`) sudah `extends PartialType(CreatePostDto)` sehingga
  otomatis ikut membawa kedua field baru tanpa perubahan tambahan.
- `apps/api/src/posts/posts.service.ts` — method `create`: dedup check ditambahkan SEBELUM slug
  generation/transaction. Kalau `dto.externalId` truthy, query
  `findFirst({ where: { externalId, deletedAt: null } })`; kalau ketemu, TIDAK create baru —
  langsung `attachMedia()` post existing dan return `{ post, wasExisting: true }`. Kalau tidak
  ketemu (atau `externalId` tidak dikirim), lanjut flow create seperti biasa, return
  `{ post, wasExisting: false }`. Return shape service berubah dari `Promise<post>` menjadi
  `Promise<{ post, wasExisting }>` — dicek, satu-satunya caller adalah `PostsController.create`
  (sudah disesuaikan), tidak ada pemanggil lain di codebase (grep `postsService.create`).
- `apps/api/src/posts/posts.controller.ts` — method `create`: destructure `{ post, wasExisting }`
  dari service, `message` jadi `'Post already exists for this externalId'` kalau `wasExisting`,
  selain itu tetap `'Post created'` seperti sebelumnya. HTTP status tetap default (201/200 sesuai
  Nest default POST handler, tidak diubah eksplisit) — mengikuti rekomendasi Planner (bukan
  409 Conflict), didokumentasikan di `docs/api/api-contract.md`.
- `docs/api/api-contract.md` — repo sudah punya dokumen kontrak API di root (bukan bikin file baru
  di `apps/api/docs/`, sesuai final call "pakai yang sudah ada kalau ada"): update contoh request
  `Create Post` dengan `sourceUrl`/`externalId` + penjelasan behavior dedup, dan section baru
  `# Hermes Integration (Ticket #18)` berisi 3 endpoint (login, upload image, create post), alur
  rekomendasi, field `CreatePostDto` relevan, behavior dedup final, dan batas upload 10MB
  (referensi `apps/api/src/media/media.controller.ts:27`, tidak diubah).

## Keputusan "final call Implementer" (mengikuti rekomendasi Planner, tidak ada penyimpangan)
1. Dedup hit → HTTP sukses (bukan 409), `message` beda, `data` = post existing.
2. `cover` tanpa gambar → tetap `null`, tidak ada logic default-image baru.
3. `externalId` → `String? @unique`, diverifikasi lewat test fungsional (lihat di bawah) bahwa
   multiple `NULL` tidak saling bentrok di PostgreSQL.
4. Dokumen kontrak Task 5 → ditambahkan sebagai section baru di
   `docs/api/api-contract.md` (sudah ada di root, sesuai referensi `CLAUDE.md`), bukan file baru
   di `apps/api/docs/`.

## Verify Checklist — hasil

- [x] `pnpm --filter coderium-api run typecheck` — PASS, tanpa error.
- [x] `pnpm --filter coderium-api run build` — PASS (`nest build` sukses).
- [x] Migration Prisma baru ada di `apps/api/prisma/migrations/20260829183715_add_post_source_url_external_id/`,
      `prisma generate` sukses, `prisma migrate deploy` sukses menerapkan ke DB lokal
      (`prisma migrate status` → "Database schema is up to date!").
      Catatan: `prisma migrate dev` gagal jalan non-interaktif di environment ini
      (`Error: Prisma Migrate has detected that the environment is non-interactive`,
      termasuk dengan `--create-only` dan stdin di-pipe `yes`). Workaround yang dipakai:
      `prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script`
      untuk generate SQL diff, migration folder dibuat manual dengan format nama/isi konsisten
      migration existing, lalu `prisma migrate deploy` (non-interactive, standar untuk apply
      migration) untuk menerapkan ke DB lokal. Hasil akhir identik dengan yang `migrate dev`
      akan hasilkan (SQL sama, hanya jalur generate-nya manual karena keterbatasan TTY).
- [x] Manual/functional check — create post TANPA `externalId`: dua post dengan `externalId: null`
      berhasil dibuat tanpa konflik (diverifikasi via script Prisma langsung terhadap DB lokal,
      lihat detail di bawah) — konsisten dengan requirement "behavior tidak berubah".
- [x] Manual/functional check — dedup dengan `externalId` sama: diverifikasi query
      `findFirst({ externalId, deletedAt: null })` menemukan row yang sama persis dengan yang
      dibuat sebelumnya (id match), dan percobaan `create` kedua dengan `externalId` yang sama
      di level Prisma memicu `P2002` (unique constraint violation) — membuktikan constraint DB
      aktif sebagai safety-net kalau ada race condition di luar dedup check level service.
      Read-through kode service: dedup check di `PostsService.create` mengembalikan post existing
      via `attachMedia()` sebelum masuk ke blok `$transaction` create, jadi tidak akan pernah
      sampai memicu constraint violation dalam alur normal (single request).
- [x] Manual/read-through check — `sourceUrl` tersimpan dan terbaca balik: diverifikasi
      `sourceUrl` field muncul di object post yang dibuat via Prisma create langsung (test
      fungsional), dan `findAdminBySlug`/`findBySlugPublic` di `posts.service.ts` menggunakan
      `prisma.post.findFirst(...)` tanpa `select` (return semua kolom scalar model), jadi
      `sourceUrl` otomatis ikut ter-return di `GET /admin/posts/:slug` tanpa perubahan kode
      tambahan.
- [x] Manual/read-through check — `cover` URL eksternal tetap diterima apa adanya: tidak ada
      validasi format/domain baru ditambahkan ke field `cover` di `CreatePostDto` (tetap
      `@IsString() @IsOptional()` seperti sebelumnya) — konsisten dengan "di luar scope".
- [x] Dokumen kontrak (Task 5) — section `# Hermes Integration (Ticket #18)` di
      `docs/api/api-contract.md` menyebutkan ketiga endpoint (login, upload image, create post),
      field baru (`sourceUrl`, `externalId`), dan behavior dedup yang dipilih.

## Test fungsional ad-hoc (tidak permanen, dihapus setelah verify)
Dijalankan script sementara via `ts-node` yang connect langsung ke Prisma Client (DB lokal
`postgresql://ganjarhadiatna@localhost:5432/coderium`) untuk verifikasi behavior dedup &
unique constraint level database — bukan test suite permanen (tidak ada script `test` di
`apps/api/package.json` dan tidak ada file `*.spec.ts` existing untuk module `posts`, sesuai
catatan Planner di requirements.md — tidak invent command test yang tidak ada). Semua data test
dibersihkan (`deleteMany`) di akhir run, script dihapus setelah verify selesai — tidak ada
sisa file/data test di repo maupun DB.

Hasil run:
```
created post1 id= d161ea00-a800-46aa-8021-efb0d55c913b externalId= test-ext-id-1 sourceUrl= https://example.com/article
dedup lookup found id= d161ea00-a800-46aa-8021-efb0d55c913b matches p1: true
unique violation as expected: true P2002
two posts with null externalId created OK: true true
cleanup done
```

## File yang diubah/ditambah
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260829183715_add_post_source_url_external_id/migration.sql` (baru)
- `apps/api/src/posts/dto/create-post.dto.ts`
- `apps/api/src/posts/posts.service.ts`
- `apps/api/src/posts/posts.controller.ts`
- `docs/api/api-contract.md`

## Retry
Tidak perlu retry — semua verify lolos di percobaan pertama.
