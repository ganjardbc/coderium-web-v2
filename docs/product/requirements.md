# Coderium V2 - Product Requirements Document (PRD)

## Overview

Coderium V2 adalah platform **Content Publishing & Knowledge Management System** yang dirancang khusus untuk developer dan content creator berbagi knowledge, tutorial, dan konten edukatif.

Tujuan utama produk:

* Membuat dan mempublikasikan konten dalam berbagai format.
* Mengorganisasi konten dalam playlist / koleksi tematik.
* Mendukung engagement audiens melalui likes dan tracking views.
* Mengelola media secara terpusat (gambar, video).
* Menyediakan search experience yang baik.
* Admin panel untuk manajemen konten dan analytics.

---

# Product Positioning

Bukan hanya:

> Blog biasa

Tetapi:

> Platform Knowledge Hub untuk Developer & Content Creator

---

# Target Users

## Author / Creator

Developer, content creator, atau educator yang ingin mempublikasikan konten berformat artikel, carousel, video tutorial, atau stack gallery.

## Visitor / Reader

Developer dan learner yang mencari konten edukatif seputar programming, AI tools, career, dan teknologi.

## Admin

Tim internal Coderium yang mengelola platform dan konten.

---

# MVP Scope

## Authentication

### Register

Pengguna dapat membuat akun baru menggunakan email dan password.

### Login

Pengguna dapat masuk ke sistem menggunakan akun yang terdaftar.

### Forgot Password

Pengguna dapat melakukan reset password.

### Logout

Pengguna dapat keluar dari sistem.

### 2FA (Two-Factor Authentication)

Mendukung autentikasi dua faktor untuk keamanan tambahan.

---

# Role & Permission

## Admin

Memiliki akses penuh ke seluruh sistem.

Kemampuan:

* Kelola semua post
* Kelola semua playlist
* Kelola semua user
* Kelola semua media
* Lihat analytics platform

---

## Author

Memiliki akses terhadap konten miliknya sendiri.

Kemampuan:

* Buat dan kelola post sendiri
* Buat dan kelola playlist sendiri
* Upload dan kelola media sendiri

---

# Post Management

## Post Types

Coderium mendukung empat tipe konten:

### Article

Konten artikel berbasis rich-text (markdown atau WYSIWYG editor).

---

### Carousel

Konten berformat slide / carousel. Setiap slide berisi gambar dengan caption.

Cocok untuk:

* Tips singkat
* Step-by-step visual guide
* Infographic

---

### Video

Konten berbasis video embed atau upload.

---

### Stack Gallery

Konten visual berformat galeri bersusun (stacked).

---

## Post Fields

Setiap post memiliki:

* Title
* Subtitle (opsional)
* Slug (auto-generate dari title, dapat dikustomisasi)
* Content (rich text)
* Tags
* Cover image
* Type (article / carousel / video / stack_gallery)
* Media (gambar carousel atau video URL)
* Status (published / draft)
* Published date
* SEO: meta description, meta keywords

---

## Post Actions

Author dapat:

* Create Post
* Edit Post
* Delete Post (soft delete)
* Publish Post
* Unpublish Post (draft)

---

## Engagement

### Views Tracking

Setiap kunjungan ke post dicatat:

* IP Address
* User Agent
* Referer
* Timestamp

Views count ditampilkan di post detail dan admin dashboard.

---

### Likes

Visitor dapat menyukai post.

Like bersifat toggle (like / unlike).

Like count ditampilkan di post.

---

# Playlist Management

## Playlist

Koleksi / kurasi post bertemakan tertentu.

Contoh:

```txt
Playlist "AI Tools untuk Developer"
├── Post: "Claude Code — Getting Started"
├── Post: "Cara Pakai Cursor AI"
├── Post: "Perbandingan AI Coding Tools 2025"
```

---

## Playlist Fields

Setiap playlist memiliki:

* Title
* Description
* Slug
* Cover image
* Status (published / draft)
* Order

---

## Playlist Actions

Author dapat:

* Create Playlist
* Edit Playlist
* Delete Playlist (soft delete)
* Tambah post ke playlist
* Hapus post dari playlist
* Atur urutan post dalam playlist

---

# Media Management

## Fitur Media

* Upload gambar (single dan multiple)
* Upload video
* Preview media sebelum attach ke post
* Polymorphic attachment (media dapat di-attach ke post maupun playlist)
* Media library terpusat

---

## Media Tags

Media yang di-attach ke post menggunakan tag untuk menentukan posisi / fungsi:

```txt
carousel     # untuk slide carousel
video        # untuk konten video
stack_gallery # untuk stack gallery
cover        # untuk cover image
```

---

# Search

## Full-Text Search

Pencarian berdasarkan:

* Title post
* Subtitle post
* Content post

---

## Filter

Filter konten berdasarkan:

* Type (article / carousel / video / stack_gallery)
* Tags
* Playlist

---

# Public Site

## Home Page

Menampilkan:

* Featured / latest posts
* Popular posts
* Playlist highlights

---

## Post Detail Page

Menampilkan:

* Konten post lengkap
* Views count
* Likes count
* Related posts
* Breadcrumb / navigasi

SEO:

* Meta title
* Meta description
* Open Graph image
* Structured data

---

## Playlist Page

Menampilkan:

* Daftar post dalam playlist
* Info playlist (cover, description)

---

## Explore Page

Menampilkan:

* Semua post dengan filter dan search

---

# Admin Panel

## Admin Dashboard

Menampilkan:

* Total post
* Total playlist
* Total views
* Total likes
* Recent posts

---

## Post Management

Admin dapat:

* List semua post
* Create post
* Edit post
* Delete post
* Toggle publish status

---

## Playlist Management

Admin dapat:

* List semua playlist
* Create playlist
* Edit playlist
* Delete playlist
* Kelola post dalam playlist

---

## Media Management

Admin dapat:

* List semua media
* Upload media
* Edit media
* Delete media

---

## User Settings

Pengguna dapat:

* Update profile
* Change password
* Manage 2FA
* Update appearance (dark/light mode)

---

# Analytics

## Engagement Analytics

Menampilkan:

* Total views per post
* Total likes per post
* Trending posts
* Top posts by views
* Top posts by likes

---

# Out Of Scope (Not Included in MVP)

## Comment System

Visitor tidak bisa berkomentar di post.

---

## Subscription / Paid Content

Tidak ada konten berbayar di MVP.

---

## Team Collaboration

Tidak ada fitur multi-author / tim.

---

## Newsletter

Tidak ada fitur email newsletter.

---

## AI Content Generator

Generate konten otomatis menggunakan AI.

---

## Recommendation Engine

Sistem rekomendasi konten berbasis behavior.

---

# Success Criteria

MVP dianggap berhasil apabila:

1. Author dapat membuat semua tipe konten (article, carousel, video, stack gallery).
2. Author dapat membuat dan mengelola playlist.
3. Visitor dapat browse, search, dan membaca konten.
4. Visitor dapat memberikan like pada post.
5. Views tracking berjalan.
6. Admin dapat mengelola konten dari dashboard.
7. Analytics dasar tersedia.
8. SEO berjalan untuk post detail.
