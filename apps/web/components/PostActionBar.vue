<template>
  <div
    class="flex items-center justify-between py-3"
    :class="bordered ? 'border-y border-gray-100 dark:border-gray-800 my-6' : 'my-4'"
  >
    <div class="flex items-center gap-6">
      <!-- Like Button -->
      <button
        @click="emit('toggle-like')"
        class="flex items-center gap-2 text-sm transition-colors cursor-pointer text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        :class="{ 'text-red-500!': liked, 'clap-animate': liked }"
      >
        <Icon name="lucide:heart" class="w-5 h-5" :class="{ 'fill-current': liked }" />
        <span>{{ likesCount }}</span>
      </button>

      <!-- Views Count -->
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Icon name="lucide:eye" class="w-5 h-5" />
        <span>{{ viewsCount }} views</span>
      </div>

      <span v-if="likeError" class="text-xs text-red-500 dark:text-red-400">Couldn't update like. Try again.</span>
    </div>

    <!-- Right Side: Share / Copy Link -->
    <div class="flex items-center gap-3">
      <button
        @click="emit('share')"
        class="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-secondary text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
        title="Copy Link"
      >
        <Icon name="lucide:share-2" class="w-5 h-5" />
      </button>
      <span v-if="copiedLink" class="text-xs text-green-600 dark:text-green-400 font-medium">Link copied!</span>
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
    bordered?: boolean;
  }>(),
  { bordered: true, likeError: false }
);

const emit = defineEmits<{ 'toggle-like': []; share: [] }>();
</script>
