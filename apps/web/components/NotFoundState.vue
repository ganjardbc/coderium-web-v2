<template>
  <div class="text-center py-10 md:py-20 bg-gray-50 dark:bg-dark-secondary rounded-2xl">
    <h1 class="section-title">{{ title }}</h1>
    <p class="text-gray-500 dark:text-gray-400 mt-2">{{ message }}</p>
    <div class="mt-6 flex items-center justify-center gap-3">
      <BackButton :label="backLabel" variant="solid-dark" />
      <NuxtLink
        to="/articles"
        class="btn btn-outline"
      >
        Lihat artikel
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
    message: 'Halaman yang Anda cari mungkin sudah dihapus atau tidak lagi dipublikasikan.',
    backLabel: 'Kembali',
  }
);
</script>
