<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100 flex">
    <ConfirmDialog />
    <Toast />

    <!-- Sidebar Backdrop for mobile -->
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 bg-black/40 z-40 md:hidden"
      @click="isMobileOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 top-0 z-50 w-64 bg-white dark:bg-dark border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 md:translate-x-0 md:sticky md:h-screen md:flex-shrink-0',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Brand Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 justify-between">
        <router-link to="/" class="flex items-center gap-2" @click="isMobileOpen = false">
          <span class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Coderium</span>
          <span class="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700">Admin</span>
        </router-link>
        <!-- Mobile close button -->
        <button
          class="md:hidden p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          @click="isMobileOpen = false"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        <div class="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase px-3 mb-2">Main Menu</div>

        <router-link
          to="/"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          :class="{ 'bg-gray-100! dark:bg-gray-800! text-gray-900! dark:text-white!': $route.path === '/' }"
          @click="isMobileOpen = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
          </svg>
          Dashboard
        </router-link>

        <router-link
          to="/posts"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          :class="{ 'bg-gray-100! dark:bg-gray-800! text-gray-900! dark:text-white!': $route.path.startsWith('/posts') }"
          @click="isMobileOpen = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Posts
        </router-link>

        <router-link
          to="/playlists"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          :class="{ 'bg-gray-100! dark:bg-gray-800! text-gray-900! dark:text-white!': $route.path.startsWith('/playlists') }"
          @click="isMobileOpen = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Playlists
        </router-link>

        <router-link
          to="/media"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          :class="{ 'bg-gray-100! dark:bg-gray-800! text-gray-900! dark:text-white!': $route.path.startsWith('/media') }"
          @click="isMobileOpen = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Media Library
        </router-link>

        <router-link
          to="/analytics"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          :class="{ 'bg-gray-100! dark:bg-gray-800! text-gray-900! dark:text-white!': $route.path.startsWith('/analytics') }"
          @click="isMobileOpen = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics
        </router-link>

        <router-link
          to="/users"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          :class="{ 'bg-gray-100! dark:bg-gray-800! text-gray-900! dark:text-white!': $route.path.startsWith('/users') }"
          @click="isMobileOpen = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Users
        </router-link>

        <div class="pt-4">
          <div class="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase px-3 mb-2">Settings</div>

          <router-link
            to="/settings/profile"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            :class="{ 'bg-gray-100! dark:bg-gray-800! text-gray-900! dark:text-white!': $route.path.startsWith('/settings/') }"
            @click="isMobileOpen = false"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            System Settings
          </router-link>

          <div v-if="$route.path.startsWith('/settings/')" class="pl-7 mt-1.5 space-y-1">
            <router-link
              to="/settings/profile"
              class="block px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="{ 'text-blue-600! dark:text-blue-400! font-semibold': $route.path === '/settings/profile' }"
            >Profile</router-link>
            <router-link
              to="/settings/password"
              class="block px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="{ 'text-blue-600! dark:text-blue-400! font-semibold': $route.path === '/settings/password' }"
            >Password</router-link>
            <router-link
              to="/settings/appearance"
              class="block px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="{ 'text-blue-600! dark:text-blue-400! font-semibold': $route.path === '/settings/appearance' }"
            >Appearance</router-link>
            <router-link
              to="/settings/two-factor"
              class="block px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="{ 'text-blue-600! dark:text-blue-400! font-semibold': $route.path === '/settings/two-factor' }"
            >Two-Factor Auth</router-link>
          </div>
        </div>
      </nav>

      <!-- User Info & Logout -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3 bg-gray-50 dark:bg-dark">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {{ userInitial }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ authStore.user?.name || 'Admin User' }}</p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 truncate">{{ authStore.user?.email || 'admin@coderium.com' }}</p>
          </div>
        </div>
        <button
          class="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
          title="Logout"
          @click="handleLogout"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header / Top Bar -->
      <header class="h-16 bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-30">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Trigger -->
          <button
            class="md:hidden p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            @click="isMobileOpen = true"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Breadcrumbs -->
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
            <span>Admin</span>
            <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-gray-900 dark:text-white font-semibold capitalize">{{ currentSectionName }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Dark mode toggle -->
          <button
            @click="toggleDark"
            class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg v-if="isDark" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.061-1.061L6.166 6.166z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
            </svg>
          </button>

          <a
            :href="webUrl"
            target="_blank"
            class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1.5 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Visit Site
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </header>

      <!-- Router View Slot -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useTheme } from '@/composables/useTheme';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const confirm = useConfirm();
const toast = useToast();
const { setTheme, currentTheme, isDark } = useTheme();

const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:5174';

const isMobileOpen = ref(false);

const userInitial = computed(() => {
  const name = authStore.user?.name || 'A';
  return name.charAt(0).toUpperCase();
});

const currentSectionName = computed(() => {
  const path = route.path;
  if (path === '/') return 'Dashboard';
  const segments = path.split('/').filter(Boolean);
  if (segments[0] === 'settings') return `Settings / ${segments[1] || ''}`;
  return segments[0] || 'Dashboard';
});

function toggleDark() {
  const next = isDark.value ? 'light' : 'dark';
  setTheme(next);
}

async function handleLogout() {
  confirm.require({
    message: 'Are you sure you want to logout?',
    header: 'Confirm Logout',
    icon: 'pi pi-sign-out',
    rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Logout', severity: 'danger' },
    accept: async () => {
      await authStore.logout();
      router.push({ name: 'login' });
    },
  });
}
</script>
