<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Users</h1>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <ProgressSpinner />
    </div>

    <EmptyState
      v-else-if="users.length === 0"
      icon="pi-users"
      title="No users yet"
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="user in users"
        :key="user.id"
        class="flex flex-col gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-surface-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-medium shrink-0">
            <img v-if="user.avatarUrl" :src="user.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>{{ user.name.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="min-w-0">
            <p class="font-medium text-gray-900 dark:text-white line-clamp-1">{{ user.name }}</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 line-clamp-1">{{ user.email }}</p>
          </div>
          <Tag
            :value="user.status"
            :severity="user.status === 'active' ? 'success' : 'danger'"
            class="capitalize ml-auto shrink-0"
          />
        </div>

        <div v-if="user.roles && user.roles.length > 0" class="flex flex-wrap gap-1">
          <Tag
            v-for="role in user.roles"
            :key="role.roleId"
            :value="role.role?.name"
            severity="secondary"
            class="capitalize"
          />
        </div>

        <p class="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
          <i class="pi pi-calendar text-xs" /> Joined {{ new Date(user.createdAt).toLocaleDateString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Tag, ProgressSpinner } from 'primevue';
import api from '@/lib/api';
import EmptyState from '@/components/EmptyState.vue';

interface UserItem {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: string;
  createdAt: string;
  roles?: { roleId: string; role?: { name: string } }[];
}

const users = ref<UserItem[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/users');
    users.value = data.data;
  } finally {
    loading.value = false;
  }
});
</script>
