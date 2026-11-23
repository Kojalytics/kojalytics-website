import { PLANS } from "@/lib/pricing";

/**
 * The one public offer for Koja Office, used by the header, the phone menu, the Koja Office band above the footer and
 * the teasers: the code KOJA50-B7RT takes 50 % off the one-time licence. It is an introductory offer with a fixed end
 * (owner decision, Nov 2026): it runs until the end of 30 November 2026, Berlin time, and is never extended
 * automatically. After the end the site shows the regular price, links to /software without a code, and findDiscount
 * (src/lib/discounts.ts) no longer accepts the code.
 */
export const OFFER_CODE = "KOJA50-B7RT";
export const OFFER_PERCENT = 50;
/** Linked with a plain <a> (a full page load), so /software reads the code from the URL even when coming from /software. */
export const OFFER_HREF = `/?code=${OFFER_CODE}`;
/** The last day of the offer (ISO date). It runs until the end of this day, Berlin time. */
export const OFFER_LAST_DAY = "2026-11-30";

const [year, month, day] = OFFER_LAST_DAY.split("-").map(Number);
const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
// Midnight after the last day in Berlin. Late November is winter time there (CET, UTC+1): 23:00 UTC.
const endsMs = Date.UTC(year, month - 1, day + 1) - 60 * 60 * 1000;

/** "30. November 2026" */
export const OFFER_END_LONG = `${day}. ${MONTHS[month - 1]} ${year}`;
/** "30.11." */
export const OFFER_END_SHORT = `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.`;

/** Whether the offer still runs at `now` (ms since 1970). */
export const isOfferRunning = (now: number = Date.now()) => now < endsMs;

/** The end as ms since 1970, for the inline script in layout.tsx that switches static pages over at the end. */
export const OFFER_ENDS_MS = endsMs;

const euro = (cents: number) =>
  (cents / 100).toLocaleString("de-DE", { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 }) + " €";

const offerCents = Math.round((PLANS.lifetime.cents * (100 - OFFER_PERCENT)) / 100);
/** "39,50 €": the one-time price with the code, from PLANS.lifetime. */
export const OFFER_PRICE = euro(offerCents);
/** "−50 %" */
export const OFFER_LABEL = `−${OFFER_PERCENT} %`;

/**
 * The offer as a discount, already applied on the Koja pages (/software, app pages) while it runs, so their prices and
 * buy buttons show 39,50 € from the first paint, without a code in the link. Lifetime licence only; the checkout gets
 * the code and Stripe checks it there.
 */
export const OFFER_DISCOUNT = {
  code: OFFER_CODE,
  label: OFFER_LABEL,
  duration: "once" as const,
  months: null,
  prices: { lifetime: offerCents },
};

/** Whether a code (from a link or the price section) is this offer's code. Stripe codes ignore case. */
export const isOfferCode = (code: string | null | undefined) => !!code && code.trim().toUpperCase() === OFFER_CODE;
