<template>
  <div class="text-center py-10 md:py-20 bg-gray-50 dark:bg-dark-secondary rounded-2xl">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ title }}</h1>
    <p class="text-gray-500 dark:text-gray-400 mt-2">{{ message }}</p>
    <div class="mt-6 flex items-center justify-center gap-3">
      <BackButton :label="backLabel" variant="solid-dark" />
      <NuxtLink
        to="/explore"
        class="px-5 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-gray-500 dark:hover:border-gray-500 transition-colors"
      >
        Explore stories
      </NuxtLink>
    </div>
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
