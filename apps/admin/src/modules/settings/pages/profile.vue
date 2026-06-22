<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Profile Settings</h1>

    <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
      <template #content>
        <form @submit.prevent="handleSave" class="space-y-5">
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold shrink-0">
                <img v-if="form.avatarUrl.length > 0" :src="form.avatarUrl[0].url" alt="Avatar" class="w-full h-full object-cover" />
                <span v-else>{{ (form.name || 'U').charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <p class="font-medium">{{ form.name || 'User' }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ form.email }}</p>
              </div>
            </div>
            <Button
              type="button"
              label="Change Avatar"
              icon="pi pi-image"
              severity="secondary"
              outlined
              size="small"
              @click="openAvatarModal"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
            <InputText v-model="form.name" required placeholder="Your name" class="w-full" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
            <InputText v-model="form.email" type="email" disabled class="w-full opacity-60" />
          </div>

          <Message v-if="message" severity="success" size="small" variant="simple">{{ message }}</Message>
          <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>

          <Button type="submit" label="Save Changes" icon="pi pi-check" :loading="loading" />
        </form>
      </template>
    </Card>

    <!-- Change Avatar Dialog -->
    <Dialog v-model:visible="showAvatarModal" modal header="Change Avatar" :style="{ width: '30rem' }">
      <div class="py-4 space-y-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Upload a new avatar image. Recommended size is 150x150px.
        </p>
        <MediaUploader
          v-model="tempAvatarUrl"
          accept="image/*"
          :multiple="false"
          :max-size="5"
        />
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="Cancel" severity="secondary" text @click="cancelAvatarChange" />
          <Button label="Save Avatar" icon="pi pi-check" @click="saveAvatarFromModal" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { InputText, Button, Message, Card, Dialog } from 'primevue';
import api from '@/lib/api';
import MediaUploader from '@/components/MediaUploader.vue';
import type { UploadedMedia } from '@/components/MediaUploader.vue';

const form = ref({
  name: '',
  email: '',
  avatarUrl: [] as UploadedMedia[]
});
const loading = ref(false);
const message = ref('');
const error = ref('');

const showAvatarModal = ref(false);
const tempAvatarUrl = ref<UploadedMedia[]>([]);

function openAvatarModal() {
  tempAvatarUrl.value = [...form.value.avatarUrl];
  showAvatarModal.value = true;
}

function cancelAvatarChange() {
  showAvatarModal.value = false;
  tempAvatarUrl.value = [];
}

function saveAvatarFromModal() {
  form.value.avatarUrl = [...tempAvatarUrl.value];
  showAvatarModal.value = false;
}

onMounted(async () => {
  try {
    const { data } = await api.get('/auth/me');
    form.value = {
      name: data.data.name,
      email: data.data.email,
      avatarUrl: data.data.avatarUrl ? [{
        id: data.data.avatarUrl,
        url: data.data.avatarUrl,
        filename: data.data.avatarUrl.split('/').pop() || 'avatar.jpg',
        originalName: data.data.avatarUrl.split('/').pop() || 'avatar.jpg',
        mimeType: 'image/jpeg',
        size: 0
      }] : []
    };
  } catch {
    // ignore
  }
});

async function handleSave() {
  error.value = '';
  message.value = '';
  loading.value = true;
  try {
    const payload = {
      name: form.value.name,
      avatarUrl: form.value.avatarUrl.length > 0 ? form.value.avatarUrl[0].url : undefined
    };
    await api.put('/auth/me', payload);
    message.value = 'Profile updated successfully';
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Failed to update profile';
  } finally {
    loading.value = false;
  }
}
</script>
