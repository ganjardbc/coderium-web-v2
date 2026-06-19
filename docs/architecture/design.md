# Coderium V2 - System Design Document

# Overview

Coderium V2 adalah platform Content Publishing & Knowledge Management System yang memungkinkan author membuat dan mempublikasikan konten, mengorganisasi dalam playlist, dan memantau engagement audiens.

Sistem dirancang menggunakan pendekatan:

* Modular Monolith
* Monorepo Architecture
* Domain Driven Module Structure
* REST API
* RBAC Authorization
* SSR untuk public site (Nuxt 3)

---

# High Level Architecture

```txt
Internet
│
├── Public Site (Nuxt 3 — SSR)
│   └── apps/web
│
├── Admin Dashboard (Vue 3 — SPA)
│   └── apps/admin
│
└── API
    └── apps/api
            │
            ▼
        PostgreSQL
            │
            ▼
       S3 Storage
```

---

# Applications

## Public Site (apps/web)

Nuxt 3 SSR application.

Responsibilities:

* Render public home page
* Render post detail (SSR for SEO)
* Render playlist detail
* Explore / browse page
* Search
* Like interaction
* Views tracking
* Open Graph metadata

Authentication not required for reading.

---

## Admin Dashboard (apps/admin)

Vue 3 SPA for content management.

Responsibilities:

* Post CRUD (all types)
* Playlist CRUD
* Media management
* Analytics dashboard
* User settings

Authentication required.

---

## API (apps/api)

Single NestJS backend service.

Responsibilities:

* Business Logic
* Authentication
* Authorization
* Database Access
* File Upload
* Full-text Search
* Analytics Aggregation

---

# Domain Model

```txt
User
│
├── Post (article / carousel / video / stack_gallery)
│     │
│     ├── Media (polymorphic)
│     ├── PostView
│     └── PostLike
│
└── Playlist
      │
      └── Posts (many-to-many via playlist_post)
```

---

# Post Domain

Entity utama konten.

Types:

```txt
article
carousel
video
stack_gallery
```

Fields:

```txt
slug
title
subtitle
content (rich text)
tags
cover
type
is_published
published_at
views_count
likes_count
meta_description
meta_keywords
```

Media Relationship:

Post memiliki media polymorphic dengan tag:

```txt
carousel      → carousel images
video         → video media
stack_gallery → stack gallery images
cover         → cover image
```

---

# Playlist Domain

Koleksi / kurasi post.

Purpose:

Mengorganisasi post bertemakan tertentu menjadi sebuah seri atau koleksi.

Fields:

```txt
title
description
slug
cover
is_published
order
```

Relationship:

```txt
Playlist
 └── Posts (many-to-many, ordered)
```

---

# Media Domain

Polymorphic media management.

Purpose:

Menyimpan dan mengelola semua media (gambar, video) yang digunakan dalam post maupun playlist.

Media dapat di-attach ke:

```txt
Post
Playlist
```

via Mediable pivot dengan tag dan order.

---

# Engagement Domain

## PostView

Track setiap kunjungan ke post.

Data yang dicatat:

```txt
ip_address
user_agent
referer
viewed_at
```

View count di-aggregate di kolom `views_count` di tabel posts.

---

## PostLike

Track like dari visitor.

Like bersifat:

* Toggle (bisa unlike)
* Per IP address atau per user

Like count di-aggregate di kolom `likes_count` di tabel posts.

---

# Authorization Design

## Admin

Permissions:

```txt
manage_users
manage_all_posts
manage_all_playlists
manage_all_media
view_analytics
```

---

## Author

Permissions:

```txt
manage_own_posts
manage_own_playlists
manage_own_media
```

---

# Search Design

Menggunakan PostgreSQL Full-Text Search.

Search target:

```txt
posts.title
posts.subtitle
posts.content
```

Filter:

```txt
type
tags
is_published
```

---

# SEO Design

Setiap post detail memiliki:

* Custom meta title
* Custom meta description
* Open Graph image (cover)
* Canonical URL
* Structured data (JSON-LD)

Dirender server-side oleh Nuxt 3 untuk SEO optimal.

---

# Post Type Rendering

## Article

Render rich-text content menggunakan Tiptap output.

## Carousel

Render slide-by-slide. Setiap slide berisi media carousel dengan caption.

## Video

Render video player / embed.

## Stack Gallery

Render galeri bersusun.

---

# File Storage Strategy

Stored Files:

```txt
Post cover image
Carousel images
Stack gallery images
Video files
Playlist cover image
```

Storage:

```txt
Cloudflare R2
```

Fallback:

```txt
MinIO
```

Database stores only URLs.

---

# Analytics Design

Metrics yang dikumpulkan:

```txt
Total views per post
Total likes per post
Total posts published
Total playlists
Views trend (daily / weekly)
Top posts by views
Top posts by likes
```

---

# Non Functional Requirements

Performance:

* SSR untuk public site
* Lazy loaded images
* Mobile first

Security:

* JWT Authentication
* RBAC Authorization
* Input Validation
* File Upload Validation

Scalability:

* Banyak post per author
* Media management terpusat
* Future subscription support

Maintainability:

* Modular Architecture
* Feature Based Frontend
* Domain Based Backend

---

# Future Extensions

Not included in MVP:

* Comment System
* Subscription / Paid Content
* Team Collaboration
* Newsletter
* AI Content Generator
* Recommendation Engine

Architecture must support future addition without major refactoring.
