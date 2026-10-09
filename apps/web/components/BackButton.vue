<template>
  <button v-if="variant === 'link'" @click="router.back()" class="inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold transition-colors cursor-pointer" :class="linkClass">
    <Icon name="lucide:arrow-left" class="w-4 h-4" /> {{ label }}
  </button>

  <button
    v-else-if="variant === 'solid-blue'"
    @click="router.back()"
    class="btn btn-solid gap-1.5"
  >
    <Icon name="lucide:arrow-left" class="w-4 h-4" /> {{ label }}
  </button>

  <button
    v-else
    @click="router.back()"
    class="btn btn-solid"
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
