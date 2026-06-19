<template>
  <div class="min-h-screen flex flex-col transition-colors duration-200">
    <!-- Header -->
    <header class="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <nav class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Coderium
          </NuxtLink>
          <div class="hidden md:flex items-center gap-6">
            <NuxtLink to="/explore" class="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
              Explore
            </NuxtLink>
            <NuxtLink to="/playlists" class="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
              Playlists
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-xl border bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            <span v-if="isDark" class="text-yellow-400">☀️</span>
            <span v-else class="text-indigo-600">🌙</span>
          </button>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t bg-white dark:bg-slate-950 transition-colors duration-200 mt-16">
      <div class="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-sm text-gray-500 dark:text-slate-400">
        <div>&copy; {{ new Date().getFullYear() }} Coderium. All rights reserved.</div>
        <div class="flex gap-6">
          <NuxtLink to="/explore" class="hover:underline">Explore</NuxtLink>
          <NuxtLink to="/playlists" class="hover:underline">Playlists</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(false);

onMounted(() => {
  // Check theme preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }
});

function toggleDarkMode() {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}
</script>
