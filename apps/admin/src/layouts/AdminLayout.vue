<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100 flex">
    <ConfirmDialog />
    <Toast />

    <!-- Desktop Sidebar (persistent, always visible md+) -->
    <aside
      class="hidden md:flex md:sticky md:top-0 md:h-screen md:shrink-0 w-64 bg-white dark:bg-dark-secondary border-r border-gray-200 dark:border-gray-700 flex-col"
    >
      <!-- Brand Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 justify-between">
        <router-link to="/" class="flex items-center gap-2">
          <img src="@/assets/logo-fill.png" alt="Coderium Logo" class="h-8 w-auto object-contain dark:hidden" />
          <img src="@/assets/logo-white.png" alt="Coderium Logo" class="h-8 w-auto object-contain hidden dark:block" />
          <span class="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700">Admin</span>
        </router-link>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        <div
          v-for="(section, idx) in menuSectionModels"
          :key="section.title"
          :class="{ 'pt-4': idx > 0 }"
        >
          <div class="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase px-3 mb-2">
            {{ section.title }}
          </div>

          <PanelMenu :model="section.items" :expandedKeys="expandedKeys" :pt="panelMenuPt" class="admin-panelmenu">
            <template #item="{ item, root }">
              <router-link
                :to="item.original.to"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="root
                  ? { 'bg-gray-100! dark:bg-gray-800! text-gray-900! dark:text-white!': isMenuItemActive(item.original) }
                  : ['pl-4! py-1.5! text-xs!', { 'text-blue-600! dark:text-blue-400! font-semibold': isSubmenuItemActive(item.original) }]"
              >
                <i v-if="root && item.icon" :class="['pi', item.icon, 'text-sm']"></i>
                {{ item.label }}
              </router-link>
            </template>
          </PanelMenu>
        </div>
      </nav>

      <!-- User Info & Logout -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3 bg-gray-50 dark:bg-dark-secondary">
        <div class="flex items-center gap-3 overflow-hidden">
          <Avatar
            :image="!avatarError ? (authStore.user?.avatarUrl ?? undefined) : undefined"
            :label="(!authStore.user?.avatarUrl || avatarError) ? userInitial : undefined"
            shape="circle"
            class="w-9! h-9! bg-blue-600! text-white! font-bold! text-sm! shrink-0"
            @error="avatarError = true"
          />
          <div class="overflow-hidden">
            <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ authStore.user?.name || '-' }}</p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 truncate">{{ authStore.user?.email || '-' }}</p>
          </div>
        </div>
        <Button
          icon="pi pi-sign-out"
          text
          rounded
          severity="danger"
          aria-label="Logout"
          title="Logout"
          @click="handleLogout"
        />
      </div>
    </aside>

    <!-- Mobile Sidebar Drawer -->
    <Drawer v-model:visible="isMobileOpen" position="left" class="w-64! md:hidden" :showCloseIcon="false">
      <template #container="{ closeCallback }">
        <div class="flex flex-col h-full">
          <!-- Brand Logo -->
          <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 justify-between shrink-0">
            <router-link to="/" class="flex items-center gap-2" @click="closeCallback">
              <img src="@/assets/logo-fill.png" alt="Coderium Logo" class="h-8 w-auto object-contain dark:hidden" />
              <img src="@/assets/logo-white.png" alt="Coderium Logo" class="h-8 w-auto object-contain hidden dark:block" />
              <span class="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700">Admin</span>
            </router-link>
            <Button
              icon="pi pi-times"
              text
              rounded
              class="text-gray-500! dark:text-gray-400!"
              aria-label="Close menu"
              @click="closeCallback"
            />
          </div>

          <!-- Navigation Links -->
          <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
            <div
              v-for="(section, idx) in menuSectionModels"
              :key="section.title"
              :class="{ 'pt-4': idx > 0 }"
            >
              <div class="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase px-3 mb-2">
                {{ section.title }}
              </div>

              <PanelMenu :model="section.items" :expandedKeys="expandedKeys" :pt="panelMenuPt" class="admin-panelmenu">
                <template #item="{ item, root }">
                  <router-link
                    :to="item.original.to"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    :class="root
                      ? { 'bg-gray-100! dark:bg-gray-800! text-gray-900! dark:text-white!': isMenuItemActive(item.original) }
                      : ['pl-4! py-1.5! text-xs!', { 'text-blue-600! dark:text-blue-400! font-semibold': isSubmenuItemActive(item.original) }]"
                    @click="closeCallback"
                  >
                    <i v-if="root && item.icon" :class="['pi', item.icon, 'text-sm']"></i>
                    {{ item.label }}
                  </router-link>
                </template>
              </PanelMenu>
            </div>
          </nav>

          <!-- User Info & Logout -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3 bg-gray-50 dark:bg-dark shrink-0">
            <div class="flex items-center gap-3 overflow-hidden">
              <Avatar
                :image="!avatarError ? (authStore.user?.avatarUrl ?? undefined) : undefined"
                :label="(!authStore.user?.avatarUrl || avatarError) ? userInitial : undefined"
                shape="circle"
                class="w-9! h-9! bg-blue-600! text-white! font-bold! text-sm! shrink-0"
                @error="avatarError = true"
              />
              <div class="overflow-hidden">
                <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ authStore.user?.name || 'Admin User' }}</p>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 truncate">{{ authStore.user?.email || 'admin@coderium.com' }}</p>
              </div>
            </div>
            <Button
              icon="pi pi-sign-out"
              text
              rounded
              severity="danger"
              aria-label="Logout"
              title="Logout"
              @click="handleLogout"
            />
          </div>
        </div>
      </template>
    </Drawer>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header / Top Bar -->
      <header class="h-16 bg-white dark:bg-dark-secondary border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-30">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Trigger -->
          <Button
            icon="pi pi-bars"
            text
            rounded
            class="md:hidden! text-gray-600! dark:text-gray-300! border! border-gray-200! dark:border-gray-700!"
            aria-label="Open menu"
            @click="isMobileOpen = true"
          />

          <!-- Back button -->
          <Button
            v-if="backTo"
            icon="pi pi-arrow-left"
            text
            rounded
            class="text-gray-500! dark:text-gray-400!"
            aria-label="Back"
            title="Back"
            @click="router.push(backTo)"
          />

          <!-- Breadcrumbs -->
          <Breadcrumb :model="breadcrumbItems" class="admin-breadcrumb">
            <template #item="{ item }">
              <span
                class="text-sm font-medium"
                :class="item.current ? 'text-gray-900 dark:text-white font-semibold capitalize' : 'text-gray-500 dark:text-gray-400'"
              >
                {{ item.label }}
              </span>
            </template>
          </Breadcrumb>
        </div>

        <div class="flex items-center gap-3">
          <!-- Dark mode toggle -->
          <Button
            :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            text
            rounded
            :class="isDark ? 'text-yellow-400!' : 'text-gray-500! dark:text-gray-400!'"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleDark"
          />

          <Button
            as="a"
            :href="webUrl"
            target="_blank"
            label="Visit Site"
            icon="pi pi-external-link"
            iconPos="right"
            text
            size="small"
            class="text-xs! border! border-gray-200! dark:border-gray-700!"
          />
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

const webUrl = import.meta.env.VITE_WEB_URL || 'https://coderium.id';

interface SubmenuItem {
  label: string;
  to: string;
}

interface MenuItem {
  label: string;
  to: string;
  activeMatch?: string;
  submenu?: SubmenuItem[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Main Menu',
    items: [
      {
        label: 'Dashboard',
        to: '/'
      },
      {
        label: 'Posts',
        to: '/posts'
      },
      {
        label: 'Products',
        to: '/products'
      },
      {
        label: 'Playlists',
        to: '/playlists'
      },
      {
        label: 'Media Library',
        to: '/media'
      },
      {
        label: 'Users',
        to: '/users'
      }
    ]
  },
  {
    title: 'Settings',
    items: [
      {
        label: 'System Settings',
        to: '/settings/profile',
        activeMatch: '/settings/',
        submenu: [
          { label: 'Profile', to: '/settings/profile' },
          { label: 'Password', to: '/settings/password' },
          { label: 'Appearance', to: '/settings/appearance' },
          { label: 'Two-Factor Auth', to: '/settings/two-factor' }
        ]
      }
    ]
  }
];

function isMenuItemActive(item: MenuItem) {
  if (item.activeMatch) {
    return route.path.startsWith(item.activeMatch);
  }
  if (item.to === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(item.to);
}

function isSubmenuItemActive(subItem: SubmenuItem) {
  return route.path === subItem.to;
}

// Mapping from route path -> primeicons class, used only for root menu items
// (submenu items keep their original text-only styling, no icon in the source data).
const iconMap: Record<string, string> = {
  '/': 'pi-th-large',
  '/posts': 'pi-file-edit',
  '/products': 'pi-box',
  '/playlists': 'pi-list',
  '/media': 'pi-images',
  '/users': 'pi-users',
  '/settings/profile': 'pi-cog'
};

interface PanelModelItem {
  key: string;
  label: string;
  icon?: string;
  original: MenuItem | SubmenuItem;
  items?: PanelModelItem[];
}

function buildPanelItems(items: MenuItem[]): PanelModelItem[] {
  return items.map((item) => ({
    key: item.to,
    label: item.label,
    icon: iconMap[item.to],
    original: item,
    items: item.submenu?.map((subItem) => ({
      key: subItem.to,
      label: subItem.label,
      original: subItem
    }))
  }));
}

// PrimeVue PanelMenu model built once from menuSections (label/route/icon values
// are not changed, only re-shaped into the MenuItem[] structure PanelMenu expects).
const menuSectionModels = menuSections.map((section) => ({
  title: section.title,
  items: buildPanelItems(section.items)
}));

// Route-driven expand state for PanelMenu, passed as a controlled prop (no
// v-model listener) so that PanelMenu's own header-click toggle has no effect -
// expansion is derived exclusively from the active route, never from clicking.
const expandedKeys = computed(() => {
  const keys: Record<string, boolean> = {};
  menuSections.forEach((section) => {
    section.items.forEach((item) => {
      if (item.submenu) {
        keys[item.to] = isMenuItemActive(item);
      }
    });
  });
  return keys;
});

// Strip PanelMenu's default panel/header chrome (border, background, padding)
// so the component blends into the existing sidebar look instead of rendering
// as a boxed accordion panel.
const panelMenuPt = {
  root: { class: 'border-0! bg-transparent!' },
  panel: { class: 'border-0! bg-transparent! mb-0!' },
  header: { class: 'border-0! bg-transparent!' },
  headerContent: { class: 'border-0! bg-transparent! p-0!' },
  contentWrapper: { class: 'bg-transparent!' },
  content: { class: 'border-0! bg-transparent! p-0!' },
  submenu: { class: 'p-0! m-0! list-none!' },
  item: { class: 'border-0!' },
  itemContent: { class: 'bg-transparent! hover:bg-transparent!' }
};

const breadcrumbItems = computed(() => [
  { label: 'Admin' },
  { label: currentSectionName.value, current: true }
]);

const backTo = computed(() => route.meta.backTo as string | undefined);

const isMobileOpen = ref(false);
const avatarError = ref(false);

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
