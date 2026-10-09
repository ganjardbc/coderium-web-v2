<template>
  <div class="flex items-baseline gap-3 mb-6 md:mb-8">
    <span
      class="font-mono text-sm font-medium"
      :class="inverse ? 'text-gray-300' : 'text-primary dark:text-indigo-300'"
      aria-hidden="true"
    >
      {{ number }}
    </span>
    <h2
      class="text-sm font-bold uppercase tracking-wider"
      :class="inverse ? 'text-white' : 'text-gray-900 dark:text-white'"
    >
      {{ title }}
    </h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  number: string;
  title: string;
  /** Set when the heading sits on a block that is dark in both themes. */
  inverse?: boolean;
}>();
</script>
