# Review Notes — Ticket #14: Product Public Pages (apps/web)

## Status: APPROVE

## Branch
`ai-agent/14` (diff vs `main`; changes still uncommitted in working tree, no new
commits on the branch yet — consistent with `qa-report.md`'s note, not a review
blocker).

## Method
- Read `.caf/tasks/14/requirements.md`, `tasks.md`, `verify-report.md`, `qa-report.md`.
- Ran `git status` / `git diff main --stat` and full `git diff main` on every
  changed file to independently confirm the file list and content match both
  reports.
- Read full source of all new/changed files: `layouts/default.vue` (navItems diff),
  `pages/index.vue` (featured section diff), `components/ProductCard.vue`,
  `components/NotFoundState.vue`, `pages/products/index.vue`,
  `pages/products/[slug].vue`, plus `components/EmptyState.vue` to confirm the
  `padding`/slot usage in the new index page is a valid existing API, not invented.
- Read the six `docs/*` + `README.md` diffs flagged by QA in full.

## Findings

### Diff vs verify-report.md / qa-report.md
No discrepancies. `git diff main --stat` file list matches exactly what both
reports claim (7 code files + `.caf/tasks/14/` artifacts). Both reports'
descriptions of behavior match the actual code read here.

### Documentation diff (QA's flagged item)
Reviewed all 6 non-`apps/web` diffs (`README.md`, `docs/api/api-contract.md`,
`docs/architecture/module-breakdown.md`, `docs/development/backlog.md`,
`docs/development/progress.md`, `docs/frontend/design-system.md`) in full.
Verdict: **legitimate, ticket-14-scoped documentation, not scope creep.**
- Every change is additive and explicitly labeled "(ticket 14, apps/web)" or
  references `WEB-PROD-001` / `.caf/tasks/14/`.
- Content accurately reflects what was actually implemented (API gap note in
  `api-contract.md` matches the client-side `featured` filter in
  `pages/index.vue`; module-breakdown additions match the new pages/component
  list; backlog/progress entries mark Phase 14 as DONE, consistent with the
  PASS verify/QA reports).
- No unrelated edits (e.g. no other tickets' backlog items touched, no stray
  content changes) found in these files.
- This matches the pattern already established by this repo's pipeline (see
  `docs: record INITIAL review notes for PR #15` in git log for ticket 12) —
  a Documentation stage that updates these files per ticket is expected
  behavior here, not an anomaly. QA was right to flag it for a sanity check;
  sanity check here confirms it is fine, non-blocking.

### Code quality
- `ProductCard.vue`: single reusable component, correctly parameterized by
  `size`, used identically (no markup duplication) in both `products/index.vue`
  and the homepage featured section. Cover fallback, truncate on tagline, hairline
  border — all match spec.
- `NotFoundState.vue`: clean small extraction, matches the "recommended, not
  mandatory" extraction call in requirements.md; existing `posts/[slug].vue` /
  `playlists/[slug].vue` correctly left untouched.
- `products/[slug].vue`: sequential `v-if` structure for sections 2–5 matches the
  no-CSS-reflow requirement; `hasBukti = hasPlaylist || hasRelatedPosts` wrapper
  correctly gates the whole "Bukti" section including heading; sub-lists
  independently `v-if`-guarded. CTA hero and footer both use `<a target="_blank"
  rel="noopener noreferrer">`, not `NuxtLink`. `useHead()` is guarded by
  `productRes.value?.data`.
- Playlist/related-posts fetches use `useAsyncData` with `default` fallbacks
  (`() => null` / `() => ({ data: [] })`) and separate `error` refs isolated from
  the main product fetch's `error` — a missing playlist or empty search result
  cannot 404 the whole product page. Confirmed structurally correct by reading
  the code directly (not just trusting the reports).
- Homepage featured section: `.find(p => p.featured)` on the backend `order`-asc
  array, section `v-if="pendingProducts"` (skeleton) / `v-else-if="featuredProduct"`
  (hidden entirely when none) — matches spec, including the documented API
  contract gap (`featured` filtered client-side, no phantom query param assumed).

### Minor, non-blocking observations (not requesting changes for these)
- `ProductData.ctaUrl` is typed as `ctaUrl?: string` (not `string | null`) while
  sibling optional fields (`tagline`, `cover`, `ctaLabel`) are typed
  `string | null`. Cosmetic type inconsistency only, TS still compiles (confirmed
  via QA's independent typecheck run); no runtime impact since `<a :href>` simply
  omits the attribute when `undefined`/falsy. Not worth blocking merge over.
- CTA `<a :href="product.ctaUrl">` has no explicit fallback/guard if a published
  product somehow has an empty `ctaUrl` (renders a non-actionable button rather
  than hiding it). Out of scope per requirements (CTA fields assumed present on
  published product; no ticket requirement to hide CTA when `ctaUrl` is empty).
  Flagging only as a forward-looking data-integrity note for admin-side
  validation (Ticket #13 scope), not a defect in this ticket.
- Closing CTA copy "Siap mulai pilot?" is an explicitly flagged placeholder per
  requirements.md/tasks.md — content-team decision, not a technical issue.

## Verdict
Implementation is complete, matches `requirements.md` and `tasks.md` precisely
(including the more nuanced items: Bukti section visibility, CTA reposition-free
ordering, client-side featured filtering, isolated error handling for
playlist/search fetches), and both the coder's and QA's reports are accurate
against the real diff. No CRITICAL or blocking issues found. The `docs/*` diff
QA flagged is confirmed to be in-scope documentation, not scope creep.

**Recommendation: APPROVE — ready for commit/PR/handoff (main thread, section 7).**
