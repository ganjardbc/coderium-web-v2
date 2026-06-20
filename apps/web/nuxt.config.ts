import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

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
      ],
    },
  },

  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: '/api',
    },
  },
});
