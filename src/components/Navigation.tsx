"use client";

import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DownloadButton from "@/components/software/DownloadButton";
import BuyButton from "@/components/software/BuyButton";
import DigistoreBuyButton from "@/components/software/DigistoreBuyButton";
import RevealManager from "@/components/instrument/RevealManager";
import ScrollRuler from "@/components/instrument/ScrollRuler";
import { euro, useDiscount } from "@/lib/discount-store";
import { PLANS } from "@/lib/pricing";
import { OFFER_CODE, OFFER_END_LONG, OFFER_HREF, OFFER_LABEL, OFFER_PRICE, isOfferRunning } from "@/lib/offer";

const navLinks = [
  { href: "/", label: "Koja Office" },
  { href: "/#apps", label: "Apps" },
  { href: "/web", label: "Im Browser testen" },
  { href: "/#preise", label: "Preise" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/support", label: "Support" },
];

/** `header`: in the header the word gets smaller below 380px and gives way below 360px, so the offer button fits beside it. */
export function Logo({ header = false }: { header?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" title="Koja Office Startseite">
      <span aria-hidden className="kj-logo-k grid h-7 w-7 place-items-center bg-foreground font-[family-name:var(--font-display)] text-[14px] font-extrabold text-white">
        K
      </span>
      <span className={`kj-logo-word display text-[17px] tracking-[-0.01em] ${header ? "max-[379px]:text-[14px] max-[359px]:hidden" : ""}`}>
        Koja Office
      </span>
    </Link>
  );
}

/** The first-visit logo intro (see .kj-intro-layer in globals.css); hidden unless html.kj-intro is set. */
function IntroLogo() {
  return (
    <div aria-hidden className="kj-intro-layer">
      <div className="kj-intro-mark">
        <div className="kj-intro-row">
          <span className="kj-intro-k">K</span>
          <span className="kj-intro-word">
            <span className="display tracking-[-0.01em]">Koja Office</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * The offer button on the right of the header: Koja Office with the introductory code (src/lib/offer.ts). Both states
 * are in the markup; the inline script in layout.tsx marks <html> once the offer has ended and CSS shows the second one
 * (plain "Koja Office ansehen" to the homepage), so cached pages switch over at the end without a new build.
 */
function OfferButton({ hidden = false }: { hidden?: boolean }) {
  // "invisible" (visibility: hidden) also takes it out of the tab order and the accessibility tree.
  const hide = hidden ? "invisible" : "";
  return (
    <>
      <a
        href={OFFER_HREF}
        aria-label={`Koja Office ${OFFER_LABEL} mit Code ${OFFER_CODE}, bis ${OFFER_END_LONG}`}
        className={`offer-btn offer-live ${hide}`}
      >
        <span className="offer-tag">{OFFER_LABEL}</span>
        <span>Koja Office</span>
        <span className="hidden items-center gap-2 xl:inline-flex">
          <span className="offer-btn-sub max-[1399px]:hidden">Code</span>
          <span className="offer-code">{OFFER_CODE}</span>
        </span>
        <span className="offer-btn-sub hidden font-sans text-[12.5px] normal-case tracking-normal xl:inline">bis {OFFER_END_LONG}</span>
        <ArrowRight size={14} strokeWidth={2.2} className="hidden shrink-0 sm:block" aria-hidden />
      </a>
      <Link href="/" className={`offer-btn offer-over ${hide}`}>
        <span>
          Koja Office<span className="max-sm:hidden"> ansehen</span>
        </span>
        <ArrowRight size={14} strokeWidth={2.2} className="shrink-0" aria-hidden />
      </Link>
    </>
  );
}

/**
 * The Koja pages (/software, app pages): with an active discount the green buy button with the reduced price, otherwise
 * the offer button. Both sit in the same grid cell and only swap visibility, so the slot keeps its width (no jump).
 */
function BuyOrOffer() {
  const reduced = useDiscount()?.prices.lifetime;
  const buy = reduced !== undefined;
  const hide = buy ? "" : "invisible";
  return (
    <div className="grid max-[359px]:flex-1 [&>*]:[grid-area:1/1]">
      <OfferButton hidden={buy} />
      <BuyButton
        source="nav"
        // While hidden it already holds a reduced price, so the slot does not widen when a code arrives.
        label={`${buy ? euro(reduced) : OFFER_PRICE} · Kaufen`}
        className={`!min-h-full !gap-2 !whitespace-nowrap !border-0 !px-3.5 !text-[11px] !tracking-[0.08em] lg:!hidden ${hide}`}
      />
      {/* As wide as its label, at the right end of the slot (the slot is as wide as the offer button) */}
      <BuyButton source="nav" className={`hidden !min-h-full justify-self-end !border-0 !px-6 !text-[11.5px] lg:inline-flex ${hide}`} />
    </div>
  );
}

/** First row of the phone menu: the offer, large. Rendered only when the menu opens, so it can read the clock. */
function MenuOffer({ onClose }: { onClose: () => void }) {
  if (!isOfferRunning()) {
    return (
      <Link href="/" onClick={onClose} className="nav-offer-row">
        <span className="display block text-[1.7rem]">Koja Office</span>
        <span className="mt-2 block text-[16px] leading-snug text-[#d6d6dc]">
          13 Apps für Mac und Windows, einmal {PLANS.lifetime.label}, kein Abo.
        </span>
        <span className="link-hud mt-5 !text-white">
          Koja Office ansehen <ArrowRight size={14} aria-hidden />
        </span>
      </Link>
    );
  }
  return (
    <a href={OFFER_HREF} onClick={onClose} className="nav-offer-row">
      <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="offer-tag">{OFFER_LABEL}</span>
        <span className="text-[16px] leading-snug text-[#d6d6dc]">Einführungspreis bis {OFFER_END_LONG}</span>
      </span>
      <span className="display mt-4 block text-[1.7rem]">Koja Office</span>
      <span className="mt-2 block text-[16px] leading-snug text-[#d6d6dc]">
        13 Apps für Mac und Windows, einmal{" "}
        <span className="whitespace-nowrap">
          <b className="font-semibold text-white">{OFFER_PRICE}</b> statt <s>{PLANS.lifetime.label}</s>
        </span>
      </span>
      <span className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-2.5 text-[16px] text-[#d6d6dc]">
          Code <span className="offer-code text-[15px] text-white">{OFFER_CODE}</span>
        </span>
        <span className="link-hud !text-white">
          Zum Angebot <ArrowRight size={14} aria-hidden />
        </span>
      </span>
    </a>
  );
}

/**
 * `cta`: the right side of the header. "download" (default), "contact" and "buy" all show the Koja Office offer button
 * (src/lib/offer.ts); on "buy" (the Koja pages) it turns into the buy button with the reduced price once a discount is
 * active. "buy-ds24" (the Digistore24 partner page) keeps its own setup: "Preise" to the price section of that page, the
 * Digistore24 buy button, the trial button on phones and no site links, so partner buyers stay on that page.
 */
export default function Navigation({ cta = "download" }: { cta?: "download" | "contact" | "buy" | "buy-ds24" }) {
  const pathname = usePathname();
  const ds24 = cta === "buy-ds24";
  const links = ds24 ? [] : navLinks;
  // The phone menu opens with the Koja Office row (MenuOffer), so its plain item would be a second "Koja Office".
  const menuLinks = ds24 ? [{ href: "#preise", label: "Preise" }] : navLinks.slice(1);
  const [openFor, setOpenFor] = useState<string | null>(null);
  // The menu closes on its own when the route changes.
  const mobileOpen = openFor === pathname;

  const isActive = (href: string) => !href.includes("#") && (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)));

  return (
    <>
      <IntroLogo />
      <RevealManager />
      <ScrollRuler />
      <header className="fixed inset-x-0 top-0 z-50 h-12 border-b border-border bg-white/95 backdrop-blur-md">
        <nav className="flex h-full items-stretch" aria-label="Hauptnavigation">
          <div className={`flex items-center border-r border-border md:px-5 ${ds24 ? "px-4" : "px-3 min-[400px]:px-4"}`}>
            <Logo header={!ds24} />
          </div>

          <ul className="hidden items-stretch lg:flex">
            {links.map((link) => (
              <li key={link.href} className="flex items-center px-1 first:pl-3 xl:px-1.5">
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`px-2 py-1 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] transition-colors ${
                    isActive(link.href) ? "bg-foreground text-white" : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Below 360px the logo is the K alone and the offer fills the space up to the menu button. */}
          <div className={`ml-auto flex items-stretch ${ds24 ? "" : "max-[359px]:flex-1"}`}>
            {ds24 ? (
              <>
                <Link
                  href="#preise"
                  className="hidden items-center border-l border-border px-5 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground xl:flex"
                >
                  Preise
                </Link>
                <DigistoreBuyButton source="nav" className="hidden !min-h-full !border-0 !px-5 !text-[11.5px] lg:inline-flex" />
                <DownloadButton
                  source="nav-mobile"
                  label="Testen"
                  webLabel="Testen"
                  className="!min-h-full !gap-2 !border-0 !px-4 !text-[11px] lg:!hidden"
                />
              </>
            ) : cta === "buy" ? (
              <BuyOrOffer />
            ) : (
              <div className="grid max-[359px]:flex-1 [&>*]:[grid-area:1/1]">
                <OfferButton />
              </div>
            )}
            <button
              onClick={() => setOpenFor(mobileOpen ? null : pathname)}
              className="grid w-12 place-items-center border-l border-border text-foreground lg:hidden"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 top-12 z-40 overflow-y-auto bg-white lg:hidden">
          {!ds24 && <MenuOffer onClose={() => setOpenFor(null)} />}
          <ul className="border-b border-border">
            {menuLinks.map((link, i) => (
              <li key={link.href} className="border-t border-border first:border-t-0">
                <Link href={link.href} onClick={() => setOpenFor(null)} className="flex items-center justify-between px-5 py-5">
                  <span className="display text-2xl">{link.label}</span>
                  <span className="hud text-faint">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
