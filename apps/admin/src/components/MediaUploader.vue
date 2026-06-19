<template>
  <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
    :class="{ 'border-blue-500 bg-blue-50': isDragging }"
  >
    <input ref="fileInput" type="file" :multiple="multiple" accept="image/*" class="hidden" @change="onFileSelect" />

    <div v-if="!uploading" class="space-y-3">
      <div class="text-gray-400 text-4xl">+</div>
      <p class="text-gray-500 text-sm">Drag & drop images here, or</p>
      <button @click="openFileDialog" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors">
        Browse Files
      </button>
    </div>

    <div v-else class="space-y-2">
      <div class="text-blue-600 text-sm">Uploading {{ uploadProgress }}...</div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-blue-600 h-2 rounded-full transition-all" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
    </div>

    <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '@/lib/api';

const props = defineProps<{ multiple?: boolean }>();
const emit = defineEmits<{ uploaded: [media: Record<string, unknown>[]] }>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const error = ref('');

function openFileDialog() {
  fileInput.value?.click();
}

function onDragOver() {
  isDragging.value = true;
}

function onDragLeave() {
  isDragging.value = false;
}

async function onDrop(e: DragEvent) {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files?.length) await uploadFiles(Array.from(files));
}

async function onFileSelect(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) await uploadFiles(Array.from(target.files));
  target.value = '';
}

async function uploadFiles(files: File[]) {
  error.value = '';
  uploading.value = true;
  uploadProgress.value = 0;

  try {
    const formData = new FormData();
    if (props.multiple) {
      files.forEach(f => formData.append('files', f));
      const { data } = await api.post('/uploads/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          uploadProgress.value = Math.round((e.loaded / (e.total || 1)) * 100);
        },
      });
      emit('uploaded', data.data);
    } else {
      formData.append('file', files[0]);
      const { data } = await api.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          uploadProgress.value = Math.round((e.loaded / (e.total || 1)) * 100);
        },
      });
      emit('uploaded', [data.data]);
    }
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Upload failed';
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
  }
}
</script>
