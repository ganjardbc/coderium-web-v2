<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">New Playlist</h1>
      <router-link to="/playlists" class="text-sm text-gray-500 hover:underline">Back to list</router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6 bg-white rounded-xl border p-6">
      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input v-model="form.title" type="text" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea v-model="form.description" rows="4" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Cover Image URL</label>
        <input v-model="form.cover" type="url" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="flex items-center gap-2">
        <input v-model="form.isPublished" type="checkbox" id="isPublished" class="w-4 h-4 text-blue-600" />
        <label for="isPublished" class="text-sm font-medium">Published</label>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/lib/api';

const router = useRouter();

const form = ref({
  title: '',
  description: '',
  cover: '',
  isPublished: false,
});

const loading = ref(false);
const error = ref('');

async function handleSubmit() {
  error.value = '';
  loading.value = true;

  try {
    await api.post('/admin/playlists', form.value);
    router.push('/playlists');
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Failed to save playlist';
  } finally {
    loading.value = false;
  }
}
</script>
