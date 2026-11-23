import type { Lang } from "@/lib/i18n";
import { PRICES, money, type Currency } from "@/lib/currency";

export const TRIAL_DAYS = 3;

export const PLANS = {
  monthly: { cents: 1999, label: "19,99 €", per: "pro Monat", name: "Monatlich" },
  lifetime: { cents: 7900, label: "79 €", per: "einmalig", name: "Einmalkauf" },
} as const;

export type Plan = keyof typeof PLANS;

/** The plans' words on English pages (PLANS keeps the German ones). Use planText(plan, lang). */
const PLANS_EN = {
  monthly: { label: "€19.99", per: "a month", name: "Monthly" },
  lifetime: { label: "€79", per: "one-time", name: "One-time purchase" },
} as const;

/**
 * A plan's words and price for a page: German or English, in the visitor's currency (euros by default). `cents` is the
 * price in that currency; in euros the German label is exactly PLANS' label.
 */
export function planText(plan: Plan, lang: Lang, cur: Currency = "EUR") {
  const words = lang === "de" ? PLANS[plan] : { ...PLANS[plan], ...PLANS_EN[plan] };
  if (cur === "EUR") return words;
  return { ...words, cents: PRICES[cur][plan], label: money(PRICES[cur][plan], cur, lang) };
}

// The release files on GitHub. Visitors and e-mails only see the DOWNLOAD_PATH addresses: our server fetches the file
// from GitHub and streams it under kojalytics.com (src/app/download/[platform]/route.ts).
export const LAUNCHER_DOWNLOAD_URL =
  "https://github.com/Kojalytics/craft-launcher/releases/latest/download/Kojalytics-Launcher.dmg";
export const DOWNLOAD_PATH = "/download/mac";
export const LAUNCHER_DOWNLOAD_URL_WINDOWS =
  "https://github.com/Kojalytics/craft-launcher/releases/latest/download/Kojalytics-Launcher.msi";
export const DOWNLOAD_PATH_WINDOWS = "/download/windows";
