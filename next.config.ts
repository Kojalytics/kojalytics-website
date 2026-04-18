import type { NextConfig } from "next";

// Locale-specific URL slugs for the privacy page.
// All slugs map internally to /[locale]/aiheadshot/privacy.
const privacySlugs: Record<string, string> = {
  de: 'datenschutz',
  en: 'privacypolicy',
  fr: 'confidentialite',
  es: 'privacidad',
  it: 'privacy',
  da: 'privatlivspolitik',
  nl: 'privacybeleid',
  sv: 'integritetspolicy',
};

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // ---- Legacy /portraitpro → /aiheadshot ----
      {
        source: '/portraitpro/privacy',
        destination: '/en/aiheadshot/privacypolicy',
        permanent: true,
      },
      {
        source: '/portraitpro',
        destination: '/aiheadshot',
        permanent: true,
      },
      {
        source: '/:locale(de|en|es|fr|it|da|nl|sv)/portraitpro/:path*',
        destination: '/:locale/aiheadshot/:path*',
        permanent: true,
      },
      {
        source: '/:locale(de|en|es|fr|it|da|nl|sv)/portraitpro',
        destination: '/:locale/aiheadshot',
        permanent: true,
      },
      // ---- Legacy /ai-headshot → /aiheadshot (dash-less) ----
      {
        source: '/ai-headshot',
        destination: '/aiheadshot',
        permanent: true,
      },
      {
        source: '/:locale(de|en|es|fr|it|da|nl|sv)/ai-headshot/:path*',
        destination: '/:locale/aiheadshot/:path*',
        permanent: true,
      },
      {
        source: '/:locale(de|en|es|fr|it|da|nl|sv)/ai-headshot',
        destination: '/:locale/aiheadshot',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Map user-facing locale-specific privacy URLs to the single internal
    // /[locale]/aiheadshot/privacy route. Example:
    //   /de/aiheadshot/datenschutz      → /de/aiheadshot/privacy
    //   /en/aiheadshot/privacypolicy    → /en/aiheadshot/privacy
    //   /fr/aiheadshot/confidentialite  → /fr/aiheadshot/privacy
    return Object.entries(privacySlugs).map(([locale, slug]) => ({
      source: `/${locale}/aiheadshot/${slug}`,
      destination: `/${locale}/aiheadshot/privacy`,
    }));
  },
};

export default nextConfig;
