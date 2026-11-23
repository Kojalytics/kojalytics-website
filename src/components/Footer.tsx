import Link from "next/link";
import { APPS } from "@/lib/apps";
import { ARTICLES } from "@/lib/ratgeber";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import SectionBar from "@/components/instrument/SectionBar";
import { Logo } from "@/components/Navigation";
import OfferBand from "@/components/offer/OfferBand";

const office = [
  { href: "/web", label: "Im Browser testen" },
  { href: "/#preise", label: "Preise" },
  { href: "/#fragen", label: "Häufige Fragen" },
  { href: "/kontakt", label: "Kontakt" },
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

/**
 * `legalOnly` (the Digistore24 partner page, /office): only contact and legal links, no links to the shop pages.
 * `offer`: the Koja Office band above the footer (OfferBand), on by default; off on the pages that sell already
 * (/software and below, /office) and on legal and privacy pages.
 */
export default function Footer({ legalOnly = false, offer = true }: { legalOnly?: boolean; offer?: boolean }) {
  return (
    <>
      {offer && !legalOnly && <OfferBand />}
      <footer>
        <div className="rail crosshairs">
          <SectionBar index="—" label="Koja Office" meta="von Kojalytics aus Hamburg" />
          <div className="cells grid-cols-2 border-b border-border md:grid-cols-12">
            <div className="col-span-2 p-6 md:col-span-3 md:p-8">
              <Logo />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
                Koja Office: 13 Apps für Mac und Windows. Einmal zahlen, kein Abo, läuft offline.
              </p>
              <a href="mailto:support@kojalytics.com" className="hud mt-6 block hover:text-foreground">
                support@kojalytics.com
              </a>
            </div>

            {!legalOnly && (
              <>
                <div className="col-span-2 p-6 md:col-span-4 md:p-8">
                  <p className="hud mb-5">Koja-Apps für Mac und Windows</p>
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
              </>
            )}

            <div className={`p-6 md:p-8 ${legalOnly ? "md:col-span-9" : "md:col-span-2"}`}>
              {!legalOnly && (
                <>
                  <p className="hud mb-5">Koja Office</p>
                  <ul className="mb-9 space-y-2.5">
                    {office.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className={linkCls}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="hud mb-5">Hilfe & Recht</p>
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
              Koja Office ist ein Angebot von Kojalytics. Genannte Produktnamen anderer Unternehmen sind Marken ihrer Inhaber.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
