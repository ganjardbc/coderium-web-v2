# Plan: Pivot Agency di coderium-web-v2

Dokumen ini menjelaskan arah dan urutan kerja. Detail kebutuhan ada di `requirements.md`, daftar pekerjaan ada di `tasks.md`.

## Tujuan

Mengubah coderium.id dari blog menjadi situs AI agency untuk tim developer. Dua produk: **CAF (Coderium Agent Framework)** dan **AI Code Reviewer**. Kontak hanya lewat email `coderium.id@gmail.com`. Artikel tetap ada sebagai pelengkap.

## Temuan di repo

**Sudah ada dan bisa dipakai**
- Katalog produk lengkap dari ujung ke ujung: model `Product` (name, tagline, description, cover, pipelineSteps, features, ctaLabel, ctaUrl, featured, order, status), API publik `/products`, admin CRUD dengan publish/unpublish, halaman web `/products` dan `/products/:slug`.
- Halaman detail produk sudah punya hero, "How it works", Features, bagian "Bukti" (playlist dan artikel terkait), dan CTA penutup.
- Beranda punya slot produk unggulan (`FeaturedProductCard`). Sitemap otomatis mengambil slug produk.
- Alamat `coderium.id@gmail.com` sudah ada di halaman About.

**Celah**
- **Blocker:** `ctaUrl` divalidasi `@IsUrl()` dan `isURL()` saat publish, sehingga `mailto:` ditolak.
- Beranda masih blog ("Stay curious"), navigasi berupa sidebar blog, tidak ada halaman Kerja Sama dan harga.
- Model produk belum punya tempat untuk badge status, angka bukti, dan FAQ. Kolom `description` ada tetapi tidak ditampilkan.
- Identitas lama tersebar: "Tech Blog & Resources" di `nuxt.config.ts`, deskripsi default di `useSeo.ts`, halaman About, JSON-LD Organization, dan Product Positioning di `docs/product/requirements.md`.
- Font Inter belum dimuat (`main.css` hanya mengimpor Charter), sehingga UI memakai font bawaan sistem. Warna utama di `design-system.md` (`#6366F1`) belum sama dengan mockup (`#3730D9`).
- `CLAUDE.md` masih draf hasil `caf-initiator` penuh TODO. CAF membacanya saat mengerjakan tiket di repo ini.

## Keputusan yang sudah final

| Hal | Keputusan |
|---|---|
| Bahasa halaman baru | Indonesia penuh |
| Rute halaman baru | `/work-with-us` |
| Navigasi | Menu atas: logo, Produk, Kerja Sama, Artikel, Series, tombol "Kirim email". Sidebar dihapus. Tombol "Write" dihapus dari header publik |
| Kontak | Hanya email `coderium.id@gmail.com`, tautan `mailto:` dengan subjek terisi |
| Harga | Tampil terbuka di `/work-with-us` |
| Warna utama | Indigo `#3730D9` (token `@theme` Tailwind) |
| Font | Inter (UI) dan JetBrains Mono (terminal/kode), Charter tetap untuk isi artikel |
| Konten produk | Diisi lewat admin, bukan di-hardcode |
| Arah beranda | Opsi B (editorial agency): hero "Coderium. AI Agency.", dua produk unggulan, paket dan harga, tabel perbandingan, FAQ. Acuan struktur: theaiagency.id dan template AI agents themehunk |

## Prinsip

1. Pakai yang sudah ada dulu. Tulis kode hanya untuk celah.
2. Satu task kecil pada satu waktu, mengikuti `docs/development/backlog.md` (aturan AGENTS.md).
3. Perubahan skema hanya additive.
4. Klaim di situs hanya angka yang bisa dilacak ke dashboard CAF, dan diisi lewat admin agar bisa diperbarui tanpa deploy.

## Fase

**Fase A, fondasi (hari 1-2).** Isi CLAUDE.md, buka blocker CTA email, tambah field badge/proof/faq pada Product, perbarui admin dan halaman detail produk.

**Fase B, halaman baru (hari 3-5).** Halaman Kerja Sama, layout menu atas dan footer, beranda agency.

**Fase C, identitas dan peluncuran (hari 5-7).** SEO dan metadata, About, dokumen proyek, isi konten produk lewat admin, QA, deploy.

## Urutan kerja

1. Task 0 (CLAUDE.md), supaya CAF punya konteks sebelum mengerjakan tiket.
2. AGENCY-001, lalu AGENCY-002, lalu AGENCY-003 dan AGENCY-004.
3. AGENCY-005, AGENCY-006, AGENCY-007, AGENCY-008.
4. AGENCY-009, AGENCY-010 (sisa), AGENCY-011.

Dengan kapasitas sekitar 10 jam per minggu dan satu pilot aktif, berurutan lebih aman daripada paralel.

## Risiko

- **AGENCY-002 mengubah skema database produksi.** Walau additive, backup dulu dan review PR-nya dengan teliti sebelum merge.
- **AGENCY-006 mengubah layout semua halaman web** (sidebar menjadi menu atas). Uji halaman artikel, series, dan explore setelahnya.
- Angka bukti harus diperbarui setelah 7 PR yang menunggu review selesai.

## Bahan konten

Setiap tiket CAF yang selesai menjadi bahan konten ("AI mengerjakan situs agency-nya sendiri") dan data tambahan untuk bagian bukti.