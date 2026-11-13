"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { PLANS, type Plan } from "@/lib/pricing";
import { euro, useDiscount } from "@/lib/discount-store";
import { track } from "@/lib/track";

/**
 * Straight to Stripe Checkout for one plan (default: the one-time 79 € licence). An active discount code (ad link or
 * price section) is shown in the label and attached to the checkout; otherwise Stripe's own page takes a code.
 * If the checkout can't start, the visitor lands on the price section instead.
 */
export default function BuyButton({
  plan = "lifetime",
  label,
  source,
  className = "",
}: {
  plan?: Plan;
  label?: string;
  /** Where on the site the click happened, for the ad reports. */
  source: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const discount = useDiscount();
  const reduced = discount?.prices[plan];

  // Coming back from Stripe with the Back button restores the page from the back/forward cache: unlock it again.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setBusy(false);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  async function buy() {
    setBusy(true);
    track("InitiateCheckout", { value: (reduced ?? PLANS[plan].cents) / 100, currency: "EUR", content_name: `${plan}:${source}` });
    try {
      const res = await fetch("/api/license/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, ...(discount && reduced !== undefined ? { code: discount.code } : {}) }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error();
      window.location.href = data.url;
    } catch {
      setBusy(false);
      window.location.href = "/software#preise";
    }
  }

  return (
    <button type="button" onClick={buy} disabled={busy} className={`btn-buy ${className}`}>
      <ShoppingBag size={15} strokeWidth={2.2} aria-hidden />
      {busy ? "Checkout öffnet sich …" : (label ?? `Für ${reduced !== undefined ? euro(reduced) : PLANS[plan].label} kaufen`)}
    </button>
  );
}
