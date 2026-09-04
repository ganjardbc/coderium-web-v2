## Ticket: CDR-43

## Agent Order
1. **Backend** — add `findAdminBySlug` service method + `GET /admin/playlists/:slug` controller route
2. **Frontend** — create playlist store with `fetchPlaylistBySlug`, update `edit.vue`

Backend must ship first; Frontend depends on the new endpoint existing.

---

## Backend Tasks

- [ ] (apps/api) In `apps/api/src/playlists/playlists.service.ts`, add `findAdminBySlug(slug: string, userId: string, userRoles: Record<string, unknown>[])`:
  - Query `prisma.playlist.findFirst({ where: { slug, deletedAt: null } })`
  - Throw `NotFoundException('Playlist not found')` if no result
  - Check ownership (same `isAdmin` pattern already used in `update` / `remove`); throw `ForbiddenException('Access denied')` if non-admin accesses someone else's playlist
  - Include `user: { select: { id, name, avatarUrl } }` and `_count: { select: { posts: true } }` (same shape as `findAdminAll` rows, so the frontend form can read the same fields)
  - Return `{ success: true, message: 'Playlist retrieved', data: playlist }`
- [ ] (apps/api) In `apps/api/src/playlists/playlists.controller.ts`, add a `GET /admin/playlists/:slug` route **after** the `GET /admin/playlists` list route:
  - Decorate with `@ApiBearerAuth()`, `@Permissions('manage_own_playlists', 'manage_all_playlists')`, `@Get('admin/playlists/:slug')`, `@ApiOperation({ summary: 'Get playlist by slug (admin) — used by edit page' })`
  - Method signature: `findAdminBySlug(@Param('slug') slug: string, @CurrentUser() user: Record<string, unknown>)`
  - Delegate to `this.playlistsService.findAdminBySlug(slug, user.id as string, user.roles as Record<string, unknown>[])`

---

## Frontend Tasks

- [ ] (apps/admin) Create `apps/admin/src/modules/playlists/stores/playlist.store.ts`:
  - Export `Playlist` interface (fields: `id`, `slug`, `title`, `description`, `cover`, `isPublished`, `createdAt`, `updatedAt`, `user?`, `_count?`)
  - Export `PlaylistMeta` interface (`page`, `limit`, `total`, `totalPages`)
  - Export `usePlaylistStore` Pinia store (setup-style, matching `usePostStore` structure)
  - Implement `fetchPlaylists(page?, limit?)` — `GET /admin/playlists`
  - Implement `fetchPlaylistBySlug(slug: string): Promise<Playlist>` — `GET /admin/playlists/${slug}`, returns `data.data`
  - Expose: `playlists`, `meta`, `loading`, `fetchPlaylists`, `fetchPlaylistBySlug`
- [ ] (apps/admin) Update `apps/admin/src/modules/playlists/pages/edit.vue`:
  - Import `usePlaylistStore` from the new store file
  - In `onMounted`: call `usePlaylistStore().fetchPlaylistBySlug(route.params.slug as string)` instead of `api.get('/admin/playlists')` + `.find()`
  - Remove the inline `import api from '@/lib/api'` if it is no longer used after this change (verify it is not used elsewhere in the file first)
  - Keep form population logic identical (same fields: `title`, `description`, `cover`, `isPublished`)
  - Keep the `error.value = 'Playlist not found'` fallback — now triggered by a caught exception from `fetchPlaylistBySlug` (the store will throw on 404)

---

## Notes
- No DTO changes needed — the new endpoint is a read-only GET and requires no request body.
- No database migration needed — uses existing `Playlist` model.
- NestJS route ordering: the new `:slug` route must come after the plain list route in the
  controller file. This is consistent with how `posts.controller.ts` is structured.
- The public `GET /playlists/:slug` endpoint is unaffected.
