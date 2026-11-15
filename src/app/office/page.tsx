import type { Metadata } from "next";
import Image from "next/image";
import { Check, Laptop, Mail, Phone, ShieldCheck, ShoppingBag } from "lucide-react";
import Footer from "@/components/Footer";
import AppIcon from "@/components/ui/app-icon";
import BuyButton from "@/components/software/BuyButton";
import DownloadButton from "@/components/software/DownloadButton";
import StickyBuyBar from "@/components/software/StickyBuyBar";
import TrackView from "@/components/software/TrackView";
import DiscountProvider from "@/components/software/DiscountProvider";
import OfficePrice from "@/components/software/OfficePrice";
import Faq, { type FaqItem } from "@/components/software/Faq";
import { APPS, getApp } from "@/lib/apps";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";
import { discountForPage } from "@/lib/discount-page";
import { OG_BASE, SITE_URL } from "@/lib/site";

/*
 * Landing page for the Meta ads ("Koja Office 2026"): the first screen repeats the ad (box, "Office ohne Abo", price),
 * so a visitor knows at once that they are in the right place. Built for phones (almost all ad traffic) and for an
 * older audience: large type, one goal, no site navigation. The ad link's ?code= is checked on the server, so the
 * reduced price is there with the first paint. Not in the sitemap and not indexed: /software is the page for search.
 */

export const metadata: Metadata = {
  title: { absolute: "Koja Office 2026 – Office ohne Abo für Mac und Windows | Kojalytics" },
  description: `Word-, Excel-, PowerPoint- und PDF-Dateien öffnen und bearbeiten, ohne Abo. Für Mac und Windows, einmal zahlen. ${TRIAL_DAYS} Tage kostenlos testen.`,
  alternates: { canonical: `${SITE_URL}/office` },
  robots: { index: false, follow: true },
  openGraph: {
    ...OG_BASE,
    title: "Koja Office 2026: Office ohne Abo. Einmal zahlen, behalten.",
    description: "Word-, Excel-, PowerPoint- und PDF-Dateien öffnen und bearbeiten. Für Mac und Windows.",
    url: "/office",
    images: [{ url: "/og/software.jpg", width: 1200, height: 630, alt: "Koja Office auf dem Mac" }],
  },
};

const OFFICE = [
  {
    slug: "word-koja",
    shot: "/apps/word-koja/hero.webp",
    title: "Texte und Briefe",
    text: "Öffnet deine Word-Dateien (.docx): Briefe, Lebenslauf, Vereinsordnung.",
    alt: "WordKoja mit einer Gartenordnung als Word-Dokument",
  },
  {
    slug: "grid-koja",
    shot: "/apps/grid-koja/budget.webp",
    title: "Tabellen und Haushaltsbuch",
    text: "Öffnet deine Excel-Dateien (.xlsx), mit Formeln und Diagrammen.",
    alt: "GridKoja mit einem Haushaltsbuch und einem Diagramm",
  },
  {
    slug: "deck-koja",
    shot: "/apps/deck-koja/hero.webp",
    title: "Präsentationen",
    text: "Öffnet deine PowerPoint-Dateien (.pptx) für Verein, Familie und Beruf.",
    alt: "DeckKoja mit einer Präsentation über Solarstrom",
  },
  {
    slug: "pdf-koja",
    shot: "/apps/pdf-koja/hero.webp",
    title: "PDFs bearbeiten",
    text: "PDFs ausfüllen, kommentieren, zusammenfügen und unterschreiben.",
    alt: "PdfKoja mit einem Rezept-PDF und einem Kommentar",
  },
];
const OFFICE_SLUGS = new Set(OFFICE.map((o) => o.slug));

const steps = [
  { icon: ShoppingBag, title: "Jetzt kaufen", text: "Am Handy oder am Computer. Sicher bezahlen über Stripe." },
  { icon: Mail, title: "Lizenz per E-Mail", text: "Dein Lizenzschlüssel kommt sofort nach dem Kauf per E-Mail." },
  {
    icon: Laptop,
    title: "Am Computer installieren",
    text: "Kojalytics Launcher laden, Schlüssel einfügen, Apps installieren. Das dauert ein paar Minuten.",
  },
];

const FAQ: FaqItem[] = [
  {
    q: "Ist das Microsoft Office?",
    a: "Nein. Koja Office besteht aus eigenen Apps von Kojalytics. Sie öffnen deine Word-, Excel-, PowerPoint- und PDF-Dateien, sind aber kein Produkt von Microsoft.",
  },
  {
    q: "Funktionieren meine Word- und Excel-Dateien?",
    a: `.docx, .xlsx, .pptx und PDF öffnest du direkt. Bei sehr aufwendigen Dateien können Layout und Umbrüche abweichen. Teste deshalb ${TRIAL_DAYS} Tage kostenlos mit Kopien deiner Dateien.`,
  },
  {
    q: "Ich bin gerade am Handy. Kann ich trotzdem kaufen?",
    a: "Ja. Du kaufst hier, der Lizenzschlüssel kommt sofort per E-Mail. Am Computer lädst du dann den Kojalytics Launcher von kojalytics.com und fügst den Schlüssel ein. Oder du schickst dir erst nur den Link und entscheidest später.",
  },
  {
    q: "Was ist, wenn es nicht passt?",
    a: "Du hast 14 Tage Widerrufsrecht und bekommst dein Geld zurück, ohne Begründung. Das geht online unter [Vertrag widerrufen](/widerrufen).",
  },
  { q: "Auf wie vielen Geräten kann ich es nutzen?", a: "Auf bis zu 3 Geräten, Mac oder Windows-PC." },
  {
    q: "Ist das ein Abo?",
    a: "Nein. Du zahlst einmal und nutzt Koja Office ohne Ablaufdatum. Updates bekommst du kostenlos über den Kojalytics Launcher.",
  },
];

const wrap = "mx-auto max-w-3xl px-5";
// Large, plain-type buttons for an older audience (the site's buttons use small uppercase mono type).
const big = "!min-h-14 w-full !font-sans !text-[17px] !font-semibold !normal-case !tracking-normal";

function Trust() {
  return (
    <ul className="mt-4 grid gap-1.5 text-[15px] leading-snug">
      {["14 Tage Widerrufsrecht: Geld zurück", "Lizenzschlüssel sofort per E-Mail", "Firma aus Hamburg, Support auf Deutsch"].map((t) => (
        <li key={t} className="flex gap-2">
          <Check size={18} strokeWidth={2.6} className="mt-px shrink-0 text-success" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );
}

function Actions({ source }: { source: string }) {
  return (
    <div className="grid gap-3">
      <BuyButton source={`office-${source}`} from="office" action="sichern" className={big} />
      <DownloadButton
        source={`office-${source}`}
        variant="secondary"
        label={`${TRIAL_DAYS} Tage kostenlos testen`}
        shareLabel="Link an meinen Computer schicken"
        className={big}
      />
    </div>
  );
}

export default async function OfficePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const found = await discountForPage(params.code ?? params.rabatt);
  const discount = found?.prices.lifetime !== undefined ? found : null;
  const price = discount ? (discount.prices.lifetime as number) : PLANS.lifetime.cents;
  const priceLabel = (price / 100).toLocaleString("de-DE", { minimumFractionDigits: price % 100 ? 2 : 0 }) + " €";

  return (
    <DiscountProvider initial={discount}>
      <TrackView name="office" />

      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <span className="flex items-center gap-2.5">
            <Image src="/office/koja-office-icon.svg" alt="" width={30} height={30} unoptimized priority />
            <span className="display text-[1.2rem]">Koja Office</span>
          </span>
          <span className="text-right text-[12.5px] leading-tight text-muted">
            von Kojalytics
            <br />
            aus Hamburg
          </span>
        </div>
      </header>

      <main className="text-[17px]">
        {/* 1 The ad, continued: same box, same promise, same price, then the two ways forward */}
        <section className={`${wrap} pb-10 pt-5`}>
          <p className="hud">Koja Office 2026 · Mac und Windows</p>
          <h1 className="display mt-3 text-[clamp(2rem,7.4vw,3.2rem)] leading-[1.05]">
            Office ohne Abo. <span className="text-highlight">Einmal zahlen.</span> Behalten.
          </h1>
          <div className="mt-5 flex items-center gap-5">
            <Image
              src="/office/box-koja.webp"
              alt="Die Verpackung von Koja Office 2026 mit den 13 App-Symbolen"
              width={640}
              height={822}
              priority
              sizes="(max-width: 768px) 120px, 170px"
              className="h-auto w-[120px] shrink-0 md:w-[170px]"
            />
            <OfficePrice />
          </div>
          <p className="mt-5 leading-relaxed">
            Öffnet und bearbeitet deine Word-, Excel-, PowerPoint- und PDF-Dateien. Für Mac und Windows, auf bis zu 3 Geräten.
          </p>
          <div className="mt-5">
            <Actions source="hero" />
          </div>
          <Trust />
        </section>

        {/* 2 The phone problem: buy now, install on the computer later */}
        <section className="border-t border-border">
          <div className={`${wrap} py-10`}>
            <h2 className="display text-[1.9rem] leading-tight">So einfach geht’s</h2>
            <ol className="mt-6 grid gap-5">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center bg-foreground text-white">
                    <Icon size={20} aria-hidden />
                  </span>
                  <span>
                    <span className="block font-semibold">
                      {i + 1}. {title}
                    </span>
                    <span className="mt-0.5 block leading-relaxed text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-6 leading-relaxed">
              Gerade nur am Handy? Schick dir den Link und installiere Koja Office später am Computer, {TRIAL_DAYS} Tage kostenlos.
            </p>
            <div className="mt-4">
              <DownloadButton source="office-steps" label={`${TRIAL_DAYS} Tage kostenlos testen`} shareLabel="Link an meinen Computer schicken" className={big} />
            </div>
          </div>
        </section>

        {/* 3 The main worry: do my files work? Real screenshots with everyday German files */}
        <section className="border-t border-border">
          <div className={`${wrap} py-10`}>
            <h2 className="display text-[1.9rem] leading-tight">Deine Dateien funktionieren</h2>
            <p className="mt-3 leading-relaxed text-muted">Vier Apps für alles, was du sonst mit Word, Excel, PowerPoint und Acrobat machst.</p>
            <div className="mt-7 grid gap-8 md:grid-cols-2">
              {OFFICE.map((o) => {
                const app = getApp(o.slug);
                return (
                  <figure key={o.slug}>
                    <Image src={o.shot} alt={o.alt} width={1372} height={877} sizes="(max-width: 768px) 92vw, 360px" className="h-auto w-full border border-border" />
                    <figcaption className="mt-3 flex gap-3">
                      {app && <AppIcon slug={app.slug} name={app.name} size={40} />}
                      <span>
                        <span className="block font-semibold">
                          {app?.name} · {o.title}
                        </span>
                        <span className="mt-0.5 block leading-relaxed text-muted">{o.text}</span>
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
            <p className="mt-7 text-[15px] leading-relaxed text-muted">
              Bei sehr aufwendigen Dateien können Layout und Umbrüche abweichen. Teste deshalb {TRIAL_DAYS} Tage kostenlos mit Kopien deiner
              Dateien.
            </p>
          </div>
        </section>

        {/* 4 The sum: what a subscription costs over five years */}
        <section className="border-t border-border">
          <div className={`${wrap} py-10`}>
            <h2 className="display text-[1.9rem] leading-tight">Die Rechnung</h2>
            <div className="mt-6 grid gap-3">
              <div className="flex items-baseline justify-between gap-4 border border-border bg-white p-4">
                <span>
                  <span className="block font-semibold">Microsoft 365 Single</span>
                  <span className="text-[15px] text-muted">99 € pro Jahr, im Abo</span>
                </span>
                <span className="text-right">
                  <span className="display block text-[1.7rem] leading-none">495 €</span>
                  <span className="text-[13px] text-muted">in 5 Jahren</span>
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-2 border-buy bg-white p-4">
                <span>
                  <span className="block font-semibold">Koja Office 2026</span>
                  <span className="text-[15px] text-muted">einmal zahlen, kein Abo</span>
                </span>
                <span className="text-right">
                  <span className="display block text-[1.7rem] leading-none text-buy">{priceLabel}</span>
                  <span className="text-[13px] text-muted">in 5 Jahren</span>
                </span>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              Microsoft 365 Single: Listenpreis von Microsoft, 99 € pro Jahr, Stand November 2026. Der Funktionsumfang ist nicht identisch.
            </p>
          </div>
        </section>

        {/* 5 Honest: who should not buy (fewer disappointed buyers, more trust for everyone else) */}
        <section className="border-t border-border">
          <div className={`${wrap} py-10`}>
            <h2 className="display text-[1.9rem] leading-tight">Ehrlich gesagt</h2>
            <p className="mt-4 leading-relaxed">
              Koja Office ist <strong>nicht</strong> Microsoft Office. Es sind eigene Apps von Kojalytics, die deine Office-Dateien öffnen. Wir
              entwickeln sie laufend weiter, Updates bekommst du kostenlos.
            </p>
            <p className="mt-3 leading-relaxed">
              Wenn deine Firma ausdrücklich Microsoft Office verlangt, bleib bei Microsoft. Für Briefe, Tabellen, Präsentationen und PDFs im
              Alltag ist Koja Office gemacht.
            </p>
          </div>
        </section>

        {/* 6 The rest of the box */}
        <section className="border-t border-border">
          <div className={`${wrap} py-10`}>
            <h2 className="display text-[1.9rem] leading-tight">Plus 9 weitere Apps</h2>
            <p className="mt-3 leading-relaxed text-muted">Ohne Aufpreis dabei, wenn du mehr machen willst.</p>
            <ul className="mt-6 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-5">
              {APPS.filter((a) => !OFFICE_SLUGS.has(a.slug)).map((a) => (
                <li key={a.slug} className="flex flex-col items-center gap-1.5 text-center">
                  <AppIcon slug={a.slug} name={a.name} size={52} />
                  <span className="text-[13px] font-semibold leading-tight">{a.name}</span>
                  <span className="text-[12px] leading-tight text-muted">{a.kind}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7 A real company and a real person behind it */}
        <section className="border-t border-border">
          <div className={`${wrap} py-10`}>
            <h2 className="display text-[1.9rem] leading-tight">Wer dahintersteckt</h2>
            <p className="mt-4 leading-relaxed">
              Koja Office kommt von Kojalytics, einem kleinen Software-Studio aus Hamburg, gegründet von Farzad Khojazada. Fragen
              beantworten wir selbst, auf Deutsch.
            </p>
            <ul className="mt-5 grid gap-2.5">
              <li>
                <a href="tel:+4915201482416" className="inline-flex min-h-11 items-center gap-2.5 underline underline-offset-4">
                  <Phone size={18} aria-hidden /> +49 1520 1482416
                </a>
              </li>
              <li>
                <a href="mailto:support@kojalytics.com" className="inline-flex min-h-11 items-center gap-2.5 underline underline-offset-4">
                  <Mail size={18} aria-hidden /> support@kojalytics.com
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-success" aria-hidden /> Unternehmen mit Sitz in Hamburg ·{" "}
                <a href="/impressum" className="underline underline-offset-4">
                  Impressum
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* 8 Questions */}
        <section id="fragen" className="scroll-mt-4 border-t border-border">
          <div className={`${wrap} py-10`}>
            <h2 className="display mb-4 text-[1.9rem] leading-tight">Häufige Fragen</h2>
            <Faq items={FAQ} />
          </div>
        </section>

        {/* 9 Once more, with the price */}
        <section className="border-t border-border">
          <div className={`${wrap} py-12`}>
            <div className="flex items-center gap-5">
              <Image
                src="/office/box-koja.webp"
                alt=""
                width={640}
                height={822}
                sizes="100px"
                className="h-auto w-[100px] shrink-0"
              />
              <h2 className="display text-[clamp(1.7rem,6vw,2.4rem)] leading-tight">
                Office ohne Abo für einmal <span className="whitespace-nowrap text-highlight">{priceLabel}</span>.
              </h2>
            </div>
            <div className="mt-6">
              <Actions source="final" />
            </div>
            <Trust />
          </div>
        </section>
      </main>

      <div className="pb-24 lg:pb-0">
        <Footer legalOnly />
      </div>
      <StickyBuyBar source="office-buybar" from="office" />
    </DiscountProvider>
  );
}
