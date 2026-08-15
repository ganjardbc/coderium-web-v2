# Flow: Update Components in apps/admin using PrimeVue

## Keputusan UX Designer

**Tidak menggunakan UX Designer Agent untuk iterasi ini.** Alasan: fitur ini
adalah migrasi implementasi komponen (hand-rolled HTML/SVG → PrimeVue) pada
layout yang sudah ada, dan `prd.md` secara eksplisit menempatkan "tidak ada
perubahan desain visual/branding" dan "tidak ada penambahan fitur navigasi
baru" di `## Out-of-Scope` — behavior interaksi existing (active state,
submenu expand, mobile toggle, dark mode, logout confirm) wajib dipertahankan
identik. Karena tidak ada information architecture baru atau user flow baru
yang perlu dirancang, cukup dokumentasi flow existing yang jadi acuan supaya
implementasi (Klaster 2) tahu behavior mana yang harus dipertahankan sama
persis saat swap komponen. Kalau saat implementasi ternyata komponen PrimeVue
tertentu (mis. `PanelMenu`) memaksa perubahan interaksi yang tidak bisa
disamakan 1:1 dengan behavior lama, itu harus dieskalasi balik sebagai
pertanyaan desain (lihat `## Pertanyaan Terbuka`), bukan diputuskan sepihak
oleh implementer.

## Entry Point

- User login ke `apps/admin`, landing di `AdminLayout.vue` yang membungkus
  semua route admin (dashboard, posts, playlists, media, users, settings).
- Layout ini selalu tampil di semua halaman admin — sidebar kiri (desktop)
  atau overlay (mobile), header atas dengan breadcrumb dan aksi (dark mode
  toggle, visit site, avatar/logout).

## Alur Utama

1. **Navigasi sidebar** — user klik item menu di sidebar (Dashboard, Posts,
   Playlists, Media Library, Users, System Settings). Item aktif di-highlight
   berdasarkan `route.path` (lihat `isMenuItemActive` di
   `AdminLayout.vue:270`). Target komponen PrimeVue: `Menu`/`PanelMenu` atau
   `Menubar` vertikal — perlu mendukung active-state styling yang setara.
2. **Submenu (System Settings)** — item dengan `submenu` (Profile, Password,
   Appearance, Two-Factor Auth) hanya expand kalau parent-nya aktif
   (`v-if="item.submenu && isMenuItemActive(item)"`, line 71). Ini bukan
   accordion manual-toggle, tapi auto-expand berbasis route. Perlu dipastikan
   komponen PrimeVue pilihan bisa direplikasi behavior ini (route-driven
   expand, bukan click-to-toggle terpisah).
3. **Mobile sidebar** — di layar `md:` ke bawah, sidebar disembunyikan
   (`-translate-x-full`) dan dibuka lewat tombol hamburger di header
   (`isMobileOpen = true`), ditutup lewat backdrop klik atau tombol close.
   Kalau pakai PrimeVue `Sidebar`/`Drawer` component, behavior overlay +
   backdrop ini biasanya sudah built-in — perlu verifikasi parity dengan
   animasi transisi (`duration-300`) yang ada sekarang.
4. **Breadcrumb** — header menampilkan "Admin > {currentSectionName}" statis
   dua level (line 126-133), dihitung dari `route.path` (line 291-297). Kalau
   diganti ke PrimeVue `Breadcrumb`, cukup dua level ini, tidak perlu nested
   breadcrumb dinamis lebih dalam.
5. **Dark mode toggle** — tombol icon (matahari/bulan) di header, toggle state
   lewat `useTheme()` composable (line 138-149, 299-302). Perlu tetap pakai
   composable yang sama, hanya wrapper tombolnya diganti ke PrimeVue `Button`
   dengan icon dari `primeicons` (mis. `pi-sun`/`pi-moon`) menggantikan inline
   SVG.
6. **Logout** — tombol icon logout di footer sidebar memicu
   `confirm.require(...)` dari `useConfirm()` PrimeVue (line 304-316) — ini
   SUDAH pakai PrimeVue (`ConfirmDialog`), tidak perlu diubah, hanya tombol
   pemicunya (icon SVG manual) yang perlu diganti ke PrimeVue `Button`.
7. **Avatar user** — avatar bulat menampilkan foto profil atau inisial nama
   (line 89-97) — kandidat migrasi ke PrimeVue `Avatar` component
   (`image` prop atau `label` untuk inisial).
8. **"Visit Site" link** — link keluar ke `apps/web`, styling tombol outline —
   kandidat migrasi ke PrimeVue `Button` dengan `as="a"` / `link`.

## State Kosong & Error

- Tidak ada state kosong baru yang relevan — ini bukan fitur data baru, semua
  data menu (`menuSections`) sudah hardcoded di komponen, bukan dari API.
- **Error yang perlu tetap ditangani sama seperti sekarang:**
  - Avatar gagal load image (`authStore.user?.avatarUrl` broken/404) — saat
    ini fallback ke inisial nama lewat `v-else`. Kalau migrasi ke PrimeVue
    `Avatar`, perlu pastikan fallback ini tetap ada (PrimeVue `Avatar` tidak
    otomatis fallback ke inisial saat `image` error — perlu `@error` handler
    manual atau kondisional serupa existing).
  - User tanpa nama (`authStore.user?.name` null) — fallback ke "Admin User"
    dan inisial "A" (line 95, 287-289). Behavior fallback ini harus tetap
    dipertahankan di komponen pengganti.
  - Logout gagal (mis. network error saat `authStore.logout()`) — TODO:
    behavior existing tidak eksplisit menangani error di sini (tidak ada
    try/catch terlihat di handler), jadi tidak ada regresi baru tapi juga
    tidak ada perbaikan error-handling yang diharapkan dari migrasi ini,
    kecuali dinyatakan lain oleh stakeholder.

## Pertanyaan Terbuka

- Apakah ada halaman/komponen lain di `apps/admin/src` (di luar
  `AdminLayout.vue`) yang juga perlu di-inventarisasi untuk migrasi lanjutan
  di iterasi berikutnya? Discovery ini belum melakukan full scan ke semua
  route/komponen admin — perlu konfirmasi prioritas dari PM/stakeholder
  sebelum dibuatkan ticket susulan.
- Kalau PrimeVue `PanelMenu`/`Menu` yang dipilih ternyata tidak bisa
  mereplikasi persis behavior "submenu auto-expand berbasis route aktif"
  (bukan click-to-toggle), apakah acceptable mengubah interaksi jadi
  click-to-toggle standar PrimeVue, atau harus custom template supaya identik?
  Ini butuh keputusan desain/produk, bukan keputusan implementer sendiri —
  kalau muncul saat implementasi, sebaiknya dieskalasi balik ke PM/UX untuk
  keputusan eksplisit sebelum dikerjakan.
- Command verifikasi (`typecheck`/`lint`/`test`/`build`) untuk `apps/admin`
  di `CLAUDE.md` masih TODO — perlu diisi manusia sebelum Klaster 2 bisa
  menjalankan verifikasi otomatis pasca-migrasi.
