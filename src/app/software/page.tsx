import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, CloudOff, FileText, Lock, MousePointerClick, ShieldCheck, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
import MacWindow from "@/components/ui/mac-window";
import AppIcon from "@/components/ui/app-icon";
import DownloadButton from "@/components/software/DownloadButton";
import PricingCards from "@/components/software/PricingCards";
import TrackView from "@/components/software/TrackView";
import Faq, { faqJsonLd } from "@/components/software/Faq";
import { APPS, APP_GROUPS, getApp, shotFor } from "@/lib/apps";
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

// FilmKoja's screenshots show stills from third-party films; they stay off the most-seen surfaces.
const tunnelItems = APPS.filter((a) => a.slug !== "film-koja").map((a) => {
  const s = a.shots[0];
  return { src: s?.src ?? "", alt: s?.alt ?? a.name, label: a.name, icon: `/apps/${a.slug}/icon.webp` };
}).filter((i) => i.src);

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

      <main>
        <PerspectiveTunnelHero items={tunnelItems}>
          <div className="flex max-w-3xl flex-col items-center text-center">
            <p className="rounded-full border border-border bg-white px-3 py-1 text-sm font-medium text-muted">Koja-Apps für Mac und Windows · frühe Alpha-Versionen</p>
            <h1 className="display mt-5 text-[clamp(2.4rem,5.6vw,4.6rem)]">
              13 Apps für <span className="whitespace-nowrap">Mac und Windows</span>.{" "}
              <span className="whitespace-nowrap text-highlight">2,99 €</span> im Monat.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Fotos bearbeiten, Layouts setzen, Videos schneiden, Texte schreiben und PDFs ordnen: in echten Desktop-Apps, die
              offline laufen und kein Konto brauchen. Teste alle Apps {TRIAL_DAYS} Tage kostenlos.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <DownloadButton source="software-hero" />
              <Link href="#preise" className="btn-secondary">
                Preise ansehen
              </Link>
            </div>
            <p className="mt-4 text-sm text-foreground/70">macOS und Windows · ohne Konto · jederzeit online kündbar</p>
            <ul className="mt-7 flex max-w-[600px] flex-wrap justify-center gap-2" aria-label="Alle 13 Apps">
              {APPS.map((a) => (
                <li key={a.slug}>
                  <Link href={`/software/${a.slug}`} prefetch={false} title={`${a.name}: ${a.kind}`} className="block transition-transform hover:-translate-y-0.5">
                    <AppIcon slug={a.slug} name={a.name} size={34} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </PerspectiveTunnelHero>

        {/* Problem → solution */}
        <section className="px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Warum Leute wechseln</p>
          <h2 className="display mt-3 max-w-4xl text-4xl sm:text-5xl md:text-6xl">
            Du willst etwas erschaffen. <span className="text-muted">Keine Abos verwalten.</span>
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {problems.map((p) => (
              <div key={p.pain} className="rounded-[22px] border border-border p-6">
                <p className="text-muted line-through decoration-muted/40">{p.pain}</p>
                <p className="mt-4 flex items-start gap-2 text-lg font-semibold">
                  <ArrowRight className="mt-1 shrink-0 text-accent" size={18} aria-hidden />
                  {p.fix}
                </p>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* App gallery */}
        <section id="apps" className="scroll-mt-16 bg-surface px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Die Apps</p>
                <h2 className="display mt-3 text-4xl sm:text-5xl md:text-6xl">13 Apps. Ein Preis.</h2>
              </div>
              <p className="max-w-md text-muted">
                Vom schnellen PDF bis zum fertigen Film. Installiere nur die Apps, die du brauchst. Alle sind enthalten, ob im Monatsabo
                oder mit der Einmal-Lizenz.
              </p>
            </div>

            {APP_GROUPS.map((group) => {
              const apps = APPS.filter((a) => a.group === group);
              return (
                <div key={group} className="mt-14">
                  <h3 className="mb-5 text-lg font-semibold">{group}</h3>
                  {/* Phones: one swipeable row per group. Desktop: 3 per row; with 5 apps the last two share the row. */}
                  <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6">
                    {apps.map((app, i) => {
                      const shot = app.shots[0];
                      const wide = apps.length % 3 === 2 && i >= apps.length - 2;
                      return (
                        <Link
                          key={app.slug}
                          href={`/software/${app.slug}`}
                          prefetch={false}
                          className={`group flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] border border-border bg-white transition-[box-shadow,border-color] hover:border-[#d6d3d1] hover:shadow-[0_20px_40px_-24px_rgba(17,17,19,0.3)] sm:w-auto ${
                            wide ? "lg:col-span-3" : "lg:col-span-2"
                          } ${apps.length % 2 === 1 && i === apps.length - 1 ? "sm:max-lg:col-span-2" : ""}`}
                        >
                          {shot && (
                            <div className="bg-[linear-gradient(160deg,var(--c)_0%,transparent_75%)] p-5 pb-0" style={{ ["--c" as string]: `${app.color}22` }}>
                              <MacWindow src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 30vw" fixedRatio className="translate-y-2 transition-transform duration-500 group-hover:translate-y-0" />
                            </div>
                          )}
                          <div className="flex flex-1 flex-col border-t border-border p-5">
                            <div className="flex items-center gap-3">
                              <AppIcon slug={app.slug} name={app.name} size={40} />
                              <div>
                                <p className="font-semibold">{app.name}</p>
                                <p className="text-sm text-muted">{app.kind}</p>
                              </div>
                            </div>
                            <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted">{app.benefit}</p>
                            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                              Mehr zu {app.name} <ArrowRight size={16} aria-hidden />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-[22px] bg-white p-6 sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="text-xl font-semibold">Probier es mit deinen eigenen Dateien.</p>
                <p className="mt-1 text-muted">Alle 13 Apps {TRIAL_DAYS} Tage kostenlos, ohne Zahlungsdaten.</p>
              </div>
              <DownloadButton source="software-mid" />
            </div>
          </div>
        </section>

        {/* Showcase */}
        <section className="px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-24">
            {showcase.map((s, i) => {
              const app = getApp(s.app);
              const shot = app && shotFor(app);
              return (
                <div key={s.title} className={`grid gap-10 lg:items-center ${i % 2 ? "lg:grid-cols-[1.2fr_0.8fr]" : "lg:grid-cols-[0.8fr_1.2fr]"}`}>
                  <div className={i % 2 ? "lg:order-2" : ""}>
                    <h2 className="display text-4xl sm:text-5xl">{s.title}</h2>
                    <p className="mt-5 text-lg leading-relaxed text-muted">{s.text}</p>
                  </div>
                  {shot && app && (
                    <figure className={`m-0 ${i % 2 ? "lg:order-1" : ""}`}>
                      <MacWindow src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 1024px) 100vw, 60vw" />
                      <figcaption className="mt-3 text-sm text-muted">{shot.caption}</figcaption>
                    </figure>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-surface px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Was du bekommst</p>
            <h2 className="display mt-3 max-w-3xl text-4xl sm:text-5xl md:text-6xl">Gebaut für deinen Computer, nicht für ein Abo-Dashboard.</h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-[22px] bg-white p-6">
                  <Icon size={24} className="text-accent" aria-hidden />
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Price comparison */}
        <section className="px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow">Preisvergleich</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">Was du im Jahr zahlst</h2>
            <div className="mt-10 grid gap-3 md:hidden">
              {compare.rows.map((r) => (
                <div key={r.label} className="rounded-[18px] border border-border p-4">
                  <p className="text-sm font-medium text-muted">{r.label}</p>
                  <dl className="mt-2 grid gap-1.5 text-[15px]">
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
            <div className="mt-10 hidden overflow-x-auto rounded-[22px] border border-border md:block">
              <table className="w-full text-left text-[15px]">
                <thead className="bg-surface text-sm">
                  <tr>
                    <th scope="col" className="p-4"></th>
                    {compare.columns.map((c, i) => (
                      <th key={c} scope="col" className={`p-4 font-semibold ${i === 0 ? "text-accent" : ""}`}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compare.rows.map((r) => (
                    <tr key={r.label} className="border-t border-border align-top">
                      <th scope="row" className="p-4 font-medium text-muted">{r.label}</th>
                      {r.values.map((v, i) => (
                        <td key={i} className={`p-4 ${i === 0 ? "font-semibold" : ""}`}>
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

        {/* Pricing */}
        <section id="preise" className="scroll-mt-16 bg-surface px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow">Preise</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl md:text-6xl">Erst testen. Dann entscheiden.</h2>
            <p className="mt-5 max-w-2xl text-lg text-muted">
              Nutze alle Apps {TRIAL_DAYS} Tage kostenlos. Danach bleibst du für {PLANS.monthly.label} im Monat und gehst, wann du willst,
              oder du zahlst einmal {PLANS.lifetime.label} und denkst nie wieder darüber nach.
            </p>
            <div className="mt-12">
              <PricingCards source="software-pricing" />
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow">Wer hinter Koja steht</p>
              <h2 className="display mt-3 text-4xl sm:text-5xl">Ein kleines Studio. Offener Code.</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Kojalytics ist ein Software-Studio aus Deutschland. Die Koja-Apps basieren auf quelloffener Software des
                ArtCraft-Teams. Wir liefern sie als signierte Apps für Mac und Windows aus, halten sie über den Kojalytics Launcher aktuell und
                beantworten deine E-Mails selbst. Die Apps sind frühe Versionen und werden laufend weiterentwickelt. Deshalb
                testest du alles {TRIAL_DAYS} Tage kostenlos, bevor du zahlst.
              </p>
              <ul className="mt-6 grid gap-2.5">
                {["Sichere Zahlung über Stripe", "Unternehmen mit Sitz in Hamburg"].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check size={18} strokeWidth={2.6} className="mt-1 shrink-0 text-success" aria-hidden />
                    {t}
                  </li>
                ))}
                <li className="flex gap-3">
                  <Check size={18} strokeWidth={2.6} className="mt-1 shrink-0 text-success" aria-hidden />
                  <span>
                    Support unter{" "}
                    <a href="mailto:support@kojalytics.com" className="underline underline-offset-4">
                      support@kojalytics.com
                    </a>
                  </span>
                </li>
              </ul>
              {showPlaceholders && (
                <div className="mt-8 rounded-[18px] border border-dashed border-accent p-5 text-sm text-accent">
                  [Platzhalter, nur in der Vorschau sichtbar] Hier 2–3 echte Kundenstimmen mit Name und Tätigkeit einsetzen. Keine
                  erfundenen Zitate.
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["grid-koja", "light-koja", "vector-koja", "deck-koja"].map((slug) => {
                const app = getApp(slug);
                const shot = app && shotFor(app);
                return shot && app ? (
                  <MacWindow key={slug} src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 1024px) 45vw, 25vw" fixedRatio />
                ) : null;
              })}
            </div>
          </div>
        </section>

        {/* Guides */}
        {ARTICLES.length > 0 && (
          <section className="border-t border-border px-5 py-20 md:px-6 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <h2 className="display text-4xl sm:text-5xl">Ratgeber zum Umstieg</h2>
                <Link href="/ratgeber" className="inline-flex items-center gap-1.5 font-semibold">
                  Alle Ratgeber <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {ARTICLES.slice(0, 3).map((a) => (
                  <Link key={a.slug} href={`/ratgeber/${a.slug}`} className="rounded-[22px] border border-border p-6 transition-colors hover:border-foreground/40">
                    <p className="text-sm text-muted">{a.readingMinutes} Min. Lesezeit</p>
                    <h3 className="mt-3 text-xl font-semibold leading-snug">{a.h1}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{a.metaDescription}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section id="fragen" className="bg-surface px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow">Fragen</p>
            <h2 className="display mb-10 mt-3 text-4xl sm:text-5xl">Bevor du lädst</h2>
            <Faq items={SOFTWARE_FAQ} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 py-24 md:px-6 md:py-32">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="flex -space-x-3">
              {APPS.slice(0, 7).map((a) => (
                <AppIcon key={a.slug} slug={a.slug} name={a.name} size={52} />
              ))}
            </div>
            <h2 className="display mt-8 text-5xl sm:text-6xl md:text-7xl">
              Dein Kreativ- und Büro-Paket für <span className="whitespace-nowrap">{PLANS.monthly.label}</span> im Monat.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-muted">13 Apps, {TRIAL_DAYS} Tage kostenlos, jederzeit online kündbar.</p>
            <div className="mt-8">
              <DownloadButton source="software-final-cta" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
