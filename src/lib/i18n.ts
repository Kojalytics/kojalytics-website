// Languages of the Koja Office site. German lives at the root (/, /office, /agb …), English under /en with English
// paths (/en/terms …). Pages and components take a `lang` ("de" by default, so German stays as it was); client
// components can read it from the path with useLang() (src/lib/use-lang.ts).

export type Lang = "de" | "en";
export const LANGS: Lang[] = ["de", "en"];

/** German path → English path, where the English one is not simply "/en" + the German one. */
const EN_PATHS: Record<string, string> = {
  "/": "/en",
  "/kontakt": "/en/contact",
  "/agb": "/en/terms",
  "/datenschutz": "/en/privacy",
  "/impressum": "/en/imprint",
  "/widerrufen": "/en/withdrawal",
  "/kuendigen": "/en/cancel",
  "/warum-koja": "/en/why-koja",
  "/fragen": "/en/faq",
  "/software/danke": "/en/thanks",
};
const DE_PATHS: Record<string, string> = Object.fromEntries(Object.entries(EN_PATHS).map(([de, en]) => [en, de]));
// The old German address of the homepage (it redirects to /), still used in links of the app copy.
EN_PATHS["/software"] = "/en";

/** Paths that exist in German only (guides, the old partner page) or are not pages (downloads, API). */
const GERMAN_ONLY = /^\/(ratgeber|software\/partner|download|api|copypastepro|clipboard|etsy-sync)(\/|$)/;

/** Whether a path is an English page. */
export const isEnglishPath = (path: string) => path === "/en" || path.startsWith("/en/") || path.startsWith("/en?") || path.startsWith("/en#");

export const langOf = (pathname: string): Lang => (isEnglishPath(pathname) ? "en" : "de");

/**
 * The address of a page in a language, from its German address: href("en", "/agb") is "/en/terms",
 * href("en", "/#preise") is "/en#preise", href("de", x) is x. The browser versions of the apps (/web/<slug>, static
 * files shared by both languages) get ?lang=en. German-only pages keep their German address.
 */
export function href(lang: Lang, path: string): string {
  if (lang === "de" || !path.startsWith("/") || isEnglishPath(path)) return path;
  const [, p, rest] = path.match(/^([^?#]*)(.*)$/)!;
  if (/^\/web\/[^/]+$/.test(p)) return `${p}?lang=en${rest.startsWith("?") ? `&${rest.slice(1)}` : rest}`;
  if (GERMAN_ONLY.test(p)) return path;
  return (EN_PATHS[p] ?? `/en${p}`) + rest;
}

/** The German address of an English page (the counterpart for the language switch). */
export function germanPath(path: string): string {
  if (!isEnglishPath(path)) return path;
  const [, p, rest] = path.match(/^([^?#]*)(.*)$/)!;
  return (DE_PATHS[p] ?? (p.slice(3) || "/")) + rest;
}

/** The same page in the other language. */
export const switchPath = (pathname: string, to: Lang) => href(to, germanPath(pathname));

/**
 * Metadata `alternates` for a page that exists in both languages: canonical in its own language, hreflang for both,
 * and English as the default for everyone whose language is neither.
 */
export function alternates(lang: Lang, dePath: string) {
  const en = href("en", dePath);
  return { canonical: href(lang, dePath), languages: { de: dePath, en, "x-default": en } };
}

/** Open Graph locale. */
export const ogLocale = (lang: Lang) => (lang === "de" ? "de_DE" : "en_US");

/** An amount in euros: "79 €" / "19,99 €" in German, "€79" / "€19.99" in English. */
export function euro(cents: number, lang: Lang): string {
  const n = (cents / 100).toLocaleString(lang === "de" ? "de-DE" : "en-IE", {
    minimumFractionDigits: cents % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return lang === "de" ? `${n} €` : `€${n}`;
}

const MONTHS: Record<Lang, string[]> = {
  de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

/** "30. November 2026" / "30 November 2026", from an ISO date. */
export function longDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return lang === "de" ? `${d}. ${MONTHS.de[m - 1]} ${y}` : `${d} ${MONTHS.en[m - 1]} ${y}`;
}
