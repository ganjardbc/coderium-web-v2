import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/lib/api';
import type { UploadedMedia } from '@/components/MediaUploader.vue';

export interface PipelineStep {
  title: string;
  description?: string;
}

export interface FeatureItem {
  title: string;
  description?: string;
}

export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  status: ProductStatus;
  cover?: string | null;
  pipelineSteps?: PipelineStep[];
  features?: FeatureItem[];
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  order?: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductPayload {
  name: string;
  slug?: string;
  tagline?: string;
  description?: string;
  status?: ProductStatus;
  cover?: string;
  pipelineSteps?: PipelineStep[];
  features?: FeatureItem[];
  ctaLabel?: string;
  ctaUrl?: string;
  order?: number;
  featured?: boolean;
}

/**
 * Human-readable labels for the `fields` array returned by the 400
 * "Validasi publish gagal" error thrown by `assertPublishable` in
 * apps/api/src/products/products.service.ts. Shared between the list page
 * (toast on failed inline publish) and create/edit pages (banner + field
 * highlight) so the mapping only lives in one place.
 */
export const PUBLISH_FIELD_LABELS: Record<string, string> = {
  cover: 'Cover image',
  ctaUrl: 'CTA URL (must be a valid URL)',
  pipelineSteps: 'Pipeline Steps (at least 1 item)',
  features: 'Features (at least 1 item)',
};

/**
 * Shape used internally by ProductForm.vue / create.vue / edit.vue. `cover`
 * is kept as MediaUploader's UploadedMedia[] on the client and converted to
 * a single string URL at submit time via `toProductPayload` — same pattern
 * used for the `cover` field in the posts module (see
 * apps/admin/src/modules/posts/pages/create.vue).
 */
export interface ProductFormData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  cover: UploadedMedia[];
  pipelineSteps: PipelineStep[];
  features: FeatureItem[];
  ctaLabel: string;
  ctaUrl: string;
  order: number;
  featured: boolean;
}

export function createEmptyProductForm(): ProductFormData {
  return {
    name: '',
    slug: '',
    tagline: '',
    description: '',
    cover: [],
    pipelineSteps: [],
    features: [],
    ctaLabel: '',
    ctaUrl: '',
    order: 0,
    featured: false,
  };
}

export function productToFormData(product: Product): ProductFormData {
  const coverMedia: UploadedMedia[] = product.cover
    ? [
        {
          id: '',
          url: product.cover,
          filename: 'cover',
          originalName: 'cover',
          mimeType: 'image/jpeg',
          size: 0,
        },
      ]
    : [];

  return {
    name: product.name,
    slug: product.slug,
    tagline: product.tagline || '',
    description: product.description || '',
    cover: coverMedia,
    pipelineSteps: product.pipelineSteps || [],
    features: product.features || [],
    ctaLabel: product.ctaLabel || '',
    ctaUrl: product.ctaUrl || '',
    order: product.order ?? 0,
    featured: product.featured ?? false,
  };
}

export function toProductPayload(form: ProductFormData, status: ProductStatus): ProductPayload {
  return {
    name: form.name,
    slug: form.slug || undefined,
    tagline: form.tagline || undefined,
    description: form.description || undefined,
    status,
    // MediaUploader v-model is an UploadedMedia[]; the API accepts a single
    // string URL for `cover` — same conversion pattern as posts create/edit.
    cover: form.cover.length > 0 ? form.cover[0].url : undefined,
    pipelineSteps: form.pipelineSteps.length ? form.pipelineSteps : undefined,
    features: form.features.length ? form.features : undefined,
    ctaLabel: form.ctaLabel || undefined,
    ctaUrl: form.ctaUrl || undefined,
    order: form.order,
    featured: form.featured,
  };
}

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const meta = ref<ProductMeta>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const loading = ref(false);

  async function fetchProducts(
    page = 1,
    limit = 10,
    sort: 'order' | 'updatedAt' = 'order',
    dir?: 'asc' | 'desc',
  ) {
    loading.value = true;
    try {
      const { data } = await api.get('/admin/products', { params: { page, limit, sort, dir } });
      products.value = data.data;
      meta.value = data.meta;
    } finally {
      loading.value = false;
    }
  }

  async function fetchProductById(id: string): Promise<Product> {
    const { data } = await api.get(`/admin/products/${id}`);
    return data.data as Product;
  }

  async function createProduct(payload: ProductPayload) {
    const { data } = await api.post('/admin/products', payload);
    return data.data as Product;
  }

  async function updateProduct(id: string, payload: Partial<ProductPayload>) {
    const { data } = await api.patch(`/admin/products/${id}`, payload);
    return data.data as Product;
  }

  // NOTE: publish/unpublish/archive/restore deliberately do NOT catch axios
  // errors here — a failed publish returns 400 with a structured `fields`
  // array (see PUBLISH_FIELD_LABELS above) that callers (list.vue,
  // create.vue, edit.vue) need to read from `err.response.data.fields` to
  // render a banner/toast. Swallowing or generalizing the error here would
  // lose that information.

  async function publishProduct(id: string) {
    const { data } = await api.post(`/admin/products/${id}/publish`);
    return data.data as Product;
  }

  async function unpublishProduct(id: string) {
    const { data } = await api.post(`/admin/products/${id}/unpublish`);
    return data.data as Product;
  }

  async function archiveProduct(id: string) {
    const { data } = await api.post(`/admin/products/${id}/archive`);
    return data.data as Product;
  }

  async function restoreProduct(id: string) {
    const { data } = await api.post(`/admin/products/${id}/restore`);
    return data.data as Product;
  }

  return {
    products,
    meta,
    loading,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    publishProduct,
    unpublishProduct,
    archiveProduct,
    restoreProduct,
  };
});
