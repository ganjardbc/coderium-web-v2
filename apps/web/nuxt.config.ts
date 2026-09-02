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
      title: 'Coderium',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Coderium - Tech Blog & Resources' },
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
    public: {
      apiBase: '/api',
      siteUrl,
      gaId: process.env.NUXT_PUBLIC_GA_ID,
    },
  },

  routeRules: {
    '/api/**': { proxy: 'http://localhost:3030/api/v1/**' },
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
