<template>
  <div class="w-full max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Terms of Service</h1>
    <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8">Last updated: {{ lastUpdated }}</p>

    <div class="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Acceptance of terms</h2>
        <p>
          By accessing or using Coderium ("we", "us", "the site"), you agree to be bound by these Terms of Service.
          If you do not agree, please do not use the site.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Content</h2>
        <p>
          Articles, series, and other content published on Coderium are provided for informational and educational
          purposes only. Content may be updated or removed at any time without notice, and we make no warranty as
          to its accuracy or completeness.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Intellectual property</h2>
        <p>
          Unless stated otherwise, all content, logos, and branding on Coderium are the property of Coderium.
          You may share links to our content, but reproduction or redistribution without permission is not allowed.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Products</h2>
        <p>
          Any products or tools listed on the site are provided "as is". Availability, pricing, and features may
          change without prior notice.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">5. Limitation of liability</h2>
        <p>
          Coderium is not liable for any damages arising from the use of, or inability to use, the site or its
          content.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">6. Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the site after changes are posted means
          you accept the revised terms.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">7. Contact</h2>
        <p>
          Questions about these terms can be sent to
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

useHead({ title: 'Terms of Service - Coderium' });

const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
</script>
