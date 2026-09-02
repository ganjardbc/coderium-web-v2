<template>
  <div class="w-full max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Privacy Policy</h1>
    <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8">Last updated: {{ lastUpdated }}</p>

    <div class="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Information we collect</h2>
        <p>
          We collect minimal information needed to operate Coderium, such as pages visited, search queries entered
          on the site, and basic technical data (browser, device type) via standard analytics.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. How we use it</h2>
        <ul class="list-disc pl-5 space-y-1">
          <li>To operate and improve the site, articles, and product listings.</li>
          <li>To understand which content is useful to readers.</li>
          <li>To respond to messages sent to us directly (e.g. by email).</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Cookies & local storage</h2>
        <p>
          The site may use cookies or browser local storage for functional purposes, such as remembering your
          dark/light mode preference. These do not identify you personally.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Third parties</h2>
        <p>
          We do not sell your personal information. We may use third-party services (such as hosting or analytics
          providers) that process technical data on our behalf, under their own privacy policies.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">5. Your choices</h2>
        <p>
          You can control cookies through your browser settings. You may also contact us to ask what data we hold
          about you or to request it be removed.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">6. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be reflected by updating the date
          above.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">7. Contact</h2>
        <p>
          Questions about this policy can be sent to
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

useSeo({
  title: 'Privacy Policy',
  description: "Coderium's privacy policy.",
});

const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
</script>
