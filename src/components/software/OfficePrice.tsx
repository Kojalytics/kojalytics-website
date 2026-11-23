"use client";

import { planText } from "@/lib/pricing";
import { useDiscount } from "@/lib/discount-store";
import { isOfferCode, offerText } from "@/lib/offer";
import { PRICES, money, vatIncluded } from "@/lib/currency";
import { useCurrency } from "@/lib/use-currency";
import { useLang } from "@/lib/use-lang";
import BuyButton from "./BuyButton";

/*
 * The prices of the ad landing page /office (and /en/office). Each piece reads the page's discount (the ad link's code,
 * checked on the server and handed down by <DiscountProvider>), so the reduced price is there with the first paint and
 * every number on the page agrees. Without a code everything shows the regular price. Styles: src/app/office/office.css.
 */

const de = {
  was: (price: string) => (
    <>
      statt <s>{price}</s>
    </>
  ),
  note: (vat: boolean) =>
    vat ? (
      <>
        einmalig · <span className="whitespace-nowrap">inkl. MwSt.</span>
      </>
    ) : (
      <>einmalig</>
    ),
  intro: (end: string) => (
    <>
      Einführungspreis bis <span className="whitespace-nowrap">{end}</span>
    </>
  ),
  code: (code: string) => (
    <>
      Code <b>{code}</b> <span>ist schon aktiv</span>
    </>
  ),
  order: "Deine Bestellung",
  sub: (
    <>
      <b>Einmalkauf</b> · 13 Apps für Mac und Windows, auf bis zu 3 Geräten
    </>
  ),
  total: "Gesamt",
  totalNote: (vat: boolean) =>
    vat ? (
      <>
        einmalig, <span>inkl. MwSt.</span>
      </>
    ) : (
      <>einmalig</>
    ),
  once: "einmal",
  save: (amount: string) => (
    <>
      Du sparst in 5 Jahren <b>{amount}</b>.
    </>
  ),
};

const en: typeof de = {
  was: (price: string) => (
    <>
      instead of <s>{price}</s>
    </>
  ),
  note: (vat: boolean) =>
    vat ? (
      <>
        one-time · <span className="whitespace-nowrap">incl. VAT</span>
      </>
    ) : (
      <>one-time</>
    ),
  intro: (end: string) => (
    <>
      Introductory price until <span className="whitespace-nowrap">{end}</span>
    </>
  ),
  code: (code: string) => (
    <>
      Code <b>{code}</b> <span>is already applied</span>
    </>
  ),
  order: "Your order",
  sub: (
    <>
      <b>One-time purchase</b> · 13 apps for Mac and Windows, on up to 3 devices
    </>
  ),
  total: "Total",
  totalNote: (vat: boolean) =>
    vat ? (
      <>
        one-time, <span>incl. VAT</span>
      </>
    ) : (
      <>one-time</>
    ),
  once: "once",
  save: (amount: string) => (
    <>
      You save <b>{amount}</b> over 5 years.
    </>
  ),
};

const T = { de, en };

function useOffer() {
  const discount = useDiscount();
  const cur = useCurrency();
  const reduced = discount?.prices.lifetime;
  return { discount: reduced !== undefined ? discount : null, cents: reduced ?? PRICES[cur].lifetime, full: PRICES[cur].lifetime, cur };
}

/** The price as plain text inside a sentence or a headline. */
export function Price() {
  const lang = useLang();
  const { cents, cur } = useOffer();
  return <span className="whitespace-nowrap">{money(cents, cur, lang)}</span>;
}

/** The price block of the hero, as in the ad: the yellow tag, the price, the regular price struck through. */
export function HeroPrice() {
  const lang = useLang();
  const t = T[lang];
  const { discount, cents, cur } = useOffer();
  return (
    <div className={discount ? "ko-price" : "ko-price ko-price--plain"}>
      {discount && <span className="ko-tag">{discount.label}</span>}
      <p className="ko-price-num">{money(cents, cur, lang)}</p>
      {discount && <p className="ko-price-was">{t.was(planText("lifetime", lang, cur).label)}</p>}
      <p className="ko-price-note">{t.note(vatIncluded(cur))}</p>
      {isOfferCode(discount?.code) && <p className="ko-price-end">{t.intro(offerText(lang, cur).endLong)}</p>}
    </div>
  );
}

/** The blue code bar of the ad, right above the buy button: the code from the ad is already active. */
export function CodeBar() {
  const lang = useLang();
  const { discount } = useOffer();
  if (!discount) return null;
  return (
    <p className="ko-code">
      <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden>
        <circle cx="10" cy="10" r="9" fill="#fff" />
        <path d="M5.8 10.2l2.8 2.7 5.6-5.8" fill="none" stroke="#2a66d8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{T[lang].code(discount.code)}</span>
    </p>
  );
}


/** The final offer as a receipt: the regular price, the code taken off, the total, and the buy button in one frame. */
export function Receipt({ source }: { source: string }) {
  const lang = useLang();
  const t = T[lang];
  const { discount, cents, full, cur } = useOffer();
  // An amount on the receipt always shows its cents: 79,00 € / €79.00 / $79.00.
  const amount = (c: number) => money(c, cur, lang, true);
  return (
    <div className="ko-rcpt">
      <p className="ko-rcpt-head" aria-hidden>
        <span>{t.order}</span>
        <span>Kojalytics, Hamburg</span>
      </p>
      <div className="ko-rcpt-line">
        <p>Koja Office 2026</p>
        <i aria-hidden />
        <p className="ko-rcpt-amt">{amount(full)}</p>
      </div>
      <p className="ko-rcpt-sub">{t.sub}</p>
      {discount && (
        <div className="ko-rcpt-line ko-rcpt-line--minus">
          <p>
            Code <b>{discount.code}</b>
          </p>
          <i aria-hidden />
          <p className="ko-rcpt-amt">−{amount(full - cents)}</p>
        </div>
      )}
      <div className="ko-rcpt-total">
        <p>
          {t.total}
          <span>{t.totalNote(vatIncluded(cur))}</span>
        </p>
        <p className="ko-rcpt-price">{money(cents, cur, lang)}</p>
      </div>
      <BuyButton source={source} from="office" className="ko-btn" />
    </div>
  );
}

/** The one payment as a bar segment, in true proportion to the subscription total above it. */
export function OnceBar({ totalCents }: { totalCents: number }) {
  const lang = useLang();
  const { cents } = useOffer();
  return (
    <div className="ko-once" data-reveal aria-hidden>
      <i style={{ width: `${((cents / totalCents) * 100).toFixed(2)}%` }} />
      <span>{T[lang].once}</span>
    </div>
  );
}

/** What stays in the pocket after five years, against the subscription total. */
export function Savings({ totalCents }: { totalCents: number }) {
  const lang = useLang();
  const { cents, cur } = useOffer();
  return <p className="ko-save">{T[lang].save(money(totalCents - cents, cur, lang))}</p>;
}
