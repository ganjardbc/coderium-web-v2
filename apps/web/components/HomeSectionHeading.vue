<template>
  <div>
    <p class="flex items-baseline gap-3 text-sm font-bold uppercase tracking-wider">
      <span
        class="font-mono font-medium"
        :class="inverse ? 'text-gray-300' : 'text-primary dark:text-indigo-300'"
        aria-hidden="true"
      >
        {{ number }}
      </span>
      <span v-if="label" :class="inverse ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'">{{ label }}</span>
    </p>
    <h2
      class="mt-3 md:mt-4 max-w-3xl text-3xl md:text-5xl font-black tracking-tight leading-[1.05] text-balance"
      :class="inverse ? 'text-white' : 'text-gray-900 dark:text-white'"
    >
      {{ title }}
    </h2>
    <p
      v-if="lead"
      class="mt-3 md:mt-4 max-w-2xl text-lg md:text-xl leading-relaxed"
      :class="inverse ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'"
    >
      {{ lead }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  number: string;
  /** Small eyebrow next to the number; omit when the title already names the section. */
  label?: string;
  title: string;
  /** Optional subtitle under the heading. */
  lead?: string;
  /** Set when the heading sits on a block that is dark in both themes. */
  inverse?: boolean;
}>();
</script>
