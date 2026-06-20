<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

const route = useRoute();

const layouts = {
  admin: AdminLayout,
  auth: AuthLayout,
};

const currentLayout = computed(() => {
  const layoutName = (route.meta.layout as keyof typeof layouts) || 'admin';
  return layouts[layoutName] || AdminLayout;
});
</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>

