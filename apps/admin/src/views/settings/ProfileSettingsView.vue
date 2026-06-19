<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Profile Settings</h1>

    <form @submit.prevent="handleSave" class="space-y-6 bg-white rounded-xl border p-6">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
          {{ (form.name || 'U').charAt(0).toUpperCase() }}
        </div>
        <div>
          <p class="font-medium">{{ form.name || 'User' }}</p>
          <p class="text-sm text-gray-500">{{ form.email }}</p>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Name</label>
        <input v-model="form.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input v-model="form.email" type="email" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" disabled />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Avatar URL</label>
        <input v-model="form.avatarUrl" type="url" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <p v-if="message" class="text-green-600 text-sm">{{ message }}</p>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

      <button type="submit" :disabled="loading" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/lib/api';

const form = ref({ name: '', email: '', avatarUrl: '' });
const loading = ref(false);
const message = ref('');
const error = ref('');

onMounted(async () => {
  try {
    const { data } = await api.get('/auth/me');
    form.value = { name: data.data.name, email: data.data.email, avatarUrl: data.data.avatarUrl || '' };
  } catch {
    // ignore
  }
});

async function handleSave() {
  error.value = '';
  message.value = '';
  loading.value = true;
  try {
    await api.put('/auth/me', { name: form.value.name, avatarUrl: form.value.avatarUrl });
    message.value = 'Profile updated';
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Failed to update';
  } finally {
    loading.value = false;
  }
}
</script>
