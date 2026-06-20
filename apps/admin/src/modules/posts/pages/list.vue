<template>
  <div class="p-6">
    <Toast />
    <ConfirmDialog />

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Posts</h1>
      <div class="flex gap-2 flex-wrap">
        <router-link v-slot="{ navigate }" to="/posts/create?type=article" custom>
          <Button label="Article" icon="pi pi-plus" size="small" @click="navigate" />
        </router-link>
        <router-link v-slot="{ navigate }" to="/posts/create?type=carousel" custom>
          <Button label="Carousel" icon="pi pi-plus" size="small" severity="secondary" @click="navigate" />
        </router-link>
        <router-link v-slot="{ navigate }" to="/posts/create?type=video" custom>
          <Button label="Video" icon="pi pi-plus" size="small" severity="danger" @click="navigate" />
        </router-link>
        <router-link v-slot="{ navigate }" to="/posts/create?type=stack_gallery" custom>
          <Button label="Gallery" icon="pi pi-plus" size="small" severity="success" @click="navigate" />
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <ProgressSpinner />
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500">
      No posts yet. Create your first post!
    </div>

    <DataTable
      v-else
      :value="posts"
      class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
      stripedRows
    >
      <Column field="title" header="Title" class="min-w-48">
        <template #body="{ data }">
          <router-link :to="`/posts/${data.slug}/edit`" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            {{ data.title }}
          </router-link>
        </template>
      </Column>
      <Column field="type" header="Type" class="w-32">
        <template #body="{ data }">
          <Tag :value="data.type" severity="secondary" class="capitalize" />
        </template>
      </Column>
      <Column field="isPublished" header="Status" class="w-32">
        <template #body="{ data }">
          <Tag :value="data.isPublished ? 'Published' : 'Draft'" :severity="data.isPublished ? 'success' : 'warn'" />
        </template>
      </Column>
      <Column field="viewsCount" header="Views" class="w-24" />
      <Column field="createdAt" header="Created" class="w-36">
        <template #body="{ data }">
          {{ new Date(data.createdAt).toLocaleDateString() }}
        </template>
      </Column>
      <Column header="Actions" class="w-40">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button
              v-if="!data.isPublished"
              icon="pi pi-send"
              size="small"
              text
              severity="success"
              title="Publish"
              @click="handlePublish(data.slug)"
            />
            <Button
              v-else
              icon="pi pi-pause"
              size="small"
              text
              severity="warn"
              title="Unpublish"
              @click="handleUnpublish(data.slug)"
            />
            <router-link v-slot="{ navigate }" :to="`/posts/${data.slug}/edit`" custom>
              <Button icon="pi pi-pencil" size="small" text severity="info" title="Edit" @click="navigate" />
            </router-link>
            <Button
              icon="pi pi-trash"
              size="small"
              text
              severity="danger"
              title="Delete"
              @click="handleDelete(data.slug, data.title)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Pagination -->
    <div v-if="meta.totalPages > 1" class="flex justify-center gap-2 mt-6">
      <Button
        v-for="p in meta.totalPages"
        :key="p"
        :label="String(p)"
        size="small"
        :severity="p === meta.page ? 'primary' : 'secondary'"
        :outlined="p !== meta.page"
        @click="postsStore.fetchPosts(p, meta.limit)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { DataTable, Column, Button, Tag, Toast, ConfirmDialog, ProgressSpinner } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { usePostStore } from '@/modules/posts/stores/post.store';
import { storeToRefs } from 'pinia';

const postsStore = usePostStore();
const { posts, meta, loading } = storeToRefs(postsStore);
const confirm = useConfirm();
const toast = useToast();

onMounted(() => postsStore.fetchPosts());

async function handlePublish(slug: string) {
  await postsStore.publishPost(slug);
  await postsStore.fetchPosts(meta.value.page, meta.value.limit);
  toast.add({ severity: 'success', summary: 'Published', detail: 'Post is now live', life: 3000 });
}

async function handleUnpublish(slug: string) {
  await postsStore.unpublishPost(slug);
  await postsStore.fetchPosts(meta.value.page, meta.value.limit);
  toast.add({ severity: 'info', summary: 'Unpublished', detail: 'Post moved to drafts', life: 3000 });
}

function handleDelete(slug: string, title: string) {
  confirm.require({
    message: `Delete "${title}"? This cannot be undone.`,
    header: 'Delete Post',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Delete', severity: 'danger' },
    accept: async () => {
      await postsStore.deletePost(slug);
      await postsStore.fetchPosts(meta.value.page, meta.value.limit);
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Post has been removed', life: 3000 });
    },
  });
}
</script>
