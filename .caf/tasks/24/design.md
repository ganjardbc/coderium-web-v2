# Design — Ticket #24: Backend Modul AI Content Generation (ai-content)

## Status: reviewed oleh Architect, keputusan Planner DIKONFIRMASI (tanpa perubahan arah)

## 1. Validasi keputusan desain: endpoint terpisah `POST /admin/ai-content/cover`

**Keputusan Planner dikonfirmasi.** Endpoint terpisah adalah pendekatan yang benar,
bukan digabung ke response `generate`.

Alasan eksplisit (di luar yang sudah ditulis Planner):

- **Kontrak PRD "reupload terjadi saat commit, bukan saat preview" adalah constraint
  fungsional, bukan cuma UX.** Kalau `generate` langsung upload cover ke storage lokal,
  setiap klik "Generate" (termasuk yang di-skip/di-generate-ulang tanpa pernah di-commit)
  akan menulis file ke disk dan record `Media` ke DB. Itu kebocoran resource: user bisa klik
  generate berkali-kali (tidak ada rate limit khusus, sesuai Out-of-Scope) tanpa pernah
  commit, meninggalkan file orphan yang tidak pernah dipakai post manapun dan tidak ada
  mekanisme cleanup di scope ticket manapun (#24 maupun #25). Endpoint terpisah membuat
  reupload jadi aksi eksplisit yang hanya terjadi saat user benar-benar memilih untuk commit.
- **Idempotency/retry lebih murah.** Kalau generate gagal di-parse LLM, tidak ada file
  yang perlu di-cleanup. Kalau upload cover gagal (network/timeout ke image host eksternal),
  user bisa retry cover saja tanpa perlu generate ulang artikel (re-generate artikel = biaya
  LLM API lagi, retry cover = tidak).
- **Separation of concern konsisten dengan `MediaModule` existing**: `MediaService.upload()`
  sudah jadi satu-satunya jalur masuk `Media` record (dipakai `MediaController.uploadImage`
  untuk file dari browser). Endpoint `cover` di `ai-content` hanya jadi adapter tipis di
  depan alur yang sama (sumber file: fetch server-side, bukan multipart upload), tidak
  reimplement logic storage.

Alternatif yang ditolak (return cover sudah terupload langsung dari `generate`) memang
lebih sedikit round-trip HTTP, tapi melanggar constraint PRD di atas dan menambah risiko
orphan file. Tidak ada trade-off yang membuatnya lebih baik untuk scope ticket ini —
ditolak.

## 2. Verifikasi `MediaService.upload()` — signature & asumsi Planner

Dicek langsung ke kode (bukan cuma requirements.md):

- `apps/api/src/media/media.service.ts:17` — `upload(file: Express.Multer.File, userId: string | null)`.
  Return value: hasil `prisma.media.create({ data: { ...storageResult, userId } })` — yaitu
  full `Media` record (row Prisma), bukan cuma URL. Field yang relevan untuk response
  endpoint `cover`: `id` (jadi `mediaId`) dan `url`.
- `apps/api/src/shared/storage/storage.service.ts:34` — `StorageService.upload(file)` HANYA
  memakai 4 field dari `Express.Multer.File`: `file.originalname` (untuk ekstensi & simpan
  sebagai `originalName`), `file.buffer` (ditulis ke disk), `file.mimetype`, `file.size`.
  Field lain (`fieldname`, `encoding`, `destination`, `filename`, `path`, `stream`) TIDAK
  dipakai sama sekali di jalur upload ini.
- **Konsekuensi untuk Coder:** `Express.Multer.File` adalah interface TypeScript yang
  mewajibkan semua field di atas ada secara tipe (bukan optional), meskipun runtime hanya
  4 yang dipakai. Karena hasil fetch server-side (`fetch(imageUrl)` → `Buffer`) TIDAK
  datang dari Multer, Coder wajib membuat object literal yang mengisi minimal 4 field
  yang benar-benar dipakai (`originalname`, `buffer`, `mimetype`, `size`) dan mengisi
  sisanya dengan nilai dummy yang valid secara tipe, lalu cast eksplisit
  `as Express.Multer.File` — **JANGAN** `as unknown as Express.Multer.File` tanpa mengisi
  field wajib sama sekali (silent runtime bug kalau suatu saat `StorageService`/`MediaService`
  berubah untuk pakai field lain). Contoh minimal yang valid:
  ```ts
  const fakeFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: `cover-${crypto.randomUUID()}${ext}`, // ext dari Content-Type atau URL
    encoding: '7bit',
    mimetype: contentType,
    size: buffer.length,
    buffer,
    destination: '',
    filename: '',
    path: '',
    stream: undefined as unknown as import('stream').Readable,
  };
  ```
  Asumsi Planner di `tasks.md` task 6.3 ("field lain boleh dummy/cast sesuai kebutuhan
  TypeScript") **valid dan dikonfirmasi** — tidak ada field tersembunyi yang dipakai
  `StorageService`/`MediaService` di luar 4 yang disebut.
- `MediaModule` (`media.module.ts`) meng-export `MediaService` dan import `StorageModule` —
  konfirmasi bahwa `AiContentModule` cukup `imports: [MediaModule]` untuk dapat akses
  `MediaService`, tidak perlu import `StorageModule` langsung (transitif, sesuai
  requirements.md Dependency section).

## 3. Verifikasi kontrak `POST /admin/posts` tidak berubah

Dicek `apps/api/src/posts/dto/create-post.dto.ts` dan `posts.controller.ts`:

- `CreatePostDto.cover` (baris 44–47): `@ApiPropertyOptional() @IsString() @IsOptional() cover?: string;`
  — plain optional string, **tidak ada validasi format/domain** (bukan `@IsUrl()`, tidak ada
  custom validator yang membatasi ke domain internal tertentu). URL internal hasil endpoint
  `cover` (`{APP_URL}/uploads/{filename}`) valid mengisi field ini tanpa modifikasi DTO
  apapun.
- `posts.controller.ts` endpoint `create` (baris 83–97) tidak melakukan transformasi/side
  effect apapun terhadap `dto.cover` — diteruskan apa adanya ke `postsService.create(dto, user.id)`.
  (Tidak membaca `posts.service.ts` lebih lanjut karena di luar scope validasi ini — cukup
  dikonfirmasi controller+DTO tidak berubah kontrak; asumsi Planner "reuse tanpa modifikasi"
  **valid**.)
- Kesimpulan: asumsi Planner benar sepenuhnya — endpoint `cover` di modul `ai-content`
  hanya perlu menghasilkan string URL yang lolos `@IsString()`, tidak ada perubahan
  apapun dibutuhkan di `posts/`.

## 4. Kontrak final endpoint (acuan lintas-ticket #24 ↔ #25)

### `POST /admin/ai-content/generate`

- Auth: JWT (global guard) + `@Permissions('manage_own_posts', 'manage_all_posts')`.
- Request body: tidak ada (empty body).
- Response sukses (`200`):
  ```json
  {
    "success": true,
    "message": "Article generated",
    "data": {
      "title": "string",
      "content": "string",
      "coverUrl": "string (URL eksternal, BELUM diupload, JANGAN dipakai langsung sebagai cover final)",
      "sourceUrl": "string (URL artikel sumber untuk atribusi)"
    }
  }
  ```
- Response gagal: `502 Bad Gateway` (kegagalan provider LLM/web search — network,
  timeout, response tidak bisa di-parse) atau `500 Internal Server Error` (error tak
  terduga lain). Body error mengikuti format exception filter NestJS default/global yang
  sudah dipakai project ini (Coder cross-check exception filter existing di
  `apps/api/src/`, tidak didefinisikan ulang di sini). Pesan generik ke client, detail
  teknis di-log server-side.
- **Kontrak untuk ticket #25 (frontend):** `coverUrl` dari response ini adalah kandidat
  gambar eksternal untuk ditampilkan di preview (`<img src="coverUrl">` langsung dari
  domain eksternal, no-hotlink berarti hanya dipakai di preview, bukan disimpan). Field
  ini TIDAK valid dipakai sebagai `cover` di `POST /admin/posts` — harus melalui endpoint
  `cover` di bawah dulu saat user commit.

### `POST /admin/ai-content/cover`

- Auth: sama seperti `generate`.
- Request body:
  ```json
  { "imageUrl": "string" }
  ```
  (nilai ini adalah `coverUrl` dari response `generate` di atas — caller tidak boleh
  mengirim URL sembarang lain di luar alur ini, meski backend tidak memvalidasi
  asal-usulnya secara ketat di luar validasi format URL/tipe konten gambar).
- Response sukses (`200`/`201` — Coder pilih salah satu konsisten dengan pola endpoint
  POST lain di project ini, cek `posts.controller.ts`/`media.controller.ts` untuk status
  code default NestJS yang dipakai; tidak ada override `@HttpCode` eksplisit di kedua
  controller referensi, jadi default NestJS untuk `@Post()` adalah `201` — ikuti pola ini,
  **jangan** override ke `200` kecuali ada alasan spesifik):
  ```json
  {
    "success": true,
    "message": "Cover uploaded",
    "data": {
      "url": "string (URL internal, {APP_URL}/uploads/{filename})",
      "mediaId": "string (UUID Media record)"
    }
  }
  ```
- Response gagal:
  - `400 Bad Request` — `imageUrl` bukan URL valid (gagal `class-validator`), atau
    response fetch bukan `Content-Type: image/*`.
  - `502 Bad Gateway` — fetch ke `imageUrl` gagal (network error, timeout, host tidak
    reachable, status HTTP non-2xx dari server eksternal).
  - `500 Internal Server Error` — kegagalan `MediaService.upload()`/storage lokal (disk
    penuh, dll — kasus jarang, tidak perlu ditangani khusus di luar try/catch generik).
- **Kontrak untuk ticket #25 (frontend):** `data.url` dari response ini adalah nilai yang
  WAJIB dikirim sebagai field `cover` (string) di body `POST /admin/posts` saat user
  commit artikel. `data.mediaId` disediakan untuk kebutuhan lain (mis. kalau frontend #25
  perlu mengaitkan `mediaId` ke `mediaIds` array di `CreatePostDto` — ini keputusan
  frontend #25, di luar scope wajib ticket #24, `mediaId` cukup disediakan sebagai info
  tambahan).

## 5. Risiko tambahan yang belum eksplisit di requirements.md/tasks.md (dalam scope #24)

Semua di bawah ini disarankan masuk implementasi Coder ticket #24 (bukan expand scope,
murni hardening di dalam endpoint `cover` yang memang sudah didesain):

1. **Ukuran file gambar tidak dibatasi.** `MediaController.uploadImage` (upload dari
   browser) membatasi `fileSize: 10 * 1024 * 1024` (10MB) lewat `FileInterceptor`. Endpoint
   `cover` fetch server-side TIDAK lewat Multer sama sekali sehingga limit ini tidak
   otomatis berlaku — tanpa guard eksplisit, endpoint ini bisa dipakai untuk fetch file
   besar sembarang (DoS ringan ke disk lokal via `imageUrl` yang mengarah ke file berukuran
   sangat besar). **Rekomendasi:** Coder cek `Content-Length` header (kalau ada) sebelum
   fetch body penuh, dan/atau enforce limit yang sama (10MB) setelah buffer didapat —
   reject dengan `400`/`413` kalau melebihi. Ini konsisten dengan limit yang sudah ada di
   `MediaController`, bukan kebijakan baru.
2. **Timeout fetch server-side tidak disebut eksplisit di tasks.md.** `fetch()` native
   Node tanpa `AbortController`/timeout bisa hang lama kalau host eksternal lambat/tidak
   merespons, menahan request handler (dan connection pool) lebih lama dari wajar.
   **Rekomendasi:** Coder set timeout eksplisit (mis. 10–15 detik via
   `AbortController`/`AbortSignal.timeout()`) saat fetch `imageUrl`, lempar `502` kalau
   timeout. Ini murni hardening di dalam implementasi method yang sudah direncanakan
   (`commitCover()` task 6), tidak menambah endpoint/scope baru.
3. **Validasi `Content-Type` saja tidak cukup untuk mencegah file non-gambar yang
   di-mislabel** (server eksternal bisa kirim header `Content-Type: image/png` untuk file
   apapun). Ini risiko yang sudah ada juga di path upload existing (`MediaController`
   tidak memvalidasi magic bytes juga), jadi konsisten dengan level proteksi yang sudah
   diterima project ini — **tidak direkomendasikan menambah validasi magic-bytes** di
   ticket ini (di luar level proteksi existing, akan jadi scope creep).
4. **`imageUrl` sebagai vektor SSRF ringan.** Endpoint ini fetch URL arbitrary yang
   dikirim client (meski secara desain seharusnya berasal dari `coverUrl` hasil
   `generate`, backend tidak memaksakan itu). Bisa dipakai untuk fetch `http://localhost`
   atau IP internal jaringan. **Catatan, bukan blocker:** mengingat endpoint ini
   JWT-protected + permission-gated (bukan endpoint publik) dan konsisten dengan level
   trust yang sama seperti endpoint admin lain di project ini, risiko ini diterima untuk
   scope ticket #24 (tidak direkomendasikan menambah SSRF-guard/allowlist domain di ticket
   ini — akan jadi scope creep yang tidak diminta PRD). Dicatat di sini murni supaya
   reviewer/PM sadar trade-off-nya, bukan sebagai instruksi wajib ke Coder.

Tidak ada revisi terhadap struktur endpoint atau kontrak field akibat poin-poin di atas —
semuanya adalah penguatan implementasi di dalam kontrak yang sudah didefinisikan di
section 4, tidak mengubah request/response shape.

## 6. Kesimpulan untuk Coder #24 dan (nanti) Coder #25

- Keputusan Planner soal endpoint terpisah `POST /admin/ai-content/cover`: **final,
  tidak perlu didiskusikan ulang** — divalidasi arsitektural dan teknis di atas.
- Kontrak request/response di section 4 adalah sumber kebenaran untuk kedua ticket.
  Ticket #25 (frontend) HARUS memakai `data.url` dari `POST /admin/ai-content/cover`
  sebagai `cover` di `POST /admin/posts`, bukan `coverUrl` mentah dari
  `POST /admin/ai-content/generate`.
- Section 5 adalah rekomendasi hardening dalam scope ticket #24 (bukan ticket baru),
  Coder boleh mengimplementasikan sebagai bagian task 6 (`commitCover()`) tanpa perlu
  balik ke Planner.
</content>
