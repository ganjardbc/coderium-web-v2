# Review Notes — Ticket 12: Product CRUD API (apps/api)

## Ticket
12 — Product CRUD API (apps/api). PR: https://github.com/ganjardbc/coderium-web-v2/pull/15 (`ai-agent/12` → `main`).

## Agent
caf-reviewer (INITIAL mode — fresh full review of PR #15 as it currently stands, independent of the prior pre-PR pipeline gate's approval).

## Verdict
**APPROVE**

## Scope of this review

- Full re-read of `/tmp/pr15.diff` (2632 lines), not a re-read of the prior `review-notes.md` conclusions alone.
- `.caf/tasks/12/requirements.md`, `design.md`, `verify-report.md` (both rounds), `qa-report.md`, `tasks.md`.
- Full source read of the new module: `apps/api/src/products/products.controller.ts`,
  `products.service.ts`, `products.module.ts`, all `dto/*.ts`, `products.service.spec.ts`.
- Full source read of `apps/api/src/shared/filters/all-exceptions.filter.ts` (current
  state on disk, not just the diff hunk) plus verification against the actual
  installed `@nestjs/common` `HttpException` implementation
  (`node_modules/.../http.exception.js`) to check the "backward compatible /
  byte-identical" claim made in `design.md §7`, `verify-report.md`, and
  `qa-report.md`.
- `apps/api/prisma/schema.prisma` / migration / `seed.ts` diffs.
- Comparison against `PostsService.findAllPublic` (`apps/api/src/posts/posts.service.ts:94-116`)
  for pattern consistency.
- Grep of `apps/admin/src` and `apps/web/app` for any code that parses the
  `error` field of API error responses (none found).

## Security Audit

- **Authz**: all `admin/products/*` routes carry `@Permissions('manage_products')`
  in the controller, and `manage_products` is seeded and mapped only to the
  `admin` role in `prisma/seed.ts` (not `authorPermissions`). Global
  `JwtAuthGuard` + `PermissionsGuard` are wired as `APP_GUARD` in
  `app.module.ts` (unchanged by this PR), so routes are protected-by-default;
  the two public routes (`GET /products`, `GET /products/:slug`) are correctly
  marked `@Public()`. Verified live by QA: no-token → 401, non-admin
  (`author`) token → 403, admin token → succeeds. No route is missing a guard
  decorator that should have one, and no `@Permissions()` typo reuses a
  Posts/Playlist/Media permission slug. PASS.
- **Existence leak**: `findBySlugPublic` uses a single `findFirst({ where: {
  slug, status: 'published' } })` and always throws the same
  `NotFoundException('Product not found')` for "doesn't exist" and
  "exists but draft/archived" — no side channel (timing is negligible, same
  code path, same query). PASS.
- **Mass assignment / DTO surface**: `create`/`update` write `{...dto}`
  straight into Prisma `data`, but the DTO's own field set is deliberately
  restricted to `name, slug, tagline, description, status, cover,
  pipelineSteps, features, ctaLabel, ctaUrl, order, featured` — no `id`,
  `createdAt`, `updatedAt`, or any relation-touching field is present on
  `CreateProductDto`/`UpdateProductDto`, so this is safe as long as the
  global `ValidationPipe` has `whitelist: true` (standard Nest convention
  already used by every other module here — not something this PR changes).
  No new attack surface introduced.
- **Injected query field (`sort`)**: `findAdminAll` builds
  `orderBy = { [sort]: ... }` from `query.sort`, but `sort` is constrained by
  `@IsIn(['order', 'updatedAt'])` on `ListProductsDto`, so this can't be used
  for Prisma `orderBy` injection beyond those two literal keys. Safe.
- **`AllExceptionsFilter` change — real, previously-unflagged behavioral
  regression (see Qualitative Review below for detail).** Not a security
  vulnerability (no secret/internal data is exposed — only a generic HTTP
  reason phrase like `"Not Found"`/`"Bad Request"`), but it is a
  correctness/documentation-accuracy issue worth the human merging this PR
  being aware of, since three separate artifacts (`design.md §7`,
  `verify-report.md`, `qa-report.md`) explicitly assert something that is
  demonstrably false.
- No secrets, credentials, or `.env` values touched or introduced in this diff.

## Qualitative Review

**Positive — this diff is genuinely solid engineering:**
- Prisma schema/migration is additive-only (confirmed by reading
  `migration.sql`: only `CREATE TYPE`, `CREATE TABLE products`, 5
  `CREATE INDEX`/`CREATE UNIQUE INDEX` statements; no other table touched).
- Publish-validation logic (`assertPublishable`) is correctly invoked with
  **merged existing+body data** in `update()`
  (`this.assertPublishable({ ...existing, ...dto })`,
  `products.service.ts:1961-1963`), not just the PATCH body — this is exactly
  the subtle correctness requirement `design.md §6`/§12-point-4 called out as
  "easy to get wrong," and it's implemented correctly. Confirmed by reading
  the code directly (not just trusting the reports).
- The round-2 pagination fix (the prior BLOCKING finding) is verified correct
  in the current diff: `ListPublicProductsDto` (page/limit only, no sort/dir)
  is exported and wired into `findAllPublic`, which now runs
  `findMany`/`count` inside a `$transaction` and returns the same
  `{ success, message, data, meta }` envelope as `findAdminAll` and
  `PostsService.findAllPublic`. Structurally identical to the reference
  pattern.
- Slug handling: auto-suffix for silent auto-generated slugs vs.
  `ConflictException` (409) for admin-supplied explicit slugs, matches
  `design.md §9`'s intentional deviation from Posts' pattern, and `update()`
  correctly excludes the record's own id from the uniqueness check
  (`ensureUniqueSlug(dto.slug, id)`).
- Endpoint/guard table matches `design.md §10` exactly; `PATCH` (not `PUT`)
  is used deliberately per explicit requirements override, correctly noted
  as intentional rather than a slip.
- `manage_products` permission-not-role decision (`design.md §3`) is
  reasonable and clearly documented with rationale in three places
  (`design.md`, `docs/api/api-contract.md`, `docs/development/backlog.md`
  DEC-007) — this is exactly the kind of ambiguous-requirements judgment call
  that should be flagged loudly rather than silently decided, and it was.

**Finding — `AllExceptionsFilter` change is not actually backward-compatible /
byte-identical, contrary to what three project artifacts claim (non-blocking,
but should be corrected or acknowledged):**

`apps/api/src/shared/filters/all-exceptions.filter.ts` now does:

```ts
const rawResponse = exception instanceof HttpException ? exception.getResponse() : null;
const extra = rawResponse && typeof rawResponse === 'object' && !Array.isArray(rawResponse)
  ? (rawResponse as Record<string, unknown>) : {};

response.status(status).json({
  ...extra,
  success: false,
  statusCode: status,
  timestamp: new Date().toISOString(),
  path: request.url,
  message,
});
```

The stated intent (`design.md §7`, `verify-report.md`, `qa-report.md`, and
`docs/api/api-contract.md`) is that this is additive-only and that
"exceptions with plain string messages... produce byte-identical responses to
before." I verified this against the actual installed
`@nestjs/common@10.4.22` `HttpException.createBody()`
(`node_modules/.pnpm/.../http.exception.js:91-106`):

```js
static createBody(arg0, arg1, statusCode) {
  if ((isString(arg0) || Array.isArray(arg0))) {
    return { message: arg0, error: arg1, statusCode: statusCode };
  }
  ...
}
```

This means **every** built-in Nest exception thrown with just a string
message — `NotFoundException('Product not found')`,
`ConflictException('Slug already in use')`, and every other
`NotFoundException`/`BadRequestException`/`UnauthorizedException`/etc. thrown
anywhere else in `apps/api` (Posts, Users, Media, Playlists, Auth, all of
them, not just Products) — has a `getResponse()` that returns an **object**
`{ message, error: '<reason phrase>', statusCode }`, not a plain string. So
`extra` is non-empty for these too, and since only `message`/`statusCode`
(not `error`) get overridden by the standard fields spread after `...extra`,
**every error response app-wide now gains a new `error` key** (e.g.
`"Not Found"`, `"Bad Request"`, `"Conflict"`) that was not present before
this PR. This directly contradicts the "byte-identical" claim recorded in
`design.md §7`, `verify-report.md`'s "Fix round 2" verification, and
`qa-report.md` finding #4 ("confirmed by observing the 404 response shape").
None of the three apparently enumerated the full response body's keys when
checking this — they likely compared `message`/`statusCode`/overall shape
visually and missed the added `error` key.

Impact assessment (why this is not blocking):
- It is a strictly additive field, not a removed/renamed one — no field any
  existing consumer currently reads is changed.
- Grepped `apps/admin/src` and `apps/web/app` for code that inspects an
  `error` property on API error responses — none found. No known frontend
  consumer breaks.
- The field's content (a generic HTTP reason phrase) has no security
  sensitivity.

Recommendation for the developer (not required before merge, but should be
tracked): either (a) update `design.md §7`/`docs/api/api-contract.md`/
`verify-report.md` to accurately state that all structured `HttpException`
responses gain an `error` field app-wide (and confirm that's acceptable), or
(b) tighten the filter to truly preserve the old shape by omitting the
well-known Nest keys (`message`, `statusCode`, `error`) from `extra` and only
spreading genuinely custom keys like `fields`:
```ts
const { message: _m, statusCode: _s, error: _e, ...extra } = rawResponse as Record<string, unknown>;
```
Either is fine; leaving the current behavior as-is without correcting the
documentation is the only option I'd push back on.

**Minor, non-blocking observations (not new — already surfaced in prior
rounds, re-verified as still accurate and still not blocking):**
- `products.service.spec.ts` cannot execute (no jest runtime in `apps/api`);
  excluded from `tsc` via `tsconfig.json` `exclude` addition. Pre-existing
  repo-wide tooling gap, correctly out of scope for this ticket per
  `design.md §11`.
- `cover`/`slug` fields on `CreateProductDto` have no format constraint
  (`@IsUrl()` on `cover`, or a slug-shape regex on `slug`) beyond
  `@IsString()`. Not a requirements violation (requirements only mandate
  `ctaUrl` format validation), just worth a human product owner confirming
  it's acceptable that an admin could set an arbitrary non-URL string as
  `cover` or a slug with spaces/uppercase/special characters when supplying
  it explicitly.
- Minor TOCTOU: `ensureUniqueSlug` does a `findUnique` check before
  `create`/`update`, not inside a transaction with the write, so two
  concurrent requests with the same explicit slug could both pass the check
  and one would then fail on the DB's unique constraint with an unhandled
  `PrismaClientKnownRequestError` (P2002) instead of a clean `409`. Very
  low-probability race for an admin-only, low-concurrency write path; not
  worse than the general pattern already accepted elsewhere in this
  codebase, not blocking.

## Verdict Rationale

The two substantive things this INITIAL review needed to independently
verify — (1) that the previously-approved pagination fix is genuinely present
and correct in the current diff, and (2) that nothing regressed since the
last approval — both check out from direct code reading, not just trusting
the chain of prior reports. All Definition-of-Done items in
`requirements.md` are met: additive migration, public endpoint exposes only
`published` items, admin endpoints require the same class of auth as Posts
(permission-gated, not just logged-in-gated), publish validation is applied
consistently at every state-transition path using merged existing+body data,
and archive→restore round-trips without data loss.

The one new, previously-unflagged finding (the `AllExceptionsFilter`
`error`-field leak and the inaccurate "byte-identical" claim across three
documents) is real and worth surfacing, but on its merits it is additive,
harmless to current consumers, and does not violate any requirement in
`requirements.md` or `design.md`'s actual intent (surfacing extra properties
on structured exceptions) — it just goes slightly further than documented.
That does not rise to a merge-blocking level on its own.

## For Developer

1. Non-blocking but please address before/soon after merge: correct the
   "byte-identical"/"backward compatible" claims in `design.md §7`,
   `verify-report.md`, `qa-report.md`, and `docs/api/api-contract.md` to
   reflect that all structured `HttpException` responses app-wide now gain an
   `error` key — or tighten the filter (see snippet above) to avoid it if
   true byte-for-byte compatibility is actually desired. Either is
   acceptable; just make the documentation match reality.
2. No other changes required. Everything else in this PR — schema/migration,
   `manage_products` permission model, publish-validation merge logic,
   archive/restore round-trip, slug uniqueness, existence-leak prevention,
   and the pagination fix from the prior review round — was independently
   re-verified against the actual code in this diff and is correct.
