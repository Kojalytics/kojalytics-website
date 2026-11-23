"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { PLANS, planText, type Plan } from "@/lib/pricing";
import { euro, useDiscount } from "@/lib/discount-store";
import { href } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";
import { track } from "@/lib/track";

const de = {
  busy: "Checkout öffnet sich …",
  label: (price: string, action: string) => `Für ${price} ${action}`,
};
const en: typeof de = {
  busy: "Opening checkout…",
  label: (price: string) => `Buy for ${price}`,
};

/**
 * Straight to Stripe Checkout for one plan (default: the one-time 79 € license). An active discount code (ad link or
 * price section) is shown in the label and attached to the checkout; otherwise Stripe's own page takes a code.
 * If the checkout can't start, the visitor lands on the price section instead. On English pages (/en …) the
 * checkout opens in English and returns to the English pages.
 */
export default function BuyButton({
  plan = "lifetime",
  label,
  action = "kaufen",
  from,
  source,
  className = "",
}: {
  plan?: Plan;
  label?: string;
  /** The German verb after the price in the default label: "Für 39,50 € kaufen". English pages say "Buy for €39.50". */
  action?: string;
  /** "office": the ad landing page; Checkout then names Koja Office and its Back link returns there. */
  from?: "office";
  /** Where on the site the click happened, for the ad reports. */
  source: string;
  className?: string;
}) {
  const lang = useLang();
  const t = lang === "de" ? de : en;
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
        body: JSON.stringify({ plan, lang, ...(from ? { from } : {}), ...(discount && reduced !== undefined ? { code: discount.code } : {}) }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error();
      window.location.href = data.url;
    } catch {
      setBusy(false);
      window.location.href = href(lang, from === "office" ? "/office#fragen" : "/#preise");
    }
  }

  return (
    <button type="button" onClick={buy} disabled={busy} className={`btn-buy ${className}`}>
      <ShoppingBag size={15} strokeWidth={2.2} aria-hidden />
      {busy ? t.busy : (label ?? t.label(reduced !== undefined ? euro(reduced, lang) : planText(plan, lang).label, action))}
    </button>
  );
}
