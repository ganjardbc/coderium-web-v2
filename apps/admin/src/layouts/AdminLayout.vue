<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 flex">
    <!-- Sidebar Backdrop for mobile -->
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 bg-black/40 z-40 md:hidden"
      @click="isMobileOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:h-screen md:flex-shrink-0',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Brand Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-200 justify-between">
        <router-link to="/" class="flex items-center gap-2" @click="isMobileOpen = false">
          <span class="text-xl font-bold tracking-tight text-gray-900">Coderium</span>
          <span class="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-700 rounded-md border border-gray-200">Admin</span>
        </router-link>
        <!-- Mobile close button -->
        <button
          class="md:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100"
          @click="isMobileOpen = false"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        <div class="text-[10px] font-bold text-gray-400 tracking-wider uppercase px-3 mb-2">Main Menu</div>

        <!-- Dashboard -->
        <router-link
          to="/"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          :class="{ 'bg-gray-100! text-gray-900!': $route.path === '/' }"
          @click="isMobileOpen = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
          </svg>
          Dashboard
        </router-link>

        <!-- Posts -->
        <router-link
          to="/posts"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          :class="{ 'bg-gray-100! text-gray-900!': $route.path.startsWith('/posts') }"
          @click="isMobileOpen = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Posts
        </router-link>

        <!-- Playlists/Series -->
        <router-link
          to="/playlists"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          :class="{ 'bg-gray-100! text-gray-900!': $route.path.startsWith('/playlists') }"
          @click="isMobileOpen = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Playlists
        </router-link>

        <!-- Media Library -->
        <router-link
          to="/media"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          :class="{ 'bg-gray-100! text-gray-900!': $route.path.startsWith('/media') }"
          @click="isMobileOpen = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Media Library
        </router-link>

        <!-- Analytics -->
        <router-link
          to="/analytics"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          :class="{ 'bg-gray-100! text-gray-900!': $route.path.startsWith('/analytics') }"
          @click="isMobileOpen = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics
        </router-link>

        <!-- Users -->
        <router-link
          to="/users"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          :class="{ 'bg-gray-100! text-gray-900!': $route.path.startsWith('/users') }"
          @click="isMobileOpen = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Users
        </router-link>

        <div class="pt-4">
          <div class="text-[10px] font-bold text-gray-400 tracking-wider uppercase px-3 mb-2">Settings</div>
          
          <!-- Settings Group -->
          <router-link
            to="/settings/profile"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            :class="{ 'bg-gray-100! text-gray-900!': $route.path.startsWith('/settings/') }"
            @click="isMobileOpen = false"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            System Settings
          </router-link>

          <!-- Settings sub-tabs shown only when in settings view -->
          <div v-if="$route.path.startsWith('/settings/')" class="pl-7 mt-1.5 space-y-1">
            <router-link
              to="/settings/profile"
              class="block px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              :class="{ 'text-blue-600! font-semibold': $route.path === '/settings/profile' }"
            >
              Profile
            </router-link>
            <router-link
              to="/settings/password"
              class="block px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              :class="{ 'text-blue-600! font-semibold': $route.path === '/settings/password' }"
            >
              Password
            </router-link>
            <router-link
              to="/settings/appearance"
              class="block px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              :class="{ 'text-blue-600! font-semibold': $route.path === '/settings/appearance' }"
            >
              Appearance
            </router-link>
            <router-link
              to="/settings/two-factor"
              class="block px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              :class="{ 'text-blue-600! font-semibold': $route.path === '/settings/two-factor' }"
            >
              Two-Factor Auth
            </router-link>
          </div>
        </div>
      </nav>

      <!-- User Info & Logout -->
      <div class="p-4 border-t border-gray-200 flex items-center justify-between gap-3 bg-gray-50">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {{ userInitial }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-semibold text-gray-900 truncate">{{ authStore.user?.name || 'Admin User' }}</p>
            <p class="text-[10px] text-gray-500 truncate">{{ authStore.user?.email || 'admin@coderium.com' }}</p>
          </div>
        </div>
        <button
          class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Trigger -->
          <button
            class="md:hidden p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
            @click="isMobileOpen = true"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Breadcrumbs / Section Title -->
          <div class="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <span>Admin</span>
            <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-gray-900 font-semibold capitalize">{{ currentSectionName }}</span>
          </div>
        </div>

        <!-- Quick actions / Visit site link -->
        <div class="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            class="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
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

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isMobileOpen = ref(false);

const userInitial = computed(() => {
  const name = authStore.user?.name || 'A';
  return name.charAt(0).toUpperCase();
});

const currentSectionName = computed(() => {
  const path = route.path;
  if (path === '/') return 'Dashboard';
  
  const segments = path.split('/').filter(Boolean);
  if (segments[0] === 'settings') {
    return `Settings / ${segments[1] || ''}`;
  }
  return segments[0] || 'Dashboard';
});

async function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    await authStore.logout();
    router.push({ name: 'login' });
  }
}
</script>
