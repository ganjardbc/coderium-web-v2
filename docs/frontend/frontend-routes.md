# Coderium V2 - Frontend Routes

---

# apps/web (Nuxt 3 — Public Site)

File-based routing.

| Route                   | Page File                           | Description              |
| ----------------------- | ----------------------------------- | ------------------------ |
| `/`                     | `pages/index.vue`                   | Beranda agency: hero (CTA audit gratis), apa itu Coderium, produk (semua produk published), proses, perbandingan, cara kerja sama (tanpa harga), tentang, FAQ, catatan terbaru, kontak |
| `/about`                | `pages/about.vue`                   | Tentang Coderium: apa itu Coderium, pendiri, cara kerja, catatan (artikel/series), kontak |
| `/articles`             | `pages/articles/index.vue`          | Browse & search all posts (`/explore` redirects here) |
| `/articles/:slug`       | `pages/articles/[slug].vue`         | Post detail (SSR + SEO; `/posts/:slug` redirects here) |
| `/playlists`            | `pages/playlists/index.vue`         | Playlist list            |
| `/playlists/:slug`      | `pages/playlists/[slug].vue`        | Playlist detail          |
| `/products`             | `pages/products/index.vue`          | Daftar produk terpublikasi |
| `/products/:slug`       | `pages/products/[slug].vue`         | Detail produk: badge, description, bukti, FAQ, CTA (SSR + SEO) |
| `/work-with-us`           | `pages/work-with-us.vue`              | Kerja Sama — cara kerja sama tanpa harga tetap (pasang sendiri, dipasang Coderium, dukungan bulanan), program design partner, syarat klien, FAQ, CTA audit gratis via email (statis, SSR, masuk sitemap otomatis) |

---

# apps/admin (Vue 3 — Admin Dashboard)

Module-based routing.

## Auth Routes

| Route                  | Page                              | Description        |
| ---------------------- | --------------------------------- | ------------------ |
| `/login`               | `modules/auth/pages/login.vue`    | Login page         |
| `/register`            | `modules/auth/pages/register.vue` | Register page      |
| `/forgot-password`     | `modules/auth/pages/forgot.vue`   | Forgot password    |

---

## Dashboard Routes

| Route          | Page                                  | Description       |
| -------------- | ------------------------------------- | ----------------- |
| `/dashboard`   | `modules/dashboard/pages/index.vue`   | Dashboard overview |

---

## Post Routes

| Route               | Page                             | Description           |
| ------------------- | -------------------------------- | --------------------- |
| `/posts`            | `modules/posts/pages/list.vue`   | Post list             |
| `/posts/create`     | `modules/posts/pages/create.vue` | Create post (type selector) |
| `/posts/:slug/edit` | `modules/posts/pages/edit.vue`   | Edit post             |

---

## Playlist Routes

| Route                    | Page                                | Description     |
| ------------------------ | ----------------------------------- | --------------- |
| `/playlists`             | `modules/playlists/pages/list.vue`  | Playlist list   |
| `/playlists/create`      | `modules/playlists/pages/create.vue`| Create playlist |
| `/playlists/:slug/edit`  | `modules/playlists/pages/edit.vue`  | Edit playlist   |

---

## Media Routes

| Route    | Page                           | Description      |
| -------- | ------------------------------ | ---------------- |
| `/media` | `modules/media/pages/index.vue`| Media library    |

---

## Analytics Routes

| Route        | Page                               | Description        |
| ------------ | ---------------------------------- | ------------------ |
| `/analytics` | `modules/analytics/pages/index.vue`| Analytics overview |

---

## Settings Routes

| Route                      | Page                                      | Description        |
| -------------------------- | ----------------------------------------- | ------------------ |
| `/settings/profile`        | `modules/settings/pages/profile.vue`      | Profile settings   |
| `/settings/password`       | `modules/settings/pages/password.vue`     | Change password    |
| `/settings/appearance`     | `modules/settings/pages/appearance.vue`   | Dark/light mode    |
| `/settings/two-factor`     | `modules/settings/pages/two-factor.vue`   | 2FA settings       |

---

# Route Meta (Admin)

Setiap route harus mendefinisikan meta:

```ts
meta: {
  title: 'Post List',
  layout: 'admin',     // auth | admin | public | error
  permission: ['manage_own_posts'],
}
```

---

# Layouts

## apps/admin

```txt
auth      — halaman login, register, forgot password
admin     — dashboard, posts, playlists, media, settings
error     — 404, 403, 500
```

## apps/web

```txt
default   — semua halaman public
minimal   — post detail (full-width)
```
