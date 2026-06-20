<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Appearance</h1>

    <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
      <template #content>
        <div class="space-y-5">
          <div class="flex flex-col gap-3">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Theme</label>
            <SelectButton
              v-model="theme"
              :options="themeOptions"
              option-label="label"
              option-value="value"
              @change="onThemeChange"
            />
          </div>

          <Message severity="info" size="small" variant="simple">
            Theme is applied immediately and persists across sessions.
          </Message>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SelectButton, Message, Card } from 'primevue';
import { useTheme } from '@/composables/useTheme';

const { setTheme, currentTheme } = useTheme();

const theme = ref(currentTheme());

const themeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

function onThemeChange() {
  setTheme(theme.value);
}
</script>
