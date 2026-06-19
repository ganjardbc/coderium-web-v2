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

Status: `NOT_STARTED`

Details:

```txt
- Install prisma
- Buat schema.prisma awal
- Setup DatabaseModule
- Setup PrismaService
```

---

## API-003

Task: Setup PostgreSQL connection

Status: `NOT_STARTED`

---

## API-004

Task: Create initial Prisma schema

Status: `NOT_STARTED`

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

Status: `NOT_STARTED`

Details:

```txt
- Tambah User model ke schema.prisma
- Jalankan migration
```

---

## AUTH-002

Task: Create Roles schema

Status: `NOT_STARTED`

Details:

```txt
- Tambah Role, Permission, UserRole, RolePermission ke schema.prisma
- Jalankan migration
```

---

## AUTH-003

Task: Create Auth Module (NestJS)

Status: `NOT_STARTED`

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

Status: `NOT_STARTED`

Endpoint: `POST /auth/register`

---

## AUTH-005

Task: Implement Login API

Status: `NOT_STARTED`

Endpoint: `POST /auth/login`

---

## AUTH-006

Task: Implement Logout API

Status: `NOT_STARTED`

Endpoint: `POST /auth/logout`

---

## AUTH-007

Task: Implement Current User API

Status: `NOT_STARTED`

Endpoint: `GET /auth/me`

---

## AUTH-008

Task: Implement Forgot Password API

Status: `NOT_STARTED`

Endpoint: `POST /auth/forgot-password`

---

## AUTH-009

Task: Implement JWT Guard

Status: `NOT_STARTED`

---

## AUTH-010

Task: Implement Permissions Guard

Status: `NOT_STARTED`

---

## AUTH-011

Task: Seed Roles dan Permissions

Status: `NOT_STARTED`

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

Status: `NOT_STARTED`

---

## ADMIN-AUTH-002

Task: Create Register Page

Status: `NOT_STARTED`

---

## ADMIN-AUTH-003

Task: Create Forgot Password Page

Status: `NOT_STARTED`

---

---

# Phase 2 - Post Core

## POST-001

Task: Create Post schema

Status: `NOT_STARTED`

Details:

```txt
- Tambah Post model ke schema.prisma
- Jalankan migration
```

---

## POST-002

Task: Implement Create Post API

Status: `NOT_STARTED`

Endpoint: `POST /admin/posts`

---

## POST-003

Task: Implement List Posts API (public)

Status: `NOT_STARTED`

Endpoints:

```txt
GET /posts
GET /posts/recent
GET /posts/popular
```

---

## POST-004

Task: Implement Get Post Detail API (public)

Status: `NOT_STARTED`

Endpoint: `GET /posts/:slug`

---

## POST-005

Task: Implement Update Post API

Status: `NOT_STARTED`

Endpoint: `PUT /admin/posts/:slug`

---

## POST-006

Task: Implement Delete Post API

Status: `NOT_STARTED`

Endpoint: `DELETE /admin/posts/:slug`

---

## POST-007

Task: Implement Publish Post API

Status: `NOT_STARTED`

Endpoint: `POST /admin/posts/:slug/publish`

---

## POST-008

Task: Implement Unpublish Post API

Status: `NOT_STARTED`

Endpoint: `POST /admin/posts/:slug/unpublish`

---

## POST-009

Task: Implement Admin List Posts API

Status: `NOT_STARTED`

Endpoint: `GET /admin/posts`

---

## ADMIN-POST-001

Task: Create Post List Page

Status: `NOT_STARTED`

---

## ADMIN-POST-002

Task: Create Post Form — Article

Status: `NOT_STARTED`

---

## ADMIN-POST-003

Task: Create Post Form — Carousel

Status: `NOT_STARTED`

---

## ADMIN-POST-004

Task: Create Post Form — Video

Status: `NOT_STARTED`

---

## ADMIN-POST-005

Task: Create Post Form — Stack Gallery

Status: `NOT_STARTED`

---

---

# Phase 3 - Media Management

## MEDIA-001

Task: Create Media schema

Status: `NOT_STARTED`

---

## MEDIA-002

Task: Create Mediable schema

Status: `NOT_STARTED`

---

## MEDIA-003

Task: Setup Cloudflare R2 / MinIO

Status: `NOT_STARTED`

---

## MEDIA-004

Task: Implement Upload Image API

Status: `NOT_STARTED`

Endpoint: `POST /uploads/image`

---

## MEDIA-005

Task: Implement Upload Multiple Images API

Status: `NOT_STARTED`

Endpoint: `POST /uploads/images`

---

## MEDIA-006

Task: Implement List Media API

Status: `NOT_STARTED`

Endpoint: `GET /admin/media`

---

## MEDIA-007

Task: Implement Update Media API

Status: `NOT_STARTED`

Endpoint: `PUT /admin/media/:id`

---

## MEDIA-008

Task: Implement Delete Media API

Status: `NOT_STARTED`

Endpoint: `DELETE /admin/media/:id`

---

## ADMIN-MEDIA-001

Task: Create Media Library Page

Status: `NOT_STARTED`

---

## ADMIN-MEDIA-002

Task: Create Media Uploader Component

Status: `NOT_STARTED`

---

---

# Phase 4 - Playlist

## PL-001

Task: Create Playlist schema

Status: `NOT_STARTED`

---

## PL-002

Task: Create PlaylistPost schema

Status: `NOT_STARTED`

---

## PL-003

Task: Implement Create Playlist API

Status: `NOT_STARTED`

Endpoint: `POST /admin/playlists`

---

## PL-004

Task: Implement List Playlists API (public)

Status: `NOT_STARTED`

Endpoint: `GET /playlists`

---

## PL-005

Task: Implement Get Playlist Detail API (public)

Status: `NOT_STARTED`

Endpoint: `GET /playlists/:slug`

---

## PL-006

Task: Implement Update Playlist API

Status: `NOT_STARTED`

Endpoint: `PUT /admin/playlists/:slug`

---

## PL-007

Task: Implement Delete Playlist API

Status: `NOT_STARTED`

Endpoint: `DELETE /admin/playlists/:slug`

---

## PL-008

Task: Implement Attach Posts to Playlist API

Status: `NOT_STARTED`

Endpoint: `POST /admin/playlists/:slug/posts`

---

## PL-009

Task: Implement Detach Posts from Playlist API

Status: `NOT_STARTED`

Endpoint: `DELETE /admin/playlists/:slug/posts`

---

## ADMIN-PL-001

Task: Create Playlist List Page

Status: `NOT_STARTED`

---

## ADMIN-PL-002

Task: Create Playlist Form Page

Status: `NOT_STARTED`

---

## ADMIN-PL-003

Task: Create Playlist Post Manager

Status: `NOT_STARTED`

---

---

# Phase 5 - Engagement

## ENG-001

Task: Create PostView schema

Status: `NOT_STARTED`

---

## ENG-002

Task: Create PostLike schema

Status: `NOT_STARTED`

---

## ENG-003

Task: Implement Track View API

Status: `NOT_STARTED`

Endpoint: `POST /posts/:slug/view` (internal / auto)

---

## ENG-004

Task: Implement Toggle Like API

Status: `NOT_STARTED`

Endpoint: `POST /posts/:slug/like`

---

## ENG-005

Task: Implement Popular Posts API

Status: `NOT_STARTED`

Endpoint: `GET /posts/popular`

---

---

# Phase 6 - Search

## SRCH-001

Task: Implement Search API

Status: `NOT_STARTED`

Endpoint: `GET /search?q=...&type=...&tags=...`

---

## WEB-SRCH-001

Task: Create Explore Page (Nuxt)

Status: `NOT_STARTED`

---

---

# Phase 7 - Analytics

## ANA-001

Task: Implement Analytics Overview API

Status: `NOT_STARTED`

Endpoint: `GET /admin/analytics`

---

## ANA-002

Task: Implement Top Posts by Views API

Status: `NOT_STARTED`

Endpoint: `GET /admin/analytics/posts?sort=views`

---

## ANA-003

Task: Implement Top Posts by Likes API

Status: `NOT_STARTED`

Endpoint: `GET /admin/analytics/posts?sort=likes`

---

## ADMIN-ANA-001

Task: Create Analytics Dashboard Page

Status: `NOT_STARTED`

---

---

# Phase 8 - Admin Polishing

## ADMIN-DASH-001

Task: Create Admin Dashboard

Status: `NOT_STARTED`

---

## ADMIN-USER-001

Task: Create User Management Page

Status: `NOT_STARTED`

---

## ADMIN-SET-001

Task: Create Profile Settings Page

Status: `NOT_STARTED`

---

## ADMIN-SET-002

Task: Create Password Settings Page

Status: `NOT_STARTED`

---

## ADMIN-SET-003

Task: Create Appearance Settings Page

Status: `NOT_STARTED`

---

## ADMIN-SET-004

Task: Create 2FA Settings Page

Status: `NOT_STARTED`

---

---

# Phase 9 - Public Site (Nuxt)

## WEB-HOME-001

Task: Create Home Page

Status: `NOT_STARTED`

---

## WEB-POST-001

Task: Create Post Detail Page (SSR + SEO)

Status: `NOT_STARTED`

---

## WEB-PL-001

Task: Create Playlist List Page

Status: `NOT_STARTED`

---

## WEB-PL-002

Task: Create Playlist Detail Page

Status: `NOT_STARTED`

---

## WEB-DARK-001

Task: Implement Dark Mode

Status: `NOT_STARTED`

---

---

# Phase 10 - Production Ready

## PROD-001

Task: Setup Rate Limiter

Status: `NOT_STARTED`

---

## PROD-002

Task: Setup Error Tracking

Status: `NOT_STARTED`

---

## PROD-003

Task: Setup CI/CD (GitHub Actions)

Status: `NOT_STARTED`

---

## PROD-004

Task: Docker Setup

Status: `NOT_STARTED`

---

## PROD-005

Task: Production Deployment

Status: `NOT_STARTED`
