"use client";

import { PLANS } from "@/lib/pricing";
import { euro, useDiscount } from "@/lib/discount-store";

/** The price block of the ad landing page: with the ad's code the reduced price and the badge, as in the ad itself. */
export default function OfficePrice() {
  const discount = useDiscount();
  const reduced = discount?.prices.lifetime;
  return (
    <div>
      {reduced !== undefined && (
        <span className="inline-block bg-[#fde047] px-2 py-0.5 text-[15px] font-bold leading-snug text-foreground">{discount?.label}</span>
      )}
      <p className="display mt-1.5 text-[clamp(2.6rem,9vw,3.6rem)] leading-none">{reduced !== undefined ? euro(reduced) : PLANS.lifetime.label}</p>
      <p className="mt-1.5 text-[15px] leading-snug text-muted">
        {reduced !== undefined && (
          <>
            statt <s className="decoration-2">{PLANS.lifetime.label}</s>
            {" · "}
          </>
        )}
        einmalig · Dauerlizenz
      </p>
    </div>
  );
}
