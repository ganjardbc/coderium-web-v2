# QA Report — Ticket 12: Product CRUD API (apps/api)

## Scope of review

- Ticket body (`gh issue view 12`)
- `.caf/tasks/12/requirements.md`, `design.md`, `tasks.md`, `verify-report.md`
- Code: `apps/api/prisma/schema.prisma`, `apps/api/prisma/migrations/20260824073827_add_product/`,
  `apps/api/src/products/**`, `apps/api/src/app.module.ts`, `apps/api/prisma/seed.ts`,
  `apps/api/src/shared/filters/all-exceptions.filter.ts`, `apps/api/tsconfig.json`
- Independently re-ran: `typecheck`, `build`, `prisma migrate status`, booted the app
  (`node dist/main.js`) against the local dev Postgres DB, and re-executed the full
  smoke-test lifecycle (create → publish-fail → publish-success → public visibility →
  archive → public 404 → restore) plus auth 401 (no token) and permission 403
  (non-admin `author` role), independent of the implementer's own claims.

## Findings vs. acceptance criteria (ticket + requirements.md DoD)

1. **Prisma model/migration** — `Product` model + `ProductStatus` enum match
   `design.md §2` exactly (field names, types, defaults, `@@map`/`@map` column
   names, indexes). Migration `20260824073827_add_product` is additive-only
   (`CREATE TYPE`, `CREATE TABLE products`, 5 indexes) — verified via
   `git diff`-equivalent read of `migration.sql`; no other table touched.
   `prisma migrate status` confirms the migration is applied and the dev DB
   schema is up to date. PASS.
2. **Public endpoints** — `GET /products` returns only `published` items
   ordered by `order` asc; `GET /products/:slug` returns 404 uniformly for
   both "does not exist" and "exists but draft/archived" (verified live:
   nonexistent slug → 404, and after archiving a real product → 404,
   identical body shape, no existence leak). PASS.
3. **Admin endpoints** — full CRUD + publish/unpublish/archive/restore exist
   at the paths specified in `design.md §10`, gated by a new permission
   `manage_products` (seeded, mapped to `admin` role only in `prisma/seed.ts`).
   Verified live: no-token request → `401`; token for `author` role (no
   `manage_products`) → `403 Insufficient permissions`; token for `admin` role
   → succeeds through the full lifecycle. This satisfies "auth same as Posts
   module" semantically (permission-gated, not just logged-in-gated), matching
   the explicit architecture decision recorded in `design.md §3`/§12 point 1.
   PASS.
4. **Publish validation** — `assertPublishable` checks `cover`, `ctaUrl`
   (via `class-validator`'s `isURL`), `pipelineSteps.length >= 1`,
   `features.length >= 1`, applied uniformly in `create`, `update` (PATCH,
   merged with existing row data — not just body), and dedicated `publish`.
   Verified live: publish attempt on an incomplete draft → `400` with
   `{"fields":["cover","ctaUrl","pipelineSteps","features"]}`; PATCH with all
   fields + `status: published` in one request → `200`, status flips
   correctly. The `AllExceptionsFilter` additive change (spreads the raw
   `HttpException` response object before standard fields) is confirmed
   necessary and working — without it `fields` would have been silently
   dropped by Nest's `HttpException` string-coercion, and is backward
   compatible (plain-string exceptions like `NotFoundException('Product not
   found')` render identically pre/post-change, confirmed by observing the
   404 response shape). PASS.
5. **Archive/restore round-trip** — verified live: archive removes the
   product from public listing/detail while keeping the row in the DB, and
   restore sets `status: draft` while preserving `cover`/`ctaUrl`/
   `pipelineSteps`/`features` untouched (all data intact in the restore
   response). PASS.
6. **Out-of-scope respected** — no changes to Post/Playlist schema or
   endpoints; no hard-delete endpoint added; no new role (only a new
   permission, an explicit and documented deviation-with-rationale from a
   literal reading of "no new permission", recorded transparently in
   `design.md §3/§12` and `verify-report.md`); no `apps/admin`/`apps/web`
   changes. PASS.
7. **Verification commands** — re-ran independently, not just trusted the
   implementer's report:
   - `pnpm --filter coderium-api run typecheck` → PASS, no errors.
   - `pnpm --filter coderium-api run build` (`nest build`) → PASS, no errors.
   - `test`/`lint` genuinely have no runnable script/config in `apps/api`
     (confirmed: no `jest`/eslint config, `package.json` has no `test`/`lint`
     script) — this is a pre-existing repo-wide tooling gap, not something
     this ticket introduced or should be blocked on, consistent with
     `design.md §11` and `CLAUDE.md`'s own "Perintah Verifikasi: TODO" state
     for this monorepo. Behavior normally covered by unit tests was instead
     verified via live smoke test end-to-end (see above), which is an
     acceptable substitute given the infra gap.

## NON-CRITICAL observations

- `apps/api/src/products/products.service.spec.ts` exists but cannot be
  executed (no jest runtime in `apps/api`). It is excluded from `tsc` via a
  `tsconfig.json` change (`exclude: [..., "**/*.spec.ts"]`). This is
  documented transparently in `verify-report.md` and is consistent with
  `design.md §11`'s explicit guidance — not treated as a blocker, but flagged
  for whoever eventually sets up `apps/api` test infra to pick this file up.
- Uncommitted working tree also contains edits to `README.md`,
  `docs/api/api-contract.md`, `docs/architecture/module-breakdown.md`,
  `docs/database/prisma-schema-design.md`, `docs/development/backlog.md`,
  and `docs/development/progress.md` (all additive, following this repo's
  existing docs/backlog convention, content accurate against the implemented
  API). These were **not mentioned** in `verify-report.md`'s "Summary of
  changes" section — a minor reporting gap (nothing incorrect in the content
  itself, just undisclosed), worth the implementer including in future
  verify-reports for completeness.
- `ProductsService.findAdminAll` computes `total` via a separate
  `prisma.product.count()` inside the same `$transaction` as the paginated
  `findMany` — correct and consistent with typical Posts-module pagination
  pattern; no issue, noted only because it wasn't explicitly itemized in
  `design.md §8`'s one-line spec for `findAdminAll` (implementer detail, not
  a deviation).

## CRITICAL

None found.

## Verdict

All Definition-of-Done items in `requirements.md` are met and independently
re-verified against a live running instance of the API + real Postgres dev
database (not just trusting `verify-report.md`'s claims). Typecheck and build
are green. No regressions to other modules were introduced (schema/migration
additive-only; `AllExceptionsFilter` change is additive and backward
compatible; no other files touched besides what's documented). No new test
data left in the dev DB after review.

## Status: PASS
