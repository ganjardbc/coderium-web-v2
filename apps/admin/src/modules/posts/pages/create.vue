<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">New {{ typeLabel }}</h1>
      <router-link to="/posts" class="text-sm text-gray-500 hover:underline">Back to list</router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6 bg-white rounded-xl border p-6">
      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input v-model="form.title" type="text" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Subtitle</label>
        <input v-model="form.subtitle" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Type</label>
        <select v-model="form.type" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
          <option value="article">Article</option>
          <option value="carousel">Carousel</option>
          <option value="video">Video</option>
          <option value="stack_gallery">Stack Gallery</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Content</label>
        <textarea v-model="form.content" rows="12" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Tags (comma separated)</label>
        <input v-model="tagsInput" type="text" placeholder="vue, nuxt, frontend" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Cover Image URL</label>
        <input v-model="form.cover" type="url" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Saving...' : 'Create' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePostStore } from '@/modules/posts/stores/post.store';

const router = useRouter();
const route = useRoute();
const postsStore = usePostStore();

const typeParam = computed(() => route.query.type as string || 'article');

const typeLabels: Record<string, string> = {
  article: 'Article',
  carousel: 'Carousel',
  video: 'Video',
  stack_gallery: 'Stack Gallery',
};

const typeLabel = computed(() => typeLabels[typeParam.value] || typeParam.value);

const form = ref({
  title: '',
  subtitle: '',
  content: '',
  type: typeParam.value,
  cover: '',
});

const tagsInput = ref('');
const loading = ref(false);
const error = ref('');

async function handleSubmit() {
  error.value = '';
  loading.value = true;

  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
  const payload = { ...form.value, tags: tags.length ? tags : undefined };

  try {
    await postsStore.createPost(payload);
    router.push('/posts');
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Failed to save post';
  } finally {
    loading.value = false;
  }
}
</script>
