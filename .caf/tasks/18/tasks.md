# Tasks — Ticket #18: Extend Post API — atribusi sumber, dedup, kontrak untuk hermes

## Routing / Scope Kerja
**BACKEND ONLY — single app: `apps/api` (NestJS).** Tidak menyentuh `apps/admin`/`apps/web`.
Main thread: routing implementasi langsung ke Coder untuk `apps/api`, tidak perlu koordinasi
service lain. Ticket #19 (`apps/admin`, tampilan `sourceUrl`) depend ke ticket ini tapi
di-breakdown terpisah — tidak dikerjakan di sini.

## Butuh Architect stage?
**Tidak.** Single app, perubahan schema tergolong kecil (2 field baru + 1 unique constraint) di
model existing (bukan model baru), tidak ada keputusan arsitektur lintas service. Extend
endpoint & service yang sudah ada, pola create sudah mapan. Bisa langsung ke Coder setelah
Planner.

## Urutan Kerja

### Task 1 — Migration Prisma: field `sourceUrl` + `externalId`
- Edit `apps/api/prisma/schema.prisma`, model `Post` (baris 104-136): tambah dua field:
  ```prisma
  sourceUrl   String?  @map("source_url")
  externalId  String?  @unique @map("external_id")
  ```
  Taruh setelah field `cover` (baris ~115), sebelum `type` — atau posisi lain yang masuk akal,
  final call Implementer (urutan field di schema tidak fungsional).
- Jalankan `prisma migrate dev` (via `pnpm --filter <api-package-name> run prisma:migrate`,
  script ada di `apps/api/package.json`) untuk generate migration file baru — JANGAN edit
  migration lama, JANGAN `prisma db push` (harus tercatat sebagai migration file, konsisten
  dengan migration existing di `apps/api/prisma/migrations/`).
- Jalankan `prisma generate` supaya Prisma Client ter-update dengan field baru (biasanya
  otomatis kebawa `migrate dev`, tapi verifikasi `PrismaService`/type `Post` sudah punya field
  baru sebelum lanjut Task 2).

### Task 2 — `CreatePostDto`: tambah `sourceUrl` & `externalId`
- Edit `apps/api/src/posts/dto/create-post.dto.ts`. Tambah dua field OPTIONAL (post manual dari
  admin dashboard tetap valid tanpa field ini), ikuti pola persis field `cover` yang sudah ada
  (baris 44-47):
  ```ts
  @ApiPropertyOptional({ description: 'Source article URL (for attribution, e.g. from hermes)' })
  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @ApiPropertyOptional({ description: 'External unique identifier for dedup (e.g. from hermes)' })
  @IsString()
  @IsOptional()
  externalId?: string;
  ```
- Cek juga `apps/api/src/posts/dto/update-post.dto.ts` — kalau itu extend/PartialType dari
  `CreatePostDto` (pola NestJS umum), field baru otomatis ikut ke situ tanpa perubahan
  tambahan; kalau ternyata didefinisikan manual terpisah, tambahkan field yang sama di sana
  juga supaya update post juga bisa mengubah `sourceUrl`/`externalId` (konsistensi, meski
  di luar acceptance criteria eksplisit — nice-to-have, tidak blocking kalau dilewati).

### Task 3 — Dedup logic di `PostsService.create`
- Edit `apps/api/src/posts/posts.service.ts`, method `create` (baris 64-90).
- SEBELUM slug generation/transaction create: kalau `dto.externalId` ada (truthy), query
  `this.prisma.post.findFirst({ where: { externalId: dto.externalId, deletedAt: null } })`.
  - Kalau ketemu → **jangan create post baru**. Return post existing lewat `attachMedia()`
    (pola yang sama dipakai di return normal, baris 89) supaya shape response konsisten.
    Rekomendasi Planner: tambah flag pembeda di response controller (lihat Task 4) — service
    method sendiri cukup return data post existing, keputusan message/flag di level controller.
  - Kalau tidak ketemu → lanjut flow create seperti biasa (existing code tidak berubah),
    `externalId` dan `sourceUrl` otomatis ikut tersimpan lewat `...postData` spread (baris 76,
    karena keduanya sudah jadi bagian `CreatePostDto` dari Task 2 — TIDAK perlu destructure
    manual seperti `mediaIds`).
- Dedup check ini HARUS di-skip total kalau `dto.externalId` tidak dikirim (`undefined`/`null`/
  string kosong) — post manual dari admin dashboard (tanpa `externalId`) tetap create normal
  setiap kali, tidak pernah kena false-positive dedup.

### Task 4 — Controller: bedakan response create-baru vs dedup-hit
- Edit `apps/api/src/posts/posts.controller.ts`, method `create` (baris 81-91).
- Service method `create` perlu balikin info apakah ini create baru atau existing (mis. return
  `{ post, wasExisting: boolean }` dari service, bukan cuma `post` — sesuaikan Task 3 kalau
  perlu ubah return shape service). Controller pakai info itu untuk set `message` yang beda:
  - Create baru: `message: 'Post created'` (tidak berubah dari sekarang).
  - Dedup-hit: `message: 'Post already exists for this externalId'`, HTTP status tetap 200/201
    apa adanya (lihat Celah & Ambiguitas #1 di requirements.md — final call Implementer boleh
    pilih 409 Conflict kalau dianggap lebih tepat, asal konsisten & didokumentasikan di Task 5).

### Task 5 — Dokumentasi kontrak endpoint untuk hermes
- Tulis dokumen kontrak API singkat untuk referensi integrasi hermes — lokasi: file baru
  `apps/api/docs/hermes-integration.md` (buat folder `docs/` di `apps/api` kalau belum ada;
  ATAU taruh di lokasi lain yang masuk akal kalau repo sudah punya konvensi docs teknis API —
  final call Implementer, cek dulu apakah ada `docs/api-contract.md` di root repo sesuai
  referensi di `CLAUDE.md` project ini, kalau ada tambahkan section di situ alih-alih bikin
  file baru).
- Isi minimal: 3 endpoint dari tabel Kontrak API di `requirements.md` (login, upload image,
  create post), field wajib/opsional `CreatePostDto` terbaru (termasuk `sourceUrl`/`externalId`),
  behavior dedup yang dipilih di Task 4, catatan batas ukuran upload (10MB, dari
  `apps/api/src/media/media.controller.ts:27`, existing — tidak diubah ticket ini).
- Ini BUKAN kode aplikasi, murni dokumentasi teknis — boleh markdown singkat, tidak perlu
  format formal tertentu.

## Verify Checklist
- [ ] `pnpm --filter <api-package-name> run typecheck` (`tsc --noEmit`) lolos tanpa error baru
      di file yang ditambah/diubah.
- [ ] `pnpm --filter <api-package-name> run build` (`nest build`) lolos.
- [ ] Migration Prisma baru ada di `apps/api/prisma/migrations/`, `prisma generate` sukses,
      tidak ada error saat `prisma migrate dev` (cek Implementer jalankan dengan DB lokal aktif).
- [ ] Manual/read-through check: create post TANPA `externalId` (payload manual biasa) —
      behavior tidak berubah, tetap create normal setiap kali dipanggil berulang.
- [ ] Manual/read-through check: create post DENGAN `externalId` yang SAMA dua kali berturut —
      call kedua TIDAK membuat row baru di tabel `posts`, return post existing dari call
      pertama.
- [ ] Manual/read-through check: `sourceUrl` tersimpan dan terbaca balik lewat
      `GET /admin/posts/:slug` setelah create dengan field itu terisi.
- [ ] Manual/read-through check: `cover` yang dikirim sebagai URL eksternal (bukan
      `{APP_URL}/uploads/...`) TIDAK divalidasi/ditolak oleh ticket ini — validasi/enforcement
      "harus URL internal" adalah tanggung jawab hermes di sisi VPS (di luar scope, lihat
      requirements.md `## Di Luar Scope`), API tetap terima string apa adanya seperti sekarang.
- [ ] Dokumen kontrak (Task 5) ada dan menyebutkan ketiga endpoint + field baru + behavior
      dedup yang dipilih.

Kalau verify gagal setelah 3x percobaan perbaikan → stop, tulis
`.caf/tasks/18/verify-report.md` dengan `Status: NEEDS_HUMAN` dan detail kegagalannya
(mengikuti kontrak Retry Logic di `caf-planner.md` — berlaku untuk Coder/Verifier stage
berikutnya, bukan dieksekusi oleh Planner).
