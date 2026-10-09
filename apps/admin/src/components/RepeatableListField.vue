<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="text-sm font-semibold text-surface-700 dark:text-surface-300">
        {{ label }}
      </label>
      <Button
        type="button"
        size="small"
        text
        icon="pi pi-plus"
        :label="`Add ${itemLabel}`"
        :disabled="maxItems !== undefined && modelValue.length >= maxItems"
        @click="addItem"
      />
    </div>

    <p v-if="modelValue.length === 0" class="text-xs text-surface-400 italic">
      No {{ itemLabel.toLowerCase() }} yet. Click "Add {{ itemLabel }}" to add one.
    </p>

    <div
      v-for="(item, index) in modelValue"
      :key="index"
      class="rounded-lg border p-3 space-y-2 transition-colors"
      :class="showError(index) || showDescriptionError(index)
        ? 'border-red-400 bg-red-50/50 dark:bg-red-900/10'
        : 'border-surface-200 dark:border-surface-700'"
    >
      <div class="flex items-start gap-2">
        <span class="mt-2.5 text-xs text-surface-400 font-mono w-5 shrink-0">{{ index + 1 }}.</span>
        <div class="flex-1 space-y-2 min-w-0">
          <InputText
            :model-value="fieldValue(item, titleKey)"
            :placeholder="titlePlaceholder ?? `${itemLabel} title`"
            :maxlength="titleMaxlength"
            :aria-label="`${itemLabel} ${index + 1} ${titleLabel}`"
            class="w-full"
            :class="showError(index) ? 'p-invalid' : ''"
            @update:model-value="setField(index, titleKey, $event)"
            @blur="touch(index)"
          />
          <p v-if="showError(index)" class="text-xs text-red-500">{{ titleLabel }} is required</p>
          <Textarea
            v-if="descriptionMultiline"
            :model-value="fieldValue(item, descriptionKey)"
            :placeholder="resolvedDescriptionPlaceholder"
            :maxlength="descriptionMaxlength"
            :aria-label="`${itemLabel} ${index + 1} ${descriptionLabel}`"
            rows="2"
            class="w-full"
            :class="showDescriptionError(index) ? 'p-invalid' : ''"
            @update:model-value="setField(index, descriptionKey, $event)"
            @blur="touch(index)"
          />
          <InputText
            v-else
            :model-value="fieldValue(item, descriptionKey)"
            :placeholder="resolvedDescriptionPlaceholder"
            :maxlength="descriptionMaxlength"
            :aria-label="`${itemLabel} ${index + 1} ${descriptionLabel}`"
            class="w-full"
            :class="showDescriptionError(index) ? 'p-invalid' : ''"
            @update:model-value="setField(index, descriptionKey, $event)"
            @blur="touch(index)"
          />
          <p v-if="showDescriptionError(index)" class="text-xs text-red-500">
            {{ descriptionLabel }} is required
          </p>
        </div>
        <div class="flex flex-col gap-1 shrink-0">
          <Button
            type="button"
            icon="pi pi-chevron-up"
            text
            size="small"
            :disabled="index === 0"
            title="Move up"
            @click="moveUp(index)"
          />
          <Button
            type="button"
            icon="pi pi-chevron-down"
            text
            size="small"
            :disabled="index === modelValue.length - 1"
            title="Move down"
            @click="moveDown(index)"
          />
          <Button
            type="button"
            icon="pi pi-trash"
            text
            size="small"
            severity="danger"
            title="Remove"
            @click="removeItem(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends object">
import { computed, reactive } from 'vue';
import { InputText, Textarea, Button } from 'primevue';

const props = withDefaults(
  defineProps<{
    modelValue: T[];
    label: string;
    itemLabel?: string;
    /** Item property bound to the first (always required) input. */
    titleKey?: string;
    /** Item property bound to the second input. */
    descriptionKey?: string;
    /** Names used in the "… is required" messages and aria-labels. */
    titleLabel?: string;
    descriptionLabel?: string;
    titlePlaceholder?: string;
    descriptionPlaceholder?: string;
    /** When true the second input must be filled too. */
    descriptionRequired?: boolean;
    /** Textarea (default) or a single-line input for the second field. */
    descriptionMultiline?: boolean;
    titleMaxlength?: number;
    descriptionMaxlength?: number;
    /** Disables "Add" once this many rows exist. */
    maxItems?: number;
    /** When true (e.g. after a failed publish attempt), show validation
     * errors for every row regardless of whether it has been blurred yet. */
    forceValidate?: boolean;
  }>(),
  {
    itemLabel: 'Item',
    titleKey: 'title',
    descriptionKey: 'description',
    titleLabel: 'Title',
    descriptionLabel: 'Description',
    titlePlaceholder: undefined,
    descriptionPlaceholder: undefined,
    descriptionRequired: false,
    descriptionMultiline: true,
    titleMaxlength: undefined,
    descriptionMaxlength: undefined,
    maxItems: undefined,
    forceValidate: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: T[]];
}>();

const resolvedDescriptionPlaceholder = computed(
  () =>
    props.descriptionPlaceholder ??
    (props.descriptionRequired
      ? props.descriptionLabel
      : `${props.descriptionLabel} (optional)`),
);

// Rows are edited through string keys (titleKey/descriptionKey) so the same
// component can serve { title, description }, { label, value }, etc.
function fieldValue(item: T | undefined, key: string): string {
  const value = (item as Record<string, unknown> | undefined)?.[key];
  return typeof value === 'string' ? value : '';
}

function setField(index: number, key: string, value: string | undefined) {
  const next = [...props.modelValue];
  next[index] = { ...next[index], [key]: value ?? '' };
  emit('update:modelValue', next);
}

function isBlank(index: number, key: string): boolean {
  return fieldValue(props.modelValue[index], key).trim() === '';
}

// Rows the user has already interacted with (blurred the title field on).
// Errors for a row are only shown once it's touched or forceValidate is set,
// so we never flash a red border before the user has had a chance to type.
const touched = reactive(new Set<number>());

function touch(index: number) {
  touched.add(index);
}

function showError(index: number): boolean {
  return isBlank(index, props.titleKey) && (touched.has(index) || props.forceValidate);
}

function showDescriptionError(index: number): boolean {
  return (
    props.descriptionRequired &&
    isBlank(index, props.descriptionKey) &&
    (touched.has(index) || props.forceValidate)
  );
}

function addItem() {
  const empty = { [props.titleKey]: '', [props.descriptionKey]: '' } as T;
  emit('update:modelValue', [...props.modelValue, empty]);
}

function removeItem(index: number) {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index));
}

function moveUp(index: number) {
  if (index === 0) return;
  const next = [...props.modelValue];
  [next[index - 1], next[index]] = [next[index], next[index - 1]];
  emit('update:modelValue', next);
}

function moveDown(index: number) {
  if (index === props.modelValue.length - 1) return;
  const next = [...props.modelValue];
  [next[index + 1], next[index]] = [next[index], next[index + 1]];
  emit('update:modelValue', next);
}
</script>
