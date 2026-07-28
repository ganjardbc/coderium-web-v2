import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/lib/api';
import type { UploadedMedia } from '@/components/MediaUploader.vue';

export interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  content?: string | null;
  type: string;
  tags?: string[];
  cover?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; avatarUrl?: string | null };
  attachedMedia?: UploadedMedia[];
}

export interface PostMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreatePostPayload {
  title: string;
  type: string;
  subtitle?: string;
  content?: string;
  tags?: string[];
  cover?: string;
  metaDescription?: string;
  metaKeywords?: string;
  isPublished?: boolean;
  mediaIds?: string[];
}

export const usePostStore = defineStore('posts', () => {
  const posts = ref<Post[]>([]);
  const meta = ref<PostMeta>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const loading = ref(false);

  async function fetchPosts(page = 1, limit = 10) {
    loading.value = true;
    try {
      const { data } = await api.get('/admin/posts', { params: { page, limit } });
      posts.value = data.data;
      meta.value = data.meta;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPostBySlug(slug: string): Promise<Post> {
    const { data } = await api.get(`/admin/posts/${slug}`);
    return data.data as Post;
  }

  async function createPost(payload: CreatePostPayload) {
    const { data } = await api.post('/admin/posts', payload);
    return data.data as Post;
  }

  async function updatePost(slug: string, payload: Partial<CreatePostPayload>) {
    const { data } = await api.put(`/admin/posts/${slug}`, payload);
    return data.data as Post;
  }

  async function deletePost(slug: string) {
    await api.delete(`/admin/posts/${slug}`);
  }

  async function publishPost(slug: string) {
    const { data } = await api.post(`/admin/posts/${slug}/publish`);
    return data.data as Post;
  }

  async function unpublishPost(slug: string) {
    const { data } = await api.post(`/admin/posts/${slug}/unpublish`);
    return data.data as Post;
  }

  return {
    posts,
    meta,
    loading,
    fetchPosts,
    fetchPostBySlug,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
  };
});
