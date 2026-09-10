# Requirements: CDR-44 - Uploaded media never appears in Media grid without manual reload

## Status: PLAN

## Overview & Problem Statement
In the admin panel (`apps/admin`), the Media management page (`apps/admin/src/modules/media/pages/index.vue`) contains a `<MediaUploader>` component that listens to the `@uploaded` event:
```vue
<MediaUploader :multiple="true" @uploaded="onUploaded" class="mb-6" />
```
However, `MediaUploader.vue` (`apps/admin/src/components/MediaUploader.vue`) only declares `defineEmits<{ 'update:modelValue': [value: UploadedMedia[]] }>()` and does not emit the `uploaded` event when files are successfully uploaded. Furthermore, `index.vue` does not bind `v-model` / `modelValue`, so the emitted `update:modelValue` is not received either.

As a result, although files are successfully uploaded to the backend (`POST /uploads/image` or `POST /uploads/images`), the page state (`mediaItems` and `meta.total`) is never updated in real time. The newly uploaded media only appears after a full manual browser refresh.

## Scope
- **App**: `apps/admin`
- **Files**:
  - `apps/admin/src/components/MediaUploader.vue`
  - `apps/admin/src/modules/media/pages/index.vue`

## Functional Requirements
1. **Emit `uploaded` Event from `MediaUploader`**:
   - Update `MediaUploader.vue` emit definitions to include `uploaded: [value: UploadedMedia[]]`.
   - In `uploadFiles()`, upon successful API response (`/uploads/image` or `/uploads/images`), emit `uploaded` with the newly uploaded media items array (`uploaded: UploadedMedia[]`).
   - Retain the existing `update:modelValue` emit to ensure backwards compatibility with components that use `v-model`.

2. **Handle `uploaded` Event in Media Page**:
   - Ensure `apps/admin/src/modules/media/pages/index.vue`'s `onUploaded(newMedia: UploadedMedia[])` properly prepends the new media items to `mediaItems.value` and updates `meta.value.total`.
   - Ensure type annotations are clean and consistent using `UploadedMedia` or `MediaItem`.

## Acceptance Criteria
- [ ] When a single image is uploaded via `<MediaUploader>` in the media page, the new image immediately appears at the beginning of the media grid without requiring a page reload.
- [ ] When multiple images are uploaded simultaneously, all newly uploaded images appear at the beginning of the media grid without requiring a page reload.
- [ ] The total media counter in `meta.total` increments correctly according to the number of uploaded items.
- [ ] No TypeScript compiler errors or Vue warnings in `apps/admin`.
