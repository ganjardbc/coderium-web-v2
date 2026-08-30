<template>
  <div class="p-6">
    <Toast />
    <ConfirmDialog />

    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <h1 class="text-2xl font-bold">Products</h1>
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Sort:</span>
          <SelectButton
            v-model="sortMode"
            :options="sortOptions"
            option-label="label"
            option-value="value"
            :allow-empty="false"
            @change="handleSortChange"
          />
        </div>
        <router-link v-slot="{ navigate }" to="/products/create" custom>
          <Button label="Tambah Produk" icon="pi pi-plus" size="small" @click="navigate" />
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <ProgressSpinner />
    </div>

    <EmptyState
      v-else-if="products.length === 0"
      icon="pi-box"
      title="No products yet"
      description="Create your first product to see it listed here."
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-surface-900 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      >
        <!-- Cover -->
        <div class="aspect-video bg-gray-100 dark:bg-surface-800">
          <img v-if="product.cover" :src="product.cover" :alt="product.name" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <i class="pi pi-image text-2xl text-gray-300 dark:text-gray-600" />
          </div>
        </div>

        <div class="flex-1 flex flex-col p-4">
          <div class="flex items-start justify-between gap-2">
            <router-link
              :to="`/products/${product.id}/edit`"
              class="font-semibold text-gray-900 dark:text-white hover:underline line-clamp-2"
            >
              {{ product.name }}
            </router-link>
            <span class="text-xs text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">#{{ product.order ?? 0 }}</span>
          </div>
          <p class="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">/{{ product.slug }}</p>
          <p v-if="product.tagline" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-2">
            {{ product.tagline }}
          </p>

          <div class="flex items-center gap-2 mt-3">
            <Tag :value="product.status" :severity="statusSeverity(product.status)" class="capitalize" />
            <span class="text-xs text-gray-400 dark:text-gray-500 ml-auto flex items-center gap-1">
              <i class="pi pi-clock text-xs" /> {{ new Date(product.updatedAt).toLocaleDateString() }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button
              v-if="product.status !== 'published'"
              icon="pi pi-send"
              label="Publish"
              size="small"
              text
              severity="success"
              @click="handlePublish(product.id)"
            />
            <Button
              v-if="product.status === 'published'"
              icon="pi pi-pause"
              label="Unpublish"
              size="small"
              text
              severity="warn"
              @click="handleUnpublish(product.id)"
            />
            <router-link v-slot="{ navigate }" :to="`/products/${product.id}/edit`" custom>
              <Button icon="pi pi-pencil" size="small" text rounded severity="info" title="Edit" @click="navigate" class="ml-auto" />
            </router-link>
            <Button
              v-if="product.status !== 'archived'"
              icon="pi pi-inbox"
              size="small"
              text
              rounded
              severity="danger"
              title="Archive"
              @click="handleArchive(product.id, product.name)"
            />
            <Button
              v-else
              icon="pi pi-replay"
              size="small"
              text
              rounded
              severity="secondary"
              title="Un-archive (restore to draft)"
              @click="handleRestore(product.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <AdminPagination
      :meta="meta"
      @change="(p) => productsStore.fetchProducts(p, meta.limit, sortField, sortDir)"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Button, Tag, Toast, ConfirmDialog, ProgressSpinner, SelectButton } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useProductStore, PUBLISH_FIELD_LABELS, type ProductStatus } from '../stores/product.store';
import EmptyState from '@/components/EmptyState.vue';
import AdminPagination from '@/components/AdminPagination.vue';

const productsStore = useProductStore();
const { products, meta, loading } = storeToRefs(productsStore);
const confirm = useConfirm();
const toast = useToast();

const sortOptions = [
  { label: 'Order', value: 'order' },
  { label: 'Recently updated', value: 'updatedAt' },
];
const sortMode = ref<'order' | 'updatedAt'>('order');
const sortField = ref<'order' | 'updatedAt'>('order');
const sortDir = ref<'asc' | 'desc' | undefined>(undefined);

onMounted(() => productsStore.fetchProducts(1, 10, sortField.value, sortDir.value));

function handleSortChange() {
  sortField.value = sortMode.value;
  sortDir.value = sortMode.value === 'updatedAt' ? 'desc' : 'asc';
  productsStore.fetchProducts(1, meta.value.limit, sortField.value, sortDir.value);
}

function statusSeverity(status: ProductStatus) {
  if (status === 'published') return 'success';
  if (status === 'archived') return 'danger';
  return 'warn';
}

function publishErrorDetail(err: unknown): string {
  const axiosErr = err as { response?: { data?: { fields?: string[]; message?: string } } };
  const fields = axiosErr.response?.data?.fields;
  if (fields?.length) {
    return `Missing: ${fields.map((f) => PUBLISH_FIELD_LABELS[f] ?? f).join(', ')}`;
  }
  return axiosErr.response?.data?.message || 'Publish failed';
}

async function handlePublish(id: string) {
  try {
    await productsStore.publishProduct(id);
    await productsStore.fetchProducts(meta.value.page, meta.value.limit, sortField.value, sortDir.value);
    toast.add({ severity: 'success', summary: 'Published', detail: 'Product is now live', life: 3000 });
  } catch (err: unknown) {
    toast.add({ severity: 'error', summary: 'Publish failed', detail: publishErrorDetail(err), life: 6000 });
  }
}

async function handleUnpublish(id: string) {
  await productsStore.unpublishProduct(id);
  await productsStore.fetchProducts(meta.value.page, meta.value.limit, sortField.value, sortDir.value);
  toast.add({ severity: 'info', summary: 'Unpublished', detail: 'Product moved to drafts', life: 3000 });
}

function handleArchive(id: string, name: string) {
  confirm.require({
    message: `Archive "${name}"? It will be hidden from the public site.`,
    header: 'Archive Product',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Archive', severity: 'danger' },
    accept: async () => {
      await productsStore.archiveProduct(id);
      await productsStore.fetchProducts(meta.value.page, meta.value.limit, sortField.value, sortDir.value);
      toast.add({ severity: 'success', summary: 'Archived', detail: 'Product has been archived', life: 3000 });
    },
  });
}

async function handleRestore(id: string) {
  await productsStore.restoreProduct(id);
  await productsStore.fetchProducts(meta.value.page, meta.value.limit, sortField.value, sortDir.value);
  toast.add({ severity: 'info', summary: 'Restored', detail: 'Product moved back to drafts', life: 3000 });
}
</script>
