## Review Notes — CDR-43
Ticket: CDR-43 — Playlist edit page breaks for playlists past page 1
Agent: caf-reviewer
Verdict: APPROVE

---

### Security Audit

**No security issues found.**

Key checks:

1. **Authentication**: `GET /admin/playlists/:slug` is decorated with `@ApiBearerAuth()` — the endpoint is not `@Public()`, so the global auth guard applies. ✅
2. **Authorization / ownership scoping**: `findAdminBySlug` in the service correctly replicates the `isAdmin` ownership check used by `update`, `remove`, `attachPosts`, and `detachPosts`. Non-admin callers who do not own the playlist receive `ForbiddenException('Access denied')`. ✅
3. **Soft-delete respected**: Query filters `deletedAt: null`, so logically deleted playlists are not exposed. ✅
4. **No data mutation**: New endpoint is read-only GET — no side effects, no DTO, no body needed. ✅
5. **Minor pattern divergence — `@Permissions` on GET slug route**: The posts reference pattern omits `@Permissions(...)` from `GET /admin/posts/:slug` (only `@ApiBearerAuth()` is present), while the playlist implementation adds `@Permissions('manage_own_playlists', 'manage_all_playlists')`. This is strictly *more* restrictive than the posts pattern, not less — so it is not a security regression. It is a minor consistency gap with the posts module, but given that the service-layer ownership check is the real enforcement point, this is low-risk. Noted for awareness below.

---

### Qualitative Review

**Backend (`apps/api`)**

- `findAdminBySlug` (service, lines 135–154): Clean, minimal, consistent. Follows the exact same shape as `update`/`remove`: single `prisma.playlist.findFirst`, then 404, then ownership guard, then return. Include shape (`user` + `_count`) matches `findAdminAll` rows, so the frontend form gets a compatible payload. No extraneous logic introduced.
- Controller route ordering (lines 44→58→73): `GET /admin/playlists` → `GET /admin/playlists/:slug` → `POST /admin/playlists` — correct for NestJS static-before-param ordering.
- The diff is surgical: 27 lines added to the service, 15 lines added to the controller. Zero lines removed from existing methods.

**Frontend (`apps/admin`)**

- `playlist.store.ts`: Correctly mirrors `post.store.ts` in structure (Pinia setup store, same `ref` scaffolding, same return shape). `fetchPlaylistBySlug` propagates exceptions naturally (no internal try/catch), which is the right design — the component owns error handling.
- `edit.vue` diff: The replacement is clean. The old pattern (`api.get('/admin/playlists')` → `.find()`) is fully removed. The new `onMounted` delegates to the store, catches any thrown exception, and sets `error.value = 'Playlist not found'` — consistent with the acceptance criteria. The `api` import is correctly retained for `handleSubmit` (`api.put`).
- Frontend typecheck: `vue-tsc --noEmit` passes with zero errors. Build passes (689 modules, 5.30s). This is a hard confirmation — not just structural analysis.

**Minor observations (non-blocking)**

1. **`@Permissions` on the new GET slug route vs. posts reference**: Posts' `GET /admin/posts/:slug` has only `@ApiBearerAuth()`, no `@Permissions(...)`. Playlists' new route has both. This is a stricter posture; no functional regression. Worth aligning in a follow-up if the team wants strict pattern parity — but it is not a blocker for this ticket.
2. **`fetchPlaylistBySlug` has no `loading` management**: Unlike `fetchPlaylists`, the slug fetch does not toggle `loading`. This matches how `fetchPostBySlug` is implemented in the reference store (also no loading flag). The component manages its own `pageLoading` ref, so this is correct by design.
3. **`usePlaylistStore()` called inline in `onMounted`**: The component calls `usePlaylistStore()` inside `onMounted` rather than at setup-time (like `postsStore` in `posts/edit.vue`). Both are valid in Pinia — the store is a singleton and either call site works correctly. It is slightly less idiomatic but not wrong.

---

### Verdict Rationale

The implementation is correct, minimal, and well-scoped. It directly addresses the root cause (client-side `.find()` on a page-1 result set) by introducing a proper `GET /admin/playlists/:slug` endpoint with full auth/ownership enforcement, and wires it up through a new Pinia store in the same pattern as the Posts module. The frontend build and typecheck pass clean. All acceptance criteria are verified by both the implementation agent and the QA agent through direct code inspection. No security issues were found. The one pattern divergence (`@Permissions` on the new GET route vs. the posts reference) is additive-only and does not affect correctness or safety.

---

### For Developer

- **Optional follow-up (non-blocking)**: Consider removing `@Permissions('manage_own_playlists', 'manage_all_playlists')` from `GET /admin/playlists/:slug` to match the posts module pattern (`GET /admin/posts/:slug` has no `@Permissions` decorator — ownership enforcement is done exclusively at the service layer). This is a cosmetic consistency fix, not a correctness issue.
- **Optional follow-up**: Consider initializing `usePlaylistStore()` at the component setup level (e.g. `const playlistStore = usePlaylistStore()`) and calling `playlistStore.fetchPlaylistBySlug(...)` in `onMounted`, to match the `postsStore` pattern in `posts/edit.vue`.
