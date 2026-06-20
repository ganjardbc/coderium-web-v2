<template>
  <div class="text-center mb-6">
    <h1 class="text-xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
      Enter your email to receive a password reset link
    </p>
  </div>

  <form v-if="!sent" @submit.prevent="handleForgotPassword" class="space-y-5">
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

    <Message v-if="error" severity="error" size="small" variant="simple" class="mt-2">{{ error }}</Message>

    <Button
      type="submit"
      label="Send Reset Link"
      icon="pi pi-envelope"
      :loading="loading"
      class="w-full mt-2"
    />
  </form>

  <div class="text-center py-4" v-else>
    <i class="pi pi-check-circle text-green-500 text-5xl mb-4"></i>
    <p class="text-green-600 font-medium mb-4">Reset link sent successfully!</p>
    <p class="text-sm text-gray-500 mb-6">Please check your email inbox to complete the password reset.</p>
    <router-link to="/login">
      <Button label="Back to Sign In" icon="pi pi-arrow-left" severity="secondary" class="w-full" />
    </router-link>
  </div>

  <div v-if="!sent" class="mt-6 text-center text-sm">
    <router-link to="/login" class="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
      <i class="pi pi-arrow-left text-xs mr-1"></i> Back to Sign In
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';

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
