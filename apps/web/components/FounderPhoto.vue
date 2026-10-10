<template>
  <img
    v-if="FOUNDER_PHOTO_SRC"
    :src="FOUNDER_PHOTO_SRC"
    alt="Ganjar Hadiatna, pendiri Coderium"
    class="shrink-0 h-24 w-24 md:h-28 md:w-28 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-gray-800"
    loading="lazy"
  />
</template>

<script setup lang="ts">
// Renders nothing until a real photo is set. Never use a stock or generated image here.
// Real photo of the founder (public/images/ganjar-hadiatna.jpg). Set to '' to hide it.
const FOUNDER_PHOTO_SRC = '/images/ganjar-hadiatna.jpg';
</script>
