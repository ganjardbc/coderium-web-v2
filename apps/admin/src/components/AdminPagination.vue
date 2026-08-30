<template>
  <div v-if="meta.totalPages > 1" class="flex items-center justify-between gap-3 mt-6 flex-wrap">
    <p class="text-sm text-gray-400 dark:text-gray-500">
      Page {{ meta.page }} of {{ meta.totalPages }} &bull; {{ meta.total }} total
    </p>
    <div class="flex items-center gap-1">
      <Button
        icon="pi pi-chevron-left"
        size="small"
        text
        severity="secondary"
        :disabled="meta.page <= 1"
        @click="$emit('change', meta.page - 1)"
      />
      <Button
        v-for="p in pageNumbers"
        :key="p"
        :label="String(p)"
        size="small"
        :severity="p === meta.page ? 'primary' : 'secondary'"
        :outlined="p !== meta.page"
        @click="$emit('change', p)"
      />
      <Button
        icon="pi pi-chevron-right"
        size="small"
        text
        severity="secondary"
        :disabled="meta.page >= meta.totalPages"
        @click="$emit('change', meta.page + 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Button } from 'primevue';

const props = defineProps<{
  meta: { page: number; limit: number; total: number; totalPages: number };
}>();

defineEmits<{
  change: [page: number];
}>();

// Show at most 7 page buttons centered around the current page.
const pageNumbers = computed(() => {
  const { page, totalPages } = props.meta;
  const maxButtons = 7;
  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  const end = Math.min(totalPages, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});
</script>
