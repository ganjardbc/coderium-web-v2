import {
  isEmail,
  isURL,
  registerDecorator,
  type ValidationOptions,
} from 'class-validator';

const MAILTO_PREFIX = 'mailto:';

/**
 * A product CTA target is either an absolute http(s) URL or a `mailto:` link
 * to a single valid address (optionally with a query, e.g. `?subject=...`).
 * Shared by the DTO decorator below and the publish validation in
 * ProductsService so both paths apply the same rule.
 */
export function isCtaUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0) return false;
  if (/\s/.test(value)) return false;

  if (value.toLowerCase().startsWith(MAILTO_PREFIX)) {
    const [address] = value.slice(MAILTO_PREFIX.length).split('?');
    return isEmail(address);
  }

  return isURL(value, {
    protocols: ['http', 'https'],
    require_protocol: true,
  });
}

export function IsCtaUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCtaUrl',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: unknown) => isCtaUrl(value),
        defaultMessage: () =>
          'ctaUrl must be an http(s) URL or a mailto: link',
      },
    });
  };
}
