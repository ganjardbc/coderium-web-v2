<template>
  <div class="fixed z-40 flex flex-col items-center bottom-20 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:right-6 md:top-1/2 md:-translate-y-1/2">
    <!-- Toast: like error / link copied -->
    <Transition name="fade">
      <span
        v-if="likeError || copiedLink"
        class="mb-2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-sm"
        :class="likeError
          ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
          : 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400'"
      >
        {{ likeError ? "Couldn't update like. Try again." : 'Link copied!' }}
      </span>
    </Transition>

    <div class="flex items-center gap-5 px-5 py-2.5 rounded-full bg-white/95 dark:bg-dark-secondary/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg md:flex-col md:gap-4 md:px-2.5 md:py-5">
      <!-- Like Button -->
      <button
        @click="emit('toggle-like')"
        class="flex items-center gap-2 md:flex-col md:gap-1 text-sm transition-colors cursor-pointer text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        :class="{ 'text-red-500!': liked, 'clap-animate': liked }"
      >
        <Icon name="lucide:heart" class="w-5 h-5" :class="{ 'fill-current': liked }" />
        <span>{{ likesCount }}</span>
      </button>

      <div class="w-px h-4 md:w-4 md:h-px bg-gray-200 dark:bg-gray-700" />

      <!-- Views Count -->
      <div class="flex items-center gap-2 md:flex-col md:gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Icon name="lucide:eye" class="w-5 h-5" />
        <span>{{ viewsCount }}</span>
      </div>

      <div class="w-px h-4 md:w-4 md:h-px bg-gray-200 dark:bg-gray-700" />

      <!-- Share / Copy Link -->
      <button
        @click="emit('share')"
        class="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
        title="Copy Link"
      >
        <Icon name="lucide:share-2" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    likesCount: number;
    viewsCount: number;
    liked: boolean;
    likeLoading: boolean;
    copiedLink: boolean;
    likeError?: boolean;
  }>(),
  { likeError: false }
);

const emit = defineEmits<{ 'toggle-like': []; share: [] }>();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
