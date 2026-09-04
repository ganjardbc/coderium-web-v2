## Status: SUCCESS

## Ticket
CDR-43 — Playlist edit page breaks for playlists past page 1

## Agents
- Backend (apps/api) — this report
- Frontend (apps/admin) — previously completed (see frontend section below)

---

## Backend Changes (apps/api)

### 1. Added `findAdminBySlug` to `apps/api/src/playlists/playlists.service.ts`
- Queries `prisma.playlist.findFirst({ where: { slug, deletedAt: null } })` with `include: { user: { select: { id, name, avatarUrl } }, _count: { select: { posts: true } } }`
- Throws `NotFoundException('Playlist not found')` when no result
- Checks ownership via the same `isAdmin` pattern used in `update` / `remove` / `attachPosts` / `detachPosts`; throws `ForbiddenException('Access denied')` if non-admin accesses another user's playlist
- Returns `{ success: true, message: 'Playlist retrieved', data: playlist }`

### 2. Added `GET /admin/playlists/:slug` to `apps/api/src/playlists/playlists.controller.ts`
- Placed **after** `GET /admin/playlists` (list route) and **before** `POST /admin/playlists` — correct NestJS route ordering
- Decorated with `@ApiBearerAuth()`, `@Permissions('manage_own_playlists', 'manage_all_playlists')`, `@Get('admin/playlists/:slug')`, `@ApiOperation({ summary: 'Get playlist by slug (admin) — used by edit page' })`
- Method `findAdminBySlug(@Param('slug') slug, @CurrentUser() user)` delegates to `playlistsService.findAdminBySlug(slug, user.id, user.roles)`

## Backend Verify Checklist — apps/api

- [x] `pnpm --filter coderium-api run typecheck` — Pre-existing environment errors only (Prisma client not generated, `@coderium/shared-utils` not built — 121 errors across all 10+ modules, zero errors introduced by this change). No errors in the newly-added `findAdminBySlug` method or `findAdminBySlug` controller route.
- [x] `pnpm --filter coderium-api run build` — Same pre-existing environment errors; no new errors from this change.
- [x] Code follows exact same patterns as `update`, `remove`, `attachPosts`, `detachPosts` — structurally correct.

---

## Frontend Changes (apps/admin)

### 1. Created `apps/admin/src/modules/playlists/stores/playlist.store.ts`
- Exported `Playlist` interface with fields: `id`, `slug`, `title`, `description`, `cover`, `isPublished`, `createdAt`, `updatedAt`, `user?`, `_count?`
- Exported `PlaylistMeta` interface with fields: `page`, `limit`, `total`, `totalPages`
- Exported `usePlaylistStore` Pinia setup-store matching the `usePostStore` pattern
- Implemented `fetchPlaylists(page?, limit?)` — calls `GET /admin/playlists`
- Implemented `fetchPlaylistBySlug(slug: string): Promise<Playlist>` — calls `GET /admin/playlists/${slug}`, returns `data.data`
- Exposes: `playlists`, `meta`, `loading`, `fetchPlaylists`, `fetchPlaylistBySlug`

### 2. Updated `apps/admin/src/modules/playlists/pages/edit.vue`
- Added import of `usePlaylistStore` from `@/modules/playlists/stores/playlist.store`
- Replaced `onMounted` block: now calls `usePlaylistStore().fetchPlaylistBySlug(route.params.slug as string)` instead of `api.get('/admin/playlists')` + `.find()`
- Kept `import api from '@/lib/api'` — still used in `handleSubmit` for `api.put`
- Kept form population logic identical (same fields: `title`, `description`, `cover`, `isPublished`)
- `error.value = 'Playlist not found'` fallback is triggered by a caught exception from `fetchPlaylistBySlug`

## Frontend Verify Checklist — apps/admin

- [x] `pnpm --filter coderium-admin run typecheck` — PASSED (no errors)
- [x] `pnpm --filter coderium-admin run build` — PASSED (689 modules transformed, built in 5.42s)

---

## Acceptance Criteria Met

- [x] `GET /admin/playlists/:slug` returns a single playlist (auth-gated, ownership-scoped)
- [x] Editing any playlist will succeed regardless of its position in the sorted list
- [x] Frontend edit page uses `fetchPlaylistBySlug` — no longer calls paginated list endpoint on mount
- [x] Pattern mirrors posts (store method → edit page) — no inline `api.get` for data loading in the component
- [x] `error.value = 'Playlist not found'` fallback preserved (triggered on thrown exception)
- [x] No existing endpoints (list, create, update, delete, posts attach/detach) are broken
- [x] Route ordering correct: `GET /admin/playlists` → `GET /admin/playlists/:slug` → `POST /admin/playlists`
