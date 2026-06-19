# AGENTS.md

## Project

Coderium V2

## Product Summary

Coderium V2 adalah platform **Content Publishing & Knowledge Management System** untuk developer dan content creator.

Platform ini memungkinkan:

* Membuat dan mengelola Post (article, carousel, video, stack gallery).
* Mengorganisasi konten dalam Playlist / koleksi.
* Mendukung engagement melalui likes dan views tracking.
* Mengelola media (gambar, video) secara terpusat.
* Menyediakan full-text search.
* Admin panel untuk manajemen konten.
* Analytics engagement konten.

---

# Mandatory Context

Sebelum mengerjakan task, baca dokumen berikut sesuai kebutuhan.

## Product

```txt
docs/product/requirements.md
```

## Architecture

```txt
docs/architecture/tech-stack.md
docs/architecture/design.md
docs/architecture/module-breakdown.md
```

## Database

```txt
docs/database/database-design.md
docs/database/prisma-schema-design.md
```

## API

```txt
docs/api/api-contract.md
```

## Frontend

```txt
docs/frontend/frontend-routes.md
docs/frontend/ui-pages.md
docs/frontend/design-system.md
docs/frontend/layouts.md
docs/frontend/ui-components.md
```

## Backend

```txt
docs/backend/nestjs-guidelines.md
docs/backend/prisma-guidelines.md
```

## Development

```txt
docs/development/conventions.md
docs/development/roadmap.md
docs/development/backlog.md
docs/development/milestones.md
docs/development/progress.md
```

---

# Architecture Rules

Project menggunakan:

```txt
Monorepo
PNPM Workspace
TurboRepo
Nuxt 3
Vue 3
Vite
Pinia
PrimeVue
Tailwind CSS
NestJS
Prisma
PostgreSQL
```

Root structure:

```txt
apps/
  web/         # Nuxt 3 — public site (home, post detail, playlist, explore)
  admin/       # Vue 3 + Vite — admin dashboard
  api/         # NestJS — backend REST API

packages/
  ui/
  shared-types/
  shared-utils/
  eslint-config/
  tsconfig/

docs/
infra/
```

---

# Implementation Principles

## Build One Task At A Time

Jangan membangun seluruh aplikasi sekaligus.

Ikuti urutan:

```txt
docs/development/backlog.md
```

Selesaikan satu task kecil, lalu lanjut ke task berikutnya.

---

## Follow Roadmap

Gunakan:

```txt
docs/development/roadmap.md
```

sebagai urutan phase.

Jangan mengerjakan fitur di luar phase tanpa instruksi eksplisit.

---

## Respect MVP Scope

Fitur berikut **tidak masuk MVP**:

```txt
Comment System
Subscription / Paid Content
Team Collaboration
Custom Domain
Newsletter
AI Content Generator
Recommendation Engine
```

---

# Backend Rules

Backend berada di:

```txt
apps/api
```

Framework:

```txt
NestJS
Prisma
PostgreSQL
JWT
RBAC
```

Ikuti:

```txt
docs/backend/nestjs-guidelines.md
docs/backend/prisma-guidelines.md
```

---

## Backend Module Structure

Setiap module harus mengikuti struktur:

```txt
module-name/
  dto/
  entities/
  constants/

  module-name.module.ts
  module-name.controller.ts
  module-name.service.ts
```

---

## Controller Rules

Controller hanya boleh:

* Menerima request.
* Menggunakan DTO.
* Menggunakan decorator.
* Memanggil service.
* Mengembalikan response.

Controller **tidak boleh** berisi business logic.

---

## Service Rules

Service berisi:

* Business logic.
* Ownership validation.
* Database query.
* Transaction.
* Error handling.
* Data transformation.

---

## Auth Rules

Gunakan global JWT guard.

Semua route protected secara default.

Public route wajib memakai:

```ts
@Public()
```

---

## RBAC Rules

Permission utama:

```txt
manage_users
manage_all_posts
manage_all_playlists
manage_all_media
view_analytics

manage_own_posts
manage_own_playlists
manage_own_media
```

---

## Ownership Rules

Author hanya boleh mengakses resource miliknya sendiri.

Selalu scope query dengan `userId`.

Admin boleh mengakses semua data sesuai permission.

---

## Public API Rules

Public API hanya boleh mengembalikan konten yang:

```txt
is_published = true
deleted_at = null
```

---

## Prisma Rules

Jangan membuat PrismaClient baru di service.

Gunakan:

```ts
constructor(private readonly prisma: PrismaService) {}
```

Soft delete untuk:

```txt
users
posts
playlists
```

---

# Frontend Rules

Frontend berada di:

```txt
apps/web    (Nuxt 3 — public site)
apps/admin  (Vue 3 — admin dashboard)
```

Framework:

```txt
Nuxt 3 (apps/web)
Vue 3 + Vite (apps/admin)
Pinia
Vue Router
PrimeVue
Tailwind CSS
```

---

## Frontend Module Structure

Setiap frontend module harus mengikuti:

```txt
modules/module-name/
  pages/
  components/
  stores/
  services/
  types/
  router/
```

---

## Nuxt 3 (apps/web) Structure

```txt
pages/          # File-based routing
components/
composables/
stores/
layouts/
middleware/
plugins/
server/
```

---

## Routing Rules (Admin)

Setiap module memiliki route sendiri:

```txt
modules/*/router/index.ts
```

Route meta harus menggunakan:

```ts
meta: {
  title: 'Page Title',
  layout: 'admin',
  permission: ['manage_own_posts'],
}
```

---

## State Rules

Gunakan Pinia.

Store hanya untuk:

* Auth state.
* UI state.
* Cached module state.

---

## UI Rules

Gunakan design system:

```txt
docs/frontend/design-system.md
```

Reusable generic component berada di:

```txt
packages/ui
```

Naming:

```txt
UiButton
UiInput
UiTable
UiModal
UiBadge
```

---

# Shared Package Rules

## shared-types

```txt
packages/shared-types
```

Digunakan untuk type bersama:

```txt
User
Post
Playlist
Media
Analytics
```

## shared-utils

```txt
packages/shared-utils
```

Isi:

```txt
slugify
formatDate
truncateText
formatNumber
```

Rules:

* Pure function.
* Tidak bergantung ke Vue atau Nuxt.
* Tidak bergantung ke NestJS.

---

# Database Rules

Wajib gunakan:

```txt
UUID primary key
snake_case database column
camelCase Prisma field
soft delete where required
index for frequently queried fields
```

---

# API Rules

Base URL:

```txt
/api/v1
```

Response format:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

List response:

```json
{
  "success": true,
  "message": "Success",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

---

# File Upload Rules

Upload module bertanggung jawab untuk:

* Validate file type.
* Validate file size.
* Upload to storage.
* Return URL.

Storage:

```txt
Cloudflare R2
MinIO fallback
```

Database hanya menyimpan URL.

---

# Testing Rules

Minimal testing untuk:

```txt
Auth
RBAC
Post CRUD
Playlist CRUD
Media Upload
Search
Analytics
```

---

# Security Rules

Jangan pernah:

```txt
Menyimpan password plain text
Log JWT token
Expose draft/unpublished post ke public
Query resource tanpa ownership check
```

---

# Development Order

```txt
Phase 0 - Foundation
Phase 1 - Authentication & RBAC
Phase 2 - Post Core
Phase 3 - Media Management
Phase 4 - Playlist
Phase 5 - Engagement (Likes & Views)
Phase 6 - Search
Phase 7 - Analytics
Phase 8 - Admin Panel
Phase 9 - Public Site (Nuxt)
Phase 10 - Production Ready
```

---

# AI Agent Working Rules

Saat mengerjakan task:

1. Baca dokumen terkait.
2. Pahami task dari `docs/development/backlog.md`.
3. Jangan mengubah scope tanpa alasan kuat.
4. Jangan membuat fitur di luar MVP.
5. Jangan refactor besar tanpa instruksi.
6. Jangan menghapus file tanpa alasan jelas.
7. Jangan membuat duplicate type jika sudah ada di `shared-types`.
8. Setelah selesai, jelaskan perubahan yang dibuat.
9. Pastikan command build/typecheck/lint relevan berjalan jika memungkinkan.

---

# Definition of Done

Sebuah task dianggap selesai jika:

```txt
Code implemented
No obvious TypeScript error
No duplicate logic
No broken existing flow
Follows folder convention
Follows API contract
Ownership rule applied where needed
Permission rule applied where needed
```

---

# Forbidden Actions

Jangan lakukan:

```txt
Generate all modules at once
Implement subscription / paid content
Implement AI features
Implement custom domain
Bypass RBAC
Bypass ownership check
Store uploaded file binary in database
Use any without reason
Put all route in one global file
Put all business logic in controller
```

# Mandatory Workflow

Before marking any task as DONE:

Read:

.ai/workflows/task-completion.md

The task is not complete until all required documentation has been updated.
