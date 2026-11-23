import { euro, type Lang } from "@/lib/i18n";

/**
 * A discount's words on English pages. Labels and error messages are made in German (src/lib/discounts.ts,
 * src/lib/offer.ts, the license API routes); German pages show them as they are.
 */

/** "−50 %" → "−50%", "−10,00 €" → "−€10". German stays as it is. */
export function discountLabel(label: string, lang: Lang): string {
  if (lang === "de") return label;
  const percent = label.match(/^−([\d,]+) %$/);
  if (percent) return `−${percent[1].replace(",", ".")}%`;
  const amount = label.match(/^−([\d.]+),(\d{2}) €$/);
  if (amount) return `−${euro(Number(amount[1].replace(/\./g, "")) * 100 + Number(amount[2]), "en")}`;
  return label;
}

const ERRORS_EN: Record<string, string> = {
  "Bitte gib einen Rabattcode ein.": "Please enter a discount code.",
  "Diesen Rabattcode gibt es nicht.": "This discount code doesn't exist.",
  "Dieser Rabattcode wurde schon eingelöst.": "This discount code has already been used.",
  "Dieser Rabattcode ist nicht mehr gültig.": "This discount code is no longer valid.",
  "Dieser Rabattcode gilt nicht für dieses Paket.": "This discount code doesn't apply to this plan.",
  "Dieser Rabattcode gilt nicht in deiner Währung.": "This discount code isn't valid in your currency.",
  "Rabattcodes sind gerade nicht verfügbar.": "Discount codes aren't available right now.",
  "Zu viele Versuche. Bitte versuche es in einer Stunde erneut.": "Too many attempts. Please try again in an hour.",
  "Der Code konnte gerade nicht geprüft werden. Bitte versuche es gleich noch einmal.":
    "We couldn't check the code just now. Please try again in a moment.",
};

/** An error message of the discount and checkout routes in a language. */
export const discountError = (message: string, lang: Lang) =>
  lang === "de" ? message : (ERRORS_EN[message] ?? "We couldn't check the code. Please try again in a moment.");
