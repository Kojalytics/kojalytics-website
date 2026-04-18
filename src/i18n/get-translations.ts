import type { Locale } from './config';
import type { Translations } from './translations/de';

const translationModules: Record<Locale, () => Promise<{ default: Translations }>> = {
  de: () => import('./translations/de'),
  en: () => import('./translations/en'),
  es: () => import('./translations/es'),
  fr: () => import('./translations/fr'),
  it: () => import('./translations/it'),
  da: () => import('./translations/da'),
  nl: () => import('./translations/nl'),
  sv: () => import('./translations/sv'),
};

export async function getTranslations(locale: Locale): Promise<Translations> {
  const mod = await translationModules[locale]();
  return mod.default;
}
