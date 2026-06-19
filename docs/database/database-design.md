# Coderium V2 - Database Design Document

## Overview

Dokumen ini menjelaskan aturan desain database untuk Coderium V2.

Database mendukung:

* Authentication & RBAC
* Post management (article, carousel, video, stack_gallery)
* Playlist management
* Polymorphic media
* Engagement (views, likes)
* Search
* Analytics

---

# Database Engine

Database utama:

```txt
PostgreSQL
```

ORM:

```txt
Prisma
```

---

# Naming Convention

## Table Name

```txt
snake_case
plural
```

Contoh:

```txt
users
posts
playlists
media
post_views
post_likes
playlist_post
mediables
```

## Column Name

```txt
snake_case
```

## Primary Key

```txt
uuid — untuk entity utama yang di-expose ke publik
bigint auto-increment — untuk pivot / tracking tables
```

---

# Common Columns

Untuk entity utama:

```txt
id (uuid)
created_at
updated_at
deleted_at (soft delete where applicable)
```

---

# Core Tables

## users

Purpose:

Menyimpan data user platform.

Columns:

```txt
id (uuid)
name
email (unique)
password_hash
avatar_url
status
email_verified_at
two_factor_secret (nullable)
two_factor_recovery_codes (nullable)
two_factor_confirmed_at (nullable)
created_at
updated_at
deleted_at
```

---

## roles

Default data:

```txt
admin
author
```

Columns:

```txt
id (uuid)
name
slug (unique)
description
created_at
updated_at
```

---

## permissions

Columns:

```txt
id (uuid)
name
slug (unique)
description
created_at
updated_at
```

Default permissions:

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

## user_roles

Pivot: users ↔ roles.

Columns:

```txt
id
user_id
role_id
created_at
```

Unique: `user_id + role_id`

---

## role_permissions

Pivot: roles ↔ permissions.

Columns:

```txt
id
role_id
permission_id
created_at
```

Unique: `role_id + permission_id`

---

# Post Tables

## posts

Purpose:

Entity utama konten.

Columns:

```txt
id (uuid)
user_id
slug (unique)
title
subtitle (nullable)
content (longtext, nullable)
tags (json, nullable)
cover (url, nullable)
type (enum: article, carousel, video, stack_gallery)
media (json, nullable)  — legacy; media sekarang via mediables
is_published (boolean, default false)
published_at (timestamp, nullable)
views_count (integer, default 0)
likes_count (integer, default 0)
meta_description (text, nullable)
meta_keywords (string, nullable)
created_at
updated_at
deleted_at
```

Indexes:

```txt
slug
type
is_published
published_at
user_id + is_published
FULLTEXT: title, subtitle, content
```

---

# Playlist Tables

## playlists

Purpose:

Koleksi / kurasi post.

Columns:

```txt
id (uuid)
user_id
title
description (nullable)
slug (unique)
cover (url, nullable)
is_published (boolean, default false)
order (integer, default 0)
created_at
updated_at
deleted_at
```

---

## playlist_post

Pivot: playlists ↔ posts.

Columns:

```txt
id
playlist_id
post_id
user_id
order (integer, default 0)
created_at
updated_at
```

Unique: `playlist_id + post_id`

---

# Media Tables

## media

Purpose:

Media library terpusat.

Columns:

```txt
id (uuid)
user_id (nullable)
filename
original_name
mime_type
size (integer, bytes)
url
disk (string: r2, minio, local)
width (nullable)
height (nullable)
created_at
updated_at
```

---

## mediables

Pivot polymorphic: media ↔ (posts / playlists).

Columns:

```txt
id
media_id
mediable_type (string: App\Models\Post, App\Models\Playlist)
mediable_id (uuid)
tag (string: carousel, video, stack_gallery, cover)
order (integer, default 0)
created_at
updated_at
```

---

# Engagement Tables

## post_views

Purpose:

Track setiap kunjungan ke post.

Columns:

```txt
id (bigint)
post_id
ip_address
user_agent (nullable)
referer (nullable)
viewed_at
created_at
```

Rules:

* Append-only.
* Tidak di-update.
* `views_count` di tabel posts di-increment setiap insert.

---

## post_likes

Purpose:

Track like dari visitor.

Columns:

```txt
id (bigint)
post_id
ip_address
user_id (nullable — jika user login)
created_at
```

Unique: `post_id + ip_address`

Rules:

* Toggle: insert jika belum, delete jika sudah.
* `likes_count` di tabel posts di-update setiap toggle.

---

# Enum Design

## PostType

```txt
article
carousel
video
stack_gallery
```

## UserStatus

```txt
active
inactive
suspended
```

---

# JSON Fields

## posts.tags

Contoh:

```json
["vue", "nuxt", "frontend"]
```

---

## posts.media (legacy)

Field ini masih ada untuk backward compat. Media baru menggunakan tabel `mediables`.

---

# Index Strategy

## posts

```txt
slug
type
is_published
published_at
user_id + is_published
FULLTEXT: title, subtitle, content
```

## playlists

```txt
slug
is_published
user_id + is_published
```

## media

```txt
user_id
mime_type
```

## mediables

```txt
mediable_type + mediable_id
media_id
tag
```

## post_views

```txt
post_id
ip_address
viewed_at
```

## post_likes

```txt
post_id
ip_address
```

---

# Unique Constraints

```txt
users.email
roles.slug
permissions.slug
user_roles.user_id + role_id
role_permissions.role_id + permission_id
posts.slug
playlists.slug
playlist_post.playlist_id + post_id
post_likes.post_id + ip_address
```

---

# Soft Delete Rules

Gunakan soft delete untuk:

```txt
users
posts
playlists
```

Tidak perlu soft delete untuk:

```txt
roles
permissions
user_roles
role_permissions
media
mediables
post_views
post_likes
playlist_post
```

---

# Seed Data

## Roles

```txt
admin
author
```

## Permissions

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

## Role-Permission Mapping

Admin:

```txt
manage_users
manage_all_posts
manage_all_playlists
manage_all_media
view_analytics
```

Author:

```txt
manage_own_posts
manage_own_playlists
manage_own_media
```

---

# Future Tables

Not included in MVP:

```txt
comments
subscriptions
payments
teams
newsletters
ai_generations
recommendations
```
