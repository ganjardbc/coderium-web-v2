<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Banner: publish validation failure -->
    <div v-if="bannerFields.length > 0" class="lg:col-span-3">
      <Message severity="error" size="small">
        <p class="font-semibold">Publish failed — please complete the following:</p>
        <ul class="list-disc list-inside mt-1 text-sm">
          <li v-for="f in bannerFields" :key="f">{{ fieldLabel(f) }}</li>
        </ul>
      </Message>
    </div>

    <!-- Generic error (network / create failure not tied to specific fields) -->
    <div v-else-if="errorMessage" class="lg:col-span-3">
      <Message severity="error" size="small">{{ errorMessage }}</Message>
    </div>

    <!-- ── Main column ────────────────────────────────────────── -->
    <div class="lg:col-span-2 space-y-5">
      <FormField label="Name" required>
        <InputText
          id="product-name"
          v-model="form.name"
          placeholder="Product name"
          class="w-full"
        />
      </FormField>

      <FormField label="Slug" hint="Auto-generated from name — you can edit it manually">
        <InputText
          id="product-slug"
          v-model="form.slug"
          placeholder="product-slug"
          class="w-full"
          @input="onSlugInput"
        />
      </FormField>

      <FormField label="Tagline">
        <InputText
          id="product-tagline"
          v-model="form.tagline"
          placeholder="Short one-line pitch"
          class="w-full"
        />
      </FormField>

      <FormField label="Description">
        <RichTextEditor v-model="form.description" placeholder="Describe the product…" />
      </FormField>

      <FormField label="Cover" :invalid="isInvalid('cover')" hint="Cover image is required to publish">
        <MediaUploader v-model="form.cover" accept="image/*" :multiple="false" :max-size="10" />
      </FormField>

      <FormField
        label="Pipeline Steps"
        :invalid="isInvalid('pipelineSteps')"
        hint="At least 1 pipeline step is required to publish"
      >
        <RepeatableListField
          v-model="form.pipelineSteps"
          label="Pipeline Steps"
          item-label="Step"
          :force-validate="forceValidateLists"
        />
      </FormField>

      <FormField
        label="Features"
        :invalid="isInvalid('features')"
        hint="At least 1 feature is required to publish"
      >
        <RepeatableListField
          v-model="form.features"
          label="Features"
          item-label="Feature"
          :force-validate="forceValidateLists"
        />
      </FormField>

      <FormField label="CTA Label">
        <InputText
          id="product-cta-label"
          v-model="form.ctaLabel"
          placeholder="e.g. Get Started"
          class="w-full"
        />
      </FormField>

      <FormField
        label="CTA URL"
        :invalid="isInvalid('ctaUrl')"
        hint="Must be a valid URL (e.g. https://example.com) to publish"
      >
        <InputText
          id="product-cta-url"
          v-model="form.ctaUrl"
          placeholder="https://example.com"
          class="w-full"
        />
        <p v-if="ctaUrlLooksInvalid" class="text-xs text-red-500 mt-1">
          This doesn't look like a valid URL.
        </p>
      </FormField>
    </div>

    <!-- ── Sidebar ────────────────────────────────────────────── -->
    <div class="space-y-5">
      <SidebarCard label="Ordering" icon="pi-sort-numeric-up">
        <InputNumber
          id="product-order"
          v-model="form.order"
          show-buttons
          button-layout="horizontal"
          class="w-full"
        />
        <p class="text-xs text-surface-400 mt-1.5">Lower numbers appear first (default sort).</p>
      </SidebarCard>

      <SidebarCard label="Settings" icon="pi-cog">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-surface-700 dark:text-surface-200">Featured</p>
            <p class="text-xs text-surface-400">Highlight this product</p>
          </div>
          <ToggleSwitch v-model="form.featured" id="product-featured" />
        </div>
      </SidebarCard>

      <!-- Actions -->
      <div class="flex flex-col gap-2">
        <Button
          type="button"
          label="Save & Publish"
          icon="pi pi-send"
          :loading="loading"
          class="w-full justify-center"
          @click="emit('submit-publish')"
        />
        <Button
          type="button"
          label="Save as Draft"
          severity="secondary"
          outlined
          :loading="loading"
          class="w-full justify-center"
          @click="emit('submit-draft')"
        />
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          text
          class="w-full justify-center"
          @click="$router.push(cancelTo)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, defineComponent, h } from 'vue';
import {
  InputText,
  InputNumber,
  ToggleSwitch,
  Button,
  Message,
} from 'primevue';
import RichTextEditor from '@/components/RichTextEditor.vue';
import MediaUploader from '@/components/MediaUploader.vue';
import RepeatableListField from '@/components/RepeatableListField.vue';
import type { ProductFormData } from '../stores/product.store';
import { PUBLISH_FIELD_LABELS } from '../stores/product.store';

const props = withDefaults(
  defineProps<{
    form: ProductFormData;
    loading?: boolean;
    /** Field keys (from the 400 publish-validation error `fields` array)
     * that are currently failing validation — used for the banner + field
     * highlight. */
    bannerFields?: string[];
    /** Generic error message shown when the failure isn't a structured
     * publish-validation error (e.g. network error, create failure). */
    errorMessage?: string;
    /** Forces RepeatableListField rows to show validation state even
     * before the user has blurred them — set true after a failed publish
     * attempt. */
    forceValidateLists?: boolean;
    /** Auto-sync the slug field from `name` as the user types, as long as
     * they haven't manually edited slug yet. Disabled on edit pages so
     * touching the name field doesn't silently change an existing
     * product's URL. */
    autoSlug?: boolean;
    cancelTo?: string;
  }>(),
  {
    loading: false,
    bannerFields: () => [],
    errorMessage: '',
    forceValidateLists: false,
    autoSlug: true,
    cancelTo: '/products',
  },
);

const emit = defineEmits<{
  'submit-draft': [];
  'submit-publish': [];
}>();

// ─── Sub-components ───────────────────────────────────────────────────────────

const FormField = defineComponent({
  props: { label: String, required: Boolean, invalid: Boolean, hint: String },
  setup(fieldProps, { slots }) {
    return () =>
      h(
        'div',
        {
          class: [
            'flex flex-col gap-1.5 rounded-lg transition-colors',
            fieldProps.invalid ? 'ring-1 ring-red-400 bg-red-50/40 dark:bg-red-900/10 p-2 -m-2' : '',
          ],
        },
        [
          h(
            'label',
            { class: 'text-sm font-semibold text-surface-700 dark:text-surface-300' },
            [
              fieldProps.label,
              fieldProps.required ? h('span', { class: 'text-red-500 ml-0.5' }, '*') : null,
            ],
          ),
          slots.default?.(),
          fieldProps.hint
            ? h(
                'p',
                { class: fieldProps.invalid ? 'text-xs text-red-500' : 'text-xs text-surface-400' },
                fieldProps.hint,
              )
            : null,
        ],
      );
  },
});

const SidebarCard = defineComponent({
  props: { label: String, icon: String },
  setup(cardProps, { slots }) {
    return () =>
      h('div', { class: 'rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden' }, [
        h('div', { class: 'flex items-center gap-2 px-4 py-2.5 bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700' }, [
          h('i', { class: `pi ${cardProps.icon} text-primary text-sm` }),
          h('span', { class: 'text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wider' }, cardProps.label),
        ]),
        h('div', { class: 'p-4 bg-white dark:bg-surface-900' }, slots.default?.()),
      ]);
  },
});

// ─── Setup ────────────────────────────────────────────────────────────────────

// `form` is a shared reactive object owned by the parent (create.vue /
// edit.vue). Fields are bound directly (v-model="form.xxx") and mutate it
// in place — since it's the same reactive reference the parent holds,
// changes propagate without needing to emit an update event for every
// keystroke. Structural changes to array fields (pipelineSteps/features)
// still go through RepeatableListField's own v-model, which mutates
// form.pipelineSteps/form.features by reassigning the array.
const form = computed(() => props.form);

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const slugTouched = ref(false);
function onSlugInput() {
  slugTouched.value = true;
}

watch(
  () => props.form.name,
  (name) => {
    if (props.autoSlug && !slugTouched.value) {
      props.form.slug = slugify(name);
    }
  },
);

function isInvalid(key: string): boolean {
  return props.bannerFields.includes(key);
}

function fieldLabel(key: string): string {
  return PUBLISH_FIELD_LABELS[key] ?? key;
}

const ctaUrlLooksInvalid = computed(() => {
  const value = props.form.ctaUrl;
  if (!value) return false;
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return false;
  } catch {
    return true;
  }
});
</script>
