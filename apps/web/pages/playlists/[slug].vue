<template>
  <div class="page-shell">
    <div v-if="pending" class="space-y-6">
      <SkeletonBlock class="h-6 rounded-sm w-1/4" />
      <SkeletonBlock class="h-10 rounded-sm w-3/4" />
      <SkeletonBlock class="h-4 rounded-sm w-1/2" />
      <SkeletonBlock class="h-64 rounded-2xl w-full" />
    </div>

    <div v-else-if="error" class="text-center py-10 md:py-20 bg-gray-50 dark:bg-dark-secondary rounded-2xl border dark:border-gray-800">
      <h1 class="section-title">Series tidak ditemukan</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Series yang Anda cari mungkin sudah dihapus atau tidak lagi dipublikasikan.</p>
    </div>

    <div v-else-if="playlist" class="space-y-8 md:space-y-12">
      <!-- Back Link -->
      <BackButton label="Kembali" link-class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />

      <!-- Playlist Info Header -->
      <header class="flex flex-col md:flex-row gap-6 md:gap-10 items-start pb-8 md:pb-12 border-b border-gray-100 dark:border-gray-800">
        <div v-if="playlist.cover" class="w-full md:w-64 aspect-square rounded-2xl overflow-hidden border dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-dark-secondary">
          <img :src="playlist.cover" :alt="playlist.title" class="w-full h-full object-cover" />
        </div>
        <div class="space-y-3 md:space-y-4 flex-1">
          <p class="text-sm font-bold uppercase tracking-wider text-primary dark:text-indigo-300">Series</p>
          <h1 class="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] text-balance text-gray-900 dark:text-white">{{ playlist.title }}</h1>
          <p v-if="playlist.description" class="body-copy max-w-2xl">{{ playlist.description }}</p>
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Oleh {{ playlist.user?.name }}</span>
            <span>&bull;</span>
            <span>{{ playlist.posts?.length || 0 }} artikel</span>
          </div>
        </div>
      </header>

      <!-- Playlist Posts List -->
      <section class="space-y-4 md:space-y-6">
        <h2 class="section-title">Artikel dalam series ini</h2>

        <EmptyState
          v-if="!playlist.posts || playlist.posts.length === 0"
          message="Belum ada artikel di series ini."
          padding="py-6 md:py-8 bg-gray-50 dark:bg-dark-secondary rounded-2xl border dark:border-gray-800"
        />

        <div v-else class="space-y-4">
          <div
            v-for="(item, index) in playlist.posts"
            :key="item.id"
            class="group card flex gap-3 md:gap-4 p-4 md:p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors relative"
          >
            <div class="text-xl md:text-2xl font-black text-gray-200 dark:text-gray-800 w-6 md:w-8 text-center shrink-0 flex items-center justify-center">
              {{ index + 1 }}
            </div>
            <div v-if="item.post.cover" class="w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 border dark:border-gray-800 bg-gray-50 dark:bg-dark-secondary">
              <img :src="item.post.cover" :alt="item.post.title" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0 flex flex-col justify-center">
              <span class="text-xs text-primary dark:text-indigo-300 font-bold uppercase tracking-wider">{{ postTypeLabel(item.post.type) }}</span>
              <h3 class="text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors mt-0.5 leading-snug line-clamp-2">
                <NuxtLink :to="`/posts/${item.post.slug}`" class="after:absolute after:inset-0">{{ item.post.title }}</NuxtLink>
              </h3>
            </div>
            <div class="flex items-center shrink-0 pr-1 md:pr-2">
              <Icon name="lucide:arrow-right" class="w-5 h-5 text-gray-400 dark:text-gray-700 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string;

const config = useRuntimeConfig();
const apiBase = config.public.apiBase as string;

interface Author {
  name: string;
}

interface PostItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  cover?: string | null;
}

interface PlaylistPostItem {
  id: string;
  postId: string;
  order: number;
  post: PostItem;
}

interface PlaylistData {
  id: string;
  title: string;
  description?: string | null;
  cover?: string | null;
  user?: Author;
  posts?: PlaylistPostItem[];
}

const { data: playlistRes, pending, error } = await useAsyncData<{ data: PlaylistData }>(
  `playlist-${slug}`,
  () => $fetch(`${apiBase}/playlists/${slug}`)
);
const playlist = computed(() => playlistRes.value?.data);

// Setup SEO
if (playlist.value) {
  const pl = playlist.value;
  useSeo({
    title: `${pl.title} - Series`,
    description: pl.description || undefined,
    image: pl.cover,
  });

  const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '');
  useJsonLd(
    breadcrumbJsonLd([
      { name: 'Beranda', url: siteUrl },
      { name: 'Series', url: `${siteUrl}/playlists` },
      { name: pl.title, url: `${siteUrl}/playlists/${slug}` },
    ])
  );
} else if (error.value) {
  if (import.meta.server) {
    const event = useRequestEvent();
    if (event) setResponseStatus(event, 404);
  }
  useHead({ meta: [{ name: 'robots', content: 'noindex' }] });
}
</script>
