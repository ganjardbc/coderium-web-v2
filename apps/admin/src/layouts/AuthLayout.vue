<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 py-12">
    <div class="w-full max-w-md">
      <Card class="border-0 dark:border-0 shadow-sm">
        <template #content>
          <div class="flex justify-center">
            <img src="@/assets/logo-fill.png" alt="Coderium Logo" class="h-12 w-auto object-contain" />
          </div>
          <slot />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
</script>

