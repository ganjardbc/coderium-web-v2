# QA Report — Ticket #18: Extend Post API — atribusi sumber, dedup, kontrak untuk hermes

## Status: PASS

## Metodologi
Membaca kode aktual (bukan hanya klaim `verify-report.md`), menjalankan ulang perintah
verifikasi (`typecheck`, `build`), memeriksa schema Prisma live di database lokal
(`\d posts`, `information_schema.columns`), dan membaca isi dokumen kontrak API.
Branch `ai-agent/18`, working tree bersih (semua sudah commit di `c60025e`).

## Acceptance Criteria — hasil cek satu per satu

1. **Field `sourceUrl` (String?, nullable) di model `Post`** — PASS.
   `apps/api/prisma/schema.prisma:113` → `sourceUrl String? @map("source_url")`.
   Dikonfirmasi juga di DB live: kolom `source_url` ada di tabel `posts`
   (`information_schema.columns`, 21 kolom termasuk `source_url`).

2. **Field `externalId` (String?, unique) di model `Post`** — PASS.
   `schema.prisma:114` → `externalId String? @unique @map("external_id")`.
   Dikonfirmasi di DB live: kolom `external_id` + index unique
   `posts_external_id_key` UNIQUE btree (external_id) ada (`\d posts`).

3. **`CreatePostDto` terima kedua field, optional** — PASS.
   `apps/api/src/posts/dto/create-post.dto.ts:49-57` — `sourceUrl?: string` dan
   `externalId?: string`, keduanya `@IsString() @IsOptional() @ApiPropertyOptional`,
   pola identik dengan field `cover` existing.

4. **Dedup logic: `externalId` sama → tidak create baru, return existing** — PASS.
   `apps/api/src/posts/posts.service.ts:64-76` — di awal method `create`, kalau
   `dto.externalId` truthy, `findFirst({ where: { externalId, deletedAt: null } })`;
   kalau ketemu, langsung `attachMedia()` lalu `return { post: withMedia, wasExisting: true }`
   — TIDAK pernah masuk ke blok `$transaction` create. Controller
   (`posts.controller.ts:85-97`) membedakan `message` berdasarkan `wasExisting`
   ('Post already exists for this externalId' vs 'Post created'), HTTP status tetap
   default sukses (bukan 409) — konsisten dengan rekomendasi Planner di
   requirements.md dan didokumentasikan.

5. **Tanpa `externalId` → behavior create tidak berubah** — PASS.
   Read-through: kalau `dto.externalId` falsy, blok dedup check (baris 65-76) di-skip
   total, lanjut ke flow existing (slug generation → `$transaction` create) tanpa
   modifikasi. `mediaIds` di-destructure terpisah seperti sebelumnya, `sourceUrl`/
   `externalId` (kalau `undefined`) ikut lewat spread `...postData` — tidak ada logic
   baru yang mengubah jalur create manual.

6. **Migration Prisma ter-generate dan berhasil di-apply** — PASS (dengan catatan cara
   generate berbeda dari `prisma migrate dev` normal, sudah didokumentasikan jujur di
   verify-report.md).
   - File migration ada: `apps/api/prisma/migrations/20260829183715_add_post_source_url_external_id/migration.sql`,
     isinya `ALTER TABLE posts ADD COLUMN external_id, source_url` + `CREATE UNIQUE INDEX`.
   - Dijalankan ulang `prisma migrate status` (dengan `DATABASE_URL` di-export manual dari
     `.env`, karena `npx prisma` tanpa env export gagal load — bukan masalah project, cuma
     env-loading di shell QA) → hasil: **"Database schema is up to date!"**, 5 migrations
     ditemukan termasuk migration baru ini.
   - Verifikasi langsung ke Postgres lokal (`psql \d posts` +
     `information_schema.columns`) mengonfirmasi kolom `source_url`, `external_id`, dan
     unique index `posts_external_id_key` benar-benar ada di DB, bukan cuma di file
     migration.
   - Catatan: Coder pakai `prisma migrate diff` + apply manual + `migrate deploy`
     alih-alih `migrate dev` interaktif karena environment non-interactive (TTY-limited)
     — SQL hasil akhir identik dengan yang `migrate dev` akan hasilkan, dan `migrate status`
     mengonfirmasi state DB konsisten dengan migration history. Bukan penyimpangan yang
     mengkhawatirkan, tapi dicatat di NON-CRITICAL karena bukan cara "standar" yang diminta
     requirements.md secara harfiah (`prisma migrate dev`).

7. **Kontrak API terdokumentasi** — PASS.
   `docs/api/api-contract.md` — section `# Hermes Integration (Ticket #18)` (baris ~999+)
   berisi: 3 endpoint (login, upload image, create post) dengan tabel method/path/guna/auth,
   alur rekomendasi step-by-step, field `CreatePostDto` relevan (termasuk `sourceUrl`/
   `externalId` ditandai baru), behavior dedup final (return existing + message beda, HTTP
   sukses bukan 409), dan referensi batas upload 10MB
   (`apps/api/src/media/media.controller.ts:27`, tidak diubah). Juga ada update di section
   `## Create Post` existing yang menjelaskan behavior dedup singkat dan mengarahkan ke
   section Hermes Integration untuk detail.

## Verifikasi command (dijalankan ulang oleh QA, bukan hanya percaya klaim Coder)

- `pnpm --filter coderium-api run typecheck` → **PASS**, tanpa error (mengonfirmasi tipe
  Prisma Client sudah ter-generate ulang dengan field baru — kalau belum, `dto.externalId`
  di `where: { externalId }` akan gagal typecheck).
- `pnpm --filter coderium-api run build` (`nest build`) → **PASS**.
- `prisma migrate status` (DB lokal `coderium`) → **PASS**, "Database schema is up to date!".
- `psql \d posts` + query `information_schema.columns` → kolom `source_url`, `external_id`,
  index unique `posts_external_id_key` terkonfirmasi ada di DB live.
- Cek pemanggil lain `postsService.create` di seluruh codebase (`grep -rn`) → hanya satu
  caller, `PostsController.create`, sudah disesuaikan dengan return shape baru
  `{ post, wasExisting }`. Klaim "tidak ada pemanggil lain" di verify-report.md terbukti
  akurat.
- Cek `findAdminBySlug`/`findBySlugPublic` di `posts.service.ts` → keduanya pakai
  `prisma.post.findFirst(...)` tanpa `select`, jadi `sourceUrl` otomatis ikut ter-return di
  `GET /admin/posts/:slug` tanpa perubahan tambahan — klaim verify-report.md akurat.
- `git status --short` pada `apps/api` dan `docs/api` → bersih, semua perubahan sudah
  ter-commit di `c60025e feat(api): add sourceUrl/externalId to Post for hermes integration + dedup`.

## ### CRITICAL
Tidak ada temuan critical. Semua acceptance criteria terpenuhi dan terverifikasi langsung
terhadap kode + DB live, bukan hanya klaim verify-report.md.

## ### NON-CRITICAL
1. **Cara generate migration menyimpang dari `prisma migrate dev` literal** — Coder pakai
   `prisma migrate diff` + apply manual + `prisma migrate deploy` karena environment
   non-interactive tidak bisa jalankan `migrate dev` secara normal. Hasil akhir (SQL,
   state DB, migration history) terverifikasi identik/konsisten, jadi tidak blocking —
   tapi kalau environment CI/production nanti butuh `migrate dev` interaktif untuk generate
   migration berikutnya, workaround serupa mungkin perlu diulang. Tidak ada aksi wajib,
   sekadar catatan untuk ticket berikutnya yang butuh migration baru di environment serupa.
2. **Tidak ada test otomatis (unit/e2e) untuk dedup logic** — sesuai requirements.md yang
   eksplisit bilang tidak ada script `test` terkonfirmasi terpakai untuk module `posts` dan
   tidak boleh invent command test yang tidak ada, jadi ini bukan gap dari sisi acceptance
   criteria ticket ini. Dicatat sebagai observasi: kalau project menambah test suite untuk
   `posts` module di masa depan, dedup logic (`create` dengan `externalId` sama dua kali)
   adalah kandidat baik untuk regression test permanen.
3. **`UpdatePostDto`** — verify-report.md mengklaim `UpdatePostDto extends PartialType(CreatePostDto)`
   sehingga otomatis membawa `sourceUrl`/`externalId`; QA tidak membaca file
   `update-post.dto.ts` secara eksplisit karena di luar acceptance criteria wajib ticket ini
   (disebutkan sebagai "nice-to-have, tidak blocking" di tasks.md Task 2). Tidak
   mempengaruhi status PASS, tapi kalau ingin dipastikan 100%, cek manual singkat
   `apps/api/src/posts/dto/update-post.dto.ts` bisa dilakukan sebagai langkah tambahan
   opsional oleh agent berikutnya sebelum push/PR.
