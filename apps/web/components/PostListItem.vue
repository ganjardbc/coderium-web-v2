<template>
  <article class="py-6 md:py-8 first:pt-0 group">
    <div class="flex items-start gap-4 justify-between">
      <div class="flex-1 min-w-0">
        <!-- Author row -->
        <div class="flex items-center gap-2 mb-3">
          <UserAvatar :name="post.user?.name" size="sm" />
          <span class="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">{{ post.user?.name }}</span>
          <span class="text-gray-300 dark:text-gray-700 text-sm">·</span>
          <span class="text-sm text-gray-400 dark:text-gray-400 shrink-0">{{ formatDate(post.publishedAt) }}</span>
        </div>

        <!-- Title + subtitle -->
        <NuxtLink :to="`/posts/${post.slug}`" class="block">
          <h2 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
            {{ post.title }}
          </h2>
          <p v-if="post.subtitle" class="mt-1 text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
            {{ post.subtitle }}
          </p>
        </NuxtLink>

        <!-- Meta row -->
        <div class="flex items-center gap-3 mt-3 text-xs text-gray-400 dark:text-gray-400">
          <span class="px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 capitalize">
            {{ post.type }}
          </span>
          <span>{{ readingTime(post.subtitle ?? post.title) }}</span>
          <span>{{ post.viewsCount }} views</span>
          <span v-if="post.likesCount !== undefined">{{ post.likesCount }} likes</span>
        </div>
      </div>

      <!-- Thumbnail -->
      <NuxtLink v-if="post.cover" :to="`/posts/${post.slug}`" class="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-sm overflow-hidden shrink-0 ml-3 sm:ml-4 bg-gray-100 dark:bg-dark-secondary border dark:border-gray-800">
        <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover" />
      </NuxtLink>
    </div>
  </article>
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
  subtitle?: string | null;
  type: string;
  cover?: string | null;
  publishedAt: string;
  viewsCount: number;
  likesCount?: number;
  user?: Author;
}

defineProps<{ post: Post }>();
</script>
