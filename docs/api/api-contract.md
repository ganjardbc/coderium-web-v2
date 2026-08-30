# Coderium V2 - API Contract

## Overview

Base URL:

```txt
/api/v1
```

Authentication:

```txt
Authorization: Bearer <access_token>
```

Public endpoints tidak membutuhkan token.

---

# Standard Response Format

## Success Response

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

## List Response

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

## Error Response

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "title": ["Title is required"]
  }
}
```

Catatan: exception global filter (`AllExceptionsFilter`) meneruskan seluruh
properti tambahan dari response object `HttpException` (mis. `fields` pada
error validasi publish Product) apa adanya, di samping field standar
`success`/`statusCode`/`timestamp`/`path`/`message`. Untuk exception yang
hanya melempar pesan string biasa, bentuk response tidak berubah.

---

# Health API

## Health Check

```http
GET /health
```

Response:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "status": "ok",
    "service": "coderium-api"
  }
}
```

---

# Authentication API

## Register

```http
POST /auth/register
```

Request:

```json
{
  "name": "Ganjar Hadiatna",
  "email": "ganjar@coderium.id",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Register success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Ganjar Hadiatna",
      "email": "ganjar@coderium.id"
    },
    "access_token": "jwt_token"
  }
}
```

---

## Login

```http
POST /auth/login
```

Request:

```json
{
  "email": "ganjar@coderium.id",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Ganjar Hadiatna",
      "email": "ganjar@coderium.id",
      "roles": ["author"],
      "permissions": ["manage_own_posts"]
    },
    "access_token": "jwt_token"
  }
}
```

---

## Get Current User

```http
GET /auth/me
```

Response:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "name": "Ganjar Hadiatna",
    "email": "ganjar@coderium.id",
    "avatarUrl": null,
    "roles": ["author"],
    "permissions": [
      "manage_own_posts",
      "manage_own_playlists",
      "manage_own_media"
    ]
  }
}
```

---

## Forgot Password

```http
POST /auth/forgot-password
```

Request:

```json
{
  "email": "ganjar@coderium.id"
}
```

---

## Logout

```http
POST /auth/logout
```

---

# User API

## Get Profile

```http
GET /users/me
```

---

## Update Profile

```http
PATCH /users/me
```

Request:

```json
{
  "name": "Ganjar Hadiatna",
  "avatarUrl": "https://cdn.coderium.id/avatar.jpg"
}
```

---

## Change Password

```http
PATCH /users/me/password
```

Request:

```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword"
}
```

---

# Admin User API

## List Users

```http
GET /admin/users?page=1&limit=10&search=ganjar
```

Permission: `manage_users`

---

## Get User Detail

```http
GET /admin/users/:id
```

---

## Update User

```http
PATCH /admin/users/:id
```

---

## Delete User

```http
DELETE /admin/users/:id
```

---

# Posts API (Public)

## List Posts

```http
GET /posts?page=1&limit=10&type=article&tags=vue
```

Response:

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "slug": "cara-pakai-claude-code",
      "title": "Cara Pakai Claude Code",
      "subtitle": "Step-by-step untuk developer",
      "cover": "https://cdn.coderium.id/cover.jpg",
      "type": "article",
      "tags": ["ai", "claude", "dev-tools"],
      "viewsCount": 1250,
      "likesCount": 89,
      "publishedAt": "2026-06-01T08:00:00Z"
    }
  ],
  "meta": { ... }
}
```

---

## Recent Posts

```http
GET /posts/recent?limit=10
```

---

## Popular Posts

```http
GET /posts/popular?limit=10
```

---

## Get Post Detail

```http
GET /posts/:slug
```

Response:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "slug": "cara-pakai-claude-code",
    "title": "Cara Pakai Claude Code",
    "subtitle": "Step-by-step untuk developer",
    "content": "<rich text html>",
    "tags": ["ai", "claude"],
    "cover": "https://cdn.coderium.id/cover.jpg",
    "type": "article",
    "viewsCount": 1250,
    "likesCount": 89,
    "metaDescription": "Panduan lengkap menggunakan Claude Code",
    "publishedAt": "2026-06-01T08:00:00Z",
    "media": [],
    "playlists": []
  }
}
```

---

## Like Post

```http
POST /posts/:slug/like
```

Public.

Response:

```json
{
  "success": true,
  "message": "Liked",
  "data": {
    "liked": true,
    "likesCount": 90
  }
}
```

---

# Posts API (Admin)

## Admin List Posts

```http
GET /admin/posts?page=1&limit=10&type=article&is_published=true&search=claude
```

Permission: `manage_own_posts` or `manage_all_posts`

---

## Create Post

```http
POST /admin/posts
```

Permission: `manage_own_posts` or `manage_all_posts`

Request:

```json
{
  "title": "Cara Pakai Claude Code",
  "subtitle": "Step-by-step untuk developer",
  "content": "<rich text>",
  "tags": ["ai", "claude"],
  "cover": "https://cdn.coderium.id/cover.jpg",
  "type": "article",
  "metaDescription": "Panduan lengkap...",
  "metaKeywords": "claude,ai,developer",
  "sourceUrl": "https://source-site.example/article-slug",
  "externalId": "hermes:2026-08-29:article-slug"
}
```

`sourceUrl` (optional, string) — URL artikel sumber, untuk atribusi asal
artikel. Nullable, tidak divalidasi format URL di level API.

`externalId` (optional, string, unique) — identifier unik dari sistem
eksternal (mis. hermes), dipakai sebagai basis dedup create-post. Kalau
tidak dikirim, behavior create tidak berubah (create normal setiap request,
tanpa dedup check). Kalau dikirim dan sudah ada post lain (belum
soft-deleted) dengan `externalId` yang sama, endpoint TIDAK membuat post
baru — response tetap `200`/sukses, `data` berisi post existing tersebut,
dan `message` menjadi `"Post already exists for this externalId"` (berbeda
dari `"Post created"` pada create baru). Lihat `## Hermes Integration` untuk
detail kontrak lengkap konsumsi endpoint ini dari agent eksternal.

---

## Get Admin Post Detail

```http
GET /admin/posts/:slug
```

---

## Update Post

```http
PUT /admin/posts/:slug
```

---

## Delete Post

```http
DELETE /admin/posts/:slug
```

---

## Publish Post

```http
POST /admin/posts/:slug/publish
```

---

## Unpublish Post

```http
POST /admin/posts/:slug/unpublish
```

---

# Playlists API (Public)

## List Playlists

```http
GET /playlists?page=1&limit=10
```

---

## Get Playlist Detail

```http
GET /playlists/:slug
```

Response:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "slug": "ai-tools-untuk-developer",
    "title": "AI Tools untuk Developer",
    "description": "Koleksi konten seputar AI tools terbaik",
    "cover": "https://cdn.coderium.id/playlist-cover.jpg",
    "posts": [
      {
        "id": "uuid",
        "slug": "cara-pakai-claude-code",
        "title": "Cara Pakai Claude Code",
        "order": 1
      }
    ]
  }
}
```

---

# Playlists API (Admin)

## Create Playlist

```http
POST /admin/playlists
```

Request:

```json
{
  "title": "AI Tools untuk Developer",
  "description": "Koleksi konten seputar AI tools terbaik",
  "slug": "ai-tools-untuk-developer",
  "cover": "https://cdn.coderium.id/cover.jpg"
}
```

---

## Admin List Playlists

```http
GET /admin/playlists?page=1&limit=10
```

Permission: `manage_own_playlists` or `manage_all_playlists`

---

## Update Playlist

```http
PUT /admin/playlists/:slug
```

---

## Delete Playlist

```http
DELETE /admin/playlists/:slug
```

---

## Attach Posts to Playlist

```http
POST /admin/playlists/:slug/posts
```

Request:

```json
{
  "post_ids": ["uuid1", "uuid2"]
}
```

---

## Detach Posts from Playlist

```http
DELETE /admin/playlists/:slug/posts
```

Request:

```json
{
  "post_ids": ["uuid1"]
}
```

---

# Media API

## List Media

```http
GET /admin/media?page=1&limit=20&mime_type=image
```

Permission: `manage_own_media` or `manage_all_media`

---

## Upload Image

```http
POST /uploads/image
```

Content-Type: `multipart/form-data`

Form Data:

```txt
file: image.jpg
```

Response:

```json
{
  "success": true,
  "message": "Upload success",
  "data": {
    "id": "uuid",
    "url": "https://cdn.coderium.id/media/image.jpg",
    "filename": "image.jpg",
    "mimeType": "image/jpeg",
    "size": 204800
  }
}
```

---

## Upload Multiple Images

```http
POST /uploads/images
```

Content-Type: `multipart/form-data`

Form Data:

```txt
files: [image1.jpg, image2.jpg]
```

---

## Get Media Detail

```http
GET /admin/media/:id
```

---

## Update Media

```http
PUT /admin/media/:id
```

---

## Delete Media

```http
DELETE /admin/media/:id
```

---

# AI Content API (Admin, Ticket #24)

Modul `apps/api/src/ai-content/` — generate draft artikel via LLM
OpenAI-compatible (dengan built-in web search) dan commit cover image hasil
generate ke media library internal. Semua endpoint di bawah butuh auth
(`Authorization: Bearer <access_token>`) dan permission `manage_own_posts`
atau `manage_all_posts` (permission sama dengan Create Post, tidak ada
permission baru).

## Generate Article

```http
POST /admin/ai-content/generate
```

Tanpa body/parameter dari caller (tidak ada form input — tone/style guide
di-hardcode server-side, tidak bisa di-override dari request). Memanggil LLM
provider OpenAI-compatible (`AI_CONTENT_LLM_*` env var, lihat di bawah)
dengan built-in web search tool untuk mencari 1 artikel trending
(AI/Coding/Technology/Startup), lalu me-rewrite jadi draft Bahasa Indonesia.

Response:

```json
{
  "success": true,
  "message": "Article generated",
  "data": {
    "title": "...",
    "content": "<rich text html>",
    "coverUrl": "https://external-source.example/cover.jpg",
    "sourceUrl": "https://external-source.example/article-slug"
  }
}
```

Catatan:

* `data.content` berupa fragment HTML (mengikuti format `RichTextEditor.vue`
  di `apps/admin`, `contenteditable` + `innerHTML` — bukan markdown/plain
  text).
* `data.coverUrl` adalah URL eksternal (kandidat, belum diupload) —
  **JANGAN** dikirim langsung sebagai `cover` di `POST /admin/posts`
  (hotlink). Panggil `POST /admin/ai-content/cover` dulu untuk dapat URL
  internal.
* Endpoint ini TIDAK menulis apapun ke database.
* Durasi request dicatat via structured log
  (`{ event: 'ai_content_generate', durationMs, success }`) sebagai baseline
  observability latensi.
* Kalau env var LLM (`AI_CONTENT_LLM_API_KEY`/`AI_CONTENT_LLM_BASE_URL`/
  `AI_CONTENT_LLM_MODEL`) belum diisi → `500` dengan pesan konfigurasi
  eksplisit. Kalau provider/parsing response gagal → `502 Bad Gateway`.

---

## Commit Cover

```http
POST /admin/ai-content/cover
```

Request:

```json
{
  "imageUrl": "https://external-source.example/cover.jpg"
}
```

`imageUrl` — wajib, URL absolut (`@IsUrl({ require_protocol: true })`),
biasanya diisi dari `data.coverUrl` hasil `generate`.

Proses: fetch `imageUrl` server-side (bukan dari browser — hindari CORS,
konsisten dengan requirement no-hotlink), validasi `Content-Type: image/*`
dan ukuran maksimum 10MB, lalu panggil `MediaService.upload()` existing
(reuse langsung, sama service yang dipakai `POST /uploads/image`) untuk
menghasilkan `Media` record + URL internal.

Response:

```json
{
  "success": true,
  "message": "Cover uploaded",
  "data": {
    "url": "https://api.coderium.id/uploads/media/xxx.jpg",
    "mediaId": "uuid"
  }
}
```

Catatan:

* `data.url` adalah URL internal yang **wajib** dipakai sebagai `cover` saat
  memanggil `POST /admin/posts` — endpoint ini sendiri TIDAK memanggil
  `POST /admin/posts` (tetap tanggung jawab caller/frontend).
* Kegagalan fetch (network error, timeout 15s, bukan gambar valid, > 10MB)
  dikembalikan sebagai error HTTP jelas (4xx/5xx sesuai kasus), detail
  teknis dilog di backend, pesan generik ke caller.

## Environment Variables

Ditambahkan di `apps/api/.env` / `.env.example` (pola sama seperti
`JWT_SECRET`):

```txt
AI_CONTENT_LLM_API_KEY   # API key provider LLM
AI_CONTENT_LLM_BASE_URL  # base URL provider (OpenAI-compatible, bukan hardcode ke OpenAI resmi)
AI_CONTENT_LLM_MODEL     # model id, wajib eksplisit
```

Provider WAJIB mendukung built-in web search tool — prasyarat fungsional
untuk `generate`. Kredensial asli tidak pernah di-commit; hanya placeholder
di `.env.example`.

---

# Products API (Public)

## List Products

```http
GET /products?page=1&limit=10
```

Hanya mengembalikan product dengan `status = published`, urut `order` asc.

**Catatan (ticket 14, `apps/web`):** endpoint ini TIDAK punya parameter filter
`featured` — hanya `page`/`limit`. Konsumen yang butuh "satu featured product"
(mis. homepage `apps/web/pages/index.vue`) harus fetch daftar lalu filter
`featured === true` di client (`.find(p => p.featured)` pada array yang sudah
terurut `order` asc, supaya deterministik kalau ada lebih dari satu produk
`featured: true`). Ini diterima sebagai gap yang acceptable selama katalog
produk masih kecil; kalau dibutuhkan filter server-side di masa depan, perlu
ticket API terpisah untuk menambah param `featured` (lihat
`.caf/tasks/14/requirements.md` Scope 4).

Response:

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "slug": "coderium-copilot",
      "name": "Coderium Copilot",
      "tagline": "AI pair programmer untuk tim kamu",
      "status": "published",
      "cover": "https://cdn.coderium.id/products/cover.jpg",
      "ctaLabel": "Request pilot",
      "ctaUrl": "https://coderium.id/contact",
      "order": 0,
      "featured": true
    }
  ],
  "meta": { ... }
}
```

---

## Get Product Detail

```http
GET /products/:slug
```

Hanya mengembalikan product dengan `status = published`. Kalau tidak
ditemukan ATAU status-nya `draft`/`archived`, response `404` (tidak
membedakan pesan, supaya tidak bocor existence produk non-published).

Response:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "slug": "coderium-copilot",
    "name": "Coderium Copilot",
    "tagline": "AI pair programmer untuk tim kamu",
    "description": "<rich text/markdown mentah>",
    "status": "published",
    "cover": "https://cdn.coderium.id/products/cover.jpg",
    "pipelineSteps": [
      { "title": "Connect repo", "description": "..." }
    ],
    "features": [
      { "title": "Code review otomatis", "description": "..." }
    ],
    "ctaLabel": "Request pilot",
    "ctaUrl": "https://coderium.id/contact",
    "order": 0,
    "featured": true
  }
}
```

---

# Products API (Admin)

Semua endpoint di bawah butuh auth (`Authorization: Bearer <access_token>`)
dan permission `manage_products`.

## Admin List Products

```http
GET /admin/products?page=1&limit=10&sort=order&dir=asc
```

Permission: `manage_products`

Tidak difilter status (menampilkan `draft`/`published`/`archived`). `sort`
bisa `order` (default) atau `updatedAt`.

---

## Get Admin Product Detail

```http
GET /admin/products/:id
```

Permission: `manage_products`

---

## Create Product

```http
POST /admin/products
```

Request:

```json
{
  "name": "Coderium Copilot",
  "slug": "coderium-copilot",
  "tagline": "AI pair programmer untuk tim kamu",
  "description": "...",
  "cover": "https://cdn.coderium.id/products/cover.jpg",
  "pipelineSteps": [{ "title": "Connect repo", "description": "..." }],
  "features": [{ "title": "Code review otomatis", "description": "..." }],
  "ctaLabel": "Request pilot",
  "ctaUrl": "https://coderium.id/contact",
  "order": 0,
  "featured": true
}
```

`status` default `draft` kalau tidak dikirim. Kalau `status: "published"`
dikirim langsung, berlaku validasi publish (lihat di bawah).

---

## Update Product

```http
PATCH /admin/products/:id
```

Partial update. Kalau body membuat `status` akhir jadi `published` (baik
dikirim eksplisit maupun status existing sudah `published`), validasi
publish berlaku terhadap data gabungan (existing + body).

---

## Publish Product

```http
POST /admin/products/:id/publish
```

Set `status: published`. Field wajib untuk publish: `cover`, `ctaUrl`
(format URL valid), minimal 1 `pipelineSteps`, minimal 1 `features`.

Response error (400) kalau validasi gagal:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validasi publish gagal",
  "fields": ["cover", "ctaUrl", "pipelineSteps", "features"]
}
```

---

## Unpublish Product

```http
POST /admin/products/:id/unpublish
```

Set `status: draft`. Tanpa validasi field wajib.

---

## Archive Product

```http
POST /admin/products/:id/archive
```

Set `status: archived`. Produk hilang dari endpoint publik, data tetap ada.

---

## Restore Product

```http
POST /admin/products/:id/restore
```

Set `status: draft` (bukan status sebelum archive — tidak ada tracking
status sebelumnya). Semua field lain tetap tidak berubah.

---

# Search API

## Search

```http
GET /search?q=claude&type=article&tags=ai&page=1&limit=10
```

Public.

Response:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "posts": [],
    "playlists": []
  },
  "meta": { ... }
}
```

---

# Analytics API

## Analytics Overview

```http
GET /admin/analytics
```

Permission: `view_analytics`

Response:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "totalPosts": 45,
    "totalPlaylists": 8,
    "totalViews": 15230,
    "totalLikes": 892
  }
}
```

---

## Top Posts by Views

```http
GET /admin/analytics/posts?sort=views&limit=10
```

---

## Top Posts by Likes

```http
GET /admin/analytics/posts?sort=likes&limit=10
```

---

# Permission Summary

```txt
manage_users
manage_all_posts
manage_all_playlists
manage_all_media
manage_products
view_analytics

manage_own_posts
manage_own_playlists
manage_own_media
```

Catatan: `manage_products` adalah permission tunggal (tanpa varian `_own`),
dipetakan hanya ke role `admin` — Product tidak punya ownership per-user,
jadi pola-nya mengikuti `manage_users`, bukan pola dua-tier Posts/Playlists/Media.

---

# Hermes Integration (Ticket #18)

Kontrak referensi integrasi untuk agent "hermes" (VPS terpisah, di luar repo
ini) — scrape artikel AI, kirim ke Telegram, dan create draft `Post` via API
ini. Tiga endpoint yang dipakai hermes sebagai API consumer:

| Method | Path | Guna | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Login bot user, dapat JWT | Public |
| POST | `/api/v1/uploads/image` | Upload cover image, dapat URL internal | JWT (bot user) |
| POST | `/api/v1/admin/posts` | Create post/draft, dedup by `externalId` | JWT (bot user, permission `manage_own_posts`) |

## Alur yang direkomendasikan

1. `POST /auth/login` dengan kredensial bot user (sudah diprovision & di luar
   scope ticket ini) → dapat `access_token`.
2. Kalau artikel punya gambar cover, `POST /uploads/image` (multipart,
   `file`) dulu → dapat `data.url` (URL internal, mis.
   `{APP_URL}/uploads/media/xxx.jpg`).
3. `POST /admin/posts` dengan body sesuai `CreatePostDto` (lihat field di
   bawah), `cover` **wajib** diisi dengan URL hasil langkah 2 — bukan
   hotlink ke domain sumber artikel. Validasi/enforcement "harus URL
   internal" adalah tanggung jawab hermes sendiri; API tidak menolak string
   URL eksternal apa adanya (di luar scope ticket ini).
4. Draft yang dibuat TIDAK auto-publish. Publish manual tetap lewat
   `POST /admin/posts/:slug/publish` (endpoint existing, tidak berubah oleh
   ticket ini) — dilakukan oleh reviewer konten di `apps/admin`.

## Field `CreatePostDto` yang relevan untuk hermes

```ts
{
  title: string;             // wajib
  subtitle?: string;
  content?: string;
  type: 'article' | 'carousel' | 'video' | 'stack_gallery'; // wajib, hermes pakai 'article'
  tags?: string[];
  cover?: string;             // WAJIB berisi URL internal hasil /uploads/image, bukan hotlink eksternal
  metaDescription?: string;
  metaKeywords?: string;
  isPublished?: boolean;      // hermes TIDAK kirim ini — default false
  mediaIds?: string[];
  sourceUrl?: string;         // BARU (ticket #18) — URL artikel sumber, wajib diisi hermes
  externalId?: string;        // BARU (ticket #18) — identifier unik dari hermes, wajib diisi hermes untuk dedup
}
```

## Behavior dedup (final, ticket #18)

- Dedup HANYA aktif kalau `externalId` dikirim di request. Post manual dari
  admin dashboard (tanpa `externalId`) tidak pernah kena dedup check, create
  normal setiap kali seperti sebelumnya.
- Kalau `externalId` dikirim dan sudah ada post lain (belum soft-deleted)
  dengan `externalId` yang sama: API **TIDAK** membuat row baru. Response
  tetap HTTP sukses (`200`/`201`, bukan `409 Conflict`) dengan `data` berisi
  post existing (shape sama seperti create biasa) dan
  `message: "Post already exists for this externalId"`.
  - Keputusan ini diambil karena hermes adalah cron otomatis tanpa manusia
    yang membaca error response secara real-time — response
    sukses-tapi-informatif lebih robust daripada error yang berpotensi
    memicu retry/alert yang tidak perlu di sisi cron VPS.
- `externalId` bersifat unique tapi nullable (`String? @unique` di Prisma) —
  banyak post manual dengan `externalId: null` tidak saling bentrok
  (behavior standar unique index PostgreSQL: `NULL` dianggap distinct).

## Batas ukuran upload

`POST /uploads/image` membatasi ukuran file maksimum **10MB**
(`fileSize: 10 * 1024 * 1024`, `apps/api/src/media/media.controller.ts:27`)
— batas existing, tidak diubah oleh ticket ini. Hermes perlu handle/compress
gambar di sisi VPS sebelum upload kalau melebihi batas ini.

## Konsumsi `sourceUrl` di `apps/admin` (Ticket #19)

`GET /admin/posts` (list) dan `GET /admin/posts/:slug` (detail) sudah
mengembalikan `sourceUrl` apa adanya tanpa perubahan tambahan (tidak ada
`select` whitelist di query Prisma-nya) — endpoint tidak berubah dari kontrak
di atas. `apps/admin` (frontend, ticket #19, terpisah dari #18) memakai field
ini untuk: badge "Hermes" di baris post pada halaman list post yang
`sourceUrl`-nya terisi, dan link read-only (buka tab baru) ke artikel sumber
di halaman edit post. `sourceUrl` tidak pernah dikirim balik ke
`PUT /admin/posts/:slug` oleh admin UI (read-only dari sisi frontend).

---

# HTTP Status Codes

```txt
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error
```
