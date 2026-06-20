<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Users</h1>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <ProgressSpinner />
    </div>

    <DataTable
      v-else
      :value="users"
      class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
      stripedRows
    >
      <Column header="Name" class="min-w-48">
        <template #body="{ data }">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-medium shrink-0">
              {{ data.name.charAt(0).toUpperCase() }}
            </div>
            <span class="font-medium">{{ data.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="email" header="Email" class="min-w-48" />
      <Column header="Status" class="w-28">
        <template #body="{ data }">
          <Tag
            :value="data.status"
            :severity="data.status === 'active' ? 'success' : 'danger'"
            class="capitalize"
          />
        </template>
      </Column>
      <Column header="Roles" class="min-w-32">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1">
            <Tag
              v-for="role in data.roles || []"
              :key="role.roleId"
              :value="role.role?.name"
              severity="secondary"
              class="capitalize"
            />
          </div>
        </template>
      </Column>
      <Column header="Joined" class="w-36">
        <template #body="{ data }">
          {{ new Date(data.createdAt).toLocaleDateString() }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { DataTable, Column, Tag, ProgressSpinner } from 'primevue';
import api from '@/lib/api';

interface UserItem {
  id: string;
  name: string;
  email: string;
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
