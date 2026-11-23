// The currency a visitor pays in, from their country: Europe pays in euros, the UK in pounds, Switzerland in francs,
// Canada and Australia in their dollars, everyone else in US dollars. Prices are fixed per currency (round local prices,
// not converted); Checkout charges the same amount in the same currency (src/app/api/license/checkout/route.ts).

import type { Lang } from "@/lib/i18n";
import type { Plan } from "@/lib/pricing";

export type Currency = "EUR" | "USD" | "GBP" | "CHF" | "CAD" | "AUD";
export const CURRENCIES: Currency[] = ["EUR", "USD", "GBP", "CHF", "CAD", "AUD"];

/** Prices in the smallest unit (cents, pence, Rappen). EUR must match PLANS in src/lib/pricing.ts. */
export const PRICES: Record<Currency, Record<Plan, number>> = {
  EUR: { monthly: 1999, lifetime: 7900 },
  USD: { monthly: 1999, lifetime: 7900 },
  GBP: { monthly: 1699, lifetime: 6900 },
  CHF: { monthly: 1990, lifetime: 7900 },
  CAD: { monthly: 2799, lifetime: 10900 },
  AUD: { monthly: 2999, lifetime: 11900 },
};

const BY_COUNTRY: Record<string, Currency> = {
  US: "USD", PR: "USD", GU: "USD", VI: "USD", AS: "USD", MP: "USD", UM: "USD",
  GB: "GBP", GG: "GBP", JE: "GBP", IM: "GBP",
  CH: "CHF", LI: "CHF",
  CA: "CAD",
  AU: "AUD",
};

/** Europe (EU, EEA and the rest of the continent) pays in euros. */
const EUROPE = new Set(
  "AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS NO AD MC SM VA ME XK AL BA MK RS MD UA FO GL GI AX".split(" "),
);

/** The currency for a two-letter country code; euros when the country is unknown (local development, no geo data). */
export function currencyFor(country: string | null | undefined): Currency {
  if (!country) return "EUR";
  const c = country.toUpperCase();
  return BY_COUNTRY[c] ?? (EUROPE.has(c) ? "EUR" : "USD");
}

const BOTS = /bot|crawl|spider|slurp|facebookexternalhit|preview|lighthouse|headless/i;

/**
 * The visitor's currency from the country Vercel resolves for each request (x-vercel-ip-country). Crawlers get euros,
 * so search engines see the prices of the structured data. Outside production the header x-kj-country stands in for
 * the country, to try other currencies locally.
 */
export function currencyForRequest(h: Headers): Currency {
  if (BOTS.test(h.get("user-agent") ?? "")) return "EUR";
  const country = h.get("x-vercel-ip-country") ?? (process.env.NODE_ENV !== "production" ? h.get("x-kj-country") : null);
  return currencyFor(country);
}

export const isCurrency = (value: unknown): value is Currency => typeof value === "string" && (CURRENCIES as string[]).includes(value);

/** Prices include German VAT only in euros; outside the EU no German VAT is charged. */
export const vatIncluded = (cur: Currency) => cur === "EUR";

/**
 * An amount for display: "79 €" / "€79" in euros (exactly as before), "$79", "£69", "CHF 79", "CA$109", "A$119" in the
 * other currencies. Whole amounts without decimals, unless `withCents` (receipts: "79,00 €").
 */
export function money(cents: number, cur: Currency, lang: Lang, withCents = false): string {
  const digits = withCents || cents % 100 ? 2 : 0;
  if (cur === "EUR") {
    const n = (cents / 100).toLocaleString(lang === "de" ? "de-DE" : "en-IE", { minimumFractionDigits: digits, maximumFractionDigits: 2 });
    return lang === "de" ? `${n} €` : `€${n}`;
  }
  const locale = cur === "CHF" ? "de-CH" : lang === "de" ? "de-DE" : cur === "GBP" ? "en-GB" : "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency: cur, minimumFractionDigits: digits, maximumFractionDigits: 2 }).format(cents / 100);
}

/**
 * Plan prices written into texts in euros ("19,99 €", "79 €", "39,50 €" / "€19.99", "€79", "€39.50"), replaced with the
 * visitor's prices. Euro texts come back unchanged. Other amounts (competitors' prices) stay as they are.
 */
export function localizePrices(text: string, lang: Lang, cur: Currency): string {
  if (cur === "EUR") return text;
  const p = PRICES[cur];
  const offer = Math.round(p.lifetime / 2);
  const swap: [RegExp, number][] =
    lang === "de"
      ? [
          [/(?<![\d,.])19,99[\s ]?€/g, p.monthly],
          [/(?<![\d,.])39,50[\s ]?€/g, offer],
          [/(?<![\d,.])79[\s ]?€/g, p.lifetime],
        ]
      : [
          [/€19\.99(?!\d)/g, p.monthly],
          [/€39\.50(?!\d)/g, offer],
          [/€79(?![\d.,])/g, p.lifetime],
        ];
  return swap.reduce((t, [re, cents]) => t.replace(re, money(cents, cur, lang)), text);
}

/** localizePrices for every string in a JSON-like value (the app copy). */
export function localizeAll<T>(value: T, lang: Lang, cur: Currency): T {
  if (cur === "EUR") return value;
  if (typeof value === "string") return localizePrices(value, lang, cur) as T;
  if (Array.isArray(value)) return value.map((v) => localizeAll(v, lang, cur)) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localizeAll(v, lang, cur)])) as T;
  return value;
}
