# Coderium V2 - Progress Tracker

Path:

```txt
docs/development/progress.md
```

## Overview

Dokumen ini digunakan untuk melacak progress development Coderium V2.

Rules:

* Update setiap task selesai.
* Update setiap phase berubah.
* Update setiap milestone tercapai.

Status:

```txt
NOT_STARTED
IN_PROGRESS
DONE
BLOCKED
```

---

# Project Status

Project:

```txt
Coderium V2
```

Current Status:

```txt
IN_PROGRESS
```

Current Phase:

```txt
Phase 16 - AI Content Generation (Backend done, ticket 24; apps/admin UI — ticket 25 — pending)
```

Current Milestone:

```txt
M11 - AI Agent Ready (IN_PROGRESS — admin UI ticket 25 DONE, backend ticket 24 pending merge PR #26)
```

Last Updated:

```txt
2026-08-30
```

---

# Overall Progress

## Phase Progress

| Phase                       | Status      | Progress |
| --------------------------- | ----------- | -------- |
| Phase 0 - Foundation        | DONE        | 100%     |
| Phase 1 - Auth & RBAC       | DONE        | 100%     |
| Phase 2 - Post Core         | DONE        | 100%     |
| Phase 3 - Media Management  | DONE        | 100%     |
| Phase 4 - Playlist          | DONE        | 100%     |
| Phase 5 - Engagement        | DONE        | 100%     |
| Phase 6 - Search            | DONE        | 100%     |
| Phase 7 - Analytics         | DONE        | 100%     |
| Phase 8 - Admin Polishing   | DONE        | 100%     |
| Phase 9 - Public Site       | DONE        | 100%     |
| Phase 10 - Production Ready | DONE        | 100%     |
| Phase 11 - Cross-App Integration | DONE     | 100%     |
| Phase 12 - Product Catalog (Backend) | DONE | 100%     |
| Phase 13 - Product Catalog (Admin UI) | DONE | 100%    |
| Phase 14 - Product Catalog (Public Site) | DONE | 100% |
| Phase 15 - Hermes Integration (Backend & Admin UI) | DONE | 100% |
| Phase 16 - AI Content Generation (Backend, ticket 24) | DONE | 100% |

---

## Milestone Progress

| Milestone                | Status      |
| ------------------------ | ----------- |
| M0 Foundation Ready      | DONE        |
| M1 Authentication Ready  | DONE        |
| M2 Post Core Ready       | DONE        |
| M3 Media Ready           | DONE        |
| M4 Playlist Ready        | DONE        |
| M5 Engagement Ready      | DONE        |
| M6 Search Ready          | DONE        |
| M7 Analytics Ready       | DONE        |
| M8 Admin Panel Ready     | DONE        |
| M9 Public Site Ready     | DONE        |
| M10 Production Release   | DONE        |
| M11 AI Agent Ready       | IN_PROGRESS |

---

# Current Sprint

## Sprint Goal

```txt
Phase 0 - Foundation Setup
```

---

## Current Tasks

### TODO

```txt
None
```

---

### IN_PROGRESS

```txt
AI-CONTENT-001 Implement AI Content backend module — generate artikel via LLM (ticket 24, PR #26, belum merge ke main)
```

---

### DONE

```txt
MONO-001 Setup pnpm workspace
MONO-002 Setup TurboRepo
MONO-003 Setup packages/shared-types
MONO-004 Setup packages/shared-utils
MONO-005 Setup packages/eslint-config
MONO-006 Setup packages/tsconfig
MONO-007 Setup packages/ui
API-001 Setup apps/api (NestJS)
API-002 Setup Prisma (v7 + driver adapter)
API-003 Setup PostgreSQL connection
API-004 Create initial Prisma schema
AUTH-001 Create Users schema (done via API-004)
AUTH-002 Create Roles schema (done via API-004)
AUTH-003 Create Auth Module (NestJS)
AUTH-004 Implement Register API (done via AUTH-003)
AUTH-005 Implement Login API (done via AUTH-003)
AUTH-006 Implement Logout API
AUTH-007 Implement Current User API (done via AUTH-003)
AUTH-008 Implement Forgot Password API
AUTH-009 Implement JWT Guard (done via AUTH-003)
AUTH-010 Implement Permissions Guard
AUTH-011 Seed Roles dan Permissions
ADMIN-AUTH-001 Create Login Page
ADMIN-AUTH-002 Create Register Page
ADMIN-AUTH-003 Create Forgot Password Page
POST-001 Create Post schema
POST-002 Implement Create Post API
POST-003 Implement List Posts API
POST-004 Implement Get Post Detail API
POST-005 Implement Update Post API
POST-006 Implement Delete Post API
POST-007 Implement Publish Post API
POST-008 Implement Unpublish Post API
POST-009 Implement Admin List Posts API
ADMIN-POST-001 Create Post List Page
ADMIN-POST-002 Create Post Form — Article
ADMIN-POST-003 Create Post Form — Carousel
ADMIN-POST-004 Create Post Form — Video
ADMIN-POST-005 Create Post Form — Stack Gallery
MEDIA-001 Create Media schema
MEDIA-002 Create Mediable schema
MEDIA-003 Setup storage (local + MinIO/R2 adapter)
MEDIA-004 Implement Upload Image API
MEDIA-005 Implement Upload Multiple Images API
MEDIA-006 Implement List Media API
MEDIA-007 Implement Update Media API
MEDIA-008 Implement Delete Media API
ADMIN-MEDIA-001 Create Media Library Page
ADMIN-MEDIA-002 Create Media Uploader Component
PL-001 Create Playlist schema (done via API-004)
PL-002 Create PlaylistPost schema (done via API-004)
PL-003 Implement Create Playlist API
PL-004 Implement List Playlists API
PL-005 Implement Get Playlist Detail API
PL-006 Implement Update Playlist API
PL-007 Implement Delete Playlist API
PL-008 Implement Attach Posts to Playlist API
PL-009 Implement Detach Posts from Playlist API
ADMIN-PL-001 Create Playlist List Page
ADMIN-PL-002 Create Playlist Form Page
ADMIN-PL-003 Create Playlist Post Manager
ENG-001 Create PostView schema
ENG-002 Create PostLike schema
ENG-003 Implement Track View API
ENG-004 Implement Toggle Like API
ENG-005 Implement Popular Posts API (done via POST-003)
SRCH-001 Implement Search API
WEB-SRCH-001 Create Explore Page (Nuxt)
ANA-001 Implement Analytics Overview API
ANA-002 Implement Top Posts by Views API
ANA-003 Implement Top Posts by Likes API
ADMIN-ANA-001 Create Analytics Dashboard Page
ADMIN-DASH-001 Create Admin Dashboard
ADMIN-USER-001 Create User Management Page
ADMIN-SET-001 Create Profile Settings Page
ADMIN-SET-002 Create Password Settings Page
ADMIN-SET-003 Create Appearance Settings Page
ADMIN-SET-004 Create 2FA Settings Page
WEB-HOME-001 Create Home Page
WEB-POST-001 Create Post Detail Page (SSR + SEO)
WEB-PL-001 Create Playlist List Page
WEB-PL-002 Create Playlist Detail Page
WEB-DARK-001 Implement Dark Mode
ADMIN-001 Setup apps/admin (Vue 3 + Vite)
WEB-001 Setup apps/web (Nuxt 3)
PROD-001 Setup Rate Limiter
PROD-002 Setup Error Tracking
PROD-003 Setup CI/CD (GitHub Actions)
PROD-004 Docker Setup
PROD-005 Production Deployment
INT-001 Add environment variables for cross-app redirection
INT-002 Fix API calls, Prisma schema validation, database seed, and light/dark mode
INT-003 Migrate AdminLayout.vue (apps/admin) hand-rolled UI to PrimeVue components (ticket 3)
PROD-CRUD-001 Create Product schema (ticket 12)
PROD-CRUD-002 Implement Product public API (ticket 12)
PROD-CRUD-003 Implement Product admin API — CRUD + publish/unpublish/archive/restore (ticket 12)
ADMIN-PROD-001 Create Product List & Form Pages (ticket 13)
WEB-PROD-001 Create Product Public Pages (ticket 14)
HERMES-001 Extend Post API — atribusi sumber, dedup, kontrak untuk hermes (ticket 18)
HERMES-002 Admin UI — tampilkan atribusi sumber draft hermes (ticket 19)
AI-CONTENT-001 Implement AI Content Generation module — generate + cover commit (ticket 24)
```

---

# MVP Critical Path

| Module   | Status      |
| -------- | ----------- |
| Auth     | DONE        |
| Posts    | DONE        |
| Media    | DONE        |
| Playlists| DONE        |
| Search   | DONE        |
| Analytics| DONE        |
| Products (backend ticket 12 + admin UI ticket 13 + public pages ticket 14) | DONE |
| Hermes Integration — Post API atribusi sumber & dedup (ticket 18, backend) + Admin UI atribusi sourceUrl (ticket 19) | DONE |
| AI Agent — generate artikel AI (admin UI ticket 25, DONE) + backend ai-content (ticket 24, IN_PROGRESS, PR #26 belum merge) | IN_PROGRESS |

---

## MVP Completion

```txt
~95% (AI Agent — admin UI ticket 25 DONE, backend ticket 24 pending merge PR #26)
```

Catatan: MVP (Phase 0-15) selesai 100%. Phase 16 (AI Content Generation) adalah
fitur post-MVP tambahan — backend (`ai-content` module, ticket 24) DONE, UI
`apps/admin` (ticket 25) belum dikerjakan, tidak dihitung dalam MVP Critical
Path di atas.

---

# Next Tasks

Priority Order:

```txt
Ticket 25 — apps/admin UI untuk AI Content Generation (grid card "AI Agent",
trigger POST /admin/ai-content/generate, preview, commit cover via
POST /admin/ai-content/cover, lalu POST /admin/posts)
```

---

# Technical Decisions

## Decision Log

### DEC-001

Date:

```txt
2026-06-19
```

Decision:

```txt
Use Monorepo with TurboRepo
```

Reason:

```txt
Shared types and shared UI between apps.
Konsisten dengan arsitektur undangabi-v2.
```

Status:

```txt
ACTIVE
```

---

### DEC-002

Date:

```txt
2026-06-19
```

Decision:

```txt
Use Nuxt 3 for public site (apps/web)
```

Reason:

```txt
SSR untuk SEO yang optimal di post detail.
File-based routing memudahkan development.
```

Status:

```txt
ACTIVE
```

---

### DEC-003

Date:

```txt
2026-06-19
```

Decision:

```txt
Use Vue 3 + Vite for admin (apps/admin)
```

Reason:

```txt
Lebih ringan dari Nuxt untuk SPA admin.
Konsisten dengan pattern undangabi-v2.
```

Status:

```txt
ACTIVE
```

---

### DEC-004

Date:

```txt
2026-06-20
```

Decision:

```txt
Use tsup as build tool for shared packages (shared-types, shared-utils, ui)
```

Reason:

```txt
Ringan, cepat, output ESM + CJS + DTS.
Tidak perlu konfigurasi bundler manual per package.
```

Status:

```txt
ACTIVE
```

---

### DEC-005

Date:

```txt
2026-06-21
```

Decision:

```txt
Use Prisma v7 with @prisma/adapter-pg for PostgreSQL connection
```

Reason:

```txt
Prisma v7 memperkenalkan driver adapters yang lebih flexible.
Pattern yang sama digunakan di project umkm-pos untuk konsistensi.
Driver adapter memungkinkan koneksi database yang lebih customizable.
```

Status:

```txt
ACTIVE
```

---

### DEC-006

Date:

```txt
2026-08-16
```

Decision:

```txt
Use PrimeVue PanelMenu (one-way controlled expandedKeys prop) for
apps/admin AdminLayout.vue sidebar navigation instead of Menu with a
fully custom template, and use PrimeVue Drawer for the mobile sidebar
(duplicating desktop/mobile nav markup within the single-file scope of
ticket 3 rather than extracting a shared component).
```

Reason:

```txt
PanelMenu's expandedKeys prop, when passed one-way (no v-model listener),
lets a header click update the emitted value without it ever being
reflected back into the component, so the submenu open/close state stays
driven entirely by our own route-based isMenuItemActive computed — a 1:1
replication of the original route-driven auto-expand behavior (not
click-to-toggle). PrimeVue Drawer is a teleported overlay that only
mounts while visible, so it cannot also serve as a persistent static
desktop sidebar; duplicating the nav/footer markup (both blocks reading
the same reactive state/functions) was chosen over introducing a new
shared component file, since ticket 3 explicitly scoped the change to a
single file (AdminLayout.vue only).
```

Status:

```txt
ACTIVE
```

Notes:

```txt
Markup duplication between the desktop <aside> and mobile <Drawer> blocks
in AdminLayout.vue is a known trade-off, flagged as a candidate for a
shared component extraction in a follow-up ticket. See
.caf/tasks/3/verify-report.md for the full evaluation and
docs/development/backlog.md INT-003 for a summary. Manual/browser smoke
test of the migrated nav (submenu auto-expand, mobile drawer, avatar
fallback, dark mode, logout) is still pending before merge.
```

---

### DEC-007

Date:

```txt
2026-08-24
```

Decision:

```txt
Add a new single permission `manage_products` (admin-only, no `_own`
variant) for the new Product module (ticket 12) instead of a new role, and
make an additive fix to `AllExceptionsFilter` (apps/api/src/shared/filters)
so extra properties on a thrown `HttpException` response object (e.g.
`fields` on the publish-validation error) are spread into the JSON error
response instead of being silently dropped.
```

Reason:

```txt
Product has no per-user ownership (unlike Post/Playlist's manage_own_*/
manage_all_* two-tier pattern), so a single admin-only permission mirrors
the existing `manage_users` pattern rather than introducing a new role —
consistent with the ticket's "reuse existing admin role, no new role"
constraint while still gating admin/products/* routes to admin only
(without any `@Permissions(...)` decorator, `PermissionsGuard` lets any
logged-in role through, which would not satisfy "admin-only").

The exception filter previously only forwarded `exception.message` as a
string, dropping any other keys Nest's `HttpException.initMessage()`
extracts out of a response object — so `BadRequestException({ message,
fields })` from publish validation lost `fields` before reaching the
client. The fix spreads the raw response object first, with the standard
fields (`success`, `statusCode`, `timestamp`, `path`, `message`) applied
after, so it is backward compatible: exceptions that throw a plain string
message produce byte-identical responses to before.
```

Status:

```txt
ACTIVE
```

Notes:

```txt
See `.caf/tasks/12/design.md` (§3, §7, §12) and `.caf/tasks/12/verify-report.md`
for full rationale and manual verification (401/403 gating, publish
validation `fields` surfacing, archive→restore round-trip). Also see
`docs/development/backlog.md` Phase 12 (PROD-CRUD-001..003) and
`docs/api/api-contract.md` (Products API sections + Permission Summary)
for the resulting API/permission surface.
```

---

### DEC-008

Date:

```txt
2026-08-24
```

Decision:

```txt
Add one new generic reusable component, RepeatableListField.vue
(apps/admin/src/components/), for the Product form's pipelineSteps and
features fields, instead of two separate ad-hoc implementations; and
derive Product's `status` purely from which form submit button is
clicked ("Simpan sebagai Draft" / "Simpan & Publish") rather than
exposing a manual status <select> in the form.
```

Reason:

```txt
pipelineSteps and features are structurally identical (repeatable
title + description rows with add/remove/reorder + inline per-row
validation), so a single generic component avoids duplicating the same
logic twice within one ticket — first reuse case for this pattern in
the codebase (Posts module has no equivalent repeatable-list field).

A manual status dropdown would duplicate/could conflict with the
dedicated lifecycle endpoints already implemented server-side in ticket
12 (/publish, /unpublish, /archive, /restore); deriving status from the
submit button keeps a single source of truth and stays consistent with
how the List page's row actions already drive status transitions.
```

Status:

```txt
ACTIVE
```

Notes:

```txt
See `.caf/tasks/13/requirements.md` ("Pertanyaan Terbuka" #1) and
`.caf/tasks/13/verify-report.md` ("Design decisions / deviations")
for full rationale. Also see `docs/development/backlog.md` Phase 13
(ADMIN-PROD-001) and `docs/architecture/module-breakdown.md` (Products
Module, apps/admin section) for the resulting frontend module surface.
```

---

### DEC-009

Date:

```txt
2026-08-24
```

Decision:

```txt
For the new Product public pages (ticket 14, apps/web): filter the
homepage "Featured Product" section client-side (`.find(p => p.featured)`
on the `order`-asc array from `GET /products?limit=24`) instead of adding
a `featured` query param to the public API; and extract a new reusable
`NotFoundState.vue` component (apps/web/components/) for the product
detail page's 404 state instead of migrating the existing inline 404
blocks in `posts/[slug].vue` / `playlists/[slug].vue`.
```

Reason:

```txt
`GET /products` (public, ticket 12) only supports `page`/`limit` — no
`featured` filter param. Adding one would be an `apps/api` change, out of
scope for a frontend-only ticket; client-side filtering is acceptable
while the product catalog stays small, and `.find()` on the already
`order`-asc-sorted array deterministically picks one product even if
multiple are `featured: true`.

`NotFoundState.vue` gives the new product detail page a reusable 404
component (title/message/backLabel props + internal `BackButton`) matching
the existing inline pattern used by Post/Playlist detail pages, without
touching those already-stable pages — avoiding any regression risk to
existing routes for a ticket that only needed the pattern once more.
```

Status:

```txt
ACTIVE
```

Notes:

```txt
See `.caf/tasks/14/requirements.md` (Scope 4, "Scope Komponen Baru — 404
state") and `.caf/tasks/14/verify-report.md` for full rationale and manual
verification. Also see `docs/development/backlog.md` Phase 14
(WEB-PROD-001), `docs/architecture/module-breakdown.md` (Public Pages —
Product List/Detail Page, Home Page), and `docs/api/api-contract.md`
(Products API > List Products) for the resulting frontend surface and the
documented API gap.
```

---

### DEC-010

Date:

```txt
2026-08-29
```

Decision:

```txt
For ticket 18 (extend Post API for the "hermes" external agent), on dedup
hit (externalId already exists) return an HTTP success response (existing
post data, message "Post already exists for this externalId") instead of
a 409 Conflict; and document the hermes integration contract as a new
section in the existing docs/api/api-contract.md instead of a separate
file under apps/api/docs/.
```

Reason:

```txt
hermes runs as an unattended cron job on a separate VPS (outside this
repo) with no human reading error responses in real time — a
success-but-informative response is more robust for a cron consumer than
an error that might trigger unnecessary retry/alert logic. The repo
already has a root-level API contract doc referenced from CLAUDE.md
(docs/api/api-contract.md), so extending it keeps a single source of
truth for API consumers instead of fragmenting contract docs per ticket.
```

Status:

```txt
ACTIVE
```

Notes:

```txt
See `.caf/tasks/18/requirements.md` ("Celah & Ambiguitas" #1) and
`.caf/tasks/18/verify-report.md` for full rationale and manual/functional
verification (dedup hit round-trip, unique constraint P2002 as DB-level
safety net, multiple NULL externalId not colliding). Also see
`docs/development/backlog.md` Phase 15 (HERMES-001) and
`docs/database/prisma-schema-design.md` (Post model — sourceUrl,
externalId) for the resulting schema/API surface. Ticket 19 (apps/admin,
displaying sourceUrl) depended on this ticket and is now also DONE — see
`.caf/tasks/19/verify-report.md`, `docs/development/backlog.md` Phase 15
(HERMES-002), and `docs/api/api-contract.md` (`# Hermes Integration`).
```

---

### DEC-011

Date:

```txt
2026-08-30
```

Decision:

```txt
For ticket 24 (backend module `ai-content`, apps/api): split the feature
into two endpoints — `POST /admin/ai-content/generate` (LLM + web search,
no DB write) and `POST /admin/ai-content/cover` (server-side fetch +
`MediaService.upload()` reuse) — instead of one combined endpoint or
reusing `POST /uploads/image` directly from the frontend; and hardcode the
LLM system prompt/style guide server-side with no API parameter to
override it.
```

Reason:

```txt
`POST /admin/posts` must keep its existing contract unchanged (no new
required fields), and browsers cannot reliably fetch images cross-origin
from an arbitrary external domain (CORS) nor satisfy a "no-hotlink"
requirement client-side — so the cover download+reupload has to happen
server-side, and a dedicated endpoint (rather than folding it into
`generate`) lets the caller (apps/admin, ticket 25) commit the cover only
after the user accepts the generated preview, avoiding wasted uploads for
previews that get discarded. The style guide (Bahasa Indonesia, "Aku"/
"Kamu", friendly tone) is a fixed product decision, not a per-request
setting — hardcoding it server-side (`ai-content.constants.ts`) prevents
any caller from bypassing the intended tone via request body.
```

Status:

```txt
ACTIVE
```

Notes:

```txt
See `.caf/tasks/24/requirements.md` ("Keputusan Desain: Endpoint Cover
Commit", "Style Guide LLM") and `.caf/tasks/24/verify-report.md` for full
rationale and verification (typecheck/build PASS, config-missing smoke
check via code reading). Also see `docs/development/backlog.md` Phase 16
(AI-CONTENT-001), `docs/architecture/module-breakdown.md` (AI Content
Module), and `docs/api/api-contract.md` (`# AI Content API (Admin, Ticket
#24)`) for the resulting API surface. Ticket 25 (apps/admin UI) is the
next dependent ticket, not yet started.
```

---

# AI Agent Instructions

Saat menyelesaikan task:

1. Update backlog.md status.
2. Update progress.md status.
3. Tambahkan task ke Completed Tasks.
4. Update percentage jika diperlukan.
5. Update Current Phase jika phase selesai.
6. Update Current Milestone jika milestone tercapai.
7. Tambahkan blocker jika ada masalah.
8. Tambahkan Decision Log jika ada keputusan arsitektur penting.
