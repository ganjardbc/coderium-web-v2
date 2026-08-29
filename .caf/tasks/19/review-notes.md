# Review Notes — Ticket #19: Admin UI — tampilkan atribusi sumber draft hermes

## Keputusan: APPROVE

## Ringkasan
Diff branch `ai-agent/19` vs `main` (1 commit lokal, `08fc8fa`, belum push) menyentuh
3 file kode di `apps/admin`:
- `apps/admin/src/modules/posts/stores/post.store.ts` (+2)
- `apps/admin/src/modules/posts/pages/list.vue` (+12/-3)
- `apps/admin/src/modules/posts/pages/edit.vue` (+15)

Scope sesuai `requirements.md`/`tasks.md`: murni frontend, tidak ada perubahan `apps/api`.
`verify-report.md` (Implementer) berstatus PASS dengan 3 item manual checklist yang tidak
dijalankan karena keterbatasan sandbox; `qa-report.md` (QA) berstatus PASS dan sudah
memvalidasi ulang ketiga item manual tersebut end-to-end memakai API + Postgres nyata
(termasuk item paling kritis: replay `PUT /admin/posts/:slug` membuktikan `sourceUrl`/
`externalId` tidak berubah di DB). Saya tidak mengulang eksekusi end-to-end tsb (sudah
dibuktikan QA dengan bukti konkret di `qa-report.md`), fokus review ini pada kualitas kode,
konsistensi pola, dan verifikasi statis atas klaim tersebut.

## Temuan

### 1. Konsistensi pola existing — OK
- `Tag` di `list.vue` (badge "Hermes") memakai props yang sama persis dengan `Tag` existing
  di kolom Type/Status pada file yang sama (`severity`, `icon`, `value`) — bukan komponen
  baru, pola sudah terbukti dipakai di file ini.
- `SidebarCard` di `edit.vue` (section "Source") memakai komponen lokal yang sama
  (`defineComponent` dengan `h()`, didefinisikan sekali di top-level `<script setup>`)
  seperti section "Post Type"/"Cover Image"/"Tags"/"Settings" lainnya — props `label`+`icon`
  konsisten, tidak ada pola baru yang diperkenalkan.
- Penempatan section "Source" tepat setelah "Post Type" dan sebelum "Cover Image" — masuk
  akal secara urutan informasi (atribusi sebelum konten editable), tidak mengganggu layout
  sidebar `lg:col-span` yang sudah ada.

### 2. Risiko "sourceUrl tidak terkirim balik saat update" — dikonfirmasi ganda, level tipe
Selain klaim di `verify-report.md`/`qa-report.md` (payload literal di `handleSubmit` tidak
menyertakan `sourceUrl`, dibuktikan QA lewat replay request nyata ke API+DB), saya membaca
`post.store.ts` dan menemukan proteksi tambahan di level TypeScript yang tidak disebutkan
eksplisit di kedua report:
```ts
export interface CreatePostPayload {
  title: string; type: string; subtitle?: string; content?: string; tags?: string[];
  cover?: string; metaDescription?: string; metaKeywords?: string; isPublished?: boolean;
  mediaIds?: string[];
}
async function updatePost(slug: string, payload: Partial<CreatePostPayload>) { ... }
```
`sourceUrl`/`externalId` sengaja TIDAK ditambahkan ke `CreatePostPayload`, dan `updatePost`
mengetik parameternya sebagai `Partial<CreatePostPayload>` — artinya kalau ada developer di
masa depan iseng menambahkan `sourceUrl: post.sourceUrl` ke `payload` di `edit.vue`,
`vue-tsc`/typecheck akan GAGAL (excess property / type mismatch), bukan cuma lolos review
manual. Ini proteksi struktural yang lebih kuat daripada sekadar "disiplin di `edit.vue`"
seperti yang disebut di `qa-report.md` — baik dicatat sebagai mitigasi tambahan atas
NON-CRITICAL #2 di `qa-report.md` (soal `UpdatePostDto` backend yang secara teknis
mengizinkan field ini). Risiko keseluruhan tetap rendah dan bukan blocker.

### 3. UX kecil — OK
- `target="_blank"` dikombinasikan dengan `rel="noopener noreferrer"` sudah benar (mencegah
  `window.opener` leak dan referrer leak) di `edit.vue:127-134`.
- Badge "Hermes" di `list.vue` dibungkus `<div class="flex items-center gap-2">` bersama
  `router-link` judul — tidak mengubah lebar kolom (`class="min-w-48"` di `<Column>` tidak
  disentuh) dan tidak mempengaruhi kolom lain (Type/Status/Views/Created/Actions). Untuk
  post tanpa `sourceUrl` (`v-if="data.sourceUrl"` false), DOM badge tidak dirender sama
  sekali (bukan `v-show`), jadi tidak ada elemen kosong yang mengganggu spacing.
- Section "Source" di `edit.vue` juga `v-if` (bukan `v-show`) — untuk post tanpa `sourceUrl`,
  `SidebarCard` ini tidak masuk DOM sama sekali, sidebar langsung lanjut ke "Cover Image".
  Konsisten dengan requirement "section ini tidak tampil sama sekali kalau sourceUrl kosong,
  bukan tampil dash/placeholder kosong" (disebut di `docs/development/backlog.md` yang di-draft
  Implementer).
- `break-all` di kelas `<a>` link mengantisipasi URL sumber panjang agar tidak overflow
  sidebar sempit — detail kecil tapi tepat.

### 4. Hal yang saya cek tapi tidak jadi temuan
- Tidak ada penambahan dependency baru, tidak ada perubahan `package.json`.
- Tidak ada perubahan struktur route atau props publik `MediaUploader`/`RichTextEditor`.
- Interface `Post` field baru (`sourceUrl?: string | null`, `externalId?: string | null`)
  konsisten dengan pola optional lain di interface yang sama (`subtitle?: string | null`,
  dst) — tidak ada inkonsistensi tipe.
- `externalId` ditambahkan ke interface `Post` tapi TIDAK dipakai di UI mana pun (tidak ada
  render/consume) — sesuai `requirements.md` (field ini murni untuk dedup backend, bukan
  untuk ditampilkan), jadi bukan dead code yang salah, tapi worth dicatat: kalau memang tidak
  pernah dipakai di `apps/admin`, boleh dipertimbangkan tidak usah ditambahkan ke interface
  `Post` sama sekali (YAGNI) — NON-BLOCKING, hanya observasi kecil, karena scope requirement
  eksplisit menyebut kedua field.

### 5. Catatan proses (bukan soal kode, tapi relevan untuk agent berikutnya)
- `git status` menunjukkan 5 file dokumentasi (`README.md`, `docs/api/api-contract.md`,
  `docs/architecture/module-breakdown.md`, `docs/development/backlog.md`,
  `docs/development/progress.md`) berstatus **modified tapi BELUM di-commit** ke branch
  `ai-agent/19` (working tree, bukan bagian commit `08fc8fa`). Isi update dokumentasi ini
  sudah saya baca dan konsisten secara faktual dengan implementasi (tidak ada klaim yang
  salah/menyesatkan — mis. benar bahwa tidak ada perubahan `apps/api`, benar soal `v-if`
  bukan placeholder kosong). Juga `.caf/tasks/19/requirements.md`, `tasks.md`,
  `qa-report.md` masih berstatus untracked (`??`). Ini bukan masalah kualitas kode dan
  tidak menghalangi APPROVE, tapi perlu di-commit oleh agent/proses berikutnya sebelum
  dianggap "selesai" secara git history — main thread yang menentukan apakah ini digabung
  ke commit yang sama atau commit terpisah.

## Kesimpulan
Tidak ada temuan CRITICAL atau yang menghalangi merge. Kode konsisten dengan pola existing
(`Tag`, `SidebarCard`), risiko utama (field read-only ini tidak boleh ter-overwrite saat
update) sudah dimitigasi di level UI/logic DAN level tipe TypeScript, sudah divalidasi
end-to-end oleh QA dengan API+DB nyata. UX kecil (layout, `rel="noopener noreferrer"`,
kondisional render) sudah benar. Satu catatan non-blocking soal proses commit dokumentasi
yang belum di-stage (lihat poin 5) — perlu ditindaklanjuti main thread sebelum push/PR,
bukan alasan untuk REQUEST_CHANGES pada kode.

## File yang Dibaca/Diverifikasi
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/.caf/tasks/19/requirements.md`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/.caf/tasks/19/tasks.md`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/.caf/tasks/19/verify-report.md`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/.caf/tasks/19/qa-report.md`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/admin/src/modules/posts/stores/post.store.ts`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/admin/src/modules/posts/pages/list.vue`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/admin/src/modules/posts/pages/edit.vue`
- `git diff main...ai-agent/19` (full diff, 3 file kode)
- `git diff main -- docs/... README.md` (uncommitted working tree docs changes)
- `git log --oneline main..ai-agent/19` (1 commit: `08fc8fa`)
