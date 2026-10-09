# Requirements: CDR-42 — Product unpublish/restore fail silently — missing try/catch

## Status: PLAN

## Overview
In the Admin Products module (`apps/admin/src/modules/products/pages/list.vue`), actions like `handleUnpublish` and `handleRestore` call async store methods (`productsStore.unpublishProduct(id)` and `productsStore.restoreProduct(id)`) without wrapping them in a `try/catch` block. If the network fails, auth token expires, or backend returns an error (e.g. 500 or 400), the promise rejection is unhandled, no error toast is displayed, and the user receives no feedback.

## Problem Statement
- `handleUnpublish` and `handleRestore` in `apps/admin/src/modules/products/pages/list.vue` lack `try/catch` blocks.
- Unhandled rejections leave users unaware of failures when attempting to unpublish or restore a product.
- Inconsistent UX compared to `handlePublish` and other administrative actions that display error toasts when operations fail.

## Proposed Solution
- Wrap `productsStore.unpublishProduct(id)` in a `try/catch` block within `handleUnpublish`. On failure, display an error toast (severity `'error'`, summary `'Unpublish failed'`, life `6000`).
- Wrap `productsStore.restoreProduct(id)` in a `try/catch` block within `handleRestore`. On failure, display an error toast (severity `'error'`, summary `'Restore failed'`, life `6000`).
- Wrap `productsStore.archiveProduct(id)` in a `try/catch` block within `handleArchive` accept callback for consistent error handling. On failure, display an error toast (severity `'error'`, summary `'Archive failed'`, life `6000`).
- Ensure consistent error message extraction from `err.response?.data?.message` with sensible fallback text.

## Acceptance Criteria
1. When unpublishing a product fails (e.g. API error or network failure), an error toast is shown with severity `'error'`, summary `'Unpublish failed'`, and the detailed error message (or fallback).
2. When restoring a product fails, an error toast is shown with severity `'error'`, summary `'Restore failed'`, and the detailed error message (or fallback).
3. When archiving a product fails, an error toast is shown with severity `'error'`, summary `'Archive failed'`, and the detailed error message (or fallback).
4. Successful unpublish, restore, and archive actions continue to show success/info toasts and refresh the product list.
5. No TypeScript or runtime errors introduced; code passes typecheck (`vue-tsc --noEmit`).

## Open Questions
None.
