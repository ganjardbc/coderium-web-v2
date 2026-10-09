<template>
  <article
    class="flex flex-col p-6 md:p-8"
    :class="highlighted ? 'rounded-2xl ring-2 ring-primary dark:ring-indigo-300' : 'card'"
  >
    <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ plan.name }}</h3>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 first-letter:uppercase">{{ plan.scope }}</p>
    <p class="mt-5 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
      {{ plan.price }}
      <span v-if="plan.priceUnit" class="text-base font-semibold text-gray-600 dark:text-gray-400">{{ plan.priceUnit }}</span>
    </p>
    <p v-if="plan.pioneerPrice" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
      Harga perintis: <span class="font-semibold text-gray-900 dark:text-white">{{ plan.pioneerPrice }}</span>
    </p>
    <p v-if="plan.note" class="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ plan.note }}</p>
    <div class="mt-auto pt-6">
      <a
        :href="`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(plan.subject)}`"
        :aria-label="`Kirim email soal ${plan.name}`"
        class="btn w-full"
        :class="highlighted ? 'btn-solid' : 'btn-outline'"
      >
        Kirim email
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  plan: PricingPlan;
  /** The one card with a filled button, so a row has a single focal point. */
  highlighted?: boolean;
}>();

const CONTACT_EMAIL = 'hello@coderium.id';
</script>
