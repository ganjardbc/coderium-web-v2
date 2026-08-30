# Coderium V2 - Module Breakdown

## Overview

Dokumen ini menjelaskan pembagian module pada Coderium V2.

Tujuan dokumen:

* Menjadi acuan implementasi backend dan frontend.
* Membantu AI Coding Agent memahami batas tanggung jawab setiap module.
* Menghindari overlap antar module.
* Menjadi blueprint sebelum membuat API Contract dan Prisma Schema.

---

# Application Scope

```txt
apps/web    # Nuxt 3 — public site
apps/admin  # Vue 3 — admin dashboard
apps/api    # NestJS — backend API
```

---

# Backend Module List

```txt
auth
users
rbac

posts
playlists
products
ai-content

media
uploads

search
analytics

database
common
```

---

# Frontend Module List

## apps/admin

```txt
auth
dashboard
posts
playlists
products
ai-agent
media
analytics
settings
```

## apps/web (Nuxt 3 — file-based routing)

```txt
pages/index.vue            # Home (termasuk section "Featured Product", ticket 14)
pages/explore.vue          # Explore / browse
pages/posts/[slug].vue     # Post detail
pages/playlists/index.vue  # Playlist list
pages/playlists/[slug].vue # Playlist detail
pages/products/index.vue   # Product list (ticket 14)
pages/products/[slug].vue  # Product detail (ticket 14)
```

---

# Backend Modules

---

## Auth Module

### Responsibility

Mengelola authentication user.

### Features

* Register
* Login
* Logout
* Forgot Password
* Reset Password
* Token validation
* 2FA support

### Tables

* users
* roles
* user_roles
* permissions
* role_permissions

### Dependencies

* Users Module
* RBAC Module
* Database Module

### API Endpoints

```txt
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/me
```

### Permissions

Public:

* register
* login
* forgot-password
* reset-password

Protected:

* me
* logout

---

## Users Module

### Responsibility

Mengelola data user dan profile.

### Features

* Get profile
* Update profile
* Change password
* 2FA management
* Admin user management

### Tables

* users
* user_roles

### API Endpoints

```txt
GET    /users/me
PATCH  /users/me
PATCH  /users/me/password

GET    /admin/users
GET    /admin/users/:id
PATCH  /admin/users/:id
DELETE /admin/users/:id
```

### Permissions

```txt
manage_users        # Admin
authenticated_user  # User sendiri
```

---

## RBAC Module

### Responsibility

Mengelola role dan permission.

### Features

* Role checking
* Permission checking
* Assign role to user
* Seed default roles dan permissions

### Tables

* roles
* permissions
* user_roles
* role_permissions

### API Endpoints

```txt
GET  /admin/roles
GET  /admin/permissions
POST /admin/users/:id/roles
DELETE /admin/users/:id/roles/:roleId
```

---

## Posts Module

### Responsibility

Mengelola konten post dalam berbagai format.

### Features

* Create post (article, carousel, video, stack_gallery)
* Update post
* Delete post (soft delete)
* Publish / Unpublish post
* List own posts
* Admin list all posts
* Get post detail
* Increment views count
* Toggle like

### Tables

* posts
* post_views
* post_likes
* media (via mediable)

### Dependencies

* Users Module
* Media Module
* Uploads Module
* Analytics Module

### API Endpoints

```txt
GET    /posts
GET    /posts/recent
GET    /posts/popular
GET    /posts/:slug
POST   /posts/:slug/like

POST   /admin/posts
GET    /admin/posts
GET    /admin/posts/:slug
PUT    /admin/posts/:slug
DELETE /admin/posts/:slug
POST   /admin/posts/:slug/publish
POST   /admin/posts/:slug/unpublish
```

### Permissions

```txt
manage_own_posts
manage_all_posts
```

---

## Playlists Module

### Responsibility

Mengelola koleksi / playlist post.

### Features

* Create playlist
* Update playlist
* Delete playlist (soft delete)
* Publish / Unpublish playlist
* List own playlists
* Admin list all playlists
* Attach post to playlist
* Detach post from playlist
* Reorder posts in playlist

### Tables

* playlists
* playlist_post (pivot)

### Dependencies

* Posts Module
* Media Module

### API Endpoints

```txt
GET    /playlists
GET    /playlists/:slug

POST   /admin/playlists
GET    /admin/playlists
GET    /admin/playlists/:slug
PUT    /admin/playlists/:slug
DELETE /admin/playlists/:slug
POST   /admin/playlists/:slug/posts       # attach posts
DELETE /admin/playlists/:slug/posts       # detach posts
```

### Permissions

```txt
manage_own_playlists
manage_all_playlists
```

---

## Products Module

### Responsibility

Mengelola katalog product (landing page marketing), terpisah dari Post/Playlist —
tidak ada ownership per-user, admin-only untuk semua operasi tulis.

### Features

* Create / update product
* Publish / Unpublish product
* Archive / Restore product (pengganti hard-delete)
* List product publik (hanya `published`)
* Admin list semua product (semua status)
* Validasi field wajib untuk publish (`cover`, `ctaUrl`, `pipelineSteps`,
  `features`)

### Tables

* products

### Dependencies

* Tidak ada dependency ke Posts/Playlists/Media (tidak ada foreign key baru).

### API Endpoints

```txt
GET    /products
GET    /products/:slug

GET    /admin/products
GET    /admin/products/:id
POST   /admin/products
PATCH  /admin/products/:id
POST   /admin/products/:id/publish
POST   /admin/products/:id/unpublish
POST   /admin/products/:id/archive
POST   /admin/products/:id/restore
```

### Permissions

```txt
manage_products   # Admin-only, tanpa varian _own (tidak ada ownership)
```

---

## AI Content Module (Ticket #24)

### Responsibility

Generate draft artikel via LLM (OpenAI-compatible, dengan built-in web
search) dan commit cover image hasil generate ke media library internal.
Tidak menulis apapun ke `posts` — hanya menghasilkan bahan (title/content/
cover URL internal) yang dipakai caller (`apps/admin`, ticket #25) untuk
memanggil `POST /admin/posts` secara terpisah.

### Features

* Generate 1 artikel trending (AI/Coding/Technology/Startup) via LLM +
  web search, style guide (Bahasa Indonesia, sapaan Aku/Kamu, tone ramah)
  hardcoded server-side, tidak ada parameter override dari caller
* Log durasi round-trip generate (`{ event: 'ai_content_generate',
  durationMs, success }`) sebagai baseline observability latensi
* Download+reupload cover image (fetch server-side, validasi
  content-type/ukuran, reuse `MediaService.upload()`) supaya `POST
  /admin/posts` tetap hanya menerima URL internal, bukan hotlink eksternal

### Tables

* Tidak ada tabel baru — reuse `media`/`mediables` (via `MediaModule`).

### Dependencies

* Media Module (`MediaService.upload()`, reuse langsung — tidak
  reimplement logic upload)
* Package `openai` (client OpenAI-compatible, base URL/model/API key
  configurable via env var, bukan hardcode ke OpenAI resmi)

### API Endpoints

```txt
POST /admin/ai-content/generate
POST /admin/ai-content/cover
```

### Permissions

```txt
manage_own_posts
manage_all_posts
```

(sama dengan permission Create Post, tidak ada permission baru)

---

## Media Module

### Responsibility

Mengelola media library terpusat.

### Features

* Upload single media
* Upload multiple media
* List media
* Update media metadata
* Delete media
* Polymorphic attach ke post / playlist

### Tables

* media
* mediables (pivot)

### Dependencies

* Uploads Module

### API Endpoints

```txt
GET    /admin/media
POST   /admin/media/upload
POST   /admin/media/upload-multiple
GET    /admin/media/:id
PUT    /admin/media/:id
DELETE /admin/media/:id
```

### Permissions

```txt
manage_own_media
manage_all_media
```

---

## Search Module

### Responsibility

Full-text search konten.

### Features

* Search posts by title, subtitle, content
* Filter by type, tags
* Paginated results

### Tables

* posts

### API Endpoints

```txt
GET /search?q=query&type=article&tags=vue
```

### Permissions

Public.

---

## Analytics Module

### Responsibility

Mengumpulkan dan mengagregasi data engagement.

### Features

* Track post view
* Track post like
* Total views per post
* Total likes per post
* Top posts by views
* Top posts by likes
* Overall platform stats

### Tables

* post_views
* post_likes
* posts (aggregate columns)

### API Endpoints

```txt
GET /admin/analytics
GET /admin/analytics/posts
GET /admin/analytics/posts/:slug
```

### Permissions

```txt
view_analytics
```

---

## Uploads Module

### Responsibility

Mengelola upload file ke storage.

### Features

* Upload image (single)
* Upload image (multiple)
* Upload video
* Validate file type
* Validate file size

### Storage

```txt
Cloudflare R2
MinIO fallback
```

### API Endpoints

```txt
POST /uploads/image
POST /uploads/images
POST /uploads/video
```

### Permissions

```txt
authenticated_user
```

---

## Database Module

### Responsibility

Mengelola Prisma client dan database connection.

### Features

* PrismaService
* Database connection lifecycle

---

## Common Module

### Responsibility

Shared backend utilities.

### Contents

```txt
guards/
decorators/
interceptors/
filters/
pipes/
constants/
helpers/
types/
```

Examples:

```txt
JwtAuthGuard
PermissionsGuard
PublicDecorator
CurrentUserDecorator
ApiResponseInterceptor
HttpExceptionFilter
```

---

# Frontend Modules (Admin)

---

## Auth Module

### App

```txt
apps/admin
```

### Pages

```txt
/login
/register
/forgot-password
/reset-password
```

### Features

* Login
* Register
* Forgot password
* Persist token

---

## Dashboard Module

### App

```txt
apps/admin
```

### Pages

```txt
/dashboard
```

### Features

* Total posts
* Total playlists
* Total views
* Total likes
* Recent posts

---

## Posts Module

### App

```txt
apps/admin
```

### Pages

```txt
/posts
/posts/create
/posts/:slug/edit
```

### Features

* Post CRUD
* Support semua post type
* Publish / Unpublish
* Rich text editor (Tiptap)
* Carousel image manager
* Stack gallery manager
* Video upload
* Media attachment
* Atribusi sumber hermes (ticket 19) — badge "Hermes" di list untuk post
  dengan `sourceUrl` terisi, dan link read-only ke artikel sumber di halaman
  edit (`sourceUrl` tidak pernah dikirim balik ke `PUT /admin/posts/:slug`)

---

## Playlists Module

### App

```txt
apps/admin
```

### Pages

```txt
/playlists
/playlists/create
/playlists/:slug/edit
```

### Features

* Playlist CRUD
* Attach / detach post
* Reorder post

---

## Products Module

### App

```txt
apps/admin
```

### Pages

```txt
/products
/products/create
/products/:id/edit
```

(Catatan: routing pakai param `:id`, bukan `:slug` seperti module Posts/Playlists,
mengikuti kontrak API admin `/admin/products/:id` — lihat ticket 13.)

### Features

* Product CRUD (Simpan sebagai Draft / Simpan & Publish, dua tombol submit,
  status di-derive dari tombol yang diklik — bukan dropdown status manual)
* Publish / Unpublish / Archive / Un-archive (restore) sebagai aksi baris di list
* Reuse `RichTextEditor.vue` (description) dan `MediaUploader.vue` (cover, single)
  dari module Posts
* `RepeatableListField.vue` — komponen generik baru (`apps/admin/src/components/`)
  untuk field `pipelineSteps` dan `features` (title + description per row, add/
  remove/reorder, validasi inline per-row)
* Banner error publish gagal dengan daftar field yang kurang (di-parse dari
  `err.response.data.fields`), input tidak hilang saat publish gagal
* Auto-generate slug dari `name` (client-side, tetap editable manual)

---

## AI Agent Module

### App

```txt
apps/admin
```

### Pages

```txt
/ai-agent
/ai-agent/article/preview
```

### Features

* Grid card pemilihan tipe konten untuk generate AI — hanya "Article" yang
  fungsional (klik → generate + redirect ke halaman preview); carousel/
  video/stack_gallery tampil disabled dengan badge "Segera Hadir" (hardcode
  di frontend, bukan fetch dinamis)
* Halaman preview (`article-preview.vue`) dengan 3 state: loading (spinner +
  pesan bertahap kosmetik), preview (title/content read-only, cover kandidat
  dari sumber eksternal + fallback kalau gagal load, link `sourceUrl`,
  tombol "Generate Ulang"), error (pesan generik-ramah + "Coba Lagi")
* Commit lewat dua tombol — "Publish Post" (`isPublished: true`) dan "Save
  as Draft" (`isPublished: false`) — reuse `usePostStore().createPost`
  (Posts Module) apa adanya, tidak duplikasi logic `POST /admin/posts`.
  Sebelum commit, cover kandidat (URL eksternal dari `generate`) di-upload
  dulu via `POST /admin/ai-content/cover` untuk dapat URL internal
  (`data.url`) yang dikirim sebagai field `cover` — URL eksternal `coverUrl`
  TIDAK PERNAH dikirim langsung ke `createPost`
* Guard keluar halaman (`beforeunload` + `onBeforeRouteLeave`, konfirmasi
  browser) selama state `preview` — hasil generate hilang kalau ditinggalkan/
  refresh (state preview hanya di frontend, sesuai desain)
* Store `ai-content.store.ts` (Pinia) — state `preview`/`status`/
  `errorMessage`/`committing`/`commitError`, actions `generateArticle()`,
  `reset()`, `commitPost(isPublished)`
* Menu sidebar baru "AI Agent" (icon `pi-sparkles`) di `AdminLayout.vue`

### Catatan

* Backend (`apps/api/src/ai-content/`, ticket #24) dikerjakan di PR terpisah
  — smoke test end-to-end (generate → preview → commit) masih perlu
  dijalankan ulang begitu backend tersedia di environment yang sama; lihat
  `.caf/tasks/25/verify-report.md` catatan #4.
* `sourceUrl` dikirim ke `createPost` lewat type lokal
  `CreatePostWithSourceUrl` (extend `CreatePostPayload` di dalam
  `ai-content.store.ts`) — `CreatePostPayload` shared di Posts Module belum
  diupdate untuk field ini (di luar scope ticket #25).

---

## Media Module

### App

```txt
apps/admin
```

### Pages

```txt
/media
```

### Features

* Media library
* Upload media
* Edit media
* Delete media

---

## Analytics Module

### App

```txt
apps/admin
```

### Pages

```txt
/analytics
```

### Features

* Overview stats
* Top posts by views
* Top posts by likes

---

## Settings Module

### App

```txt
apps/admin
```

### Pages

```txt
/settings/profile
/settings/password
/settings/appearance
/settings/two-factor
```

### Features

* Update profile
* Change password
* Dark/light mode
* 2FA management

---

# Public Pages (apps/web — Nuxt 3)

---

## Home Page

```txt
/
```

### Features

* Latest posts
* Popular posts
* Featured playlists
* Infinite scroll
* Featured Product section (ticket 14) — hairline-divided section setelah
  Hero, sebelum grid "Recent Stories + Sidebar"; menampilkan satu
  `ProductCard.vue` (`size="lg"`) untuk produk `featured: true` pertama
  (`order` asc, filter dilakukan client-side karena `GET /products` tidak
  punya param `featured`); section tidak dirender sama sekali kalau tidak
  ada produk `featured`

---

## Explore Page

```txt
/explore
```

### Features

* Browse semua post
* Filter by type
* Filter by tags
* Search

---

## Post Detail Page

```txt
/posts/:slug
```

### Features

* Render post content (all types)
* Views tracking
* Like button
* Related posts
* SEO metadata

---

## Playlist List Page

```txt
/playlists
```

### Features

* List semua playlist

---

## Playlist Detail Page

```txt
/playlists/:slug
```

### Features

* Playlist info
* Daftar post dalam playlist

---

## Product List Page (ticket 14)

```txt
/products
```

### Features

* Grid produk `published` (fetch `GET /products?page=1&limit=24`, urutan
  apa adanya dari backend `order` asc, tanpa pager UI — katalog masih kecil)
* Tiap card (`ProductCard.vue`, `size="md"`): cover, name, tagline (truncate
  1 baris)
* Empty state (reuse `EmptyState.vue`) dengan link keluar ke `/explore` /
  `/playlists`
* Skeleton loading (reuse `SkeletonBlock.vue`)

---

## Product Detail Page (ticket 14)

```txt
/products/:slug
```

### Features

* Hero + CTA (`ctaLabel`/`ctaUrl`, `target="_blank" rel="noopener noreferrer"`,
  bukan `NuxtLink` internal)
* Pipeline strip — numbered vertical list dari `pipelineSteps`
* Daftar fitur — grid dari `features`
* Section "Bukti" — dua sub-list independen: "Dipelajari lewat" (playlist
  tunggal via `GET /playlists/:slug`, exact match by slug) dan "Bacaan &
  konten terkait" (post lintas tipe via `GET /search?tags={slug}&limit=6`,
  badge per `post.type`). Section (termasuk heading) disembunyikan total
  kalau kedua sub-list kosong
* CTA penutup — repetisi pill button, posisinya mengikuti urutan `v-if`
  sekuensial (setelah section Bukti kalau dirender, atau langsung setelah
  Daftar fitur kalau Bukti disembunyikan)
* 404 state (`NotFoundState.vue`, komponen baru) untuk slug invalid ATAU
  produk berstatus `draft`/`archived` — backend sudah menyatukan keduanya
  jadi satu error yang sama, frontend tidak perlu logic pembeda
* SEO via `useHead()` (title, description dari `tagline`, og:image dari
  `cover`)

---

# Cross Module Rules

## Ownership Rule

Author hanya boleh mengakses konten miliknya.

Berlaku untuk:

```txt
posts
playlists
media
```

---

## Admin Rule

Admin dapat mengakses semua resource.

---

## Public Rule

Public API hanya boleh mengembalikan:

```txt
is_published = true
deleted_at = null
```

---

## Soft Delete Rule

Soft deleted records tidak muncul di query normal.

---

# Implementation Order

```txt
1. Database Module
2. Auth Module
3. Users Module
4. RBAC Module
5. Uploads Module

6. Posts Module
7. Media Module
8. Playlists Module

9. Search Module
10. Analytics Module
```
