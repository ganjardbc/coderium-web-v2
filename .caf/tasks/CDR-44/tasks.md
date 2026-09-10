# Tasks: CDR-44 - Uploaded media never appears in Media grid without manual reload

## Status: PLAN

## Order of Agents
1. Frontend Agent (`caf-frontend`)
2. QA Agent (`caf-qa`)
3. Reviewer Agent (`caf-reviewer`)

## Frontend Tasks
- [x] (apps/admin) Update `apps/admin/src/components/MediaUploader.vue` emit declaration to include `uploaded: [value: UploadedMedia[]]`.
- [x] (apps/admin) Emit `uploaded` with the newly uploaded items array in `apps/admin/src/components/MediaUploader.vue` `uploadFiles()` method alongside `update:modelValue`.
- [x] (apps/admin) Verify and type `onUploaded` handler in `apps/admin/src/modules/media/pages/index.vue` to ensure incoming media items are prepended to `mediaItems.value` and `meta.value.total` is updated.
- [x] (apps/admin) Verify typecheck and build pass in `apps/admin`.

## QA Tasks
- [x] (apps/admin) Test uploading a single file in Media module and confirm it appears in the grid immediately without refreshing.
- [x] (apps/admin) Test uploading multiple files in Media module and confirm all appear immediately in the grid.
- [x] (apps/admin) Verify pagination / total count updates accordingly.
