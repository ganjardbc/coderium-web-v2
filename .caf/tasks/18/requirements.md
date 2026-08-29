# Requirements — Ticket #18: Extend Post API — atribusi sumber, dedup, kontrak untuk hermes

## Status: PLAN

## Sumber
GitHub Issue #18 (ganjardbc/coderium-web-v2). Sumber discovery: `.caf/discovery/hermes-article-ingest/prd.md`
+ `flow.md`. Ticket sibling #19 (Admin UI atribusi sumber, `apps/admin`) depend ke ticket ini —
tidak di-breakdown di sini, terpisah.

## Problem
Agent "hermes" (VPS terpisah, di luar repo ini) sudah scrape artikel AI dan kirim ke Telegram
4x/hari, tapi berhenti di situ — tidak ada jalur otomatis dari artikel yang ditemukan hermes ke
draft `Post` di coderium. API saat ini tidak punya kontrak untuk menerima create-post dari
service eksternal secara aman (tanpa duplikat) dan tanpa atribusi asal artikel.

## Target User
Pemilik/pengelola konten coderium (juga operator hermes) — content reviewer di `apps/admin`,
dan secara tidak langsung hermes sendiri sebagai API consumer.

## Acceptance Criteria
- [ ] Model `Post` punya field baru `sourceUrl` (String?, nullable) untuk atribusi asal artikel.
- [ ] Model `Post` punya field baru `externalId` (String?, unique constraint) sebagai basis dedup.
- [ ] `CreatePostDto` menerima `sourceUrl?: string` dan `externalId?: string` (keduanya optional
      di level DTO — post manual dari admin dashboard tetap boleh tanpa field ini).
- [ ] `PostsService.create` melakukan cek dedup: kalau `externalId` dikirim dan sudah ada post
      dengan `externalId` yang sama (dan belum soft-deleted), TIDAK membuat post baru — return
      post existing dengan flag/message yang membedakan dari create baru (lihat Celah & Ambiguitas
      untuk pilihan exact behavior).
- [ ] Kalau `externalId` tidak dikirim (create post manual biasa), behavior create TIDAK berubah
      dari sekarang — dedup hanya aktif kalau `externalId` ada di request.
- [ ] Migration Prisma baru dibuat dan berhasil di-generate (`prisma migrate dev` secara lokal
      oleh Implementer, bukan dijalankan otomatis oleh Planner).
- [ ] Kontrak endpoint untuk hermes didokumentasikan (lihat Task di tasks.md) — field wajib/
      opsional, auth, response shape, behavior dedup — supaya bisa dipakai sebagai referensi
      integrasi dari sisi VPS hermes (dokumen ini boleh berupa comment/README teknis, BUKAN
      kode baru di luar yang sudah disebutkan).

## Di Luar Scope
- Kode/logic scraping, download gambar, atau cronjob di VPS hermes — di luar repo ini.
- Alur pengiriman Telegram existing — tidak berubah.
- Auto-publish otomatis oleh hermes — draft tetap butuh publish manual via
  `POST /admin/posts/:slug/publish` (endpoint existing, tidak berubah).
- Perubahan behavior endpoint `POST /uploads/image` / `StorageService` itu sendiri — dipakai
  apa adanya. Ticket ini hanya MENDOKUMENTASIKAN batas ukuran file existing (`fileSize: 10 * 1024
  * 1024` — 10MB, `apps/api/src/media/media.controller.ts:27`), tidak mengubahnya.
- Provisioning user bot baru / rotasi kredensial — sudah ada dan dikonfirmasi user
  (lihat prd.md `## Dependency`), tidak dikerjakan ulang di sini.
- Tampilan field `sourceUrl` di admin dashboard — itu scope Ticket #19 (`apps/admin`), terpisah.
- Rate limiting/abuse protection khusus untuk create-post dari bot — di luar scope kecuali
  muncul sebagai blocking issue saat implementasi (`ThrottlerGuard` global 100 req/60s tetap
  berlaku apa adanya, `apps/api/src/app.module.ts:44-56`).

## Celah & Ambiguitas
1. **Exact behavior saat dedup terdeteksi** — ticket bilang "tolak dengan error, atau return
   post existing" tanpa memutuskan salah satu. **Rekomendasi Planner:** return post existing
   dengan HTTP 200 (bukan error 409/400) dan `message: 'Post already exists for this externalId'`
   plus field pembeda di response (mis. `data.wasExisting: true` atau samakan shape dengan
   create biasa tapi beda message) — alasannya: hermes adalah cron otomatis tanpa manusia yang
   membaca error response secara real-time, response sukses-tapi-informatif lebih robust
   daripada error yang mungkin bikin cron retry/alert tanpa perlu. Final call Implementer kalau
   mau pilih pendekatan error (409 Conflict) — tidak blocking, tapi WAJIB konsisten dan
   didokumentasikan di kontrak API (Task 4 di tasks.md).
2. **Fallback cover tanpa gambar** — prd.md menyebut "cover kosong/null, atau default image"
   tanpa keputusan final. **Rekomendasi Planner:** `cover: null` (behavior existing kalau field
   tidak dikirim, field sudah `String?` nullable) — TIDAK perlu logic default-image baru
   (nambah scope tanpa requirement eksplisit). Final call Implementer boleh beda, tidak blocking.
3. **`externalId` unique tapi nullable** — karena post manual (dari admin dashboard, bukan
   hermes) tidak akan mengirim `externalId`, field ini harus `String? @unique` di Prisma
   (PostgreSQL: multiple `NULL` tetap dianggap distinct terhadap unique constraint, jadi banyak
   post manual dengan `externalId: null` tidak akan bentrok satu sama lain — perlu diverifikasi
   Implementer saat migration, tapi ini behavior standar Postgres unique index, bukan gap).
4. Tidak ada ambiguitas lain yang blocking — sisanya (nama field, lokasi dedup check) sudah
   cukup jelas dari scope ticket. Status tetap `PLAN`, bukan `NEEDS_HUMAN`.

## Kontrak API (referensi untuk hermes, hasil dari ticket ini)

| Method | Path | Guna | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Login bot user, dapat JWT | Public |
| POST | `/api/v1/uploads/image` | Upload cover image, dapat URL internal | JWT (bot user) |
| POST | `/api/v1/admin/posts` | Create post/draft, dedup by `externalId` | JWT (bot user, permission `manage_own_posts`) |

Field `CreatePostDto` (setelah ticket ini, field baru ditandai **BARU**):
```ts
{
  title: string;             // wajib
  subtitle?: string;
  content?: string;
  type: 'article' | 'carousel' | 'video' | 'stack_gallery'; // wajib, hermes pakai 'article'
  tags?: string[];
  cover?: string;             // WAJIB berisi URL internal hasil /uploads/image, bukan hotlink eksternal
  metaDescription?: string;
  metaKeywords?: string;
  isPublished?: boolean;      // hermes TIDAK kirim ini — default false
  mediaIds?: string[];
  sourceUrl?: string;         // BARU — URL artikel sumber, wajib diisi hermes
  externalId?: string;        // BARU — identifier unik dari hermes, wajib diisi hermes untuk dedup
}
```

## Konvensi yang harus diikuti (referensi codebase existing)
- App: `apps/api` (NestJS). File terdampak: `apps/api/prisma/schema.prisma`,
  `apps/api/src/posts/dto/create-post.dto.ts`, `apps/api/src/posts/posts.service.ts`.
- Pola DTO existing: `class-validator` decorators (`@IsString`, `@IsOptional`, dst),
  `@ApiProperty`/`@ApiPropertyOptional` untuk Swagger — field baru ikuti pola yang sama persis
  (lihat `create-post.dto.ts:44-47` untuk contoh field optional string seperti `cover`).
- Pola create existing (`posts.service.ts:64-90`): slug generation lalu `$transaction` create +
  sync mediables. Dedup check harus masuk SEBELUM transaction create (query `findUnique` atau
  `findFirst` by `externalId`, mirip pola cek slug collision yang sudah ada di baris 68).
- Migration: `pnpm --filter <api-package-name> run prisma:migrate` (lihat `apps/api/package.json`
  script `prisma:migrate` = `prisma migrate dev`) — dijalankan manual oleh Implementer, bukan
  bagian dari CI otomatis di repo ini setahu Planner.
- Verifikasi realistis: `typecheck` (`tsc --noEmit`) + `build` (`nest build`) di `apps/api`.
  Tidak ada script `test` terlihat dikonfirmasi terpakai — TIDAK invent command test yang tidak
  ada; kalau ada test existing untuk `posts` module, Implementer cek dan jalankan, tapi jangan
  jadi blocking requirement Planner kalau memang tidak ada.
