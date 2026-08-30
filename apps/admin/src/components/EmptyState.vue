<template>
  <div class="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
    <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-surface-800 flex items-center justify-center mb-3">
      <i :class="['pi', icon, 'text-xl text-gray-400 dark:text-gray-500']" />
    </div>
    <p class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ title }}</p>
    <p v-if="description" class="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-sm">{{ description }}</p>
    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string;
    title: string;
    description?: string;
  }>(),
  {
    icon: 'pi-inbox',
  },
);
</script>
