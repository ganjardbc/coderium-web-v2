import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/lib/api';
import { usePostStore } from '@/modules/posts/stores/post.store';
import type { CreatePostPayload, Post } from '@/modules/posts/stores/post.store';

// `sourceUrl` already exists on the `Post` entity / backend `CreatePostDto`
// (added by the hermes-article-ingest feature) but is not yet reflected in the
// shared `CreatePostPayload` type. Extending it locally here avoids touching
// `modules/posts` (out of scope for this ticket) while keeping the payload typed.
type CreatePostWithSourceUrl = CreatePostPayload & { sourceUrl?: string };

export interface ArticlePreview {
  title: string;
  content: string;
  coverUrl: string;
  sourceUrl: string;
}

export type AiContentStatus = 'idle' | 'loading' | 'preview' | 'error';

const GENERIC_GENERATE_ERROR =
  'Gagal membuat artikel. Silakan coba lagi beberapa saat lagi.';
const GENERIC_COMMIT_ERROR =
  'Gagal menyimpan post. Silakan coba lagi.';

export const useAiContentStore = defineStore('ai-content', () => {
  const preview = ref<ArticlePreview | null>(null);
  const status = ref<AiContentStatus>('idle');
  const errorMessage = ref('');
  const committing = ref(false);
  const commitError = ref('');

  async function generateArticle() {
    status.value = 'loading';
    errorMessage.value = '';
    try {
      const { data } = await api.post('/admin/ai-content/generate');
      preview.value = data.data as ArticlePreview;
      status.value = 'preview';
    } catch (err) {
      console.error('[ai-content] generateArticle failed', err);
      preview.value = null;
      errorMessage.value = GENERIC_GENERATE_ERROR;
      status.value = 'error';
    }
  }

  function reset() {
    preview.value = null;
    status.value = 'idle';
    errorMessage.value = '';
    committing.value = false;
    commitError.value = '';
  }

  async function commitPost(isPublished: boolean): Promise<Post | undefined> {
    if (!preview.value) return undefined;

    committing.value = true;
    commitError.value = '';

    let coverUrl: string;
    try {
      const { data } = await api.post('/admin/ai-content/cover', {
        imageUrl: preview.value.coverUrl,
      });
      coverUrl = data.data.url as string;
    } catch (err) {
      console.error('[ai-content] cover upload failed', err);
      commitError.value = GENERIC_COMMIT_ERROR;
      committing.value = false;
      return undefined;
    }

    try {
      const postStore = usePostStore();
      const payload: CreatePostWithSourceUrl = {
        title: preview.value.title,
        content: preview.value.content,
        type: 'article',
        cover: coverUrl,
        sourceUrl: preview.value.sourceUrl,
        isPublished,
      };
      const post = await postStore.createPost(payload);

      reset();
      return post;
    } catch (err) {
      console.error('[ai-content] createPost failed', err);
      commitError.value = GENERIC_COMMIT_ERROR;
      committing.value = false;
      return undefined;
    }
  }

  return {
    preview,
    status,
    errorMessage,
    committing,
    commitError,
    generateArticle,
    reset,
    commitPost,
  };
});
