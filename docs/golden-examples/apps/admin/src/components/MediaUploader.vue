<template>
  <div class="space-y-4">
    <!-- Drop zone -->
    <div
      @click="openFilePicker"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      :class="[
        'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer select-none',
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-surface-300 dark:border-surface-600 hover:border-primary/60 hover:bg-surface-50 dark:hover:bg-surface-800/50',
        disabled ? 'pointer-events-none opacity-50' : '',
        isUploading ? 'pointer-events-none' : '',
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- Uploading state -->
      <div v-if="isUploading" class="flex flex-col items-center gap-3 text-center">
        <div class="relative h-12 w-12">
          <svg class="animate-spin h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-surface-700 dark:text-surface-200">Uploading…</p>
          <p class="text-xs text-surface-400 mt-1">{{ uploadProgress }}%</p>
        </div>
        <!-- Progress bar -->
        <div class="w-48 h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
          <div
            class="h-full bg-primary rounded-full transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          />
        </div>
      </div>

      <!-- Idle state -->
      <div v-else class="flex flex-col items-center gap-3 text-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <i class="pi pi-cloud-upload text-2xl text-primary" />
        </div>
        <div>
          <p class="text-sm font-semibold text-surface-700 dark:text-surface-200">
            {{ isDragging ? 'Drop files here' : 'Click to upload or drag & drop' }}
          </p>
          <p class="text-xs text-surface-400 mt-1">
            {{ acceptLabel }} — max {{ maxSize }}MB per file
          </p>
        </div>
      </div>
    </div>

    <!-- Error -->
    <p v-if="uploadError" class="text-sm text-red-500 flex items-center gap-1.5">
      <i class="pi pi-exclamation-circle" /> {{ uploadError }}
    </p>

    <!-- Preview grid -->
    <div v-if="modelValue.length > 0" class="space-y-2">
      <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">
        Uploaded ({{ modelValue.length }})
      </p>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(file, index) in modelValue"
          :key="file.id"
          class="group relative overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 transition-shadow hover:shadow-md"
        >
          <!-- Thumbnail -->
          <div class="aspect-video w-full overflow-hidden bg-surface-100 dark:bg-surface-900">
            <img
              v-if="isImage(file.mimeType)"
              :src="file.url"
              :alt="file.originalName"
              class="h-full w-full object-cover"
            />
            <video
              v-else-if="isVideo(file.mimeType)"
              :src="file.url"
              class="h-full w-full object-cover"
              muted
            />
            <div v-else class="flex h-full items-center justify-center">
              <i class="pi pi-file text-3xl text-surface-400" />
            </div>
          </div>

          <!-- File info -->
          <div class="p-2.5">
            <p class="truncate text-xs font-medium text-surface-700 dark:text-surface-200" :title="file.originalName">
              {{ file.originalName }}
            </p>
            <p class="text-xs text-surface-400 mt-0.5">{{ formatSize(file.size) }}</p>
          </div>

          <!-- Remove button -->
          <button
            v-if="!disabled"
            type="button"
            class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600 shadow"
            @click.stop="removeFile(index)"
          >
            <i class="pi pi-times text-xs" />
          </button>

          <!-- Type badge -->
          <div class="absolute left-2 top-2">
            <span
              :class="[
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                isImage(file.mimeType)
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                  : isVideo(file.mimeType)
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
              ]"
            >
              <i
                :class="[
                  'text-[10px]',
                  isImage(file.mimeType) ? 'pi pi-image' : isVideo(file.mimeType) ? 'pi pi-video' : 'pi pi-file',
                ]"
              />
              {{ isImage(file.mimeType) ? 'image' : isVideo(file.mimeType) ? 'video' : 'file' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import api from '@/lib/api';

export interface UploadedMedia {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

const props = withDefaults(
  defineProps<{
    modelValue?: UploadedMedia[];
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // MB
    disabled?: boolean;
  }>(),
  {
    modelValue: () => [],
    accept: 'image/*',
    multiple: false,
    maxSize: 10,
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: UploadedMedia[]];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadError = ref('');

const acceptLabel = computed(() => {
  if (props.accept.includes('image') && props.accept.includes('video')) return 'Images & Videos';
  if (props.accept.includes('image')) return 'Images';
  if (props.accept.includes('video')) return 'Videos';
  return 'Files';
});

function isImage(mimeType: string) {
  return mimeType.startsWith('image/');
}
function isVideo(mimeType: string) {
  return mimeType.startsWith('video/');
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function openFilePicker() {
  if (!props.disabled && !isUploading.value) {
    fileInput.value?.click();
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files?.length) uploadFiles(Array.from(files));
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) uploadFiles(Array.from(target.files));
  target.value = '';
}

function validateFile(file: File): string | null {
  if (file.size > props.maxSize * 1024 * 1024) {
    return `"${file.name}" exceeds ${props.maxSize}MB limit`;
  }
  return null;
}

function removeFile(index: number) {
  const updated = props.modelValue.filter((_, i) => i !== index);
  emit('update:modelValue', updated);
}

async function uploadFiles(files: File[]) {
  uploadError.value = '';

  const valid: File[] = [];
  for (const f of files) {
    const err = validateFile(f);
    if (err) {
      uploadError.value = err;
      return;
    }
    valid.push(f);
  }
  if (!valid.length) return;

  isUploading.value = true;
  uploadProgress.value = 0;

  try {
    const formData = new FormData();
    let uploaded: UploadedMedia[] = [];

    if (props.multiple && valid.length > 1) {
      valid.forEach((f) => formData.append('files', f));
      const { data } = await api.post('/uploads/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          uploadProgress.value = Math.round((e.loaded / (e.total || 1)) * 100);
        },
      });
      uploaded = data.data as UploadedMedia[];
    } else {
      formData.append('file', valid[0]);
      const { data } = await api.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          uploadProgress.value = Math.round((e.loaded / (e.total || 1)) * 100);
        },
      });
      uploaded = [data.data as UploadedMedia];
    }

    const next = props.multiple ? [...props.modelValue, ...uploaded] : uploaded;
    emit('update:modelValue', next);
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    uploadError.value = axiosErr.response?.data?.message || 'Upload failed. Please try again.';
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
}
</script>
