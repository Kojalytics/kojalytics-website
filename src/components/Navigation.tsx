"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/software", label: "Software" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/leistungen", label: "Leistungen" },
  { href: "/projekte", label: "Projekte" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Kojalytics Startseite">
      <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-foreground font-[family-name:var(--font-display)] text-[16px] font-extrabold text-white">
        K
      </span>
      <span className="font-[family-name:var(--font-display)] text-[19px] font-extrabold tracking-[-0.03em]">Kojalytics</span>
    </Link>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openFor, setOpenFor] = useState<string | null>(null);
  // The menu closes on its own when the route changes.
  const mobileOpen = openFor === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color] duration-300 ${
          scrolled || mobileOpen ? "border-b border-border bg-white/85 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-6" aria-label="Hauptnavigation">
          <Logo />

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`text-[15px] font-medium transition-colors ${isActive(link.href) ? "text-foreground" : "text-muted hover:text-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/software#preise" className="btn-primary !px-5 !py-2.5 text-sm">
              3 Tage gratis testen
            </Link>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <Link href="/software#preise" className="btn-primary !px-4 !py-2 text-[13px]">
              Gratis testen
            </Link>
            <button
              onClick={() => setOpenFor(mobileOpen ? null : pathname)}
              className="p-2 text-foreground"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white px-6 pt-24 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="display text-4xl">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
