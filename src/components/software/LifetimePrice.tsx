"use client";

import { Tag } from "lucide-react";
import { useCurrency } from "@/lib/use-currency";
import { money } from "@/lib/currency";
import { planText } from "@/lib/pricing";
import { useDiscount } from "@/lib/discount-store";
import { discountLabel } from "@/lib/discount-text";
import { useLang } from "@/lib/use-lang";
import { isOfferCode, offerText } from "@/lib/offer";

const de = { active: ["Rabattcode ", " ist aktiv:"], introUntil: "Einführungspreis bis " };
const en: typeof de = { active: ["Discount code ", " is active:"], introUntil: "Introductory price until " };

/** The one-time price in a headline: with an active discount code the reduced price, the normal one struck through. */
export default function LifetimePrice() {
  const lang = useLang();
  const cur = useCurrency();
  const reduced = useDiscount()?.prices.lifetime;
  const full = planText("lifetime", lang, cur).label;
  if (reduced === undefined) return <span className="text-highlight">{full}</span>;
  return (
    <>
      <s className="text-[0.7em] text-faint decoration-2">{full}</s>{" "}
      <span className="text-highlight">{money(reduced, cur, lang)}</span>
    </>
  );
}

/** One line under the hero buttons while a discount code is active. */
export function ActiveDiscountNote() {
  const lang = useLang();
  const cur = useCurrency();
  const t = lang === "de" ? de : en;
  const discount = useDiscount();
  if (discount?.prices.lifetime === undefined) return null;
  return (
    <p className="rise-in mt-4 flex items-center justify-center gap-2 text-[15px] [--i:2]" role="status">
      <Tag size={15} className="shrink-0 text-success" aria-hidden />
      <span>
        {t.active[0]}<span className="font-mono font-semibold tracking-[0.06em]">{discount.code}</span>{t.active[1]}{" "}
        <span className="whitespace-nowrap font-semibold">{discountLabel(discount.label, lang)}</span>
        {isOfferCode(discount.code) && (
          <span className="block text-muted">{t.introUntil}{offerText(lang, cur).endLong}</span>
        )}
      </span>
    </p>
  );
}
