// The currency a visitor pays in follows the language of the page: euros on the German pages, US dollars on the English
// ones (currencyFor). Prices are fixed per currency (round prices, not converted); Checkout charges the same amount in the
// same currency (src/app/api/license/checkout/route.ts).

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

/**
 * The currency of a page: the German pages (Germany, Austria, Switzerland) sell in euros, the English pages (everyone
 * else) in US dollars. The other currencies stay defined for orders placed in them before November 2026.
 */
export const currencyFor = (lang: Lang): Currency => (lang === "en" ? "USD" : "EUR");

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
          [/€79(?!\d|[.,]\d)/g, p.lifetime],
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
