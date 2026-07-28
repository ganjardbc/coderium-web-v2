import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  status: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  const isAuthenticated = computed(() => !!token.value);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    token.value = data.data.token;
    user.value = data.data.user;
    localStorage.setItem('token', data.data.token);
    return data;
  }

  async function register(name: string, email: string, password: string) {
    const { data } = await api.post('/auth/register', { name, email, password });
    token.value = data.data.token;
    user.value = data.data.user;
    localStorage.setItem('token', data.data.token);
    return data;
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
    }
  }

  async function fetchProfile() {
    try {
      const { data } = await api.get('/auth/me');
      user.value = data.data;
    } catch {
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
    }
  }

  async function forgotPassword(email: string) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  }

  async function resetPassword(resetToken: string, password: string) {
    const { data } = await api.post('/auth/reset-password', { token: resetToken, password });
    return data;
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchProfile,
    forgotPassword,
    resetPassword,
  };
});
