# Tasks: CDR-43

## Backend Tasks
- [x] (apps/api) Implement `findAdminBySlug(slug, userId, userRoles)` in `apps/api/src/playlists/playlists.service.ts` with ownership check and soft-delete filtering.
- [x] (apps/api) Add `GET admin/playlists/:slug` route handler to `PlaylistsController` in `apps/api/src/playlists/playlists.controller.ts` with `@ApiBearerAuth()`.

## Frontend Tasks
- [x] (apps/admin) Update `onMounted` in `apps/admin/src/modules/playlists/pages/edit.vue` to fetch playlist data directly from `GET /admin/playlists/${route.params.slug}` instead of filtering `GET /admin/playlists`.
