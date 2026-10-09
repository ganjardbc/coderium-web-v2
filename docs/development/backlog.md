# Coderium V2 - Development Backlog

Path:

```txt
docs/development/backlog.md
```

---

# Phase 0 - Foundation

## MONO-001

Task: Setup pnpm workspace

Status: `DONE`

Details:

```txt
- Buat pnpm-workspace.yaml
- Konfigurasi root package.json
- Setup turbo.json
```

---

## MONO-002

Task: Setup TurboRepo

Status: `DONE`

Details:

```txt
- Install turbo
- Konfigurasi pipeline: dev, build, lint, typecheck
```

---

## MONO-003

Task: Setup packages/shared-types

Status: `DONE`

Details:

```txt
- Buat package @coderium/shared-types
- Define interfaces dasar: User, Post, Playlist, Media
```

---

## MONO-004

Task: Setup packages/shared-utils

Status: `DONE`

Details:

```txt
- Buat package @coderium/shared-utils
- Implementasi: slugify, formatDate, truncateText, formatNumber
```

---

## MONO-005

Task: Setup packages/eslint-config

Status: `DONE`

---

## MONO-006

Task: Setup packages/tsconfig

Status: `DONE`

---

## MONO-007

Task: Setup packages/ui

Status: `DONE`

Details:

```txt
- Buat package @coderium/ui
- Setup PrimeVue base components
- Naming: UiButton, UiInput, UiTable, UiModal, UiBadge
```

---

## API-001

Task: Setup apps/api (NestJS)

Status: `DONE`

Details:

```txt
- Install NestJS
- Setup main.ts
- Setup global prefix /api/v1
- Setup Swagger
- Setup ValidationPipe
- Setup CORS
```

---

## API-002

Task: Setup Prisma

Status: `DONE`

Details:

```txt
- Install prisma
- Buat schema.prisma awal
- Setup DatabaseModule
- Setup PrismaService
- Setup prisma.config.ts (Prisma v7)
- Setup @prisma/adapter-pg for PostgreSQL driver adapter
- Generate Prisma Client
```

---

## API-003

Task: Setup PostgreSQL connection

Status: `DONE`

Details:

```txt
- Create coderium database
- Setup .env with DATABASE_URL
- Test connection via prisma migrate dev
- Create docker-compose.yml for local PostgreSQL
```

---

## API-004

Task: Create initial Prisma schema

Status: `DONE`

Details:

```txt
Buat models awal:
- User
- Role
- Permission
- UserRole
- RolePermission
```

---

## ADMIN-001

Task: Setup apps/admin (Vue 3 + Vite)

Status: `DONE`

Details:

```txt
- Install Vue 3 + Vite + TypeScript
- Setup PrimeVue
- Setup Tailwind CSS v4
- Setup Pinia + pinia-plugin-persistedstate
- Setup Vue Router
- Setup Axios
- Setup core/: initiate.ts, global-routes.ts, global-components.ts, global-styles.ts
```

---

## WEB-001

Task: Setup apps/web (Nuxt 3)

Status: `DONE`

Details:

```txt
- Install Nuxt 3
- Setup PrimeVue
- Setup Tailwind CSS v4
- Setup Pinia
- Setup nuxt.config.ts
```

---

---

# Phase 1 - Authentication & RBAC

## AUTH-001

Task: Create Users schema

Status: `DONE`

Details:

```txt
- Tambah User model ke schema.prisma
- Jalankan migration
```

---

## AUTH-002

Task: Create Roles schema

Status: `DONE`

Details:

```txt
- Tambah Role, Permission, UserRole, RolePermission ke schema.prisma
- Jalankan migration
```

---

## AUTH-003

Task: Create Auth Module (NestJS)

Status: `DONE`

Details:

```txt
- Buat auth module
- Setup JWT strategy
- Buat JwtAuthGuard
- Buat PublicDecorator
- Buat CurrentUserDecorator
```

---

## AUTH-004

Task: Implement Register API

Status: `DONE`

Endpoint: `POST /auth/register`

---

## AUTH-005

Task: Implement Login API

Status: `DONE`

Endpoint: `POST /auth/login`

---

## AUTH-006

Task: Implement Logout API

Status: `DONE`

Endpoint: `POST /auth/logout`

---

## AUTH-007

Task: Implement Current User API

Status: `DONE`

Endpoint: `GET /auth/me`

---

## AUTH-008

Task: Implement Forgot Password API

Status: `DONE`

Endpoint: `POST /auth/forgot-password`

---

## AUTH-009

Task: Implement JWT Guard

Status: `DONE`

---

## AUTH-010

Task: Implement Permissions Guard

Status: `DONE`

---

## AUTH-011

Task: Seed Roles dan Permissions

Status: `DONE`

Details:

```txt
Seed:
- Role: admin, author
- Permission: manage_users, manage_all_posts, manage_all_playlists, manage_all_media, view_analytics, manage_own_posts, manage_own_playlists, manage_own_media
- Role-Permission mapping
```

---

## ADMIN-AUTH-001

Task: Create Login Page

Status: `DONE`

---

## ADMIN-AUTH-002

Task: Create Register Page

Status: `DONE`

---

## ADMIN-AUTH-003

Task: Create Forgot Password Page

Status: `DONE`

---

---

# Phase 2 - Post Core

## POST-001

Task: Create Post schema

Status: `DONE`

Details:

```txt
- Tambah Post model ke schema.prisma
- Jalankan migration
```

---

## POST-002

Task: Implement Create Post API

Status: `DONE`

Endpoint: `POST /admin/posts`

---

## POST-003

Task: Implement List Posts API (public)

Status: `DONE`

Endpoints:

```txt
GET /posts
GET /posts/recent
GET /posts/popular
```

---

## POST-004

Task: Implement Get Post Detail API (public)

Status: `DONE`

Endpoint: `GET /posts/:slug`

---

## POST-005

Task: Implement Update Post API

Status: `DONE`

Endpoint: `PUT /admin/posts/:slug`

---

## POST-006

Task: Implement Delete Post API

Status: `DONE`

Endpoint: `DELETE /admin/posts/:slug`

---

## POST-007

Task: Implement Publish Post API

Status: `DONE`

Endpoint: `POST /admin/posts/:slug/publish`

---

## POST-008

Task: Implement Unpublish Post API

Status: `DONE`

Endpoint: `POST /admin/posts/:slug/unpublish`

---

## POST-009

Task: Implement Admin List Posts API

Status: `DONE`

Endpoint: `GET /admin/posts`

---

## ADMIN-POST-001

Task: Create Post List Page

Status: `DONE`

---

## ADMIN-POST-002

Task: Create Post Form — Article

Status: `DONE`

---

## ADMIN-POST-003

Task: Create Post Form — Carousel

Status: `DONE`

---

## ADMIN-POST-004

Task: Create Post Form — Video

Status: `DONE`

---

## ADMIN-POST-005

Task: Create Post Form — Stack Gallery

Status: `DONE`

---

---

# Phase 3 - Media Management

## MEDIA-001

Task: Create Media schema

Status: `DONE`

---

## MEDIA-002

Task: Create Mediable schema

Status: `DONE`

---

## MEDIA-003

Task: Setup Cloudflare R2 / MinIO

Status: `DONE`

Details:

```txt
- Setup local storage adapter (swappable with R2/MinIO)
- ServeStaticModule for uploads directory
```

---

## MEDIA-004

Task: Implement Upload Image API

Status: `DONE`

Endpoint: `POST /uploads/image`

---

## MEDIA-005

Task: Implement Upload Multiple Images API

Status: `DONE`

Endpoint: `POST /uploads/images`

---

## MEDIA-006

Task: Implement List Media API

Status: `DONE`

Endpoint: `GET /admin/media`

---

## MEDIA-007

Task: Implement Update Media API

Status: `DONE`

Endpoint: `PUT /admin/media/:id`

---

## MEDIA-008

Task: Implement Delete Media API

Status: `DONE`

Endpoint: `DELETE /admin/media/:id`

---

## ADMIN-MEDIA-001

Task: Create Media Library Page

Status: `DONE`

---

## ADMIN-MEDIA-002

Task: Create Media Uploader Component

Status: `DONE`

---

---

# Phase 4 - Playlist

## PL-001

Task: Create Playlist schema

Status: `DONE`

---

## PL-002

Task: Create PlaylistPost schema

Status: `DONE`

---

## PL-003

Task: Implement Create Playlist API

Status: `DONE`

Endpoint: `POST /admin/playlists`

---

## PL-004

Task: Implement List Playlists API (public)

Status: `DONE`

Endpoint: `GET /playlists`

---

## PL-005

Task: Implement Get Playlist Detail API (public)

Status: `DONE`

Endpoint: `GET /playlists/:slug`

---

## PL-006

Task: Implement Update Playlist API

Status: `DONE`

Endpoint: `PUT /admin/playlists/:slug`

---

## PL-007

Task: Implement Delete Playlist API

Status: `DONE`

Endpoint: `DELETE /admin/playlists/:slug`

---

## PL-008

Task: Implement Attach Posts to Playlist API

Status: `DONE`

Endpoint: `POST /admin/playlists/:slug/posts`

---

## PL-009

Task: Implement Detach Posts from Playlist API

Status: `DONE`

Endpoint: `DELETE /admin/playlists/:slug/posts`

---

## ADMIN-PL-001

Task: Create Playlist List Page

Status: `DONE`

---

## ADMIN-PL-002

Task: Create Playlist Form Page

Status: `DONE`

---

## ADMIN-PL-003

Task: Create Playlist Post Manager

Status: `DONE`

---

---

# Phase 5 - Engagement

## ENG-001

Task: Create PostView schema

Status: `DONE`

---

## ENG-002

Task: Create PostLike schema

Status: `DONE`

---

## ENG-003

Task: Implement Track View API

Status: `DONE`

Endpoint: `POST /posts/:slug/view` (internal / auto)

---

## ENG-004

Task: Implement Toggle Like API

Status: `DONE`

Endpoint: `POST /posts/:slug/like`

---

## ENG-005

Task: Implement Popular Posts API

Status: `DONE`

Endpoint: `GET /posts/popular`

---

---

# Phase 6 - Search

## SRCH-001

Task: Implement Search API

Status: `DONE`

Endpoint: `GET /search?q=...&type=...&tags=...`

---

## WEB-SRCH-001

Task: Create Explore Page (Nuxt)

Status: `DONE`

---

---

# Phase 7 - Analytics

## ANA-001

Task: Implement Analytics Overview API

Status: `DONE`

Endpoint: `GET /admin/analytics`

---

## ANA-002

Task: Implement Top Posts by Views API

Status: `DONE`

Endpoint: `GET /admin/analytics/posts?sort=views`

---

## ANA-003

Task: Implement Top Posts by Likes API

Status: `DONE`

Endpoint: `GET /admin/analytics/posts?sort=likes`

---

## ADMIN-ANA-001

Task: Create Analytics Dashboard Page

Status: `DONE`

---

---

# Phase 8 - Admin Polishing

## ADMIN-DASH-001

Task: Create Admin Dashboard

Status: `DONE`

---

## ADMIN-USER-001

Task: Create User Management Page

Status: `DONE`

---

## ADMIN-SET-001

Task: Create Profile Settings Page

Status: `DONE`

---

## ADMIN-SET-002

Task: Create Password Settings Page

Status: `DONE`

---

## ADMIN-SET-003

Task: Create Appearance Settings Page

Status: `DONE`

---

## ADMIN-SET-004

Task: Create 2FA Settings Page

Status: `DONE`

---

---

# Phase 9 - Public Site (Nuxt)

## WEB-HOME-001

Task: Create Home Page

Status: `DONE`

---

## WEB-POST-001

Task: Create Post Detail Page (SSR + SEO)

Status: `DONE`

---

## WEB-PL-001

Task: Create Playlist List Page

Status: `DONE`

---

## WEB-PL-002

Task: Create Playlist Detail Page

Status: `DONE`

---

## WEB-DARK-001

Task: Implement Dark Mode

Status: `DONE`

---

---

# Phase 10 - Production Ready

## PROD-001

Task: Setup Rate Limiter

Status: `DONE`

---

## PROD-002

Task: Setup Error Tracking

Status: `DONE`

---

## PROD-003

Task: Setup CI/CD (GitHub Actions)

Status: `DONE`

---

## PROD-004

Task: Docker Setup

Status: `DONE`

---

## PROD-005

Task: Production Deployment

Status: `DONE`

---

# Phase 11 - Cross-App Integration

## INT-001

Task: Add environment variables for cross-app redirection (VITE_WEB_URL for admin, VITE_ADMIN_URL for web)

Status: `DONE`

Details:
```txt
- Create .env and .env.example files for apps/admin and apps/web
- Update AdminLayout.vue in apps/admin to use dynamic VITE_WEB_URL
- Update default.vue layout in apps/web to use dynamic VITE_ADMIN_URL
- Type environment variables in apps/admin/env.d.ts
```

---

## INT-002

Task: Fix apps/web API calls, Prisma schema validation, database seed, and light/dark mode implementation

Status: `DONE`

Details:
```txt
- Remove invalid mediables relation from Post model in schema.prisma to allow successful prisma generation
- Run db seed to populate mock posts, tags, and users in local PostgreSQL
- Add Nitro routeRules proxy to apps/web/nuxt.config.ts to forward relative /api requests to NestJS server (port 3030)
- Add dark: classes to layouts/default.vue and all pages under apps/web/pages for full dark/light mode compatibility
```

---

## INT-003

Task: Migrate apps/admin/src/layouts/AdminLayout.vue hand-rolled HTML/SVG UI to PrimeVue components (ticket 3)

Status: `DONE`

Details:
```txt
- Sidebar nav (Main Menu + Settings) -> PrimeVue PanelMenu per section, route-driven
  submenu auto-expand replicated via a one-way controlled expandedKeys prop (no
  v-model), confirmed to match original v-if="item.submenu && isMenuItemActive(item)"
  behavior (not click-to-toggle)
- Menu item icons -> primeicons (pi-*) via an explicit route -> icon map
- Mobile sidebar -> PrimeVue Drawer (backdrop + click-outside + Escape to close,
  ~300ms transition, matches previous duration-300/translate-x)
- Breadcrumb -> PrimeVue Breadcrumb, 2 static levels (Admin / current section)
- Dark-mode toggle and logout trigger -> PrimeVue Button (icon-only), existing
  toggleDark/useTheme() and handleLogout/ConfirmDialog logic unchanged
- Avatar -> PrimeVue Avatar with a manual @error handler fallback to initials
  (PrimeVue Avatar does not auto-fallback when the image fails to load)
- "Visit Site" link -> PrimeVue Button as="a" link with pi-external-link icon
- No new dependencies added (primevue/primeicons already installed in apps/admin)
- KNOWN TRADE-OFF: PrimeVue Drawer only mounts while visible, so it cannot double
  as the static desktop sidebar the way the original single <aside> did with pure
  CSS. Sidebar nav/footer markup is duplicated (desktop <aside> block + mobile
  <Drawer> block), both reading the same reactive state/functions, so there is no
  behavioral drift but there is markup duplication. Candidate for a shared
  component extraction in a follow-up ticket (would require a new file, out of
  scope for ticket 3). See `.caf/tasks/3/verify-report.md` for full detail.
- Manual/browser smoke test (tasks.md Task 5) was NOT performed by the
  implementing agent (no automated UI test suite in apps/admin) — recommended
  before merge: submenu auto-expand under /settings/*, mobile drawer open/close,
  avatar broken-image fallback, dark mode persistence, logout confirm flow.
```

---

---

# Phase 12 - Product Catalog (Backend)

## PROD-CRUD-001

Task: Create Product schema (ticket 12)

Status: `DONE`

Details:

```txt
- Tambah enum ProductStatus (draft/published/archived) dan model Product
  ke schema.prisma (tidak ada userId/deletedAt — status archived berfungsi
  sebagai soft-delete)
- Jalankan migration (additive-only, tidak menyentuh table lain)
```

---

## PROD-CRUD-002

Task: Implement Product public API

Status: `DONE`

Endpoints:

```txt
GET /products
GET /products/:slug
```

Details:

```txt
- Hanya expose product dengan status = published
- 404 konsisten untuk not-found maupun draft/archived (tidak bocor existence)
```

---

## PROD-CRUD-003

Task: Implement Product admin API (CRUD + lifecycle)

Status: `DONE`

Endpoints:

```txt
GET    /admin/products
GET    /admin/products/:id
POST   /admin/products
PATCH  /admin/products/:id
POST   /admin/products/:id/publish
POST   /admin/products/:id/unpublish
POST   /admin/products/:id/archive
POST   /admin/products/:id/restore
```

Details:

```txt
- Guard: JwtAuthGuard + PermissionsGuard, permission baru manage_products
  (admin-only, tidak ada varian _own — Product tidak punya ownership)
- Validasi publish (cover, ctaUrl format URL valid, minimal 1 pipelineSteps,
  minimal 1 features) berlaku di semua jalur yang menghasilkan
  status = published (create, update/PATCH, dan endpoint publish dedicated),
  memakai data gabungan existing + body (bukan cuma field yang dikirim)
- Tambah permission manage_products ke prisma/seed.ts, dipetakan ke role
  admin saja
- Perbaikan additive pada AllExceptionsFilter supaya properti tambahan
  (mis. fields pada error validasi publish) ikut ter-serialize di response
  error, tanpa mengubah bentuk response untuk exception lain
- Lint/test tidak dapat dijalankan untuk apps/api (tidak ada script/config
  di package ini) — typecheck dan build (nest build) dipakai sebagai bukti
  utama non-regresi; lihat .caf/tasks/12/verify-report.md untuk detail.
```

---

---

# Phase 13 - Product Catalog (Admin UI)

## ADMIN-PROD-001

Task: Create Product List & Form Pages (apps/admin, ticket 13)

Status: `DONE`

Details:

```txt
- Module baru apps/admin/src/modules/products/{router,pages,stores,components}
  mengikuti struktur module Posts, terdaftar di core/global-routes.ts
- Router: /products, /products/create, /products/:id/edit (param id, BUKAN
  slug — beda dari pola Posts, mengikuti kontrak API admin /admin/products/:id)
- Pinia store product.store.ts: fetchProducts, fetchProductById, createProduct,
  updateProduct, publishProduct, unpublishProduct, archiveProduct,
  restoreProduct + helper konversi form <-> payload (cover UploadedMedia[] <->
  string url, sama pola dengan Posts)
- List page: DataTable, kolom name/slug/status(badge)/order/updatedAt, toggle
  sort order asc <-> updatedAt desc, aksi Publish/Unpublish/Archive/
  Un-archive(restore) per baris, ConfirmDialog untuk Archive, toast saat
  publish gagal berisi daftar field yang kurang
- Form (ProductForm.vue, dipakai bareng oleh create.vue & edit.vue): slug
  auto-generate dari name (client-side, tetap editable, disabled auto-sync
  saat edit), reuse RichTextEditor.vue (description) & MediaUploader.vue
  (cover, :multiple="false"), dua field repeatable (pipelineSteps, features)
  lewat komponen generik baru RepeatableListField.vue, validasi inline
  per-row, basic client-side format check untuk ctaUrl, dua tombol submit
  ("Simpan sebagai Draft" / "Simpan & Publish") — status di-derive dari
  tombol yang diklik, TIDAK ada dropdown status manual terpisah di form
- Banner error publish gagal: parse err.response.data.fields (bukan cuma
  .message, beda dari pola generik postsStore), highlight field terkait,
  input yang sudah diisi TIDAK hilang, status tetap draft
- Sidebar AdminLayout.vue: tambah entry "Products" (antara Posts dan
  Playlists) + icon pi-box
- Tidak ada script lint/test di apps/admin/package.json — verifikasi pakai
  typecheck (vue-tsc --noEmit) dan build (vue-tsc -b && vite build), keduanya
  PASS; lihat .caf/tasks/13/verify-report.md untuk detail lengkap
  (termasuk konfirmasi bentuk body error 400 publish via read-through
  AllExceptionsFilter, dan konfirmasi permission manage_products sudah ada
  di seed sehingga tidak ada blocker)
```

---

---

# Phase 14 - Product Catalog (Public Site)

## WEB-PROD-001

Task: Create Product Public Pages (apps/web, ticket 14)

Status: `DONE`

Endpoints (konsumsi, tanpa perubahan `apps/api`):

```txt
GET /products?page&limit
GET /products/:slug
GET /playlists/:slug
GET /search?tags&limit
```

Details:

```txt
- Nav item "Products" baru di apps/web/layouts/default.vue (satu entry di
  array navItems yang dipakai bersama sidebar desktop & bottom nav mobile,
  icon lucide:box)
- Komponen baru ProductCard.vue (apps/web/components/) — reusable, props
  product + size?: 'md' | 'lg', dipakai di grid /products (md) dan featured
  card homepage (lg), tanpa markup terduplikasi
- Komponen baru NotFoundState.vue (apps/web/components/) — ekstraksi pola
  404 inline (title/message/backLabel + BackButton), dipakai khusus untuk
  /products/:slug; posts/[slug].vue dan playlists/[slug].vue SENGAJA tidak
  dimigrasikan (di luar scope, tidak ada regresi ke halaman existing)
- Halaman baru apps/web/pages/products/index.vue — grid produk published
  (limit 24, tanpa pager UI), skeleton loading, EmptyState dengan link ke
  /explore atau /playlists
- Halaman baru apps/web/pages/products/[slug].vue — hero+CTA, pipeline
  strip, daftar fitur, section "Bukti" (sub-list playlist via
  GET /playlists/:slug + sub-list post terkait via
  GET /search?tags={slug}&limit=6, masing-masing v-if independen, section
  disembunyikan total kalau keduanya kosong), CTA penutup (posisi mengikuti
  v-if sekuensial), 404 via NotFoundState. Fetch playlist & related-posts
  pakai useAsyncData dengan default fallback supaya playlist/post yang
  tidak ada TIDAK ikut men-404-kan seluruh halaman produk
- apps/web/pages/index.vue — section baru "Featured Product" (setelah Hero,
  sebelum grid Recent Stories+Sidebar), filter featured dilakukan
  client-side (.find(p => p.featured) pada array yang sudah order asc dari
  backend) karena GET /products tidak punya param featured — lihat
  docs/api/api-contract.md (Products API > List Products) untuk catatan gap
  kontrak ini
- Tidak ada script lint/test di apps/web/package.json — verifikasi pakai
  typecheck (nuxi typecheck) dan build (nuxt build), keduanya PASS; lihat
  .caf/tasks/14/verify-report.md untuk detail lengkap
```


---

# Phase 15 - Hermes Integration (Backend & Admin UI)

## HERMES-001

Task: Extend Post API — atribusi sumber, dedup, kontrak untuk hermes (ticket 18)

Status: `DONE`

Endpoints (extend, tidak ada endpoint baru):

```txt
POST /admin/posts  (dedup by externalId, field baru sourceUrl/externalId)
```

Details:

```txt
- Tambah field sourceUrl (String?) dan externalId (String? @unique) ke model
  Post di schema.prisma, migration baru
  apps/api/prisma/migrations/20260829183715_add_post_source_url_external_id
- CreatePostDto: tambah sourceUrl?/externalId? (optional, @IsString
  @IsOptional, pola sama dengan cover) — post manual dari admin dashboard
  tetap valid tanpa field ini. UpdatePostDto ikut otomatis (PartialType).
- PostsService.create: dedup check SEBELUM slug generation/transaction —
  kalau dto.externalId truthy dan sudah ada post match (belum
  soft-deleted), TIDAK create baru, return post existing (wasExisting:
  true). Skip total kalau externalId tidak dikirim.
- PostsController.create: message "Post already exists for this
  externalId" untuk dedup-hit, "Post created" untuk create baru. HTTP
  status tetap sukses (200/201), bukan 409 Conflict — hermes adalah cron
  otomatis tanpa manusia yang membaca error real-time.
- Dokumentasi kontrak integrasi untuk hermes (VPS terpisah, di luar repo
  ini) ditambahkan sebagai section baru `# Hermes Integration (Ticket #18)`
  di docs/api/api-contract.md (dokumen kontrak API yang sudah ada, bukan
  file baru) — 3 endpoint (login, upload image, create post), field DTO
  relevan, behavior dedup final, batas upload 10MB existing (tidak diubah).
- Tidak ada script test untuk module posts di apps/api — verifikasi pakai
  typecheck + build (PASS) plus test fungsional ad-hoc via Prisma Client
  langsung ke DB lokal (dedup hit, unique constraint P2002, multiple NULL
  externalId tidak bentrok), dihapus setelah verify; lihat
  .caf/tasks/18/verify-report.md untuk detail lengkap.
- Di luar scope: logic scraping/cronjob di VPS hermes sendiri, tampilan
  sourceUrl di apps/admin (ticket 19, terpisah), auto-publish otomatis.
```

---

## HERMES-002

Task: Admin UI — tampilkan atribusi sumber draft hermes (apps/admin, ticket 19)

Status: `DONE`

Details:

```txt
- TIDAK ADA perubahan di apps/api — GET /admin/posts dan GET /admin/posts/:slug
  sudah mengembalikan sourceUrl apa adanya sejak ticket 18 (tidak ada select
  whitelist di query Prisma-nya), jadi seluruh scope ticket 19 murni frontend
- Interface Post di apps/admin/src/modules/posts/stores/post.store.ts: tambah
  sourceUrl?: string | null dan externalId?: string | null; TIDAK ditambahkan
  ke CreatePostPayload (field read-only, tidak pernah dikirim dari admin UI)
- List page (pages/list.vue): kolom Title menampilkan Tag PrimeVue
  (severity="info", icon pi-bolt, label "Hermes", title "Sourced from Hermes")
  di samping judul, v-if="data.sourceUrl" — post tanpa sourceUrl (draft manual)
  tidak berubah tampilannya
- Edit page (pages/edit.vue): SidebarCard baru (label "Source", icon pi-link)
  di kolom sidebar, v-if berdasarkan ref sourceUrl (di-set dari post.sourceUrl
  saat fetch sukses) — berisi link <a target="_blank" rel="noopener noreferrer">
  ke sourceUrl, teks "View original article ↗"; section ini tidak tampil sama
  sekali kalau sourceUrl kosong/null (bukan tampil dash/placeholder kosong)
- sourceUrl TIDAK dimasukkan ke form ref/payload yang dikirim ke
  PUT /admin/posts/:slug — field read-only, tidak ikut ter-overwrite null
- Tidak ada script lint/test di apps/admin/package.json — verifikasi pakai
  typecheck (vue-tsc --noEmit) dan build (vue-tsc -b && vite build), keduanya
  PASS. 3 item manual/browser checklist (badge tampil di list, link klik-able
  di edit, submit form tidak menghapus sourceUrl) TIDAK dijalankan oleh
  Implementer (tidak ada akses dev server/DB seeded di sesi tersebut) —
  direkomendasikan dicek manual sebelum merge; lihat
  .caf/tasks/19/verify-report.md untuk detail lengkap.
```

---

---

# Phase 16 - AI Content Generation (Backend)

## AI-CONTENT-001

Task: Implement AI Content Generation module — generate + cover commit
(apps/api, ticket 24)

Status: `DONE`

Endpoints:

```txt
POST /admin/ai-content/generate
POST /admin/ai-content/cover
```

Details:

```txt
- Modul baru apps/api/src/ai-content/ (module, controller, service,
  constants, dto/) — konvensi sama posts.controller.ts/media.controller.ts
  (@ApiTags, @ApiBearerAuth, @ApiOperation, response shape
  { success, message, data }), permission manage_own_posts/manage_all_posts
  (sama dengan Create Post, tidak ada permission baru)
- generateArticle(): panggil package baru `openai` (client OpenAI-compatible,
  base URL/model/API key configurable via env var, bukan hardcode ke OpenAI
  resmi) dengan built-in web search tool untuk cari 1 artikel trending
  (AI/Coding/Technology/Startup), system prompt Bahasa Indonesia (sapaan
  Aku/Kamu, tone ramah) hardcoded di ai-content.constants.ts, parse response
  jadi { title, content, coverUrl, sourceUrl }. Log durasi round-trip
  (structured log { event: 'ai_content_generate', durationMs, success })
  baik sukses maupun gagal. Config env kosong -> 500 pesan jelas; kegagalan
  provider/parsing -> 502.
- commitCover(imageUrl, userId): fetch server-side dengan timeout 15s,
  validasi Content-Type: image/* + limit 10MB, bungkus jadi
  Express.Multer.File-compatible object, panggil MediaService.upload()
  existing (reuse langsung dari MediaModule, tidak reimplement logic
  upload). Endpoint ini TIDAK memanggil POST /admin/posts — caller
  (apps/admin, ticket 25) yang memanggil POST /admin/posts setelahnya
  dengan cover sudah berupa URL internal, supaya CreatePostDto/
  POST /admin/posts tetap tidak berubah kontraknya.
- Env var baru AI_CONTENT_LLM_API_KEY/AI_CONTENT_LLM_BASE_URL/
  AI_CONTENT_LLM_MODEL ditambahkan ke apps/api/.env.example (placeholder,
  tanpa kredensial asli) — pola sama JWT_SECRET
- Dependency baru: package `openai` di apps/api/package.json
- AiContentModule didaftarkan di apps/api/src/app.module.ts (import
  MediaModule untuk MediaService)
- Unit test ai-content.service.spec.ts ditulis mengikuti kontrak Jest +
  @nestjs/testing standar, tapi TIDAK bisa dieksekusi di lingkungan ini —
  tidak ada script test/jest/@types+jest terpasang di apps/api (gap
  infra repo-wide, bukan spesifik modul ini, dicatat non-blocking)
- Typecheck (tsc --noEmit) dan build (nest build) PASS. Smoke check
  konfigurasi kosong (tanpa kredensial LLM asli) diverifikasi via
  pembacaan kode, tidak dijalankan end-to-end lewat HTTP request nyata;
  lihat .caf/tasks/24/verify-report.md untuk detail lengkap
- Di luar scope: apapun di apps/admin (halaman AI Agent, grid card,
  preview UI — ticket 25 terpisah), generate untuk carousel/video/
  stack_gallery, dedup otomatis, batch generate, kustomisasi system
  prompt dari frontend, multi-provider LLM/fallback, retry otomatis
```

---

---

# Phase 17 - Agency Pivot (Public Site)

Sumber kebenaran: `docs/development/agency-pivot/plan.md`, `requirements.md`,
dan `tasks.md` (detail, file, dan acceptance tiap task ada di `tasks.md`).
Dikerjakan satu task pada satu waktu, berurutan.

## TASK-0

Task: Isi CLAUDE.md (konvensi kode, konteks bisnis, perintah verifikasi)

Status: `DONE`

Details:

```txt
- Semua TODO di CLAUDE.md diisi dari kondisi repo dan dokumen agency-pivot
- Perintah verifikasi nyata: pnpm typecheck, pnpm lint, pnpm build (root, turbo)
- Dicatat: tidak ada workspace yang punya skrip lint maupun test (pnpm lint
  menjalankan 0 task); *.spec.ts di apps/api tidak bisa dieksekusi
- Referensi .ai/tasks/README.md diperbaiki ke .caf/tasks/README.md (folder .ai
  tidak ada di repo)
```

---

## AGENCY-001

Task: Izinkan `mailto:` pada CTA produk

Status: `DONE`

Details:

```txt
- Aturan baru di apps/api/src/products/dto/cta-url.validator.ts: isCtaUrl()
  + decorator @IsCtaUrl(). ctaUrl valid bila URL http(s) absolut, atau
  mailto: ke satu alamat email valid (query seperti ?subject=... boleh).
- CreateProductDto (dan UpdateProductDto lewat PartialType) memakai
  @IsCtaUrl() menggantikan @IsUrl(); ProductsService.assertPublishable()
  memakai isCtaUrl() yang sama, jadi simpan dan publish satu aturan.
- PERUBAHAN PERILAKU: aturan lama (@IsUrl()/isURL() bawaan) menerima URL
  tanpa protokol (example.com) dan ftp://. Sekarang keduanya ditolak,
  sesuai FR-1 (hanya http(s) atau mailto:). Produk lama dengan ctaUrl
  tanpa protokol akan gagal disimpan ulang/dipublish sampai diperbaiki.
- apps/admin ProductForm.vue: hint dan placeholder memakai contoh
  mailto:coderium.id@gmail.com?subject=Diskusi%20pilot; cek format di klien
  mengikuti aturan yang sama. Label ctaUrl di PUBLISH_FIELD_LABELS
  (product.store.ts) disesuaikan.
- apps/web pages/products/[slug].vue: kedua tombol CTA tidak memakai
  target="_blank"/rel bila ctaUrl berupa mailto:.
- products.service.spec.ts ditambah kasus mailto dan URL tidak valid, tetapi
  TIDAK dieksekusi (apps/api tidak punya test runner). Aturan diuji ad-hoc
  lewat dist hasil build: 13 kasus isCtaUrl() + validasi CreateProductDto,
  semua sesuai. pnpm typecheck dan pnpm build PASS.
- Belum diuji: simpan/publish lewat HTTP dan DB nyata, tampilan form admin
  dan klik tombol di browser.
```

---

## AGENCY-002

Task: Tambah field `badge`, `proof`, `faq` pada Product

Status: `DONE`

Details:

```txt
- schema.prisma: Product.badge String?, proof Json?, faq Json? (tanpa default).
  Migration 20261009120000_add_product_badge_proof_faq: satu ALTER TABLE
  "products" ADD COLUMN x3, additive, tidak menyentuh tabel lain. SQL ditulis
  tangan (tidak ada DB lokal yang dipakai) dan sama persis dengan keluaran
  `prisma migrate diff` skema lama -> skema baru.
- MIGRATION BELUM DIJALANKAN di database mana pun. Backup dulu sebelum
  deploy (prisma migrate deploy).
- packages/shared-types: ProductProofMetric, ProductProof, ProductFaqItem.
  apps/api menambah devDependency @coderium/shared-types (app pertama yang
  memakainya; pnpm-lock.yaml ikut berubah); DTO meng-implements tipe itu.
- DTO baru product-proof.dto.ts (ProofMetricDto, ProductProofDto) dan
  faq-item.dto.ts (FaqItemDto). Batas (keputusan implementasi, bisa diubah):
  badge <= 60 karakter; proof.metrics <= 8 item, label <= 60, value <= 40,
  note <= 500; faq <= 20 item, question <= 200, answer <= 2000.
- Mengosongkan field: kirim null (badge, proof, faq) atau [] (faq).
  ProductsService memetakan null pada proof/faq ke Prisma.DbNull.
- Response publik dan admin mengembalikan field baru tanpa perubahan lain
  (service mengembalikan baris Product utuh, tidak ada select whitelist).
- Validasi DTO diuji ad-hoc lewat dist (18 kasus valid/tidak valid, semua
  sesuai). pnpm typecheck dan pnpm build PASS.
- Belum diuji: simpan dan baca field lewat HTTP + DB nyata.
```

---

## AGENCY-003

Task: Form admin untuk badge, proof, dan FAQ

Status: `DONE`

Details:

```txt
- ProductForm.vue: input Badge, editor Proof (daftar metrik label + value
  dengan tambah/hapus/urut, plus textarea catatan), editor FAQ (question +
  answer, tambah/hapus/urut).
- RepeatableListField.vue digeneralisasi (bukan komponen baru): prop opsional
  titleKey/descriptionKey, label, placeholder, descriptionRequired,
  descriptionMultiline, maxlength, maxItems. Default tidak berubah, jadi
  pemakaian pipelineSteps/features tetap sama. Perubahan internal: baris
  diperbarui lewat emit array baru, tidak lagi mutasi item di tempat.
- product.store.ts: Product/ProductPayload/ProductFormData menambah badge,
  proof, faq (tipe dari @coderium/shared-types, devDependency baru di
  apps/admin). Form menyimpan proof sebagai proofMetrics + proofNote dan
  dirakit ulang di toProductPayload. Field kosong dikirim null supaya bisa
  dikosongkan saat edit. PRODUCT_LIMITS menyalin batas dari DTO API.
- Validasi: baris metrik/FAQ yang belum lengkap ditandai merah dan kedua
  tombol simpan ditahan (pesan di atas tombol) sampai baris dilengkapi atau
  dihapus. maxlength dan batas jumlah item mengikuti DTO.
- typecheck (vue-tsc) dan build admin PASS.
- Belum diuji di browser: simpan, muat ulang saat edit, tampilan error, dan
  regresi editor pipelineSteps/features setelah generalisasi komponen.
```

---

## AGENCY-004

Task: Render badge, description, bukti, FAQ, dan CTA di detail produk

Status: `DONE`

Details:

```txt
- apps/web/pages/products/[slug].vue: badge (pill di atas judul), description
  setelah hero, blok "Hasil dari pemakaian kami sendiri" (metrics + note),
  FAQ, CTA penutup memakai ctaUrl (mailto tanpa target="_blank", dari
  AGENCY-001). Tiap bagian v-if sendiri; bagian kosong tidak dirender.
- description adalah HTML dari RichTextEditor admin: disanitasi dengan
  DOMPurify (profil html) lalu dirender v-html di dalam .prose-medium, pola
  yang sama dengan isi artikel. Markup kosong (<p></p>) dianggap tidak ada.
  Fallback meta description kini membuang tag HTML.
- Komponen baru apps/web/components/FaqAccordion.vue: button + aria-expanded
  + aria-controls, tinggi minimal 44px, jawaban v-show (tetap ada di HTML
  SSR). Generik (props items), bisa dipakai lagi di /work-with-us.
- composables/useJsonLd.ts: helper faqPageJsonLd(); JSON-LD FAQPage hanya
  dipasang bila faq ada.
- Tipe proof/faq dari @coderium/shared-types (devDependency baru di apps/web).
- Diverifikasi lewat SSR nyata: build web dijalankan terhadap mock API,
  HTML produk "lengkap" dan "kosong" diperiksa: badge, description
  (tag <script> terbuang), blok bukti, FAQ, FAQPage, CTA mailto tanpa
  target; produk kosong tidak merender satu pun bagian baru dan CTA http
  tetap target="_blank". pnpm typecheck dan pnpm build PASS.
- Belum diuji: tampilan visual di browser (mobile, dark mode), klik
  buka-tutup FAQ, dan data dari API/DB nyata.
```

---

## AGENCY-005

Task: Halaman `/work-with-us`

Status: `DONE`

Details:

```txt
- Halaman baru apps/web/pages/work-with-us.vue, statis, bahasa Indonesia:
  header + CTA, dua pilot dan harganya (termasuk harga perintis dan
  Rp2.000.000 di muka fit check CAF), kartu harga perintis (diskon 30%
  dengan izin studi kasus) dan retainer, syarat dari klien, FAQ, CTA penutup.
- Semua harga, durasi, dan syarat disalin dari requirements.md bagian Data;
  tidak ada angka atau klaim baru.
- FAQ (6 butir) disusun hanya dari fakta di requirements.md (merge tetap
  keputusan manusia, tiket yang belum dikerjakan, Jira/GitLab di rencana,
  belum ada SLA, arti harga perintis, cara mulai). Teksnya perlu direview
  pemilik produk.
- CTA: mailto:coderium.id@gmail.com dengan subjek terisi ("Diskusi pilot",
  "Diskusi pilot AI Code Review", "Diskusi pilot CAF"), tanpa target.
- Pakai ulang useSeo, useJsonLd + faqPageJsonLd (FAQPage), FaqAccordion.
- Warna masih abu/hitam seperti halaman produk; token indigo baru masuk di
  AGENCY-007. Tautan ke halaman ini dari navigasi masuk di AGENCY-006.
- Route dicatat di docs/frontend/frontend-routes.md.
- Diverifikasi lewat SSR nyata (build web + mock API): HTTP 200, semua harga
  dan syarat ada di HTML, title/canonical/FAQPage ada, tiga tautan mailto
  bersubjek, /work-with-us muncul di sitemap.xml. pnpm typecheck dan
  pnpm build PASS.
- Belum diuji: tampilan visual di browser (mobile, dark mode).
```

---

## AGENCY-006

Task: Layout menu atas dan footer

Status: `DONE`

Details:

```txt
- apps/web/layouts/default.vue: sidebar desktop dan bottom nav mobile dihapus,
  diganti header menu atas: logo, Produk (/products), Kerja Sama
  (/work-with-us), Artikel (/explore, aktif juga di /posts/*), Series
  (/playlists), tombol pill "Kirim email"
  (mailto:coderium.id@gmail.com?subject=Diskusi%20pilot). Tombol "Write" dan
  variabel adminUrl dihapus dari layout. Dark mode toggle dipertahankan.
- Mobile (< md): tombol menu (aria-expanded, aria-controls) membuka panel
  lipat berisi empat tautan + tombol "Kirim email"; menutup otomatis setelah
  navigasi. Tombol dan tautan menu 44px.
- Footer: Produk, Kerja Sama, Artikel, Tentang, coderium.id@gmail.com (mailto).
  Tautan Terms dan Privacy dipertahankan di baris copyright supaya halaman
  legal tidak yatim.
- Konten utama kini selebar max-w-7xl tanpa kolom sidebar; padding bawah
  untuk bottom nav (pb-16) dihapus.
- Di luar daftar file task, akibat langsung hilangnya bottom nav:
  PostActionBar.vue mobile bottom-20 -> bottom-6.
- JSON-LD Organization/WebSite di layout tidak diubah (AGENCY-008).
- Diverifikasi: build web dijalankan terhadap mock API; /, /products,
  /products/:slug, /work-with-us, /explore, /playlists, /playlists/:slug,
  /posts/:slug, /about, /terms semua HTTP 200 dengan menu baru, tanpa
  "Write". Di Chrome: desktop terang dan gelap (/explore, /posts/:slug,
  /playlists, /work-with-us), viewport 390px (menu buka/tutup, tutup setelah
  navigasi, target 44px, tanpa scroll horizontal, dark mode).
  pnpm typecheck dan pnpm build PASS.
- Belum diuji: perangkat nyata, data produksi, halaman beranda secara visual
  (dirombak di AGENCY-007).
```

---

## AGENCY-007

Task: Beranda agency (Opsi B), font, dan token warna

Status: `DONE`

Details:

```txt
- Dikerjakan ulang pada 2026-10-10: FR-6 diganti dari beranda lama (hero +
  panel terminal) ke Opsi B (editorial agency). Bagian font dan token dari
  pengerjaan pertama tidak berubah: Inter dan JetBrains Mono dimuat di
  main.css (--font-sans / --font-mono), warna utama #3730D9 sebagai token
  @theme --color-primary, Charter tetap untuk isi artikel, dan
  docs/frontend/design-system.md sudah memakai #3730D9.
- pages/index.vue ditulis ulang mengikuti FR-6 Opsi B: hero "Coderium. AI
  Agency." + strip tiga janji, strip "Terhubung dengan", 01 Apa itu
  Coderium, 02 dua panel produk (GET /products; panel gelap untuk produk
  featured dengan badge dan maks 3 metrik dari proof, panel terang untuk
  produk kedua), 03 Diskusi/pilot/laporan, 04 tabel Pasang sendiri vs Pilot
  (tabel di desktop, satu kolom di mobile), 05 tiga kartu paket, 06 Tentang,
  07 FAQ enam pertanyaan dua kolom + JSON-LD FAQPage, 08 tiga kartu artikel
  (gambar, tanggal, judul), 09 blok Kontak gelap.
- Sumber harga bersama: composables/usePricing.ts (pricingPlans,
  PIONEER_PRICE_NOTE, CLIENT_COST_NOTE). pages/work-with-us.vue kini membaca
  dari file ini, jadi harga beranda dan /work-with-us identik.
- Komponen baru components/HomeSectionHeading.vue (nomor + judul section).
- Footer (layouts/default.vue) diganti mengikuti FR-6.12 atas keputusan
  pemilik produk: gelap di kedua tema, berkolom Layanan (Produk, Kerja Sama),
  Perusahaan (Tentang, Artikel, Series), Kontak (coderium.id@gmail.com). Berlaku
  di semua halaman web. Terms dan Privacy tetap di baris copyright. FR-5 di
  requirements.md masih menulis footer lama.
- Catatan kaki panel produk: memakai proof.note dari admin; bila kosong,
  fallback ke angka di requirements.md bagian Data (7 PR menunggu review,
  2 ditutup, keduanya tiket keamanan). Tanpa produk terpublikasi, section 02
  tidak dirender.
- Kartu Retainer tidak menampilkan harga perintis: bagian Data hanya
  mencatat harga perintis untuk dua pilot.
- Teks hero, definisi, tiga langkah, isi tabel perbandingan, Tentang, dan FAQ
  disusun dari fakta di requirements.md; perlu direview pemilik produk,
  terutama baris "Ukuran keberhasilan" dan langkah "Laporan" yang tidak punya
  rincian di bagian Data.
- Tombol "Lihat layanan" mengarah ke /products.
- HeroTerminal.vue, FeaturedProductCard.vue, dan PopularPostItem.vue tidak
  lagi dipakai; file tidak dihapus.
- MOCKUP TIDAK BISA DIBUKA: kanvas "Mockup Beranda Coderium (Agency)" tidak
  terjangkau (server MCP pencil gagal konek), jadi acceptance "sesuai mockup
  Opsi B" BELUM diverifikasi. Tata letak dibangun dari teks FR-6.
- Diverifikasi: build web dijalankan terhadap mock API; /, /work-with-us,
  /explore, /about HTTP 200; isi SSR beranda dan /work-with-us diperiksa
  (harga sama, tidak ada "Stay curious" maupun hero lama). Di Chrome: desktop
  1440 terang (bagian atas) dan gelap; lebar 390px lewat iframe: satu kolom,
  tanpa scroll horizontal. pnpm typecheck dan build web PASS.
- Perapian layout (2026-10-10, setelah review visual): padding ganda di
  beranda dihapus sehingga konten sejajar dengan header dan footer; tiap
  section memakai pola yang sama (label bernomor + judul besar) lewat
  HomeSectionHeading; hero dua kolom dengan tiga janji di kanan dan strip
  "Terhubung dengan" di bawahnya; section 01 dan 06 dua kolom; panel produk
  tanpa metrik menampilkan maks 3 judul features dari API; kartu Pilot CAF
  ditonjolkan (ring + tombol penuh), dua kartu lain tombol outline; blok
  Kontak menyatu dengan footer; tombol "Kirim email" di header memakai
  token primary.
- Section 08 Artikel terbaru memakai UI daftar yang sama dengan /explore
  (PostListItem + pembatas), atas permintaan pemilik produk; bukan tiga kartu
  bergambar seperti teks FR-6.10.
- Judul besar tiap section adalah draf dan perlu direview pemilik produk:
  "AI agency untuk tim engineering.", "Dua produk, kami buat dan kami pakai
  sendiri.", "Diskusi, pilot, laporan.", "Pasang sendiri, atau pilot bersama
  kami.", "Harga terbuka, mulai dari satu repo.", "Yang sering ditanyakan.",
  "Artikel terbaru.".
- Diverifikasi setelah perapian: typecheck dan build web PASS; Chrome desktop
  1440 terang (seluruh halaman) dan lebar 390px gelap lewat iframe (tanpa
  scroll horizontal, tidak ada tautan/tombol di bawah 44px, sebagian halaman
  dilihat).
- Bahasa (2026-10-10, atas permintaan pemilik produk): seluruh teks UI
  apps/web yang masih berbahasa Inggris diterjemahkan ke Indonesia, di luar
  daftar file task ini: /explore (judul "Artikel"), /playlists dan
  /playlists/:slug, /products dan /products/:slug, /posts/:slug, /terms,
  /privacy, tautan Ketentuan/Privasi di footer, NotFoundState,
  EndOfListMessage, PostActionBar, PostListItem, PopularPostItem, UserAvatar.
  useFormatters.ts: tanggal id-ID, "menit baca", dan postTypeLabel bersama
  (salinan lokal di /products/:slug dihapus). Nama breadcrumb JSON-LD ikut
  diterjemahkan. Teks /terms dan /privacy adalah terjemahan langsung dan
  perlu direview pemilik produk. Konten dari API (artikel, series, produk)
  tidak diterjemahkan. HeroTerminal dan FeaturedProductCard (tidak dipakai)
  tidak disentuh.
- Konsistensi UI seluruh apps/web (2026-10-10, atas permintaan pemilik
  produk): kelas bersama di main.css (@layer components: page-shell,
  section-title, body-copy, card, btn, btn-solid, btn-outline, text-link)
  dan komponen baru PageHeader.vue (judul besar font-black + lead). Dipakai
  di /explore, /playlists, /playlists/:slug, /products, /products/:slug,
  /posts/:slug, /about, /terms, /privacy, /work-with-us, NotFoundState,
  BackButton, ProductCard, dan beranda. Padding ganda dihapus di semua
  halaman (konten sejajar header/footer), aksen biru dan tombol hitam diganti
  token primary, kartu rounded-2xl, judul section seragam. /products/:slug
  kini selebar halaman dengan hero dua kolom; teks panjang dibatasi max-w-3xl
  rata kiri. /posts/:slug tetap kolom baca terpusat.
- Diverifikasi di Chrome desktop terang: header dan kerangka /explore,
  /playlists, /products, /work-with-us, /privacy, serta keadaan kosong dan
  tidak-ditemukan. Belum diuji: daftar dan halaman detail (artikel, series,
  produk) DENGAN DATA, karena proxy /api di build lokal mengarah ke API lokal
  yang kosong; juga mobile dan dark mode untuk halaman selain beranda.
- Hero beranda dibuat lebih modern (2026-10-10, atas permintaan pemilik
  produk): latar grid tipis dan cahaya indigo selebar layar (dekoratif,
  aria-hidden), label kecil berkedip "AI agency untuk tim engineering",
  "AI Agency." bergradasi indigo, tiga janji dan daftar "Terhubung dengan"
  sebagai kartu tembus pandang. Blok Kontak memakai latar grid yang sama.
  Kelas hero-grid, hero-glow, glass-card di main.css. Gradasi memakai indigo
  saja, bukan gradien biru-ungu logo.
- Footer dan blok Kontak di dark mode memakai abu gelap netral #18181b (bukan biru gelap);
  mode terang tidak berubah.
- Rute halaman Kerja Sama diganti dari /kerja-sama ke /work-with-us
  (2026-10-10, keputusan pemilik produk; file pages/work-with-us.vue). Label
  menu tetap "Kerja Sama". Tanpa redirect dari rute lama. Baris rute di
  "Keputusan yang sudah final" plan.md dan semua dokumen ikut diperbarui.
- Istilah "pilot" di teks situs diganti "uji coba" (2026-10-10, permintaan
  pemilik produk, supaya lebih mudah dipahami), termasuk nama paket ("Uji
  coba AI Code Review", "Uji coba CAF") dan subjek email. requirements.md
  dan plan.md masih memakai kata "pilot".
- Rute artikel diganti (2026-10-10, keputusan pemilik produk): daftar
  /explore -> /articles (pages/articles/index.vue), detail /posts/:slug ->
  /articles/:slug (pages/articles/[slug].vue). Semua tautan, sitemap,
  canonical, breadcrumb, dan SearchAction JSON-LD ikut. Redirect 301 dari
  /explore dan /posts/** ditambahkan di routeRules (nuxt.config.ts) supaya
  URL artikel lama tetap jalan. Endpoint API /posts tidak berubah. Entri
  backlog di atas masih menyebut rute lama.
- Email kontak diganti dari alamat @coderium.id lama ke coderium.id@gmail.com
  (2026-10-10, keputusan pemilik produk) di seluruh repo: apps/web, hint
  admin, contoh DTO dan spec API, seeder, CLAUDE.md, dan dokumen termasuk
  "Keputusan yang sudah final" di plan.md.
- Footer mode terang diganti jadi abu sangat terang (neutral-50) dengan
  teks gelap dan logo berwarna (2026-10-10, permintaan pemilik produk);
  dark mode tetap abu gelap. Ini menyimpang dari "footer gelap" di FR-6.12.
  Blok Kontak beranda tidak lagi menyatu dengan footer: kini kartu gelap
  tersendiri di kedua tema.
- Belum diuji: kesesuaian dengan mockup, desktop gelap setelah perapian,
  footer baru di halaman lain secara visual, perangkat nyata, data produksi.
```

---

## AGENCY-008

Task: Identitas, SEO, dan About

Status: `DONE`

Details:

```txt
- nuxt.config.ts: meta description default diganti dari "Coderium - Tech
  Blog & Resources" ke identitas AI agency; ditambah htmlAttrs lang="id"
  (tambahan di luar daftar detail task, karena halaman baru berbahasa
  Indonesia).
- composables/useSeo.ts: DEFAULT_DESCRIPTION memakai kalimat yang sama.
- layouts/default.vue: JSON-LD Organization menambah description dan
  contactPoint (email coderium.id@gmail.com, contactType "sales",
  availableLanguage id).
- pages/about.vue ditulis ulang dalam bahasa Indonesia: apa yang kami buat
  (CAF, AI Code Reviewer), cara kerja pilot, artikel sebagai pelengkap,
  kontak email (mailto bersubjek). Isi hanya dari fakta di requirements.md.
- Tidak ada lagi teks "tech blog" di apps/web (grep bersih). Teks halaman
  Series/Explore yang memang soal artikel tidak diubah.
- Diverifikasi lewat SSR (build web + mock API): lang, title/description
  About, dan Organization JSON-LD. Description default tidak diperiksa di
  halaman nyata (semua halaman yang dicek punya description sendiri).
  pnpm typecheck dan pnpm build PASS.
- Belum diuji: pratinjau OG di layanan nyata (masuk AGENCY-011).
```

---

## AGENCY-009

Task: [Manual] Isi konten produk lewat admin

Status: `TODO`

---

## AGENCY-010

Task: [Manual + CAF] Perbarui dokumen proyek

Status: `DONE`

Details:

```txt
- CLAUDE.md: sudah diisi di TASK-0 (masih menunggu review manusia).
- docs/product/requirements.md: Product Positioning diganti ke situs AI
  agency untuk tim engineering (dua produk, kontak email, artikel sebagai
  pelengkap). Bagian lain PRD tidak diubah.
- docs/frontend/frontend-routes.md: tambah /products, /products/:slug
  (/work-with-us sudah masuk di AGENCY-005); deskripsi route / diperbarui.
- backlog.md dan progress.md: Phase 17 dan status tiap task diperbarui di
  akhir setiap task.
- Bagian manual yang tersisa: review teks Product Positioning dan CLAUDE.md.
- Belum disentuh (di luar daftar task): Product Summary di AGENTS.md masih
  menyebut platform Content Publishing; docs/frontend/layouts.md,
  ui-pages.md, dan module-breakdown.md masih menggambarkan sidebar/beranda
  lama; api-contract.md dan prisma-schema-design.md sudah diperbarui untuk
  field produk baru.
```

---

## AGENCY-011

Task: [Manual] QA dan rilis

Status: `TODO`

---
