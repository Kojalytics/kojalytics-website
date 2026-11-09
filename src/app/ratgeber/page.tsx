import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AppIcon from "@/components/ui/app-icon";
import SectionBar from "@/components/instrument/SectionBar";
import { ARTICLES } from "@/lib/ratgeber";
import { getApp } from "@/lib/apps";
import { OG_BASE, SITE_URL, jsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ratgeber: Adobe- & Office-Alternativen am Mac",
  description:
    "Ehrliche Ratgeber zu Alternativen für Photoshop, Illustrator, InDesign, Word, Excel und Acrobat auf dem Mac. Mit Preisen, Vergleichen und Anleitungen.",
  alternates: { canonical: "/ratgeber" },
  openGraph: { ...OG_BASE, url: "/ratgeber", images: [{ url: "/og/kojalytics.jpg", width: 1200, height: 630, alt: "Kojalytics Ratgeber" }] },
};

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");
/** No line break between a number and its unit ("50 %", "79 €"). */
const keepUnits = (s: string) => s.replace(/ (%|€)/g, " $1");
const dateShort = (iso: string) => new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });

export default function RatgeberIndex() {
  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: ARTICLES.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/ratgeber/${a.slug}`, name: a.h1 })),
  };
  const sourceCount = ARTICLES.reduce((n, a) => n + a.sources.length, 0);
  const lastUpdated = ARTICLES.map((a) => a.updated).sort().at(-1);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(listJsonLd)} />
      <Navigation />
      <main className="pt-12">
        {/* 01 Hero */}
        <section className="rail">
          <SectionBar index="01" label="Raus aus dem Abo, rein in die Arbeit" meta={`${two(ARTICLES.length)} Ratgeber · Preise · Quellen`} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in max-w-5xl text-[clamp(2.1rem,5.4vw,4.6rem)]">
              Ratgeber: Adobe- und Office-Alternativen für den <span className="text-highlight">Mac</span>
            </h1>
            <p className="rise-in mt-6 max-w-2xl text-lg leading-relaxed text-muted [--i:1]">
              Ehrliche Anleitungen und Vergleiche für alle, die Adobe- oder Office-Programme auf dem Mac ersetzen wollen. Mit echten
              Preisen und Quellen, ohne Werbeversprechen.
            </p>
            <p className="hud rise-in mt-6 [--i:2]">
              {ARTICLES.length} Ratgeber · {sourceCount} Quellen
              {lastUpdated && (
                <>
                  {" "}
                  ·{" "}
                  <span className="whitespace-nowrap">
                    Aktualisiert <time dateTime={lastUpdated}>{dateShort(lastUpdated)}</time>
                  </span>
                </>
              )}
            </p>
          </div>
        </section>

        {/* 02 All guides */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Alle Ratgeber" meta="Anleitungen · Vergleiche · Preise" />
          <div className="cells md:grid-cols-2">
            {ARTICLES.map((a, i) => (
              <Link
                key={a.slug}
                href={`/ratgeber/${a.slug}`}
                className="group flex flex-col p-6 md:p-8"
                data-reveal
                style={{ ["--i" as string]: i % 2 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="hud text-faint">{two(i + 1)}</span>
                  <span className="hud text-right">
                    {a.readingMinutes} Min. Lesezeit · <time dateTime={a.updated}>{dateShort(a.updated)}</time>
                  </span>
                </div>
                <h2 className="mt-6 text-xl font-semibold leading-snug group-hover:text-accent md:text-[1.4rem]">{keepUnits(a.h1)}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{a.metaDescription}</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="flex -space-x-2">
                    {a.apps.slice(0, 4).map((slug) => {
                      const app = getApp(slug);
                      return app ? <AppIcon key={slug} slug={slug} name={app.name} size={36} /> : null;
                    })}
                  </div>
                  <span className="link-hud">
                    Lesen <ArrowUpRight size={14} aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
            {ARTICLES.length % 2 === 1 && <div className="hidden md:block" aria-hidden />}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
