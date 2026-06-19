<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Users</h1>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

    <div v-else class="bg-white rounded-xl border overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Name</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Email</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Roles</th>
            <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Joined</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-b last:border-0 hover:bg-gray-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <span class="font-medium">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span :class="user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 text-xs rounded-full">
                {{ user.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span v-for="role in user.roles || []" :key="role.roleId" class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 mr-1">
                {{ role.role?.name }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
