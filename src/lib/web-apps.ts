/**
 * Koja apps with a browser version at /web/<slug>. The page is public/web/<slug>/index.html (rewritten from
 * /web/<slug> in next.config.ts); its WebAssembly files are served from the Hetzner server (koja-web.*.sslip.io).
 * FilmKoja, EffectKoja and LightKoja are missing: their web builds need same-origin workers.
 */
export const WEB_APPS = [
  "word-koja",
  "grid-koja",
  "deck-koja",
  "pdf-koja",
  "photo-koja",
  "vector-koja",
  "design-koja",
  "fig-koja",
  "sound-koja",
  "cad-koja",
];

export const hasWebApp = (slug: string) => WEB_APPS.includes(slug);
