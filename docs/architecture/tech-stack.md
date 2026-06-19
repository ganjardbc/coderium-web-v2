# Coderium V2 - Tech Stack & Architecture Decision Record

## Overview

Coderium V2 adalah platform **Content Publishing & Knowledge Management System** berbasis monorepo modern dengan arsitektur terpisah antara public site, admin dashboard, dan backend API.

---

# Architecture Style

Menggunakan:

* Monorepo (PNPM Workspace + TurboRepo)
* Domain Driven Module Structure
* Feature Based Frontend Architecture
* Modular Monolith Backend
* REST API
* JWT Authentication
* RBAC Authorization

---

# Technology Stack

## Frontend — apps/web (Public Site)

### Framework

* Nuxt 3
* Vue 3
* TypeScript

### UI

* PrimeVue
* Tailwind CSS v4

### State Management

* Pinia

### SEO

* Nuxt SEO (built-in)
* Nuxt Image (optimasi gambar)

### Editor

* Tiptap (rich text editor)

---

## Frontend — apps/admin (Admin Dashboard)

### Framework

* Vue 3
* Vite
* TypeScript

### UI

* PrimeVue
* Tailwind CSS v4

### State Management

* Pinia
* pinia-plugin-persistedstate

### Validation

* Zod

### HTTP Client

* Axios

### Routing

* Vue Router

### Charts

* Chart.js

### Utilities

* DayJS

---

## Backend — apps/api

### Framework

* NestJS
* TypeScript

### ORM

* Prisma

### Database

* PostgreSQL

### Authentication

* JWT

### Authorization

* Role Based Access Control (RBAC)

### File Upload

* S3 Compatible Storage (Cloudflare R2 / MinIO)

### API Documentation

* Swagger

### Search

* PostgreSQL Full-Text Search

---

## Infrastructure

### Monorepo

* PNPM Workspace
* TurboRepo

### Containerization

* Docker

### Deployment

* Railway / VPS

### CI/CD

* GitHub Actions

---

# Monorepo Structure

```txt
coderium-v2/

├── apps/
│
│   ├── web/         # Nuxt 3 — Public site
│   ├── admin/       # Vue 3 + Vite — Admin dashboard
│   └── api/         # NestJS — Backend REST API
│
├── packages/
│
│   ├── ui/          # Reusable UI components (PrimeVue-based)
│   ├── shared-types/
│   ├── shared-utils/
│   ├── eslint-config/
│   └── tsconfig/
│
├── infra/
│   ├── docker/
│   └── scripts/
│
├── docs/
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

# Applications

## apps/web

Public site menggunakan Nuxt 3.

Responsibilities:

* Public home page
* Post detail page
* Playlist detail page
* Explore page (browse + search)
* SEO rendering (SSR)
* Open Graph metadata
* Like interaction
* Views tracking

Authentication tidak diperlukan untuk browsing.

Port default: 3000

---

## apps/admin

Admin dashboard menggunakan Vue 3 + Vite.

Responsibilities:

* Post CRUD
* Playlist CRUD
* Media management
* User management
* Analytics dashboard
* Appearance settings
* Profile & password settings
* 2FA management

Requires authentication.

Port default: 5174

---

## apps/api

Backend REST API menggunakan NestJS.

Responsibilities:

* Authentication
* Authorization
* Business Logic
* Database Access
* File Upload
* Analytics
* Full-text Search

Port default: 3030

---

# Shared Packages

## packages/ui

Reusable UI components (PrimeVue-based).

Examples:

```txt
UiButton
UiInput
UiModal
UiTable
UiCard
UiBadge
UiDialog
```

---

## packages/shared-types

Shared TypeScript types.

Examples:

```txt
User
Post
Playlist
Media
PostLike
PostView
Analytics
```

---

## packages/shared-utils

Shared helper functions.

Examples:

```txt
slugify
formatDate
truncateText
formatNumber
```

Rules:

* Pure function.
* Tidak bergantung ke Vue / Nuxt.
* Tidak bergantung ke NestJS.

---

# Backend Module Structure

```txt
apps/api/src/

├── auth/
├── users/
├── rbac/

├── posts/
├── playlists/

├── media/

├── search/
├── analytics/
├── uploads/

├── database/
└── common/
```

---

# Backend Module Guideline

Setiap module NestJS:

```txt
module-name/

├── dto/
├── entities/
├── constants/

├── module-name.controller.ts
├── module-name.service.ts
└── module-name.module.ts
```

Rules:

* Business logic only in service
* Controller only handles request/response
* DTO for validation
* Prisma access only inside service layer

---

# Frontend Structure (Admin)

```txt
src/

├── core/
├── shared/
└── modules/
```

## Core

```txt
core/
├── initiate.ts
├── global-routes.ts
├── global-components.ts
└── global-styles.ts
```

## Shared

```txt
shared/
├── components/
├── composables/
├── constants/
├── helpers/
├── layouts/
└── services/
```

## Modules

```txt
modules/
├── auth/
├── dashboard/
├── posts/
├── playlists/
├── media/
├── analytics/
└── settings/
```

---

# Frontend Module Guideline (Admin)

```txt
module-name/

├── pages/
├── components/
├── stores/
├── services/
├── types/
└── router/
```

---

# Nuxt 3 Structure (Public Web)

```txt
apps/web/
├── pages/
│   ├── index.vue             # Home
│   ├── explore.vue           # Explore / post lists
│   ├── posts/
│   │   └── [slug].vue        # Post detail
│   └── playlists/
│       ├── index.vue         # Playlist list
│       └── [slug].vue        # Playlist detail
│
├── components/
│   ├── PostCard.vue
│   ├── PlaylistCard.vue
│   ├── PostContent.vue
│   └── ...
│
├── composables/
│   ├── usePost.ts
│   ├── usePlaylist.ts
│   └── useAnalytics.ts
│
├── layouts/
│   ├── default.vue
│   └── minimal.vue
│
├── stores/
│   └── ...
│
└── plugins/
    └── ...
```

---

# Authentication Strategy

Authentication:

* JWT Access Token

Storage:

* Pinia Persist (Admin)
* Cookie / Nuxt auth middleware (Web)

Protected Route:

* Route Guard (Admin)
* Nuxt Middleware (Web)

---

# Authorization Strategy

Using RBAC.

Roles:

```txt
Admin
Author
```

Permission examples:

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

# Database Strategy

Database:

* PostgreSQL

ORM:

* Prisma

Rules:

* UUID for public entities
* Soft Delete for posts, playlists, users
* created_at, updated_at mandatory on all tables

---

# Post Type System

Post mendukung 4 tipe:

```txt
article       # Rich text article
carousel      # Slide / swipe format
video         # Video content
stack_gallery # Stacked image gallery
```

Media disimpan polymorphically via tabel `media` dengan pivot tag:

```txt
carousel
video
stack_gallery
cover
```

---

# Architecture Principles

1. Feature First
2. Modular Monolith
3. Shared Types Across Apps
4. Thin Controllers
5. Fat Services
6. Reusable UI Components
7. Domain Separation
8. Single Source of Truth
9. SEO First (Nuxt SSR)
10. Performance First

---

# Future Expansion

Not included in MVP:

* Comment System
* Subscription / Paid Content
* Team Collaboration
* Newsletter
* AI Content Generator
* Recommendation Engine
