"use client";

import { PLANS } from "@/lib/pricing";
import { euro, useDiscount } from "@/lib/discount-store";
import { OFFER_END_LONG, isOfferCode } from "@/lib/offer";
import BuyButton from "./BuyButton";

/*
 * The prices of the ad landing page /office. Each piece reads the page's discount (the ad link's code, checked on the
 * server and handed down by <DiscountProvider>), so the reduced price is there with the first paint and every number
 * on the page agrees. Without a code everything shows the regular price. Styles: src/app/office/office.css.
 */

function useOffer() {
  const discount = useDiscount();
  const reduced = discount?.prices.lifetime;
  return { discount: reduced !== undefined ? discount : null, cents: reduced ?? PLANS.lifetime.cents };
}

/** The price as plain text inside a sentence or a headline. */
export function Price() {
  return <span className="whitespace-nowrap">{euro(useOffer().cents)}</span>;
}

/** The price block of the hero, as in the ad: the yellow tag, the price, the regular price struck through. */
export function HeroPrice() {
  const { discount, cents } = useOffer();
  return (
    <div className={discount ? "ko-price" : "ko-price ko-price--plain"}>
      {discount && <span className="ko-tag">{discount.label}</span>}
      <p className="ko-price-num">{euro(cents)}</p>
      {discount && (
        <p className="ko-price-was">
          statt <s>{PLANS.lifetime.label}</s>
        </p>
      )}
      <p className="ko-price-note">
        einmalig · <span className="whitespace-nowrap">inkl. MwSt.</span>
      </p>
      {isOfferCode(discount?.code) && (
        <p className="ko-price-end">
          Einführungspreis bis <span className="whitespace-nowrap">{OFFER_END_LONG}</span>
        </p>
      )}
    </div>
  );
}

/** The blue code bar of the ad, right above the buy button: the code from the ad is already active. */
export function CodeBar() {
  const { discount } = useOffer();
  if (!discount) return null;
  return (
    <p className="ko-code">
      <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden>
        <circle cx="10" cy="10" r="9" fill="#fff" />
        <path d="M5.8 10.2l2.8 2.7 5.6-5.8" fill="none" stroke="#2a66d8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>
        Code <b>{discount.code}</b> <span>ist schon aktiv</span>
      </span>
    </p>
  );
}

// An amount on the receipt always shows its cents: 79,00 €.
const amount = (cents: number) => (cents / 100).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

/** The final offer as a receipt: the regular price, the code taken off, the total, and the buy button in one frame. */
export function Receipt({ source }: { source: string }) {
  const { discount, cents } = useOffer();
  return (
    <div className="ko-rcpt">
      <p className="ko-rcpt-head" aria-hidden>
        <span>Deine Bestellung</span>
        <span>Kojalytics, Hamburg</span>
      </p>
      <div className="ko-rcpt-line">
        <p>Koja Office 2026</p>
        <i aria-hidden />
        <p className="ko-rcpt-amt">{amount(PLANS.lifetime.cents)}</p>
      </div>
      <p className="ko-rcpt-sub">
        <b>Dauerlizenz</b> · 13 Apps für Mac und Windows, auf bis zu 3 Geräten
      </p>
      {discount && (
        <div className="ko-rcpt-line ko-rcpt-line--minus">
          <p>
            Code <b>{discount.code}</b>
          </p>
          <i aria-hidden />
          <p className="ko-rcpt-amt">−{amount(PLANS.lifetime.cents - cents)}</p>
        </div>
      )}
      <div className="ko-rcpt-total">
        <p>
          Gesamt
          <span>
            einmalig, <span>inkl. MwSt.</span>
          </span>
        </p>
        <p className="ko-rcpt-price">{euro(cents)}</p>
      </div>
      <BuyButton source={source} from="office" className="ko-btn" />
    </div>
  );
}

/** The one payment as a bar segment, in true proportion to the subscription total above it. */
export function OnceBar({ totalCents }: { totalCents: number }) {
  const { cents } = useOffer();
  return (
    <div className="ko-once" data-reveal aria-hidden>
      <i style={{ width: `${((cents / totalCents) * 100).toFixed(2)}%` }} />
      <span>einmal</span>
    </div>
  );
}

/** What stays in the pocket after five years, against the subscription total. */
export function Savings({ totalCents }: { totalCents: number }) {
  const { cents } = useOffer();
  return (
    <p className="ko-save">
      Du sparst in 5 Jahren <b>{euro(totalCents - cents)}</b>.
    </p>
  );
}
