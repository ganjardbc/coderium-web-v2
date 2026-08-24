# QA Report — Ticket #13: Product Admin — List & Form (apps/admin)

## Agent
QA — `.claude/agents/caf-qa.md`

## Input
- `.caf/tasks/13/requirements.md`
- `.caf/tasks/13/tasks.md`
- `.caf/tasks/13/verify-report.md` (Frontend Agent, Status: SUCCESS)

## Scope Verified
`apps/admin/**` only (branch `ai-agent/13`). Confirmed no changes outside
`apps/admin` (no diffs in `apps/api` or `apps/web`).

## What was checked
1. Re-ran `pnpm --filter coderium-admin run typecheck` (`vue-tsc --noEmit`) — PASS,
   no errors/warnings.
2. Re-ran `pnpm --filter coderium-admin run build` (`vue-tsc -b && vite build`) —
   PASS. Only pre-existing "chunk larger than 500kB" warning on the shared
   vendor bundle (`index-M5fiGpjt.js`, 537kB); product-module chunks are small
   (`ProductForm...` 9.78kB, `product.store...` 2.20kB, list/create/edit
   chunks 2–9kB each) — not a regression introduced by this ticket.
3. Read-through of all added/modified files against `requirements.md` and
   `tasks.md`:
   - `apps/admin/src/modules/products/router/index.ts` — 3 routes, all use
     `:id` (not `:slug`), correct `meta` shape (`title`, `layout: 'admin'`,
     `requiresAuth: true`, `permission: ['manage_products']`), matches Posts
     pattern.
   - `apps/admin/src/core/global-routes.ts` — `productsRoutes` imported and
     spread into `routes`, sibling to `postsRoutes`/`playlistsRoutes`. Diff is
     minimal (2 lines added), no unrelated changes.
   - `apps/admin/src/layouts/AdminLayout.vue` — "Products" nav entry added
     (`/products`, icon `pi-box`) between Posts and Playlists; diff is
     minimal (5 lines added), no unrelated changes. Module is reachable from
     the sidebar as required.
   - `apps/admin/src/modules/products/stores/product.store.ts` — `Product`,
     `ProductMeta`, `ProductPayload`, `ProductFormData` types match the
     contract in requirements.md field-for-field. Actions
     (`fetchProducts`/`fetchProductById`/`createProduct`/`updateProduct`/
     `publishProduct`/`unpublishProduct`/`archiveProduct`/`restoreProduct`)
     all hit the correct `/admin/products*` endpoints and correct HTTP verbs.
     `publishProduct`/`unpublishProduct`/`archiveProduct` deliberately do NOT
     catch axios errors — verified callers (list.vue, create.vue, edit.vue)
     each catch and parse `err.response.data.fields` themselves, so the
     error-propagation contract required by tasks.md Task 2 is honored.
     `toProductPayload` correctly converts `form.cover` (`UploadedMedia[]`)
     to a single string via `form.cover[0]?.url`, and `productToFormData`
     does the reverse conversion for populating the edit form — same pattern
     as Posts.
   - `apps/admin/src/components/RepeatableListField.vue` — generic component,
     props (`modelValue`, `label`, `itemLabel`, `forceValidate`), emits
     `update:modelValue` for add/remove/reorder (immutable array
     replacement). Per-row inline validation (red border + "Title is
     required" text) only shown after blur (`touch(index)`) or
     `forceValidate=true` — matches "jangan tampilkan error sebelum
     interaksi" requirement. Used twice in `ProductForm.vue` (pipelineSteps,
     features) as required — one shared component, no duplication.
   - `apps/admin/src/modules/products/components/ProductForm.vue` — shared
     by create.vue/edit.vue as recommended (not mandatory) by tasks.md Task
     6, given the higher field count vs. Posts. All fields present in the
     order specified in requirements.md (name → slug → tagline → description
     [RichTextEditor] → cover [MediaUploader :multiple="false"] →
     pipelineSteps → features → ctaLabel → ctaUrl → order → featured). Slug
     auto-syncs from `name` via a `watch` while `autoSlug=true` and the user
     hasn't manually typed in the slug field (`slugTouched`); `autoSlug`
     is correctly disabled on edit (`:auto-slug="false"` in edit.vue) so
     touching `name` on an existing product does not silently rewrite its
     slug. `status` is NOT a manual dropdown — derived purely from which
     submit button is clicked (`submit-draft` / `submit-publish`), matching
     the Planner's recommended resolution to the requirements.md open
     question, and avoiding the dual-source-of-truth risk called out there.
     Publish-failure banner reads `bannerFields` (sourced from
     `err.response.data.fields`) and renders human labels via
     `PUBLISH_FIELD_LABELS`; per-field highlight via `FormField :invalid`
     wired to `cover`, `pipelineSteps`, `features`, `ctaUrl`. Basic
     client-side CTA URL format check via `new URL()` try/catch shown as a
     hint (non-blocking), consistent with requirements.md ("cukup
     client-side basic URL check").
   - `apps/admin/src/modules/products/pages/create.vue` /
     `apps/admin/src/modules/products/pages/edit.vue` — both call
     `toProductPayload(form, status)` and only redirect to `/products` on
     success; on failure (both structured `fields` errors and generic
     errors) the catch block only sets `errorMessage`/`bannerFields`/
     `forceValidateLists` — `form.value` itself is untouched, so user input
     is preserved and status is not changed on a failed publish, matching
     requirements.md ("input yang sudah diisi user TIDAK HILANG"). `edit.vue`
     fetches by `route.params.id` (not `.slug`), has a loading skeleton and a
     not-found state, matching Posts' edit.vue pattern per tasks.md Task 6.
   - `apps/admin/src/modules/products/pages/list.vue` — DataTable columns
     (name w/ link to edit, slug, status Tag with distinct severities
     draft=warn, published=success, archived=danger, order, updatedAt
     formatted), sort control (`SelectButton` toggling `order asc` default
     vs `updatedAt desc`, re-triggers `fetchProducts`), row actions
     (Publish/Unpublish toggle by status, Edit, Archive w/ `ConfirmDialog`,
     and an extra Restore/"Un-archive" action for archived rows — a sensible
     use of the optional `/restore` endpoint flagged in requirements.md),
     "+ Tambah Produk" global action navigating to `/products/create`. Failed
     inline Publish shows a toast listing the missing fields via
     `publishErrorDetail`/`PUBLISH_FIELD_LABELS` (no silent fail), matching
     requirements.md's recommended approach (send to server, handle 400).
4. Cross-checked the actual 400 publish-error response shape against source:
   `apps/api/src/products/products.service.ts` `assertPublishable` throws
   `new BadRequestException({ message: 'Validasi publish gagal', fields:
   [...] })`; `apps/api/src/shared/filters/all-exceptions.filter.ts` spreads
   `exception.getResponse()` (`{ message, fields }`) into the top-level JSON
   response body before re-setting `success`/`statusCode`/`timestamp`/`path`/
   `message`. Confirmed `fields` remains at the top level of
   `err.response.data` in the actual response — the frontend's
   `err.response.data.fields` parsing (used consistently in
   `product.store.ts`, `list.vue`, `create.vue`, `edit.vue`) is correct. This
   matches the Frontend Agent's read-through-only verification in
   `verify-report.md`; I did not additionally start `apps/api` to hit the
   endpoint live (source cross-check is unambiguous here — both the throw
   site and the exception filter were read directly).
5. Confirmed `manage_products` permission is seeded in
   `apps/api/prisma/seed.ts` (both permission definition and role
   assignment) — no blocker per requirements.md scope-out note.
6. Verified `git diff` on the two *modified* files
   (`global-routes.ts`, `AdminLayout.vue`) is minimal and scoped — no
   unrelated changes leaking in from a broader refactor.

## Findings

### CRITICAL
None.

### NON-CRITICAL
1. **Prop mutation anti-pattern (already self-flagged by Frontend Agent).**
   `ProductForm.vue` binds `v-model="form.xxx"` directly to the `form` prop
   object owned by `create.vue`/`edit.vue` instead of using a local copy +
   `emit('update:modelValue', ...)`. This works correctly today only because
   the parent passes the *same* reactive object by reference (not a copy),
   so mutations are visible to the parent without an explicit emit. It is
   fragile if a future change makes the parent pass a computed/derived copy,
   and there is no lint rule in this package to catch a regression. Same
   pattern exists in `RepeatableListField.vue` (`v-model="item.title"` /
   `v-model="item.description"` bind directly to array-item objects that are
   part of the `modelValue` prop) — structural changes (add/remove/reorder)
   correctly go through `emit('update:modelValue', ...)` with a new array,
   but in-place edits to `title`/`description` on an existing row mutate the
   prop object directly rather than emitting. Functionally correct given the
   current call sites, but worth a lint/refactor pass if `apps/admin` ever
   adds ESLint (the Frontend Agent already left a note about this for
   `ProductForm.vue`; recommend extending that note to
   `RepeatableListField.vue` too).
2. **Live-server confirmation of the publish-error response shape was not
   performed** (neither by the Frontend Agent nor by this QA pass) — both
   verifications were via source read-through only (`assertPublishable` +
   `AllExceptionsFilter`), which tasks.md explicitly allows as one of two
   acceptable methods for Task 7. The source is unambiguous, so this is not
   blocking, but a human running `apps/api` locally and hitting
   `POST /admin/products/:id/publish` with missing required fields on a
   draft product would be a good final sanity check before merge.
3. Drag-and-drop reordering in `RepeatableListField.vue` is not implemented
   (only up/down buttons) — explicitly optional per tasks.md ("drag-drop
   tidak wajib"), not a gap.

## Verify Checklist (tasks.md) — QA re-confirmation
- [x] `pnpm --filter coderium-admin run typecheck` — PASS (re-run by QA).
- [x] `pnpm --filter coderium-admin run build` — PASS (re-run by QA).
- [x] No `lint`/`test` scripts exist in `apps/admin/package.json` — correctly
      not invented/run.
- [x] Routing uses `:id` (not `:slug`) consistently in router, store, and
      `edit.vue` — confirmed by read-through.
- [x] `cover` conversion `UploadedMedia[]` ↔ `string` at submit/populate —
      confirmed in `product.store.ts` (`toProductPayload`/`productToFormData`).
- [x] 400 publish error parsed from `err.response.data.fields` (not just
      `.message`), rendered as banner + field highlight, form never reset —
      confirmed in `create.vue`/`edit.vue`/`ProductForm.vue`, and confirmed
      against actual `apps/api` exception-filter behavior.
- [x] `RepeatableListField.vue` validates inline per-row (not global alert)
      for empty title — confirmed.

## Status: PASS
