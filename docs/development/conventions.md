# Coderium V2 - Development Conventions

## Overview

Dokumen ini menjelaskan convention development Coderium V2.

Tujuan:

* Menjaga struktur project konsisten.
* Mempermudah kerja AI Coding Agent.
* Mempermudah maintenance.
* Mengikuti pola monorepo dari undangabi-v2.

---

# Monorepo Convention

```txt
coderium-v2/

├── apps/
│   ├── web/     # Nuxt 3 — public site
│   ├── admin/   # Vue 3 + Vite — admin
│   └── api/     # NestJS — backend

├── packages/
│   ├── ui/
│   ├── shared-types/
│   ├── shared-utils/
│   ├── eslint-config/
│   └── tsconfig/

├── docs/
├── infra/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

# Package Naming

Gunakan scope:

```txt
@coderium/*
```

Examples:

```txt
@coderium/ui
@coderium/shared-types
@coderium/shared-utils
@coderium/eslint-config
@coderium/tsconfig
```

Apps:

```txt
coderium-api
coderium-admin
coderium-web
```

---

# TypeScript Convention

Rules:

```txt
Strict mode enabled
No implicit any
Use explicit DTO/type
Prefer type over interface for simple object
Use interface only when extensibility is needed
```

---

# File Naming Convention

## General

Gunakan kebab-case.

```txt
post-form.vue
create-post.dto.ts
post-type.constant.ts
```

## NestJS Files

```txt
*.module.ts
*.controller.ts
*.service.ts
*.dto.ts
*.entity.ts
*.guard.ts
*.decorator.ts
```

## Vue Files (Admin)

PascalCase untuk reusable component:

```txt
PostCard.vue
PlaylistCard.vue
UiButton.vue
```

kebab-case untuk page:

```txt
list.vue
create.vue
edit.vue
```

---

# Backend Module Convention

```txt
module-name/

├── dto/
├── entities/
├── constants/

├── module-name.module.ts
├── module-name.controller.ts
└── module-name.service.ts
```

---

# Frontend Module Convention (Admin)

```txt
modules/module-name/

├── pages/
├── components/
├── stores/
├── services/
├── types/
└── router/
```

---

# Frontend Core Convention (Admin)

```txt
src/

├── core/
│   ├── initiate.ts
│   ├── global-routes.ts
│   ├── global-components.ts
│   └── global-styles.ts

├── modules/
└── shared/
```

`main.ts` harus tipis:

```ts
import './core/global-components';
import './core/global-styles';
import './core/initiate';
```

---

# Nuxt 3 Convention (apps/web)

Gunakan file-based routing.

```txt
pages/
├── index.vue
├── explore.vue
├── posts/
│   └── [slug].vue
└── playlists/
    ├── index.vue
    └── [slug].vue
```

Composables per domain:

```txt
composables/
├── usePost.ts
├── usePlaylist.ts
└── useAnalytics.ts
```

---

# Route Meta Convention (Admin)

```ts
meta: {
  title: 'Post List',
  layout: 'admin',
  permission: ['manage_own_posts'],
}
```

Layouts:

```txt
auth
admin
public
error
```

---

# Store Convention

Gunakan Pinia.

File:

```txt
stores/post.store.ts
```

Naming:

```ts
usePostStore
usePlaylistStore
useAuthStore
useMediaStore
```

---

# Service Convention (Admin)

```txt
services/post.service.ts
```

Service tidak boleh memanipulasi UI.

---

# Shared Types Convention

```txt
packages/shared-types/src/

├── user.ts
├── post.ts
├── playlist.ts
├── media.ts
├── analytics.ts
└── index.ts
```

---

# Shared Utils Convention

```txt
packages/shared-utils/src/

├── slugify.ts
├── format-date.ts
├── truncate-text.ts
├── format-number.ts
└── index.ts
```

Rules:

* Pure function.
* Tidak boleh bergantung ke Vue / Nuxt.
* Tidak boleh bergantung ke NestJS.

---

# Import Convention

Frontend (Admin):

```ts
import { useAuthStore } from '@/modules/auth/stores/auth.store';
```

Shared package:

```ts
import type { Post } from '@coderium/shared-types';
import { slugify } from '@coderium/shared-utils';
```

---

# Environment Convention

Backend:

```txt
DATABASE_URL
JWT_SECRET
S3_ENDPOINT
S3_ACCESS_KEY
S3_SECRET_KEY
S3_BUCKET
PORT
```

Frontend Admin:

```txt
VITE_API_BASE_URL
```

Frontend Web (Nuxt):

```txt
NUXT_API_BASE_URL
NUXT_PUBLIC_API_BASE_URL
```

---

# Git Convention

Branch naming:

```txt
feature/post-module
feature/playlist-module
fix/media-upload-error
chore/setup-monorepo
docs/update-api-contract
```

Commit style:

```txt
feat: add post module
fix: resolve media upload issue
docs: update api contract
chore: setup eslint config
refactor: simplify post service
```

---

# Forbidden Practices

Do not:

```txt
Mix domain logic into controller
Query database directly from frontend
Duplicate types between frontend and backend
Create one giant module
Put all routes in one file
Use any everywhere
Expose draft/unpublished post via public API
Store uploaded files binary in database
```
