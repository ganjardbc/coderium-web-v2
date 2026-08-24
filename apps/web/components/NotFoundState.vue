<template>
  <div class="text-center py-10 md:py-20 bg-gray-50 dark:bg-dark-secondary rounded-2xl border dark:border-gray-800">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ title }}</h1>
    <p class="text-gray-500 dark:text-gray-400 mt-2">{{ message }}</p>
    <BackButton :label="backLabel" variant="solid-dark" class="mt-6" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    message?: string;
    backLabel?: string;
  }>(),
  {
    message: 'The item you are looking for might have been removed or unpublished.',
    backLabel: 'Go Back',
  }
);
</script>
