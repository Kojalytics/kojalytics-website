import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './i18n/config';
import { href, isEnglishPath } from './lib/i18n';
import { currencyForRequest } from './lib/currency';

/**
 * Every page response carries the visitor's currency (kj-cur, from their country): the client parts that render after
 * the page (phone menu, the Koja Office band of static pages) read it there. A functional cookie, no tracking.
 */
const CUR_COOKIE = 'kj-cur';
function withCurrency(request: NextRequest, res: NextResponse): NextResponse {
  const cur = currencyForRequest(request.headers);
  if (request.cookies.get(CUR_COOKIE)?.value !== cur) res.cookies.set(CUR_COOKIE, cur, { path: '/', maxAge: 60 * 60 * 24, sameSite: 'lax' });
  return res;
}

const localeMap: Record<string, Locale> = {
  'de': 'de', 'de-de': 'de', 'de-at': 'de', 'de-ch': 'de',
  'en': 'en', 'en-us': 'en', 'en-gb': 'en', 'en-au': 'en',
  'es': 'es', 'es-es': 'es', 'es-mx': 'es', 'es-ar': 'es',
  'fr': 'fr', 'fr-fr': 'fr', 'fr-be': 'fr', 'fr-ca': 'fr',
  'it': 'it', 'it-it': 'it', 'it-ch': 'it',
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
      'it': 'it',
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

/** Set once a visitor switched from an English page to a German one: from then on they get German. */
const LANG_COOKIE = 'kj-lang';
/** German Koja Office pages that have an English version and where visitors arrive from outside. */
const KOJA_ENTRY = /^\/(office|web|kontakt|support|support\/windows-installation|software\/[a-z]+-koja)?$/;
const BOTS = /bot|crawl|spider|slurp|facebookexternalhit|preview|lighthouse|headless/i;

const sameSite = (request: NextRequest, referer: string | null) => {
  try {
    return !!referer && new URL(referer).host === request.nextUrl.host;
  } catch {
    return false;
  }
};

/**
 * The English address for a visitor who arrives on a German Koja Office page with a browser set to another language
 * than German, or null to stay. Not for: navigation within the site (the language switch works), visitors who switched
 * to German before (cookie), campaign links (utm_source: the ad already chose the language), bots, and requests without
 * Accept-Language (crawlers send none; the German page stays what search engines see under the German address).
 */
function englishFirst(request: NextRequest): string | null {
  const { pathname, search, searchParams } = request.nextUrl;
  if (!KOJA_ENTRY.test(pathname)) return null;
  if (request.cookies.get(LANG_COOKIE)?.value === 'de') return null;
  if (searchParams.has('utm_source') || searchParams.has('lang')) return null;
  if (BOTS.test(request.headers.get('user-agent') ?? '')) return null;
  if (sameSite(request, request.headers.get('referer'))) return null;
  const first = (request.headers.get('accept-language') ?? '').split(',')[0].trim().toLowerCase();
  if (!first || first === '*' || first.startsWith('de')) return null;
  return href('en', pathname) + search;
}

/** A visitor coming from an English page of this site to a German Koja Office page: they chose German. */
function switchedToGerman(request: NextRequest): boolean {
  if (!KOJA_ENTRY.test(request.nextUrl.pathname)) return false;
  const referer = request.headers.get('referer');
  if (!sameSite(request, referer)) return false;
  return isEnglishPath(new URL(referer!).pathname) && request.cookies.get(LANG_COOKIE)?.value !== 'de';
}

export function middleware(request: NextRequest) {
  return withCurrency(request, route(request));
}

function route(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // People type "kojalytics.com/Software": routes are lowercase, so send any capitalised /software path there.
  if (/^\/software(\/|$)/i.test(pathname) && pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase().replace(/\/$/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  // Koja Office pages: visitors whose browser is not set to German see the English page.
  const english = englishFirst(request);
  if (english) return NextResponse.redirect(new URL(english, request.url), 307);
  if (switchedToGerman(request)) {
    const res = NextResponse.next();
    res.cookies.set(LANG_COOKIE, 'de', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    return res;
  }

  // Only handle /aiheadshot routes
  if (pathname === '/aiheadshot' || pathname === '/aiheadshot/') {
    const locale = getPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/aiheadshot`;
    return NextResponse.redirect(url);
  }

  // Check if it's a locale + aiheadshot route — let it through
  const localeMatch = pathname.match(/^\/(de|en|es|fr|it|da|nl|sv)\/aiheadshot/);
  if (localeMatch) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/aiheadshot',
    '/aiheadshot/',
    '/:locale/aiheadshot',
    '/:locale/aiheadshot/:path*',
    '/Software',
    '/Software/:path*',
    '/SOFTWARE',
    '/SOFTWARE/:path*',
    // All pages (currency cookie; English redirect on the German Koja Office entry pages, see englishFirst), not
    // API routes, Next's own files or files with an extension.
    '/((?!api|_next|.*\\..*).*)',
  ],
};
