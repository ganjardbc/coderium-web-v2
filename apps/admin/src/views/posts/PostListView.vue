<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Posts</h1>
      <div class="flex gap-2">
        <router-link to="/posts/new/article" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + Article
        </router-link>
        <router-link to="/posts/new/carousel" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
          + Carousel
        </router-link>
        <router-link to="/posts/new/video" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
          + Video
        </router-link>
        <router-link to="/posts/new/stack_gallery" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
          + Gallery
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

    <div v-else-if="posts.length === 0" class="text-center py-12 text-gray-500">
      No posts yet. Create your first post!
    </div>

    <div v-else class="bg-white rounded-xl border overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Type</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Views</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Created</th>
            <th class="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id" class="border-b last:border-0 hover:bg-gray-50">
            <td class="px-4 py-3">
              <router-link :to="`/posts/edit/${post.slug}`" class="text-blue-600 hover:underline font-medium">
                {{ post.title }}
              </router-link>
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{{ post.type }}</span>
            </td>
            <td class="px-4 py-3">
              <span :class="post.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'" class="px-2 py-1 text-xs rounded-full">
                {{ post.isPublished ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ post.viewsCount }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ new Date(post.createdAt).toLocaleDateString() }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <button
                  v-if="!post.isPublished"
                  @click="handlePublish(post.slug)"
                  class="text-xs text-green-600 hover:underline"
                >Publish</button>
                <button
                  v-else
                  @click="handleUnpublish(post.slug)"
                  class="text-xs text-yellow-600 hover:underline"
                >Unpublish</button>
                <router-link :to="`/posts/edit/${post.slug}`" class="text-xs text-blue-600 hover:underline">Edit</router-link>
                <button @click="handleDelete(post.slug)" class="text-xs text-red-600 hover:underline">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="meta.totalPages > 1" class="flex justify-center gap-2 mt-6">
      <button
        v-for="p in meta.totalPages"
        :key="p"
        @click="postsStore.fetchPosts(p, meta.limit)"
        :class="p === meta.page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        class="px-3 py-1 rounded text-sm transition-colors"
      >{{ p }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePostsStore } from '@/stores/posts';

const postsStore = usePostsStore();
const { posts, meta, loading } = storeToRefs(postsStore);

import { storeToRefs } from 'pinia';

onMounted(() => postsStore.fetchPosts());

async function handlePublish(slug: string) {
  await postsStore.publishPost(slug);
  await postsStore.fetchPosts(meta.value.page, meta.value.limit);
}

async function handleUnpublish(slug: string) {
  await postsStore.unpublishPost(slug);
  await postsStore.fetchPosts(meta.value.page, meta.value.limit);
}

async function handleDelete(slug: string) {
  if (confirm('Are you sure you want to delete this post?')) {
    await postsStore.deletePost(slug);
    await postsStore.fetchPosts(meta.value.page, meta.value.limit);
  }
}
</script>
