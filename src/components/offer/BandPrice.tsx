"use client";

import { planText } from "@/lib/pricing";
import { offerText } from "@/lib/offer";
import { vatIncluded } from "@/lib/currency";
import { useCurrency } from "@/lib/use-currency";
import type { Lang } from "@/lib/i18n";

const T = {
  de: { instead: "statt", once: (vat: boolean) => (vat ? "einmalig, inkl. MwSt." : "einmalig") },
  en: { instead: "instead of", once: (vat: boolean) => (vat ? "one-time, incl. VAT" : "one-time") },
};

const num = "display text-[clamp(2.6rem,5vw,3.5rem)] leading-none";

/**
 * The prices of the Koja Office band (OfferBand.tsx) in the visitor's currency. The band sits on static pages, so the
 * currency follows the page language (src/lib/use-currency.tsx); German VAT is named only in euros.
 */
export function BandOfferPrice({ lang }: { lang: Lang }) {
  const cur = useCurrency();
  const t = T[lang];
  return (
    <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-1">
      <p className={num}>{offerText(lang, cur).price}</p>
      <p className="pb-1 text-[16px] text-muted">
        {t.instead} <s className="decoration-2">{planText("lifetime", lang, cur).label}</s> · {t.once(vatIncluded(cur))}
      </p>
    </div>
  );
}

export function BandRegularPrice({ lang }: { lang: Lang }) {
  const cur = useCurrency();
  return (
    <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-1">
      <p className={num}>{planText("lifetime", lang, cur).label}</p>
      <p className="pb-1 text-[16px] text-muted">{T[lang].once(vatIncluded(cur))}</p>
    </div>
  );
}
