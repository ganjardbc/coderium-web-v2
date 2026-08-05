<template>
  <div class="text-gray-400 dark:text-gray-500 text-sm" :class="[padding, center ? 'text-center' : '']">
    <slot>{{ message }}</slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string;
    padding?: string;
    center?: boolean;
  }>(),
  { padding: 'py-12', center: true }
);
</script>
