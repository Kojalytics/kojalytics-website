import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RichText from "@/components/RichText";
import MacWindow from "@/components/ui/mac-window";
import AppIcon from "@/components/ui/app-icon";
import DownloadButton from "@/components/software/DownloadButton";
import PricingCards from "@/components/software/PricingCards";
import TrackView from "@/components/software/TrackView";
import Faq, { faqJsonLd } from "@/components/software/Faq";
import SectionBar from "@/components/instrument/SectionBar";
import { APPS, appInk, getApp, shotFor } from "@/lib/apps";
import { ARTICLES } from "@/lib/ratgeber";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";
import { SOFTWARE_FAQ } from "@/lib/software-faq";
import { OG_BASE, SITE_URL, jsonLd } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return APPS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const app = getApp((await params).slug);
  if (!app) return {};
  return {
    title: app.metaTitle,
    description: app.metaDescription,
    alternates: { canonical: `/software/${app.slug}` },
    openGraph: {
      ...OG_BASE,
      title: `${app.name}: ${app.kind} für den Mac`,
      description: app.metaDescription,
      url: `/software/${app.slug}`,
      images: [{ url: `/og/apps/${app.slug}.jpg`, width: 1200, height: 630, alt: `${app.name} auf dem Mac` }],
    },
  };
}

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

/** Short hyphenated words ("RAW-Fotos") stay on one line, so a headline never breaks after "RAW-". */
function keepShortCompounds(text: string) {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 && part.length <= 10 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** Headlines from the content files: the first occurrence of `word` becomes the one highlighted word, the text stays as written. */
function Highlight({ text, word }: { text: string; word: string }) {
  const i = text.indexOf(word);
  if (i < 0) return <>{keepShortCompounds(text)}</>;
  return (
    <>
      {keepShortCompounds(text.slice(0, i))}
      <span className="text-highlight">{word}</span>
      {keepShortCompounds(text.slice(i + word.length))}
    </>
  );
}

export default async function AppPage({ params }: Props) {
  const app = getApp((await params).slug);
  if (!app) notFound();

  const hero = app.shots[0];
  // Screenshots not already shown next to a feature.
  const used = new Set(app.features.map((f) => f.screenshot).filter(Boolean));
  const gallery = app.shots.slice(1).filter((s) => !used.has(s.src.split("/").pop()));
  const others = APPS.filter((a) => a.slug !== app.slug);
  const faq = [...app.faq, SOFTWARE_FAQ[1], SOFTWARE_FAQ[2]];
  const featureRows = app.features.filter((f) => f.screenshot);
  const featureCards = app.features.filter((f) => !f.screenshot);
  const guides = ARTICLES.filter((a) => a.apps.includes(app.slug)).slice(0, 3);
  const ink = appInk(app.color);

  // Section numbers run 01, 02, … down the page; the gallery only exists with two or more extra screenshots.
  const showGallery = gallery.length >= 2;
  const sections = ["hero", "features", ...(showGallery ? ["gallery"] : []), "switching", "fit", "apps", "pricing", "faq"];
  const num = (id: string) => two(sections.indexOf(id) + 1);
  // The last feature card fills the rest of its row, so the hairline grid never shows an empty cell.
  const n = featureCards.length;
  const lastCardSpan = `${n % 2 ? "sm:col-span-2" : ""} ${["lg:col-span-1", "lg:col-span-3", "lg:col-span-2"][n % 3]}`;

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    applicationCategory: app.slug === "cad-koja" ? "DesignApplication" : app.group === "Büro & Technik" ? "BusinessApplication" : "MultimediaApplication",
    operatingSystem: "macOS",
    inLanguage: "de",
    url: `${SITE_URL}/software/${app.slug}`,
    image: `${SITE_URL}/apps/${app.slug}/icon.webp`,
    screenshot: app.shots.map((s) => `${SITE_URL}${s.src}`),
    description: app.metaDescription,
    publisher: { "@type": "Organization", name: "Kojalytics", url: SITE_URL },
    offers: [
      { "@type": "Offer", name: "Monatlich, alle 13 Koja-Apps", price: (PLANS.monthly.cents / 100).toFixed(2), priceCurrency: "EUR", url: `${SITE_URL}/software/${app.slug}#preise`, availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "Dauerhaft, alle 13 Koja-Apps", price: (PLANS.lifetime.cents / 100).toFixed(2), priceCurrency: "EUR", url: `${SITE_URL}/software/${app.slug}#preise`, availability: "https://schema.org/InStock" },
    ],
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Software", item: `${SITE_URL}/software` },
      { "@type": "ListItem", position: 3, name: app.name, item: `${SITE_URL}/software/${app.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(appJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd(faq))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <TrackView name={app.slug} />
      <Navigation />

      <main className="pt-12" style={{ ["--app" as string]: app.color }}>
        {/* 01 Hero: name, headline and download left, the app's main screenshot right */}
        <section className="rail">
          <SectionBar index={num("hero")} label={app.kind} meta={`${app.name} · macOS · ${app.status}`} />
          <div className={`grid gap-12 py-14 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center ${pad}`}>
            {/* On phones the button comes straight after the h1, so it shows on the first screen. */}
            <div className="flex min-w-0 flex-col">
              <nav aria-label="Brotkrumen" className="hud rise-in flex items-center gap-2">
                <Link href="/software" className="-my-3.5 inline-flex min-h-11 items-center hover:text-foreground">
                  Software
                </Link>
                <span aria-hidden className="text-faint">
                  /
                </span>
                <span className="text-foreground">{app.name}</span>
              </nav>
              <div className="rise-in mt-7 flex items-center gap-4 [--i:1]">
                <AppIcon slug={app.slug} name={app.name} size={56} priority />
                <div className="min-w-0">
                  <p className="display text-[1.55rem]">
                    {app.name.slice(0, -4)}
                    <span style={{ color: ink }}>Koja</span>
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="hud">{app.kind} für macOS</span>
                    <span className="tag" style={{ color: ink, borderColor: `${ink}66` }}>
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="display rise-in mt-8 text-[clamp(2rem,5.4vw,3.15rem)] [--i:2] lg:text-[clamp(2rem,3.6vw,3.15rem)]">
                <Highlight text={app.h1} word="Mac" />
              </h1>
              <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:3] max-sm:order-1">{app.lead}</p>
              <div className="rise-in mt-9 flex flex-col gap-3 [--i:4] sm:flex-row">
                <DownloadButton source={`app-${app.slug}`} />
                <Link href="#preise" className="btn-secondary whitespace-nowrap">
                  Preise ansehen
                </Link>
              </div>
              <p className="hud rise-in mt-5 [--i:5]">macOS · {TRIAL_DAYS} Tage kostenlos · ohne Konto · jederzeit online kündbar</p>
              <ul className="rise-in mt-6 flex flex-wrap gap-2 [--i:6] max-sm:order-2" aria-label="Das Wichtigste">
                {app.highlights.map((h) => (
                  <li key={h} className="tag whitespace-normal text-foreground">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            {hero && (
              <figure className="rise-in m-0 min-w-0 [--i:3]">
                <MacWindow src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority sizes="(max-width: 1024px) 100vw, 55vw" label={app.name} />
                <figcaption className="mt-3 text-sm leading-relaxed text-muted">{hero.caption}</figcaption>
              </figure>
            )}
          </div>
        </section>

        {/* 02 Features: rows with screenshots, then the rest as a hairline grid */}
        <section className="rail crosshairs">
          <SectionBar index={num("features")} label="Funktionen" meta={`${app.features.length} Funktionen im Überblick`} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Was du mit {app.name} <span className="text-highlight">machen</span> kannst
            </h2>
          </div>
          {featureRows.length > 0 && (
            <div className="cells border-y border-border">
              {featureRows.map((f, i) => {
                const shot = shotFor(app, f.screenshot);
                return (
                  <div key={f.title} className={`grid gap-10 py-14 md:py-20 lg:grid-cols-2 lg:items-center ${pad}`} data-reveal>
                    <div className={`min-w-0 max-w-2xl ${i % 2 ? "lg:order-2" : ""}`}>
                      <p className="hud">
                        <span className="text-faint">{two(i + 1)}</span>
                        <span className="mx-2 text-faint">/</span>
                        {app.name}
                      </p>
                      <h3 className="display mt-4 break-words text-[clamp(1.5rem,3vw,2.5rem)]">{f.title}</h3>
                      <p className="mt-5 text-lg leading-relaxed text-muted">
                        <RichText text={f.text} />
                      </p>
                    </div>
                    {shot && (
                      <figure className={`m-0 min-w-0 ${i % 2 ? "lg:order-1" : ""}`}>
                        <MacWindow src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 1024px) 100vw, 50vw" label={app.name} />
                        <figcaption className="mt-3 text-sm leading-relaxed text-muted">{shot.caption}</figcaption>
                      </figure>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {featureCards.length > 0 && (
            <div className={`cells border-border sm:grid-cols-2 lg:grid-cols-3 ${featureRows.length > 0 ? "border-b" : "border-y"}`}>
              {featureCards.map((f, i) => (
                <div key={f.title} className={`p-6 md:p-8 ${i === n - 1 ? lastCardSpan : ""}`} data-reveal style={{ ["--i" as string]: i % 3 }}>
                  <span className="icon-box font-mono text-xs font-semibold" style={{ color: ink }}>
                    {two(featureRows.length + i + 1)}
                  </span>
                  <h3 className="display mt-6 text-[1.35rem]">{f.title}</h3>
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                    <RichText text={f.text} />
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 03 More screenshots */}
        {showGallery && (
          <section className="rail crosshairs" aria-labelledby="galerie">
            <SectionBar index={num("gallery")} label="Bildschirmfotos" meta="Aktuelle Version" />
            <div className={`py-14 md:py-20 ${pad}`}>
              <h2 id="galerie" className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
                So sieht <span className="text-highlight">{app.name}</span> aus
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted" data-reveal>
                Bildschirmfotos der aktuellen Version. Die Oberfläche kann sich mit Updates noch ändern.
              </p>
            </div>
            <div className={`cells border-y border-border ${gallery.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {gallery.map((s, i) => (
                <figure
                  key={s.src}
                  className={`m-0 min-w-0 p-5 md:p-8 ${gallery.length % 2 && gallery.length !== 3 && i === gallery.length - 1 ? "md:col-span-2" : ""}`}
                  data-reveal
                  style={{ ["--i" as string]: i % 3 }}
                >
                  <MacWindow src={s.src} alt={s.alt} width={s.width} height={s.height} sizes={gallery.length === 3 ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 50vw"} label={app.name} />
                  <figcaption className="mt-3 text-sm leading-relaxed text-muted">{s.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* 04 Switching + comparison */}
        <section className="rail crosshairs">
          <SectionBar index={num("switching")} label="Umstieg" meta={`Von ${app.familiar.product} zu ${app.name}`} />
          <div className={`grid gap-14 py-14 md:py-20 lg:grid-cols-2 ${pad}`}>
            <div className="min-w-0 max-w-2xl" data-reveal>
              <h2 className="display text-[clamp(1.8rem,3.4vw,2.8rem)]">
                <Highlight text={app.switching.title} word={app.name} />
              </h2>
              <div className="prose-de mt-6">
                {app.switching.paragraphs.map((p) => (
                  <p key={p}>
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            </div>
            <div className="min-w-0" data-reveal>
              <h2 className="display text-[clamp(1.5rem,2.4vw,2rem)]">
                {app.name} und {app.familiar.product} im Vergleich
              </h2>
              <div className="mt-6 grid gap-3 sm:hidden">
                {app.comparison.rows.map((r) => (
                  <div key={r.label} className="border border-border p-4">
                    <p className="hud">{r.label}</p>
                    <dl className="mt-3 grid gap-2 text-[15px]">
                      <div>
                        <dt className="font-semibold text-accent">{app.name}</dt>
                        <dd className="font-semibold">{r.koja}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">{app.familiar.product}</dt>
                        <dd>{r.other}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
              <div className="mt-6 hidden overflow-x-auto border border-border sm:block">
                <table className="w-full text-left text-[15px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className="p-4"></th>
                      <th scope="col" className="hud border-l border-border p-4 !text-accent">
                        {app.name}
                      </th>
                      <th scope="col" className="hud border-l border-border p-4 !text-foreground">
                        {app.familiar.product}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {app.comparison.rows.map((r) => (
                      <tr key={r.label} className="border-t border-border align-top first:border-t-0">
                        <th scope="row" className="p-4 font-medium text-muted">
                          {r.label}
                        </th>
                        <td className="border-l border-border bg-[#f4f7fd] p-4 font-semibold">{r.koja}</td>
                        <td className="border-l border-border p-4">{r.other}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">{app.comparison.note}</p>
            </div>
          </div>
        </section>

        {/* 05 Fit */}
        <section className="rail crosshairs">
          <SectionBar index={num("fit")} label="Für wen" meta="Ehrlich vorab" />
          <div className="cells border-b border-border md:grid-cols-2">
            <div className="p-6 md:p-8" data-reveal>
              <p className="hud">
                <span className="text-faint">01</span>
              </p>
              <h2 className="display mt-5 text-[1.35rem]">Passt zu dir, wenn …</h2>
              <ul className="mt-6 grid gap-3">
                {app.forWho.map((w) => (
                  <li key={w} className="flex gap-3 leading-relaxed">
                    <Check size={18} strokeWidth={2.4} className="mt-1 shrink-0 text-success" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 md:p-8" data-reveal style={{ ["--i" as string]: 1 }}>
              <p className="hud">
                <span className="text-faint">02</span>
              </p>
              <h2 className="display mt-5 text-[1.35rem]">Eher nicht, wenn …</h2>
              <ul className="mt-6 grid gap-3">
                {app.notFor.map((w) => (
                  <li key={w} className="flex gap-3 leading-relaxed text-muted">
                    <Minus size={18} strokeWidth={2.4} className="mt-1 shrink-0" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            {app.formats.length > 0 && (
              <div className="p-6 md:col-span-2 md:p-8" data-reveal>
                <p className="hud">
                  <span className="text-faint">03</span>
                </p>
                <h2 className="display mt-5 text-[1.35rem]">Dateiformate</h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {app.formats.map((f) => (
                    <li key={f} className="tag whitespace-normal text-[12.5px] normal-case tracking-[0.02em] text-foreground">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* 06 The other 12 apps */}
        <section className="rail crosshairs">
          <SectionBar index={num("apps")} label="Im Paket" meta="13 Apps · 1 Preis" />
          <div className={`flex flex-col justify-between gap-6 py-14 md:flex-row md:items-end md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Plus 12 weitere Apps <span className="text-highlight">ohne</span> Aufpreis
            </h2>
            <Link href="/software#apps" className="link-hud -my-3.5 min-h-11 shrink-0">
              Alle Apps ansehen <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
          <ul className="cells border-y border-border grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {others.map((o, i) => (
              <li key={o.slug} data-reveal style={{ ["--i" as string]: i % 4 }}>
                <Link
                  href={`/software/${o.slug}`}
                  prefetch={false}
                  className="group flex h-full flex-col items-start gap-3 p-4 transition-colors hover:bg-surface md:flex-row md:items-center md:p-5"
                >
                  <span className="transition-transform group-hover:-translate-y-0.5">
                    <AppIcon slug={o.slug} name={o.name} size={40} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">
                      {o.name.slice(0, -4)}
                      <span style={{ color: appInk(o.color) }}>Koja</span>
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted hyphens-auto">{o.kind}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 07 Pricing */}
        <section id="preise" className="rail crosshairs scroll-mt-12">
          <SectionBar index={num("pricing")} label="Preise" meta={`${TRIAL_DAYS} Tage kostenlos · dann monatlich oder einmalig`} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-4xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              {app.name} und 12 weitere Apps. Ein <span className="text-highlight">Preis</span>.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted" data-reveal>
              Teste alles {TRIAL_DAYS} Tage kostenlos. Danach <span className="whitespace-nowrap">{PLANS.monthly.label}</span> im Monat,
              jederzeit online kündbar, oder einmalig <span className="whitespace-nowrap">{PLANS.lifetime.label}</span>.
            </p>
            <div className="mt-12">
              <PricingCards source={`app-${app.slug}-pricing`} />
            </div>
          </div>
        </section>

        {/* 08 FAQ */}
        <section className="rail crosshairs">
          <SectionBar index={num("faq")} label="Fragen" meta={`Zu ${app.name}`} />
          <div className={`grid gap-10 py-14 md:py-20 lg:grid-cols-[0.8fr_1.2fr] ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Häufige <span className="text-highlight">Fragen</span> zu {app.name}
            </h2>
            <div className="min-w-0">
              <Faq items={faq} />
              {guides.length > 0 && (
                <div className="mt-12" data-reveal>
                  <p className="hud">Passende Ratgeber</p>
                  <ul className="mt-4 divide-y divide-border border-y border-border">
                    {guides.map((g) => (
                      <li key={g.slug}>
                        <Link href={`/ratgeber/${g.slug}`} className="group flex items-start justify-between gap-4 py-4 font-semibold leading-snug hover:text-accent">
                          {g.h1}
                          <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-muted group-hover:text-accent" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Final CTA + trademark note */}
        <section className="rail crosshairs border-t border-border">
          <div className={`flex flex-col items-center py-20 text-center md:py-28 ${pad}`}>
            <p className="hud">
              {app.kind} · macOS · {app.status}
            </p>
            <div className="mt-8">
              <AppIcon slug={app.slug} name={app.name} size={64} />
            </div>
            <h2 className="display mt-8 max-w-4xl text-[clamp(2.2rem,5vw,4.4rem)]" data-reveal>
              {app.name} {TRIAL_DAYS} Tage <span className="text-highlight">kostenlos</span> testen
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Mit deinen eigenen Dateien, ohne Zahlungsdaten. Danach <span className="whitespace-nowrap">{PLANS.monthly.label}</span> im Monat
              für alle 13 Apps oder einmalig <span className="whitespace-nowrap">{PLANS.lifetime.label}</span>.
            </p>
            <div className="mt-9">
              <DownloadButton source={`app-${app.slug}-final`} />
            </div>
          </div>
          <div className={`border-t border-border py-8 ${pad}`}>
            <p className="max-w-4xl text-xs leading-relaxed text-muted">
              {app.familiar.product} ist eine Marke von {app.familiar.owner}
              {app.familiar.owner.endsWith(".") ? "" : "."} {app.name} steht in keiner Verbindung zu {app.familiar.owner} und wird von{" "}
              {app.familiar.owner} weder unterstützt noch empfohlen. {app.name} basiert auf quelloffener Software des ArtCraft-Teams.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
