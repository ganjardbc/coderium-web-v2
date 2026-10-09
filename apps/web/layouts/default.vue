<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-dark dark:text-gray-100 transition-colors duration-200">
    <!-- Header (Top Menu) -->
    <header class="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-dark backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        <!-- Left: Logo + desktop menu -->
        <div class="flex items-center gap-6 lg:gap-8 min-w-0">
          <NuxtLink to="/" class="flex items-center shrink-0" aria-label="Coderium, beranda">
            <img src="~/assets/logo-fill.png" class="h-8 md:h-10 dark:hidden" alt="Coderium" />
            <img src="~/assets/logo-white.png" class="h-8 md:h-10 hidden dark:block" alt="Coderium" />
          </NuxtLink>

          <nav class="hidden md:flex items-center gap-1" aria-label="Menu utama">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="px-3 py-2 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-dark-secondary/50 transition-colors"
              :class="{ 'bg-gray-50 dark:bg-dark-secondary text-gray-900! dark:text-gray-100!': item.isActive($route) }"
              :aria-current="item.isActive($route) ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-1 md:gap-3 shrink-0">
          <a
            :href="contactMailto"
            class="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
            <span>Kirim email</span>
          </a>

          <!-- Dark Mode Toggle -->
          <button
            type="button"
            class="inline-flex items-center justify-center w-11 h-11 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors cursor-pointer"
            aria-label="Ganti mode gelap"
            @click="toggleDarkMode"
          >
            <Icon v-if="isDark" name="lucide:sun" class="w-5 h-5 text-yellow-400" />
            <Icon v-else name="lucide:moon" class="w-5 h-5 text-gray-600" />
          </button>

          <!-- Mobile menu toggle -->
          <button
            type="button"
            class="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer"
            :aria-expanded="menuOpen"
            aria-controls="mobile-menu"
            :aria-label="menuOpen ? 'Tutup menu' : 'Buka menu'"
            @click="menuOpen = !menuOpen"
          >
            <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile menu (collapsible) -->
      <nav
        v-show="menuOpen"
        id="mobile-menu"
        class="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-3"
        aria-label="Menu utama"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center min-h-11 px-3 rounded-lg text-base font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-dark-secondary/50 transition-colors"
          :class="{ 'bg-gray-50 dark:bg-dark-secondary text-gray-900! dark:text-gray-100!': item.isActive($route) }"
          :aria-current="item.isActive($route) ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>
        <a
          :href="contactMailto"
          class="mt-3 flex items-center justify-center gap-1.5 min-h-11 px-4 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
        >
          <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
          <span>Kirim email</span>
        </a>
      </nav>
    </header>

    <!-- Main Content Slot -->
    <main class="flex-1 min-w-0 w-full max-w-7xl mx-auto md:px-6 py-6 md:py-8 flex flex-col">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-dark">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <nav class="flex flex-col md:flex-row md:flex-wrap md:items-center md:gap-x-6 text-sm font-medium" aria-label="Footer">
            <NuxtLink
              v-for="item in footerItems"
              :key="item.to"
              :to="item.to"
              class="inline-flex items-center min-h-11 md:min-h-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
          <a
            :href="contactMailto"
            class="inline-flex items-center min-h-11 md:min-h-0 text-sm font-semibold text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline"
          >
            {{ CONTACT_EMAIL }}
          </a>
        </div>
        <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div>&copy; {{ new Date().getFullYear() }} Coderium</div>
          <div class="flex gap-6">
            <NuxtLink to="/terms" class="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</NuxtLink>
            <NuxtLink to="/privacy" class="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const CONTACT_EMAIL = 'hello@coderium.id';
const contactMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Diskusi pilot')}`;

// Site-wide structured data: lets Google understand the brand/organization
// and enables a sitelinks search box for "Coderium" queries.
const config = useRuntimeConfig();
const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '');

useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Coderium',
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
    description:
      'Coderium adalah AI agency untuk tim engineering, dengan dua produk: CAF (Coderium Agent Framework) dan AI Code Reviewer.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: CONTACT_EMAIL,
      availableLanguage: ['id'],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Coderium',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/explore?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
]);

type NavRoute = { path: string };

const navItems = [
  { to: '/products', label: 'Produk', isActive: (route: NavRoute) => route.path.startsWith('/products') },
  { to: '/kerja-sama', label: 'Kerja Sama', isActive: (route: NavRoute) => route.path === '/kerja-sama' },
  {
    to: '/explore',
    label: 'Artikel',
    isActive: (route: NavRoute) => route.path === '/explore' || route.path.startsWith('/posts'),
  },
  { to: '/playlists', label: 'Series', isActive: (route: NavRoute) => route.path.startsWith('/playlists') },
];

const footerItems = [
  { to: '/products', label: 'Produk' },
  { to: '/kerja-sama', label: 'Kerja Sama' },
  { to: '/explore', label: 'Artikel' },
  { to: '/about', label: 'Tentang' },
];

// Mobile menu: collapsed by default, closes again after navigating.
const menuOpen = ref(false);
const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  },
);

const isDark = ref(false);

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
