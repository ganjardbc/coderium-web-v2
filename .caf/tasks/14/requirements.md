# Requirements — Ticket #14: Product Public Pages (apps/web)

## Status: PLAN

## Sumber
GitHub Issue #14 (ganjardbc/coderium-web-v2). Sumber discovery: `.caf/discovery/product-crud/prd.md`
+ `flow.md` (dibaca ulang untuk detail tambahan). Dependency: Ticket #12 (Product CRUD API)
SELESAI dan merge (endpoint public `apps/api` sudah tersedia). Ticket #13 (Admin List/Form)
juga sudah di-breakdown terpisah — tidak overlap, ticket ini murni `apps/web` (Nuxt).

## Problem
Calon klien eksternal tidak punya halaman khusus untuk memahami produk (mis. CAF) tanpa
harus membaca artikel blog dulu. Butuh entry point navigasi + halaman index + detail yang
fokus pada value proposition dan CTA "Request pilot".

## Target User
Calon klien eksternal (engineering lead/CTO) yang evaluasi pilot project — waktu terbatas,
scan cepat, butuh bukti kredibilitas sebelum CTA.

## Scope (in)

### 1. Nav item "Products"
- Tambah entry ke array `navItems` di `apps/web/layouts/default.vue` (satu array dipakai
  untuk sidebar desktop DAN bottom nav mobile — cukup satu perubahan). Ikuti bentuk entry
  existing: `{ to: '/products', icon: 'lucide:<pilih>', label: 'Products', isActive: (route) => route.path.startsWith('/products') }`.
  Icon: pilih icon lucide yang belum dipakai (`home`, `compass`, `library` sudah dipakai) —
  rekomendasi `lucide:box` atau `lucide:package` (final call Implementer, tidak blocking).

### 2. Halaman index `/products` — `apps/web/pages/products/index.vue`
- Fetch `GET ${apiBase}/products?page=1&limit=<N>` (endpoint public, sudah otomatis
  `status=published`, `orderBy: order asc` — **tidak perlu logic sort/filter tambahan di
  frontend**, backend sudah handle). Response: `{ success, message, data: Product[], meta }`.
- Ticket TIDAK menyebutkan kontrol pagination UI untuk index produk (beda dari `/explore`
  yang punya pager) — asumsi: jumlah produk masih kecil di fase awal (baru CAF), jadi
  **cukup satu fetch dengan `limit` longgar (mis. 24), tanpa pager UI** untuk scope ticket
  ini. Kalau nanti jumlah produk bertambah signifikan, pagination bisa ditambah terpisah
  (bukan blocking, catat sebagai asumsi, bukan keputusan final produk).
- Grid/list card: tiap card render `cover`, `name`, `tagline` (truncate 1 baris —
  `line-clamp-1` atau `truncate`). Reuse komponen baru `ProductCard.vue` (lihat Scope
  Komponen di bawah).
- Klik card → `/products/{slug}`.
- Empty state (tidak ada produk published): heading singkat + sub-copy ringan yang
  mengarahkan ke konten lain (mis. link ke `/explore` atau `/playlists`), **tanpa
  illustration besar** — reuse `EmptyState.vue` (`apps/web/components/EmptyState.vue`,
  sudah menerima slot custom, lihat pola di `pages/explore.vue`).
- Loading: skeleton grid (reuse `SkeletonBlock.vue`, pola sama seperti index/explore).

### 3. Halaman detail `/products/[slug]` — `apps/web/pages/products/[slug].vue`
Urutan section, dipisah hairline divider (`border-t/border-b border-gray-100
dark:border-gray-800`, pola persis seperti section homepage/post):

1. **Hero + CTA utama** — `name`, `tagline`, pill button CTA (`ctaLabel` fallback
   `"Request pilot"` kalau kosong) → `<a :href="ctaUrl" target="_blank"
   rel="noopener noreferrer">` (bukan `<NuxtLink external>`, karena harus buka tab baru
   secara eksplisit — lihat catatan CTA di bawah). Above the fold, tanpa illustration/
   gradient besar — tipografi + hairline saja.
2. **Pipeline strip** — numbered list VERTIKAL dari `pipelineSteps` (array
   `{title, description?}`), render urut apa adanya (index array), TIDAK sorting
   tambahan. Style: ikuti pola numbered list "Popular on Coderium" di
   `pages/index.vue` (angka besar `text-2xl font-black text-gray-300
   dark:text-gray-700`, bukan horizontal stepper).
3. **Daftar fitur** — grid `features` (array `{title, description?}`), 2 kolom
   desktop (`md:grid-cols-2`) / 1 kolom mobile.
4. **Bukti** — DUA sub-list independen:
   - **"Dipelajari lewat"** — fetch `GET ${apiBase}/playlists/{slug}` (endpoint
     playlist-by-slug, `slug` = slug produk yang sama). **PENTING:** endpoint ini
     exact-match by slug, jadi sub-list ini SECARA STRUKTURAL hanya bisa berisi 0 atau
     1 item (playlist tunggal), BUKAN daftar banyak playlist — beda dari sub-list
     "Bacaan & konten terkait" yang bisa berisi banyak Post. Kalau fetch gagal
     (404/error, playlist tidak ada atau belum published) → treat sebagai kosong,
     JANGAN redirect ke 404 halaman produk (ini bukan error fatal produk, murni
     section pendukung — lihat State Kosong).
   - **"Bacaan & konten terkait"** — fetch `GET ${apiBase}/search?tags={slug}&limit=<n>`
     (endpoint sudah ada, dipakai juga di `pages/explore.vue` dengan pola serupa;
     `tags` comma-separated tapi di sini cukup kirim slug tunggal). Response
     `{ data: Post[], meta }`, **TIDAK ada param `type`** — semua tipe post ke-tag
     ikut tampil. Tiap item render **badge tipe konten** (`post.type`): map
     `article` → "Article", `carousel` → "Carousel", `video` → "Video",
     `stack_gallery` → "Stack Gallery" (4 nilai enum, sama seperti filter chip di
     `pages/explore.vue`).
   - Copy heading section: "Bacaan & konten terkait" (bukan "Posts/Article" —
     karena lintas tipe, lihat flow.md).
   - Section **disembunyikan total** (termasuk heading section "Bukti") kalau KEDUA
     sub-list kosong. Kalau salah satu ada isi, tampilkan sub-list yang ada saja
     (sembunyikan sub-list yang kosong, tanpa placeholder).
5. **CTA penutup** — repetisi pill button (`ctaLabel`/`ctaUrl` sama seperti hero),
   copy statis penutup (mis. "Siap mulai pilot?" — final copy keputusan konten, boleh
   pakai placeholder ini). **Posisi computed secara dinamis**: kalau section Bukti
   dirender (ada minimal 1 sub-list berisi) → setelah section Bukti. Kalau section
   Bukti disembunyikan (kedua sub-list kosong) → langsung setelah section "Daftar
   fitur". Implementasi: gunakan flag computed `hasBukti = hasPlaylist ||
   hasRelatedPosts` untuk kontrol render section 4 DAN posisi section 5 (bukan pakai
   CSS order/reflow, cukup `v-if` sekuensial di template karena section 5 hanya satu
   dan urutannya deterministik).
- **404 handling**: slug tidak ditemukan ATAU produk berstatus `draft`/`archived` →
  backend (`findBySlugPublic`) SUDAH menangani ini di level query
  (`where: { slug, status: 'published' }`, throw `NotFoundException` kalau tidak
  match) — jadi dari sisi frontend cukup: fetch gagal (error/404) → render 404 page,
  TIDAK perlu logic tambahan untuk membedakan "slug salah" vs "status draft/archived",
  keduanya sama-sama error dari satu endpoint yang sama.
- **CTA klik** (hero maupun penutup) → buka `ctaUrl` di tab baru (`target="_blank"
  rel="noopener noreferrer"`), TIDAK ada `@click` handler custom kecuali nanti mau
  tambah tracking (out of scope instrumentasi, lihat prd.md Dependency).

### 4. Featured card di homepage — `apps/web/pages/index.vue`
- Query: `GET ${apiBase}/products?limit=<N>` (endpoint public sudah otomatis
  `status=published`). **CATATAN PENTING — gap kontrak API:** endpoint public
  `findAllPublic` (lihat `apps/api/src/products/products.service.ts`) TIDAK punya
  parameter filter `featured` — hanya `page`/`limit`, `orderBy: order asc`. Jadi
  filtering `featured === true` HARUS dilakukan client-side setelah fetch (ambil
  daftar produk published, `.find(p => p.featured)` atau `.filter(...)`), bukan lewat
  query param yang tidak ada. Ini bukan bug — dianggap acceptable karena jumlah
  produk masih kecil di fase awal; kalau katalog produk membesar signifikan, endpoint
  perlu ditambah filter `featured` di ticket API terpisah (di luar scope ticket ini,
  TIDAK mengubah `apps/api`).
- Kalau ada lebih dari satu produk `featured: true` (admin bisa set banyak sejak
  Ticket #13 tidak membatasi ke satu produk) → **ambil yang pertama berdasarkan
  `order` ascending** (array sudah terurut `order asc` dari backend, jadi cukup
  `.find(p => p.featured)` pada array hasil fetch). Homepage hanya menampilkan SATU
  featured card, sesuai flow.md ("satu card featured product").
- Kalau tidak ada produk `featured: true` sama sekali → section featured **tidak
  dirender** (bukan skeleton/placeholder kosong).
- Styling: reuse `ProductCard.vue` (Scope Komponen) dengan variant/prop lebih
  prominent (mis. `size="lg"` — card lebih besar, cover lebih dominan) dibanding
  card di grid `/products`.
- Penempatan: flow.md hanya bilang "di atas fold sekunder homepage" tanpa presisi
  slot — rekomendasi Planner: section baru full-width **setelah Hero, sebelum grid
  "Recent Stories + Sidebar"** di `pages/index.vue`, dipisah hairline divider
  konsisten dengan section lain di halaman itu. Final placement/visual boleh
  disesuaikan Implementer selama tidak mengganggu hierarki existing (Hero tetap
  paling atas).

## Scope Komponen Baru (reusable)

### `ProductCard.vue` — `apps/web/components/ProductCard.vue`
- Props: `product: { slug, name, tagline?, cover? }`, optional `size?: 'md' | 'lg'`
  (default `'md'`) untuk varian featured homepage yang lebih prominent.
- Dipakai 2x: grid `/products` (Task terkait Scope 2) dan featured card homepage
  (Scope 4) — SATU komponen, JANGAN duplikasi markup.

### 404 state untuk `/products/[slug]`
- **Finding penting:** ticket brief bilang "reuse komponen 404 existing", TAPI
  investigasi codebase (`apps/web`) menunjukkan **tidak ada komponen 404 shared/
  generik** yang bisa langsung di-reuse. Yang ada saat ini: setiap halaman detail
  (`pages/posts/[slug].vue`, `pages/playlists/[slug].vue`) render blok "not found"
  INLINE masing-masing (heading berbeda per halaman — "Story Not Found" / "Playlist
  Not Found" — + sub-copy + `BackButton`), bukan komponen terpisah, dan tidak lewat
  mekanisme Nuxt `error.vue`/`createError` (tidak ada `apps/web/error.vue` sama
  sekali).
- **Rekomendasi Planner (tidak blocking, final call Implementer):** ekstrak pola
  inline ini jadi komponen baru `apps/web/components/NotFoundState.vue` (props:
  `title`, `message`, `backLabel`, `backTo`/pakai `BackButton` internal) — dipakai
  untuk halaman produk (`title="Product Not Found"`). TIDAK WAJIB memigrasikan
  `posts/[slug].vue` dan `playlists/[slug].vue` untuk pakai komponen baru ini
  (di luar scope ticket, risiko regresi tidak perlu) — cukup produk yang pakai
  komponen baru, supaya code baru genuinely reusable untuk halaman detail
  berikutnya tanpa menyentuh halaman existing yang sudah stabil.
- Kalau Implementer memilih TIDAK ekstrak komponen (langsung inline di
  `products/[slug].vue` mengikuti pola persis posts/playlists) itu juga dianggap
  valid — cukup konsisten visual dengan pola existing (heading + sub-copy +
  `BackButton variant="solid-dark"` atau serupa).

## Scope (out)
- Endpoint API — sudah selesai (Ticket #12, merged). Ticket ini murni konsumsi
  `GET /products`, `GET /products/:slug`, `GET /playlists/:slug`, `GET /search`.
  TIDAK ada perubahan `apps/api`, TIDAK menambah param `featured` di endpoint publik
  (lihat catatan gap di Scope 4).
- Admin List/Form Product — Ticket #13, `apps/admin`, sudah di-breakdown terpisah.
- Payment/checkout — CTA murni link keluar (`ctaUrl`), tidak ada flow transaksi.
- i18n — Bahasa Indonesia/konten apa adanya dari API, tidak ada translation layer.
- Instrumentasi tracking (CTR CTA, scroll depth, klik nav) — dependency terpisah
  (lihat prd.md), TIDAK diimplementasikan di ticket ini (tidak ada tooling analytics
  yang dikonfirmasi terpasang di `apps/web` saat ini — cek `nuxt.config.ts`
  `modules: ['@pinia/nuxt', '@nuxt/icon']`, tidak ada modul analytics).
- Migrasi halaman Post/Playlist ke komponen 404 baru — opsional, tidak wajib
  (lihat catatan di Scope Komponen).

## Catatan Bahasa Visual — "dark-first editorial"
Brief ticket menyebut "dark-first editorial", TAPI codebase `apps/web` saat ini
adalah **light-first dengan dark mode toggle** (default `light` kecuali
`prefers-color-scheme: dark` atau tersimpan di `localStorage`, lihat
`layouts/default.vue` `onMounted`/`toggleDarkMode`, dan `assets/css/main.css` yang
mendefinisikan light sebagai base `body` style + `.dark` override). **Interpretasi
Planner untuk ticket ini:** "dark-first editorial" berarti pastikan tampilan DALAM
mode dark terasa matang/disengaja (bukan sekadar invert warna asal), bukan berarti
mengubah default theme aplikasi jadi dark-only atau membuat sistem theming baru.
Implementer HARUS pakai konvensi `dark:` variant existing (`dark:bg-dark`,
`dark:border-gray-800`, dst — sama seperti semua halaman lain), TIDAK membuat
override theme terpisah untuk halaman produk saja. Elemen "hairline divider, pill
button, numbered list style Popular on Coderium" — semua sudah ada polanya di
codebase (lihat referensi section di atas), tinggal direplikasi konsisten.

## Kontrak API (referensi, sudah tersedia — Ticket #12 merged, endpoint search/
playlist sudah lama ada)

| Method | Path | Guna | Response |
|---|---|---|---|
| GET | `/products?page&limit` | List published, `orderBy: order asc` | `{ success, message, data: Product[], meta:{page,limit,total,totalPages} }` |
| GET | `/products/:slug` | Detail, 404 kalau slug invalid/status bukan published | `{ success, message, data: Product }` |
| GET | `/playlists/:slug` | Detail playlist by slug (exact match, dipakai untuk "Dipelajari lewat") | `{ success, message, data: Playlist }` atau error kalau tidak ada |
| GET | `/search?tags={slug}&limit={n}` | Post published dengan tag = slug produk, TIDAK filter type | `{ success, message, data: Post[], meta }` |

Field `Product` (dari `apps/api/src/products/dto/*`, sama seperti dikonfirmasi di
`.caf/tasks/13/requirements.md`):
```ts
{
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  cover?: string;
  pipelineSteps?: { title: string; description?: string }[];
  features?: { title: string; description?: string }[];
  ctaLabel?: string;
  ctaUrl?: string;
  order?: number;
  featured?: boolean;
  updatedAt: string;
  createdAt: string;
}
```

Field `Post` dari `/search` (lihat `apps/api/src/search/search.service.ts` select
list): `id, title, slug, subtitle, type, tags, cover, isPublished, publishedAt,
viewsCount, likesCount, user:{id,name,avatarUrl}`. `type` salah satu dari
`article | carousel | video | stack_gallery`.

## Konvensi yang harus diikuti (referensi codebase existing)
- App: `apps/web` (Nuxt 3, bukan `apps/admin`). File-based routing:
  `pages/products/index.vue` → `/products`, `pages/products/[slug].vue` →
  `/products/:slug`.
- `definePageMeta({ layout: 'default' })` di tiap page, sama seperti semua page lain.
- Fetch data pakai `useAsyncData` + `$fetch` dengan `apiBase = useRuntimeConfig().public.apiBase`
  (proxy ke `apps/api` via `routeRules['/api/**']`), pola persis
  `pages/playlists/[slug].vue` dan `pages/posts/[slug].vue`.
- `useHead()` untuk SEO (title, meta description, og:title/og:description/og:image),
  pola sama seperti Post/Playlist detail.
- Reuse komponen existing: `EmptyState.vue`, `SkeletonBlock.vue`, `BackButton.vue`,
  `Icon` (`@nuxt/icon`, set `lucide:*`).
- Tidak ada script `lint`/`test` di `apps/web/package.json` (`build`, `dev`,
  `generate`, `preview`, `postinstall`, `typecheck` (`nuxi typecheck`), `clean`).
  Verifikasi realistis = `typecheck` + `build`.

## Pertanyaan Terbuka (tidak blocking, catatan untuk Implementer)
1. Icon nav item "Products" — final pilihan lucide icon, tidak fatal apapun
   dipilih selama konsisten dengan style icon lain (outline, ukuran sama).
2. Posisi persis featured card di homepage (setelah Hero vs slot lain) — rekomendasi
   Planner sudah diberikan (Scope 4), boleh disesuaikan Implementer.
3. Ekstraksi `NotFoundState.vue` vs inline block untuk 404 produk — rekomendasi
   Planner: ekstrak komponen baru (Scope Komponen), tapi inline juga valid.
4. Copy statis CTA penutup ("Siap mulai pilot?") — placeholder dari Planner,
   final copy keputusan tim konten, tidak blocking implementasi teknis.

Karena semua pertanyaan di atas punya rekomendasi default yang jelas dan tidak
menghalangi implementasi, status tetap `PLAN`, bukan `NEEDS_HUMAN`.
