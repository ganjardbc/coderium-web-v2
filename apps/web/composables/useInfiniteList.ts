import { ref, computed, watch, onBeforeUnmount, type Ref } from 'vue';

export interface InfiniteListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InfiniteListPage<T> {
  data: T[];
  meta: InfiniteListMeta;
}

/**
 * Client-side "load more on scroll" pagination on top of an already
 * page-based API. The first page is expected to come from `useAsyncData`
 * (SSR-friendly) and passed in as `initialData`; this composable only
 * fetches subsequent pages, triggered by an IntersectionObserver watching
 * the `sentinel` template ref placed at the end of the list.
 */
export function useInfiniteList<T>(
  fetchPage: (page: number) => Promise<InfiniteListPage<T>>,
  initialData?: InfiniteListPage<T> | null
) {
  const items = ref<T[]>(initialData?.data ?? []) as Ref<T[]>;
  const page = ref(initialData?.meta.page ?? 0);
  const totalPages = ref(initialData?.meta.totalPages ?? 1);
  const loading = ref(false);
  const failed = ref(false);
  const sentinel = ref<HTMLElement | null>(null);

  const finished = computed(() => totalPages.value > 0 && page.value >= totalPages.value);

  async function loadNext() {
    if (loading.value || finished.value) return;
    loading.value = true;
    failed.value = false;
    try {
      const nextPage = page.value + 1;
      const res = await fetchPage(nextPage);
      items.value.push(...res.data);
      page.value = res.meta.page;
      totalPages.value = res.meta.totalPages;
    } catch {
      failed.value = true;
    } finally {
      loading.value = false;
    }
  }

  /** Clear state and re-fetch page 1, e.g. after a search/filter change. */
  async function reset() {
    items.value = [];
    page.value = 0;
    totalPages.value = 1;
    failed.value = false;
    await loadNext();
  }

  let observer: IntersectionObserver | null = null;

  if (import.meta.client) {
    watch(
      sentinel,
      (el, oldEl) => {
        if (oldEl && observer) observer.unobserve(oldEl);
        if (!el) return;
        if (!observer) {
          observer = new IntersectionObserver(
            (entries) => {
              if (entries[0]?.isIntersecting) loadNext();
            },
            { rootMargin: '600px' }
          );
        }
        observer.observe(el);
      },
      { immediate: true }
    );
  }

  onBeforeUnmount(() => observer?.disconnect());

  return { items, loading, failed, finished, sentinel, loadNext, reset };
}
