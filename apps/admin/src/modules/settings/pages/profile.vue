<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Profile Settings</h1>

    <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
      <template #content>
        <form @submit.prevent="handleSave" class="space-y-5">
          <div class="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div class="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold shrink-0">
              {{ (form.name || 'U').charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="font-medium">{{ form.name || 'User' }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ form.email }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
            <InputText v-model="form.name" required placeholder="Your name" class="w-full" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
            <InputText v-model="form.email" type="email" disabled class="w-full opacity-60" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Avatar URL</label>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-image text-gray-400"></i>
              </InputGroupAddon>
              <InputText v-model="form.avatarUrl" type="url" placeholder="https://..." class="w-full" />
            </InputGroup>
          </div>

          <Message v-if="message" severity="success" size="small" variant="simple">{{ message }}</Message>
          <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>

          <Button type="submit" label="Save Changes" icon="pi pi-check" :loading="loading" />
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { InputText, InputGroup, InputGroupAddon, Button, Message, Card } from 'primevue';
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
    message.value = 'Profile updated successfully';
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Failed to update profile';
  } finally {
    loading.value = false;
  }
}
</script>
