<template>
  <div class="p-6">
    <Toast />
    <ConfirmDialog />

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Posts</h1>
      <div class="flex gap-2 flex-wrap">
        <router-link v-slot="{ navigate }" to="/posts/create" custom>
          <Button label="Create New Post" icon="pi pi-plus" size="small" @click="navigate" />
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <ProgressSpinner />
    </div>

    <EmptyState
      v-else-if="posts.length === 0"
      icon="pi-file-edit"
      title="No posts yet"
      description="Create your first post to see it listed here."
    />

    <div v-else class="space-y-3">
      <div
        v-for="post in posts"
        :key="post.id"
        class="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-surface-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      >
        <!-- Cover thumbnail -->
        <div class="hidden sm:block shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-surface-800">
          <img v-if="post.cover" :src="post.cover" :alt="post.title" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <i class="pi pi-image text-2xl text-gray-300 dark:text-gray-600" />
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <router-link
                :to="`/posts/${post.slug}/edit`"
                class="font-semibold text-gray-900 dark:text-white hover:underline line-clamp-2"
              >
                {{ post.title }}
              </router-link>
              <p v-if="post.subtitle" class="text-sm text-gray-400 dark:text-gray-500 line-clamp-2 mt-0.5">
                {{ post.subtitle }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-1 shrink-0">
              <Button
                v-if="!post.isPublished"
                icon="pi pi-send"
                size="small"
                text
                rounded
                severity="success"
                title="Publish"
                @click="handlePublish(post.slug)"
              />
              <Button
                v-else
                icon="pi pi-pause"
                size="small"
                text
                rounded
                severity="warn"
                title="Unpublish"
                @click="handleUnpublish(post.slug)"
              />
              <router-link v-slot="{ navigate }" :to="`/posts/${post.slug}/edit`" custom>
                <Button icon="pi pi-pencil" size="small" text rounded severity="info" title="Edit" @click="navigate" />
              </router-link>
              <Button
                icon="pi pi-trash"
                size="small"
                text
                rounded
                severity="danger"
                title="Delete"
                @click="handleDelete(post.slug, post.title)"
              />
            </div>
          </div>

          <!-- Badges + meta -->
          <div class="flex items-center flex-wrap gap-2 mt-3">
            <Tag :value="post.type" severity="secondary" class="capitalize" />
            <Tag :value="post.isPublished ? 'Published' : 'Draft'" :severity="post.isPublished ? 'success' : 'warn'" />
            <Tag v-if="post.sourceUrl" value="Hermes" icon="pi pi-bolt" severity="info" title="Sourced from Hermes" />

            <span class="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1 ml-auto">
              <i class="pi pi-eye text-xs" /> {{ post.viewsCount }}
            </span>
            <span class="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <i class="pi pi-calendar text-xs" /> {{ new Date(post.createdAt).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <AdminPagination :meta="meta" @change="(p) => postsStore.fetchPosts(p, meta.limit)" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Button, Tag, Toast, ConfirmDialog, ProgressSpinner } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { usePostStore } from '@/modules/posts/stores/post.store';
import { storeToRefs } from 'pinia';
import EmptyState from '@/components/EmptyState.vue';
import AdminPagination from '@/components/AdminPagination.vue';

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
