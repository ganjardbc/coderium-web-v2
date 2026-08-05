<template>
  <button v-if="variant === 'link'" @click="router.back()" class="inline-flex items-center gap-1.5 text-sm transition-colors cursor-pointer" :class="linkClass">
    <Icon name="lucide:arrow-left" class="w-4 h-4" /> {{ label }}
  </button>

  <button
    v-else-if="variant === 'solid-blue'"
    @click="router.back()"
    class="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer"
  >
    <Icon name="lucide:arrow-left" class="w-4 h-4" /> {{ label }}
  </button>

  <button
    v-else
    @click="router.back()"
    class="inline-block px-5 py-2 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors cursor-pointer"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

withDefaults(
  defineProps<{
    label: string;
    variant?: 'link' | 'solid-blue' | 'solid-dark';
    linkClass?: string;
  }>(),
  {
    variant: 'link',
    linkClass: 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
  }
);

const router = useRouter();
</script>
