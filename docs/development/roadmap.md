# Coderium V2 - Development Roadmap

Path:

```txt
docs/development/roadmap.md
```

## Overview

Dokumen ini menjelaskan roadmap development Coderium V2.

Tujuan roadmap:

* Menentukan urutan pengerjaan.
* Menjadi acuan sprint planning.
* Menjadi checkpoint progress project.
* Menjadi panduan AI Coding Agent.

---

# MVP Goal

```txt
Author dapat:
- Register dan login
- Membuat post (article, carousel, video, stack gallery)
- Membuat dan mengelola playlist
- Upload dan attach media
- Menggunakan admin dashboard

Visitor dapat:
- Browse dan membaca post
- Search konten
- Like post
- Melihat playlist

Admin dapat:
- Mengelola semua konten
- Melihat analytics
```

---

# Phase 0 - Foundation

Status:

```txt
NOT_STARTED
```

Goal:

```txt
Project dapat dijalankan secara lokal dan siap dikembangkan.
```

Deliverables:

```txt
Monorepo Setup
Shared Packages
Backend Setup (NestJS)
Frontend Setup (Vue 3 Admin + Nuxt 3 Web)
Database Setup (Prisma + PostgreSQL)
```

Tasks:

```txt
[ ] MONO-001 Setup pnpm workspace
[ ] MONO-002 Setup TurboRepo
[ ] MONO-003 Setup packages/shared-types
[ ] MONO-004 Setup packages/shared-utils
[ ] MONO-005 Setup packages/eslint-config
[ ] MONO-006 Setup packages/tsconfig
[ ] MONO-007 Setup packages/ui

[ ] API-001 Setup apps/api (NestJS)
[ ] API-002 Setup Prisma
[ ] API-003 Setup PostgreSQL connection
[ ] API-004 Create initial Prisma schema

[ ] ADMIN-001 Setup apps/admin (Vue 3 + Vite)
[ ] WEB-001 Setup apps/web (Nuxt 3)
```

Definition of Done:

```txt
pnpm dev berjalan
Semua aplikasi start
Database terkoneksi
Prisma generate berhasil
```

Estimated:

```txt
2 hari
```

---

# Phase 1 - Authentication & RBAC

Goal:

```txt
User dapat login dan memiliki permission.
```

Deliverables:

```txt
Authentication
Authorization
RBAC
2FA support
```

Tasks:

```txt
[ ] AUTH-001 Create Users schema
[ ] AUTH-002 Create Roles schema
[ ] AUTH-003 Create Permissions schema
[ ] AUTH-004 Create Auth Module (NestJS)
[ ] AUTH-005 Implement Register API
[ ] AUTH-006 Implement Login API
[ ] AUTH-007 Implement Logout API
[ ] AUTH-008 Implement Current User API
[ ] AUTH-009 Implement Forgot Password API
[ ] AUTH-010 Implement JWT Guard
[ ] AUTH-011 Implement Permissions Guard
[ ] AUTH-012 Seed Roles dan Permissions

[ ] ADMIN-AUTH-001 Create Login Page
[ ] ADMIN-AUTH-002 Create Register Page
[ ] ADMIN-AUTH-003 Create Forgot Password Page
```

Definition of Done:

```txt
User dapat login
Permission berjalan
```

Estimated:

```txt
3 hari
```

---

# Phase 2 - Post Core

Goal:

```txt
Author dapat membuat dan mempublikasikan post.
```

Deliverables:

```txt
Post CRUD
Post Types
Publish / Unpublish
```

Tasks:

```txt
[ ] POST-001 Create Post schema
[ ] POST-002 Implement Create Post API
[ ] POST-003 Implement List Posts API (public)
[ ] POST-004 Implement Get Post Detail API (public)
[ ] POST-005 Implement Update Post API
[ ] POST-006 Implement Delete Post API
[ ] POST-007 Implement Publish Post API
[ ] POST-008 Implement Unpublish Post API
[ ] POST-009 Implement Admin List Posts API

[ ] ADMIN-POST-001 Create Post List Page
[ ] ADMIN-POST-002 Create Post Form Page (article)
[ ] ADMIN-POST-003 Create Post Form Page (carousel)
[ ] ADMIN-POST-004 Create Post Form Page (video)
[ ] ADMIN-POST-005 Create Post Form Page (stack gallery)
```

Definition of Done:

```txt
Post dapat dibuat
Post dapat dipublikasikan
Post tampil di public API
```

Estimated:

```txt
4 - 5 hari
```

---

# Phase 3 - Media Management

Goal:

```txt
Author dapat upload dan manage media.
```

Deliverables:

```txt
Media Upload
Media Library
Polymorphic Attachment
```

Tasks:

```txt
[ ] MEDIA-001 Create Media schema
[ ] MEDIA-002 Create Mediable schema
[ ] MEDIA-003 Setup Cloudflare R2 / MinIO
[ ] MEDIA-004 Implement Upload Image API
[ ] MEDIA-005 Implement Upload Multiple Images API
[ ] MEDIA-006 Implement List Media API
[ ] MEDIA-007 Implement Update Media API
[ ] MEDIA-008 Implement Delete Media API
[ ] MEDIA-009 Implement Attach Media to Post API

[ ] ADMIN-MEDIA-001 Create Media Library Page
[ ] ADMIN-MEDIA-002 Create Media Uploader Component
```

Definition of Done:

```txt
Upload image berhasil
Media dapat di-attach ke post
```

Estimated:

```txt
3 hari
```

---

# Phase 4 - Playlist

Goal:

```txt
Author dapat membuat playlist dan mengorganisasi post.
```

Deliverables:

```txt
Playlist CRUD
Post Attachment
Reorder
```

Tasks:

```txt
[ ] PL-001 Create Playlist schema
[ ] PL-002 Create PlaylistPost schema
[ ] PL-003 Implement Create Playlist API
[ ] PL-004 Implement List Playlists API (public)
[ ] PL-005 Implement Get Playlist Detail API (public)
[ ] PL-006 Implement Update Playlist API
[ ] PL-007 Implement Delete Playlist API
[ ] PL-008 Implement Attach Posts to Playlist API
[ ] PL-009 Implement Detach Posts from Playlist API

[ ] ADMIN-PL-001 Create Playlist List Page
[ ] ADMIN-PL-002 Create Playlist Form Page
[ ] ADMIN-PL-003 Create Playlist Post Manager
```

Definition of Done:

```txt
Playlist dapat dibuat
Post dapat ditambahkan ke playlist
Playlist tampil di public API
```

Estimated:

```txt
3 hari
```

---

# Phase 5 - Engagement (Likes & Views)

Goal:

```txt
Visitor dapat berinteraksi dengan konten.
```

Deliverables:

```txt
Views Tracking
Like Toggle
```

Tasks:

```txt
[ ] ENG-001 Create PostView schema
[ ] ENG-002 Create PostLike schema
[ ] ENG-003 Implement Track View API
[ ] ENG-004 Implement Toggle Like API
[ ] ENG-005 Implement Popular Posts API

[ ] WEB-ENG-001 Implement Like Button (public site)
[ ] WEB-ENG-002 Implement Views Tracking (public site)
```

Definition of Done:

```txt
View tercatat
Like berfungsi
```

Estimated:

```txt
2 hari
```

---

# Phase 6 - Search

Goal:

```txt
Visitor dapat mencari konten.
```

Deliverables:

```txt
Full-Text Search
Filter by type / tags
```

Tasks:

```txt
[ ] SRCH-001 Implement Search API (PostgreSQL full-text)
[ ] SRCH-002 Implement Filter by type
[ ] SRCH-003 Implement Filter by tags

[ ] WEB-SRCH-001 Create Explore Page (Nuxt)
[ ] WEB-SRCH-002 Create Search Component
```

Definition of Done:

```txt
Search berjalan
Filter berjalan
```

Estimated:

```txt
2 hari
```

---

# Phase 7 - Analytics

Goal:

```txt
Admin dapat melihat performa konten.
```

Deliverables:

```txt
Overview stats
Top posts
```

Tasks:

```txt
[ ] ANA-001 Implement Analytics Overview API
[ ] ANA-002 Implement Top Posts by Views API
[ ] ANA-003 Implement Top Posts by Likes API

[ ] ADMIN-ANA-001 Create Analytics Dashboard Page
```

Definition of Done:

```txt
Analytics tampil
```

Estimated:

```txt
2 hari
```

---

# Phase 8 - Admin Panel (Polishing)

Goal:

```txt
Admin panel siap digunakan secara penuh.
```

Deliverables:

```txt
Admin Dashboard
User Management
Settings
```

Tasks:

```txt
[ ] ADMIN-DASH-001 Create Admin Dashboard
[ ] ADMIN-USER-001 Create User Management Page
[ ] ADMIN-SET-001 Create Profile Settings Page
[ ] ADMIN-SET-002 Create Password Settings Page
[ ] ADMIN-SET-003 Create Appearance Settings Page
[ ] ADMIN-SET-004 Create 2FA Settings Page
```

Estimated:

```txt
3 hari
```

---

# Phase 9 - Public Site (Nuxt)

Goal:

```txt
Public site siap untuk visitor.
```

Deliverables:

```txt
Home Page
Post Detail (SSR)
Playlist Detail
Explore Page
```

Tasks:

```txt
[ ] WEB-001 Create Home Page
[ ] WEB-002 Create Post Detail Page (SSR + SEO)
[ ] WEB-003 Create Playlist List Page
[ ] WEB-004 Create Playlist Detail Page
[ ] WEB-005 Implement Infinite Scroll (Home)
[ ] WEB-006 Implement Dark Mode
```

Estimated:

```txt
4 hari
```

---

# Phase 10 - Production Ready

Goal:

```txt
Siap launch ke production.
```

Tasks:

```txt
[ ] Rate Limiter
[ ] Error Tracking
[ ] CI/CD
[ ] Docker setup
[ ] Deployment
```

Estimated:

```txt
2 - 3 hari
```

---

# MVP Milestone

## MVP Alpha

```txt
Phase 0 + 1 + 2
```

Author bisa login dan membuat post.

## MVP Beta

```txt
Phase 0 - 6
```

Semua fitur utama berjalan.

## MVP Production

```txt
Phase 0 - 10
```

Platform siap menerima user.

---

# Recommended Build Order

```txt
Phase 0 → Foundation
Phase 1 → Auth & RBAC
Phase 2 → Post Core
Phase 3 → Media
Phase 4 → Playlist
Phase 5 → Engagement
Phase 6 → Search
Phase 7 → Analytics
Phase 8 → Admin Polishing
Phase 9 → Public Site (Nuxt)
Phase 10 → Production Ready
```
