"use client";

import { useState } from "react";
import { useCurrency } from "@/lib/use-currency";
import { money } from "@/lib/currency";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DownloadButton from "@/components/software/DownloadButton";
import BuyButton from "@/components/software/BuyButton";
import DigistoreBuyButton from "@/components/software/DigistoreBuyButton";
import RevealManager from "@/components/instrument/RevealManager";
import ScrollRuler from "@/components/instrument/ScrollRuler";
import { useDiscount } from "@/lib/discount-store";
import { planText } from "@/lib/pricing";
import { OFFER_CODE, OFFER_HREF, isOfferRunning, offerText } from "@/lib/offer";
import { href, switchPath, type Lang } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";

// Links by their German address; href() turns them into the English ones. The guides are German only.
const T = {
  de: {
    links: [
      { href: "/", label: "Koja Office" },
      { href: "/#apps", label: "Apps" },
      { href: "/web", label: "Im Browser testen" },
      { href: "/#preise", label: "Preise" },
      { href: "/ratgeber", label: "Ratgeber" },
      { href: "/support", label: "Support" },
    ],
    home: "Koja Office Startseite",
    offerAria: (label: string, end: string) => `Koja Office ${label} mit Code ${OFFER_CODE}, bis ${end}`,
    until: "bis",
    see: " ansehen",
    buy: "Kaufen",
    buyHead: "Einmalkauf · kein Abo",
    buyLong: (price: string) => `Koja Office kaufen · ${price}`,
    menuPlain: (price: string) => `13 Apps für Mac und Windows, einmal ${price}, kein Abo.`,
    seeFull: "Koja Office ansehen",
    intro: "Einführungspreis bis",
    menuOffer: "13 Apps für Mac und Windows, einmal",
    instead: "statt",
    toOffer: "Zum Angebot",
    prices: "Preise",
    nav: "Hauptnavigation",
    close: "Menü schließen",
    open: "Menü öffnen",
    other: { short: "EN", long: "English", title: "This page in English" },
  },
  en: {
    links: [
      { href: "/", label: "Koja Office" },
      { href: "/#apps", label: "Apps" },
      { href: "/web", label: "Try in browser" },
      { href: "/#preise", label: "Pricing" },
      { href: "/support", label: "Support" },
    ],
    home: "Koja Office home",
    offerAria: (label: string, end: string) => `Koja Office ${label} with code ${OFFER_CODE}, until ${end}`,
    until: "until",
    see: "",
    buy: "Buy",
    buyHead: "One-time purchase · no subscription",
    buyLong: (price: string) => `Buy Koja Office · ${price}`,
    menuPlain: (price: string) => `13 apps for Mac and Windows, ${price} once, no subscription.`,
    seeFull: "See Koja Office",
    intro: "Introductory price until",
    menuOffer: "13 apps for Mac and Windows, once",
    instead: "instead of",
    toOffer: "See the offer",
    prices: "Pricing",
    nav: "Main navigation",
    close: "Close menu",
    open: "Open menu",
    other: { short: "DE", long: "Deutsch", title: "Diese Seite auf Deutsch" },
  },
};

/** `header`: in the header the word gets smaller below 380px and gives way below 360px, so the offer button fits beside it. */
export function Logo({ header = false, lang = "de" }: { header?: boolean; lang?: Lang }) {
  return (
    <Link href={href(lang, "/")} className="flex items-center gap-2.5" title={T[lang].home}>
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
  const lang = useLang();
  const cur = useCurrency();
  const t = T[lang];
  const offer = offerText(lang, cur);
  // "invisible" (visibility: hidden) also takes it out of the tab order and the accessibility tree.
  const hide = hidden ? "invisible" : "";
  // Once the offer has ended (or while it is paused), only the plain button is in the markup, also without scripts.
  const running = isOfferRunning();
  return (
    <>
      {running && (
        <a href={href(lang, OFFER_HREF)} aria-label={t.offerAria(offer.label, offer.endLong)} className={`offer-btn offer-live ${hide}`}>
        <span className="offer-tag">{offer.label}</span>
        <span>Koja Office</span>
        <span className="hidden items-center gap-2 xl:inline-flex">
          <span className="offer-btn-sub max-[1399px]:hidden">Code</span>
          <span className="offer-code">{OFFER_CODE}</span>
        </span>
        <span className="offer-btn-sub hidden font-sans text-[12.5px] normal-case tracking-normal xl:inline">
          {t.until} {offer.endLong}
        </span>
        <ArrowRight size={14} strokeWidth={2.2} className="hidden shrink-0 sm:block" aria-hidden />
        </a>
      )}
      <Link href={href(lang, "/")} className={`offer-btn ${running ? "offer-over" : ""} ${hide}`}>
        <span>
          Koja Office{t.see && <span className="max-sm:hidden">{t.see}</span>}
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
  const lang = useLang();
  const cur = useCurrency();
  const reduced = useDiscount()?.prices.lifetime;
  const buy = reduced !== undefined;
  const hide = buy ? "" : "invisible";
  return (
    <div className="grid max-[359px]:flex-1 [&>*]:[grid-area:1/1]">
      <OfferButton hidden={buy} />
      <BuyButton
        source="nav"
        // While hidden it already holds a reduced price, so the slot does not widen when a code arrives.
        label={`${buy ? money(reduced, cur, lang) : isOfferRunning() ? offerText(lang, cur).price : planText("lifetime", lang, cur).label} · ${T[lang].buy}`}
        className={`!min-h-full !gap-2 !whitespace-nowrap !border-0 !px-3.5 !text-[11px] !tracking-[0.08em] lg:!hidden ${hide}`}
      />
      {/* As wide as its label, at the right end of the slot (the slot is as wide as the offer button) */}
      <BuyButton source="nav" className={`hidden !min-h-full justify-self-end !border-0 !px-6 !text-[11.5px] lg:inline-flex ${hide}`} />
    </div>
  );
}

/**
 * The right side of the header while no offer runs: straight to checkout for the one-time licence. Phones and tablets:
 * "79 € · Kaufen"; from lg a small heading line ("Einmalkauf · kein Abo") above "Koja Office kaufen · 79 €".
 * An active discount code shows its price.
 */
function HeaderBuy() {
  const lang = useLang();
  const cur = useCurrency();
  const t = T[lang];
  const reduced = useDiscount()?.prices.lifetime;
  const price = reduced !== undefined ? money(reduced, cur, lang) : planText("lifetime", lang, cur).label;
  return (
    <div className="flex max-[359px]:flex-1">
      <BuyButton
        source="nav"
        label={`${price} · ${t.buy}`}
        className="!min-h-full !gap-2 !whitespace-nowrap !border-0 !px-3.5 !text-[11px] !tracking-[0.08em] max-[359px]:flex-1 lg:!hidden"
      />
      <BuyButton
        source="nav"
        label={t.buyLong(price)}
        caption={t.buyHead}
        className="hidden !min-h-full !gap-2.5 !whitespace-nowrap !border-0 !px-6 !text-[11.5px] lg:!inline-flex"
      />
    </div>
  );
}

/** First row of the phone menu: the offer, large. Rendered only when the menu opens, so it can read the clock. */
function MenuOffer({ onClose }: { onClose: () => void }) {
  const lang = useLang();
  const cur = useCurrency();
  const t = T[lang];
  const offer = offerText(lang, cur);
  const regular = planText("lifetime", lang, cur).label;
  if (!isOfferRunning()) {
    return (
      <Link href={href(lang, "/")} onClick={onClose} className="nav-offer-row">
        <span className="display block text-[1.7rem]">Koja Office</span>
        <span className="mt-2 block text-[16px] leading-snug text-[#d6d6dc]">{t.menuPlain(regular)}</span>
        <span className="link-hud mt-5 !text-white">
          {t.seeFull} <ArrowRight size={14} aria-hidden />
        </span>
      </Link>
    );
  }
  return (
    <a href={href(lang, OFFER_HREF)} onClick={onClose} className="nav-offer-row">
      <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="offer-tag">{offer.label}</span>
        <span className="text-[16px] leading-snug text-[#d6d6dc]">
          {t.intro} {offer.endLong}
        </span>
      </span>
      <span className="display mt-4 block text-[1.7rem]">Koja Office</span>
      <span className="mt-2 block text-[16px] leading-snug text-[#d6d6dc]">
        {t.menuOffer}{" "}
        <span className="whitespace-nowrap">
          <b className="font-semibold text-white">{offer.price}</b> {t.instead} <s>{regular}</s>
        </span>
      </span>
      <span className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-2.5 text-[16px] text-[#d6d6dc]">
          Code <span className="offer-code text-[15px] text-white">{OFFER_CODE}</span>
        </span>
        <span className="link-hud !text-white">
          {t.toOffer} <ArrowRight size={14} aria-hidden />
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
  const lang = useLang();
  const t = T[lang];
  const ds24 = cta === "buy-ds24";
  const navLinks = t.links.map((l) => ({ href: href(lang, l.href), label: l.label }));
  const links = ds24 ? [] : navLinks;
  // The phone menu opens with the Koja Office row (MenuOffer), so its plain item would be a second "Koja Office".
  const menuLinks = ds24 ? [{ href: "#preise", label: t.prices }] : navLinks.slice(1);
  // The same page in the other language; none on the partner page and on German-only pages (guides).
  const otherHref = switchPath(pathname ?? "/", lang === "de" ? "en" : "de");
  const other = ds24 || otherHref === pathname ? null : { href: otherHref, hrefLang: lang === "de" ? "en" : "de" };
  const home = href(lang, "/");
  const [openFor, setOpenFor] = useState<string | null>(null);
  // The menu closes on its own when the route changes.
  const mobileOpen = openFor === pathname;

  const isActive = (link: string) => !link.includes("#") && (pathname === link || (link !== home && pathname.startsWith(`${link}/`)));

  return (
    <>
      <IntroLogo />
      <RevealManager />
      <ScrollRuler />
      <header className="fixed inset-x-0 top-0 z-50 h-12 border-b border-border bg-white/95 backdrop-blur-md">
        <nav className="flex h-full items-stretch" aria-label={t.nav}>
          <div className={`flex items-center border-r border-border md:px-5 ${ds24 ? "px-4" : "px-3 min-[400px]:px-4"}`}>
            <Logo header={!ds24} lang={lang} />
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
            {other && (
              <li className="flex items-center px-1 xl:px-1.5">
                <Link
                  href={other.href}
                  hrefLang={other.hrefLang}
                  title={t.other.title}
                  className="px-2 py-1 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
                >
                  {t.other.short}
                </Link>
              </li>
            )}
          </ul>

          {/* Below 360px the logo is the K alone and the offer fills the space up to the menu button. */}
          <div className={`ml-auto flex items-stretch ${ds24 ? "" : "max-[359px]:flex-1"}`}>
            {ds24 ? (
              <>
                <Link
                  href="#preise"
                  className="hidden items-center border-l border-border px-5 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground xl:flex"
                >
                  {t.prices}
                </Link>
                <DigistoreBuyButton source="nav" className="hidden !min-h-full !border-0 !px-5 !text-[11.5px] lg:inline-flex" />
                <DownloadButton
                  source="nav-mobile"
                  label="Testen"
                  webLabel="Testen"
                  className="!min-h-full !gap-2 !border-0 !px-4 !text-[11px] lg:!hidden"
                />
              </>
            ) : !isOfferRunning() ? (
              <HeaderBuy />
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
              aria-label={mobileOpen ? t.close : t.open}
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
            {other && (
              <li className="border-t border-border">
                <Link href={other.href} hrefLang={other.hrefLang} onClick={() => setOpenFor(null)} className="flex items-center justify-between px-5 py-5">
                  <span className="display text-2xl">{t.other.long}</span>
                  <span className="hud text-faint">{t.other.short}</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
