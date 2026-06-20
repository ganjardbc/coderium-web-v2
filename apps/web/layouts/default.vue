<template>
  <div class="min-h-screen flex flex-col transition-colors duration-200">
    <!-- Header -->
    <header class="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <!-- Main nav row -->
      <nav class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <!-- Left: Logo -->
        <div class="flex items-center gap-6 flex-shrink-0">
          <NuxtLink to="/" class="text-xl font-bold tracking-tight text-gray-900">
            Coderium
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
              class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-colors"
              @keydown.esc="showSearch = false"
              @blur="showSearch = false"
            />
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <button
            v-else
            @click="openSearch"
            class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Search"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span class="hidden md:inline text-sm">Search</span>
          </button>
        </div>

        <!-- Right: Write + Dark mode -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <NuxtLink
            to="/admin"
            class="hidden md:inline-flex items-center px-4 py-1.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Write
          </NuxtLink>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 text-gray-500 hover:text-gray-900 transition-colors"
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
      <div class="no-scrollbar overflow-x-auto border-t border-gray-100">
        <div class="max-w-7xl mx-auto px-4 flex items-center gap-1 py-2">
          <NuxtLink
            v-for="topic in topics"
            :key="topic.label"
            :to="topic.href"
            class="flex-shrink-0 px-4 py-1.5 rounded-full border border-transparent text-sm text-gray-600 hover:text-gray-900 hover:border-gray-200 transition-colors whitespace-nowrap"
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
    <footer class="border-t border-gray-100 bg-white mt-16">
      <div class="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <div>&copy; {{ new Date().getFullYear() }} Coderium. All rights reserved.</div>
        <div class="flex gap-6">
          <NuxtLink to="/explore" class="hover:text-gray-600 transition-colors">Explore</NuxtLink>
          <NuxtLink to="/playlists" class="hover:text-gray-600 transition-colors">Series</NuxtLink>
          <a href="#" class="hover:text-gray-600 transition-colors">About</a>
          <a href="#" class="hover:text-gray-600 transition-colors">Privacy</a>
          <a href="#" class="hover:text-gray-600 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

const isDark = ref(false);
const showSearch = ref(false);
const searchValue = ref('');

const topics = [
  { label: 'For You', href: '/' },
  { label: 'Articles', href: '/explore?type=article' },
  { label: 'Carousels', href: '/explore?type=carousel' },
  { label: 'Videos', href: '/explore?type=video' },
  { label: 'Galleries', href: '/explore?type=stack_gallery' },
  { label: 'Series', href: '/playlists' },
];

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

async function openSearch() {
  showSearch.value = true;
  await nextTick();
  (document.querySelector('#header-search') as HTMLInputElement)?.focus();
}
</script>
