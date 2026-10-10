<template>
  <div class="min-h-screen flex flex-col overflow-x-clip bg-white text-gray-900 dark:bg-dark dark:text-gray-100 transition-colors duration-200">
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
            class="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
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
          class="mt-3 flex items-center justify-center gap-1.5 min-h-11 px-4 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
          <span>Kirim email</span>
        </a>
      </nav>
    </header>

    <!-- Main Content Slot -->
    <main class="flex-1 min-w-0 w-full max-w-7xl mx-auto md:px-6 pb-6 md:py-8 flex flex-col">
      <slot />
    </main>

    <!-- Footer: light gray in light mode, neutral dark gray in dark mode. -->
    <footer class="bg-neutral-50 dark:bg-dark-secondary border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <!-- Centered on mobile, left-aligned columns from md up. -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center md:text-left">
          <div>
            <NuxtLink to="/" class="inline-flex items-center min-h-11" aria-label="Coderium, beranda">
              <img src="~/assets/logo-fill.png" class="h-8 md:h-10 dark:hidden" alt="Coderium" />
              <img src="~/assets/logo-white.png" class="h-8 md:h-10 hidden dark:block" alt="Coderium" />
            </NuxtLink>
            <p class="mt-2 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">AI agency untuk tim engineering.</p>
          </div>

          <nav v-for="column in footerColumns" :key="column.title" :aria-label="column.title">
            <h2 class="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">{{ column.title }}</h2>
            <ul class="mt-2 md:mt-4 md:space-y-3">
              <li v-for="item in column.items" :key="item.to">
                <NuxtLink
                  :to="item.to"
                  class="inline-flex items-center min-h-11 md:min-h-0 text-sm hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </nav>

          <div>
            <h2 class="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Kontak</h2>
            <a
              :href="contactMailto"
              class="mt-2 md:mt-4 inline-flex items-center min-h-11 md:min-h-0 text-sm font-semibold text-gray-900 dark:text-white underline underline-offset-4 hover:no-underline"
            >
              {{ CONTACT_EMAIL }}
            </a>
          </div>
        </div>

        <div class="mt-8 md:mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center md:flex-row md:justify-between gap-2 text-xs">
          <div>&copy; {{ new Date().getFullYear() }} Coderium</div>
          <div class="flex gap-6">
            <NuxtLink to="/terms" class="inline-flex items-center min-h-11 md:min-h-0 hover:text-gray-900 dark:hover:text-white transition-colors">Ketentuan</NuxtLink>
            <NuxtLink to="/privacy" class="inline-flex items-center min-h-11 md:min-h-0 hover:text-gray-900 dark:hover:text-white transition-colors">Privasi</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

// CONTACT_EMAIL and mailtoHref come from composables/useContact.ts.
const contactMailto = mailtoHref('Diskusi dengan Coderium');

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
      'Coderium adalah agency kecil yang memasang AI di tim engineering Indonesia, di server tim itu sendiri. Alatnya: CAF (Coderium Agent Framework) dan AI Code Reviewer.',
    founder: { '@type': 'Person', name: 'Ganjar Hadiatna' },
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
      target: `${siteUrl}/articles?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
]);

type NavRoute = { path: string };

const navItems = [
  { to: '/products', label: 'Produk', isActive: (route: NavRoute) => route.path.startsWith('/products') },
  { to: '/work-with-us', label: 'Kerja Sama', isActive: (route: NavRoute) => route.path === '/work-with-us' },
  {
    to: '/articles',
    label: 'Artikel',
    isActive: (route: NavRoute) => route.path.startsWith('/articles'),
  },
  { to: '/playlists', label: 'Series', isActive: (route: NavRoute) => route.path.startsWith('/playlists') },
];

const footerColumns = [
  {
    title: 'Layanan',
    items: [
      { to: '/products', label: 'Produk' },
      { to: '/work-with-us', label: 'Kerja Sama' },
    ],
  },
  {
    title: 'Perusahaan',
    items: [
      { to: '/about', label: 'Tentang' },
      { to: '/articles', label: 'Artikel' },
      { to: '/playlists', label: 'Series' },
    ],
  },
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
