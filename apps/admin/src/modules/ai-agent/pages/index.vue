<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">AI Agent</h1>
      <p class="text-sm text-surface-400 mt-0.5">
        Generate content automatically using AI. Pick a content type to get started.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="card in cards"
        :key="card.type"
        class="relative rounded-xl border p-5 flex flex-col items-start gap-3 transition-all"
        :class="card.enabled
          ? 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 cursor-pointer hover:border-primary hover:shadow-md'
          : 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 opacity-50 cursor-not-allowed'"
        @click="card.enabled ? handleCardClick(card) : undefined"
      >
        <span
          v-if="!card.enabled"
          class="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-300"
        >
          Segera Hadir
        </span>

        <div
          class="w-11 h-11 rounded-lg flex items-center justify-center"
          :class="card.enabled ? 'bg-primary/10 text-primary' : 'bg-surface-200 dark:bg-surface-700 text-surface-400'"
        >
          <i :class="['pi', card.icon, 'text-xl']" />
        </div>

        <div>
          <h2 class="text-sm font-semibold text-surface-800 dark:text-surface-100">{{ card.label }}</h2>
          <p class="text-xs text-surface-400 mt-0.5">{{ card.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface AiCard {
  type: 'article' | 'carousel' | 'video' | 'stack_gallery';
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
}

const cards: AiCard[] = [
  {
    type: 'article',
    label: 'Article',
    description: 'Generate a trending article, rewritten in Bahasa Indonesia.',
    icon: 'pi-file-edit',
    enabled: true,
  },
  {
    type: 'carousel',
    label: 'Carousel',
    description: 'Generate a carousel post from trending content.',
    icon: 'pi-images',
    enabled: false,
  },
  {
    type: 'video',
    label: 'Video',
    description: 'Generate a video post from trending content.',
    icon: 'pi-video',
    enabled: false,
  },
  {
    type: 'stack_gallery',
    label: 'Stack Gallery',
    description: 'Generate a stack gallery post from trending content.',
    icon: 'pi-clone',
    enabled: false,
  },
];

const router = useRouter();

function handleCardClick(card: AiCard) {
  if (card.type !== 'article') return;
  router.push('/ai-agent/article/preview');
}
</script>
