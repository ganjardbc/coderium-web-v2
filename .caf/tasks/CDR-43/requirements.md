## Status: PLAN

## Ticket
CDR-43 — Playlist edit page breaks for playlists past page 1

## Source
Auditor Agent scan 2026-09-04

## Problem Statement
`apps/admin/src/modules/playlists/pages/edit.vue` loads the **paginated list** endpoint
(`GET /admin/playlists`, default page 1) and then finds the target playlist client-side with
`.find(p => p.slug === route.params.slug)`.

Once there are more than 10 playlists (the default page size), any playlist not on page 1
returns `undefined` from `.find()`, resulting in "Playlist not found" and an empty form. The
bug is silent in small datasets and manifests only as the dataset grows.

## Root Cause
No admin single-item endpoint exists for playlists (`GET /admin/playlists/:slug` for admin is
absent — only the public `GET /playlists/:slug` is present in the controller). The existing
admin `PUT /admin/playlists/:slug` (update) and `DELETE /admin/playlists/:slug` (delete)
already use slug-based service methods, so the backing service logic is essentially in place —
`findAdminAll` applies ownership scoping, and the same pattern must be applied to a new
`findAdminBySlug` method.

## Established Pattern (reference)
| Module   | Backend service method  | Controller route              | Frontend store method  |
|----------|------------------------|-------------------------------|------------------------|
| Posts    | `findAdminBySlug`      | `GET /admin/posts/:slug`      | `fetchPostBySlug`      |
| Products | `fetchProductById`     | `GET /admin/products/:id`     | `fetchProductById`     |

Playlists must match the Posts pattern (slug-based).

## Scope of Changes

### Backend — `apps/api`
1. **`PlaylistsService`** (`apps/api/src/playlists/playlists.service.ts`): add
   `findAdminBySlug(slug, userId, userRoles)` — finds the playlist by slug with
   `deletedAt: null`, throws `NotFoundException` if absent, throws `ForbiddenException` if the
   caller is not admin and doesn't own the playlist. Returns
   `{ success: true, message: 'Playlist retrieved', data: playlist }`.
2. **`PlaylistsController`** (`apps/api/src/playlists/playlists.controller.ts`): add
   `GET /admin/playlists/:slug` handler decorated with `@ApiBearerAuth()` and
   `@Permissions('manage_own_playlists', 'manage_all_playlists')`, calling
   `playlistsService.findAdminBySlug(slug, user.id, user.roles)`.

   > ⚠️ Route ordering: the new `GET /admin/playlists/:slug` must be declared **after**
   > `GET /admin/playlists` (the list route) in the controller — NestJS resolves routes in
   > declaration order and this is already the convention used by
   > `GET /admin/posts` → `GET /admin/posts/:slug`.

### Frontend — `apps/admin`
3. **Playlist store** (create `apps/admin/src/modules/playlists/stores/playlist.store.ts`):
   add a `fetchPlaylistBySlug(slug: string)` function that calls
   `GET /admin/playlists/:slug` and returns the playlist data. Model the store after
   `post.store.ts` — export a `Playlist` interface and a `usePlaylistStore` Pinia store.
4. **`edit.vue`** (`apps/admin/src/modules/playlists/pages/edit.vue`): replace the
   `onMounted` block so it calls `usePlaylistStore().fetchPlaylistBySlug(slug)` instead of
   fetching the full list and filtering client-side.

## Acceptance Criteria
- `GET /admin/playlists/:slug` returns a single playlist (auth-gated, ownership-scoped).
- Editing any playlist succeeds regardless of its position in the sorted list.
- The frontend edit page uses `fetchPlaylistBySlug` and no longer calls the paginated list
  endpoint on mount.
- The pattern mirrors posts (store method → edit page) — no inline `api.get` in the
  component.
- No existing endpoints (list, create, update, delete, posts attach/detach) are broken.

## Out of Scope
- Pagination UI changes on the playlist list page.
- Public-facing playlist endpoints (already correct).
- Any changes to Products or Posts modules.
