"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/software", label: "Software" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Kojalytics home">
      <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-accent text-[15px] font-black text-accent-ink">K</span>
      <span className="text-[17px] font-extrabold tracking-tight">Kojalytics</span>
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
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || mobileOpen ? "bg-background/90 backdrop-blur-xl border-b border-border" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-[72px] md:px-6" aria-label="Main">
          <Logo />

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`text-[15px] font-semibold transition-colors ${
                  isActive(link.href) ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/software#pricing" className="btn-primary !px-5 !py-2.5 text-sm">
              Try free for 3 days
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link href="/software#pricing" className="btn-primary !px-4 !py-2 text-[13px]">
              Try free
            </Link>
            <button
              onClick={() => setOpenFor(mobileOpen ? null : pathname)}
              className="p-2 text-foreground"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background px-6 pt-24 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="display text-5xl">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
