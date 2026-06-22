<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark px-4 py-12 relative transition-colors duration-200">
    <!-- Theme Toggle Button -->
    <div class="absolute top-4 right-4 z-50">
      <button
        @click="toggleDark"
        class="p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <svg v-if="isDark" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.061-1.061L6.166 6.166z"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>

    <div class="w-full max-w-md space-y-4">
      <div class="flex justify-center">
        <img src="@/assets/logo-fill.png" alt="Coderium Logo" class="h-12 w-auto object-contain dark:hidden" />
        <img src="@/assets/logo-white.png" alt="Coderium Logo" class="h-12 w-auto object-contain hidden dark:block" />
      </div>

      <Card class="border-0 dark:border-0 shadow-sm py-4">
        <template #content>
          <slot />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import { useTheme } from '@/composables/useTheme';

const { setTheme, isDark } = useTheme();

function toggleDark() {
  const next = isDark.value ? 'light' : 'dark';
  setTheme(next);
}
</script>

