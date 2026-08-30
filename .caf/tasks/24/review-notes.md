# Review Notes — Ticket #24: Backend Modul AI Content Generation (ai-content)

## Keputusan: APPROVE

Diverifikasi langsung terhadap kode aktual di working tree branch `ai-agent/24`
(catatan: perubahan belum di-commit — semua ada di `git status`/`git diff` working
tree, bukan `git diff main...HEAD` karena tidak ada commit baru di branch ini),
bukan hanya membaca klaim `verify-report.md`/`qa-report.md`. Kontrak `design.md`
section 4 diikuti persis, tidak ada penyimpangan yang ditemukan.

## Yang Diverifikasi

### 1. Kontrak endpoint vs `design.md` section 4 — SESUAI
- `POST admin/ai-content/generate` (`ai-content.controller.ts:13-19`): tanpa body,
  `@Permissions('manage_own_posts', 'manage_all_posts')`, response
  `{ success, message: 'Article generated', data: { title, content, coverUrl, sourceUrl } }`.
  Cocok persis dengan kontrak di `design.md`.
- `POST admin/ai-content/cover` (`ai-content.controller.ts:21-30`): `CommitCoverDto`
  (`{ imageUrl }`, `@IsUrl({ require_protocol: true })`), default status `201`
  (tidak ada `@HttpCode` override) — sesuai instruksi eksplisit design.md ("ikuti
  default NestJS 201, jangan override ke 200").
- Error mapping cocok matriks design.md: `generate` → `InternalServerErrorException`
  (config kosong, 500) / `BadGatewayException` (provider/parsing gagal, 502);
  `cover`/`fetchImage` → `BadRequestException` (bukan image / >10MB, 400),
  `BadGatewayException` (fetch gagal/network/non-2xx, 502),
  `InternalServerErrorException` (kegagalan `MediaService.upload()`, 500).
- Observability latensi: `generateArticle()` mencatat `{ event: 'ai_content_generate',
  durationMs, success }` via `Logger` di jalur sukses maupun gagal (try/catch),
  sesuai Success Metric ticket.

### 2. Keamanan endpoint `cover` (fetch dari URL arbitrary) — mitigasi cukup untuk scope ticket
Dicek `ai-content.service.ts` method `fetchImage()`:
- Timeout 15s via `AbortController` — ada (`FETCH_TIMEOUT_MS`, cleared di `finally`).
- Limit ukuran 10MB dicek DUA kali: dari header `Content-Length` (early-reject sebelum
  baca body) DAN dari ukuran buffer aktual setelah `arrayBuffer()` (menutup celah kalau
  server eksternal tidak mengirim/memalsukan `Content-Length`) — konsisten dengan limit
  `MediaController.uploadImage` (10MB).
- Validasi `Content-Type: image/*` sebelum fetch body penuh (reject dengan 400 kalau
  tidak lolos).
- `Express.Multer.File`-compatible object mengisi seluruh field wajib tipe (bukan
  `as unknown as` kosong) sesuai instruksi eksplisit design.md section 2 — cross-check
  `commitCover()` baris 155-166, semua field terisi (dummy untuk `destination`/`filename`/
  `path`/`stream`, field yang dipakai StorageService/MediaService — `originalname`,
  `mimetype`, `size`, `buffer` — terisi benar).
- SSRF (fetch ke `localhost`/IP internal) dan validasi magic-bytes secara sengaja TIDAK
  ditambahkan — ini keputusan eksplisit `design.md` section 5 poin 3 & 4 (dicatat sebagai
  trade-off yang diterima karena endpoint JWT+permission-gated, level proteksi sama
  dengan `MediaController` existing yang juga tidak validasi magic-bytes). Bukan gap baru
  yang diperkenalkan Coder — konsisten dengan level risiko yang sudah disetujui di
  `design.md`, tidak direkomendasikan untuk memblokir merge.
- Catatan non-blocking (bukan regresi, level proteksi setara existing): `Content-Type:
  image/svg+xml` diterima sebagai valid image (ada di `mimeExtMap`). File SVG yang
  di-serve statis berpotensi berisi script inline (stored-content risk kalau diakses
  langsung, bukan lewat `<img>` tag). Ini risiko yang sudah ada juga di jalur upload
  `MediaController` (tidak ada filter mimetype pada `FileInterceptor` untuk upload
  manual dari browser), jadi bukan regresi baru dari ticket ini — dicatat untuk
  awareness saja, tidak mem-block.

### 3. Konsistensi pola dengan modul existing (`posts`/`media`) — SESUAI
- `@ApiTags`, `@ApiBearerAuth()` (class-level, sama seperti `MediaController`, bukan
  per-endpoint seperti `PostsController` — dua pola ini memang berbeda di kode existing,
  tidak ada standar tunggal di repo, jadi keduanya valid), `@ApiOperation` per-endpoint —
  ada di kedua endpoint baru.
- Response shape `{ success, message, data }` — konsisten.
- Module registrasi: `AiContentModule` masuk `imports` di `app.module.ts`, sejajar modul
  lain (`AiContentModule` sebelum `ThrottlerModule`) — sesuai.
- `AiContentModule` hanya `imports: [MediaModule]`, tidak import `StorageModule`
  langsung — sesuai keputusan design.md (transitif lewat `MediaModule`).
- DTO pakai `class-validator` (`@IsUrl`) — konsisten pola `CreatePostDto`.
- Guard: tidak ada `@Public()`, tidak ada setup guard manual — mengandalkan `APP_GUARD`
  global, sesuai konvensi.

### 4. Verifikasi tidak menyentuh kontrak `posts`/`apps/admin`
- `git diff`/`git status` dicek langsung: `CreatePostDto`, `posts.controller.ts`,
  `posts.service.ts` tidak muncul di daftar file berubah. `apps/admin/` tidak ada
  perubahan.
- Package `openai@^7.8.0` ditambahkan ke `apps/api/package.json` dependencies, sesuai
  requirement. API yang dipakai (`client.responses.create(...)`, `tools: [{ type:
  'web_search' }]`, `role: 'developer'`) dicek cocok dengan type declaration package
  `openai` yang ter-install di `node_modules` — bukan API yang dikarang/salah versi.
- `.env` lokal git-ignored dengan benar (`git check-ignore -v apps/api/.env` →
  `.gitignore:33: *.env`), tidak ada kredensial di-commit; `.env.example` diisi
  placeholder wajar.

### 5. Unit test (`ai-content.service.spec.ts`)
Dibaca penuh — struktural baik, mencakup skenario sukses/gagal untuk kedua method
sesuai klaim verify-report/qa-report. Setuju dengan penilaian QA: gap eksekusi
(tidak ada infra Jest repo-wide) adalah gap infra, bukan kekurangan spesifik modul
ini, dan sudah didokumentasikan dengan benar sebagai non-blocking sesuai instruksi
`tasks.md`.

## Temuan

### BLOCKING
Tidak ada.

### NON-BLOCKING
1. **Perubahan dokumentasi di luar `apps/api` literal** (`README.md`,
   `docs/api/api-contract.md`, `docs/architecture/module-breakdown.md`,
   `docs/development/backlog.md`, `docs/development/progress.md`). Sudah dicek isinya
   akurat dan konsisten dengan kontrak `design.md`, tidak menyentuh kode `apps/admin`
   maupun kontrak `posts`. Setuju dengan penilaian QA — tidak perlu revert, cukup untuk
   awareness bahwa scope literal "apps/api" sedikit terlampaui oleh dokumentasi.
2. **Gap infra test Jest repo-wide** (tidak ada `jest`/`@types/jest`/script `test` di
   `apps/api/package.json` atau monorepo). Unit test untuk modul ini sudah ditulis
   dengan baik secara struktur tapi belum pernah benar-benar dieksekusi (tidak ada
   bukti pass/fail run). Ini bukan tanggung jawab ticket #24 untuk memperbaiki
   (repo-wide, tidak spesifik modul ini) — direkomendasikan jadi ticket infra terpisah
   agar test yang sudah ditulis (di modul ini dan modul lain) bisa benar-benar
   dijalankan di CI di masa depan.
3. **Konten SVG diterima sebagai cover valid** tanpa sanitasi (lihat temuan keamanan
   di atas) — level risiko setara dengan jalur upload existing `MediaController`,
   bukan regresi baru, tidak blocking untuk ticket ini. Kalau ada rencana hardening
   upload gambar di masa depan, sebaiknya diterapkan konsisten ke kedua jalur
   (`MediaController` dan `ai-content`) sekaligus, bukan hanya salah satu.
4. **`AI_CONTENT_LLM_BASE_URL` di `.env` lokal** (git-ignored) berisi
   `https://api.openai.com/v1` (bukan placeholder kosong) sementara `API_KEY` kosong —
   tidak berisiko (request akan gagal di `getClient()` karena API key kosong sebelum
   sempat memanggil base URL manapun), murni catatan kerapian, tidak perlu tindakan.

## Kontrak untuk Ticket #25 (frontend) — dikonfirmasi valid sebagai acuan
- `POST /admin/ai-content/generate` → `data.coverUrl` adalah kandidat eksternal, HANYA
  untuk preview (`<img src="coverUrl">`), TIDAK boleh dikirim langsung sebagai `cover`
  di `POST /admin/posts`.
- `POST /admin/ai-content/cover` (body `{ imageUrl }`) → `data.url` adalah nilai yang
  WAJIB dipakai sebagai field `cover` (string) di `POST /admin/posts` saat commit.
  `data.mediaId` tersedia sebagai info tambahan opsional.
- Kedua endpoint JWT-protected dengan permission `manage_own_posts`/`manage_all_posts`
  (sama dengan create Post) — tidak ada permission baru yang perlu ditambahkan di sisi
  auth/RBAC untuk ticket #25.

## File yang Direview
- `apps/api/src/ai-content/ai-content.module.ts` (baru)
- `apps/api/src/ai-content/ai-content.controller.ts` (baru)
- `apps/api/src/ai-content/ai-content.service.ts` (baru)
- `apps/api/src/ai-content/ai-content.constants.ts` (baru)
- `apps/api/src/ai-content/ai-content.service.spec.ts` (baru)
- `apps/api/src/ai-content/dto/*.ts` (baru)
- `apps/api/src/app.module.ts` (diubah)
- `apps/api/package.json` (diubah)
- `apps/api/.env.example` (diubah)
- `apps/api/.env` (diubah, git-ignored, tidak masuk review formal tapi dicek isinya)
- `docs/api/api-contract.md`, `docs/architecture/module-breakdown.md`,
  `docs/development/backlog.md`, `docs/development/progress.md`, `README.md` (diubah,
  di luar scope literal tapi dinilai akurat)
- Referensi silang: `apps/api/src/media/media.service.ts`,
  `apps/api/src/shared/storage/storage.service.ts`, `apps/api/src/media/media.controller.ts`,
  `apps/api/src/posts/posts.controller.ts` (untuk cek konsistensi pola, tidak ada
  perubahan di file-file ini)
</content>
