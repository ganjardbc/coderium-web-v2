// Single source for the contact address and the "Pesan audit gratis" mailto
// links. Contact is email only (no form), see CLAUDE.md.

export const CONTACT_EMAIL = 'coderium.id@gmail.com';

export const AUDIT_SUBJECT = 'Audit gratis Coderium';

/** mailto: link with a pre-filled subject. Opens the mail client in place (no new tab). */
export function mailtoHref(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

/** Subject for a product-specific audit request, e.g. "Audit gratis Coderium - CAF". */
export function productAuditSubject(productName: string): string {
  return `${AUDIT_SUBJECT} - ${productName}`;
}
