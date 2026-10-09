<template>
  <div class="page-shell">
    <div v-if="pending" class="space-y-6">
      <SkeletonBlock class="h-6 rounded-sm w-1/4" />
      <SkeletonBlock class="h-10 rounded-sm w-3/4" />
      <SkeletonBlock class="h-4 rounded-sm w-1/2" />
      <SkeletonBlock class="h-64 rounded-2xl w-full" />
    </div>

    <div v-else-if="error" class="text-center py-10 md:py-20">
      <h1 class="section-title">Series tidak ditemukan</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Series yang Anda cari mungkin sudah dihapus atau tidak lagi dipublikasikan.</p>
    </div>

    <div v-else-if="playlist" class="relative isolate">
      <!-- Decorative backdrop: same full-bleed grid and glow as the homepage hero. -->
      <div
        class="pointer-events-none absolute -top-6 md:-top-18 left-1/2 -z-10 h-144 w-screen -translate-x-1/2 overflow-hidden"
        aria-hidden="true"
      >
        <div class="hero-grid absolute inset-0" />
        <div class="hero-glow absolute -top-40 right-[8%] h-136 w-136 rounded-full blur-3xl" />
      </div>

      <!-- Back Link -->
      <BackButton
        label="Kembali"
        link-class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        class="mb-6 md:mb-8"
      />

      <!-- Series header -->
      <header class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 lg:items-center pb-10 md:pb-16 border-b border-gray-100 dark:border-gray-800">
        <div>
          <p class="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full border border-primary/20 bg-primary/5 dark:bg-indigo-300/10 px-3.5 py-1.5 font-mono text-xs font-medium text-primary dark:text-indigo-300">
            <span>Series</span>
            <span aria-hidden="true">&bull;</span>
            <span>{{ playlist.posts?.length || 0 }} artikel</span>
          </p>
          <h1 class="mt-5 md:mt-6 text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-balance text-gray-900 dark:text-white">
            {{ playlist.title }}
          </h1>
          <p v-if="playlist.description" class="mt-4 md:mt-5 text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ playlist.description }}
          </p>
          <div v-if="playlist.user?.name" class="mt-6 md:mt-8 flex items-center gap-3">
            <UserAvatar :name="playlist.user.name" size="md" />
            <div class="min-w-0">
              <p class="font-mono text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">Disusun oleh</p>
              <p class="text-base font-bold text-gray-900 dark:text-white">{{ playlist.user.name }}</p>
            </div>
          </div>
        </div>
        <div
          v-if="playlist.cover"
          class="w-full aspect-video rounded-2xl overflow-hidden bg-gray-50 dark:bg-dark-secondary ring-1 ring-primary/20 dark:ring-indigo-300/20 shadow-2xl shadow-primary/20"
        >
          <img :src="playlist.cover" :alt="playlist.title" class="w-full h-full object-cover" />
        </div>
      </header>

      <!-- Articles: ordered reading path as a vertical timeline -->
      <section class="py-10 md:py-16 border-b border-gray-100 dark:border-gray-800">
        <h2 class="section-title mb-6 md:mb-8">Artikel dalam series ini</h2>

        <EmptyState
          v-if="!playlist.posts || playlist.posts.length === 0"
          message="Belum ada artikel di series ini."
          padding="card py-6 md:py-8"
          center
        />

        <ol v-else>
          <li
            v-for="(item, index) in playlist.posts"
            :key="item.id"
            class="flex items-stretch gap-4 md:gap-5"
          >
            <!-- Rail: one continuous line through every item, with the node centred on its card. -->
            <div class="relative flex w-9 shrink-0 items-center justify-center" aria-hidden="true">
              <span
                v-if="playlist.posts.length > 1"
                class="absolute left-1/2 w-px -translate-x-1/2 bg-primary/25 dark:bg-indigo-300/25"
                :class="[index === 0 ? 'top-1/2' : 'top-0', index === playlist.posts.length - 1 ? 'bottom-1/2' : 'bottom-0']"
              />
              <span class="relative flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950 ring-1 ring-primary/40 dark:ring-indigo-300/40 shadow-[0_0_18px] shadow-primary/30 font-mono text-xs font-medium text-primary dark:text-indigo-300">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
            </div>

            <div class="min-w-0 flex-1 py-2 md:py-2.5">
              <div class="group glass-card relative flex items-center gap-4 p-4 md:p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                <div v-if="item.post.cover" class="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 bg-gray-50 dark:bg-dark-secondary">
                  <img :src="item.post.cover" :alt="item.post.title" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <span class="text-xs text-primary dark:text-indigo-300 font-bold uppercase tracking-wider">{{ postTypeLabel(item.post.type) }}</span>
                  <h3 class="mt-0.5 text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors leading-snug line-clamp-2">
                    <NuxtLink :to="`/articles/${item.post.slug}`" class="after:absolute after:inset-0">{{ item.post.title }}</NuxtLink>
                  </h3>
                </div>
                <Icon name="lucide:arrow-right" class="w-5 h-5 shrink-0 text-gray-400 dark:text-gray-700 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" aria-hidden="true" />
              </div>
            </div>
          </li>
        </ol>
      </section>

      <!-- More series -->
      <section class="py-10 md:py-16">
        <div class="card flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 md:p-10">
          <div>
            <p class="section-title">Cari bacaan lain?</p>
            <p class="mt-2 body-copy">Lihat series dan artikel lainnya dari Coderium.</p>
          </div>
          <NuxtLink to="/playlists" class="btn btn-solid gap-2 shrink-0">
            Lihat semua series
            <Icon name="lucide:arrow-right" class="w-4 h-4" aria-hidden="true" />
          </NuxtLink>
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
