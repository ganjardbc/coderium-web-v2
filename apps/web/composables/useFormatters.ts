export function formatDate(dateStr?: string | null, style: 'short' | 'long' = 'short'): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: style,
    day: 'numeric',
  });
}

export function readingTime(text?: string | null): string {
  if (!text) return '1 min read';
  const mins = Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
  return `${mins} min read`;
}
