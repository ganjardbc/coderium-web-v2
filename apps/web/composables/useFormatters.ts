export function formatDate(dateStr?: string | null, style: 'short' | 'long' = 'short'): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: style,
    day: 'numeric',
  });
}

export function readingTime(text?: string | null): string {
  if (!text) return '1 menit baca';
  const mins = Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
  return `${mins} menit baca`;
}

const POST_TYPE_LABELS: Record<string, string> = {
  article: 'Artikel',
  carousel: 'Carousel',
  video: 'Video',
  stack_gallery: 'Galeri',
};

export function postTypeLabel(type: string): string {
  return POST_TYPE_LABELS[type] || type;
}
