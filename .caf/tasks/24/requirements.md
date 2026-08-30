# Requirements — Ticket #24: Backend Modul AI Content Generation (ai-content)

## Status: PLAN

## Sumber
- GitHub issue #24 (body ticket, apa adanya).
- Discovery: `.caf/discovery/generate-artikel-ai/prd.md` + `flow.md` (tidak ada Pertanyaan
  Terbuka yang memblokir discovery — semua bersifat non-blocking/UI copy, sudah dicek).
- Kode existing yang jadi acuan konvensi: `apps/api/src/posts/`, `apps/api/src/media/`,
  `apps/api/src/shared/storage/`, `apps/api/src/app.module.ts`.

## Scope Ticket Ini (ulang, murni backend `apps/api`)
Ticket ini HANYA `apps/api`. Tidak ada perubahan `apps/admin`/frontend — itu ticket #25
terpisah. Breakdown ini tidak boleh menyentuh `apps/admin`.

1. Modul baru `apps/api/src/ai-content/` (NestJS module: controller, service, dto).
2. Endpoint `POST /admin/ai-content/generate` — JWT-protected (lewat global `APP_GUARD`
   existing: `JwtAuthGuard` + `PermissionsGuard`, pola sama seperti
   `posts.controller.ts`), memakai `@Permissions('manage_own_posts', 'manage_all_posts')`
   supaya konsisten dengan permission create Post lain.
   - Tidak menerima body/parameter dari frontend (sesuai PRD: klik card langsung trigger,
     tidak ada form input).
   - Memanggil LLM provider OpenAI-compatible via package `openai`, base URL configurable
     lewat env var (bukan hardcode ke OpenAI resmi).
   - Memakai built-in web search tool provider tsb untuk mencari 1 artikel trending
     (AI/Coding/Technology/Startup/topik terkait).
   - System prompt/style guide (Bahasa Indonesia, sapaan "Aku"/"Kamu", rapi, detail, tone
     ramah) di-hardcode di kode backend (constant di service), TIDAK ada parameter untuk
     override dari caller.
   - Response: `{ title, content, coverUrl (URL eksternal, kandidat, belum diupload),
     sourceUrl }` — TIDAK ada write ke database di endpoint ini.
   - Ukur & log durasi round-trip request ini (lihat `## Observability Latensi` di bawah).

3. Endpoint kedua untuk logic download+reupload cover — lihat
   `## Keputusan Desain: Endpoint Cover Commit` di bawah untuk penjelasan kenapa endpoint
   terpisah ini perlu ada (bukan cuma "logic" tanpa endpoint).
   - `POST /admin/ai-content/cover` — JWT-protected, permission sama seperti di atas.
   - Body: `{ imageUrl: string }` (URL eksternal cover candidate dari hasil generate).
   - Proses: fetch `imageUrl` server-side (bukan dari browser — hindari CORS & konsisten
     dengan requirement "no-hotlink" karena backend yang fetch, bukan user), lalu panggil
     `MediaService.upload()` existing (reuse langsung, TIDAK reimplement logic upload) untuk
     menghasilkan `Media` record + URL internal (`{APP_URL}/uploads/{filename}`).
   - Response: `{ url: string (URL internal), mediaId: string }`.
   - Endpoint ini TIDAK memanggil `POST /admin/posts` — itu tetap tanggung jawab caller
     (frontend ticket #25) setelah dapat `url` internal, supaya `CreatePostDto`/
     `POST /admin/posts` tetap tidak berubah kontraknya (sesuai Success Metric ticket).
   - Kegagalan fetch/upload (network error, bukan gambar valid, dst.) dikembalikan sebagai
     error HTTP yang jelas (4xx/5xx sesuai kasus), pesan generik ke caller, detail teknis
     dilog di backend — konsisten pola "Commit gagal" di `flow.md`.

4. Environment variable baru di `apps/api/.env` (dan `.env.example`), pola sama seperti
   `JWT_SECRET`:
   - `AI_CONTENT_LLM_API_KEY` — API key provider LLM.
   - `AI_CONTENT_LLM_BASE_URL` — base URL provider (OpenAI-compatible).
   - `AI_CONTENT_LLM_MODEL` — nama model yang dipakai (perlu configurable, provider
     OpenAI-compatible biasanya butuh model id eksplisit).
   - Nilai aktual (API key sungguhan) TIDAK diisi oleh Planner/Coder — hanya placeholder di
     `.env.example` dan baris kosong/placeholder di `.env` lokal kalau perlu untuk build,
     provisioning kredensial asli adalah tanggung jawab user (Dependency ticket).

5. Dependency baru: package `openai` ditambahkan ke `apps/api/package.json` (`dependencies`).

## Keputusan Desain: Endpoint Cover Commit
Ticket body menyebut "Logic download+reupload cover... terjadi saat commit" sebagai bagian
scope modul `ai-content`, tapi Dependency ticket hanya menyebut endpoint existing
(`POST /admin/posts`, `POST /uploads/image`) sebagai yang di-reuse, tanpa endpoint baru
eksplisit untuk proses commit cover. Karena:
- Ticket ini murni backend, tidak ada scope frontend di sini (frontend ticket #25 terpisah).
- `POST /admin/posts` WAJIB tidak berubah kontrak (Success Metric: "0 perubahan
  skema/kontrak yang gagal ... reuse CreatePostDto existing tanpa modifikasi field wajib
  baru").
- Browser tidak bisa reliably fetch gambar dari domain eksternal sembarang lalu upload
  ulang (CORS, dan requirement "no-hotlink" lebih konsisten kalau fetch dilakukan
  server-side, bukan client-side).

**Keputusan:** modul `ai-content` menyediakan endpoint terpisah `POST /admin/ai-content/cover`
yang membungkus fetch-server-side + `MediaService.upload()`, dipanggil oleh caller (nanti
frontend ticket #25) sebelum memanggil `POST /admin/posts` dengan `cover` sudah berupa URL
internal. Ini keputusan implementasi Planner, BUKAN requirement literal dari PRD/ticket —
dicatat di sini supaya reviewer/QA-plan tahu asumsinya dan Coder ticket #25 tahu kontraknya.

## Observability Latensi (Success Metric ticket)
- Endpoint `generate` WAJIB mencatat durasi (mulai request diterima sampai response
  dikirim) via `Logger` NestJS (structured log, mis. `{ event: 'ai_content_generate',
  durationMs, success }`), supaya bisa diagregasi jadi P50/P95 di luar scope kode ini
  (mis. lewat log aggregator — agregasi P50/P95 itu sendiri BUKAN scope ticket ini,
  ticket hanya wajib menyediakan raw duration log per request sebagai baseline).
- Endpoint `cover` boleh (opsional, tidak wajib) diberi logging durasi juga untuk
  konsistensi, tapi Success Metric ticket spesifik menyebut latensi "klik Generate sampai
  preview muncul" — yaitu endpoint `generate`, bukan `cover`.

## Style Guide LLM (server-side, hardcoded)
Constant di `apps/api/src/ai-content/ai-content.service.ts` (atau file terpisah
`ai-content.constants.ts`), berisi system prompt yang menginstruksikan LLM:
- Menulis dalam Bahasa Indonesia.
- Sapaan "Aku" untuk penulis/narasumber konten, "Kamu" untuk pembaca.
- Tone ramah, rapi, detail.
- Output terstruktur (title terpisah dari content) supaya bisa di-parse jadi
  `{ title, content }` — format `content` mengikuti format existing yang dipakai
  `create.vue`/`edit.vue` di admin (Planner tidak punya akses ke `apps/admin` untuk
  memastikan detail format ini; Coder WAJIB cross-check `CreatePostDto.content` dan
  bagaimana field ini dirender di `apps/admin` sebelum finalisasi parsing response LLM —
  lihat `flow.md` Pertanyaan Terbuka soal format content).
Style guide ini TIDAK exposed sebagai parameter API — tidak ada DTO field untuk override.

## Konvensi yang WAJIB diikuti (dari kode existing)
- Controller pola sama `posts.controller.ts`/`media.controller.ts`: `@ApiTags`,
  `@ApiBearerAuth`, `@ApiOperation`, response shape `{ success, message, data }`.
- Module registrasi: tambahkan `AiContentModule` ke `imports` di
  `apps/api/src/app.module.ts` (sejajar `PostsModule`, `MediaModule`, dll).
- `AiContentModule` import `MediaModule` (untuk `MediaService`) dan `ConfigModule` sudah
  global (`isGlobal: true` di `AppModule`) jadi `ConfigService` bisa langsung di-inject
  tanpa import tambahan.
- Guard: TIDAK perlu `@Public()` (endpoint ini harus protected). TIDAK perlu setup guard
  manual — `JwtAuthGuard`/`PermissionsGuard` sudah global lewat `APP_GUARD` di
  `AppModule`.
- DTO validasi pakai `class-validator` (`IsUrl`/`IsString`) konsisten dengan
  `CreatePostDto`.

## Dependency
- `POST /admin/posts` (`apps/api/src/posts/posts.controller.ts`, `CreatePostDto`) — reuse
  tanpa modifikasi.
- `POST /uploads/image` (`apps/api/src/media/media.controller.ts`) dan `MediaService`
  (`apps/api/src/media/media.service.ts`) — reuse `MediaService.upload()` langsung
  (import `MediaModule`, jangan re-implement upload logic).
- `StorageService` (`apps/api/src/shared/storage/storage.service.ts`) — dipakai
  transitif lewat `MediaService`, tidak perlu diakses langsung oleh `ai-content`.
- Package `openai` — ditambahkan sebagai dependency baru.
- Env var LLM API key + base URL + model — WAJIB diprovision user sebelum bisa diuji
  end-to-end ke provider sungguhan; tanpa ini endpoint `generate` tidak bisa dites secara
  real (unit test/mocking tetap bisa jalan tanpa kredensial asli).
- Provider LLM WAJIB punya built-in web search tool — prasyarat fungsional, bukan sesuatu
  yang bisa di-workaround di kode.

## Out-of-Scope (tegas, jangan dikerjakan)
- Apapun di `apps/admin` (halaman AI Agent, grid card, preview UI) — ticket #25.
- Generate untuk `carousel`, `video`, `stack_gallery`.
- Dedup otomatis berdasarkan `sourceUrl`/`externalId`.
- Batch generate.
- Kustomisasi system prompt dari admin frontend.
- Multi-provider LLM / fallback antar-provider.
- Rate limiting/abuse protection khusus endpoint ini (di luar `ThrottlerModule` global
  yang sudah ada di `AppModule`, yang otomatis berlaku ke semua endpoint termasuk ini —
  tidak perlu konfigurasi throttle khusus tambahan).
- Retry otomatis kalau LLM/web search gagal/timeout — cukup error response yang jelas,
  caller (frontend) yang retry manual.

## Pertanyaan Terbuka
Tidak ada Pertanyaan Terbuka dari discovery yang memblokir ticket ini (dicek di
`prd.md`/`flow.md` — bagian "Pertanyaan Terbuka" di kedua file bersifat non-blocking,
tentang copy/UI, bukan tentang scope backend ticket ini). Satu hal yang PERLU
dikonfirmasi Coder saat implementasi (bukan blocking untuk mulai kerja, dicatat di atas
di `## Style Guide LLM`): format persis `content` (HTML/markdown/plain text) yang
dipakai `create.vue`/`edit.vue` di `apps/admin`, supaya output parsing LLM konsisten —
Coder boleh baca `apps/admin` untuk referensi format ini meski scope tulis tetap di
`apps/api` (baca lintas-app untuk referensi kontrak diperbolehkan, menulis tidak).
</content>
