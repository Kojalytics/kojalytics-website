"use client";

import { useEffect, useState } from "react";
import { PLANS } from "@/lib/pricing";
import DigistoreBuyButton from "./DigistoreBuyButton";

/**
 * StickyBuyBar for the Digistore24 partner page: phones and tablets get a buy bar at the bottom edge once the hero is
 * scrolled past. It steps aside while the price section (#preise) is on screen and at the end of the page, and stays
 * hidden while the cookie banner is open (globals.css). One-time licence only, no discount code.
 */
export default function DigistoreStickyBuyBar({ source }: { source: string }) {
  const [show, setShow] = useState(false);

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
      inert={!show}
      className={`kj-buybar fixed inset-x-0 bottom-0 z-40 border-t border-foreground bg-white px-4 pt-3 transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="display whitespace-nowrap text-[1.35rem] leading-none text-buy">{PLANS.lifetime.label}</p>
          <p className="mt-1 text-[12.5px] leading-tight text-muted">einmalig, kein Abo</p>
        </div>
        <DigistoreBuyButton source={source} label="Jetzt kaufen" className="shrink-0 !px-5" />
      </div>
    </div>
  );
}
