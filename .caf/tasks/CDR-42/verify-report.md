# Verification Report: CDR-42

Status: SUCCESS

## Checklist
- [x] (apps/admin) `corepack pnpm --filter coderium-admin run typecheck` (`vue-tsc --noEmit`) passed.
- [x] (apps/admin) `corepack pnpm --filter coderium-admin run build` (`vue-tsc -b && vite build`) passed.

## Details
- Wrapped `productsStore.unpublishProduct(id)` in `handleUnpublish` with a try/catch block showing an error toast (`severity: 'error'`, `summary: 'Unpublish failed'`, `life: 6000`) on rejection.
- Wrapped `productsStore.restoreProduct(id)` in `handleRestore` with a try/catch block showing an error toast (`severity: 'error'`, `summary: 'Restore failed'`, `life: 6000`) on rejection.
- Wrapped `productsStore.archiveProduct(id)` in `handleArchive` accept callback with a try/catch block showing an error toast (`severity: 'error'`, `summary: 'Archive failed'`, `life: 6000`) on rejection.
- Added `extractErrorMessage` helper to consistently extract error message from `err.response?.data?.message` with sensible fallback text for each action.
