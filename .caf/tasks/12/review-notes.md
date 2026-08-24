# Review Notes — Ticket 12: Product CRUD API (apps/api)

## Round 2 (re-review after fix)

### Scope of this re-review

- `.caf/tasks/12/review-notes.md` (round 1, my own prior findings) and
  `.caf/tasks/12/verify-report.md` "Fix round 2" section.
- Full re-read of `apps/api/src/products/products.controller.ts` and
  `apps/api/src/products/products.service.ts` (entire files, not a diff-only
  skim).
- New files: `apps/api/src/products/dto/list-public-products.dto.ts`,
  `apps/api/src/products/dto/index.ts` (export added).
- Cross-checked against `apps/api/src/posts/posts.service.ts:94-116`
  (`PostsService.findAllPublic`, the mirror target per design.md §8) and
  against this module's own `findAdminAll` (`products.service.ts:139-159`),
  which round 1 already confirmed correct.
- Re-verified `git status` (working tree, uncommitted, branch `ai-agent/12`)
  — same file set as round 1 plus the new DTO file; nothing unexpected added.

### Verification of the BLOCKING fix

The prior finding — `GET /products` (public listing) had no pagination,
contradicting design.md §8 — is **closed**. Confirmed directly in code:

- `ListPublicProductsDto` (`page`/`limit`, default `1`/`10`, `@Type(() =>
  Number)` + `@IsNumber()` validation) added and exported from
  `dto/index.ts`. Intentionally a subset of `ListProductsDto` (no
  `sort`/`dir`), consistent with the public order being fixed to `order asc`
  — matches what round 1 suggested as an acceptable option.
- `ProductsController.findAllPublic` now takes `@Query() query:
  ListPublicProductsDto` (`products.controller.ts:22`), passed straight
  through to the service.
- `ProductsService.findAllPublic` (`products.service.ts:104-125`) now:
  computes `skip = (page - 1) * limit`; runs `findMany`/`count` inside a
  `$transaction`, identical structure to `findAdminAll`
  (`products.service.ts:139-159`) and to `PostsService.findAllPublic`;
  returns `{ success, message, data, meta: { page, limit, total, totalPages }
  }` — same envelope shape used everywhere else in this codebase.
- `where: { status: 'published' }` and `orderBy: { order: 'asc' }` are
  unchanged from before the fix — the fix is additive (pagination only), it
  did not touch the filtering/ordering logic that was already correct and
  approved in round 1.

This closes the gap completely: `findAllPublic` and `findAdminAll` are now
consistent in shape (pagination + `meta`), differing only in `where` filter
and lack of `sort`/`dir` on the public variant — which is the correct,
intentional difference (public catalog should not expose arbitrary sort by
admin-facing fields), not an inconsistency.

### Regression check

Re-read every other method in `products.service.ts` and every route in
`products.controller.ts` end-to-end (not just the diff) to confirm the fix
didn't disturb anything previously approved:

- `create`, `findBySlugPublic`, `findAdminById`, `update`, `publish`,
  `unpublish`, `archive`, `restore`, `ensureUniqueSlug`, `assertPublishable`
  — all byte-identical in logic to what I reviewed and approved in round 1
  (existing+body merge validation on `update`, no-existence-leak on
  `findBySlugPublic`, archive/restore data preservation, slug
  uniqueness/conflict handling).
- Controller route table (guards, methods, paths) unchanged from round 1 —
  still matches `verify-report.md`'s endpoint contract table 1:1.
- `git status` shows no files touched by this fix beyond the two DTO files
  and the two products module files already covered above; the previously
  reviewed schema/migration/seed/app.module/exception-filter/tsconfig
  changes are untouched.
- `verify-report.md`'s "Fix round 2" section accurately reports
  typecheck/build re-run as PASS and correctly updates the "Deviations from
  design.md" section to no longer claim false full-compliance — the
  paper-trail issue from round 1 (report said "none" when there was a real
  deviation) is also resolved: it now transparently documents that round 1's
  claim was wrong and explains the fix.

### Decision: APPROVE

The one BLOCKING finding from round 1 is fixed correctly, mirrors the
established codebase pattern exactly (same DTO shape, same
skip/take/$transaction/meta pattern as `findAdminAll` and
`PostsService.findAllPublic`), and no regression was introduced elsewhere —
every other previously-approved piece of this diff (schema/migration,
`manage_products` permission model, `AllExceptionsFilter` fix, `PATCH`
semantics, publish-validation merge logic, archive/restore round-trip, slug
uniqueness, existence-leak prevention) remains untouched and correct.

Outstanding non-blocking items already known and accepted (no new action
required, unchanged from round 1):
- `products.service.spec.ts` cannot execute — pre-existing repo-wide
  lint/test tooling gap in `apps/api`, out of scope for this ticket.
- Uncommitted docs changes (`README.md`, `docs/api/api-contract.md`,
  `docs/architecture/module-breakdown.md`,
  `docs/database/prisma-schema-design.md`, `docs/development/backlog.md`,
  `docs/development/progress.md`) — already spot-checked in round 1, content
  accurate and additive.

This ticket is ready to merge from a code-review standpoint. Branch/PR/
ticket-status actions are out of this agent's scope.
