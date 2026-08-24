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
      :class="showError(index)
        ? 'border-red-400 bg-red-50/50 dark:bg-red-900/10'
        : 'border-surface-200 dark:border-surface-700'"
    >
      <div class="flex items-start gap-2">
        <span class="mt-2.5 text-xs text-surface-400 font-mono w-5 shrink-0">{{ index + 1 }}.</span>
        <div class="flex-1 space-y-2 min-w-0">
          <InputText
            v-model="item.title"
            :placeholder="`${itemLabel} title`"
            class="w-full"
            :class="showError(index) ? 'p-invalid' : ''"
            @blur="touch(index)"
          />
          <p v-if="showError(index)" class="text-xs text-red-500">Title is required</p>
          <Textarea
            v-model="item.description"
            placeholder="Description (optional)"
            rows="2"
            class="w-full"
          />
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

<script setup lang="ts">
import { reactive } from 'vue';
import { InputText, Textarea, Button } from 'primevue';

interface RepeatableListItem {
  title: string;
  description?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: RepeatableListItem[];
    label: string;
    itemLabel?: string;
    /** When true (e.g. after a failed publish attempt), show validation
     * errors for every row regardless of whether it has been blurred yet. */
    forceValidate?: boolean;
  }>(),
  {
    itemLabel: 'Item',
    forceValidate: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: RepeatableListItem[]];
}>();

// Rows the user has already interacted with (blurred the title field on).
// Errors for a row are only shown once it's touched or forceValidate is set,
// so we never flash a red border before the user has had a chance to type.
const touched = reactive(new Set<number>());

function touch(index: number) {
  touched.add(index);
}

function showError(index: number): boolean {
  const item = props.modelValue[index];
  const isEmpty = !item || !item.title || item.title.trim() === '';
  return isEmpty && (touched.has(index) || props.forceValidate);
}

function addItem() {
  emit('update:modelValue', [...props.modelValue, { title: '', description: '' }]);
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
