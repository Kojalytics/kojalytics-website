import Link from "next/link";
import { APPS } from "@/lib/apps";
import { ARTICLES } from "@/lib/ratgeber";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { Logo } from "@/components/Navigation";

const company = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/projekte", label: "Projekte" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/lizenzen", label: "Software-Lizenzen" },
];

const help = [
  { href: "/support", label: "Hilfe & Support" },
  { href: "/kuendigen", label: "Verträge hier kündigen" },
  { href: "/widerrufen", label: "Vertrag widerrufen" },
  { href: "/agb", label: "AGB" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
];

const linkCls = "text-sm text-muted transition-colors hover:text-foreground";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-5 pb-12 pt-16 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-3">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Software-Studio aus Deutschland. Wir entwickeln Apps für Kunden und bieten die Koja-Apps für Mac und Windows an.
            </p>
            <a href="mailto:support@kojalytics.com" className="mt-4 block text-sm text-muted underline-offset-4 hover:text-foreground hover:underline">
              support@kojalytics.com
            </a>
          </div>

          <div className="col-span-2 md:col-span-4">
            <p className="mb-4 text-sm font-semibold">Koja-Apps für Mac und Windows</p>
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5">
              {APPS.map((app) => (
                <li key={app.slug}>
                  <Link href={`/software/${app.slug}`} prefetch={false} className={linkCls}>
                    {app.name}
                    <span className="sr-only"> – {app.kind}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-sm font-semibold">Ratgeber</p>
            <ul className="space-y-2.5">
              {ARTICLES.map((a) => (
                <li key={a.slug}>
                  <Link href={`/ratgeber/${a.slug}`} prefetch={false} className={linkCls}>
                    {a.navTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="mb-4 text-sm font-semibold">Unternehmen</p>
            <ul className="space-y-2.5">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mb-4 mt-8 text-sm font-semibold">Hilfe & Rechtliches</p>
            <ul className="space-y-2.5">
              {help.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8 text-xs leading-relaxed text-muted md:flex-row md:justify-between">
          <p>&copy; {new Date().getFullYear()} Kojalytics. Alle Rechte vorbehalten.</p>
          <p className="max-w-2xl md:text-right">
            Die Koja-Apps basieren auf quelloffener Software des ArtCraft-Teams (MIT / Apache-2.0) und sind ein eigenständiges
            Angebot von Kojalytics. Genannte Produktnamen anderer Unternehmen sind Marken ihrer Inhaber.
          </p>
        </div>
      </div>
    </footer>
  );
}
