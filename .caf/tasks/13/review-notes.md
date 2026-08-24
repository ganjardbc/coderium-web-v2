# Review Notes — Ticket #13: Product Admin — List & Form (apps/admin)

## Agent
Reviewer — `.claude/agents/caf-reviewer.md`

## Input
- `.caf/tasks/13/requirements.md`
- `.caf/tasks/13/tasks.md`
- `.caf/tasks/13/verify-report.md` (Frontend Agent, Status: SUCCESS)
- `.caf/tasks/13/qa-report.md` (QA Agent, Status: PASS, 2 non-critical notes)
- Working tree diff on branch `ai-agent/13` (uncommitted): `git diff --stat`,
  `git status --porcelain`

## What was reviewed
1. Full diff scope via `git status`/`git diff --stat`: new files
   (`apps/admin/src/components/RepeatableListField.vue`,
   `apps/admin/src/modules/products/**`), modified files
   (`apps/admin/src/core/global-routes.ts`, `apps/admin/src/layouts/AdminLayout.vue`,
   `README.md`, `docs/architecture/module-breakdown.md`,
   `docs/development/backlog.md`, `docs/development/progress.md`,
   `docs/frontend/design-system.md`), plus auto-generated build artifacts
   (`apps/admin/components.d.ts`, `apps/admin/tsconfig.tsbuildinfo`). Confirmed
   no changes to `apps/api` or `apps/web` — scope matches requirements.md
   ("Scope (out)") and tasks.md ("FRONTEND ONLY").
2. Read full source of all new/modified product-module files: `router/index.ts`,
   `product.store.ts`, `RepeatableListField.vue`, `ProductForm.vue`,
   `list.vue`, `create.vue`, `edit.vue`, plus the diffs of
   `global-routes.ts`/`AdminLayout.vue`.
3. Read the docs diffs (`README.md`, `module-breakdown.md`, `backlog.md`,
   `progress.md`, `design-system.md`) — all are additive, scoped, accurate
   descriptions of what was actually built (cross-checked against the code),
   no unrelated changes leaking in.
4. Cross-checked the two QA NON-CRITICAL findings directly against source:
   - Prop-mutation pattern in `ProductForm.vue`/`RepeatableListField.vue`
     confirmed present and understood: `form` in `ProductForm.vue` is
     `computed(() => props.form)`, and `v-model="form.xxx"` mutates the
     underlying object owned by `create.vue`/`edit.vue`'s `ref<ProductFormData>`
     in place. This works correctly today because it's the *same* reactive
     object reference flowing through (ref unwrapping preserves identity), and
     Vue's prop guard only warns on reassigning the top-level prop key
     (`props.form = x`), not nested mutations — so no runtime warning occurs.
     Confirmed this is a real (if currently harmless) anti-pattern, already
     self-flagged with an inline comment in `ProductForm.vue` (lines 267–273)
     explaining the tradeoff. Agree with QA: non-blocking, worth a follow-up
     refactor if `apps/admin` ever adds ESLint's `vue/no-mutating-props`.
   - Live-server confirmation of the publish 400 error shape was not
     performed; the source read-through (`assertPublishable` in
     `products.service.ts` + `AllExceptionsFilter` spreading the thrown
     object's `{message, fields}` into the top-level response body) is
     unambiguous and is one of the two methods tasks.md Task 7 explicitly
     allows. Agree this is non-blocking; recommend a human do one live curl
     as a final sanity check before merge, but it should not gate the merge.
5. Additional independent check not previously called out: `list.vue`'s
   `handleUnpublish`/`handleArchive`/`handleRestore` do not wrap their store
   calls in try/catch (unlike `handlePublish`, which does, per the ticket's
   explicit requirement to surface publish-failure field details). Verified
   this is **not a new inconsistency** — it exactly matches the existing
   `apps/admin/src/modules/posts/pages/list.vue` pattern (`handlePublish`/
   `handleUnpublish` there also have no try/catch). Since Posts is the
   explicit reference pattern this ticket was told to follow, and
   unpublish/archive/restore don't carry the same structured-field-error
   contract that publish does, this is acceptable parity, not a regression.
   Flagging only as a **minor** note in case a future ticket wants to
   harden error handling across both modules consistently — not a blocker
   for this ticket.
6. Verified `productToFormData`'s hardcoded `mimeType: 'image/jpeg'` on the
   synthesized `UploadedMedia` object for `cover` is copied verbatim from the
   existing `apps/admin/src/modules/posts/pages/edit.vue` pattern (same
   hardcoded value, same shape) — pre-existing codebase pattern, not a new
   issue introduced by this ticket.
7. Verified routing consistently uses `:id` (not `:slug`) across
   `router/index.ts`, `product.store.ts` (all actions take `id`), `list.vue`
   (`/products/${data.id}/edit`), and `edit.vue` (`route.params.id`) — matches
   the explicit deviation from the Posts `:slug` pattern called out in
   requirements.md and tasks.md.
8. Verified the `status` design decision (derived from submit button, no
   manual dropdown) is implemented as documented: `ProductForm.vue` has no
   status `<select>`; two buttons emit `submit-draft`/`submit-publish`, and
   `create.vue`/`edit.vue`'s `handleSubmit(status)` passes that status into
   `toProductPayload`. Matches the Planner's recommended resolution to the
   requirements.md open question and is documented in `docs/development/
   progress.md` DEC-008.
9. Verified banner/highlight/no-reset-on-failed-publish behavior end-to-end
   in both `create.vue` and `edit.vue`: catch blocks only set
   `errorMessage`/`bannerFields`/`forceValidateLists`, never touch
   `form.value`, and only call `router.push('/products')` on the success
   path — matches requirements.md ("input yang sudah diisi user TIDAK
   HILANG").

## Findings

### CRITICAL
None.

### NON-CRITICAL (carried over from QA, confirmed by independent read)
1. Prop-mutation pattern in `ProductForm.vue` / `RepeatableListField.vue` —
   functionally correct given current call sites, no lint configured to
   catch it, already self-documented in code comments. Recommend a
   follow-up refactor to proper `emit('update:modelValue', ...)` two-way
   binding if/when `apps/admin` adds ESLint with `eslint-plugin-vue`
   recommended rules.
2. Publish-error 400 shape was confirmed via source read-through only, not a
   live API call. Recommend (non-blocking) that a human run `apps/api`
   locally and hit `POST /admin/products/:id/publish` on a draft missing
   required fields as a final sanity check.

### MINOR (new, found during this review)
3. `list.vue`'s `handleUnpublish`/`handleArchive`/`handleRestore` have no
   try/catch around their store calls (only `handlePublish` does). Confirmed
   this exactly mirrors the existing `posts/pages/list.vue` pattern, so it's
   parity with the reference implementation rather than a regression — not a
   blocker, just worth a note for a future hardening pass across both
   modules if the team wants consistent error toasts on every row action.

## Verify Checklist (tasks.md) — Reviewer re-confirmation
Not independently re-run (already run twice: Frontend Agent in
`verify-report.md`, re-run by QA in `qa-report.md`, both PASS with identical
results). Read-through of the actual source confirms the claims in both
reports are accurate — no discrepancy found between what verify-report.md/
qa-report.md describe and what the diff actually contains.

## Decision

**Status: APPROVE**

Scope is correctly limited to `apps/admin` (no unintended `apps/api`/
`apps/web` changes). Implementation matches requirements.md and tasks.md
field-for-field, including the two explicitly-flagged open-question
resolutions (status derivation, `:id` routing). Both QA NON-CRITICAL findings
are legitimate but genuinely non-blocking, and are already documented in
code comments / reports for future follow-up. One additional MINOR
observation (missing try/catch on 3 of 4 row actions in `list.vue`) was
checked and found to be intentional parity with the existing Posts pattern,
not a new defect. No CRITICAL findings. Safe to merge; no changes requested.
