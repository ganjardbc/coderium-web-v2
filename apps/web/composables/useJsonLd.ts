import { unref, type MaybeRefOrGetter } from 'vue';

/** Builds a BreadcrumbList JSON-LD object from an ordered list of {name, url}. */
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Injects one or more JSON-LD <script> tags for structured data / rich results. */
export function useJsonLd(data: MaybeRefOrGetter<Record<string, unknown> | Record<string, unknown>[]>) {
  useHead(() => {
    const resolved = typeof data === 'function' ? data() : unref(data);
    const list = Array.isArray(resolved) ? resolved : [resolved];
    return {
      script: list.map((item) => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(item),
      })),
    };
  });
}
