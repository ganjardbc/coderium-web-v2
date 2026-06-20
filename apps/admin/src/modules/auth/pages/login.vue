<template>
  <div class="text-center mb-8">
    <h1 class="text-xl font-bold text-gray-900 dark:text-white">Sign In</h1>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Welcome back! Sign in to manage Coderium</p>
  </div>

  <form @submit.prevent="handleLogin" class="space-y-5">
    <div class="flex flex-col gap-1.5">
      <label for="email" class="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-envelope text-gray-400"></i>
        </InputGroupAddon>
        <InputText
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="john@example.com"
        />
      </InputGroup>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="password" class="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-lock text-gray-400"></i>
        </InputGroupAddon>
        <Password
          id="password"
          v-model="password"
          required
          :feedback="false"
          toggleMask
          placeholder="••••••••"
          inputClass="w-full"
          class="w-full"
        />
      </InputGroup>
    </div>

    <Message v-if="error" severity="error" size="small" variant="simple" class="mt-2">{{ error }}</Message>

    <Button
      type="submit"
      label="Sign In"
      icon="pi pi-sign-in"
      :loading="loading"
      class="w-full mt-2"
    />
  </form>

  <div class="mt-6 text-center space-y-2 text-sm">
    <router-link to="/register" class="text-indigo-600 hover:text-indigo-500 font-medium transition-colors block">
      Don't have an account? <span class="underline">Create one</span>
    </router-link>
    <router-link to="/forgot-password" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors block">
      Forgot password?
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>
