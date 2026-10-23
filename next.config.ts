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
    // Exact paths come before the :path* rules: the first match wins, so nothing redirects twice.
    return [
      // ---- Relaunch 2026-10: Koja apps live under /software ----
      { source: '/koja-apps', destination: '/software', permanent: true },
      { source: '/koja-apps/danke', destination: '/software/thanks', permanent: true },

      // ---- AI Headshot is a case study now. The web app (/:locale/aiheadshot/app) and the
      //      privacy pages linked from the App Store stay where they are. ----
      { source: '/aiheadshot', destination: '/work/ai-headshot', permanent: true },
      { source: '/:locale(de|en|es|fr|it|da|nl|sv)/aiheadshot', destination: '/work/ai-headshot', permanent: true },

      // ---- Legacy /portraitpro ----
      {
        source: '/portraitpro/privacy',
        destination: '/en/aiheadshot/privacypolicy',
        permanent: true,
      },
      { source: '/portraitpro', destination: '/work/ai-headshot', permanent: true },
      { source: '/:locale(de|en|es|fr|it|da|nl|sv)/portraitpro', destination: '/work/ai-headshot', permanent: true },
      {
        source: '/:locale(de|en|es|fr|it|da|nl|sv)/portraitpro/:path*',
        destination: '/:locale/aiheadshot/:path*',
        permanent: true,
      },
      // ---- Legacy /ai-headshot (with dash) ----
      { source: '/ai-headshot', destination: '/work/ai-headshot', permanent: true },
      { source: '/:locale(de|en|es|fr|it|da|nl|sv)/ai-headshot', destination: '/work/ai-headshot', permanent: true },
      {
        source: '/:locale(de|en|es|fr|it|da|nl|sv)/ai-headshot/:path*',
        destination: '/:locale/aiheadshot/:path*',
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
