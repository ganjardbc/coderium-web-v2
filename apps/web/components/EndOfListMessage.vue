<template>
  <p class="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
    {{ message }}
  </p>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string;
  }>(),
  { message: "You've reached the end. No more items to load." }
);
</script>
