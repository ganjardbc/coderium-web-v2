<template>
  <article class="group card overflow-hidden flex flex-col hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
    <!-- Cover and title link to the detail page; the buttons below are separate links (no nested <a>). -->
    <NuxtLink :to="detailPath" class="block" tabindex="-1" aria-hidden="true">
      <div class="w-full bg-gray-50 dark:bg-dark-secondary overflow-hidden aspect-video">
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
    </NuxtLink>

    <div class="p-5 flex flex-col flex-1">
      <h3 class="font-bold text-gray-900 dark:text-white leading-tight text-base md:text-lg">
        <NuxtLink :to="detailPath" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          {{ product.name }}
        </NuxtLink>
      </h3>
      <p v-if="product.tagline" class="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
        {{ product.tagline }}
      </p>

      <div class="mt-auto pt-5 grid grid-cols-1 gap-2">
        <a :href="mailtoHref(productAuditSubject(product.name))" class="btn btn-solid gap-2 px-4">
          <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
          Pesan audit gratis
        </a>
        <NuxtLink :to="detailPath" class="btn btn-outline px-4" :aria-label="`Lihat detail ${product.name}`">
          Lihat detail
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface ProductCardData {
  slug: string;
  name: string;
  tagline?: string | null;
  cover?: string | null;
}

const props = defineProps<{
  product: ProductCardData;
}>();

const detailPath = computed(() => `/products/${props.product.slug}`);
</script>
