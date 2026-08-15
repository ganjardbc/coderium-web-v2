# PRD: Update Components in apps/admin using PrimeVue

## Problem

`apps/admin` sudah punya dependency PrimeVue terpasang (`primevue@4.3.7`,
`@primeuix/themes`, `@primevue/forms`, `primeicons`, `tailwindcss-primeui`) dan
sudah dipakai untuk sebagian kecil UI global (`Toast`, `ConfirmDialog` di
`AdminLayout.vue`, form components lewat `@primevue/forms`). Tapi sebagian besar
UI shell dan komponen interaktif lain di admin masih di-hand-roll dengan HTML
mentah + Tailwind + inline SVG, bukan komponen PrimeVue — contoh nyata di
`apps/admin/src/layouts/AdminLayout.vue`:

- Sidebar navigation, breadcrumb, tombol dark-mode toggle, tombol logout, avatar
  user, dan semua icon ditulis manual dengan `<svg>` + class Tailwind, padahal
  PrimeVue punya `Menu`/`PanelMenu`, `Breadcrumb`, `Button`, `Avatar`, dan
  `primeicons` yang bisa dipakai langsung.
- State aktif menu (`isMenuItemActive`), submenu expand/collapse, dan handling
  mobile sidebar semuanya di-reimplement manual dengan `ref`/`computed`
  ketimbang pakai komponen navigasi PrimeVue yang sudah handle itu.

Akibatnya ada dua pola UI berjalan bersamaan di codebase yang sama (custom
hand-rolled vs PrimeVue), yang berdampak:

1. **Inkonsistensi visual & interaksi** — style, spacing, focus state, dan
   aksesibilitas (keyboard nav, aria) beda-beda tergantung komponen mana yang
   custom vs PrimeVue.
2. **Biaya maintenance ganda** — bug fix (mis. dark mode, responsive behavior)
   harus ditangani dua kali: sekali di implementasi custom, sekali (nanti) di
   implementasi PrimeVue kalau makin banyak halaman baru pakai PrimeVue.
3. **Onboarding lebih lambat** — kontributor baru harus paham dua konvensi:
   kapan pakai komponen custom Tailwind vs kapan pakai PrimeVue, tanpa panduan
   jelas.

Problem ini bukan "belum punya PrimeVue" (sudah ada dan dipakai sebagian),
melainkan **implementasi UI di `apps/admin` belum konsisten**: PrimeVue baru
dipakai untuk global feedback (toast/dialog) dan form, sementara struktur
layout inti (nav, breadcrumb, avatar, tombol aksi) masih custom.

## Target User

Internal team Coderium yang mengelola konten lewat `apps/admin`:
- **Admin/editor internal** (pengguna akhir aplikasi admin) — merasakan
  langsung inkonsistensi visual/interaksi di navigasi, breadcrumb, tombol.
- **Developer frontend internal** (tim yang mengerjakan `apps/admin`) — pihak
  yang menanggung beban maintenance ganda dan kebingungan konvensi saat
  menambah fitur baru di admin.

TODO (project-specific, perlu konfirmasi manusia): apakah ada rencana
menambah role admin baru (mis. multi-tenant admin) yang perlu dipertimbangkan
saat mendesain ulang navigasi/komponen.

## Success Metric

- 100% komponen navigasi utama (`Sidebar`/menu, breadcrumb, tombol aksi utama,
  avatar user) di `AdminLayout.vue` memakai komponen PrimeVue (bukan
  hand-rolled HTML/SVG), diverifikasi lewat code review pasca-migrasi.
- Tidak ada regresi fungsional pada alur yang ada saat ini: active-state menu,
  submenu expand pada route settings, mobile sidebar toggle, dark mode toggle,
  logout confirm — semua tetap berfungsi identik secara behavior setelah
  migrasi (diverifikasi manual QA / smoke test, karena `apps/admin` belum
  punya automated UI test yang terkonfirmasi di CLAUDE.md).
- Nol penambahan dependency UI library baru selain PrimeVue yang sudah
  terpasang (menghindari fragmentasi lebih lanjut).

TODO (project-specific): metrik kuantitatif tambahan (mis. jumlah baris kode
custom SVG yang dihapus, waktu onboarding developer baru) bisa ditambahkan
kalau tim produk mau tracking lebih formal — belum ada baseline data untuk itu
saat ini.

## Scope

- Migrasi komponen UI di `apps/admin/src/layouts/AdminLayout.vue`
  (sidebar/nav, breadcrumb, tombol dark-mode toggle, tombol logout, avatar
  user, mobile menu trigger) dari HTML/SVG custom ke komponen PrimeVue yang
  setara (`Menu`/`PanelMenu`/`Menubar`, `Breadcrumb`, `Button`, `Avatar`,
  `primeicons`).
- Audit halaman/komponen lain di `apps/admin/src` yang masih pakai UI
  hand-rolled serupa (di luar layout) untuk didaftarkan sebagai kandidat
  migrasi lanjutan — TODO: daftar konkret perlu inventarisasi lebih lanjut,
  belum di-scan penuh di discovery ini.
- Menjaga behavior existing (active state, submenu, responsive, dark mode,
  logout confirm) tetap sama dari sisi user.

## Out-of-Scope

- Migrasi `apps/web` (Nuxt) atau `apps/admin`'s halaman konten
  (posts/playlists/media/users) — discovery ini hanya soal shell layout
  (`AdminLayout.vue`) dan navigasi utamanya. Halaman lain didaftarkan sebagai
  kandidat lanjutan (lihat Scope), bukan dikerjakan di iterasi ini.
- Perubahan desain visual/branding baru (warna, logo, tone) — migrasi ini
  soal penggantian implementasi komponen, bukan redesign.
- Penggantian library styling (Tailwind tetap dipakai bersama
  `tailwindcss-primeui`), tidak ada rencana lepas Tailwind.
- Penambahan fitur navigasi baru (menu/role baru) — di luar scope migrasi
  teknis ini kecuali ditentukan lain oleh PM/stakeholder.
- Upgrade versi PrimeVue itu sendiri — asumsi tetap di `^4.3.7` yang sudah
  terpasang, kecuali ada blocker kompatibilitas yang ditemukan saat
  implementasi (dilaporkan lewat ticket terpisah).

## Dependency

- PrimeVue, `@primeuix/themes`, `primeicons`, `tailwindcss-primeui` sudah
  terpasang di `apps/admin/package.json` — tidak perlu instalasi baru untuk
  komponen dasar (Button, Avatar, Menu, Breadcrumb, dsb ada di paket
  `primevue` yang sama).
- Tidak ada ketergantungan ke `apps/api` (NestJS) atau `apps/web` (Nuxt) —
  murni perubahan di layer presentasi `apps/admin`.
- Bergantung pada keputusan desain interaksi (lihat `flow.md`) sebelum
  implementasi dimulai, terutama untuk memetakan struktur menu bersarang
  (section + submenu) existing ke komponen PrimeVue yang sesuai (`PanelMenu`
  vs `Menu` custom template vs kombinasi).
- `CLAUDE.md` project belum mengisi bagian "Perintah Verifikasi" (typecheck/
  lint/test/build script masih TODO) — implementasi lanjutan (Klaster 2) perlu
  klarifikasi command aktual sebelum bisa menjalankan verifikasi otomatis.
