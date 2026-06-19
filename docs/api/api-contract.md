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
  "metaKeywords": "claude,ai,developer"
}
```

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
view_analytics

manage_own_posts
manage_own_playlists
manage_own_media
```

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
