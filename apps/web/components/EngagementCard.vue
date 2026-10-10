<template>
  <article
    class="flex flex-col p-6 md:p-8"
    :class="highlighted ? 'rounded-2xl ring-2 ring-primary dark:ring-indigo-300' : 'card'"
  >
    <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ option.name }}</h3>
    <p class="mt-1 text-base font-semibold text-gray-700 dark:text-gray-300">{{ option.summary }}</p>
    <ul class="mt-5 space-y-2">
      <li v-for="point in option.points" :key="point" class="flex gap-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        <Icon name="lucide:check" class="w-4 h-4 mt-0.5 shrink-0 text-primary dark:text-indigo-300" aria-hidden="true" />
        <span>{{ point }}</span>
      </li>
    </ul>
    <div class="mt-auto pt-6">
      <NuxtLink
        v-if="option.action.kind === 'link'"
        :to="option.action.to"
        class="btn w-full"
        :class="highlighted ? 'btn-solid' : 'btn-outline'"
      >
        {{ option.action.label }}
      </NuxtLink>
      <a
        v-else
        :href="mailtoHref(option.action.subject)"
        class="btn w-full gap-2"
        :class="highlighted ? 'btn-solid' : 'btn-outline'"
      >
        <Icon name="lucide:mail" class="w-4 h-4" aria-hidden="true" />
        {{ option.action.label }}
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  option: EngagementOption;
  /** The one card with a filled button, so a row has a single focal point. */
  highlighted?: boolean;
}>();
</script>
