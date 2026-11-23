"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/lib/use-currency";
import { money } from "@/lib/currency";
import { planText } from "@/lib/pricing";
import { useDiscount } from "@/lib/discount-store";
import { useLang } from "@/lib/use-lang";
import BuyButton from "./BuyButton";

const de = { note: "einmalig, kein Abo", code: "Rabattcode?", buy: "Jetzt kaufen" };
const en: typeof de = { note: "pay once, no subscription", code: "Discount code?", buy: "Buy now" };

/**
 * Phones and tablets: a buy bar fixed to the bottom edge once the hero is scrolled past. It steps aside while the
 * price section (#preise, which has its own buttons and the discount field) is on screen and at the end of the page.
 * While the cookie banner is open it stays hidden (globals.css). `from="office"`: the ad landing page, which has no
 * price section and no code field; there the bar is dark like the ad, with a yellow price and a large plain-type button
 * (.ko-bar in src/app/office/office.css), comes only after the hero's buy button has left the screen and steps aside
 * while another buy button of the page is on screen.
 */
export default function StickyBuyBar({ source, from }: { source: string; from?: "office" }) {
  const lang = useLang();
  const cur = useCurrency();
  const t = lang === "de" ? de : en;
  const full = planText("lifetime", lang, cur).label;
  const [show, setShow] = useState(false);
  const reduced = useDiscount()?.prices.lifetime;
  const office = from === "office";

  useEffect(() => {
    const prices = document.getElementById("preise");
    const inView = (el: Element | null | undefined) => {
      const box = el?.getBoundingClientRect();
      return !!box && box.top < window.innerHeight && box.bottom > 0;
    };
    const update = () => {
      const nearEnd = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 320;
      if (office) {
        // The page's own buy buttons, the hero's first.
        const buttons = [...document.querySelectorAll(".ko-page main .btn-buy")];
        const first = buttons[0]?.getBoundingClientRect();
        setShow(!!first && first.bottom < 0 && !buttons.some(inView) && !nearEnd);
        return;
      }
      const pastHero = window.scrollY > window.innerHeight * 0.9;
      setShow(pastHero && !inView(prices) && !nearEnd);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [office]);

  return (
    <div
      aria-hidden={!show}
      // Hidden means out of sight for everyone: moved below the edge and, once it has slid out, not rendered at all.
      className={`kj-buybar fixed inset-x-0 bottom-0 z-40 border-t px-4 pt-3 transition-[transform,visibility] duration-300 lg:hidden ${
        office ? "ko-bar" : "border-foreground bg-white"
      } ${show ? "visible translate-y-0" : "pointer-events-none invisible translate-y-full"}`}
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className={office ? "ko-bar-price" : "display whitespace-nowrap text-[1.35rem] leading-none text-buy"}>
            {reduced !== undefined && <s className={office ? undefined : "text-[0.75em] text-faint decoration-2"}>{full}</s>}
            {reduced !== undefined ? ` ${money(reduced, cur, lang)}` : full}
          </p>
          <p className={office ? "ko-bar-note" : "mt-1 text-[12.5px] leading-tight text-muted"}>
            {office ? (
              t.note
            ) : (
              <>
                {`${t.note} ·`}{" "}
                <a href="#preise" tabIndex={show ? 0 : -1} className="text-foreground underline underline-offset-2">
                  {t.code}
                </a>
              </>
            )}
          </p>
        </div>
        <BuyButton source={source} from={from} label={t.buy} className={office ? "ko-btn ko-btn--bar" : "shrink-0 !px-5"} />
      </div>
    </div>
  );
}
