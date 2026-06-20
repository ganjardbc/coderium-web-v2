<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Change Password</h1>

    <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
      <template #content>
        <form @submit.prevent="handleSave" class="space-y-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
            <Password v-model="form.currentPassword" required toggleMask :feedback="false" class="w-full" inputClass="w-full" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
            <Password v-model="form.newPassword" required toggleMask :feedback="false" class="w-full" inputClass="w-full" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <Password v-model="form.confirmPassword" required toggleMask :feedback="false" class="w-full" inputClass="w-full" />
          </div>

          <Message v-if="message" severity="success" size="small" variant="simple">{{ message }}</Message>
          <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>

          <Button type="submit" label="Update Password" icon="pi pi-lock" :loading="loading" />
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Password, Button, Message, Card } from 'primevue';
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
    message.value = 'Password updated successfully';
    form.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Failed to update password';
  } finally {
    loading.value = false;
  }
}
</script>
