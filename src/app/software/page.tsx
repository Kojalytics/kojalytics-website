import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, CloudOff, FileText, LayoutGrid, Lock, MousePointerClick, ShieldCheck, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MacWindow from "@/components/ui/mac-window";
import AppIcon from "@/components/ui/app-icon";
import DownloadButton from "@/components/software/DownloadButton";
import PricingCards from "@/components/software/PricingCards";
import TrackView from "@/components/software/TrackView";
import Faq, { faqJsonLd } from "@/components/software/Faq";
import SectionBar from "@/components/instrument/SectionBar";
import OrbitField from "@/components/instrument/OrbitField";
import { APPS, appInk, getApp, shotFor } from "@/lib/apps";
import { ARTICLES } from "@/lib/ratgeber";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";
import { SOFTWARE_FAQ } from "@/lib/software-faq";
import { OG_BASE, SITE_URL, jsonLd } from "@/lib/site";
import compare from "@/content/software-compare.json";

export const metadata: Metadata = {
  title: "Koja-Apps: 13 Apps für Mac und Windows statt Adobe-Abo",
  description:
    "Bildbearbeitung, Video, Layout, Audio, Office, PDF und CAD für Mac und Windows. Offline, ohne Konto. 2,99 € im Monat, jederzeit online kündbar. 3 Tage kostenlos testen.",
  alternates: { canonical: "/software" },
  openGraph: {
    ...OG_BASE,
    title: "Foto, Video und Office: 13 Apps für Mac und Windows, 2,99 € im Monat.",
    description: "Foto, Video, Design, Audio, Office, PDF und CAD. Offline, ohne Konto, jederzeit online kündbar. 3 Tage kostenlos testen.",
    url: "/software",
    images: [{ url: "/og/software.jpg", width: 1200, height: 630, alt: "Die Koja-Apps auf dem Mac" }],
  },
};

const problems = [
  {
    pain: "Monatliche Abo-Kosten, die nie enden, und eine Gebühr, wenn du vorzeitig gehst.",
    fix: "2,99 € im Monat und jederzeit online kündbar. Oder einmal 79 € zahlen und behalten.",
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
    text: ".docx, .xlsx, .pptx, .psd und PDF öffnest du direkt, ohne Umwandeln. Layout und Umbrüche können noch abweichen, teste deshalb mit Kopien deiner Dateien.",
  },
  { icon: CloudOff, title: "Kein Konto, keine Cloud", text: "Nichts anmelden, nichts hochladen. Deine Arbeit bleibt auf deinem Computer." },
  { icon: MousePointerClick, title: "Online kündigen, jederzeit", text: "Name und E-Mail eingeben, „Jetzt kündigen“ klicken. Ohne Gebühr, ohne Anruf, ohne Kündigungsschreiben." },
  { icon: Lock, title: "Offener Quellcode", text: "Die Apps basieren auf offenem Code (MIT / Apache-2.0), den jeder prüfen kann." },
  { icon: ShieldCheck, title: "Ein echtes Unternehmen", text: "Kojalytics, Software-Studio aus Hamburg. Mit Impressum und Support per E-Mail, von Menschen beantwortet." },
];

const showcase = [
  {
    app: "word-koja",
    title: "Deine Office-Dateien am Mac und PC",
    text: "WordKoja, GridKoja und DeckKoja lesen und speichern .docx, .xlsx und .pptx, ohne Microsoft-Konto. Das Angebot vom Kunden, die Tabelle aus der Buchhaltung, die Präsentation der Kollegin. Aufwendige Layouts können noch abweichen: Teste deine wichtigsten Dateien in den 3 Tagen.",
  },
  {
    app: "photo-koja",
    title: "Vertraute Werkzeuge",
    text: "Ebenen, Masken, Ebenenstile und Pinsel in PhotoKoja. Pfade und Formen in VectorKoja. Musterseiten und Textrahmen in DesignKoja. Die Werkzeuge liegen dort, wo du sie aus anderen Programmen erwartest.",
  },
  {
    app: "effect-koja",
    title: "Auch für Video, Effekte und Audio",
    text: "Schneide Videos auf einer Mehrspur-Zeitleiste in FilmKoja, animiere Titel in EffectKoja und mische deinen Podcast in SoundKoja. Alles im selben Paket.",
  },
];

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Koja-Apps",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "macOS, Windows",
  inLanguage: "de",
  url: `${SITE_URL}/software`,
  image: `${SITE_URL}/og/software.jpg`,
  description:
    "13 Apps für Mac und Windows: Bildbearbeitung, RAW-Fotos, Vektorgrafik, Layout, Interface-Design, Videoschnitt, Motion Graphics, Audio, Textverarbeitung, Tabellen, Präsentationen, PDF und CAD.",
  publisher: { "@type": "Organization", name: "Kojalytics", url: SITE_URL },
  offers: [
    {
      "@type": "Offer",
      name: "Monatlich",
      price: (PLANS.monthly.cents / 100).toFixed(2),
      priceCurrency: "EUR",
      url: `${SITE_URL}/software#preise`,
      availability: "https://schema.org/InStock",
      priceSpecification: { "@type": "UnitPriceSpecification", price: (PLANS.monthly.cents / 100).toFixed(2), priceCurrency: "EUR", billingDuration: "P1M", unitCode: "MON" },
    },
    { "@type": "Offer", name: "Dauerhaft", price: (PLANS.lifetime.cents / 100).toFixed(2), priceCurrency: "EUR", url: `${SITE_URL}/software#preise`, availability: "https://schema.org/InStock" },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Software", item: `${SITE_URL}/software` },
  ],
};

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

export default function SoftwarePage() {
  // Placeholder slots for real customer quotes: visible on preview deployments only, never in production.
  const showPlaceholders = process.env.VERCEL_ENV !== "production";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd(SOFTWARE_FAQ))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd)} />
      <TrackView name="software" />
      <Navigation />

      <main className="pt-12">
        {/* Hero: the Kojalytics mark in the centre, the 13 app icons orbiting around it */}
        <section className="relative overflow-hidden border-b border-border">
          <OrbitField apps={APPS.map((a) => ({ slug: a.slug, name: a.name, kind: a.kind }))} />
          {/* White veil keeps the copy readable: below the orbits on phones, a soft halo behind the copy from sm up */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0px,rgba(255,255,255,0)_395px,#fff_445px)] md:bg-[radial-gradient(ellipse_40%_46%_at_50%_50%,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.85)_60%,rgba(255,255,255,0)_100%)]"
          />
          {/* Phones: the K mark is the centre the apps orbit around */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[215px] z-[5] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center bg-foreground md:hidden">
            <span className="display text-[34px] leading-none text-white">K</span>
          </div>
          <div className="pointer-events-none relative z-10 mx-auto flex min-h-[calc(100svh-3rem)] max-w-3xl flex-col items-center justify-start px-5 pb-16 pt-[440px] text-center md:justify-center md:py-20">
            <p aria-label="Kojalytics" className="display rise-in flex items-center gap-[0.2em] text-[clamp(2rem,6.2vw,5rem)] uppercase tracking-[-0.02em] max-md:hidden">
              <span aria-hidden className="inline-grid h-[0.82em] w-[0.82em] shrink-0 place-items-center bg-foreground max-sm:hidden">
                <span className="text-[0.56em] leading-none text-white">K</span>
              </span>
              <span aria-hidden>Kojalytics</span>
            </p>
            <h1 className="display rise-in text-[clamp(1.75rem,3.6vw,2.9rem)] [--i:1] md:mt-7">
              13 Apps für Mac und Windows,{" "}
              <span className="whitespace-nowrap text-highlight">{PLANS.monthly.label}</span>{" "}
              <span className="whitespace-nowrap">im Monat.</span>
            </h1>
            <p className="rise-in mt-5 max-w-xl text-lg leading-relaxed text-muted [--i:2]">
              Bildbearbeitung, RAW-Fotos, Layout, Video, Audio, Office, PDF und CAD: echte Desktop-Apps, die offline laufen und kein Konto
              brauchen. Teste alle {TRIAL_DAYS} Tage kostenlos.
            </p>
            <div className="pointer-events-auto rise-in mt-8 flex w-full flex-col justify-center gap-3 [--i:3] sm:w-auto sm:flex-row">
              <DownloadButton source="software-hero" />
              <Link href="#apps" className="btn-secondary">
                <LayoutGrid size={15} aria-hidden /> Alle Apps ansehen
              </Link>
            </div>
            <p className="hud rise-in mt-5 [--i:4]">Für macOS und Windows · Kojalytics Launcher</p>
            <p className="hud rise-in mt-7 text-faint [--i:5]">Offline · ohne Konto · jederzeit online kündbar · frühe Alpha-Versionen</p>
          </div>
        </section>

        {/* 01 Overview: all apps and the price at a glance */}
        <section className="rail">
          <SectionBar index="01" label="Koja-Apps für Mac und Windows" meta="13 Apps · macOS · Windows · frühe Alpha-Versionen" />
          <div className={`grid gap-12 py-14 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center ${pad}`}>
            <div>
              <h2 className="display text-[clamp(2rem,4.6vw,4rem)]" data-reveal>
                13 Apps. Ein <span className="text-highlight">Preis</span>.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted" data-reveal>
                Vom schnellen PDF bis zum fertigen Film: Installiere nur die Apps, die du brauchst. Alle sind enthalten, ob für{" "}
                <span className="whitespace-nowrap">{PLANS.monthly.label}</span> im Monat oder einmalig{" "}
                <span className="whitespace-nowrap">{PLANS.lifetime.label}</span>.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-reveal>
                <DownloadButton source="software-hero" />
                <Link href="#preise" className="btn-secondary">
                  Preise ansehen
                </Link>
              </div>
              <p className="hud mt-5" data-reveal>Für macOS und Windows · Kojalytics Launcher · ohne Konto · jederzeit online kündbar</p>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted" data-reveal>
                <span className="text-foreground">Empfohlen:</span> Der Kojalytics Launcher installiert jede App, die du brauchst, und hält
                alle aktuell.
              </p>
            </div>

            <div data-reveal>
              <ul className="cells grid-cols-4 border border-border" aria-label="Alle 13 Apps">
                {APPS.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/software/${a.slug}`}
                      prefetch={false}
                      title={`${a.name}: ${a.kind}`}
                      className="group flex flex-col items-center gap-2 px-1 py-4 transition-colors hover:bg-surface"
                    >
                      <span className="transition-transform group-hover:-translate-y-0.5">
                        <AppIcon slug={a.slug} name={a.name} size={52} />
                      </span>
                      <span className="text-center text-[11.5px] leading-tight text-muted">{a.name}</span>
                    </Link>
                  </li>
                ))}
                <li className="col-span-3 flex flex-col justify-center gap-1 px-4 py-4">
                  <span className="hud text-foreground">13 Apps · 1 Preis</span>
                  <span className="hud">
                    {PLANS.monthly.label} / Monat · {PLANS.lifetime.label} einmalig
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 02 Lineup */}
        <section id="apps" className="rail crosshairs scroll-mt-12">
          <SectionBar index="02" label="Die Apps" meta="Wähle eine App" />
          <div className="cells -mx-0 border-b border-border max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto sm:grid-cols-2 lg:grid-cols-4">
            {APPS.map((app, i) => {
              const shot = app.shots[0];
              const ink = appInk(app.color);
              return (
                <Link
                  key={app.slug}
                  href={`/software/${app.slug}`}
                  prefetch={false}
                  data-reveal
                  style={{ ["--i" as string]: i % 4 }}
                  className="group flex shrink-0 flex-col max-sm:w-[84%] max-sm:snap-start"
                >
                  <div className="flex items-center justify-between gap-3 px-5 py-3">
                    <span className="grid h-6 min-w-8 place-items-center px-1.5 font-mono text-[11px] font-semibold text-white" style={{ background: ink }}>
                      {two(i + 1)}
                    </span>
                    <span className="hud truncate">{app.kind}</span>
                  </div>
                  {shot && (
                    <div className="relative aspect-[16/10] overflow-hidden border-y border-border bg-surface">
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        fill
                        sizes="(max-width: 640px) 84vw, (max-width: 1024px) 50vw, 320px"
                        className="object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
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
                      <span className="tag" style={{ color: ink, borderColor: `${ink}66` }}>
                        {app.status}
                      </span>
                      <span className="tag">macOS</span>
                      <span className="tag">Windows</span>
                    </div>
                    <span className="link-hud mt-6">
                      Mehr zu {app.name} <ArrowUpRight size={14} aria-hidden />
                    </span>
                  </div>
                </Link>
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
                <DownloadButton source="software-mid" />
              </div>
            </div>
          </div>
          <div className={`flex flex-col gap-4 py-8 sm:hidden ${pad}`}>
            <p className="hud">Wischen für alle 13 Apps →</p>
            <DownloadButton source="software-mid" />
          </div>
        </section>

        {/* 03 Why people switch */}
        <section className="rail crosshairs">
          <SectionBar index="03" label="Warum Leute wechseln" meta="Abo-Frust, gelöst" />
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

        {/* 04 In use */}
        <section className="rail crosshairs">
          <SectionBar index="04" label="Im Einsatz" meta="Echte Bildschirmfotos" />
          <div className="cells border-b border-border">
            {showcase.map((s, i) => {
              const app = getApp(s.app);
              const shot = app && shotFor(app);
              return (
                <div key={s.title} className={`grid gap-10 py-14 md:py-20 lg:grid-cols-2 lg:items-center ${pad}`} data-reveal>
                  <div className={i % 2 ? "lg:order-2" : ""}>
                    <p className="hud text-faint">
                      {two(i + 1)} / {app?.name}
                    </p>
                    <h2 className="display mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)]">{s.title}</h2>
                    <p className="mt-5 text-lg leading-relaxed text-muted">{s.text}</p>
                  </div>
                  {shot && app && (
                    <figure className={`m-0 ${i % 2 ? "lg:order-1" : ""}`}>
                      <MacWindow src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} label={app.name} sizes="(max-width: 1024px) 100vw, 600px" />
                      <figcaption className="hud mt-3 normal-case tracking-normal">{shot.caption}</figcaption>
                    </figure>
                  )}
                </div>
              );
            })}
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

        {/* 06 Price comparison */}
        <section className="rail crosshairs">
          <SectionBar index="06" label="Preisvergleich" meta="Was du im Jahr zahlst" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Was du im <span className="text-highlight">Jahr</span> zahlst.
            </h2>
            <div className="mt-10 grid gap-3 md:hidden">
              {compare.rows.map((r) => (
                <div key={r.label} className="border border-border p-4">
                  <p className="hud">{r.label}</p>
                  <dl className="mt-3 grid gap-2 text-[15px]">
                    {r.values.map((v, i) => (
                      <div key={i}>
                        <dt className={`font-semibold ${i === 0 ? "text-accent" : ""}`}>{compare.columns[i]}</dt>
                        <dd className={i === 0 ? "font-semibold" : ""}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <div className="mt-10 hidden overflow-x-auto border border-border md:block" data-reveal>
              <table className="w-full text-left text-[15px]">
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="p-4"></th>
                    {compare.columns.map((c, i) => (
                      <th key={c} scope="col" className={`hud p-4 ${i === 0 ? "!text-accent" : "!text-foreground"}`}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compare.rows.map((r) => (
                    <tr key={r.label} className="border-t border-border align-top first:border-t-0">
                      <th scope="row" className="p-4 font-medium text-muted">
                        {r.label}
                      </th>
                      {r.values.map((v, i) => (
                        <td key={i} className={`border-l border-border p-4 ${i === 0 ? "bg-[#f4f7fd] font-semibold" : ""}`}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">{compare.note}</p>
          </div>
        </section>

        {/* 07 Pricing */}
        <section id="preise" className="rail crosshairs scroll-mt-12">
          <SectionBar index="07" label="Preise" meta={`${TRIAL_DAYS} Tage kostenlos · dann monatlich oder einmalig`} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Erst testen. Dann <span className="text-highlight">entscheiden</span>.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted" data-reveal>
              Nutze alle Apps {TRIAL_DAYS} Tage kostenlos. Danach bleibst du für <span className="whitespace-nowrap">{PLANS.monthly.label}</span> im
              Monat und gehst, wann du willst, oder du zahlst einmal <span className="whitespace-nowrap">{PLANS.lifetime.label}</span>.
            </p>
            <div className="mt-12">
              <PricingCards source="software-pricing" />
            </div>
          </div>
        </section>

        {/* 08 Trust */}
        <section className="rail crosshairs">
          <SectionBar index="08" label="Wer dahinter steht" meta="Kojalytics · Hamburg" />
          <div className={`grid gap-12 py-14 md:py-20 lg:grid-cols-2 lg:items-center ${pad}`}>
            <div data-reveal>
              <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]">
                Ein kleines Studio. <span className="text-highlight">Offener</span> Code.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Kojalytics ist ein Software-Studio aus Hamburg. Die Koja-Apps basieren auf quelloffener Software des ArtCraft-Teams. Wir
                liefern sie als signierte Apps für Mac und Windows aus, halten sie über den Kojalytics Launcher aktuell und beantworten deine E-Mails
                selbst. Die Apps sind frühe Versionen und werden laufend weiterentwickelt. Deshalb testest du alles {TRIAL_DAYS} Tage
                kostenlos, bevor du zahlst.
              </p>
              <ul className="mt-6 grid gap-2.5">
                {["Sichere Zahlung über Stripe", "Unternehmen mit Sitz in Hamburg"].map((t) => (
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
              {showPlaceholders && (
                <div className="mt-8 border border-dashed border-accent p-5 text-sm text-accent">
                  [Platzhalter, nur in der Vorschau sichtbar] Hier 2–3 echte Kundenstimmen mit Name und Tätigkeit einsetzen. Keine
                  erfundenen Zitate.
                </div>
              )}
            </div>
            <div className="cells grid-cols-2 border border-border" data-reveal>
              {["grid-koja", "light-koja", "vector-koja", "deck-koja"].map((slug) => {
                const app = getApp(slug);
                const shot = app && shotFor(app);
                return shot && app ? (
                  <div key={slug} className="p-3">
                    <MacWindow src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 1024px) 45vw, 300px" fixedRatio label={app.name} />
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </section>

        {/* 09 Guides */}
        {ARTICLES.length > 0 && (
          <section className="rail crosshairs">
            <SectionBar index="09" label="Ratgeber" meta="Umstieg ohne Abo" />
            <div className={`flex flex-col justify-between gap-4 py-14 md:flex-row md:items-end md:py-20 ${pad}`}>
              <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
                Ratgeber zum <span className="text-highlight">Umstieg</span>.
              </h2>
              <Link href="/ratgeber" className="link-hud">
                Alle Ratgeber <ArrowUpRight size={14} aria-hidden />
              </Link>
            </div>
            <div className="cells border-y border-border md:grid-cols-3">
              {ARTICLES.slice(0, 3).map((a, i) => (
                <Link key={a.slug} href={`/ratgeber/${a.slug}`} className="group flex flex-col p-6 md:p-8" data-reveal style={{ ["--i" as string]: i }}>
                  <p className="hud">
                    <span className="text-faint">{two(i + 1)}</span> · {a.readingMinutes} Min. Lesezeit
                  </p>
                  <h3 className="mt-5 text-xl font-semibold leading-snug group-hover:text-accent">{a.h1}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{a.metaDescription}</p>
                  <span className="link-hud mt-6">
                    Lesen <ArrowUpRight size={14} aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 10 FAQ */}
        <section id="fragen" className="rail crosshairs scroll-mt-12">
          <SectionBar index="10" label="Fragen" meta="Bevor du lädst" />
          <div className={`grid gap-10 py-14 md:py-20 lg:grid-cols-[0.8fr_1.2fr] ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Bevor du <span className="text-highlight">lädst</span>.
            </h2>
            <Faq items={SOFTWARE_FAQ} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="rail crosshairs border-t border-border">
          <div className={`flex flex-col items-center py-20 text-center md:py-28 ${pad}`}>
            <p className="hud">Offline · ohne Konto · jederzeit online kündbar</p>
            <div className="mt-8 flex -space-x-2">
              {APPS.slice(0, 7).map((a) => (
                <AppIcon key={a.slug} slug={a.slug} name={a.name} size={48} />
              ))}
            </div>
            <h2 className="display mt-8 max-w-4xl text-[clamp(2.2rem,5vw,4.4rem)]" data-reveal>
              Dein Kreativ- und Büro-Paket für <span className="whitespace-nowrap text-highlight">{PLANS.monthly.label}</span> im Monat.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-muted">13 Apps, {TRIAL_DAYS} Tage kostenlos, jederzeit online kündbar.</p>
            <div className="mt-9">
              <DownloadButton source="software-final-cta" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
