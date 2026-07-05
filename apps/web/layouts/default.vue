<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-dark dark:text-gray-100 transition-colors duration-200 pb-16 md:pb-0">
    <!-- Header (Top Bar) -->
    <header class="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-dark backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        <!-- Left: Logo & Search Bar -->
        <div class="flex items-center gap-4 md:gap-6 flex-1 max-w-xl">
          <NuxtLink to="/" class="flex items-center flex-shrink-0">
            <img src="~/assets/logo-fill.png" class="h-6 md:h-7 dark:hidden" alt="Coderium" />
            <img src="~/assets/logo-white.png" class="h-6 md:h-7 hidden dark:block" alt="Coderium" />
          </NuxtLink>

          <!-- Search Input -->
          <div class="flex-1 max-w-xs relative hidden sm:block">
            <input
              id="header-search"
              v-model="searchValue"
              type="text"
              placeholder="Search..."
              class="w-full pl-9 pr-4 py-1.5 text-xs md:text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 focus:bg-white transition-all dark:border-gray-800 dark:bg-dark-secondary dark:text-gray-100 dark:focus:ring-gray-700/10 dark:focus:border-gray-700"
              @keydown.enter="handleSearch"
            />
            <Icon name="lucide:search" class="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <NuxtLink
            :to="adminUrl"
            external
            class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-xs md:text-sm font-medium transition-colors"
          >
            <Icon name="lucide:square-pen" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>Write</span>
          </NuxtLink>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            <Icon v-if="isDark" name="lucide:sun" class="w-4 h-4 md:w-5 h-5 text-yellow-400" />
            <Icon v-else name="lucide:moon" class="w-4 h-4 md:w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Outer Wrapper -->
    <div class="max-w-7xl w-full mx-auto px-4 md:px-6 flex flex-1">
      <!-- Left Sidebar (Desktop Only) -->
      <aside class="hidden md:block w-52 md:w-60 py-8 border-r border-gray-100 dark:border-gray-800 sticky top-16 h-[calc(105vh-4rem)] flex-shrink-0">
        <nav class="space-y-1.5 pr-4">
          <NuxtLink
            to="/"
            class="flex items-center gap-3 px-3 py-2.5 rounded-full text-base font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-dark-secondary/50 transition-all"
            :class="{ 'bg-gray-50 dark:bg-dark-secondary text-gray-900! dark:text-gray-100!': $route.path === '/' }"
          >
            <Icon name="lucide:home" class="w-5 h-5" />
            <span>Home</span>
          </NuxtLink>

          <NuxtLink
            to="/explore"
            class="flex items-center gap-3 px-3 py-2.5 rounded-full text-base font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-dark-secondary/50 transition-all"
            :class="{ 'bg-gray-50 dark:bg-dark-secondary text-gray-900! dark:text-gray-100!': $route.path === '/explore' }"
          >
            <Icon name="lucide:compass" class="w-8" />
            <span>Explore</span>
          </NuxtLink>

          <NuxtLink
            to="/playlists"
            class="flex items-center gap-3 px-3 py-2.5 rounded-full text-base font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-dark-secondary/50 transition-all"
            :class="{ 'bg-gray-50 dark:bg-dark-secondary text-gray-900! dark:text-gray-100!': $route.path.startsWith('/playlists') }"
          >
            <Icon name="lucide:library" class="w-8" />
            <span>Series</span>
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Content Slot -->
      <main class="flex-1 min-w-0 md:pl-8 lg:pl-12 py-6 md:py-8 flex flex-col">
        <slot />
      </main>
    </div>

    <!-- Footer -->
    <footer class="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-dark">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500">
        <div>&copy; {{ new Date().getFullYear() }} Coderium. All rights reserved.</div>
        <div class="flex gap-6">
          <NuxtLink to="/explore" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Explore</NuxtLink>
          <NuxtLink to="/playlists" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Series</NuxtLink>
          <a href="#" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">About</a>
          <a href="#" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</a>
        </div>
      </div>
    </footer>

    <!-- Mobile Bottom Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark/95 border-t border-gray-200 dark:border-gray-800 backdrop-blur-md md:hidden flex justify-around items-center py-2 px-6">
      <NuxtLink
        to="/"
        class="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        :class="{ 'text-gray-900 dark:text-gray-100 font-semibold': $route.path === '/' }"
      >
        <Icon name="lucide:home" class="w-5 h-5" />
        <span class="text-[10px]">Home</span>
      </NuxtLink>

      <NuxtLink
        to="/explore"
        class="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        :class="{ 'text-gray-900 dark:text-gray-100 font-semibold': $route.path === '/explore' }"
      >
        <Icon name="lucide:compass" class="w-5 h-5" />
        <span class="text-[10px]">Explore</span>
      </NuxtLink>

      <NuxtLink
        to="/playlists"
        class="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        :class="{ 'text-gray-900 dark:text-gray-100 font-semibold': $route.path.startsWith('/playlists') }"
      >
        <Icon name="lucide:library" class="w-5 h-5" />
        <span class="text-[10px]">Series</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5173';

const isDark = ref(false);
const searchValue = ref('');

function handleSearch() {
  if (searchValue.value.trim()) {
    router.push({ path: '/explore', query: { q: searchValue.value.trim() } });
  }
}

onMounted(() => {
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
