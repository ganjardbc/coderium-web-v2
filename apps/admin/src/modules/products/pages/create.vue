<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">New Product</h1>
        <p class="text-sm text-surface-400 mt-0.5">Create a new product entry</p>
      </div>
      <router-link to="/products" class="flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary transition-colors">
        <i class="pi pi-arrow-left text-xs" />
        Back to Products
      </router-link>
    </div>

    <ProductForm
      :form="form"
      :loading="loading"
      :banner-fields="bannerFields"
      :error-message="errorMessage"
      :force-validate-lists="forceValidateLists"
      :auto-slug="true"
      cancel-to="/products"
      @submit-draft="handleSubmit('draft')"
      @submit-publish="handleSubmit('published')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ProductForm from '../components/ProductForm.vue';
import {
  useProductStore,
  createEmptyProductForm,
  toProductPayload,
  PUBLISH_FIELD_LABELS,
} from '../stores/product.store';

const router = useRouter();
const productsStore = useProductStore();

const form = ref(createEmptyProductForm());
const loading = ref(false);
const errorMessage = ref('');
const bannerFields = ref<string[]>([]);
const forceValidateLists = ref(false);

async function handleSubmit(status: 'draft' | 'published') {
  errorMessage.value = '';
  bannerFields.value = [];
  forceValidateLists.value = status === 'published';
  loading.value = true;
  try {
    const payload = toProductPayload(form.value, status);
    await productsStore.createProduct(payload);
    router.push('/products');
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { fields?: string[]; message?: string } } };
    const fields = axiosErr.response?.data?.fields;
    if (fields?.length) {
      bannerFields.value = fields;
      errorMessage.value = `Publish failed. Missing: ${fields.map((f) => PUBLISH_FIELD_LABELS[f] ?? f).join(', ')}`;
    } else {
      errorMessage.value = axiosErr.response?.data?.message || 'Failed to create product';
    }
    // Do not redirect and do not reset form on failure — user input is preserved.
  } finally {
    loading.value = false;
  }
}
</script>
