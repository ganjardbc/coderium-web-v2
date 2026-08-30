<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <!-- Loading state -->
    <div v-if="status === 'loading'" class="flex flex-col items-center justify-center gap-4 py-24">
      <ProgressSpinner style="width: 48px; height: 48px" strokeWidth="4" />
      <p class="text-sm text-surface-500 dark:text-surface-400">{{ loadingMessage }}</p>
      <Button label="Batal" severity="secondary" outlined size="small" @click="handleCancel" />
    </div>

    <!-- Error state -->
    <div v-else-if="status === 'error'" class="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <i class="pi pi-exclamation-triangle text-4xl text-red-400" />
      <p class="text-sm text-surface-600 dark:text-surface-300 max-w-md">
        {{ errorMessage || 'Terjadi kesalahan saat membuat artikel. Silakan coba lagi.' }}
      </p>
      <div class="flex gap-2">
        <Button label="Coba Lagi" icon="pi pi-refresh" @click="generateArticle" />
        <Button label="Kembali" severity="secondary" outlined @click="handleCancel" />
      </div>
    </div>

    <!-- Preview state -->
    <div v-else-if="status === 'preview' && preview" class="space-y-5">
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Preview Article</h1>
        <Button label="Generate Ulang" icon="pi pi-refresh" severity="secondary" outlined size="small" @click="generateArticle" />
      </div>

      <Message severity="warn" size="small" variant="simple">
        Hasil ini belum disimpan — refresh atau tinggalkan halaman akan menghapusnya.
      </Message>

      <!-- Cover -->
      <div class="relative rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-800 aspect-video flex items-center justify-center">
        <img
          v-if="!coverLoadError"
          :src="preview.coverUrl"
          alt="Cover candidate"
          class="w-full h-full object-cover"
          @error="coverLoadError = true"
        />
        <div v-else class="flex flex-col items-center gap-2 text-surface-400">
          <i class="pi pi-image text-3xl" />
          <span class="text-xs">Preview cover tidak tersedia</span>
        </div>
        <span class="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white">
          dari sumber eksternal
        </span>
      </div>

      <!-- Title -->
      <h2 class="text-xl font-semibold text-surface-900 dark:text-surface-50">{{ preview.title }}</h2>

      <!-- Source link -->
      <a
        v-if="preview.sourceUrl"
        :href="preview.sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
      >
        <i class="pi pi-external-link text-[10px]" />
        {{ preview.sourceUrl }}
      </a>

      <!-- Content (read-only, reuse RichTextEditor prose styling) -->
      <div class="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-4">
        <div class="rich-editor-content text-sm text-surface-800 dark:text-surface-100" v-html="preview.content" />
      </div>

      <!-- Commit error -->
      <Message v-if="commitError" severity="error" size="small" variant="simple">
        {{ commitError }}
      </Message>

      <!-- Commit actions -->
      <div class="flex items-center justify-between gap-3 pt-2">
        <Button
          label="Save as Draft"
          severity="secondary"
          outlined
          :loading="committing"
          :disabled="committing"
          @click="handleCommit(false)"
        />
        <Button
          label="Publish Post"
          icon="pi pi-check"
          :loading="committing"
          :disabled="committing"
          @click="handleCommit(true)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { Button, Message, ProgressSpinner } from 'primevue';
import { storeToRefs } from 'pinia';
import { useAiContentStore } from '@/modules/ai-agent/stores/ai-content.store';

const router = useRouter();
const store = useAiContentStore();
const { preview, status, errorMessage, committing, commitError } = storeToRefs(store);

const coverLoadError = ref(false);

// ─── Loading state cosmetic copy (frontend-only, not tied to real backend progress) ───

const loadingMessages = [
  'Mencari artikel trending...',
  'Menulis ulang artikel dalam Bahasa Indonesia...',
];
const loadingMessageIndex = ref(0);
const loadingMessage = computed(() => loadingMessages[loadingMessageIndex.value]);
let loadingMessageTimer: ReturnType<typeof setTimeout> | null = null;

function startLoadingMessageCycle() {
  loadingMessageIndex.value = 0;
  clearLoadingMessageCycle();
  loadingMessageTimer = setTimeout(() => {
    loadingMessageIndex.value = 1;
  }, 4000);
}

function clearLoadingMessageCycle() {
  if (loadingMessageTimer) {
    clearTimeout(loadingMessageTimer);
    loadingMessageTimer = null;
  }
}

watch(status, (value) => {
  if (value === 'loading') {
    startLoadingMessageCycle();
  } else {
    clearLoadingMessageCycle();
  }
});

async function generateArticle() {
  coverLoadError.value = false;
  await store.generateArticle();
}

onMounted(() => {
  if (status.value === 'idle') {
    generateArticle();
  } else if (status.value === 'loading') {
    startLoadingMessageCycle();
  }
});

onBeforeUnmount(() => {
  clearLoadingMessageCycle();
});

function handleCancel() {
  store.reset();
  router.push('/ai-agent');
}

async function handleCommit(isPublished: boolean) {
  const post = await store.commitPost(isPublished);
  if (post) {
    router.push(`/posts/${post.slug}/edit`);
  }
}

// ─── Leave-confirmation guard (only while a not-yet-committed preview exists) ───

const LEAVE_CONFIRM_MESSAGE = 'Yakin ingin meninggalkan halaman ini? Hasil generate akan hilang.';

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (status.value === 'preview') {
    e.preventDefault();
    e.returnValue = '';
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

onBeforeRouteLeave(() => {
  if (status.value === 'preview') {
    return window.confirm(LEAVE_CONFIRM_MESSAGE);
  }
  return true;
});
</script>

<style scoped>
/* Reused (duplicated) from RichTextEditor.vue's `.rich-editor-content` prose
   styles — scoped styles cannot be shared across components, so this block is
   kept in sync manually for the read-only preview rendering here. */
.rich-editor-content :deep(h1) {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0.75rem 0 0.5rem;
  line-height: 1.2;
}
.rich-editor-content :deep(h2) {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0.75rem 0 0.5rem;
}
.rich-editor-content :deep(h3) {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0.5rem 0 0.4rem;
}
.rich-editor-content :deep(p) {
  margin: 0.4rem 0;
}
.rich-editor-content :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}
.rich-editor-content :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}
.rich-editor-content :deep(blockquote) {
  border-left: 3px solid var(--p-primary-color, #6366f1);
  padding-left: 1rem;
  margin: 0.75rem 0;
  font-style: italic;
  color: #6b7280;
}
.rich-editor-content :deep(a) {
  color: var(--p-primary-color, #6366f1);
  text-decoration: underline;
}
.rich-editor-content :deep(li) {
  margin-bottom: 0.25rem;
}
.rich-editor-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--p-surface-300, #d1d5db);
  margin: 1rem 0;
}
.rich-editor-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 0.5rem 0;
}
.rich-editor-content :deep(code) {
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 4px;
  border-radius: 3px;
}
.rich-editor-content :deep(pre) {
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
  background: rgba(0, 0, 0, 0.06);
  padding: 0.75rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0.5rem 0;
}
.rich-editor-content :deep(pre code) {
  background: none;
  padding: 0;
}
</style>
