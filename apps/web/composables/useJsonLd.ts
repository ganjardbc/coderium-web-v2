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

/** Builds a FAQPage JSON-LD object from a list of {question, answer}. */
export function faqPageJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
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
