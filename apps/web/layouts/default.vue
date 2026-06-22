<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-200">
    <!-- Header -->
    <header class="border-b border-gray-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <!-- Main nav row -->
      <nav class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <!-- Left: Logo -->
        <div class="flex items-center gap-6 flex-shrink-0">
          <NuxtLink to="/" class="flex items-center">
            <img src="~/assets/logo-fill.png" class="h-8 dark:hidden" alt="Coderium" />
            <img src="~/assets/logo-white.png" class="h-8 hidden dark:block" alt="Coderium" />
          </NuxtLink>
        </div>

        <!-- Center: Search -->
        <div class="flex-1 max-w-sm">
          <div v-if="showSearch" class="relative">
            <input
              id="header-search"
              v-model="searchValue"
              type="text"
              placeholder="Search..."
              class="w-full pl-9 pr-8 py-1.5 text-sm border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-500 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-500/20 dark:focus:border-slate-500"
              @keydown.esc="showSearch = false"
              @blur="onSearchBlur"
            />
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <button
              @mousedown.prevent
              @click="showSearch = false"
              class="absolute right-2.5 top-2 p-0.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              title="Close search"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <button
            v-else
            @click="openSearch"
            class="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-sm text-gray-400 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-full transition-all duration-200 dark:bg-slate-900/50 dark:border-slate-800/80 dark:text-slate-500 dark:hover:bg-slate-900"
            aria-label="Search"
          >
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span class="text-xs">Search...</span>
            </div>
            <kbd class="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded-md shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
              {{ isMac ? '⌘K' : 'Ctrl+K' }}
            </kbd>
          </button>
        </div>

        <!-- Right: Write + Dark mode -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <NuxtLink
            :to="adminUrl"
            external
            class="hidden md:inline-flex items-center px-4 py-1.5 rounded-full bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-slate-200 transition-colors"
          >
            Write
          </NuxtLink>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            aria-label="Toggle dark mode"
          >
            <!-- Sun icon (shown in dark mode) -->
            <svg v-if="isDark" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.061-1.061L6.166 6.166z"/>
            </svg>
            <!-- Moon icon (shown in light mode) -->
            <svg v-else class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </nav>

      <!-- Topic strip -->
      <div class="no-scrollbar overflow-x-auto border-t border-gray-100 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-4 flex items-center gap-1 py-2">
          <NuxtLink
            v-for="topic in topics"
            :key="topic.label"
            :to="topic.href"
            class="flex-shrink-0 px-4 py-1.5 rounded-full border border-transparent text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-200 dark:hover:border-slate-850 transition-colors whitespace-nowrap"
          >
            {{ topic.label }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-slate-500">
        <div>&copy; {{ new Date().getFullYear() }} Coderium. All rights reserved.</div>
        <div class="flex gap-6">
          <NuxtLink to="/explore" class="hover:text-gray-600 dark:hover:text-slate-350 transition-colors">Explore</NuxtLink>
          <NuxtLink to="/playlists" class="hover:text-gray-600 dark:hover:text-slate-350 transition-colors">Series</NuxtLink>
          <a href="#" class="hover:text-gray-600 dark:hover:text-slate-350 transition-colors">About</a>
          <a href="#" class="hover:text-gray-600 dark:hover:text-slate-350 transition-colors">Privacy</a>
          <a href="#" class="hover:text-gray-600 dark:hover:text-slate-350 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5173';

const isDark = ref(false);
const showSearch = ref(false);
const searchValue = ref('');
const isMac = ref(false);

const topics = [
  { label: 'For You', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Series', href: '/playlists' },
];

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
}

onMounted(() => {
  isMac.value = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }

  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
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

async function openSearch() {
  showSearch.value = true;
  await nextTick();
  (document.querySelector('#header-search') as HTMLInputElement)?.focus();
}

function onSearchBlur() {
  setTimeout(() => {
    if (!searchValue.value) {
      showSearch.value = false;
    }
  }, 150);
}
</script>
