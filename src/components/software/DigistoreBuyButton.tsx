"use client";

import { useSyncExternalStore } from "react";
import { ShoppingBag } from "lucide-react";
import { PLANS } from "@/lib/pricing";
import { track } from "@/lib/track";

/** Digistore24 order form for the one-time licence (product 765994). */
export const DS24_ORDER_URL = "https://www.checkout-ds24.com/product/765994";

// Digistore's promolink lands on the partner page with ?aff=<affiliate>&cam=<campaign>; both go on to the order form,
// so the affiliate is credited even without Digistore's cookie.
const FORWARDED = ["aff", "cam"] as const;

const subscribe = () => () => {};
const orderUrlNow = () => {
  const from = new URLSearchParams(window.location.search);
  const to = new URLSearchParams();
  for (const key of FORWARDED) {
    const value = from.get(key)?.trim();
    if (value) to.set(key, value);
  }
  const query = to.toString();
  return query ? `${DS24_ORDER_URL}?${query}` : DS24_ORDER_URL;
};

/**
 * The buy button of the Digistore24 partner page: looks like BuyButton, but is a plain link to the Digistore24 order
 * form (no Stripe, no discount code). The server renders the bare order-form address, so it works without JavaScript;
 * in the browser it carries the affiliate parameters of the current address.
 */
export default function DigistoreBuyButton({
  label = `Für ${PLANS.lifetime.label} kaufen`,
  source,
  className = "",
}: {
  label?: string;
  /** Where on the page the click happened, for the ad reports. */
  source: string;
  className?: string;
}) {
  const href = useSyncExternalStore(subscribe, orderUrlNow, () => DS24_ORDER_URL);

  return (
    <a
      href={href}
      onClick={() =>
        track("InitiateCheckout", { value: PLANS.lifetime.cents / 100, currency: "EUR", content_name: `lifetime:ds24-${source}` })
      }
      className={`btn-buy ${className}`}
    >
      <ShoppingBag size={15} strokeWidth={2.2} aria-hidden />
      {label}
    </a>
  );
}
