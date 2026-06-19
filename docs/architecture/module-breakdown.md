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
media
analytics
settings
```

## apps/web (Nuxt 3 — file-based routing)

```txt
pages/index.vue           # Home
pages/explore.vue         # Explore / browse
pages/posts/[slug].vue    # Post detail
pages/playlists/index.vue # Playlist list
pages/playlists/[slug].vue # Playlist detail
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
