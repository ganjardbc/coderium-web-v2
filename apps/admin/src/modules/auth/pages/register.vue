<template>
  <div class="text-center mb-8">
    <h1 class="text-xl font-bold text-gray-900 dark:text-white">Create Account</h1>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Get started with Coderium admin panel</p>
  </div>

  <form @submit.prevent="handleRegister" class="space-y-5">
    <div class="flex flex-col gap-1.5">
      <label for="name" class="text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-user text-gray-400"></i>
        </InputGroupAddon>
        <InputText
          id="name"
          v-model="name"
          type="text"
          required
          placeholder="John Doe"
        />
      </InputGroup>
    </div>

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
          minlength="8"
          promptLabel="Choose a password"
          weakLabel="Too simple"
          mediumLabel="Average complexity"
          strongLabel="Strong password"
          placeholder="At least 8 characters"
          inputClass="w-full"
          class="w-full"
        />
      </InputGroup>
    </div>

    <Message v-if="error" severity="error" size="small" variant="simple" class="mt-2">{{ error }}</Message>

    <Button
      type="submit"
      label="Create Account"
      icon="pi pi-user-plus"
      :loading="loading"
      class="w-full mt-2"
    />
  </form>

  <div class="mt-6 text-center text-sm">
    <router-link to="/login" class="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
      Already have an account? <span class="underline">Sign in</span>
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
