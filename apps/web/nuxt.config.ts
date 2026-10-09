import tailwindcss from '@tailwindcss/vite';

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://coderium.id';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  devServer: {
    port: 5174,
  },

  modules: ['@pinia/nuxt', '@nuxt/icon', '@nuxtjs/sitemap', '@nuxtjs/robots'],

  icon: {
    localApiEndpoint: '/_nuxt_icon',
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss() as any],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Coderium',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Coderium adalah AI agency untuk tim engineering, dengan dua produk: CAF (Coderium Agent Framework) dan AI Code Reviewer.',
        },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0a0a0a', media: '(prefers-color-scheme: dark)' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
      ],
    },
  },

  runtimeConfig: {
    apiSecret: '',
    apiInternalBase: process.env.NUXT_API_INTERNAL_BASE || 'http://localhost:3030/api/v1',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      siteUrl,
      gaId: process.env.NUXT_PUBLIC_GA_ID,
    },
  },

  routeRules: {
    // Keep browser requests same-origin while routing SSR/API proxy traffic
    // directly over the Docker network. Avoid hairpinning through Cloudflare.
    '/api/**': { proxy: `${process.env.NUXT_API_INTERNAL_BASE || 'http://localhost:3030/api/v1'}/**` },
  },

  // Unified site metadata consumed by @nuxtjs/sitemap and @nuxtjs/robots
  // (via nuxt-site-config) and available as `useSiteConfig()`.
  site: {
    url: siteUrl,
    name: 'Coderium',
  },

  sitemap: {
    // Static routes are auto-discovered from the pages directory; dynamic
    // post/product/playlist slugs come from this server route (see
    // server/routes/_sitemap-urls.ts), which paginates through the public
    // API. Deliberately NOT under /api/** — that prefix is proxied straight
    // to the backend by the routeRule above and would shadow this route.
    sources: ['/_sitemap-urls'],
  },

  robots: {
    // Sitemap: line is added automatically from the `site.url` above.
    disallow: [],
  },
});
