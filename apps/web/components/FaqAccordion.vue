<template>
  <div class="divide-y divide-gray-100 dark:divide-gray-800 border-y border-gray-100 dark:border-gray-800">
    <div v-for="(item, index) in items" :key="index">
      <h3>
        <button
          :id="`${uid}-q-${index}`"
          type="button"
          class="w-full min-h-11 py-3 md:py-4 flex items-center justify-between gap-4 text-left text-base font-bold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          :aria-expanded="isOpen(index)"
          :aria-controls="`${uid}-a-${index}`"
          @click="toggle(index)"
        >
          <span class="min-w-0">{{ item.question }}</span>
          <Icon
            name="lucide:chevron-down"
            class="w-5 h-5 shrink-0 text-gray-400 dark:text-gray-500 transition-transform"
            :class="isOpen(index) ? 'rotate-180' : ''"
            aria-hidden="true"
          />
        </button>
      </h3>
      <!-- v-show (not v-if) keeps every answer in the SSR HTML. -->
      <div
        v-show="isOpen(index)"
        :id="`${uid}-a-${index}`"
        role="region"
        :aria-labelledby="`${uid}-q-${index}`"
        class="pb-4 md:pb-5 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line"
      >
        {{ item.answer }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useId } from 'vue';
import type { ProductFaqItem } from '@coderium/shared-types';

defineProps<{
  items: ProductFaqItem[];
}>();

const uid = useId();
const open = ref(new Set<number>());

function isOpen(index: number): boolean {
  return open.value.has(index);
}

function toggle(index: number) {
  const next = new Set(open.value);
  if (next.has(index)) next.delete(index);
  else next.add(index);
  open.value = next;
}
</script>
