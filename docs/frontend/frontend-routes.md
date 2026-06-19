# Coderium V2 - Frontend Routes

---

# apps/web (Nuxt 3 — Public Site)

File-based routing.

| Route                   | Page File                           | Description              |
| ----------------------- | ----------------------------------- | ------------------------ |
| `/`                     | `pages/index.vue`                   | Home — latest & popular  |
| `/explore`              | `pages/explore.vue`                 | Browse & search all posts |
| `/posts/:slug`          | `pages/posts/[slug].vue`            | Post detail (SSR + SEO)  |
| `/playlists`            | `pages/playlists/index.vue`         | Playlist list            |
| `/playlists/:slug`      | `pages/playlists/[slug].vue`        | Playlist detail          |

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
