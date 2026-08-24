# QA Report — Ticket #14: Product Public Pages (apps/web)

## Status: PASS

## Branch
`ai-agent/14` (all changes present in working tree, uncommitted at time of QA — no
commits yet on this branch relative to `main`; `git diff main` shows the expected
file set).

## Method
1. Read `requirements.md`, `tasks.md` (incl. Verify Checklist), `verify-report.md`.
2. Inspected `git status` / `git diff main --stat` to confirm actual changed files
   match what `verify-report.md` claims.
3. Read the full source of all new/changed files: `layouts/default.vue` (navItems),
   `components/ProductCard.vue`, `components/NotFoundState.vue`,
   `pages/products/index.vue`, `pages/products/[slug].vue`, `pages/index.vue`
   (featured section + `navItems`).
4. Ran `pnpm --filter coderium-web run typecheck` and
   `pnpm --filter coderium-web run build` directly (independent of the
   implementer's report).

## Verification Results

### Automated
- `pnpm --filter coderium-web run typecheck` → **PASS**, no errors.
- `pnpm --filter coderium-web run build` → **PASS**, build completed cleanly.
  Output includes `ProductCard-*.mjs`, `_slug_-*.mjs` (products detail),
  `index-*.mjs` chunks — confirms new pages/components were actually built, not
  just present on disk.
- No `lint`/`test` script exists in `apps/web/package.json` — correctly not
  invented/run, matches ticket's constraint.

### Manual read-through (cross-checked against requirements.md / tasks.md)
- `navItems` in `layouts/default.vue`: exactly one new entry
  `{ to: '/products', icon: 'lucide:box', label: 'Products', isActive: (route) =>
  route.path.startsWith('/products') }`, appended after "Series". Shared by both
  desktop sidebar (`v-for="item in navItems"`, line ~57) and mobile bottom nav
  (same array, line ~91) — single source, no duplication. Confirmed.
- `ProductCard.vue`: props match spec (`product: {slug,name,tagline?,cover?}`,
  `size?: 'md'|'lg'` default `'md'`), `NuxtLink` to `/products/{slug}`, tagline
  truncated via `truncate` class, cover fallback to icon placeholder when empty,
  used identically in both `pages/products/index.vue` (`size="md"`) and
  `pages/index.vue` featured section (`size="lg"`) — no duplicated card markup.
  Confirmed.
- `pages/products/index.vue`: fetches `GET /products?page=1&limit=24`, no pager
  UI (per requirements' asymmetry vs `/explore`), skeleton grid while `pending`,
  `EmptyState` with slot-based copy linking to `/explore` and `/playlists` when
  `products.length === 0`, grid renders `ProductCard` in API-returned order (no
  client re-sort). Confirmed.
- `pages/products/[slug].vue`:
  - Hero CTA and closing CTA both use `<a target="_blank" rel="noopener
    noreferrer">`, not `NuxtLink` — confirmed both occurrences (lines ~35-42,
    ~143-150).
  - Pipeline strip renders `pipelineSteps` in array order with the large numbered
    style (`text-2xl font-black text-gray-300 dark:text-gray-700`) — confirmed,
    matches "Popular on Coderium" pattern requested.
  - Features grid `md:grid-cols-2 grid-cols-1` — confirmed.
  - Bukti section: wrapper `v-if="hasBukti"` where
    `hasBukti = hasPlaylist || hasRelatedPosts`; each sub-list independently
    `v-if`-guarded inside; playlist fetch uses `useAsyncData(..., { default: () =>
    null })` and `hasPlaylist = !!playlist.value && !playlistError.value`; related
    posts fetch uses `{ default: () => ({ data: [] }) }` with
    `hasRelatedPosts = relatedPosts.value.length > 0`. Neither playlist/related
    fetch failure propagates to the page-level `error` used for the main product
    404 — confirmed structurally isolated (separate `useAsyncData` calls, separate
    error refs).
  - Closing CTA section (Section 5) is unconditional in the template and sits
    immediately after the Bukti section markup — confirmed it lands right after
    "Daftar fitur" when Bukti is hidden, purely via sequential `v-if`, no
    reflow/CSS-order hacks. Matches requirement exactly.
  - 404 state: `v-else-if="error"` renders `NotFoundState` with
    `title="Product Not Found"` — confirmed no logic distinguishing invalid-slug
    vs draft/archived (single error path), matching backend contract note in
    requirements.md.
  - Post type badge mapping (`article/carousel/video/stack_gallery` → Article/
    Carousel/Video/Stack Gallery) present via `postTypeLabels` map — confirmed.
  - `useHead()` SEO block guarded by `if (productRes.value?.data)` — confirmed.
- `pages/index.vue` featured section: new `useAsyncData` for
  `GET /products?limit=24`, `featuredProduct = computed(() =>
  productsRes.value?.data?.find(p => p.featured) ?? null)` — client-side filter,
  no non-existent `featured` query param, relies on backend `order asc` for
  deterministic single-pick when multiple products are featured. Section is
  `v-if="pendingProducts"` (skeleton) / `v-else-if="featuredProduct"` (hidden
  entirely, not skeleton-forever, when none featured) — confirmed placed after
  Hero, before "Recent Stories + Sidebar" grid, hairline-divided. Matches
  requirements Scope 4 exactly, including the documented API contract gap
  rationale.
- `NotFoundState.vue`: new reusable component (title/message/backLabel props,
  internal `BackButton` with `variant="solid-dark"`), used only by
  `products/[slug].vue`; `posts/[slug].vue` and `playlists/[slug].vue` left
  untouched — confirmed matches the "not mandatory to migrate" allowance in
  requirements.md.
- Dark mode: spot-checked all new files — every colored/bordered element carries
  a `dark:` variant (`dark:bg-dark-secondary`, `dark:border-gray-800`,
  `dark:text-white`, etc.), consistent with existing convention, no separate
  theming system introduced. Confirmed.

## Discrepancies vs verify-report.md
None found. `verify-report.md`'s file list and checklist claims match the actual
diff and code content inspected independently during QA.

### CRITICAL
None.

### NON-CRITICAL
- Working tree changes for this ticket are not yet committed to `ai-agent/14`
  (branch has no new commits beyond the merge history shared with `main`; all
  ticket changes exist only as uncommitted working-tree modifications/untracked
  files). Not a QA blocker on functional grounds — typecheck/build were run
  directly against the working tree and passed — but flagging since committing
  is presumably required before PR creation (main-thread responsibility, not
  QA's).
- Closing CTA copy ("Siap mulai pilot?") is an explicitly-flagged placeholder per
  requirements.md/tasks.md, pending final content-team copy — not a technical
  defect, carried over as a known non-blocking note from the Planner/Implementer.
- `apps/web/pages/index.vue`, `apps/web/layouts/default.vue`,
  `docs/*` files also show diffs from an earlier/parallel change set (e.g.
  `README.md`, `docs/api/api-contract.md`, `docs/architecture/module-breakdown.md`,
  `docs/development/backlog.md`, `docs/development/progress.md`,
  `docs/frontend/design-system.md`) not mentioned in `verify-report.md`'s "Files
  Changed" list. These appear to be documentation-only updates unrelated to
  ticket #14's functional scope (not reviewed in depth here since QA scope per
  `caf-qa.md` is acceptance-criteria verification of the ticket's implementation,
  not documentation audit) — worth a quick sanity check by main thread that no
  unrelated/unintended doc drift is being carried into this PR.

## Verdict
Implementation satisfies all acceptance criteria in `requirements.md` and all
tasks/verify checklist items in `tasks.md`. Both automated checks
(typecheck, build) pass independently-run. Manual read-through of every new/
changed file confirms behavior matches spec, including the more nuanced
requirements (Bukti section visibility logic, CTA positioning without reflow
hacks, client-side featured filtering, isolated playlist/search fetch error
handling). No CRITICAL issues. Ready to proceed to PR/handoff stage.
