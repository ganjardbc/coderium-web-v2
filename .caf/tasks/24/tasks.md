# Tasks — Ticket #24: Backend Modul AI Content Generation (ai-content)

Urutan pengerjaan sekuensial (tiap task idealnya satu commit kecil). Semua path di bawah
relatif ke `apps/api/` kecuali disebut lain.

## 1. Setup dependency & env
- [ ] Tambahkan `openai` ke `apps/api/package.json` (`dependencies`), jalankan install
  (`pnpm install` dari root monorepo).
- [ ] Tambahkan ke `apps/api/.env.example`:
  - `AI_CONTENT_LLM_API_KEY="your_llm_api_key_here"`
  - `AI_CONTENT_LLM_BASE_URL="https://api.openai.com/v1"` (contoh placeholder, boleh
    disesuaikan komentar bahwa ini harus OpenAI-compatible, bukan wajib OpenAI resmi)
  - `AI_CONTENT_LLM_MODEL="gpt-4o-mini"` (contoh placeholder)
- [ ] Cek `apps/api/.env` lokal (git-ignored) — kalau ada, tambahkan baris yang sama
  (nilai boleh kosong/placeholder kalau kredensial asli belum diprovision user; JANGAN
  commit kredensial asli apapun).

## 2. Skeleton module
- [ ] Buat `apps/api/src/ai-content/ai-content.module.ts`:
  - imports: `MediaModule` (untuk `MediaService`).
  - controllers: `AiContentController`.
  - providers: `AiContentService`.
- [ ] Daftarkan `AiContentModule` di `apps/api/src/app.module.ts` (tambah ke `imports`,
  sejajar `PostsModule`/`MediaModule`).

## 3. DTO
- [ ] `apps/api/src/ai-content/dto/generate-article-response.dto.ts` — shape response
  `generate` (`title`, `content`, `coverUrl`, `sourceUrl`), pakai `@nestjs/swagger`
  `@ApiProperty` untuk dokumentasi Swagger konsisten dengan DTO lain.
- [ ] `apps/api/src/ai-content/dto/commit-cover.dto.ts` — request body endpoint `cover`:
  `{ imageUrl: string }` dengan `@IsUrl()` (atau `@IsString()` kalau `@IsUrl()` terlalu
  ketat untuk URL sumber yang beragam — putuskan saat implementasi, dokumentasikan
  alasannya di komentar kode kalau menyimpang dari `@IsUrl()`).
- [ ] `apps/api/src/ai-content/dto/index.ts` — barrel export, konsisten pola
  `apps/api/src/posts/dto/index.ts` / `apps/api/src/media/dto/index.ts`.

## 4. Style guide & LLM client
- [ ] `apps/api/src/ai-content/ai-content.constants.ts` — system prompt/style guide
  (Bahasa Indonesia, sapaan Aku/Kamu, tone ramah rapi detail) sebagai konstanta string,
  plus daftar topik yang jadi acuan pencarian (AI, Coding, Technology, Startup, topik
  terkait) untuk disisipkan ke instruksi web search.
- [ ] Di `AiContentService`, buat OpenAI client (`new OpenAI({ apiKey, baseURL })`) dari
  `ConfigService.get('AI_CONTENT_LLM_API_KEY')` / `AI_CONTENT_LLM_BASE_URL`. Model dari
  `AI_CONTENT_LLM_MODEL`.
- [ ] Riset SDK: cari cara memanggil built-in web search tool lewat package `openai`
  (mis. Responses API `tools: [{ type: 'web_search' }]` atau setara, tergantung provider
  yang dipilih user — cek dokumentasi provider aktual saat implementasi, jangan asumsikan
  nama tool tanpa verifikasi terhadap SDK version yang terpasang).

## 5. `AiContentService.generateArticle()`
- [ ] Implementasi method yang:
  1. Catat waktu mulai (`Date.now()` / `process.hrtime`).
  2. Panggil LLM dengan system prompt (task 4) + instruksi cari 1 artikel trending +
     tools web search.
  3. Parse response jadi `{ title, content, coverUrl, sourceUrl }` — pastikan LLM
     diminta mengembalikan format terstruktur (mis. JSON) supaya parsing reliable,
     bukan regex/heuristic terhadap free text.
  4. Log durasi (`Logger.log` structured, lihat `requirements.md`
     `## Observability Latensi`) baik saat sukses maupun gagal (log gagal juga penting
     untuk observability).
  5. Kalau LLM/web search gagal atau response tidak bisa di-parse sesuai format yang
     diharapkan, throw exception NestJS yang sesuai (mis. `InternalServerErrorException`
     atau `BadGatewayException` untuk kegagalan provider eksternal) dengan pesan generik
     ke client, detail asli di-log.
- [ ] Unit test (`ai-content.service.spec.ts`, mock `openai` client) untuk: response
  sukses ter-parse benar, response gagal/malformed melempar exception yang sesuai,
  latency logging terpanggil.

## 6. `AiContentService.commitCover()`
- [ ] Implementasi method yang:
  1. Fetch `imageUrl` server-side (pakai `fetch`/`axios` — cek dependency existing dulu,
     kalau belum ada http client selain fetch native Node 18+, pakai global `fetch`
     untuk hindari dependency baru yang tidak perlu).
  2. Validasi response adalah image (`Content-Type` header) sebelum lanjut — kalau bukan
     image atau fetch gagal, throw exception jelas.
  3. Bungkus buffer hasil fetch jadi objek yang kompatibel dengan signature
     `MediaService.upload(file: Express.Multer.File, userId: string | null)` (isi
     `buffer`, `originalname`, `mimetype`, `size` minimal — field lain `Express.Multer.File`
     yang tidak dipakai `StorageService.upload()` boleh diisi nilai dummy/cast sesuai
     kebutuhan TypeScript, ikuti pola minimal yang benar-benar dipakai
     `StorageService.upload()`, lihat `apps/api/src/shared/storage/storage.service.ts`).
  4. Panggil `MediaService.upload()`, return `{ url, mediaId }` dari hasilnya.
- [ ] Unit test: fetch sukses → upload dipanggil dengan buffer benar; fetch gagal/bukan
  image → exception yang sesuai, `MediaService.upload` TIDAK terpanggil.

## 7. Controller
- [ ] `apps/api/src/ai-content/ai-content.controller.ts`:
  - `@ApiTags('AI Content')`, `@ApiBearerAuth()`, `@Controller()`.
  - `@Permissions('manage_own_posts', 'manage_all_posts')` di kedua endpoint (pola sama
    `posts.controller.ts`).
  - `POST admin/ai-content/generate` → panggil `AiContentService.generateArticle()`,
    return `{ success: true, message: 'Article generated', data }`.
  - `POST admin/ai-content/cover` → terima `CommitCoverDto`, `@CurrentUser()` untuk
    `userId`, panggil `AiContentService.commitCover()`, return
    `{ success: true, message: 'Cover uploaded', data }`.
- [ ] `apps/api/src/ai-content/index.ts` (kalau pola module lain punya barrel export
  module-level — cek `apps/api/src/posts/` dulu; kalau tidak ada pola ini, skip).

## 8. Verifikasi
- [ ] `pnpm --filter coderium-api typecheck` (atau command typecheck aktual di
  `apps/api/package.json` — sudah dikonfirmasi: `tsc --noEmit`, jalankan via
  `pnpm --filter coderium-api run typecheck`).
- [ ] `pnpm --filter coderium-api run build` (`nest build`) — pastikan module baru
  ke-compile tanpa error, termasuk import `openai`.
- [ ] Jalankan unit test yang ditulis di task 5 & 6 (cek script test aktual di
  `apps/api/package.json` — kalau belum ada script `test`, catat sebagai gap di
  verify-report, jangan asumsikan nama script yang tidak ada).
- [ ] Swagger check manual (kalau ada endpoint swagger UI aktif di dev) — pastikan dua
  endpoint baru muncul dengan tag "AI Content" dan `@ApiBearerAuth`.
- [ ] Smoke check tanpa kredensial LLM asli: pastikan endpoint `generate` gagal dengan
  error yang jelas (bukan crash 500 tanpa pesan) kalau env var LLM belum diisi — ini
  bagian dari error-handling dasar yang diminta PRD (bukan retry otomatis, cukup pesan
  jelas).

## Catatan untuk Coder
- Jangan sentuh `apps/admin` sama sekali — di luar scope ticket ini (ticket #25).
- Jangan ubah `CreatePostDto`/`posts.controller.ts`/`posts.service.ts` — Success Metric
  ticket eksplisit melarang perubahan kontrak `POST /admin/posts`.
- Endpoint `POST /admin/ai-content/cover` adalah keputusan desain Planner (lihat
  `requirements.md` `## Keputusan Desain: Endpoint Cover Commit`) untuk menutupi gap
  antara "logic download+reupload cover di modul ini" (redaksi ticket) dan "tidak ada
  endpoint baru disebut di Dependency" — kalau ternyata reviewer/PM menganggak keputusan
  ini salah arah, ini titik yang paling perlu didiskusikan ulang, bukan bagian lain dari
  breakdown.
</content>
