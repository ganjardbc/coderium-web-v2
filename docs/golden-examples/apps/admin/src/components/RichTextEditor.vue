<template>
  <div
    :class="[
      'rounded-xl border transition-colors overflow-hidden',
      focused
        ? 'border-primary ring-1 ring-primary/30'
        : 'border-surface-300 dark:border-surface-600',
    ]"
  >
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-0.5 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-2 py-1.5">
      <!-- Text format -->
      <ToolbarButton @click="exec('bold')" :active="states.bold" title="Bold">
        <i class="pi pi-bold text-xs" />
      </ToolbarButton>
      <ToolbarButton @click="exec('italic')" :active="states.italic" title="Italic">
        <i class="pi pi-italic text-xs" />
      </ToolbarButton>
      <ToolbarButton @click="exec('underline')" :active="states.underline" title="Underline">
        <span class="underline text-xs font-bold">U</span>
      </ToolbarButton>
      <ToolbarButton @click="exec('strikeThrough')" :active="states.strikeThrough" title="Strikethrough">
        <span class="line-through text-xs font-bold">S</span>
      </ToolbarButton>

      <Separator />

      <!-- Headings -->
      <ToolbarButton @click="formatBlock('H1')" :active="states.h1" title="Heading 1" class="px-2.5 text-xs font-bold">H1</ToolbarButton>
      <ToolbarButton @click="formatBlock('H2')" :active="states.h2" title="Heading 2" class="px-2.5 text-xs font-bold">H2</ToolbarButton>
      <ToolbarButton @click="formatBlock('H3')" :active="states.h3" title="Heading 3" class="px-2.5 text-xs font-bold">H3</ToolbarButton>

      <Separator />

      <!-- Lists -->
      <ToolbarButton @click="exec('insertUnorderedList')" :active="states.unorderedList" title="Bullet list">
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </ToolbarButton>
      <ToolbarButton @click="exec('insertOrderedList')" :active="states.orderedList" title="Numbered list">
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h1v4H3m0 4h1v4H3m4-16h14M7 12h14M7 20h14" />
        </svg>
      </ToolbarButton>
      <ToolbarButton @click="exec('formatBlock', 'blockquote')" :active="states.blockquote" title="Blockquote">
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 10.5H5.5a2 2 0 01-2-2v-1a2 2 0 012-2H8m0 5v5m8-5h-2.5a2 2 0 01-2-2v-1a2 2 0 012-2H16m0 5v5" />
        </svg>
      </ToolbarButton>

      <Separator />

      <!-- Link -->
      <ToolbarButton @click="insertLink" :active="states.link" title="Insert link">
        <i class="pi pi-link text-xs" />
      </ToolbarButton>

      <Separator />

      <!-- Undo / Redo -->
      <ToolbarButton @click="exec('undo')" title="Undo">
        <i class="pi pi-arrow-left text-xs" />
      </ToolbarButton>
      <ToolbarButton @click="exec('redo')" title="Redo">
        <i class="pi pi-arrow-right text-xs" />
      </ToolbarButton>
    </div>

    <!-- Content editable area -->
    <div
      ref="editorRef"
      contenteditable="true"
      :data-placeholder="placeholder"
      class="rich-editor-content min-h-[220px] p-4 text-sm text-surface-800 dark:text-surface-100 focus:outline-none bg-white dark:bg-surface-900"
      @focus="focused = true"
      @blur="onBlur"
      @input="onInput"
      @keyup="updateStates"
      @mouseup="updateStates"
      @keydown="onKeyDown"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineComponent, h } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
  }>(),
  {
    modelValue: '',
    placeholder: 'Write your content here…',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// ─── Sub-components ───────────────────────────────────────────────────────────

const ToolbarButton = defineComponent({
  props: { active: Boolean, title: String },
  setup(props, { slots }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          title: props.title,
          class: [
            'flex h-7 min-w-[28px] items-center justify-center rounded-lg px-1.5 text-surface-600 dark:text-surface-300 transition-colors',
            props.active
              ? 'bg-primary/15 text-primary'
              : 'hover:bg-surface-200 dark:hover:bg-surface-700',
          ],
        },
        slots.default?.(),
      );
  },
});

const Separator = defineComponent({
  setup() {
    return () => h('div', { class: 'mx-1 h-5 w-px bg-surface-200 dark:bg-surface-700' });
  },
});

// ─── State ────────────────────────────────────────────────────────────────────

const editorRef = ref<HTMLDivElement | null>(null);
const focused = ref(false);

const states = ref({
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  h1: false,
  h2: false,
  h3: false,
  unorderedList: false,
  orderedList: false,
  blockquote: false,
  link: false,
});

// ─── Init / sync ─────────────────────────────────────────────────────────────

onMounted(() => {
  if (editorRef.value && props.modelValue) {
    editorRef.value.innerHTML = props.modelValue;
  }
  document.execCommand('defaultParagraphSeparator', false, 'p');
});

watch(
  () => props.modelValue,
  (val) => {
    if (!editorRef.value) return;
    const current = editorRef.value.innerHTML;
    if (current !== val) {
      editorRef.value.innerHTML = val ?? '';
    }
  },
);

// ─── Commands ─────────────────────────────────────────────────────────────────

function exec(command: string, value?: string) {
  editorRef.value?.focus();
  document.execCommand(command, false, value);
  onInput();
  updateStates();
}

function formatBlock(tag: string) {
  exec('formatBlock', tag);
}

function insertLink() {
  const selection = window.getSelection();
  const selectedText = selection?.toString() || '';
  const url = window.prompt('Enter URL:', 'https://');
  if (url) {
    const text = selectedText || url;
    exec('insertHTML', `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`);
  }
}

function updateStates() {
  states.value = {
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline'),
    strikeThrough: document.queryCommandState('strikeThrough'),
    h1: document.queryCommandValue('formatBlock') === 'h1',
    h2: document.queryCommandValue('formatBlock') === 'h2',
    h3: document.queryCommandValue('formatBlock') === 'h3',
    unorderedList: document.queryCommandState('insertUnorderedList'),
    orderedList: document.queryCommandState('insertOrderedList'),
    blockquote: document.queryCommandValue('formatBlock') === 'blockquote',
    link: document.queryCommandState('createLink'),
  };
}

function onInput() {
  const html = editorRef.value?.innerHTML ?? '';
  // Emit empty string when only placeholder content remains
  emit('update:modelValue', html === '<br>' ? '' : html);
}

function onBlur() {
  focused.value = false;
  onInput();
}

function onKeyDown(e: KeyboardEvent) {
  // Tab → insert spaces instead of moving focus
  if (e.key === 'Tab') {
    e.preventDefault();
    exec('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
  }
}
</script>

<style scoped>
.rich-editor-content:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}

/* Prose styles inside the contenteditable */
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
</style>
