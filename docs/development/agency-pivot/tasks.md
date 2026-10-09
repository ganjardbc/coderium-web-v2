# Tasks: Pivot Agency di coderium-web-v2

Format mengikuti `docs/development/backlog.md`. Tambahkan ke backlog sebagai **Phase 17 - Agency Pivot (Public Site)**. Arah ada di `plan.md`, kebutuhan di `requirements.md`.

Keterangan: **[CAF]** cocok diserahkan ke pipeline CAF. **[Manual]** dikerjakan sendiri. Kerjakan satu task pada satu waktu, berurutan.

## Ringkasan

| ID | Task | Tipe | Bergantung pada |
|---|---|---|---|
| TASK-0 | Isi CLAUDE.md | Manual + CAF | - |
| AGENCY-001 | Izinkan `mailto:` pada CTA produk | CAF | TASK-0 |
| AGENCY-002 | Tambah `badge`, `proof`, `faq` pada Product | CAF | AGENCY-001 |
| AGENCY-003 | Form admin untuk badge, proof, FAQ | CAF | AGENCY-002 |
| AGENCY-004 | Render badge, description, bukti, FAQ, CTA di detail produk | CAF | AGENCY-002 |
| AGENCY-005 | Halaman `/kerja-sama` | CAF | AGENCY-001 |
| AGENCY-006 | Layout menu atas dan footer | CAF | AGENCY-005 |
| AGENCY-007 | Beranda agency, font Inter, token warna | CAF | AGENCY-004, AGENCY-006 |
| AGENCY-008 | Identitas, SEO, dan About | CAF | - |
| AGENCY-009 | Isi konten produk lewat admin | Manual | AGENCY-003 |
| AGENCY-010 | Perbarui dokumen proyek | Manual + CAF | - |
| AGENCY-011 | QA dan rilis | Manual | semua |

## TASK-0 Isi CLAUDE.md

Status: `DONE`

Details:

```txt
- Isi semua TODO di CLAUDE.md: konvensi kode, konteks bisnis, perintah verifikasi nyata
  dari package.json (root: pnpm typecheck, pnpm lint, pnpm build; catat bahwa apps/api
  tidak punya skrip lint dan test).
- Alasan di depan: CAF membaca CLAUDE.md, jadi mengisinya sebelum AGENCY-001 membuat
  kualitas PR lebih baik.
```

---

## AGENCY-001 [CAF] Izinkan `mailto:` pada CTA produk

Status: `TODO`

Files:

```txt
apps/api/src/products/dto/create-product.dto.ts (dan DTO update)
apps/api/src/products/products.service.ts
apps/api/src/products/products.service.spec.ts
apps/admin/src/modules/products/components/ProductForm.vue
apps/web/pages/products/[slug].vue
```

Details:

```txt
- ctaUrl menerima URL http(s) atau mailto:. Validasi publish (isURL) memakai aturan
  yang sama. URL tidak valid tetap ditolak.
- Hint di ProductForm: contoh mailto:hello@coderium.id?subject=Diskusi%20pilot
- Di web, tautan mailto: tidak memakai target="_blank".
```

Acceptance:

```txt
- Produk dengan ctaUrl mailto:hello@coderium.id?subject=Diskusi%20pilot bisa disimpan dan dipublish
- URL tidak valid tetap ditolak
- Unit test service diperbarui
- typecheck dan build lulus
```

---

## AGENCY-002 [CAF] Tambah field `badge`, `proof`, `faq` pada Product

Status: `TODO`

Files:

```txt
apps/api/prisma/schema.prisma (+ migration)
apps/api/src/products/dto/* (create dan update)
apps/api/src/products/products.service.ts
packages/shared-types
```

Details:

```txt
- badge String?
- proof Json? berbentuk { metrics: [{ label, value }], note?: string }
- faq Json? berbentuk [{ question, answer }]
- Validasi bentuk dan batas panjang di DTO (class-validator).
- Response publik dan admin mengembalikan field baru.
- Migration additive saja, tidak menyentuh tabel lain.
```

Acceptance:

```txt
- Migration berjalan, field tersimpan dan terbaca lewat API admin dan publik
- Tipe ada di shared-types, tidak ada duplikat
- typecheck dan build lulus
```

Catatan: mengubah skema database. Backup dulu, review PR dengan teliti.

---

## AGENCY-003 [CAF] Form admin untuk badge, proof, dan FAQ

Status: `TODO`

Files:

```txt
apps/admin/src/modules/products/components/ProductForm.vue (dan komponen turunan)
```

Details:

```txt
- Input badge, editor daftar metrik (tambah, hapus, urut) plus catatan,
  editor FAQ (tambah, hapus, urut).
- Ikuti pola editor pipelineSteps dan features yang sudah ada.
```

Acceptance:

```txt
- Data tersimpan dan termuat ulang dengan benar saat edit
- Error validasi tampil
- typecheck dan build admin lulus
```

---

## AGENCY-004 [CAF] Render badge, description, bukti, FAQ, dan CTA di detail produk

Status: `TODO`

Files:

```txt
apps/web/pages/products/[slug].vue
apps/web/components/ (komponen kecil baru bila perlu)
```

Details:

```txt
- Badge di dekat judul, description setelah hero.
- Blok "Hasil dari pemakaian kami sendiri" dari proof (metrics + note).
- FAQ buka-tutup, aksesibel (button, aria-expanded), plus JSON-LD FAQPage bila ada.
- CTA penutup memakai ctaUrl (mailto tanpa target="_blank").
- Bagian kosong tidak dirender, tidak ada layout shift.
```

Acceptance:

```txt
- Tampil benar di mobile dan dark mode
- typecheck dan build web lulus
```

---

## AGENCY-005 [CAF] Halaman `/kerja-sama`

Status: `TODO`

Files:

```txt
apps/web/pages/kerja-sama.vue
docs/frontend/frontend-routes.md
```

Details:

```txt
- Konten statis berbahasa Indonesia:
  - Pilot AI Code Review: 4 minggu, 1 repo, Rp13.000.000 (perintis Rp9.100.000)
  - Pilot CAF: 6-8 minggu, 1 repo, Rp19.500.000 (perintis Rp13.650.000),
    Rp2.000.000 di muka untuk fit check minggu 1
  - Harga perintis: diskon 30% dengan izin studi kasus
  - Retainer opsional Rp2.000.000 per bulan (hingga 8 jam kerja)
  - Syarat dari klien: satu penanggung jawab, akses repo dan server, tiket jelas,
    feedback PR maksimal 1 hari kerja, biaya server dan model ditanggung klien
  - FAQ singkat dan CTA email
- Pakai useSeo dan komponen yang sudah ada.
```

Acceptance:

```txt
- Halaman SSR, masuk sitemap, rapi di mobile dan dark mode
- Route tercatat di frontend-routes.md
```

---

## AGENCY-006 [CAF] Layout menu atas dan footer

Status: `TODO`

Files:

```txt
apps/web/layouts/default.vue
```

Details:

```txt
- Ganti sidebar dan bottom nav dengan header menu atas: logo, Produk, Kerja Sama,
  Artikel (/explore), Series (/playlists), tombol pill "Kirim email" (mailto).
- Hapus tombol "Write" dari header publik. Dark mode toggle dipertahankan.
- Mobile: menu bisa dilipat, target sentuh minimal 44px.
- Footer: Produk, Kerja Sama, Artikel, Tentang, hello@coderium.id.
- Perubahan berlaku untuk semua halaman web: uji /explore, /playlists, /posts/:slug.
```

Acceptance:

```txt
- Semua halaman web tetap berfungsi dan rapi di mobile dan dark mode
- typecheck dan build web lulus
```

---

## AGENCY-007 [CAF] Beranda agency, font, dan token warna

Status: `TODO`

Files:

```txt
apps/web/pages/index.vue
apps/web/assets/css/main.css
apps/web/components/ (komponen baru bila perlu)
docs/frontend/design-system.md
```

Details:

```txt
- main.css: muat Inter dan JetBrains Mono (Charter tetap untuk isi artikel).
- @theme: daftarkan warna utama #3730D9 sebagai token. Perbarui design-system.md
  dari #6366F1 ke #3730D9.
- Beranda, urutan section (lihat requirements.md FR-6): hero + panel terminal ilustrasi,
  strip angka, dua produk dari API /products, cara kerja 3 langkah, "Yang belum kami kerjakan",
  blok ajakan email, "Catatan terbaru" (3 artikel, tanpa Popular), footer.
- Hapus "Stay curious". Mobile satu kolom.
- Panel terminal wajib berlabel "Ilustrasi alur kerja CAF".
```

Acceptance:

```txt
- Sesuai mockup (desktop 1440 dan mobile 390), dark mode rapi
- Angka hanya dari bagian Data di requirements.md
- typecheck dan build web lulus
```

---

## AGENCY-008 [CAF] Identitas, SEO, dan About

Status: `TODO`

Files:

```txt
apps/web/nuxt.config.ts
apps/web/composables/useSeo.ts
apps/web/layouts/default.vue (JSON-LD)
apps/web/pages/about.vue
```

Details:

```txt
- Ganti "Tech Blog & Resources" dan deskripsi default dengan identitas AI agency.
- Organization JSON-LD: tambah description dan contactPoint (email).
- Tulis ulang About: apa yang kami buat, cara kerja pilot, kontak email.
```

Acceptance:

```txt
- Tidak ada lagi teks "tech blog" di metadata dan About
- typecheck dan build web lulus
```

---

## AGENCY-009 [Manual] Isi konten produk lewat admin

Status: `TODO`

Details:

```txt
- Buat dua produk: CAF dan AI Code Reviewer.
- Isi: cover, tagline, pipelineSteps, features, badge ("Early access v0.1.9" untuk CAF;
  "Open source · MIT" untuk Reviewer), proof (angka dari bagian Data), faq,
  ctaLabel "Kirim email", ctaUrl mailto.
- Publish keduanya; tandai CAF sebagai featured.
- Angka CAF diambil dari dashboard, bukan dari repo web. Perbarui setelah 7 PR
  yang menunggu review selesai.
```

---

## AGENCY-010 [Manual + CAF] Perbarui dokumen proyek

Status: `TODO`

Details:

```txt
- CLAUDE.md: dikerjakan di TASK-0.
- docs/product/requirements.md: perbarui Product Positioning.
- docs/frontend/frontend-routes.md: tambah /products, /products/:slug, /kerja-sama.
- docs/development/backlog.md dan progress.md: tambah Phase 17 dan status tiap task.
```

---

## AGENCY-011 [Manual] QA dan rilis

Status: `TODO`

Details:

```txt
- pnpm typecheck dan pnpm build untuk semua app.
- Cek mobile dan dark mode di halaman utama dan halaman lama (artikel, series, explore).
- Cek pratinjau OG dan sitemap.
- Backup database, jalankan deploy.sh.
- Uji tombol email di perangkat nyata.
```