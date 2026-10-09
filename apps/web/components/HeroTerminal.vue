<template>
  <!-- Fixed dark palette in both themes; green/yellow terminal colors are
       used only inside this panel. -->
  <figure class="rounded-2xl overflow-hidden border border-gray-800 bg-[#0b0b10] text-gray-300 shadow-xl">
    <figcaption class="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#111118]">
      <span class="flex gap-1.5" aria-hidden="true">
        <span class="w-2.5 h-2.5 rounded-full bg-gray-700" />
        <span class="w-2.5 h-2.5 rounded-full bg-gray-700" />
        <span class="w-2.5 h-2.5 rounded-full bg-gray-700" />
      </span>
      <span class="ml-2 text-xs font-medium text-gray-400">Ilustrasi alur kerja CAF</span>
    </figcaption>
    <ol class="px-4 md:px-5 py-4 md:py-5 font-mono text-xs md:text-sm leading-relaxed space-y-2">
      <li v-for="step in steps" :key="step.name" class="flex gap-3">
        <span class="text-emerald-400 shrink-0" aria-hidden="true">✓</span>
        <span class="text-gray-100 w-24 md:w-28 shrink-0">{{ step.name }}</span>
        <span class="text-gray-400 min-w-0">{{ step.detail }}</span>
      </li>
      <li class="flex gap-3 pt-2 mt-2 border-t border-gray-800 text-yellow-300">
        <span class="shrink-0" aria-hidden="true">●</span>
        <span>merge: menunggu keputusan Anda</span>
      </li>
    </ol>
  </figure>
</template>

<script setup lang="ts">
// Illustrative only (labelled as such in the caption): the four CAF stages,
// then the merge decision that stays with the human reviewer.
const steps = [
  { name: 'plan', detail: 'tiket dipecah jadi rencana kerja' },
  { name: 'implement', detail: 'perubahan ditulis di branch' },
  { name: 'verify', detail: 'typecheck dan build dijalankan' },
  { name: 'pull request', detail: 'PR dibuka untuk direview' },
];
</script>
