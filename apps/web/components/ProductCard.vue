<template>
  <NuxtLink
    :to="`/products/${product.slug}`"
    class="group block rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors bg-white dark:bg-dark-secondary/30"
  >
    <div
      class="w-full bg-gray-50 dark:bg-dark-secondary overflow-hidden"
      :class="size === 'lg' ? 'aspect-[16/7]' : 'aspect-video'"
    >
      <img
        v-if="product.cover"
        :src="product.cover"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="lucide:box" class="text-gray-300 dark:text-gray-700" :class="size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'" />
      </div>
    </div>

    <div :class="size === 'lg' ? 'p-6 md:p-8' : 'p-4 md:p-5'">
      <h3
        class="font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors leading-tight"
        :class="size === 'lg' ? 'text-xl md:text-2xl' : 'text-base md:text-lg'"
      >
        {{ product.name }}
      </h3>
      <p
        v-if="product.tagline"
        class="mt-1.5 text-gray-500 dark:text-gray-400 truncate"
        :class="size === 'lg' ? 'text-sm md:text-base' : 'text-sm'"
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
    size?: 'md' | 'lg';
  }>(),
  { size: 'md' }
);
</script>
