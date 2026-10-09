# Tasks: CDR-42 — Product unpublish/restore fail silently — missing try/catch

## Frontend Tasks
- [x] (apps/admin) Add try/catch error handling and error toast notifications to `handleUnpublish` in `apps/admin/src/modules/products/pages/list.vue`.
- [x] (apps/admin) Add try/catch error handling and error toast notifications to `handleRestore` in `apps/admin/src/modules/products/pages/list.vue`.
- [x] (apps/admin) Add try/catch error handling and error toast notifications to `handleArchive` accept callback in `apps/admin/src/modules/products/pages/list.vue`.
- [x] (apps/admin) Run typecheck in `apps/admin` (`pnpm --filter coderium-admin typecheck` / `vue-tsc --noEmit`) to verify no type regressions.
