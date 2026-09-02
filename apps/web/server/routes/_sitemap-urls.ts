// Dynamic URL source for @nuxtjs/sitemap (see nuxt.config.ts `sitemap.sources`).
// Static pages are discovered automatically from the pages directory; this
// route supplies the slugs for posts/products/playlists, which come from the
// database via the public API.
interface ApiListResponse {
  data: Array<{ slug: string; updatedAt?: string }>;
  meta: { totalPages: number };
}

const MAX_PAGES = 1000;

async function fetchAllSlugs(origin: string, resource: string, limit = 100) {
  const items: Array<{ slug: string; updatedAt?: string }> = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await $fetch<ApiListResponse>(`${origin}/api/${resource}`, {
      params: { page, limit },
    });
    items.push(...res.data);
    totalPages = res.meta.totalPages;
    page++;
  } while (page <= totalPages && page <= MAX_PAGES);

  return items;
}

export default defineEventHandler(async (event) => {
  const origin = getRequestURL(event).origin;

  const [posts, products, playlists] = await Promise.all([
    fetchAllSlugs(origin, 'posts'),
    fetchAllSlugs(origin, 'products'),
    fetchAllSlugs(origin, 'playlists'),
  ]);

  return [
    ...posts.map((p) => ({ loc: `/posts/${p.slug}`, lastmod: p.updatedAt })),
    ...products.map((p) => ({ loc: `/products/${p.slug}`, lastmod: p.updatedAt })),
    ...playlists.map((p) => ({ loc: `/playlists/${p.slug}`, lastmod: p.updatedAt })),
  ];
});
