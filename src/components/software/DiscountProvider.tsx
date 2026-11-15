"use client";

import { InitialDiscount, primeDiscount, type Discount } from "@/lib/discount-store";

/**
 * Hands a discount the server already checked (the ad link's ?code=) to every price and buy button below it, so the
 * reduced price is there with the first paint. The browser still checks the code once more, as on every page.
 */
export default function DiscountProvider({ initial, children }: { initial: Discount | null; children: React.ReactNode }) {
  if (initial && typeof window !== "undefined") primeDiscount(initial);
  return <InitialDiscount.Provider value={initial}>{children}</InitialDiscount.Provider>;
}
