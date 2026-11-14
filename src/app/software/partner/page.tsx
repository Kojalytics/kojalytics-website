import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeEuro, Check, CloudOff, FileText, Lock, ShieldCheck, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AppIcon from "@/components/ui/app-icon";
import DownloadButton from "@/components/software/DownloadButton";
import DigistoreBuyButton from "@/components/software/DigistoreBuyButton";
import DigistoreStickyBuyBar from "@/components/software/DigistoreStickyBuyBar";
import TrackView from "@/components/software/TrackView";
import Faq from "@/components/software/Faq";
import SectionBar from "@/components/instrument/SectionBar";
import OrbitField from "@/components/instrument/OrbitField";
import { APPS, appInk, getApp } from "@/lib/apps";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";
import { PARTNER_FAQ } from "@/lib/software-faq";
import { OG_BASE, SITE_URL } from "@/lib/site";

/*
 * Sales page for Digistore24 affiliates: their promolink lands here with ?aff=…&cam=…, and every buy button goes to
 * the Digistore24 order form with those parameters. Only the one-time licence, no Stripe, no discount code.
 * Not linked from the site or the sitemap; it duplicates /software, so it points search engines there.
 */

const PRICE = PLANS.lifetime.label;

export const metadata: Metadata = {
  title: { absolute: "Koja Office 2026 – Office-Paket ohne Abo für Windows und Mac, einmal zahlen | Kojalytics" },
  description: `13 Apps für Mac und Windows: Textverarbeitung, Tabellen, Präsentationen, PDF, Bildbearbeitung, Video, Audio und CAD. Einmal ${PRICE} statt Abo, offline und ohne Konto. ${TRIAL_DAYS} Tage kostenlos testen.`,
  alternates: { canonical: `${SITE_URL}/software` },
  robots: { index: false, follow: true },
  openGraph: {
    ...OG_BASE,
    title: `Koja Office 2026: 13 Apps für Mac und Windows, einmal ${PRICE}, kein Abo.`,
    description: `Office, PDF, Foto, Video, Audio und CAD. Offline, ohne Konto, einmal ${PRICE}. ${TRIAL_DAYS} Tage kostenlos testen.`,
    url: "/software/partner",
    images: [{ url: "/og/software.jpg", width: 1200, height: 630, alt: "Die Koja-Apps auf dem Mac" }],
  },
};

const included = [
  "Alle 13 Koja-Apps inklusive",
  "Updates über den Kojalytics Launcher",
  "Auf bis zu 3 Geräten (Mac oder Windows-PC)",
  "Einmal zahlen, keine Verlängerung",
];

const afterOrder = [
  "Bestellen und bezahlen über Digistore24.",
  "Den Lizenzschlüssel bekommst du sofort per E-Mail.",
  "Im Kojalytics Launcher unter Einstellungen › Lizenz einfügen und auf „Aktivieren“ klicken.",
  "Die Koja-Apps, die du brauchst, direkt im Launcher installieren.",
];

const problems = [
  {
    pain: "Monatliche Abo-Kosten, die nie enden, und eine Gebühr, wenn du vorzeitig gehst.",
    fix: `Einmal ${PRICE} zahlen, kein Abo. Keine Verlängerung, nichts zu kündigen.`,
  },
  {
    pain: "Erst Konto, Cloud und Anmeldung, bevor du eine Datei öffnen darfst.",
    fix: "Echte Desktop-Apps, die offline starten. Ohne Konto, ohne Upload.",
  },
  {
    pain: "Ein komplett neues Programm lernen, wenn die Deadline drückt.",
    fix: "Ebenen, Zeitleisten, Menübänder und Kurzbefehle da, wo du sie erwartest.",
  },
];

const benefits = [
  { icon: Zap, title: "Echte Desktop-Apps", text: "Native Programme, die schnell starten und ohne Internet weiterlaufen." },
  {
    icon: FileText,
    title: "Gängige Dateiformate",
    text: ".docx, .xlsx, .pptx, .psd und PDF öffnest du direkt, ohne Umwandeln. Layout und Umbrüche können abweichen, teste deshalb mit Kopien deiner Dateien.",
  },
  { icon: CloudOff, title: "Kein Konto, keine Cloud", text: "Nichts anmelden, nichts hochladen. Deine Arbeit bleibt auf deinem Computer." },
  { icon: BadgeEuro, title: "Einmal zahlen, kein Abo", text: `${PRICE} einmalig für alle 13 Apps, auf bis zu 3 Geräten. Keine Verlängerung, keine Kündigung.` },
  { icon: Lock, title: "Geprüft und signiert", text: "Kojalytics entwickelt, prüft und signiert die Koja-Apps und liefert sie mit Launcher, Aktivierung und automatischen Updates aus." },
  { icon: ShieldCheck, title: "Ein echtes Unternehmen", text: "Kojalytics, Software-Studio aus Hamburg. Mit Impressum und Support per E-Mail, von Menschen beantwortet." },
];

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

// Next to the buy buttons: where the order goes and how the key arrives.
function TrustLine({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-[13.5px] leading-snug text-muted ${className}`}>
      <ShieldCheck size={16} className="mt-px shrink-0 text-success" aria-hidden />
      <span>
        Bestellung und Zahlung sicher über Digistore24 – PayPal, Kreditkarte, SEPA, Klarna und mehr. Lizenzschlüssel sofort per{" "}
        <span className="whitespace-nowrap">E-Mail.</span>
      </span>
    </p>
  );
}

export default function SoftwarePartnerPage() {
  return (
    <>
      <TrackView name="software-partner" />
      <Navigation cta="buy-ds24" />

      <main className="pt-12">
        {/* Hero: the Kojalytics mark in the centre, the 13 app icons orbiting around it (not linked: visitors stay here) */}
        <section className="relative overflow-hidden border-b border-border">
          <OrbitField apps={APPS.map((a) => ({ slug: a.slug, name: a.name, kind: a.kind }))} linked={false} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0px,rgba(255,255,255,0)_268px,#fff_306px)] md:bg-[radial-gradient(ellipse_40%_46%_at_50%_50%,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.85)_60%,rgba(255,255,255,0)_100%)]"
          />
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[150px] z-[5] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center bg-foreground md:hidden">
            <span className="display text-[26px] leading-none text-white">K</span>
          </div>
          <div className="pointer-events-none relative z-10 mx-auto flex min-h-[calc(100svh-3rem)] max-w-3xl flex-col items-center justify-start px-5 pb-12 pt-[292px] text-center md:justify-center md:py-20">
            <p aria-label="Kojalytics" className="display rise-in flex items-center gap-[0.2em] text-[clamp(2rem,6.2vw,5rem)] uppercase tracking-[-0.02em] max-md:hidden">
              <span aria-hidden className="inline-grid h-[0.82em] w-[0.82em] shrink-0 place-items-center bg-foreground max-sm:hidden">
                <span className="text-[0.56em] leading-none text-white">K</span>
              </span>
              <span aria-hidden>Kojalytics</span>
            </p>
            <h1 className="display rise-in text-[clamp(1.75rem,3.6vw,2.9rem)] [--i:1] md:mt-7">
              13 Apps für Mac und Windows.{" "}
              <span className="whitespace-nowrap">
                Einmal <span className="text-highlight">{PRICE}</span>,
              </span>{" "}
              <span className="whitespace-nowrap">kein Abo.</span>
            </h1>
            <div className="pointer-events-auto rise-in mt-6 flex w-full flex-col justify-center gap-3 [--i:2] sm:w-auto sm:flex-row md:mt-8">
              <DigistoreBuyButton source="hero" />
              <DownloadButton source="partner-hero" variant="secondary" label={`${TRIAL_DAYS} Tage kostenlos testen`} />
            </div>
            <TrustLine className="rise-in mt-4 max-w-md justify-center text-left [--i:2]" />
            <p className="rise-in mt-6 max-w-xl text-[17px] leading-relaxed text-muted [--i:3] md:text-lg">
              Office, PDF, Bildbearbeitung, Video, Audio und CAD: echte Desktop-Apps, die offline laufen und kein Konto brauchen. Einmal
              zahlen, kein Abo.
            </p>
            <p className="hud rise-in mt-5 [--i:4]">Koja Office 2026 · für macOS und Windows · Kojalytics Launcher</p>
          </div>
        </section>

        {/* 01 Overview: all apps and the price at a glance */}
        <section className="rail">
          <SectionBar index="01" label="Koja Office für Mac und Windows" meta={`13 Apps · macOS · Windows · ${PRICE} einmalig`} />
          <div className={`grid gap-12 py-14 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center ${pad}`}>
            <div>
              <h2 className="display text-[clamp(2rem,4.6vw,4rem)]" data-reveal>
                13 Apps. Ein <span className="text-highlight">Preis</span>.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted" data-reveal>
                Vom schnellen PDF bis zum fertigen Film: Installiere nur die Apps, die du brauchst. Alle 13 sind enthalten, für einmalig{" "}
                <span className="whitespace-nowrap">{PRICE}</span>.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-reveal>
                <DigistoreBuyButton source="overview" />
                <Link href="#preise" className="btn-secondary">
                  Preis und Leistungen
                </Link>
              </div>
              <p className="hud mt-5" data-reveal>Für macOS und Windows · Kojalytics Launcher · ohne Konto · kein Abo</p>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted" data-reveal>
                <span className="text-foreground">Empfohlen:</span> Der Kojalytics Launcher installiert jede App, die du brauchst, und hält
                alle aktuell.
              </p>
            </div>

            <div data-reveal>
              <ul className="cells grid-cols-4 border border-border" aria-label="Alle 13 Apps">
                {APPS.map((a) => (
                  <li key={a.slug} title={`${a.name}: ${a.kind}`} className="flex flex-col items-center gap-2 px-1 py-4">
                    <AppIcon slug={a.slug} name={a.name} size={52} />
                    <span className="text-center text-[11.5px] leading-tight text-muted">{a.name}</span>
                  </li>
                ))}
                <li className="col-span-3 flex flex-col justify-center gap-1 px-4 py-4">
                  <span className="hud text-foreground">13 Apps · 1 Preis</span>
                  <span className="hud">{PRICE} einmalig · kein Abo</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 02 Price: the one-time licence only */}
        <section id="preise" className="rail crosshairs scroll-mt-12">
          <SectionBar index="02" label="Preis" meta="Einmal zahlen · kein Abo" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Einmal zahlen. Kein <span className="text-highlight">Abo</span>.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted" data-reveal>
              Zahle einmal <span className="whitespace-nowrap">{PRICE}</span> und nutze alle 13 Apps auf bis zu 3 Geräten. Erst testen?{" "}
              {TRIAL_DAYS} Tage kostenlos.
            </p>

            <div className="cells mt-12 border border-border md:grid-cols-2">
              <div className="relative flex flex-col p-6 outline outline-2 -outline-offset-1 outline-buy sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="hud">
                    <span className="text-faint">01</span>
                    <span className="mx-2 text-faint">/</span>
                    <span className="text-foreground">Einmalkauf</span>
                  </p>
                  <span className="tag !border-buy bg-buy !text-white">Kein Abo</span>
                </div>
                <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="display whitespace-nowrap text-6xl">{PRICE}</span>
                  <span className="hud">{PLANS.lifetime.per}</span>
                </p>
                <p className="mt-2 text-sm text-muted">Einmal zahlen, keine Verlängerung. Inkl. MwSt.</p>
                <p className="mt-3 border-l-2 border-buy pl-3 text-sm leading-relaxed text-foreground">
                  Zum Vergleich: Adobe Creative Cloud Pro kostet 77,99 € im Monat, Microsoft 365 Single 99 € im Jahr.{" "}
                  <span className="text-muted">(Stand November 2026)</span>
                </p>
                <ul className="mb-8 mt-6 grid gap-3">
                  {included.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px]">
                      <Check size={18} strokeWidth={2.6} className="mt-0.5 shrink-0 text-success" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto grid gap-4">
                  <DigistoreBuyButton source="pricing" label={`Jetzt für ${PRICE} kaufen`} className="w-full" />
                  <TrustLine />
                </div>
              </div>

              <div className="flex flex-col p-6 sm:p-8">
                <p className="hud">
                  <span className="text-faint">02</span>
                  <span className="mx-2 text-faint">/</span>
                  <span className="text-foreground">Nach der Bestellung</span>
                </p>
                <ol className="mt-6 grid gap-4">
                  {afterOrder.map((step, i) => (
                    <li key={step} className="flex gap-4 text-[15px] leading-relaxed">
                      <span className="hud mt-0.5 w-6 shrink-0 text-faint">{two(i + 1)}</span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="mt-auto border-t border-border pt-6 max-md:mt-8">
                  <p className="text-[15px]">
                    <span className="hud mr-2 text-foreground">Erst testen?</span>
                    <span className="text-muted">Lade die Apps und nutze sie {TRIAL_DAYS} Tage lang kostenlos, ohne Zahlungsdaten.</span>
                  </p>
                  <div className="mt-4">
                    <DownloadButton source="partner-pricing" label="Kostenlos laden" />
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              Die Koja-Apps werden laufend weiterentwickelt. Updates und neue Funktionen bekommst du automatisch und kostenlos. Teste die Apps vor
              dem Kauf {TRIAL_DAYS} Tage kostenlos mit deinen eigenen Dateien.
            </p>
          </div>
        </section>

        {/* 03 Lineup (not linked: the app pages sell through a different checkout) */}
        <section id="apps" className="rail crosshairs scroll-mt-12">
          <SectionBar index="03" label="Die Apps" meta="Alle 13 enthalten" />
          <div className="cells -mx-0 border-b border-border max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:overflow-y-hidden max-sm:overscroll-x-contain sm:grid-cols-2 lg:grid-cols-4">
            {APPS.map((app, i) => {
              const ink = appInk(app.color);
              return (
                <div
                  key={app.slug}
                  data-reveal
                  style={{ ["--i" as string]: i % 4 }}
                  className="flex shrink-0 flex-col max-sm:w-[84%] max-sm:snap-start"
                >
                  <div className="flex items-center justify-between gap-3 px-5 py-3">
                    <span className="grid h-6 min-w-8 place-items-center px-1.5 font-mono text-[11px] font-semibold text-white" style={{ background: ink }}>
                      {two(i + 1)}
                    </span>
                    <span className="hud truncate">{app.kind}</span>
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden border-y border-border bg-surface">
                    <Image src={app.card.src} alt={app.card.alt} fill sizes="(max-width: 640px) 84vw, (max-width: 1024px) 50vw, 320px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col px-5 pb-6">
                    <div className="relative z-10 -mt-7 mb-4">
                      <AppIcon slug={app.slug} name={app.name} size={56} />
                    </div>
                    <h3 className="display text-[1.55rem]">
                      {app.name.slice(0, -4)}
                      <span style={{ color: ink }}>Koja</span>
                    </h3>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{app.benefit}</p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      <span className="tag">macOS</span>
                      <span className="tag">Windows</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="hidden flex-col justify-between gap-6 p-6 sm:flex lg:col-span-3 lg:p-8">
              <p className="hud">Nächster Schritt</p>
              <div>
                <p className="display text-3xl">
                  Probier es mit <span className="text-highlight">deinen</span> Dateien.
                </p>
                <p className="mt-3 max-w-lg text-muted">Alle 13 Apps {TRIAL_DAYS} Tage kostenlos, ohne Zahlungsdaten.</p>
              </div>
              <div>
                <DownloadButton source="partner-mid" />
              </div>
            </div>
          </div>
          <div className={`flex flex-col gap-4 py-8 sm:hidden ${pad}`}>
            <p className="hud">Wischen für alle 13 Apps →</p>
            <DownloadButton source="partner-mid" />
          </div>
        </section>

        {/* 04 Why people switch */}
        <section className="rail crosshairs">
          <SectionBar index="04" label="Warum Leute wechseln" meta="Abo-Frust, gelöst" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-4xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Du willst etwas erschaffen. <span className="text-highlight">Keine</span> Abos verwalten.
            </h2>
          </div>
          <div className="cells border-y border-border md:grid-cols-3">
            {problems.map((p, i) => (
              <div key={p.pain} className="p-6 md:p-8" data-reveal style={{ ["--i" as string]: i }}>
                <p className="hud text-faint">{two(i + 1)}</p>
                <p className="mt-5 text-muted line-through decoration-muted/40">{p.pain}</p>
                <p className="mt-4 text-lg font-semibold leading-snug">{p.fix}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 05 Principles */}
        <section className="rail crosshairs">
          <SectionBar index="05" label="Was du bekommst" meta="Für jede App gleich" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Gebaut für deinen <span className="text-highlight">Computer</span>.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted" data-reveal>
              Nicht für ein Abo-Dashboard. Jede Koja-App folgt denselben Regeln.
            </p>
          </div>
          <div className="cells border-y border-border sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="p-6 md:p-8" data-reveal style={{ ["--i" as string]: i % 3 }}>
                <div className="flex items-start justify-between">
                  <span className="icon-box">
                    <Icon size={18} aria-hidden />
                  </span>
                  <span className="hud text-faint">{two(i + 1)}</span>
                </div>
                <h3 className="display mt-6 text-[1.35rem]">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 06 Trust */}
        <section className="rail crosshairs">
          <SectionBar index="06" label="Wer dahinter steht" meta="Kojalytics · Hamburg" />
          <div className={`grid gap-12 py-14 md:py-20 lg:grid-cols-2 lg:items-center ${pad}`}>
            <div data-reveal>
              <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]">
                Ein kleines Studio. <span className="text-highlight">Echter</span> Support.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Kojalytics ist ein Software-Studio aus Hamburg. Wir entwickeln, prüfen und signieren die Koja-Apps und liefern sie mit Launcher,
                Aktivierung und automatischen Updates für Mac und Windows aus. Deine E-Mails beantworten wir selbst. Die Apps werden laufend
                weiterentwickelt, Updates und neue Funktionen bekommst du automatisch und kostenlos. Teste alles {TRIAL_DAYS} Tage
                kostenlos, bevor du zahlst.
              </p>
              <ul className="mt-6 grid gap-2.5">
                {["Sichere Bestellung und Zahlung über Digistore24", "Lizenzschlüssel sofort per E-Mail", "Unternehmen mit Sitz in Hamburg"].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check size={18} strokeWidth={2.4} className="mt-1 shrink-0 text-success" aria-hidden />
                    {t}
                  </li>
                ))}
                <li className="flex gap-3">
                  <Check size={18} strokeWidth={2.4} className="mt-1 shrink-0 text-success" aria-hidden />
                  <span>
                    Support unter{" "}
                    <a href="mailto:support@kojalytics.com" className="underline underline-offset-4">
                      support@kojalytics.com
                    </a>
                  </span>
                </li>
              </ul>
            </div>
            <div className="cells grid-cols-2 border border-border" data-reveal>
              {["word-koja", "grid-koja", "photo-koja", "pdf-koja"].map((slug) => {
                const app = getApp(slug);
                return app ? (
                  <div key={slug} className="relative aspect-[16/10]">
                    <Image src={app.card.src} alt={app.card.alt} fill sizes="(max-width: 1024px) 50vw, 300px" className="object-cover" />
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </section>

        {/* 07 FAQ */}
        <section id="fragen" className="rail crosshairs scroll-mt-12">
          <SectionBar index="07" label="Fragen" meta="Bevor du kaufst" />
          <div className={`grid gap-10 py-14 md:py-20 lg:grid-cols-[0.8fr_1.2fr] ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Bevor du <span className="text-highlight">kaufst</span>.
            </h2>
            <Faq items={PARTNER_FAQ} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="rail crosshairs border-t border-border">
          <div className={`flex flex-col items-center py-20 text-center md:py-28 ${pad}`}>
            <p className="hud">Offline · ohne Konto · kein Abo</p>
            <div className="mt-8 flex -space-x-2">
              {APPS.slice(0, 7).map((a) => (
                <AppIcon key={a.slug} slug={a.slug} name={a.name} size={48} />
              ))}
            </div>
            <h2 className="display mt-8 max-w-4xl text-[clamp(2.2rem,5vw,4.4rem)]" data-reveal>
              Dein Kreativ- und Büro-Paket für einmal <span className="whitespace-nowrap text-highlight">{PRICE}</span>.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-muted">13 Apps in einem Paket. Einmal zahlen, keine Verlängerung, nichts zu kündigen.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <DigistoreBuyButton source="final-cta" />
              <DownloadButton source="partner-final-cta" variant="secondary" label={`${TRIAL_DAYS} Tage kostenlos testen`} />
            </div>
            <TrustLine className="mt-5 max-w-md text-left" />
          </div>
        </section>
      </main>
      <Footer legalOnly />
      <DigistoreStickyBuyBar source="buybar" />
    </>
  );
}
