## Ticket
CDR-44 — Uploaded media never appears in Media grid without manual reload

## Agent sequence
Frontend (apps/admin)

---

## Frontend Tasks

- [ ] (apps/admin) In `src/components/MediaUploader.vue`, extend `defineEmits` to include the `'uploaded'` event:

  ```ts
  // Before (lines 175–177)
  const emit = defineEmits<{
    'update:modelValue': [value: UploadedMedia[]];
  }>();

  // After
  const emit = defineEmits<{
    'update:modelValue': [value: UploadedMedia[]];
    uploaded: [uploaded: UploadedMedia[]];
  }>();
  ```

- [ ] (apps/admin) In `uploadFiles()` (same file), fire the new event immediately after the existing `emit('update:modelValue', next)` call (currently line 279), passing only the newly uploaded items:

  ```ts
  emit('update:modelValue', next);
  emit('uploaded', uploaded);   // ← add this line
  ```

  The `uploaded` variable already holds the freshly-returned `UploadedMedia[]` from the API response (resolved from both the single-file and multi-file branches above).

---

## Backend Tasks
_(none — the API is not involved in this fix)_

---

## Notes
- `src/modules/media/pages/index.vue` requires **zero changes**. The `@uploaded="onUploaded"` binding and the `onUploaded` handler logic are already correct.
- Both branches of `uploadFiles()` (single-file `/uploads/image` and multi-file `/uploads/images`) set `uploaded` before reaching the emit calls — no branch coverage issue.
- Emitting both events is additive; no existing consumer breaks.
