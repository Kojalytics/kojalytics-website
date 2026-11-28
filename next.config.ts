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
  // Screenshots rarely change: cache optimised images for 31 days. A replaced screenshot needs a new file name.
  images: { minimumCacheTTL: 2678400 },
  // This checkout can sit inside another copy of the repo (git worktree): pin the project root so
  // Turbopack does not pick the outer folder's lockfile after a restart.
  turbopack: { root: process.cwd() },
  // The persistent dev cache went stale and corrupted .next/dev manifests under heavy load; dev only.
  experimental: { turbopackFileSystemCacheForDev: false },
  // Customer-voice clips and posters (public/stimmen) carry their version in the file name: cache them for a year.
  async headers() {
    return [{ source: '/stimmen/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }];
  },
  async redirects() {
    // Exact paths come before the :path* rules: the first match wins, so nothing redirects twice.
    return [
      // ---- 2026-11: the ad landing page /office is merged into the homepage. Ads and old links keep working; the
      //      query string (code, utm_*) is kept, so a code from the ad is active on the homepage too. ----
      { source: '/office', destination: '/', permanent: false },
      { source: '/en/office', destination: '/en', permanent: false },

      // ---- 2026-11: the site is only about Koja Office. /software became the homepage; the studio pages are gone. ----
      { source: '/software', destination: '/', permanent: true },
      { source: '/leistungen', destination: '/', permanent: true },
      { source: '/leistungen/:path*', destination: '/', permanent: true },
      { source: '/projekte', destination: '/', permanent: true },
      { source: '/projekte/:path*', destination: '/', permanent: true },
      { source: '/lizenzen', destination: '/', permanent: true },
      { source: '/ueber-uns', destination: '/', permanent: true },

      // ---- Relaunch 2026-10: Koja apps live under /software ----
      { source: '/koja-apps', destination: '/', permanent: true },
      { source: '/koja-apps/danke', destination: '/software/danke', permanent: true },

      // ---- Relaunch 2026-10: German addresses. Only /contact was ever live; the rest guards old preview links. ----
      { source: '/contact', destination: '/kontakt', permanent: true },
      { source: '/services', destination: '/', permanent: true },
      { source: '/work', destination: '/', permanent: true },
      { source: '/work/ai-headshot', destination: '/', permanent: true },
      { source: '/about', destination: '/', permanent: true },
      { source: '/cancel', destination: '/kuendigen', permanent: true },
      { source: '/terms', destination: '/agb', permanent: true },
      { source: '/licensing', destination: '/', permanent: true },
      { source: '/software/thanks', destination: '/software/danke', permanent: true },

      // ---- AI Headshot is a case study now. The web app (/:locale/aiheadshot/app) and the
      //      privacy pages linked from the App Store stay where they are. ----
      { source: '/aiheadshot', destination: '/', permanent: true },
      { source: '/:locale(de|en|es|fr|it|da|nl|sv)/aiheadshot', destination: '/', permanent: true },

      // ---- Legacy /portraitpro ----
      {
        source: '/portraitpro/privacy',
        destination: '/en/aiheadshot/privacypolicy',
        permanent: true,
      },
      { source: '/portraitpro', destination: '/', permanent: true },
      { source: '/:locale(de|en|es|fr|it|da|nl|sv)/portraitpro', destination: '/', permanent: true },
      {
        source: '/:locale(de|en|es|fr|it|da|nl|sv)/portraitpro/:path*',
        destination: '/:locale/aiheadshot/:path*',
        permanent: true,
      },
      // ---- Legacy /ai-headshot (with dash) ----
      { source: '/ai-headshot', destination: '/', permanent: true },
      { source: '/:locale(de|en|es|fr|it|da|nl|sv)/ai-headshot', destination: '/', permanent: true },
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
    return [
      ...Object.entries(privacySlugs).map(([locale, slug]) => ({
        source: `/${locale}/aiheadshot/${slug}`,
        destination: `/${locale}/aiheadshot/privacy`,
      })),
      // Koja apps in the browser: /web/word-koja → public/web/word-koja/index.html (see src/lib/web-apps.ts).
      { source: '/web/:slug', destination: '/web/:slug/index.html' },
    ];
  },
};

export default nextConfig;
