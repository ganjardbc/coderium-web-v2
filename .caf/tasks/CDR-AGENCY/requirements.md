# Requirements: Pivot Agency di coderium-web-v2

Kebutuhan fungsional, non-fungsional, data, dan batasan. Arah ada di `plan.md`, pekerjaan ada di `tasks.md`.

## Fungsional

**FR-1. CTA email.** CTA produk dan halaman Kerja Sama membuka email ke `coderium.id@gmail.com` lewat tautan `mailto:` dengan subjek terisi (contoh: `mailto:coderium.id@gmail.com?subject=Diskusi%20pilot`), tanpa tab baru. `ctaUrl` menerima URL http(s) atau `mailto:`; URL tidak valid tetap ditolak, termasuk saat publish.

**FR-2. Field produk baru.** Admin dapat mengisi, per produk dan secara opsional:
- `badge`: teks pendek (misalnya "Early access v0.1.9").
- `proof`: `{ metrics: [{ label, value }], note?: string }`.
- `faq`: `[{ question, answer }]`.

**FR-3. Halaman detail produk.** Menampilkan badge, `description`, blok "Hasil dari pemakaian kami sendiri" dari `proof`, FAQ (buka-tutup, aksesibel, dengan JSON-LD FAQPage), dan CTA email. Bagian yang kosong tidak dirender.

**FR-4. Halaman `/work-with-us` (statis di kode).** Berisi:
- Dua pilot dan harganya, harga perintis, dan retainer.
- Syarat dari klien.
- FAQ singkat.
- CTA email.

**FR-5. Navigasi menu atas.** Header memuat logo, Produk, Kerja Sama, Artikel (`/articles`), Series (`/playlists`), dan tombol pill "Kirim email". Sidebar dihapus, tombol "Write" tidak tampil di header publik. Mobile: menu bisa dilipat. Footer memuat Produk, Kerja Sama, Artikel, Tentang, dan `coderium.id@gmail.com`.

**FR-6. Beranda agency (mockup Opsi B, editorial agency).** Urutan section:
1. Hero tipografi besar: "Coderium. AI Agency." dengan subjudul yang menyebut CAF dan AI Code Reviewer dan bahwa tool dipasang di server klien; tombol "Kirim email" dan "Lihat layanan". Di bawahnya strip tiga janji (berjalan di server Anda, merge tetap keputusan manusia, pilot berharga tetap).
2. Strip "Terhubung dengan": Linear, GitHub Issues, GitHub, GitLab, Claude Code, dengan catatan Jira dan GitLab untuk CAF segera.
3. 01 Apa itu Coderium: satu paragraf definisi.
4. 02 Dua produk unggulan sebagai dua panel besar berdampingan (CAF gelap dengan tiga angka dari dashboard; AI Code Reviewer terang). Catatan kaki jujur: 7 PR menunggu review, 2 ditutup (tiket keamanan).
5. 03 Diskusi, pilot, laporan: tiga langkah bernomor besar dengan harga awal.
6. 04 Tabel perbandingan "Pasang sendiri" vs "Pilot bersama Coderium" (pemasangan, penyesuaian, ukuran keberhasilan, kendala operasional, biaya).
7. 05 Paket: tiga kartu harga (Pilot AI Code Review Rp13 juta, Pilot CAF Rp19,5 juta, Retainer Rp2 juta per bulan), masing-masing dengan harga perintis dan tombol email; catatan biaya server dan model ditanggung klien.
8. 06 Tentang: "Agency awal. Pendirinya yang membangun." (jujur bahwa belum ada klien; harga perintis).
9. 07 FAQ enam pertanyaan (dua kolom).
10. 08 Catatan terbaru: tiga kartu artikel dengan gambar, tanggal, judul (dari API artikel).
11. 09 Kontak: blok gelap besar "Ceritakan apa yang ingin Anda kerjakan." dengan tombol coderium.id@gmail.com.
12. Footer gelap berkolom: Layanan, Perusahaan, Kontak.

Tidak dipakai (sengaja): statistik generik tanpa sumber, newsletter, CTA "coba gratis", dan testimoni. Mobile: satu kolom, kartu harga dan panel produk bertumpuk.

**FR-7. Identitas.** Metadata default, JSON-LD Organization (dengan `description` dan `contactPoint`), halaman About, dan footer mencerminkan identitas AI agency. Tidak ada lagi teks "tech blog" di metadata dan About.

## Non-fungsional

- **NFR-1.** Perubahan skema bersifat additive; migration tidak menyentuh tabel lain.
- **NFR-2.** Mengikuti aturan repo: typecheck dan build lulus, tidak ada tipe duplikat (pakai `shared-types`), tidak ada logika bisnis di controller, tidak ada `any` tanpa alasan.
- **NFR-3.** Halaman baru dirender SSR, masuk sitemap, rapi di mobile (satu kolom) dan dark mode.
- **NFR-4.** Teks kontras: teks biasa minimal 4,5:1. Elemen interaktif minimal 44px tingginya di mobile.
- **NFR-5.** Klaim hanya angka yang tercatat di bagian Data. Angka bukti diisi lewat admin.

## Desain

- Warna utama indigo `#3730D9`, didaftarkan sebagai token `@theme` Tailwind. `docs/frontend/design-system.md` diperbarui dari `#6366F1`.
- Font: Inter (UI), JetBrains Mono (terminal dan kode), Charter tetap untuk isi artikel. Muat Inter dan JetBrains Mono di `main.css`.
- Gradien logo (biru ke ungu) hanya pada logo. Hijau/kuning terminal hanya di panel hero.
- Mockup acuan: kanvas "Mockup Beranda Coderium (Agency)", **Opsi B (editorial agency, desktop 1440)**. Opsi A dan versi mobile opsi A ada di kanvas yang sama hanya sebagai pembanding visual untuk mobile.

## Data yang boleh dipakai

Dari dashboard CAF, pemakaian internal pada dua repo:

| Ukuran | Nilai |
|---|---|
| Tiket dikerjakan | 24 |
| PR di-merge | 15 |
| PR menunggu review | 7 |
| PR ditutup | 2 (keduanya tiket keamanan) |
| Median pemrosesan | 11 menit |
| Biaya model | sekitar $10 per tiket (total $256,48 untuk 25 run) |
| Run yang butuh perhatian | 5 (3 selesai dengan perbaikan manual) |
| Insiden infrastruktur | worker sempat tertahan dan kuota model habis; 6 run memakan waktu berjam-jam |

Harga:

| Paket | Harga |
|---|---|
| Pilot AI Code Review (4 minggu, 1 repo) | Rp13.000.000 (perintis Rp9.100.000) |
| Pilot CAF (6-8 minggu, 1 repo) | Rp19.500.000 (perintis Rp13.650.000); Rp2.000.000 di muka untuk fit check minggu 1 |
| Retainer opsional | Rp2.000.000 per bulan, hingga 8 jam kerja |

## Di luar lingkup situs

Tiket keamanan dan hak akses, merge otomatis, Jira dan GitLab untuk CAF (di rencana, belum tersedia), tiket besar lintas sistem, SLA dukungan. Selain itu: form kontak dan penyimpanan lead, pembayaran, CMS blog baru, multi-bahasa (i18n), akun klien.

## Kriteria selesai (seluruh pivot)

- `pnpm typecheck` dan `pnpm build` lulus untuk web, api, dan admin.
- Beranda, `/products`, `/products/:slug`, dan `/work-with-us` tampil benar di mobile dan dark mode.
- Tombol email membuka klien email dengan subjek terisi di perangkat nyata.
- Dua produk (CAF dan AI Code Reviewer) terpublikasi dengan badge, bukti, FAQ, dan CTA email.
- `backlog.md`, `progress.md`, `requirements.md` (produk), dan `frontend-routes.md` sudah diperbarui.