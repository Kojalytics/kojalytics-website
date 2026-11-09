import Link from "next/link";
import { APPS } from "@/lib/apps";
import { ARTICLES } from "@/lib/ratgeber";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import SectionBar from "@/components/instrument/SectionBar";
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
    <footer className="border-t border-border">
      <div className="rail crosshairs">
        <SectionBar index="—" label="Kojalytics" meta="Software-Studio aus Hamburg" />
        <div className="cells grid-cols-2 border-b border-border md:grid-cols-12">
          <div className="col-span-2 p-6 md:col-span-3 md:p-8">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              Wir entwickeln Apps für Kunden und bieten die Koja-Apps für den Mac an.
            </p>
            <a href="mailto:support@kojalytics.com" className="hud mt-6 block hover:text-foreground">
              support@kojalytics.com
            </a>
          </div>

          <div className="col-span-2 p-6 md:col-span-4 md:p-8">
            <p className="hud mb-5">Koja-Apps für den Mac</p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5">
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

          <div className="p-6 md:col-span-3 md:p-8">
            <p className="hud mb-5">Ratgeber</p>
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

          <div className="p-6 md:col-span-2 md:p-8">
            <p className="hud mb-5">Unternehmen</p>
            <ul className="space-y-2.5">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="hud mb-5 mt-9">Hilfe & Recht</p>
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

        <div className="flex flex-col gap-3 px-5 py-6 text-xs leading-relaxed text-muted md:flex-row md:justify-between md:px-10">
          <p className="hud">&copy; {new Date().getFullYear()} Kojalytics</p>
          <p className="max-w-2xl md:text-right">
            Die Koja-Apps basieren auf quelloffener Software des ArtCraft-Teams (MIT / Apache-2.0) und sind ein eigenständiges
            Angebot von Kojalytics. Genannte Produktnamen anderer Unternehmen sind Marken ihrer Inhaber.
          </p>
        </div>
      </div>
    </footer>
  );
}
