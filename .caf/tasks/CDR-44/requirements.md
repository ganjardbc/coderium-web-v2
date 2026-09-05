## Status: PLAN

## Ticket
CDR-44 — Uploaded media never appears in Media grid without manual reload

## Source
Auditor Agent scan 2026-09-04
File: `.caf/audits/2026-09-04/audit-report-apps-admin.md`

## Problem (confirmed by code inspection)

`apps/admin/src/modules/media/pages/index.vue` (line 10) uses:

```html
<MediaUploader :multiple="true" @uploaded="onUploaded" class="mb-6" />
```

`apps/admin/src/components/MediaUploader.vue` (lines 175–177) only declares:

```ts
const emit = defineEmits<{
  'update:modelValue': [value: UploadedMedia[]];
}>();
```

Two mismatches:
1. `MediaUploader` never emits `'uploaded'`, so `@uploaded="onUploaded"` is a dead listener.
2. The page never binds `v-model`, so the `update:modelValue` emission (line 279) also goes nowhere.

Net effect: `uploadFiles()` succeeds, files land on the backend, but `mediaItems` in the page is never mutated — the grid stays stale until a hard reload.

## Chosen fix contract
Add the `'uploaded'` event to `MediaUploader`'s `defineEmits` and fire it in the success path of `uploadFiles()` carrying only the **newly** uploaded items (`uploaded` local variable, not the cumulative `next` array). The page's `onUploaded` handler is already correct — it prepends and bumps the count — so no change is needed there.

Rationale for this choice over the v-model approach:
- The page uses the uploader as a standalone trigger, not a form-field selector. A named `uploaded` event is semantically cleaner.
- `onUploaded` already has exactly the right logic; touching the page would risk regressions.
- Emitting both `update:modelValue` AND `uploaded` lets other consumers (e.g. future form pages that do bind `v-model`) still work correctly — we are strictly additive.

## Scope
Single file change: `apps/admin/src/components/MediaUploader.vue`
- Add `'uploaded': [uploaded: UploadedMedia[]]` to `defineEmits`.
- After line 279 (`emit('update:modelValue', next)`), add `emit('uploaded', uploaded)`.

No changes needed in `media/pages/index.vue` — the template and `onUploaded` handler are already correct.

## Out of Scope
- Backend changes — uploads already succeed.
- Pagination reset after upload — `onUploaded` prepends to the current page, which is acceptable behaviour; a full re-fetch is not required by the ticket.
- Other pages that use `<MediaUploader>` with `v-model` — they are unaffected because `update:modelValue` emission is unchanged.

## Acceptance Criteria
1. After a successful upload in the Media page, the newly uploaded item(s) appear at the top of the grid immediately, without any manual page reload.
2. `meta.value.total` in the page is incremented by the number of uploaded files.
3. `MediaUploader` still emits `update:modelValue` correctly (existing consumers not broken).
4. TypeScript compiles without errors on the modified file.
