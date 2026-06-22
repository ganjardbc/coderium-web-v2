<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Edit Playlist</h1>
      <router-link to="/playlists" class="text-sm text-gray-500 dark:text-gray-400 hover:underline">
        &larr; Back to list
      </router-link>
    </div>

    <div v-if="pageLoading" class="flex justify-center py-16">
      <ProgressSpinner />
    </div>

    <Card v-else class="!shadow-none border border-gray-200 dark:border-gray-700">
      <template #content>
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Title</label>
            <InputText v-model="form.title" required placeholder="Playlist title" class="w-full" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
            <Textarea v-model="form.description" rows="4" placeholder="Describe what this playlist is about..." class="w-full" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Cover Image</label>
            <MediaUploader
              v-model="form.cover"
              accept="image/*"
              :multiple="false"
              :max-size="10"
            />
          </div>

          <div class="flex items-center gap-3">
            <Checkbox v-model="form.isPublished" :binary="true" input-id="isPublished" />
            <label for="isPublished" class="text-sm font-medium cursor-pointer">Published</label>
          </div>

          <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>

          <div class="flex gap-3">
            <Button type="submit" label="Update Playlist" icon="pi pi-check" :loading="loading" />
            <router-link v-slot="{ navigate }" :to="`/playlists/${route.params.slug}/posts`" custom>
              <Button label="Manage Posts" icon="pi pi-list" severity="help" @click="navigate" />
            </router-link>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { InputText, Textarea, Checkbox, Button, Message, Card, ProgressSpinner } from 'primevue';
import api from '@/lib/api';
import MediaUploader from '@/components/MediaUploader.vue';
import type { UploadedMedia } from '@/components/MediaUploader.vue';

const router = useRouter();
const route = useRoute();

const form = ref({
  title: '',
  description: '',
  cover: [] as UploadedMedia[],
  isPublished: false,
});

const pageLoading = ref(true);
const loading = ref(false);
const error = ref('');

onMounted(async () => {
  try {
    const { data } = await api.get(`/admin/playlists`);
    const playlist = data.data.find((p: { slug: string }) => p.slug === route.params.slug);
    if (playlist) {
      form.value = {
        title: playlist.title,
        description: playlist.description || '',
        cover: playlist.cover ? [{
          id: playlist.cover,
          url: playlist.cover,
          filename: playlist.cover.split('/').pop() || 'cover.jpg',
          originalName: playlist.cover.split('/').pop() || 'cover.jpg',
          mimeType: 'image/jpeg',
          size: 0
        }] : [],
        isPublished: playlist.isPublished,
      };
    } else {
      error.value = 'Playlist not found';
    }
  } catch {
    error.value = 'Failed to load playlist data';
  } finally {
    pageLoading.value = false;
  }
});

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    const payload = {
      title: form.value.title,
      description: form.value.description || undefined,
      cover: form.value.cover.length > 0 ? form.value.cover[0].url : undefined,
      isPublished: form.value.isPublished,
    };
    await api.put(`/admin/playlists/${route.params.slug}`, payload);
    router.push('/playlists');
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Failed to save playlist';
  } finally {
    loading.value = false;
  }
}
</script>
