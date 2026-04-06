import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './i18n/config';

const localeMap: Record<string, Locale> = {
  'de': 'de', 'de-de': 'de', 'de-at': 'de', 'de-ch': 'de',
  'en': 'en', 'en-us': 'en', 'en-gb': 'en', 'en-au': 'en',
  'es': 'es', 'es-es': 'es', 'es-mx': 'es', 'es-ar': 'es',
  'fr': 'fr', 'fr-fr': 'fr', 'fr-be': 'fr', 'fr-ca': 'fr',
  'da': 'da', 'da-dk': 'da',
  'nl': 'nl', 'nl-nl': 'nl', 'nl-be': 'nl',
  'sv': 'sv', 'sv-se': 'sv',
};

function getPreferredLocale(request: NextRequest): Locale {
  // Check Vercel geo header first
  const country = request.headers.get('x-vercel-ip-country')?.toLowerCase();
  if (country) {
    const countryLocaleMap: Record<string, Locale> = {
      'de': 'de', 'at': 'de', 'ch': 'de',
      'us': 'en', 'gb': 'en', 'au': 'en', 'ca': 'en', 'ie': 'en',
      'es': 'es', 'mx': 'es', 'ar': 'es', 'co': 'es',
      'fr': 'fr', 'be': 'fr',
      'dk': 'da',
      'nl': 'nl',
      'se': 'sv',
    };
    if (countryLocaleMap[country]) return countryLocaleMap[country];
  }

  // Fall back to Accept-Language header
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) {
    const langs = acceptLang
      .split(',')
      .map(part => {
        const [lang, q] = part.trim().split(';q=');
        return { lang: lang.toLowerCase().trim(), q: q ? parseFloat(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);

    for (const { lang } of langs) {
      if (localeMap[lang]) return localeMap[lang];
      const prefix = lang.split('-')[0];
      if (localeMap[prefix]) return localeMap[prefix];
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /portraitpro routes
  if (pathname === '/portraitpro' || pathname === '/portraitpro/') {
    const locale = getPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/portraitpro`;
    return NextResponse.redirect(url);
  }

  // Check if it's a locale + portraitpro route — let it through
  const localeMatch = pathname.match(/^\/(de|en|es|fr|da|nl|sv)\/portraitpro/);
  if (localeMatch) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portraitpro', '/portraitpro/', '/:locale/portraitpro'],
};
