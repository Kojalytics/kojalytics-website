"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DownloadButton from "@/components/software/DownloadButton";
import BuyButton from "@/components/software/BuyButton";
import DigistoreBuyButton from "@/components/software/DigistoreBuyButton";
import RevealManager from "@/components/instrument/RevealManager";
import ScrollRuler from "@/components/instrument/ScrollRuler";

const navLinks = [
  { href: "/lizenzen", label: "Lizenzen" },
  { href: "/leistungen", label: "Leistungen" },
  { href: "/software", label: "Software" },
  { href: "/projekte", label: "Projekte" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" title="Kojalytics Startseite">
      <span aria-hidden className="kj-logo-k grid h-7 w-7 place-items-center bg-foreground font-[family-name:var(--font-display)] text-[14px] font-extrabold text-white">
        K
      </span>
      <span className="kj-logo-word display text-[17px] tracking-[-0.01em]">Kojalytics</span>
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
            <span className="display tracking-[-0.01em]">Kojalytics</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * `cta`: the button on the right. "download" (default) loads the Koja-Apps; "buy" (the Koja-Apps pages) buys the 79 €
 * licence from lg up and keeps the trial button on phones; "contact" (studio pages such as the home page) opens the
 * contact form. "buy-ds24" (the Digistore24 partner page) works like "buy", but the button goes to the Digistore24 order
 * form and "Preise" to the price section of that page.
 */
export default function Navigation({ cta = "download" }: { cta?: "download" | "contact" | "buy" | "buy-ds24" }) {
  const pathname = usePathname();
  const pricesHref = cta === "buy-ds24" ? "#preise" : "/software#preise";
  const [openFor, setOpenFor] = useState<string | null>(null);
  // The menu closes on its own when the route changes.
  const mobileOpen = openFor === pathname;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <IntroLogo />
      <RevealManager />
      <ScrollRuler />
      <header className="fixed inset-x-0 top-0 z-50 h-12 border-b border-border bg-white/95 backdrop-blur-md">
        <nav className="flex h-full items-stretch" aria-label="Hauptnavigation">
          <div className="flex items-center border-r border-border px-4 md:px-5">
            <Logo />
          </div>

          <ul className="hidden items-stretch lg:flex">
            {navLinks.map((link) => (
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

          <div className="ml-auto flex items-stretch">
            <Link
              href={pricesHref}
              className="hidden items-center border-l border-border px-5 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground xl:flex"
            >
              Preise
            </Link>
            {cta === "contact" ? (
              <Link href="/kontakt" className="btn-primary !min-h-full !gap-2 !border-0 !px-4 !text-[11px] lg:!px-5 lg:!text-[11.5px]">
                Anfrage senden
              </Link>
            ) : (
              <>
                {cta === "buy" ? (
                  <BuyButton source="nav" className="hidden !min-h-full !border-0 !px-5 !text-[11.5px] lg:inline-flex" />
                ) : cta === "buy-ds24" ? (
                  <DigistoreBuyButton source="nav" className="hidden !min-h-full !border-0 !px-5 !text-[11.5px] lg:inline-flex" />
                ) : (
                  <DownloadButton
                    source="nav"
                    label="3 Tage kostenlos testen"
                    shareLabel="An Computer senden"
                    className="hidden !min-h-full !border-0 !px-5 !text-[11.5px] lg:inline-flex"
                  />
                )}
                <DownloadButton
                  source="nav-mobile"
                  label="Testen"
                  shareLabel="Link senden"
                  className="!min-h-full !gap-2 !border-0 !px-4 !text-[11px] lg:!hidden"
                />
              </>
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
          <ul className="border-b border-border">
            {[...navLinks, { href: pricesHref, label: "Preise" }].map((link, i) => (
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
