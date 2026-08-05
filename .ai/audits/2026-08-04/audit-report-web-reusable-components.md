## Audit: 2026-08-04
## Agent: audit-scan (command) — adapted for code-reuse audit (not security)
## Scope: apps/web — find components/patterns that can be extracted into reusable components

## Ringkasan

`apps/web` no `components/` dir — all markup inline in 6 files (layout + 5 pages).
Same UI patterns (post-row, avatar-initial, skeleton, empty-state, nav-links) hand-copied
3-5x each w/ near-identical class strings. Two `formatDate`/`readingTime` util duplicated
3x each instead of shared. Severity here = maintenance risk, not security — categorized
HIGH (3+ dup, high edit-risk) / MEDIUM (2 dup or low-risk).

## Temuan Prioritas

### 1. [DUPLICATION] Post/article row card duplicated verbatim
- **Lokasi:** `pages/index.vue:63-101` (recentPosts), `pages/explore.vue:55-98` (search results)
- **Severity:** HIGH
- **Masalah:** Full article-row markup (avatar+name+date, title/subtitle link, type-badge/reading-time/views/likes meta row, thumbnail) copy-pasted between 2 pages, explore.vue adds `likesCount` — index.vue doesn't, so they've already drifted.
- **Dampak:** Any layout/style tweak (e.g. adding a bookmark icon) needs editing 2 files in sync; drift already visible.
- **Usulan:** Extract `<PostListItem :post="post" />` component.

### 2. [DUPLICATION] Avatar-with-initials fallback repeated 5x
- **Lokasi:** `pages/index.vue:68-70,136-138`, `pages/explore.vue:64-66`, `pages/posts/[slug].vue:37-40,146-149`
- **Severity:** HIGH
- **Masalah:** Same `rounded-full bg-gray-200 ... flex items-center justify-center` + `name?.charAt(0).toUpperCase() ?? '?'` fallback pattern re-implemented 5 times at different sizes (w-4/w-6/w-10/w-14), and posts/[slug].vue additionally handles `avatarUrl` image vs. index/explore never show real avatar image at all — inconsistent feature support across pages.
- **Dampak:** Avatar image support silently missing on index/explore; bug fixes to initials logic won't propagate.
- **Usulan:** Extract `<UserAvatar :user="user" size="sm|md|lg" />`.

### 3. [DUPLICATION] Loading skeleton blocks hand-rolled per page
- **Lokasi:** `pages/index.vue:39-54,111-119`, `pages/explore.vue:31-45`, `pages/playlists/index.vue:10-19`, `pages/playlists/[slug].vue:3-8`, `pages/posts/[slug].vue:11-16`
- **Severity:** HIGH
- **Masalah:** 6 different `animate-pulse` skeleton markups, each independently coded, no shared shape primitive (bar/circle/block).
- **Dampak:** Inconsistent loading UI feel across pages; each new page reinvents skeleton markup.
- **Usulan:** Extract low-level `<SkeletonLine />` / `<SkeletonBlock />` (or one `<SkeletonList :rows="3" variant="post" />` per common shape).

### 4. [DUPLICATION] Empty-state block repeated 4x
- **Lokasi:** `pages/index.vue:57-59`, `pages/explore.vue:48-51`, `pages/playlists/index.vue:22-24`, `pages/playlists/[slug].vue:45-47`
- **Severity:** MEDIUM
- **Masalah:** `text-center py-N text-gray-400 dark:text-gray-500` + message, same shape each time w/ inconsistent padding (py-8/12/16).
- **Dampak:** Minor visual inconsistency; trivial but easy win.
- **Usulan:** Extract `<EmptyState :message="..." />`.

### 5. [DUPLICATION] `formatDate` / `readingTime` utils copy-pasted
- **Lokasi:** `pages/index.vue:220-233`, `pages/explore.vue:209-217`, `pages/posts/[slug].vue:294-301,255-259 (readingTimeDisplay)`
- **Severity:** HIGH
- **Masalah:** Same date-format and reading-time-estimate logic reimplemented in 3 files (posts/[slug].vue even varies format: `month: 'long'` vs `'short'` elsewhere — inconsistent output for same data).
- **Dampak:** Format drift already present; a locale/format change needs 3 edits.
- **Usulan:** Move to `composables/useFormatters.ts` (folder already exists, currently empty) — `formatDate(date, style?)`, `readingTime(text)`.

### 6. [DUPLICATION] Sidebar nav links duplicated for desktop vs mobile bottom-nav
- **Lokasi:** `layouts/default.vue:56-81` (desktop aside) and `layouts/default.vue:106-131` (mobile bottom nav)
- **Severity:** MEDIUM
- **Masalah:** Same 3 nav items (Home/Explore/Series), same `to` + active-route `:class` logic, written twice with different wrapper styling.
- **Dampak:** Adding/renaming a nav item means editing in 2 places; already risk of desktop/mobile nav drifting out of sync.
- **Usulan:** Extract shared `navItems` array (icon/label/to) in `<script setup>`, loop with `v-for` in both nav blocks — or a `<NavLink>` component taking a `variant="sidebar|bottom"` prop.

### 7. [DUPLICATION] Post like/share action bar duplicated top+bottom
- **Lokasi:** `pages/posts/[slug].vue:54-85` and `pages/posts/[slug].vue:110-141`
- **Severity:** MEDIUM
- **Masalah:** Identical like-button + views-count + share-button markup repeated twice in the same file, byte-for-byte except one class typo difference (`hover:text-gray-900` vs `hover:text-gray-955` at line 116 — dead/broken Tailwind class).
- **Dampak:** The typo (`gray-955`) means bottom action bar's like button never gets the hover style — visible bug from the duplication itself.
- **Usulan:** Extract `<PostActionBar :post="post" :liked="liked" @like="toggleLike" @share="copyShareLink" />`, render once each place. Fixes the typo for free.

### 8. [DUPLICATION] "Back" button pattern repeated
- **Lokasi:** `pages/playlists/[slug].vue:13-15,20-22`, `pages/posts/[slug].vue:22-24,29-31`
- **Severity:** MEDIUM
- **Masalah:** `<button @click="router.back()">` + arrow-left icon + label, 4 near-identical instances across 2 files (2 each: error-state + normal-state).
- **Dampak:** Low risk but easy consolidation.
- **Usulan:** Extract `<BackButton label="Back to X" />`.

## Temuan Non-Prioritas (dicatat, tidak diusulkan jadi task)

- [DUPLICATION] Thumbnail image block (`w-16 h-16 ... rounded-sm overflow-hidden ...`) — `pages/index.vue:97`, `pages/explore.vue:94`, severity LOW (only 2 occurrences, minor).
- [DUPLICATION] Type-badge pill (`px-2 py-0.5 rounded-full border ... capitalize`) — `pages/index.vue:88`, `pages/explore.vue:84`, severity LOW.
- [CODE-QUALITY] Typo `text-gray-880` (invalid Tailwind class, no-op) — `pages/playlists/[slug].vue:11`, severity LOW.
- [CODE-QUALITY] Typo `hover:bg-blue-650` (invalid Tailwind class) — `pages/playlists/[slug].vue:13`, severity LOW.
- [DUPLICATION] "Curated Series" CTA card is one-off (only in index.vue) — not enough repetition to extract yet, severity LOW.

## Catatan

- `composables/` folder exists but is empty — natural home for `useFormatters` (finding #5) and any `usePosts`/`usePlaylists` data-fetching composable if further audited later (data-fetching `$fetch` calls are also duplicated per-page but out of scope for this component-reuse pass).
- No `components/` dir currently exists in `apps/web` — will need to be created (Nuxt auto-imports from `components/` by convention).
- Two invalid Tailwind classes found incidentally (`gray-880`, `gray-955`, `blue-650`) — not part of requested scope (component reuse) but worth a follow-up fix since one causes a visible dead hover state (finding #7).
