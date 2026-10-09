# Requirements: Pivot Agency di coderium-web-v2

Kebutuhan fungsional, non-fungsional, data, dan batasan. Arah ada di `plan.md`, pekerjaan ada di `tasks.md`.

## Fungsional

**FR-1. CTA email.** CTA produk dan halaman Kerja Sama membuka email ke `hello@coderium.id` lewat tautan `mailto:` dengan subjek terisi (contoh: `mailto:hello@coderium.id?subject=Diskusi%20pilot`), tanpa tab baru. `ctaUrl` menerima URL http(s) atau `mailto:`; URL tidak valid tetap ditolak, termasuk saat publish.

**FR-2. Field produk baru.** Admin dapat mengisi, per produk dan secara opsional:
- `badge`: teks pendek (misalnya "Early access v0.1.9").
- `proof`: `{ metrics: [{ label, value }], note?: string }`.
- `faq`: `[{ question, answer }]`.

**FR-3. Halaman detail produk.** Menampilkan badge, `description`, blok "Hasil dari pemakaian kami sendiri" dari `proof`, FAQ (buka-tutup, aksesibel, dengan JSON-LD FAQPage), dan CTA email. Bagian yang kosong tidak dirender.

**FR-4. Halaman `/kerja-sama` (statis di kode).** Berisi:
- Dua pilot dan harganya, harga perintis, dan retainer.
- Syarat dari klien.
- FAQ singkat.
- CTA email.

**FR-5. Navigasi menu atas.** Header memuat logo, Produk, Kerja Sama, Artikel (`/explore`), Series (`/playlists`), dan tombol pill "Kirim email". Sidebar dihapus, tombol "Write" tidak tampil di header publik. Mobile: menu bisa dilipat. Footer memuat Produk, Kerja Sama, Artikel, Tentang, dan `hello@coderium.id`.

**FR-6. Beranda agency.** Urutan section:
1. Hero: "Tiket jadi pull request. Merge tetap keputusan manusia." dengan tombol "Kirim email untuk diskusi" dan "Lihat produk"; di kanan panel gelap bergaya terminal berlabel "Ilustrasi alur kerja CAF" (plan, implement, verify, pull request, lalu baris kuning "merge: menunggu keputusan Anda").
2. Strip angka (24 / 15 / 11 mnt / ~$10) dengan catatan jujur 7 PR menunggu review dan 2 ditutup.
3. Dua produk dari API `/products`.
4. Cara kerja tiga langkah dengan harga awal dan tautan ke `/kerja-sama`.
5. "Yang belum kami kerjakan" (empat kartu).
6. Blok ajakan email gelap.
7. "Catatan terbaru" (tiga artikel terbaru, tanpa kolom Popular).
8. Footer.

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
- Mockup acuan: kanvas "Mockup Beranda Coderium (Agency)" (desktop 1440 dan mobile 390).

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
- Beranda, `/products`, `/products/:slug`, dan `/kerja-sama` tampil benar di mobile dan dark mode.
- Tombol email membuka klien email dengan subjek terisi di perangkat nyata.
- Dua produk (CAF dan AI Code Reviewer) terpublikasi dengan badge, bukti, FAQ, dan CTA email.
- `backlog.md`, `progress.md`, `requirements.md` (produk), dan `frontend-routes.md` sudah diperbarui.