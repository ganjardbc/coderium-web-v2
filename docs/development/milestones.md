# Coderium V2 - Milestones

## Overview

Dokumen ini mendefinisikan milestone development Coderium V2.

Tujuan:

* Menentukan target deliverable setiap fase.
* Menjadi acuan progress project.
* Menjadi acuan demo internal.
* Menjadi acuan release management.

---

# Project Vision

Coderium V2 adalah platform content publishing yang memungkinkan:

```txt
Author: membuat berbagai format konten (article, carousel, video, stack gallery)
Author: mengelola playlist / koleksi konten
Author: mengelola media terpusat
Visitor: browse, search, dan membaca konten
Visitor: memberikan like
Admin: mengelola platform dari dashboard
Admin: melihat analytics engagement
```

---

# Milestone M0

## Foundation Ready

Status:

```txt
NOT_STARTED
```

Goal:

```txt
Project dapat dijalankan dan siap dikembangkan.
```

Deliverables:

```txt
Monorepo dengan PNPM + TurboRepo
apps/api (NestJS) berjalan
apps/admin (Vue 3) berjalan
apps/web (Nuxt 3) berjalan
PostgreSQL terkoneksi
Prisma schema awal
Shared packages siap
```

Demo Checklist:

```txt
[ ] apps/api running di port 3030
[ ] apps/admin running di port 5174
[ ] apps/web running di port 5174
[ ] database connected
[ ] prisma generate berhasil
```

---

# Milestone M1

## Authentication Ready

Status:

```txt
NOT_STARTED
```

Goal:

```txt
User dapat masuk ke sistem dengan aman.
```

Deliverables:

```txt
Register
Login
Logout
JWT Authentication
RBAC
Permission Guard
```

Demo Checklist:

```txt
[ ] Register user
[ ] Login user
[ ] Protected route bekerja
[ ] Permission bekerja
[ ] Admin role berfungsi
```

---

# Milestone M2

## Post Core Ready

Status:

```txt
NOT_STARTED
```

Goal:

```txt
Author dapat membuat dan mempublikasikan post.
```

Deliverables:

```txt
Post CRUD (semua type)
Publish / Unpublish
Post List Page (admin)
Post Form Page (admin)
```

Demo Checklist:

```txt
[ ] Create article post
[ ] Create carousel post
[ ] Create video post
[ ] Create stack gallery post
[ ] Publish post
[ ] Post tampil di public API
```

---

# Milestone M3

## Media Ready

Status:

```txt
NOT_STARTED
```

Goal:

```txt
Author dapat upload dan attach media ke post.
```

Deliverables:

```txt
Media upload (single & multiple)
Media library
Polymorphic attachment
```

Demo Checklist:

```txt
[ ] Upload image
[ ] Upload multiple images
[ ] Attach media ke post carousel
[ ] Media library menampilkan semua media
```

---

# Milestone M4

## Playlist Ready

Status:

```txt
NOT_STARTED
```

Goal:

```txt
Author dapat membuat playlist dan mengelola post di dalamnya.
```

Deliverables:

```txt
Playlist CRUD
Attach/detach post
Reorder post
Public playlist API
```

Demo Checklist:

```txt
[ ] Create playlist
[ ] Tambah post ke playlist
[ ] Hapus post dari playlist
[ ] Playlist tampil di public API
```

---

# Milestone M5

## Engagement Ready

Status:

```txt
NOT_STARTED
```

Goal:

```txt
Visitor dapat berinteraksi dengan konten.
```

Deliverables:

```txt
Views tracking
Like toggle
Popular posts
```

Demo Checklist:

```txt
[ ] View tercatat saat post dibuka
[ ] Like berhasil (toggle)
[ ] Popular posts endpoint berjalan
```

---

# Milestone M6

## Search Ready

Status:

```txt
NOT_STARTED
```

Goal:

```txt
Visitor dapat mencari dan filter konten.
```

Deliverables:

```txt
Full-text search
Filter by type
Filter by tags
Explore page (Nuxt)
```

Demo Checklist:

```txt
[ ] Search by keyword berjalan
[ ] Filter by type berjalan
[ ] Filter by tags berjalan
[ ] Explore page tampil di public site
```

---

# Milestone M7

## Analytics Ready

Status:

```txt
NOT_STARTED
```

Goal:

```txt
Admin dapat melihat performa konten.
```

Deliverables:

```txt
Analytics overview
Top posts by views
Top posts by likes
Analytics dashboard (admin)
```

Demo Checklist:

```txt
[ ] Overview stats tampil
[ ] Top posts by views tampil
[ ] Top posts by likes tampil
```

---

# Milestone M8

## Admin Panel Ready

Status:

```txt
NOT_STARTED
```

Goal:

```txt
Admin panel lengkap dan siap digunakan.
```

Deliverables:

```txt
Admin dashboard
User management
Settings (profile, password, appearance, 2FA)
```

Demo Checklist:

```txt
[ ] Dashboard tampil stats
[ ] User management berjalan
[ ] Profile settings berjalan
[ ] Dark/light mode berjalan
```

---

# Milestone M9

## Public Site Ready

Status:

```txt
NOT_STARTED
```

Goal:

```txt
Public site siap digunakan visitor.
```

Deliverables:

```txt
Home page (Nuxt 3 SSR)
Post detail (SSR + SEO)
Playlist detail
Explore page
Dark mode
```

Demo Checklist:

```txt
[ ] Home page tampil
[ ] Post detail render SSR
[ ] SEO metadata tampil di head
[ ] OG image tampil
[ ] Playlist detail tampil
[ ] Dark mode berjalan
```

---

# Milestone M10

## MVP Production Release

Status:

```txt
NOT_STARTED
```

Goal:

```txt
Platform siap menerima user.
```

Deliverables:

```txt
Docker setup
CI/CD
Rate limiter
Error tracking
Production deployment
```

Demo Checklist:

```txt
[ ] Production build berhasil
[ ] Docker berjalan
[ ] CI/CD aktif
[ ] SSL aktif
[ ] Monitoring aktif
```

---

# MVP Success Metrics

## Business Metrics

```txt
Author dapat membuat konten dalam < 5 menit
Search memberikan hasil relevan
Playlist dapat diorganisasi
Analytics memberikan insight yang actionable
```

## Technical Metrics

```txt
Lighthouse score > 90 (public site)
API response < 500ms
No critical security issue
SSR berjalan optimal
```
