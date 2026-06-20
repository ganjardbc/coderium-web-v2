import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/lib/api';

export interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  content?: string | null;
  type: string;
  tags?: string[];
  cover?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; avatarUrl?: string | null };
}

export interface PostMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

  async function createPost(payload: { title: string; type: string; content?: string; subtitle?: string; tags?: string[]; cover?: string }) {
    const { data } = await api.post('/admin/posts', payload);
    return data.data as Post;
  }

  async function updatePost(slug: string, payload: Partial<Post>) {
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

  return { posts, meta, loading, fetchPosts, createPost, updatePost, deletePost, publishPost, unpublishPost };
});
