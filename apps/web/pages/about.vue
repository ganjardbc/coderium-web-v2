<template>
  <div class="w-full max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">About Coderium</h1>
    <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8">
      Web development resources, guides, and tools for developers.
    </p>

    <div class="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">What we do</h2>
        <p>
          Coderium is a tech blog and resource hub focused on web development. We publish articles, curated series,
          and tools that help developers learn, build, and ship better software.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">What you'll find here</h2>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Posts</strong> — practical guides and write-ups on web technologies.</li>
          <li><strong>Series</strong> — curated playlists that walk through a topic step by step.</li>
          <li><strong>Products</strong> — tools and pilots we build and ship ourselves.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact</h2>
        <p>
          Have feedback, a topic suggestion, or found an issue on the site? Reach out via
          <a href="mailto:hello@coderium.id" class="text-gray-900 dark:text-white underline hover:no-underline">hello@coderium.id</a>.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

useHead({ title: 'About - Coderium' });
</script>
