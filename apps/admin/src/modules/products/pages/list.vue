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

    <div v-else-if="products.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500">
      No products yet. Create your first product!
    </div>

    <DataTable
      v-else
      :value="products"
      class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
      stripedRows
    >
      <Column field="name" header="Name" class="min-w-48">
        <template #body="{ data }">
          <router-link :to="`/products/${data.id}/edit`" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            {{ data.name }}
          </router-link>
        </template>
      </Column>
      <Column field="slug" header="Slug" class="min-w-32">
        <template #body="{ data }">
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ data.slug }}</span>
        </template>
      </Column>
      <Column field="status" header="Status" class="w-32">
        <template #body="{ data }">
          <Tag :value="data.status" :severity="statusSeverity(data.status)" class="capitalize" />
        </template>
      </Column>
      <Column field="order" header="Order" class="w-20" />
      <Column field="updatedAt" header="Updated" class="w-36">
        <template #body="{ data }">
          {{ new Date(data.updatedAt).toLocaleDateString() }}
        </template>
      </Column>
      <Column header="Actions" class="w-44">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button
              v-if="data.status !== 'published'"
              icon="pi pi-send"
              size="small"
              text
              severity="success"
              title="Publish"
              @click="handlePublish(data.id)"
            />
            <Button
              v-if="data.status === 'published'"
              icon="pi pi-pause"
              size="small"
              text
              severity="warn"
              title="Unpublish"
              @click="handleUnpublish(data.id)"
            />
            <router-link v-slot="{ navigate }" :to="`/products/${data.id}/edit`" custom>
              <Button icon="pi pi-pencil" size="small" text severity="info" title="Edit" @click="navigate" />
            </router-link>
            <Button
              v-if="data.status !== 'archived'"
              icon="pi pi-inbox"
              size="small"
              text
              severity="danger"
              title="Archive"
              @click="handleArchive(data.id, data.name)"
            />
            <Button
              v-else
              icon="pi pi-replay"
              size="small"
              text
              severity="secondary"
              title="Un-archive (restore to draft)"
              @click="handleRestore(data.id)"
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
        @click="productsStore.fetchProducts(p, meta.limit, sortField, sortDir)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  DataTable,
  Column,
  Button,
  Tag,
  Toast,
  ConfirmDialog,
  ProgressSpinner,
  SelectButton,
} from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useProductStore, PUBLISH_FIELD_LABELS, type ProductStatus } from '../stores/product.store';

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
