"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/** Reports a completed purchase once per checkout session. */
export default function TrackPurchase({ sessionId, value, subscription }: { sessionId: string; value: number; subscription: boolean }) {
  useEffect(() => {
    const key = `kj-purchase-${sessionId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    // Tags load a moment after consent; give them time before reporting.
    const t = setTimeout(() => track(subscription ? "Subscribe" : "Purchase", { value, currency: "EUR" }), 1500);
    return () => clearTimeout(t);
  }, [sessionId, value, subscription]);
  return null;
}
