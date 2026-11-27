import { createContext, useContext, useSyncExternalStore } from "react";
import type { Plan } from "@/lib/pricing";
import { OFFER_PAUSED, isOfferCode, isOfferRunning } from "@/lib/offer";
import { euro as euroIn, langOf, type Lang } from "@/lib/i18n";

/** A discount code checked with Stripe, as /api/license/discount returns it. */
export type Discount = {
  code: string;
  label: string;
  duration: "once" | "repeating" | "forever";
  months: number | null;
  prices: Partial<Record<Plan, number>>;
};

/** "39,50 €" (German, the default) or "€39.50" on English pages. */
export const euro = (cents: number, lang: Lang = "de") =>
  lang === "de"
    ? (cents / 100).toLocaleString("de-DE", { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 }) + " €"
    : euroIn(cents, lang);

/**
 * One discount for the whole page: an ad link (/software?code=X, also ?rabatt=X) or a code redeemed in the price
 * section applies to every price and buy button. The code is kept for this browser tab (sessionStorage), so it
 * survives moving between /software and the app pages. The server renders the normal prices, except on pages that
 * checked the link's code on the server and pass it through <DiscountProvider> (the ad landing page /office): there
 * the reduced price is in the first paint, without a jump from 79 €.
 */
const KEY = "kj-discount-code";

let discount: Discount | null = null;
// Bumped on every change, so a slow check of the link's code can't undo a later redeem or remove.
let version = 0;
let started = false;
const listeners = new Set<() => void>();

function set(next: Discount | null) {
  discount = next;
  version++;
  try {
    if (next) sessionStorage.setItem(KEY, next.code);
    else sessionStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((listener) => listener());
}

export const applyDiscount = (next: Discount) => set(next);
export const clearDiscount = () => set(null);

/** The discount the server checked for this page (see DiscountProvider); null on all other pages. */
export const InitialDiscount = createContext<Discount | null>(null);

/** Takes over the server-checked discount before the first client render, so hydration shows the same price. */
export function primeDiscount(next: Discount) {
  if (discount || version) return;
  discount = next;
  try {
    sessionStorage.setItem(KEY, next.code);
  } catch {}
}

// The public offer (src/lib/offer.ts) applied by default on the Koja pages; a code from a link or the price section
// replaces it, and an unknown code falls back to it.
let seed: Discount | null = null;

/** Applies the running offer before the first client render (see OfferDiscount); a code checked later replaces it. */
export function seedDiscount(next: Discount) {
  if (isOfferCode(next.code) && !isOfferRunning()) return;
  seed = next;
  if (!discount && !version) discount = next;
}

// The code from the link (or kept from an earlier page), checked once per page load.
async function applyStoredCode() {
  let code = "";
  try {
    const params = new URLSearchParams(window.location.search);
    const fromLink = (params.get("code") || params.get("rabatt") || "").trim();
    // Ad links still carry the offer's code: once the offer ended or is paused, a link no longer applies it (also in a
    // tab kept open across the end). Typed into the price section it is kept in sessionStorage and still works.
    if (isOfferCode(fromLink) && !isOfferRunning()) {
      if (discount && isOfferCode(discount.code) && discount === seed) set(null);
      code = (sessionStorage.getItem(KEY) || "").trim();
      if (isOfferCode(code) && !OFFER_PAUSED) code = "";
    } else {
      code = (fromLink || sessionStorage.getItem(KEY) || "").trim();
      if (isOfferCode(code) && !isOfferRunning() && !OFFER_PAUSED) {
        sessionStorage.removeItem(KEY);
        if (discount && isOfferCode(discount.code)) set(null);
        return;
      }
    }
    if (code) sessionStorage.setItem(KEY, code);
  } catch {}
  if (!code) return;
  // The offer is already applied from offer.ts; the checkout checks the code with Stripe.
  if (seed && discount === seed && code.toUpperCase() === seed.code.toUpperCase()) return;
  const v = version;
  try {
    const res = await fetch("/api/license/discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // The language of the page decides the currency of the prices (src/lib/currency.ts).
      body: JSON.stringify({ code, lang: langOf(window.location.pathname) }),
    });
    const data = res.ok ? await res.json() : null;
    if (version !== v) return;
    if (data) set(data);
    // Unknown, used up or expired: forget it without a message (back to the offer, if any). Rate limit or server
    // trouble: keep it for the next page.
    else if (res.status < 500 && res.status !== 429) set(seed && code.toUpperCase() !== seed.code.toUpperCase() ? seed : null);
  } catch {}
}

function subscribe(listener: () => void) {
  if (!started) {
    started = true;
    void applyStoredCode();
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useDiscount() {
  const initial = useContext(InitialDiscount);
  return useSyncExternalStore(
    subscribe,
    () => discount,
    () => initial,
  );
}
