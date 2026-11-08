"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/** Reports a completed purchase once per order; the order id also lets Google and Meta drop duplicates. */
export default function TrackPurchase({ orderId, value, subscription }: { orderId: string; value: number; subscription: boolean }) {
  useEffect(() => {
    // Without consent nothing is reported and nothing is stored (§ 25 TDDDG).
    const key = `kj-purchase-${orderId}`;
    try {
      if (localStorage.getItem("kj-consent-v1") !== "granted" || localStorage.getItem(key)) return;
      localStorage.setItem(key, "1");
    } catch {
      return;
    }
    // Tags load a moment after consent; give them time before reporting.
    const t = setTimeout(
      () => track(subscription ? "Subscribe" : "Purchase", { value, currency: "EUR", transaction_id: orderId }, { eventID: orderId }),
      1500,
    );
    return () => clearTimeout(t);
  }, [orderId, value, subscription]);
  return null;
}
