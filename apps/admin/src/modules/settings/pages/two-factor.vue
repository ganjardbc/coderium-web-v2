<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Two-Factor Authentication</h1>

    <Card class="!shadow-none border border-gray-200 dark:border-gray-700">
      <template #content>
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-medium">Two-Factor Authentication</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security to your account</p>
          </div>
          <Tag value="Coming Soon" severity="secondary" />
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 mt-5 pt-5">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            2FA is not yet available. This feature will be added in a future update.
          </p>
          <Button label="Enable 2FA" icon="pi pi-shield" disabled />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Tag, Button, Card } from 'primevue';
</script>
