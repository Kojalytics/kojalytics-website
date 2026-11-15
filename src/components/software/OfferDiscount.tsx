"use client";

import { InitialDiscount, seedDiscount } from "@/lib/discount-store";
import { OFFER_DISCOUNT } from "@/lib/offer";

/**
 * The Koja pages (/software, app pages): while the offer runs, every price and buy button below shows the offer price
 * from the first paint, as if the visitor had come with /software?code=KOJA50-B7RT. A code from a link or the price
 * section still replaces it. `running` is decided on the server; a page built before the end drops the offer in the
 * browser right after hydration (seedDiscount checks the clock again).
 */
export default function OfferDiscount({ running, children }: { running: boolean; children: React.ReactNode }) {
  if (running && typeof window !== "undefined") seedDiscount(OFFER_DISCOUNT);
  return <InitialDiscount.Provider value={running ? OFFER_DISCOUNT : null}>{children}</InitialDiscount.Provider>;
}
