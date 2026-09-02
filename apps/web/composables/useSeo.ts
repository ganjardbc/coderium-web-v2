import { computed, unref, type MaybeRefOrGetter } from 'vue';

export interface SeoOptions {
  /** Page-specific title. " - Coderium" is appended unless `titleSuffix` is false. */
  title: string;
  /** Skip the automatic " - Coderium" suffix (used for the homepage's own descriptive title). */
  titleSuffix?: boolean;
  description?: string;
  keywords?: string;
  /** Absolute URL or a path under the site root (e.g. a post's cover image). Falls back to the site favicon. */
  image?: string | null;
  type?: 'website' | 'article';
  /** Keep this page out of search results (still linked, just not indexed) — e.g. filtered search result pages. */
  noindex?: boolean;
}

const SITE_NAME = 'Coderium';
const DEFAULT_DESCRIPTION =
  'Coderium curates trustworthy articles, tutorials, and insights on AI and software development.';

/**
 * Centralized title/description/canonical/Open Graph/Twitter Card meta for a
 * page. `route.path` (query-string free) is always used as the canonical
 * URL, so filtered variants of the same page (e.g. /explore?q=...) collapse
 * onto one canonical instead of being treated as separate pages.
 */
export function useSeo(options: MaybeRefOrGetter<SeoOptions>) {
  const route = useRoute();
  const config = useRuntimeConfig();
  const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '');

  const resolved = computed(() => (typeof options === 'function' ? options() : unref(options)));

  useHead(() => {
    const opts = resolved.value;
    const url = `${siteUrl}${route.path}`;
    // Any absolute URI (http(s):, data:, blob:, //cdn...) is used as-is;
    // only a bare site-relative path gets the site origin prepended.
    const isAbsoluteUri = (value: string) => /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(value);
    const image = opts.image
      ? isAbsoluteUri(opts.image)
        ? opts.image
        : `${siteUrl}${opts.image}`
      : `${siteUrl}/favicon.png`;
    const description = opts.description || DEFAULT_DESCRIPTION;
    const title = opts.titleSuffix === false ? opts.title : `${opts.title} - ${SITE_NAME}`;

    return {
      title,
      meta: [
        { name: 'description', content: description },
        ...(opts.keywords ? [{ name: 'keywords', content: opts.keywords }] : []),
        ...(opts.noindex ? [{ name: 'robots', content: 'noindex, follow' }] : []),
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:type', content: opts.type ?? 'website' },
        { property: 'og:url', content: url },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
      link: [{ rel: 'canonical', href: url }],
    };
  });

  return { siteUrl };
}
