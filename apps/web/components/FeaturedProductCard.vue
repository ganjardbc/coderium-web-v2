<template>
  <NuxtLink
    :to="`/products/${product.slug}`"
    class="group relative block w-full aspect-video rounded-2xl overflow-hidden bg-gray-900"
  >
    <img
      v-if="product.cover"
      :src="product.cover"
      :alt="product.name"
      class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
    />
    <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-800">
      <Icon name="lucide:box" class="w-12 h-12 text-gray-600" />
    </div>

    <div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />

    <div class="absolute inset-0 flex flex-col justify-end p-4 md:p-10">
      <span
        class="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-wider mb-3"
      >
        <Icon name="lucide:sparkles" class="w-3.5 h-3.5" />
        Featured Product
      </span>
      <h3 class="text-xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
        {{ product.name }}
      </h3>
      <p v-if="product.tagline" class="hidden md:block text-sm md:text-base text-gray-300 max-w-xl truncate">
        {{ product.tagline }}
      </p>
      <span
        class="mt-2 md:mt-4 inline-flex items-center gap-1.5 w-fit text-sm font-medium text-white group-hover:gap-2.5 transition-all"
      >
        Explore Product
        <Icon name="lucide:arrow-right" class="w-4 h-4" />
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface FeaturedProductData {
  slug: string;
  name: string;
  tagline?: string | null;
  cover?: string | null;
}

defineProps<{
  product: FeaturedProductData;
}>();
</script>
