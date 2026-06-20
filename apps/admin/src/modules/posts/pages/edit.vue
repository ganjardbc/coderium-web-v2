<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Edit Post</h1>
      <router-link to="/posts" class="text-sm text-gray-500 dark:text-gray-400 hover:underline">
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
            <InputText v-model="form.title" required placeholder="Post title" class="w-full" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Subtitle</label>
            <InputText v-model="form.subtitle" placeholder="Short subtitle or summary" class="w-full" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Type</label>
            <Select
              v-model="form.type"
              :options="typeOptions"
              option-label="label"
              option-value="value"
              disabled
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Content</label>
            <Textarea v-model="form.content" rows="12" class="w-full font-mono text-sm" placeholder="Write your content here..." />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Tags</label>
            <InputChips v-model="form.tags" placeholder="Add tag and press Enter" class="w-full" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Cover Image URL</label>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-image text-gray-400"></i>
              </InputGroupAddon>
              <InputText v-model="form.cover" type="url" placeholder="https://..." class="w-full" />
            </InputGroup>
          </div>

          <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>

          <Button type="submit" label="Update Post" icon="pi pi-check" :loading="loading" />
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { InputText, Textarea, Select, InputChips, InputGroup, InputGroupAddon, Button, Message, Card, ProgressSpinner } from 'primevue';
import { usePostStore } from '@/modules/posts/stores/post.store';
import api from '@/lib/api';

const router = useRouter();
const route = useRoute();
const postsStore = usePostStore();

const typeOptions = [
  { label: 'Article', value: 'article' },
  { label: 'Carousel', value: 'carousel' },
  { label: 'Video', value: 'video' },
  { label: 'Stack Gallery', value: 'stack_gallery' },
];

const form = ref({
  title: '',
  subtitle: '',
  content: '',
  type: 'article',
  cover: '',
  tags: [] as string[],
});

const pageLoading = ref(true);
const loading = ref(false);
const error = ref('');

onMounted(async () => {
  try {
    const { data } = await api.get(`/admin/posts`);
    const post = data.data.find((p: { slug: string }) => p.slug === route.params.slug);
    if (post) {
      form.value = {
        title: post.title,
        subtitle: post.subtitle || '',
        content: post.content || '',
        type: post.type,
        cover: post.cover || '',
        tags: post.tags || [],
      };
    } else {
      error.value = 'Post not found';
    }
  } catch (err) {
    error.value = 'Failed to load post data';
  } finally {
    pageLoading.value = false;
  }
});

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    const payload = {
      ...form.value,
      tags: form.value.tags.length ? form.value.tags : undefined,
    };
    await postsStore.updatePost(route.params.slug as string, payload);
    router.push('/posts');
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Failed to save post';
  } finally {
    loading.value = false;
  }
}
</script>
