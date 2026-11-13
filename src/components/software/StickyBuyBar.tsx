"use client";

import { useEffect, useState } from "react";
import { PLANS } from "@/lib/pricing";
import { euro, useDiscount } from "@/lib/discount-store";
import BuyButton from "./BuyButton";

/**
 * Phones and tablets: a buy bar fixed to the bottom edge once the hero is scrolled past. It steps aside while the
 * price section (#preise, which has its own buttons and the discount field) is on screen and at the end of the page.
 * While the cookie banner is open it stays hidden (globals.css).
 */
export default function StickyBuyBar({ source }: { source: string }) {
  const [show, setShow] = useState(false);
  const reduced = useDiscount()?.prices.lifetime;

  useEffect(() => {
    const prices = document.getElementById("preise");
    const update = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.9;
      const nearEnd = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 320;
      const box = prices?.getBoundingClientRect();
      const pricesInView = !!box && box.top < window.innerHeight && box.bottom > 0;
      setShow(pastHero && !pricesInView && !nearEnd);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`kj-buybar fixed inset-x-0 bottom-0 z-40 border-t border-foreground bg-white px-4 pt-3 transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="display whitespace-nowrap text-[1.35rem] leading-none text-buy">
            {reduced !== undefined && <s className="text-[0.75em] text-faint decoration-2">{PLANS.lifetime.label}</s>}
            {reduced !== undefined ? ` ${euro(reduced)}` : PLANS.lifetime.label}
          </p>
          <p className="mt-1 text-[12.5px] leading-tight text-muted">
            einmalig, kein Abo ·{" "}
            <a href="#preise" tabIndex={show ? 0 : -1} className="text-foreground underline underline-offset-2">
              Rabattcode?
            </a>
          </p>
        </div>
        <BuyButton source={source} label="Jetzt kaufen" className="shrink-0 !px-5" />
      </div>
    </div>
  );
}
