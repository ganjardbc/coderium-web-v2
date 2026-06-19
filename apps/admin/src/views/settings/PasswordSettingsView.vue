<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Change Password</h1>

    <form @submit.prevent="handleSave" class="space-y-6 bg-white rounded-xl border p-6">
      <div>
        <label class="block text-sm font-medium mb-1">Current Password</label>
        <input v-model="form.currentPassword" type="password" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">New Password</label>
        <input v-model="form.newPassword" type="password" required minlength="8" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Confirm New Password</label>
        <input v-model="form.confirmPassword" type="password" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <p v-if="message" class="text-green-600 text-sm">{{ message }}</p>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

      <button type="submit" :disabled="loading" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {{ loading ? 'Updating...' : 'Update Password' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '@/lib/api';

const form = ref({ currentPassword: '', newPassword: '', confirmPassword: '' });
const loading = ref(false);
const message = ref('');
const error = ref('');

async function handleSave() {
  error.value = '';
  message.value = '';
  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'Passwords do not match';
    return;
  }
  loading.value = true;
  try {
    await api.put('/auth/password', { currentPassword: form.value.currentPassword, newPassword: form.value.newPassword });
    message.value = 'Password updated';
    form.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Failed to update password';
  } finally {
    loading.value = false;
  }
}
</script>
