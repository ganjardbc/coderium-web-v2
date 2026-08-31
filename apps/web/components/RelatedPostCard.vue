<template>
  <NuxtLink :to="`/posts/${post.slug}`" class="group block">
    <div class="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-secondary border border-gray-100 dark:border-gray-800 mb-3">
      <img v-if="post.cover" :src="post.cover" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="lucide:file-text" class="w-6 h-6 text-gray-300 dark:text-gray-700" />
      </div>
    </div>
    <span class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">{{ post.type }}</span>
    <h3 class="mt-1 font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
      {{ post.title }}
    </h3>
    <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">{{ formatDate(post.publishedAt) }} &bull; {{ post.viewsCount }} views</p>
  </NuxtLink>
</template>

<script setup lang="ts">
interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  type: string;
  cover?: string | null;
  publishedAt: string;
  viewsCount: number;
}

defineProps<{ post: RelatedPost }>();
</script>
