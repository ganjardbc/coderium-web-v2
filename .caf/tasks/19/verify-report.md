# Verify Report — Ticket #19: Admin UI — tampilkan atribusi sumber draft hermes

## Status: PASS

## Ringkasan Implementasi
Task 1-4 dari `tasks.md` diimplementasikan seluruhnya di `apps/admin`, tidak ada
perubahan di `apps/api`.

### Task 1 — `apps/admin/src/modules/posts/stores/post.store.ts`
- Tambah `sourceUrl?: string | null;` dan `externalId?: string | null;` ke interface `Post`.
- Tidak ditambahkan ke `CreatePostPayload` — field read-only, tidak pernah dikirim dari
  admin UI.

### Task 2 — `apps/admin/src/modules/posts/pages/list.vue`
- Kolom Title (`Column field="title"`) sekarang menampilkan `Tag` PrimeVue
  (`severity="info"`, `icon="pi pi-bolt"`, label `"Hermes"`, `title="Sourced from Hermes"`)
  di samping judul, kondisional `v-if="data.sourceUrl"`.
- Tidak mengubah kolom/struktur `DataTable` lain (Type, Status, Views, Created, Actions).

### Task 3 — `apps/admin/src/modules/posts/pages/edit.vue`
- Tambah `ref` `sourceUrl = ref<string | null>(null)`, di-set dari `post.sourceUrl` di
  `onMounted` setelah `fetchPostBySlug` sukses.
- Tambah `SidebarCard` baru (label "Source", icon `pi-link`) di kolom sidebar, sebelum
  "Cover Image", `v-if="sourceUrl"` — berisi `<a>` link ke `sourceUrl`,
  `target="_blank" rel="noopener noreferrer"`, teks "View original article ↗".
- `form` ref (payload yang dikirim ke `updatePost`) TIDAK menyertakan `sourceUrl` — field
  ini tetap terpisah dari `form`, tidak pernah masuk ke body request `PUT /admin/posts/:slug`.

### Task 4 — Verifikasi tidak menyentuh `apps/api`
- `git status --porcelain` dikonfirmasi hanya menyentuh 3 file di `apps/admin`
  (`pages/edit.vue`, `pages/list.vue`, `stores/post.store.ts`), tidak ada file `apps/api`
  yang berubah.
- Tidak ditemukan regresi di response API — sesuai asumsi Planner, `sourceUrl` sudah
  ter-return apa adanya di `GET /admin/posts` dan `GET /admin/posts/:slug` (tidak perlu
  perubahan backend).

## Verify Checklist

- [x] `pnpm --filter coderium-admin run typecheck` — PASS, tanpa error.
- [x] `pnpm --filter coderium-admin run build` — PASS (`vue-tsc -b && vite build`), tanpa
      error baru. Warning chunk size >500kB adalah warning existing/tidak terkait perubahan
      ini (single large vendor chunk `index-8s64mHNZ.js`, bukan hasil dari perubahan
      Task 1-3).
- [ ] Manual: `/posts` list menampilkan badge hanya untuk post dengan `sourceUrl` terisi —
      **TIDAK dijalankan** (tidak ada akses ke environment browser/dev server berjalan di
      sesi agent ini). Logika kondisional (`v-if="data.sourceUrl"`) sudah diverifikasi via
      code review dan typecheck/build lolos.
- [ ] Manual: halaman edit post menampilkan link `sourceUrl` (kalau ada), klik-able, buka
      tab baru; tidak tampil untuk post tanpa `sourceUrl` — **TIDAK dijalankan** (alasan
      sama seperti di atas), diverifikasi via code review (`v-if="sourceUrl"`, `<a target="_blank" rel="noopener noreferrer">`).
- [ ] Manual: submit edit form pada post dengan `sourceUrl` terisi tidak mengubah/menghapus
      `sourceUrl` — **TIDAK dijalankan** (butuh environment API+DB berjalan). Diverifikasi
      secara statis: `sourceUrl` tidak pernah masuk ke `form` ref atau `payload` di
      `handleSubmit`, sehingga tidak ikut terkirim di body `PUT /admin/posts/:slug`; sesuai
      requirement, Prisma `update` hanya meng-overwrite field yang ada di `dto`/payload.
- [x] Diff final hanya menyentuh file di `apps/admin` — dikonfirmasi via `git status --porcelain`.

## Catatan untuk Reviewer/QA

3 item manual checklist (interaksi browser & submit form end-to-end) tidak bisa dijalankan
di sesi Implementer ini karena tidak ada akses ke dev server browser/DB seeded dengan post
`sourceUrl` terisi. Logikanya sudah diverifikasi lewat code review + typecheck/build lolos.
Rekomendasikan QA/Reviewer agent (atau human) menjalankan 3 manual check ini di environment
dev sebelum merge, khususnya untuk memastikan behavior `PUT /admin/posts/:slug` tidak
meng-overwrite `sourceUrl` jadi `null` (sudah aman by design karena payload tidak
menyertakan field ini, tapi tetap perlu 1x pengecekan manual sesuai instruksi `tasks.md`).

## File yang Diubah
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/admin/src/modules/posts/stores/post.store.ts`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/admin/src/modules/posts/pages/list.vue`
- `/Users/ganjarhadiatna/Projects/coderium-web-v2/apps/admin/src/modules/posts/pages/edit.vue`
