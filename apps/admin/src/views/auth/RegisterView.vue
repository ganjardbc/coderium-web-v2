<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-sm border p-8">
        <h1 class="text-2xl font-bold text-center mb-8">Create Account</h1>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input
              v-model="name"
              type="text"
              required
              placeholder="John Doe"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="john@example.com"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="8"
              placeholder="At least 8 characters"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm">
          <span class="text-gray-500">Already have an account?</span>
          <router-link to="/login" class="text-blue-600 hover:underline ml-1">
            Sign in
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function handleRegister() {
  error.value = '';
  loading.value = true;
  try {
    await authStore.register(name.value, email.value, password.value);
    router.push('/');
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Registration failed';
  } finally {
    loading.value = false;
  }
}
</script>
