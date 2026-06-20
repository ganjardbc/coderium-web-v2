<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { useTheme } from '@/composables/useTheme';

const route = useRoute();
const { initTheme } = useTheme();

const layouts = {
  admin: AdminLayout,
  auth: AuthLayout,
};

const currentLayout = computed(() => {
  const layoutName = (route.meta.layout as keyof typeof layouts) || 'admin';
  return layouts[layoutName] || AdminLayout;
});

onMounted(() => {
  initTheme();
});
</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>
