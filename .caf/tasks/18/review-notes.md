# Review Notes — Ticket #18: Extend Post API — atribusi sumber, dedup, kontrak untuk hermes

## Decision: APPROVE (dengan 1 syarat wajib sebelum push — lihat Blocking #1)

## Ruang lingkup review
Diff `main..ai-agent/18` (merge-base = `main` saat ini, satu commit `c60025e`), plus
perubahan uncommitted di working tree branch yang sama (`README.md`,
`docs/database/prisma-schema-design.md`, `docs/development/backlog.md`,
`docs/development/progress.md`). Dibandingkan terhadap `requirements.md`, `tasks.md`,
`verify-report.md` (PASS), dan `qa-report.md` (PASS).

## Ringkasan kode inti (commit `c60025e`)
- `apps/api/prisma/schema.prisma` + migration `20260829183715_add_post_source_url_external_id`:
  `sourceUrl String? @map("source_url")`, `externalId String? @unique @map("external_id")`.
  SQL migration standar (`ALTER TABLE ... ADD COLUMN` + `CREATE UNIQUE INDEX`), konsisten
  dengan migration existing.
- `CreatePostDto`: `sourceUrl?`/`externalId?`, pola `@ApiPropertyOptional` + `@IsString`
  + `@IsOptional` identik dengan field `cover` existing. `UpdatePostDto extends
  PartialType(CreatePostDto)` — otomatis ikut membawa field baru, tidak perlu perubahan.
- `PostsService.create`: dedup check (`findFirst` by `externalId` + `deletedAt: null`)
  diletakkan SEBELUM slug generation/transaction, sesuai pola yang diminta requirements
  (mirip cek slug collision baris 81). Kalau `externalId` tidak dikirim, blok dedup
  di-skip total — behavior create manual tidak berubah. Return shape berubah dari
  `Promise<post>` jadi `Promise<{ post, wasExisting }>`; sudah dicek satu-satunya caller
  adalah `PostsController.create`, sudah disesuaikan.
- `PostsController.create`: `message` beda untuk dedup-hit vs create baru, HTTP status
  tetap default sukses (bukan 409) — sesuai rekomendasi Planner, didokumentasikan.
- `docs/api/api-contract.md`: section baru `# Hermes Integration (Ticket #18)` — 3 endpoint,
  field DTO relevan, behavior dedup final, batas upload 10MB (referensi existing, tidak
  diubah). Update juga di section `## Create Post` existing.

Kode konsisten dengan pola existing di `apps/posts` (DTO validator, transaction create,
`attachMedia` helper). Tidak ada endpoint/API key baru — auth tetap JWT + permission
`manage_own_posts`/`manage_all_posts` existing, sesuai keputusan discovery.

## BLOCKING
1. **4 file dokumentasi belum di-commit** — `README.md`, `docs/database/prisma-schema-design.md`,
   `docs/development/backlog.md`, `docs/development/progress.md` berubah di working tree
   branch `ai-agent/18` (`git diff` non-empty) tapi TIDAK termasuk commit `c60025e` (`git status`
   masih menandai ` M`, bukan clean). Isinya sudah dicek dan konsisten/akurat terhadap kode
   (schema Post di `prisma-schema-design.md` cocok dengan `schema.prisma`, entry backlog/progress
   mendeskripsikan perubahan dengan benar) — jadi ini BUKAN masalah kualitas konten, murni
   proses: kalau branch ini di-push/PR apa adanya sekarang, keempat file ini TIDAK akan ikut,
   padahal disebutkan eksplisit sebagai bagian scope ticket ini di task description. **Wajib
   di-commit dulu** (bisa jadi commit terpisah atau digabung) sebelum branch ini dianggap siap
   push/PR. Catatan tambahan: `qa-report.md` juga masih untracked (`??`) di `.caf/tasks/18/` —
   sebaiknya ikut di-commit juga supaya artifact handoff lengkap di riwayat git.

## NON-BLOCKING
1. **Race condition (TOCTOU) di dedup check** — `PostsService.create` melakukan
   `findFirst` lalu (kalau tidak ketemu) `create` di luar transaksi yang sama, tanpa
   locking. Kalau dua request dengan `externalId` sama datang nyaris bersamaan (mis. hermes
   retry karena timeout), keduanya bisa lolos `findFirst` (belum ada row) lalu keduanya masuk
   ke `$transaction` create — request kedua akan gagal dengan `PrismaClientKnownRequestError
   P2002` (unique constraint violation) yang TIDAK ditangkap secara eksplisit. Karena tidak ada
   custom handler untuk `P2002`, error ini jatuh ke `AllExceptionsFilter` generik dan
   dikembalikan sebagai **HTTP 500 "Internal server error"** ke caller — bukan response
   sukses-informatif seperti behavior dedup normal, dan bukan pula pesan yang jelas untuk
   debugging dari sisi hermes. Constraint DB tetap melindungi integritas data (tidak akan ada
   row duplikat), jadi ini bukan bug korupsi data, tapi kualitas response untuk skenario race
   ini tidak konsisten dengan desain dedup yang sudah bagus untuk kasus non-race. Verify-report
   memang sudah menguji P2002 di level Prisma langsung, tapi belum menguji jalur race lewat
   `create()` service dua kali konkuren. Rekomendasi (tidak blocking, follow-up ticket boleh):
   tangkap `P2002` di sekitar `tx.post.create`, lalu fallback ke `findFirst` ulang dan return
   existing post dengan `wasExisting: true`, supaya race case juga dapat response sukses
   konsisten seperti dedup normal.
2. **`sourceUrl` tidak divalidasi format URL** — hanya `@IsString()`, bukan `@IsUrl()`.
   Ini sudah didokumentasikan eksplisit di kontrak (`docs/api/api-contract.md`: "tidak
   divalidasi format URL di level API") dan sejalan dengan requirements — bukan gap, hanya
   dicatat sebagai keputusan desain yang eksplisit, bukan default lalai.
3. **`externalId` tidak di-normalize** (tidak ada trim/lowercase) — kalau hermes suatu saat
   mengirim `externalId` dengan whitespace tak sengaja beda (`"abc"` vs `"abc "`), dedup akan
   miss dan membuat duplikat. Di luar scope acceptance criteria eksplisit, hanya catatan
   observasi untuk hermes side (VPS terpisah, di luar repo ini) — pastikan hermes selalu
   generate `externalId` yang deterministik/konsisten.

## Kesimpulan
Kualitas kode implementasi solid, konsisten dengan konvensi existing, tidak ada
penyimpangan dari acceptance criteria, dan sudah diverifikasi ganda (verify-report +
qa-report, keduanya PASS dengan pengecekan langsung ke DB live). Tidak ada temuan blocking
terhadap kode itu sendiri. Satu item BLOCKING murni administratif (commit 4 file dokumentasi
yang masih uncommitted) harus diselesaikan sebelum branch ini di-push/dibuatkan PR oleh main
thread. Race condition TOCTOU dicatat sebagai non-blocking risk untuk pertimbangan
hardening di masa depan, bukan penghalang merge ticket ini.
