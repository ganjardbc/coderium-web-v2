<template>
  <header class="mb-8 md:mb-12">
    <p v-if="label" class="mb-3 md:mb-4 text-sm font-bold uppercase tracking-wider text-primary dark:text-indigo-300">
      {{ label }}
    </p>
    <h1 class="max-w-4xl text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-balance text-gray-900 dark:text-white">
      {{ title }}
    </h1>
    <p v-if="lead || $slots.default" class="mt-4 md:mt-5 max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
      <slot>{{ lead }}</slot>
    </p>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  label?: string;
  lead?: string;
}>();
</script>
