# Tasks — Ticket #14: Product Public Pages (apps/web)

## Routing / Scope Kerja
**FRONTEND ONLY — single app: `apps/web` (Nuxt 3, bukan Vue/Vite biasa seperti
`apps/admin`).** Tidak ada perubahan di `apps/api` (backend/DB sudah selesai di
Ticket #12, merged ke `main`). Tidak menyentuh `apps/admin`. Main thread: routing
implementasi langsung ke Coder untuk `apps/web`, tidak perlu koordinasi service lain.

## Butuh Architect stage?
**Tidak.** Single app, tidak ada schema/migration baru, tidak ada endpoint baru,
tidak ada keputusan arsitektur lintas service — murni halaman + komponen baru yang
mengonsumsi endpoint public yang sudah ada, mengikuti pola halaman detail existing
(`posts/[slug].vue`, `playlists/[slug].vue`) di codebase yang sama. Bisa langsung
ke Coder setelah Planner.

## Urutan Kerja

### Task 1 — Nav item "Products"
- Edit `apps/web/layouts/default.vue`: tambah satu entry ke array `navItems`
  (dipakai bersama oleh sidebar desktop dan bottom nav mobile, jadi cukup satu
  perubahan di satu tempat): `{ to: '/products', icon: 'lucide:box', label:
  'Products', isActive: (route) => route.path.startsWith('/products') }` (icon
  final call Implementer, `lucide:box`/`lucide:package` direkomendasikan).
- Verifikasi urutan render nav tidak mengganggu 3 item existing (Home/Explore/
  Series) — taruh di posisi yang masuk akal (mis. setelah "Series" atau sebelum,
  final call Implementer, tidak ada aturan spesifik dari ticket).

### Task 2 — Komponen `ProductCard.vue`
- Buat `apps/web/components/ProductCard.vue`.
- Props: `product: { slug: string; name: string; tagline?: string | null; cover?:
  string | null }`, `size?: 'md' | 'lg'` (default `'md'`).
- Render: `cover` (image, fallback bg placeholder kalau kosong, pola sama seperti
  `PostListItem.vue`/thumbnail post), `name` (heading), `tagline` (truncate 1
  baris — `line-clamp-1` atau `truncate`).
- Klik → `NuxtLink :to="/products/{slug}"`.
- Varian `size="lg"`: cover lebih besar/dominan, typography lebih besar — dipakai
  untuk featured card homepage (Task 5). Varian `size="md"` (default) dipakai di
  grid `/products` (Task 3).
- Style: hairline border (`border border-gray-100 dark:border-gray-800`, rounded),
  konsisten dengan card lain di codebase (bukan drop-shadow besar/gaya SaaS).

### Task 3 — Halaman index: `apps/web/pages/products/index.vue`
- `definePageMeta({ layout: 'default' })`, `useHead({ title: 'Products - Coderium'
  })` atau serupa.
- `useAsyncData` fetch `GET ${apiBase}/products?page=1&limit=24` (limit longgar,
  TIDAK ada pager UI untuk scope ticket ini — lihat requirements.md Scope 2).
- Loading: skeleton grid (`SkeletonBlock`, beberapa placeholder card).
- Empty (`data.length === 0`): render `EmptyState` dengan heading "Belum ada
  produk yang tersedia saat ini" + sub-copy link ke `/explore` atau `/playlists`
  (custom slot content, bukan `message` prop biasa kalau perlu link di dalamnya —
  lihat pola `EmptyState` di `pages/explore.vue` yang pakai slot).
- Grid: `grid md:grid-cols-2 lg:grid-cols-3 gap-6` (atau serupa) berisi
  `ProductCard` (`size="md"`) per produk, urutan APA ADANYA dari response
  (backend sudah `orderBy: order asc`, tidak perlu sort ulang di frontend).

### Task 4 — Halaman detail: `apps/web/pages/products/[slug].vue`
- `definePageMeta({ layout: 'default' })`.
- Fetch utama: `useAsyncData('product-{slug}', () => $fetch(
  '${apiBase}/products/{slug}'))` dengan `pending`/`error` destructured (pola
  persis `pages/posts/[slug].vue`).
- **404 state**: `v-else-if="error"` → render blok/komponen not-found (lihat Task
  4a) — TIDAK perlu logic pembeda slug-invalid vs draft/archived, backend sudah
  handle keduanya sebagai satu error yang sama.
- **Section 1 — Hero**: `name` (h1), `tagline`, pill CTA
  (`<a :href="product.ctaUrl" target="_blank" rel="noopener noreferrer"
  class="...rounded-full...">{{ product.ctaLabel || 'Request pilot' }}</a>`).
  Above the fold, tipografi-driven (tanpa illustration/gradient besar).
- **Section 2 — Pipeline strip**: `v-for="(step, i) in product.pipelineSteps"`,
  numbered list vertikal (angka besar `text-2xl font-black text-gray-300
  dark:text-gray-700`, judul + deskripsi di sampingnya), urutan array apa adanya.
  Section hairline-divided dari section sebelumnya.
- **Section 3 — Daftar fitur**: grid `md:grid-cols-2 grid-cols-1 gap-4/6` berisi
  `product.features` (judul + deskripsi per card sederhana, bukan icon grid besar).
- **Section 4 — Bukti** (lihat Task 4b untuk detail fetch):
  - Sub-list "Dipelajari lewat": render playlist (kalau ada) sebagai satu item
    link ke `/playlists/{slug}`.
  - Sub-list "Bacaan & konten terkait": render tiap post dengan badge tipe konten
    (`article→Article`, `carousel→Carousel`, `video→Video`,
    `stack_gallery→Stack Gallery`), link ke `/posts/{post.slug}`.
  - `v-if="hasPlaylist"` dan `v-if="hasRelatedPosts"` independen per sub-list;
    section WRAPPER (termasuk heading "Bukti"/"Dipelajari lewat & terkait") pakai
    `v-if="hasPlaylist || hasRelatedPosts"`.
- **Section 5 — CTA penutup**: repetisi pill button sama seperti hero (`ctaLabel`/
  `ctaUrl`, `target="_blank"`), copy statis penutup (placeholder "Siap mulai
  pilot?" — final copy tim konten). Section ini SELALU dirender kalau `product`
  ada (tidak conditional) — posisinya otomatis tepat setelah section 4 (kalau
  section 4 dirender) atau tepat setelah section 3 (kalau section 4 disembunyikan)
  KARENA section 4 sudah `v-if`-guarded di atasnya secara sekuensial di template
  (tidak perlu logic reposisi CSS tambahan, cukup urutan `v-if` di markup).
- `useHead()` SEO: title, description (`tagline`), og:title/og:description/
  og:image (`cover`) — pola sama seperti Post/Playlist detail, guard dengan
  `if (productRes.value?.data)` sebelum `useHead`.

### Task 4a — 404 state untuk produk
- Rekomendasi: buat `apps/web/components/NotFoundState.vue` (props: `title`,
  `message`, `backLabel`) dipakai di `products/[slug].vue` dengan
  `title="Product Not Found"`, `message="The product you are looking for might
  have been removed or unpublished."`, `backLabel="Back to Products"`
  (`BackButton` internal, variant konsisten dengan pola posts/playlists —
  `solid-dark` atau `solid-blue`).
- ALTERNATIF valid (kalau Implementer tidak mau ekstrak komponen baru): inline
  block langsung di `products/[slug].vue`, copy-paste persis pola
  `pages/playlists/[slug].vue` (`v-else-if="error"` block dengan heading +
  sub-copy + `BackButton`).
- **TIDAK WAJIB** memigrasikan `posts/[slug].vue` / `playlists/[slug].vue` ke
  komponen baru ini — di luar scope, risiko regresi tidak perlu ditanggung ticket
  ini.

### Task 4b — Fetch section Bukti
- Fetch playlist: `useAsyncData('product-playlist-{slug}', () => $fetch(
  '${apiBase}/playlists/{slug}'), { default: () => null })` — **WAJIB** ditangani
  supaya error (playlist tidak ada) TIDAK melempar unhandled rejection atau
  membuat halaman produk ikut 404. Pola: try/catch dalam handler `useAsyncData`,
  atau manfaatkan opsi `useAsyncData` yang menangkap error ke `error.value` tanpa
  throw ke luar, lalu `hasPlaylist = computed(() => !!playlistData.value &&
  !playlistError.value)`.
- Fetch related posts: `useAsyncData('product-related-{slug}', () => $fetch(
  '${apiBase}/search?tags={slug}&limit=6'))` (limit final call Implementer, "max
  beberapa item, bukan full list" per flow.md — rekomendasi 4-6). Response
  `{ data: Post[] }` — kalau `data.length === 0`, treat sebagai kosong (bukan
  error, endpoint ini sukses dengan array kosong, bukan 404).
- Kedua fetch berjalan PARALEL dengan fetch utama produk (tidak perlu nested/
  sequential — slug sudah tersedia dari `route.params.slug` sebelum fetch produk
  selesai, TIDAK perlu menunggu `product` value untuk fetch ini karena slug
  produk = `route.params.slug` langsung, bukan dari response produk).

### Task 5 — Featured card homepage: edit `apps/web/pages/index.vue`
- Tambah `useAsyncData` baru: `GET ${apiBase}/products?limit=24` (fetch semua
  produk published, filter `featured` di client — lihat requirements.md Scope 4
  untuk alasan gap kontrak API).
- `featuredProduct = computed(() => productsRes.value?.data?.find(p =>
  p.featured) ?? null)` (array sudah terurut `order asc` dari backend, `.find`
  otomatis ambil yang `order` terkecil di antara yang `featured`).
- Render section baru (hairline-divided) **setelah Hero, sebelum grid "Recent
  Stories + Sidebar"**, `v-if="featuredProduct"` (section tidak dirender sama
  sekali kalau tidak ada featured product — bukan skeleton kosong permanen,
  TAPI boleh ada skeleton sementara saat `pending` sebelum data datang, konsisten
  pola loading section lain di halaman yang sama).
- Isi section: heading kecil (mis. "Featured Product", uppercase tracking-wider,
  pola sama seperti heading "Recent Stories"/"Popular on Coderium") + `ProductCard`
  (`size="lg"`).

### Task 6 — Cross-check konsistensi visual
- Review ulang 3 halaman baru (`products/index.vue`, `products/[slug].vue`,
  section featured di `index.vue`) terhadap konvensi existing: hairline divider
  (`border-gray-100 dark:border-gray-800`), pill button (`rounded-full`), warna
  `dark:` variant di SETIAP elemen berwarna (jangan ada elemen yang cuma light
  mode). TIDAK membuat sistem theming/override terpisah untuk halaman produk
  (lihat requirements.md "Catatan Bahasa Visual").

## Verify Checklist
- [ ] `pnpm --filter coderium-web run typecheck` (`nuxi typecheck`) lolos tanpa
      error baru di file yang ditambah/diubah.
- [ ] `pnpm --filter coderium-web run build` (`nuxt build`) lolos.
- [ ] Tidak ada script `lint`/`test` di `apps/web/package.json` — TIDAK perlu
      dijalankan, jangan invent command yang tidak ada.
- [ ] Manual/read-through check: `navItems` di `layouts/default.vue` menambah
      SATU entry "Products" yang otomatis muncul di sidebar desktop DAN bottom
      nav mobile (array sama, tidak ada duplikasi kode nav).
- [ ] Manual/read-through check: `/products/[slug]` fetch error (404 dari API)
      → render 404 state, TIDAK crash/unhandled promise rejection.
- [ ] Manual/read-through check: fetch playlist-by-slug & search tidak melempar
      error yang membuat halaman produk ikut 404 kalau playlist/post tidak ada
      (section Bukti disembunyikan, bukan seluruh halaman error).
- [ ] Manual/read-through check: CTA hero & penutup pakai `target="_blank"
      rel="noopener noreferrer"`, bukan `NuxtLink` internal.
- [ ] Manual/read-through check: section Bukti disembunyikan total (termasuk
      heading) kalau kedua sub-list kosong, dan CTA penutup otomatis mengikuti
      urutan `v-if` sekuensial tanpa logic reposisi tambahan.
- [ ] Manual/read-through check: featured card homepage filter `featured` di
      client-side (bukan asumsi param query API yang tidak ada), ambil satu
      produk pertama (`order` asc) kalau lebih dari satu `featured: true`.
- [ ] Manual/read-through check: `ProductCard.vue` dipakai di KEDUA tempat
      (grid `/products` size `md`, featured homepage size `lg`) — tidak ada
      markup card terduplikasi.

Kalau verify gagal setelah 3x percobaan perbaikan → stop, tulis
`.caf/tasks/14/verify-report.md` dengan `Status: NEEDS_HUMAN` dan detail
kegagalannya (mengikuti kontrak Retry Logic di `caf-planner.md` — ini berlaku
untuk Coder/Verifier stage berikutnya, bukan dieksekusi oleh Planner).
