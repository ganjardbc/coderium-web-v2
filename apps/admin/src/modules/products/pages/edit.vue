<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Edit Product</h1>
        <p class="text-sm text-surface-400 mt-0.5">Update product details</p>
      </div>
      <router-link to="/products" class="flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary transition-colors">
        <i class="pi pi-arrow-left text-xs" />
        Back to Products
      </router-link>
    </div>

    <!-- Loading skeleton -->
    <div v-if="pageLoading" class="flex justify-center py-24">
      <div class="flex flex-col items-center gap-3 text-surface-400">
        <svg class="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p class="text-sm">Loading product…</p>
      </div>
    </div>

    <!-- Not found -->
    <div v-else-if="loadError" class="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-6 text-center">
      <i class="pi pi-exclamation-circle text-3xl text-red-500 mb-3" />
      <p class="text-sm font-medium text-red-700 dark:text-red-300">{{ loadError }}</p>
      <router-link to="/products" class="mt-3 inline-block text-sm text-primary hover:underline">
        Return to Products
      </router-link>
    </div>

    <!-- Form -->
    <ProductForm
      v-else
      :form="form"
      :loading="loading"
      :banner-fields="bannerFields"
      :error-message="errorMessage"
      :force-validate-lists="forceValidateLists"
      :auto-slug="false"
      cancel-to="/products"
      @submit-draft="handleSubmit('draft')"
      @submit-publish="handleSubmit('published')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ProductForm from '../components/ProductForm.vue';
import {
  useProductStore,
  createEmptyProductForm,
  productToFormData,
  toProductPayload,
  PUBLISH_FIELD_LABELS,
} from '../stores/product.store';

const router = useRouter();
const route = useRoute();
const productsStore = useProductStore();

const form = ref(createEmptyProductForm());
const pageLoading = ref(true);
const loadError = ref('');
const loading = ref(false);
const errorMessage = ref('');
const bannerFields = ref<string[]>([]);
const forceValidateLists = ref(false);

// NOTE: routing uses :id (not :slug) — the product admin endpoints route by
// id (apps/api products.controller.ts GET/PATCH /admin/products/:id),
// unlike the posts module which uses :slug.
const productId = route.params.id as string;

onMounted(async () => {
  try {
    const product = await productsStore.fetchProductById(productId);
    form.value = productToFormData(product);
  } catch {
    loadError.value = 'Product not found or you do not have permission to edit it.';
  } finally {
    pageLoading.value = false;
  }
});

async function handleSubmit(status: 'draft' | 'published') {
  errorMessage.value = '';
  bannerFields.value = [];
  forceValidateLists.value = status === 'published';
  loading.value = true;
  try {
    const payload = toProductPayload(form.value, status);
    await productsStore.updateProduct(productId, payload);
    router.push('/products');
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { fields?: string[]; message?: string } } };
    const fields = axiosErr.response?.data?.fields;
    if (fields?.length) {
      bannerFields.value = fields;
      errorMessage.value = `Publish failed. Missing: ${fields.map((f) => PUBLISH_FIELD_LABELS[f] ?? f).join(', ')}`;
    } else {
      errorMessage.value = axiosErr.response?.data?.message || 'Failed to update product';
    }
    // Do not redirect and do not reset form on failure — user input is preserved,
    // status stays whatever it was before this submit attempt.
  } finally {
    loading.value = false;
  }
}
</script>
