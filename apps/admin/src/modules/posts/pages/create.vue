<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">
          New {{ typeLabel }}
        </h1>
        <p class="text-sm text-surface-400 mt-0.5">Create and publish new content</p>
      </div>
      <router-link to="/posts" class="flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary transition-colors">
        <i class="pi pi-arrow-left text-xs" />
        Back to Posts
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- ── Main column ────────────────────────────────────────── -->
      <div class="lg:col-span-2 space-y-5">
        <!-- Title -->
        <FormField label="Title" required>
          <InputText
            id="post-title"
            v-model="form.title"
            required
            placeholder="Give your post a compelling title"
            class="w-full"
          />
        </FormField>

        <!-- Subtitle -->
        <FormField label="Subtitle">
          <InputText
            id="post-subtitle"
            v-model="form.subtitle"
            placeholder="A brief summary or teaser"
            class="w-full"
          />
        </FormField>

        <!-- Content (article only) -->
        <FormField v-if="form.type === 'article'" label="Content">
          <RichTextEditor
            v-model="form.content"
            placeholder="Write your article content here…"
          />
        </FormField>

        <!-- Media section (carousel / video / stack_gallery) -->
        <FormField v-if="showMediaField" :label="mediaFieldLabel">
          <MediaUploader
            v-model="form.media"
            :accept="mediaAccept"
            :multiple="mediaMultiple"
            :max-size="50"
          />
          <p class="text-xs text-surface-400 mt-1.5">{{ mediaHint }}</p>
        </FormField>

        <!-- SEO -->
        <div class="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <button
            type="button"
            class="flex w-full items-center justify-between px-4 py-3 bg-surface-50 dark:bg-surface-800 text-sm font-semibold text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-colors"
            @click="seoOpen = !seoOpen"
          >
            <span class="flex items-center gap-2">
              <i class="pi pi-search text-primary" />
              SEO Settings
            </span>
            <i :class="['pi text-surface-400 transition-transform', seoOpen ? 'pi-angle-up' : 'pi-angle-down']" />
          </button>
          <div v-if="seoOpen" class="p-4 space-y-4 bg-white dark:bg-surface-900">
            <FormField label="Meta Description">
              <Textarea
                id="post-meta-desc"
                v-model="form.metaDescription"
                rows="3"
                placeholder="Short description for search engines (150–160 chars)"
                class="w-full"
              />
              <p class="text-xs text-surface-400 mt-1">{{ (form.metaDescription || '').length }}/160 characters</p>
            </FormField>
            <FormField label="Meta Keywords">
              <InputText
                id="post-meta-keywords"
                v-model="form.metaKeywords"
                placeholder="keyword1, keyword2, keyword3"
                class="w-full"
              />
            </FormField>
          </div>
        </div>
      </div>

      <!-- ── Sidebar ────────────────────────────────────────────── -->
      <div class="space-y-5">
        <!-- Post Type -->
        <SidebarCard label="Post Type" icon="pi-tag">
          <Select
            id="post-type"
            v-model="form.type"
            :options="typeOptions"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </SidebarCard>

        <!-- Cover Image -->
        <SidebarCard label="Cover Image" icon="pi-image">
          <MediaUploader
            v-model="form.cover"
            accept="image/*"
            :multiple="false"
            :max-size="10"
          />
        </SidebarCard>

        <!-- Tags -->
        <SidebarCard label="Tags" icon="pi-hashtag">
          <InputChips
            id="post-tags"
            v-model="form.tags"
            placeholder="Add tag, press Enter"
            class="w-full"
          />
          <p class="text-xs text-surface-400 mt-1.5">Press Enter to add each tag</p>
        </SidebarCard>

        <!-- Publish Settings -->
        <SidebarCard label="Settings" icon="pi-cog">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-surface-700 dark:text-surface-200">Publish immediately</p>
              <p class="text-xs text-surface-400">Make this post public</p>
            </div>
            <ToggleSwitch v-model="form.isPublished" id="post-published" />
          </div>
        </SidebarCard>

        <!-- Error -->
        <Message v-if="error" severity="error" size="small" variant="simple">
          {{ error }}
        </Message>

        <!-- Actions -->
        <div class="flex flex-col gap-2">
          <Button
            type="submit"
            :label="form.isPublished ? 'Publish Post' : 'Save as Draft'"
            icon="pi pi-check"
            :loading="loading"
            class="w-full justify-center"
          />
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            outlined
            class="w-full justify-center"
            @click="$router.push('/posts')"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  InputText,
  Textarea,
  Select,
  InputChips,
  Button,
  Message,
  ToggleSwitch,
} from 'primevue';
import { usePostStore } from '@/modules/posts/stores/post.store';
import MediaUploader from '@/components/MediaUploader.vue';
import type { UploadedMedia } from '@/components/MediaUploader.vue';
import RichTextEditor from '@/components/RichTextEditor.vue';

// ─── Sub-components ───────────────────────────────────────────────────────────

const FormField = defineComponent({
  props: { label: String, required: Boolean },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'flex flex-col gap-1.5' }, [
        h('label', {
          class: 'text-sm font-semibold text-surface-700 dark:text-surface-300',
        }, [
          props.label,
          props.required ? h('span', { class: 'text-red-500 ml-0.5' }, '*') : null,
        ]),
        slots.default?.(),
      ]);
  },
});

const SidebarCard = defineComponent({
  props: { label: String, icon: String },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden' }, [
        h('div', { class: 'flex items-center gap-2 px-4 py-2.5 bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700' }, [
          h('i', { class: `pi ${props.icon} text-primary text-sm` }),
          h('span', { class: 'text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wider' }, props.label),
        ]),
        h('div', { class: 'p-4 bg-white dark:bg-surface-900' }, slots.default?.()),
      ]);
  },
});

// ─── Setup ────────────────────────────────────────────────────────────────────

const router = useRouter();
const route = useRoute();
const postsStore = usePostStore();

const typeOptions = [
  { label: 'Article', value: 'article' },
  { label: 'Carousel', value: 'carousel' },
  { label: 'Video', value: 'video' },
  { label: 'Stack Gallery', value: 'stack_gallery' },
];

const typeLabels: Record<string, string> = {
  article: 'Article',
  carousel: 'Carousel',
  video: 'Video',
  stack_gallery: 'Stack Gallery',
};

const typeParam = computed(() => (route.query.type as string) || 'article');
const typeLabel = computed(() => typeLabels[form.value.type] || form.value.type);

const form = ref({
  title: '',
  subtitle: '',
  content: '',
  type: typeParam.value,
  cover: [] as UploadedMedia[],
  tags: [] as string[],
  media: [] as UploadedMedia[],
  isPublished: false,
  metaDescription: '',
  metaKeywords: '',
});

const loading = ref(false);
const error = ref('');
const seoOpen = ref(false);

const showMediaField = computed(() =>
  ['carousel', 'video', 'stack_gallery'].includes(form.value.type),
);
const mediaAccept = computed(() => {
  if (form.value.type === 'video') return 'video/*';
  return 'image/*';
});
const mediaMultiple = computed(() =>
  ['carousel', 'stack_gallery'].includes(form.value.type),
);
const mediaFieldLabel = computed(() => {
  if (form.value.type === 'carousel') return 'Carousel Images';
  if (form.value.type === 'video') return 'Video File';
  return 'Stack Gallery Images';
});
const mediaHint = computed(() => {
  if (form.value.type === 'carousel') return 'Upload multiple images for the carousel';
  if (form.value.type === 'video') return 'Upload your video file (max 50MB)';
  return 'Upload multiple images for the stack gallery';
});

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    const payload = {
      title: form.value.title,
      subtitle: form.value.subtitle || undefined,
      content: form.value.content || undefined,
      type: form.value.type,
      cover: form.value.cover.length > 0 ? form.value.cover[0].url : undefined,
      tags: form.value.tags.length ? form.value.tags : undefined,
      mediaIds: form.value.media.map((m) => m.id),
      isPublished: form.value.isPublished,
      metaDescription: form.value.metaDescription || undefined,
      metaKeywords: form.value.metaKeywords || undefined,
    };
    await postsStore.createPost(payload);
    router.push('/posts');
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Failed to create post';
  } finally {
    loading.value = false;
  }
}
</script>
