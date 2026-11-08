export const SITE_URL = "https://www.kojalytics.com";
export const SITE_NAME = "Kojalytics";

/** Spread into every page-level `openGraph`: Next replaces the root object instead of merging it. */
export const OG_BASE = { siteName: SITE_NAME, locale: "de_DE", type: "website" as const };

/** Share image for pages without their own; pages that set `openGraph` must list it again (Next replaces, not merges). */
export const DEFAULT_OG_IMAGE = { url: "/og/kojalytics.jpg", width: 1200, height: 630, alt: "Kojalytics" };

export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  email: "support@kojalytics.com",
  description:
    "Kojalytics ist ein Software-Studio aus Deutschland. Wir entwickeln Apps und Web-Plattformen für Kunden und bieten die Koja-Apps für Mac und Windows an.",
  address: { "@type": "PostalAddress", addressCountry: "DE" },
};

export const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "de",
};

/** Renders a JSON-LD block. Escapes `<` so the data can never close the script tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
