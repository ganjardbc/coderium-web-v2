export default defineNuxtPlugin(() => {
  const { gaId } = useRuntimeConfig().public;

  if (!import.meta.env.PROD || !gaId) return;

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
        async: true,
      },
    ],
  });

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', gaId as string);

  const router = useRouter();
  router.afterEach((to) => {
    gtag('config', gaId as string, { page_path: to.fullPath });
  });
});

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
