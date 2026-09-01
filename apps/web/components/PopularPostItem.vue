<template>
  <div class="flex gap-3 group">
    <span class="text-2xl font-black text-gray-300 dark:text-gray-700 w-7 shrink-0 leading-none mt-0.5 select-none">
      0{{ rank }}
    </span>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1.5 mb-1">
        <UserAvatar :name="post.user?.name" size="xs" />
        <span class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ post.user?.name }}</span>
      </div>
      <NuxtLink :to="`/posts/${post.slug}`">
        <h4 class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2 leading-snug">
          {{ post.title }}
        </h4>
      </NuxtLink>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatDate(post.publishedAt || post.createdAt) }} &bull; {{ post.viewsCount }} views</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Author {
  id?: string;
  name?: string;
  avatarUrl?: string | null;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  createdAt?: string;
  publishedAt: string;
  viewsCount: number;
  user?: Author;
}

defineProps<{ post: Post; rank: number }>();
</script>
