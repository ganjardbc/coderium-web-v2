## Review Notes — CDR-44
Ticket: CDR-44 — Uploaded media never appears in Media grid without manual reload
Agent: caf-reviewer
Verdict: APPROVE

### Security Audit
None. The change is confined to a UI event emission path. No new network calls, no new data exposure, no auth surface touched. The `uploaded` payload (`UploadedMedia[]`) is data already returned from the backend upload API — it is not re-sent anywhere, only forwarded to an in-memory reactive array in the page.

### Qualitative Review

**Diff is minimal and correct.**
Exactly two additive lines were introduced in `apps/admin/src/components/MediaUploader.vue`:
1. `uploaded: [uploaded: UploadedMedia[]];` added to `defineEmits` (line 177).
2. `emit('uploaded', uploaded);` added immediately after `emit('update:modelValue', next)` (line 281).

No other files were modified. The diff is clean; no accidental whitespace, formatting, or unrelated changes.

**Root-cause resolution is accurate.**
The bug was a permanently dead `@uploaded="onUploaded"` listener on `media/pages/index.vue` (line 10), because `MediaUploader` never declared or fired an `uploaded` event. The fix directly closes that gap. The page handler `onUploaded` and its binding were already correct — not touching them was the right call.

**Additive, non-breaking change.**
All six other consumers of `<MediaUploader>` (posts/create, posts/edit, playlists/create, playlists/edit, products/ProductForm, settings/profile) use `v-model` which maps exclusively to the `update:modelValue` event. None binds `@uploaded`. Emitting both events is strictly additive; no regression path exists.

**Branch coverage is sound.**
Both API branches in `uploadFiles()` — multi-file `/uploads/images` (line 267) and single-file `/uploads/image` (line 276) — assign `uploaded` before the emit block. The new emit is inside the `try` block, so it only fires on success; failures fall through to the `catch` block and the error message is shown correctly.

**Emit ordering is correct.**
`emit('update:modelValue', next)` (cumulative list) fires before `emit('uploaded', uploaded)` (newly added items only). This ordering is semantically consistent and matches what the page handler expects.

**Minor pre-existing concern (not introduced by this PR).**
`onUploaded` in `index.vue` (line 101) accepts `Record<string, unknown>[]` and casts to `MediaItem[]` via `as unknown as MediaItem[]`. This is a loose type — a future mismatch between `UploadedMedia` and `MediaItem` fields would be silent at compile time. The fields are currently identical (`id, url, filename, originalName, mimeType, size`), so no functional risk exists today. This is pre-existing code, not introduced here; mentioning for future cleanup backlog only.

**TypeScript / build environment note.**
`vue-tsc` and `vite build` fail due to pre-existing workspace symlink resolution issues in the headless CI context (not caused by this change). Both the implementation agent and QA agent confirmed zero new TS errors on the changed lines. This is consistent with the minimal, type-correct nature of the diff.

### Verdict Rationale
The fix is the smallest possible correct change. Root cause is fully addressed, all acceptance criteria are met, no regressions exist across any consumer, and the change is type-safe. QA independently verified every acceptance criterion with direct code inspection and `git diff` confirmation. No security, correctness, or maintainability concerns were found in the introduced code.

### For Developer
- The loose `as unknown as MediaItem[]` cast in `onUploaded` (index.vue:102) is a pre-existing smell worth a future cleanup — ideally import and reuse `UploadedMedia` directly, or align the handler's parameter type with the emitted type to get compile-time safety end-to-end.
- If a future consumer needs only the count of uploaded files, consider also emitting the count as a convenience — but this is optional and not required for the current ticket.
