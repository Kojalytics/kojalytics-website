import Link from "next/link";
import { appsFor } from "@/lib/apps";
import { ARTICLES } from "@/lib/ratgeber";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import SectionBar from "@/components/instrument/SectionBar";
import { Logo } from "@/components/Navigation";
import OfferBand from "@/components/offer/OfferBand";
import { href, type Lang } from "@/lib/i18n";

// Links by their German address; href() turns them into the English ones.
const T = {
  de: {
    office: [
      { href: "/web", label: "Im Browser testen" },
      { href: "/#preise", label: "Preise" },
      { href: "/warum-koja", label: "Warum Koja Office" },
      { href: "/fragen", label: "Häufige Fragen" },
      { href: "/kontakt", label: "Kontakt" },
    ],
    help: [
      { href: "/support", label: "Hilfe & Support" },
      { href: "/kuendigen", label: "Verträge hier kündigen" },
      { href: "/widerrufen", label: "Vertrag widerrufen" },
      { href: "/agb", label: "AGB" },
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
    ],
    by: "von Kojalytics aus Hamburg",
    tagline: "Koja Office: 13 Apps für Mac und Windows. Einmal zahlen, kein Abo, läuft offline.",
    apps: "Koja-Apps für Mac und Windows",
    guides: "Ratgeber",
    helpTitle: "Hilfe & Recht",
    note: "Koja Office ist ein Angebot von Kojalytics. Genannte Produktnamen anderer Unternehmen sind Marken ihrer Inhaber.",
    other: { href: "/en", label: "English version" },
  },
  en: {
    office: [
      { href: "/web", label: "Try in your browser" },
      { href: "/#preise", label: "Pricing" },
      { href: "/warum-koja", label: "Why Koja Office" },
      { href: "/fragen", label: "FAQ" },
      { href: "/kontakt", label: "Contact" },
    ],
    help: [
      { href: "/support", label: "Help & support" },
      { href: "/kuendigen", label: "Cancel contracts here" },
      { href: "/widerrufen", label: "Withdraw from a contract" },
      { href: "/agb", label: "Terms" },
      { href: "/impressum", label: "Imprint" },
      { href: "/datenschutz", label: "Privacy" },
    ],
    by: "by Kojalytics, Hamburg, Germany",
    tagline: "Koja Office: 13 apps for Mac and Windows. Pay once, no subscription, works offline.",
    apps: "Koja apps for Mac and Windows",
    guides: "",
    helpTitle: "Help & legal",
    note: "Koja Office is offered by Kojalytics. Product names of other companies are trademarks of their owners.",
    other: { href: "/", label: "Deutsche Version" },
  },
};

const linkCls = "text-sm text-muted transition-colors hover:text-foreground";

/**
 * `legalOnly` (the Digistore24 partner page, /office): only contact and legal links, no links to the shop pages.
 * `offer`: the Koja Office band above the footer (OfferBand), on by default; off on the pages that sell already
 * (/software and below, /office) and on legal and privacy pages.
 */
export default function Footer({ legalOnly = false, offer = true, lang = "de" }: { legalOnly?: boolean; offer?: boolean; lang?: Lang }) {
  const t = T[lang];
  // The guides are German only, so English pages have no guides column and a wider apps column.
  const guides = lang === "de";
  return (
    <>
      {offer && !legalOnly && <OfferBand lang={lang} />}
      <footer>
        <div className="rail crosshairs">
          <SectionBar index="—" label="Koja Office" meta={t.by} />
          <div className="cells grid-cols-2 border-b border-border md:grid-cols-12">
            <div className="col-span-2 p-6 md:col-span-3 md:p-8">
              <Logo lang={lang} />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{t.tagline}</p>
              <a href="mailto:support@kojalytics.com" className="hud mt-6 block hover:text-foreground">
                support@kojalytics.com
              </a>
            </div>

            {!legalOnly && (
              <>
                <div className={`col-span-2 p-6 md:p-8 ${guides ? "md:col-span-4" : "md:col-span-7"}`}>
                  <p className="hud mb-5">{t.apps}</p>
                  <ul className={`grid grid-cols-2 gap-x-8 gap-y-2.5 ${guides ? "" : "lg:grid-cols-3"}`}>
                    {appsFor(lang).map((app) => (
                      <li key={app.slug}>
                        <Link href={href(lang, `/software/${app.slug}`)} prefetch={false} className={linkCls}>
                          {app.name}
                          <span className="sr-only"> – {app.kind}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {guides && (
                <div className="p-6 md:col-span-3 md:p-8">
                  <p className="hud mb-5">{t.guides}</p>
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
                )}
              </>
            )}

            <div className={`p-6 md:p-8 ${legalOnly ? "md:col-span-9" : "md:col-span-2"}`}>
              {!legalOnly && (
                <>
                  <p className="hud mb-5">Koja Office</p>
                  <ul className="mb-9 space-y-2.5">
                    {t.office.map((l) => (
                      <li key={l.href}>
                        <Link href={href(lang, l.href)} className={linkCls}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="hud mb-5">{t.helpTitle}</p>
              <ul className="space-y-2.5">
                {t.help.map((l) => (
                  <li key={l.href}>
                    <Link href={href(lang, l.href)} className={linkCls}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <CookieSettingsButton />
                </li>
                <li>
                  <Link href={t.other.href} hrefLang={lang === "de" ? "en" : "de"} className={linkCls}>
                    {t.other.label}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-5 py-6 text-xs leading-relaxed text-muted md:flex-row md:justify-between md:px-10">
            <p className="hud">&copy; {new Date().getFullYear()} Kojalytics</p>
            <p className="max-w-2xl md:text-right">{t.note}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
