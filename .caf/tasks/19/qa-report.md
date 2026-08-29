# QA Report — Ticket #19: Admin UI — tampilkan atribusi sumber draft hermes

## Status: PASS

## Ringkasan
QA memverifikasi hasil Implementer terhadap `requirements.md` (Acceptance Criteria) dan
`tasks.md` (Verify Checklist). Implementer sudah menjalankan `typecheck`/`build` dan
menandai 3 item manual checklist sebagai TIDAK dijalankan (no browser/DB access saat itu).
QA session ini PUNYA akses ke Postgres lokal (`DATABASE_URL` di `apps/api/.env`,
`localhost:5432/coderium`) dan bisa menjalankan `apps/api` dev server, sehingga 3 item manual
tersebut divalidasi ulang secara independen dengan pendekatan setara end-to-end (API real +
DB real), bukan hanya membaca ulang kode dan mempercayai klaim Implementer. Bagian interaksi
UI di browser sungguhan (klik visual, buka tab baru secara render) TETAP tidak bisa
divalidasi karena tidak ada akses browser di sandbox ini — dicatat sebagai limitasi residual
di bawah.

## Verifikasi Independen yang Dijalankan

### 1. Diff scope (Task 4 / AC "tidak ada perubahan apps/api")
`git diff a561c7e..HEAD --stat` (base = merge ticket #18 sebelum commit ticket #19) menunjukkan
HANYA 3 file kode berubah, semuanya di `apps/admin`:
- `apps/admin/src/modules/posts/pages/edit.vue` (+15)
- `apps/admin/src/modules/posts/pages/list.vue` (+15/-3)
- `apps/admin/src/modules/posts/stores/post.store.ts` (+2)

Tidak ada file `apps/api` yang berubah. Cocok dengan klaim Implementer. PASS.

### 2. Typecheck & Build (dijalankan ulang, bukan cuma dipercaya dari verify-report.md)
- `pnpm --filter coderium-admin run typecheck` → PASS, tanpa output error.
- `pnpm --filter coderium-admin run build` → PASS (`vue-tsc -b && vite build`), hanya warning
  chunk size >500kB pada `index-8s64mHNZ.js` (chunk vendor besar, bukan hasil perubahan
  Task 1-3 — nama file/hash chunk sama besarnya dengan pola existing, bukan file baru terkait
  fitur ini).
- Verifikasi tambahan: `grep -rl "Hermes\|View original article" apps/admin/dist/assets/*.js`
  menemukan string tersebut ter-compile ke `edit-DYU3qa5M.js` dan `list-CEI_GdqB.js` — bukti
  konkret kode badge/link masuk ke bundle produksi, bukan cuma ada di source.

### 3. Manual check #1 — badge "Hermes" di list hanya untuk post dengan `sourceUrl` terisi
**Pendekatan:** karena tidak ada akses browser, QA memvalidasi kontrak data yang jadi basis
kondisi `v-if="data.sourceUrl"` di `list.vue`, dengan API + DB nyata (bukan asumsi):
- Set `source_url` + `external_id` test di 1 row `posts` (`vue-component-design-patterns`)
  langsung via `psql` terhadap DB lokal (`postgresql://ganjarhadiatna@localhost:5432/coderium`).
- Jalankan `apps/api` (`pnpm --filter coderium-api run dev`), login sebagai
  `admin@coderium.com` via `POST /api/v1/auth/login`, dapat JWT asli.
- `GET /api/v1/admin/posts` (endpoint yang dipakai `list.vue`) dengan token admin →
  dikonfirmasi response mengembalikan field `sourceUrl` (camelCase, sesuai ekspektasi
  frontend `data.sourceUrl`) hanya berisi nilai truthy untuk row yang di-set, `null` untuk 6
  post lain yang tidak di-set.
- Kode template `list.vue` (`v-if="data.sourceUrl"` pada `<Tag value="Hermes" ...>`) dan
  interface `Post` di `post.store.ts` (`sourceUrl?: string | null`) dibaca ulang baris-per-
  baris — logika kondisional benar dan konsisten dengan bentuk data API yang sudah dibuktikan
  di atas.
- **Kesimpulan:** kontrak data + logika kondisional terbukti benar secara end-to-end
  (DB → API → tipe → kondisi template). Yang TIDAK terverifikasi: rendering visual PrimeVue
  `Tag` sungguhan di browser (murni risiko rendering CSS/komponen library, bukan risiko logic
  ticket ini — `Tag` sudah dipakai di file yang sama untuk kolom Type/Status, pola existing
  yang sudah terbukti bekerja).

### 4. Manual check #2 — link `sourceUrl` di edit.vue klik-able, buka tab baru, hanya muncul
kalau `sourceUrl` ada
**Pendekatan:** sama seperti di atas + baca kode `edit.vue` baris 125-135 dan 300-341:
- `GET /api/v1/admin/posts/vue-component-design-patterns` (endpoint yang dipakai
  `fetchPostBySlug` di `edit.vue` `onMounted`) dikonfirmasi mengembalikan
  `"sourceUrl": "https://example.com/original-article"` untuk post test, dan `sourceUrl: null`
  untuk post lain — membuktikan `sourceUrl.value = post.sourceUrl || null` (baris 335) akan
  ter-set benar sesuai data asli.
- Kode: `<SidebarCard v-if="sourceUrl" ...><a :href="sourceUrl" target="_blank" rel="noopener noreferrer">` —
  atribut `target="_blank"` + `rel="noopener noreferrer"` sudah benar sesuai AC (buka tab baru,
  aman dari `window.opener` leak). `v-if="sourceUrl"` (bukan `v-if="post.sourceUrl"`) memakai
  ref terpisah yang di-set di `onMounted` — konsisten dengan requirement Task 3 di `tasks.md`.
  String di dalam `<a>` ("View original article ↗") lolos ke dist bundle (dibuktikan di poin
  Build di atas).
- **Kesimpulan:** logika + data path terverifikasi benar end-to-end. Yang TIDAK terverifikasi:
  klik fisik di browser sungguhan membuka tab baru (risiko sangat rendah — atribut HTML
  standar `target="_blank"`, bukan logic custom).

### 5. Manual check #3 — submit edit form pada post dengan `sourceUrl` terisi TIDAK
menghapus/nge-null-kan `sourceUrl` (item paling kritis dari 3 manual check)
**Pendekatan:** ini divalidasi PALING ketat — bukan cuma baca kode, tapi replay payload PERSIS
seperti yang dikirim `edit.vue` ke API sungguhan yang jalan di atas DB sungguhan:
- Payload direplikasi identik dengan struktur `payload` di `handleSubmit` (`edit.vue` baris
  348-358) — dikonfirmasi baca kode bahwa `payload` object literal HANYA berisi key: `title`,
  `subtitle`, `content`, `cover`, `tags`, `mediaIds`, `isPublished`, `metaDescription`,
  `metaKeywords`. Tidak ada key `sourceUrl`/`externalId` di manapun.
- Kirim `PUT /api/v1/admin/posts/vue-component-design-patterns` dengan body
  `{"title":"Vue Component Design Patterns (QA edited)","isPublished":false}` (subset payload
  realistis, sengaja tanpa `sourceUrl`) memakai JWT admin asli.
- Response PUT dan re-fetch `GET .../vue-component-design-patterns` SETELAHNYA, DAN query
  langsung ke Postgres (`psql ... SELECT source_url, external_id FROM posts WHERE slug=...`)
  ketiganya KONSISTEN: `source_url` = `https://example.com/original-article`,
  `external_id` = `qa-test-19-ext` — TIDAK berubah/ter-null-kan, hanya `title` yang berubah
  sesuai payload.
- Cross-check backend: `PostsService.update` (`apps/api/src/posts/posts.service.ts:219-246`)
  memakai `data: postData` (spread dari `dto` dikurangi `mediaIds`) — Prisma `update` hanya
  meng-overwrite key yang eksplisit ada di object, field yang tidak dikirim di body tidak
  disentuh sama sekali. Ini bukan hanya asumsi lagi, sudah dibuktikan lewat request nyata di
  atas.
- **Data test dibersihkan** setelah verifikasi: `title`/`source_url`/`external_id` post
  `vue-component-design-patterns` dikembalikan ke state semula (`NULL`/judul asli) via `psql`
  langsung, dikonfirmasi ulang dengan `SELECT`. Tidak ada sisa data test tertinggal di DB.
- **Catatan penting untuk manusia (bukan blocking, tapi perlu awareness):**
  `UpdatePostDto extends PartialType(CreatePostDto)`, dan `CreatePostDto` PUNYA field
  `sourceUrl`/`externalId` opsional (untuk kebutuhan create dari hermes). Artinya
  `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` di `apps/api/src/main.ts`
  TIDAK akan menolak/strip `sourceUrl` kalau field itu SUNGGUH dikirim di body `PUT`
  (karena field itu valid secara DTO, bukan "non-whitelisted"). Proteksi "sourceUrl tidak
  pernah ter-overwrite" murni bergantung pada disiplin frontend (`edit.vue` tidak pernah
  memasukkan `sourceUrl` ke `payload`) — sudah diverifikasi TRUE di commit ini, tapi ini bukan
  proteksi di level backend/DTO. Kalau ke depan ada form/endpoint admin lain yang secara tidak
  sengaja meneruskan seluruh object post (termasuk `sourceUrl`) ke `PUT`, field ini BISA
  ter-overwrite. Di luar scope ticket #19 (yang murni `apps/admin` UI), tapi baik dicatat
  sebagai potential hardening item untuk `apps/api` (mis. `UpdatePostDto` terpisah dari
  `CreatePostDto` yang tidak mewarisi `sourceUrl`/`externalId`, atau `@Exclude` eksplisit di
  update path) — REKOMENDASI, bukan blocker PASS ticket ini.

## Acceptance Criteria — Checklist Akhir
- [x] Interface `Post` punya `sourceUrl?: string | null` (dan `externalId?: string | null`) —
      `post.store.ts` dikonfirmasi.
- [x] Badge "Hermes" di list.vue hanya muncul untuk post `sourceUrl` truthy — dikonfirmasi via
      API real + kode.
- [x] Section read-only link `sourceUrl` di edit.vue, klik-able, buka tab baru, hanya muncul
      kalau ada — dikonfirmasi via API real + kode.
- [x] `sourceUrl` TIDAK dikirim balik ke `PUT /admin/posts/:slug` — dikonfirmasi via replay
      request nyata ke API+DB, data tidak berubah.
- [x] Tidak ada perubahan file di `apps/api` — dikonfirmasi via `git diff --stat`.
- [x] `typecheck` dan `build` lolos — dijalankan ulang oleh QA, PASS.

## CRITICAL
Tidak ada temuan CRITICAL. Semua Acceptance Criteria dan Verify Checklist di `tasks.md`
terpenuhi, termasuk 3 item manual yang sebelumnya ditandai belum dijalankan oleh Implementer —
QA sudah menjalankan verifikasi setara (API + DB nyata, bukan sekadar review kode) dan hasilnya
konsisten dengan klaim Implementer.

## NON-CRITICAL
1. **Rendering visual browser sungguhan belum divalidasi** (klik badge/Tag PrimeVue tampil
   benar secara CSS, link benar-benar membuka tab baru saat diklik manusia). Risiko rendah
   karena memakai atribut HTML standar (`target="_blank"`) dan komponen `Tag` yang sudah
   dipakai di pola existing pada file yang sama. Rekomendasi: 1x smoke-test visual manual oleh
   human sebelum/sesudah merge (bukan blocking, tapi baik dilakukan sebelum deploy production).
2. **Hardening opsional di `apps/api`** (lihat catatan di poin 5 di atas) — `UpdatePostDto`
   secara teknis mengizinkan `sourceUrl`/`externalId` di body PUT (tidak di-strip oleh
   `ValidationPipe`), proteksi saat ini murni karena `edit.vue` tidak pernah mengirim field
   tersebut. Di luar scope ticket #19, disarankan jadi ticket terpisah kalau tim mau proteksi
   di level API juga.
3. Chunk size warning saat build (`index-8s64mHNZ.js`, >500kB) — pre-existing, tidak terkait
   perubahan ticket ini, tidak perlu ditindaklanjuti untuk ticket ini.

## Environment/Data Cleanup
- Proses `apps/api` dev server (`pnpm --filter coderium-api run dev`) yang dijalankan untuk
  keperluan verifikasi QA sudah dihentikan (`kill`), dikonfirmasi endpoint tidak lagi
  merespons setelahnya.
- Data test di Postgres lokal (`source_url`/`external_id`/`title` pada post
  `vue-component-design-patterns`) sudah dikembalikan ke state semula dan dikonfirmasi via
  query ulang.
- `apps/admin/dist/` (hasil `pnpm run build` untuk verifikasi) adalah direktori gitignored
  (`.gitignore:10 → **/dist`), tidak masuk git status, tidak perlu dibersihkan manual.

## File yang Dibaca/Diverifikasi
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/.caf/tasks/19/requirements.md`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/.caf/tasks/19/tasks.md`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/.caf/tasks/19/verify-report.md`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/admin/src/modules/posts/stores/post.store.ts`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/admin/src/modules/posts/pages/list.vue`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/admin/src/modules/posts/pages/edit.vue`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/api/src/posts/posts.service.ts`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/api/src/posts/dto/create-post.dto.ts`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/api/src/posts/dto/update-post.dto.ts`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/api/src/main.ts`
