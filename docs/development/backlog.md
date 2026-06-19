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
