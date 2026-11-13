"use client";

import { Tag } from "lucide-react";
import { PLANS } from "@/lib/pricing";
import { euro, useDiscount } from "@/lib/discount-store";

/** The one-time price in a headline: with an active discount code the reduced price, the normal one struck through. */
export default function LifetimePrice() {
  const reduced = useDiscount()?.prices.lifetime;
  if (reduced === undefined) return <span className="text-highlight">{PLANS.lifetime.label}</span>;
  return (
    <>
      <s className="text-[0.7em] text-faint decoration-2">{PLANS.lifetime.label}</s>{" "}
      <span className="text-highlight">{euro(reduced)}</span>
    </>
  );
}

/** One line under the hero buttons while a discount code is active. */
export function ActiveDiscountNote() {
  const discount = useDiscount();
  if (discount?.prices.lifetime === undefined) return null;
  return (
    <p className="rise-in mt-4 flex items-center justify-center gap-2 text-[15px] [--i:2]" role="status">
      <Tag size={15} className="shrink-0 text-success" aria-hidden />
      <span>
        Rabattcode <span className="font-mono font-semibold tracking-[0.06em]">{discount.code}</span> ist aktiv:{" "}
        <span className="whitespace-nowrap font-semibold">{discount.label}</span>
      </span>
    </p>
  );
}
