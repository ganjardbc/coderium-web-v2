# Requirements: CDR-43

## Ticket Summary
- **ID:** CDR-43
- **Title:** Playlist edit page breaks for playlists past page 1
- **Type:** Bug Fix

## Status: PLAN

## Background & Problem
In `apps/admin/src/modules/playlists/pages/edit.vue`, `onMounted` fetches the paginated playlist list via `GET /admin/playlists` (default page 1, limit 10) and then searches for the item using `data.data.find((p) => p.slug === route.params.slug)`.
When the total count of playlists exceeds the page size (10 items), editing any playlist located beyond page 1 fails with a "Playlist not found" error, preventing the form from loading.

Additionally, `apps/api` currently lacks a dedicated single-item admin endpoint `GET /admin/playlists/:slug`, deviating from patterns established in posts (`GET /admin/posts/:slug`).

## Acceptance Criteria
1. **Backend API (`apps/api`):**
   - Add endpoint `GET /admin/playlists/:slug` protected by `@ApiBearerAuth()`.
   - Implement `findAdminBySlug(slug, userId, userRoles)` in `PlaylistsService` that:
     - Finds the playlist by slug where `deletedAt: null`.
     - Returns `NotFoundException` ('Playlist not found') if no matching playlist is found.
     - Checks user permissions/ownership: allows access if user is admin or is the owner (`playlist.userId === userId`); otherwise throws `ForbiddenException` ('Access denied').
     - Returns standard envelope: `{ success: true, message: 'Playlist retrieved', data: playlist }`.
2. **Frontend Admin (`apps/admin`):**
   - Update `onMounted` in `apps/admin/src/modules/playlists/pages/edit.vue` to fetch the single playlist directly via `GET /admin/playlists/${route.params.slug}`.
   - Set form state directly from `data.data`.
   - Display appropriate error message if request fails or playlist is not found.

## Open Questions
None.
