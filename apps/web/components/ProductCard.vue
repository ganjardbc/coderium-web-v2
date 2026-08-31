<template>
  <NuxtLink
    :to="`/products/${product.slug}`"
    class="group block rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors bg-white dark:bg-dark-secondary/30"
  >
    <div
      class="w-full bg-gray-50 dark:bg-dark-secondary overflow-hidden aspect-video"
    >
      <img
        v-if="product.cover"
        :src="product.cover"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="lucide:box" class="text-gray-300 dark:text-gray-700 w-8 h-8" />
      </div>
    </div>

    <div class="p-4 md:p-5">
      <h3
        class="font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors leading-tight text-base md:text-lg"
      >
        {{ product.name }}
      </h3>
      <p
        v-if="product.tagline"
        class="mt-1.5 text-sm text-gray-500 dark:text-gray-400 truncate"
      >
        {{ product.tagline }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface ProductCardData {
  slug: string;
  name: string;
  tagline?: string | null;
  cover?: string | null;
}

withDefaults(
  defineProps<{
    product: ProductCardData;
  }>(), {}
);
</script>
