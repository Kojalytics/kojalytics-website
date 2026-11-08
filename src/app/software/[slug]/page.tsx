import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Minus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RichText from "@/components/RichText";
import MacWindow from "@/components/ui/mac-window";
import AppIcon from "@/components/ui/app-icon";
import DownloadButton from "@/components/software/DownloadButton";
import PricingCards from "@/components/software/PricingCards";
import TrackView from "@/components/software/TrackView";
import Faq, { faqJsonLd } from "@/components/software/Faq";
import { APPS, getApp, shotFor } from "@/lib/apps";
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

      <main style={{ ["--app" as string]: app.color }}>
        {/* Hero */}
        <section className="bg-[linear-gradient(180deg,#f5f5f4_0%,#ffffff_100%)] px-5 pb-16 pt-24 md:px-6 md:pb-24 md:pt-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            {/* On phones the button comes straight after the h1, so it shows on the first screen. */}
            <div className="flex flex-col">
              <nav aria-label="Brotkrumen" className="flex gap-2 text-sm text-muted">
                <Link href="/software" className="hover:text-foreground">
                  Software
                </Link>
                <span aria-hidden>/</span>
                <span className="text-foreground">{app.name}</span>
              </nav>
              <div className="mt-6 flex items-center gap-3">
                <AppIcon slug={app.slug} name={app.name} size={56} priority />
                <div>
                  <p className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-[-0.03em]">{app.name}</p>
                  <p className="text-sm text-muted">{app.kind} für macOS</p>
                </div>
              </div>
              <h1 className="display mt-6 text-[clamp(2.3rem,4.4vw,3.75rem)]">{app.h1}</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted max-sm:order-1">{app.lead}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <DownloadButton source={`app-${app.slug}`} />
                <Link href="#preise" className="btn-secondary whitespace-nowrap">
                  Preise ansehen
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted">macOS · {TRIAL_DAYS} Tage kostenlos · ohne Konto · jederzeit online kündbar</p>
              <ul className="mt-6 flex flex-wrap gap-2 max-sm:order-2">
                {app.highlights.map((h) => (
                  <li key={h} className="rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            {hero && (
              <figure className="m-0">
                <MacWindow src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority sizes="(max-width: 1024px) 100vw, 55vw" />
                <figcaption className="mt-3 text-center text-sm text-muted">{hero.caption}</figcaption>
              </figure>
            )}
          </div>
        </section>

        {/* Features with screenshots */}
        <section className="px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow flex items-center gap-2">
              <span className="h-1.5 w-6 rounded-full" style={{ background: app.color }} aria-hidden />
              Funktionen
            </p>
            <h2 className="display mt-3 max-w-3xl text-4xl sm:text-5xl">
              Was du mit {app.name} machen kannst
            </h2>
            <div className="mt-14 grid gap-20">
              {featureRows.map((f, i) => {
                const shot = shotFor(app, f.screenshot);
                return (
                  <div key={f.title} className="grid gap-8 lg:grid-cols-2 lg:items-center">
                    <div className={i % 2 ? "lg:order-2" : ""}>
                      <h3 className="display text-3xl">{f.title}</h3>
                      <p className="mt-4 text-lg leading-relaxed text-muted">
                        <RichText text={f.text} />
                      </p>
                    </div>
                    {shot && (
                      <figure className={`m-0 ${i % 2 ? "lg:order-1" : ""}`}>
                        <MacWindow src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 1024px) 100vw, 50vw" />
                        <figcaption className="mt-3 text-sm text-muted">{shot.caption}</figcaption>
                      </figure>
                    )}
                  </div>
                );
              })}
            </div>
            {featureCards.length > 0 && (
              <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featureCards.map((f) => (
                  <div key={f.title} className="rounded-[20px] border border-border p-6">
                    <span className="block h-1.5 w-8 rounded-full" style={{ background: app.color }} aria-hidden />
                    <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">
                      <RichText text={f.text} />
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* More screenshots */}
        {gallery.length >= 2 && (
          <section className="bg-surface px-5 py-20 md:px-6 md:py-24" aria-labelledby="galerie">
            <div className="mx-auto max-w-7xl">
              <h2 id="galerie" className="display text-4xl sm:text-5xl">
                So sieht {app.name} aus
              </h2>
              <p className="mt-4 max-w-2xl text-muted">Bildschirmfotos der aktuellen Version. Die Oberfläche kann sich mit Updates noch ändern.</p>
              <div className={`mt-10 grid gap-8 md:grid-cols-2 ${gallery.length === 3 ? "lg:grid-cols-3" : ""}`}>
                {gallery.map((s) => (
                  <figure key={s.src} className="m-0">
                    <MacWindow src={s.src} alt={s.alt} width={s.width} height={s.height} sizes={gallery.length === 3 ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 50vw"} />
                    <figcaption className="mt-3 text-sm text-muted">{s.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Switching + comparison */}
        <section className="px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
            <div className="min-w-0">
              <h2 className="display text-4xl sm:text-5xl">{app.switching.title}</h2>
              <div className="prose-de mt-6">
                {app.switching.paragraphs.map((p) => (
                  <p key={p}>
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="display text-3xl sm:text-4xl">
                {app.name} und {app.familiar.product} im Vergleich
              </h2>
              <div className="mt-6 grid gap-3 sm:hidden">
                {app.comparison.rows.map((r) => (
                  <div key={r.label} className="rounded-[18px] border border-border p-4">
                    <p className="text-sm font-medium text-muted">{r.label}</p>
                    <dl className="mt-2 grid gap-1.5 text-[15px]">
                      <div>
                        <dt className="font-semibold">{app.name}</dt>
                        <dd>{r.koja}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">{app.familiar.product}</dt>
                        <dd>{r.other}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
              <div className="mt-6 hidden overflow-x-auto rounded-[18px] border border-border sm:block">
                <table className="w-full text-left text-[15px]">
                  <thead className="bg-surface text-sm">
                    <tr>
                      <th scope="col" className="p-4 font-semibold"></th>
                      <th scope="col" className="p-4 font-semibold">{app.name}</th>
                      <th scope="col" className="p-4 font-semibold">{app.familiar.product}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {app.comparison.rows.map((r) => (
                      <tr key={r.label} className="border-t border-border align-top">
                        <th scope="row" className="p-4 font-medium text-muted">{r.label}</th>
                        <td className="p-4">{r.koja}</td>
                        <td className="p-4">{r.other}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">{app.comparison.note}</p>
            </div>
          </div>
        </section>

        {/* Fit */}
        <section className="px-5 pb-20 md:px-6 md:pb-28">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
            <div className="rounded-[22px] bg-surface p-6 sm:p-8">
              <h2 className="text-xl font-semibold">Passt zu dir, wenn …</h2>
              <ul className="mt-5 grid gap-3">
                {app.forWho.map((w) => (
                  <li key={w} className="flex gap-3">
                    <Check size={18} strokeWidth={2.6} className="mt-1 shrink-0 text-success" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[22px] border border-border p-6 sm:p-8">
              <h2 className="text-xl font-semibold">Eher nicht, wenn …</h2>
              <ul className="mt-5 grid gap-3">
                {app.notFor.map((w) => (
                  <li key={w} className="flex gap-3 text-muted">
                    <Minus size={18} strokeWidth={2.6} className="mt-1 shrink-0" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            {app.formats.length > 0 && (
              <div className="rounded-[22px] border border-border p-6 sm:p-8 md:col-span-2">
                <h2 className="text-xl font-semibold">Dateiformate</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {app.formats.map((f) => (
                    <li key={f} className="rounded-full bg-surface px-3 py-1.5 text-sm">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Bundle */}
        <section className="border-t border-border px-5 py-20 md:px-6 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="display text-4xl sm:text-5xl">Plus 12 weitere Apps ohne Aufpreis</h2>
              <Link href="/software#apps" className="inline-flex items-center gap-1.5 font-semibold">
                Alle Apps ansehen <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/software/${o.slug}`} prefetch={false} className="flex items-center gap-3 rounded-[16px] border border-border p-3 transition-colors hover:border-foreground/40">
                    <AppIcon slug={o.slug} name={o.name} size={40} />
                    <span className="min-w-0">
                      <span className="block font-semibold">{o.name}</span>
                      <span className="block text-sm leading-snug text-muted hyphens-auto">{o.kind}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="preise" className="scroll-mt-20 bg-surface px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-5xl">
            <h2 className="display text-4xl sm:text-5xl">{app.name} und 12 weitere Apps. Ein Preis.</h2>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Teste alles {TRIAL_DAYS} Tage kostenlos. Danach <span className="whitespace-nowrap">{PLANS.monthly.label}</span> im Monat,
              jederzeit online kündbar, oder einmalig <span className="whitespace-nowrap">{PLANS.lifetime.label}</span>.
            </p>
            <div className="mt-12">
              <PricingCards source={`app-${app.slug}-pricing`} />
            </div>
          </div>
        </section>

        <section className="px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-4xl">
            <h2 className="display mb-10 text-4xl sm:text-5xl">Häufige Fragen zu {app.name}</h2>
            <Faq items={faq} />
            {guides.length > 0 && (
              <div className="mt-12">
                <p className="text-sm font-semibold">Passende Ratgeber</p>
                <ul className="mt-3 grid gap-2">
                  {guides.map((g) => (
                    <li key={g.slug}>
                      <Link href={`/ratgeber/${g.slug}`} className="text-accent underline underline-offset-4">
                        {g.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <section className="px-5 pb-20 md:px-6 md:pb-28">
          <div className="mx-auto flex max-w-4xl flex-col items-center rounded-[28px] bg-surface px-6 py-14 text-center sm:px-10">
            <AppIcon slug={app.slug} name={app.name} size={64} />
            <h2 className="display mt-6 text-4xl sm:text-5xl">
              {app.name} {TRIAL_DAYS} Tage kostenlos testen
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Mit deinen eigenen Dateien, ohne Zahlungsdaten. Danach <span className="whitespace-nowrap">{PLANS.monthly.label}</span> im Monat
              für alle 13 Apps oder einmalig <span className="whitespace-nowrap">{PLANS.lifetime.label}</span>.
            </p>
            <div className="mt-8">
              <DownloadButton source={`app-${app.slug}-final`} />
            </div>
          </div>
          <p className="mx-auto mt-12 max-w-4xl text-xs leading-relaxed text-muted">
            {app.familiar.product} ist eine Marke von {app.familiar.owner}
            {app.familiar.owner.endsWith(".") ? "" : "."} {app.name} steht in keiner Verbindung zu {app.familiar.owner} und wird von{" "}
            {app.familiar.owner} weder unterstützt noch empfohlen. {app.name} basiert auf quelloffener Software des ArtCraft-Teams.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
