"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DownloadButton from "@/components/software/DownloadButton";
import RevealManager from "@/components/instrument/RevealManager";
import ScrollRuler from "@/components/instrument/ScrollRuler";

const navLinks = [
  { href: "/software", label: "Software" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/leistungen", label: "Leistungen" },
  { href: "/projekte", label: "Projekte" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" title="Kojalytics Startseite">
      <span aria-hidden className="grid h-7 w-7 place-items-center bg-foreground font-[family-name:var(--font-display)] text-[14px] font-extrabold text-white">
        K
      </span>
      <span className="display text-[17px] tracking-[-0.01em]">Kojalytics</span>
    </Link>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  // The menu closes on its own when the route changes.
  const mobileOpen = openFor === pathname;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <RevealManager />
      <ScrollRuler />
      <header className="fixed inset-x-0 top-0 z-50 h-12 border-b border-border bg-white/95 backdrop-blur-md">
        <nav className="flex h-full items-stretch" aria-label="Hauptnavigation">
          <div className="flex items-center border-r border-border px-4 md:px-5">
            <Logo />
          </div>

          <ul className="hidden items-stretch md:flex">
            {navLinks.map((link) => (
              <li key={link.href} className="flex items-center px-1.5 first:pl-3">
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
              href="/software#preise"
              className="hidden items-center border-l border-border px-5 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground lg:flex"
            >
              Preise
            </Link>
            <DownloadButton
              source="nav"
              label="3 Tage kostenlos testen"
              shareLabel="An Mac senden"
              className="hidden !min-h-full !border-0 !px-5 !text-[11.5px] md:inline-flex"
            />
            <DownloadButton
              source="nav-mobile"
              label="Testen"
              shareLabel="An Mac senden"
              className="!min-h-full !gap-2 !border-0 !px-4 !text-[11px] md:!hidden"
            />
            <button
              onClick={() => setOpenFor(mobileOpen ? null : pathname)}
              className="grid w-12 place-items-center border-l border-border text-foreground md:hidden"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 top-12 z-40 overflow-y-auto bg-white md:hidden">
          <ul className="border-b border-border">
            {[...navLinks, { href: "/software#preise", label: "Preise" }].map((link, i) => (
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
