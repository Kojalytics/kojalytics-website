"use client";

import { InitialDiscount, seedDiscount } from "@/lib/discount-store";
import { offerDiscount } from "@/lib/offer";
import type { Currency } from "@/lib/currency";
import { CurrencyProvider } from "@/lib/use-currency";

/**
 * The Koja pages (/software, app pages): while the offer runs, every price and buy button below shows the offer price
 * from the first paint, as if the visitor had come with /software?code=KOJA50-B7RT. A code from a link or the price
 * section still replaces it. `running` is decided on the server; a page built before the end drops the offer in the
 * browser right after hydration (seedDiscount checks the clock again). `currency`: the visitor's, decided on the server
 * (src/lib/currency-server.ts); it also goes to every price below.
 */
export default function OfferDiscount({ running, currency, children }: { running: boolean; currency: Currency; children: React.ReactNode }) {
  const offer = offerDiscount(currency);
  if (running && typeof window !== "undefined") seedDiscount(offer);
  return (
    <CurrencyProvider currency={currency}>
      <InitialDiscount.Provider value={running ? offer : null}>{children}</InitialDiscount.Provider>
    </CurrencyProvider>
  );
}
