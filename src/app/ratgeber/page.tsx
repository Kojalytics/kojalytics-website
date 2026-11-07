import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AppIcon from "@/components/ui/app-icon";
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

export default function RatgeberIndex() {
  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: ARTICLES.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/ratgeber/${a.slug}`, name: a.h1 })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(listJsonLd)} />
      <Navigation />
      <main className="px-5 pb-24 pt-24 md:px-6 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Raus aus dem Abo, rein in die Arbeit</p>
          <h1 className="display mt-3 max-w-4xl text-[clamp(2.5rem,6vw,4.75rem)]">Ratgeber: Adobe- und Office-Alternativen für den Mac</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Ehrliche Anleitungen und Vergleiche für alle, die Adobe- oder Office-Programme auf dem Mac ersetzen wollen. Mit echten
            Preisen und Quellen, ohne Werbeversprechen.
          </p>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((a) => (
              <Link key={a.slug} href={`/ratgeber/${a.slug}`} className="flex flex-col rounded-[22px] border border-border p-6 transition-colors hover:border-foreground/40">
                <div className="flex -space-x-2">
                  {a.apps.slice(0, 4).map((slug) => {
                    const app = getApp(slug);
                    return app ? <AppIcon key={slug} slug={slug} name={app.name} size={36} /> : null;
                  })}
                </div>
                <h2 className="mt-5 text-xl font-semibold leading-snug">{a.h1}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{a.metaDescription}</p>
                <p className="mt-5 text-sm text-muted">{a.readingMinutes} Min. Lesezeit</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
