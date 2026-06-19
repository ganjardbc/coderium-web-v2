<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Appearance</h1>

    <div class="space-y-6 bg-white rounded-xl border p-6">
      <div>
        <label class="block text-sm font-medium mb-3">Theme</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer hover:bg-gray-50" :class="theme === 'light' ? 'border-blue-500 bg-blue-50' : ''">
            <input type="radio" v-model="theme" value="light" class="w-4 h-4 text-blue-600" />
            <span>Light</span>
          </label>
          <label class="flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer hover:bg-gray-50" :class="theme === 'dark' ? 'border-blue-500 bg-blue-50' : ''">
            <input type="radio" v-model="theme" value="dark" class="w-4 h-4 text-blue-600" />
            <span>Dark</span>
          </label>
          <label class="flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer hover:bg-gray-50" :class="theme === 'system' ? 'border-blue-500 bg-blue-50' : ''">
            <input type="radio" v-model="theme" value="system" class="w-4 h-4 text-blue-600" />
            <span>System</span>
          </label>
        </div>
      </div>

      <p v-if="message" class="text-green-600 text-sm">{{ message }}</p>

      <button @click="saveTheme" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Save Preference
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const theme = ref(localStorage.getItem('theme') || 'system');
const message = ref('');

function saveTheme() {
  localStorage.setItem('theme', theme.value);
  message.value = 'Theme preference saved';
  setTimeout(() => message.value = '', 2000);
}
</script>
