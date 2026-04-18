import type { Locale } from '@/i18n/config';

/**
 * Locale-specific URL slugs for the AI Headshot privacy page.
 * These must match the rewrites configured in next.config.ts.
 *
 * User-facing URL: /{locale}/aiheadshot/{slug}
 * Internal route:  /{locale}/aiheadshot/privacy
 */
export const privacySlugs: Record<Locale, string> = {
  de: 'datenschutz',
  en: 'privacypolicy',
  fr: 'confidentialite',
  es: 'privacidad',
  it: 'privacy',
  da: 'privatlivspolitik',
  nl: 'privacybeleid',
  sv: 'integritetspolicy',
};

/** Returns the canonical, locale-specific privacy URL. */
export function privacyUrl(locale: Locale): string {
  return `/${locale}/aiheadshot/${privacySlugs[locale]}`;
}
