# Tasks — Ticket #19: Admin UI — tampilkan atribusi sumber draft hermes

## Ringkasan Urutan Agent
Tidak butuh Architect. Alasan: single app (`apps/admin`), tidak ada perubahan schema/DB/API
kontrak (sudah selesai di ticket #18, diverifikasi ulang di `requirements.md`), murni
penambahan UI kecil (1 field baru ditampilkan di 2 halaman existing) memakai komponen &
pola yang sudah ada di codebase (`Tag`, `SidebarCard`). Tidak ada keputusan desain sistem/
struktur data baru yang perlu didesain — sesuai juga dengan keputusan `flow.md` bahwa UX
Designer Agent tidak diperlukan.

Urutan agent: **Implementer → Verifier (Verify Checklist manual, lihat bawah) → selesai.**
Kalau Implementer menilai perlu Code Reviewer/QA agent tambahan sesuai pipeline caf standar
di luar dokumen ini, itu keputusan orchestrator, bukan bagian breakdown Planner di sini.

## Task 1 — Update tipe `Post` di store
**File:** `apps/admin/src/modules/posts/stores/post.store.ts`

- Tambah field ke interface `Post`:
  ```ts
  sourceUrl?: string | null;
  externalId?: string | null; // opsional, lihat Celah & Ambiguitas #2 di requirements.md
  ```
- TIDAK menambah field ini ke `CreatePostPayload` — field ini tidak pernah dikirim dari admin
  UI (read-only, diisi hermes lewat `POST /admin/posts` langsung, bukan lewat form admin).
- Tidak ada perubahan lain di store ini — `fetchPosts`/`fetchPostBySlug` sudah otomatis
  membawa field baru karena API sudah mengembalikannya (lihat verifikasi di
  `requirements.md`).

**Acceptance:** `Post` interface punya `sourceUrl` (dan opsional `externalId`), tidak ada
error TypeScript baru dari perubahan ini sendiri.

## Task 2 — Badge/penanda di halaman list
**File:** `apps/admin/src/modules/posts/pages/list.vue`

- Di kolom `Title` (baris 29-35, template `#body`), tambahkan penanda visual kecil kalau
  `data.sourceUrl` truthy — rekomendasi: `Tag` PrimeVue (sudah diimport di file ini, baris
  106) dengan `severity="info"`, label singkat (mis. `"Hermes"`) atau ikon, ditaruh di bawah
  atau di samping judul post (bukan kolom baru — supaya tabel tidak makin sempit; lihat
  Celah & Ambiguitas #3 di `requirements.md` untuk keleluasaan Implementer soal styling
  persis).
- Kondisional: `v-if="data.sourceUrl"` — post tanpa `sourceUrl` (draft manual) tidak
  menampilkan apapun tambahan di sini, tampilan tetap sama seperti sekarang.
- Tidak mengubah kolom/struktur `DataTable` yang lain (`Type`, `Status`, `Views`, `Created`,
  `Actions`) — scope ini murni nambah 1 elemen visual di kolom Title yang sudah ada.

**Acceptance:** buka `/posts`, post yang punya `sourceUrl` (bisa dicek manual lewat query
DB atau bikin post uji dengan `sourceUrl` terisi via API/DB) menampilkan badge; post lain
tidak berubah tampilannya sama sekali dibanding sebelum perubahan.

## Task 3 — Read-only display `sourceUrl` di halaman edit
**File:** `apps/admin/src/modules/posts/pages/edit.vue`

- Tambah `SidebarCard` baru (pola komponen lokal yang sudah ada di file ini, baris 220-232,
  `label`+`icon` props) di kolom sidebar (baris 109-180), berisi link `sourceUrl`:
  `<a :href="post.sourceUrl" target="_blank" rel="noopener noreferrer">{{ post.sourceUrl }}</a>`
  (atau label lebih ringkas seperti "View original article ↗" — teks bebas, yang wajib
  cuma link-nya valid dan buka tab baru).
- Section ini HARUS `v-if` berdasarkan ada-tidaknya `sourceUrl` yang di-fetch (simpan di
  `ref` terpisah, mis. `sourceUrl = ref<string | null>(null)`, di-set dari
  `post.sourceUrl` saat `onMounted` fetch sukses, baris 287-326) — TIDAK ditampilkan sama
  sekali kalau `null`/kosong (bukan tampil dash/placeholder kosong).
- TIDAK menambah `sourceUrl` ke `form` ref (baris 247-258) — field ini read-only, bukan
  bagian dari `form` yang dikirim ke `handleSubmit`/`updatePost` (baris 328-352). Pastikan
  `payload` yang dikirim ke `postsStore.updatePost(slug, payload)` tetap tidak menyertakan
  `sourceUrl` (sudah otomatis begitu kalau tidak ditambahkan ke `form`, tapi tulis eksplisit
  sebagai reminder ke implementer — cek ulang saat implement).

**Acceptance:** buka halaman edit post yang punya `sourceUrl` terisi, muncul section baru
berisi link yang bisa diklik dan membuka URL sumber di tab baru; buka halaman edit post
tanpa `sourceUrl`, section ini tidak muncul sama sekali; submit form update tetap berhasil
dan tidak mengirim `sourceUrl` di body request (bisa dicek lewat Network tab browser).

## Task 4 — Verifikasi tidak menyentuh `apps/api`
- Pastikan diff akhir 100% terbatas ke folder `apps/admin` (Task 1-3 di atas). Kalau saat
  implementasi ternyata ditemukan field `sourceUrl` TIDAK ikut kebawa di response API
  (kontradiksi dengan verifikasi Planner di `requirements.md`), STOP — itu tanda regresi di
  ticket #18 atau kesalahan verifikasi Planner, laporkan sebagai blocking issue, jangan
  menambah perubahan di `apps/api` sendiri tanpa breakdown ticket terpisah.

## Verify Checklist (jalankan sebelum mengaku selesai)
- [ ] `pnpm --filter coderium-admin run typecheck` — lolos tanpa error baru.
- [ ] `pnpm --filter coderium-admin run build` — lolos tanpa error baru.
- [ ] Manual: `/posts` list menampilkan badge hanya untuk post dengan `sourceUrl` terisi.
- [ ] Manual: halaman edit post menampilkan link `sourceUrl` (kalau ada) yang klik-able dan
      buka tab baru; tidak menampilkan section ini untuk post tanpa `sourceUrl`.
- [ ] Manual: submit edit form pada post dengan `sourceUrl` terisi tidak mengubah/menghapus
      `sourceUrl` post tersebut (field tidak ikut ter-overwrite jadi `null` akibat tidak
      dikirim di payload — cek behavior `PostsService.update` di `apps/api`: `data: postData`
      hanya berisi field yang ada di `dto`, jadi field yang tidak dikirim TIDAK di-overwrite;
      ini sudah aman by design Prisma `update`, tapi tetap perlu dicek manual sekali).
- [ ] Diff final hanya menyentuh file di `apps/admin` (lihat Task 4).

## Retry Logic
Verify gagal → perbaiki, coba lagi max 3x → kalau masih gagal, stop dan tulis
`verify-report.md` dengan `Status: NEEDS_HUMAN` di `.caf/tasks/19/`.
