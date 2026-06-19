<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-sm border p-8">
        <h1 class="text-2xl font-bold text-center mb-2">Reset Password</h1>
        <p class="text-gray-500 text-center text-sm mb-8">
          Enter your email and we'll send you a reset link
        </p>

        <form v-if="!sent" @submit.prevent="handleForgotPassword" class="space-y-4">
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

          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <div v-else class="text-center">
          <p class="text-green-600 mb-4">Reset link sent! Check your email.</p>
          <router-link to="/login" class="text-blue-600 hover:underline text-sm">
            Back to Sign In
          </router-link>
        </div>

        <div class="mt-6 text-center text-sm">
          <router-link to="/login" class="text-blue-600 hover:underline">
            Back to Sign In
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const email = ref('');
const loading = ref(false);
const error = ref('');
const sent = ref(false);

async function handleForgotPassword() {
  error.value = '';
  loading.value = true;
  try {
    await authStore.forgotPassword(email.value);
    sent.value = true;
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Request failed';
  } finally {
    loading.value = false;
  }
}
</script>
