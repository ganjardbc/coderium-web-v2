<template>
  <div
    class="rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-600 dark:text-gray-400 shrink-0 overflow-hidden"
    :class="sizeClass"
  >
    <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
    <span v-else>{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    name?: string | null;
    avatarUrl?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg';
  }>(),
  { size: 'sm' }
);

const sizeClass = computed(() => ({
  xs: 'w-4 h-4 text-xs',
  sm: 'w-6 h-6 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-2xl',
}[props.size]));

const initials = computed(() => props.name?.charAt(0).toUpperCase() ?? '?');
</script>
