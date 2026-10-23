import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DownloadButton from "@/components/software/DownloadButton";
import PricingCards from "@/components/software/PricingCards";
import TrackView from "@/components/software/TrackView";
import Faq, { faqJsonLd } from "@/components/software/Faq";
import { APPS, appImage, getApp } from "@/lib/apps";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";
import { SOFTWARE_FAQ } from "@/lib/software-faq";
import { SITE_URL, jsonLd } from "@/lib/site";

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
      title: `${app.name}: ${app.kind} for Mac`,
      description: app.metaDescription,
      url: `/software/${app.slug}`,
      images: [{ url: appImage(app.slug), width: 896, height: 1120, alt: app.imageAlt }],
    },
  };
}

export default async function AppPage({ params }: Props) {
  const app = getApp((await params).slug);
  if (!app) notFound();

  const others = APPS.filter((a) => a.slug !== app.slug);
  const faq = [...app.faq, SOFTWARE_FAQ[1], SOFTWARE_FAQ[2]];

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    applicationCategory: app.group === "Office" ? "BusinessApplication" : app.group === "Engineering" ? "DesignApplication" : "MultimediaApplication",
    operatingSystem: "macOS",
    url: `${SITE_URL}/software/${app.slug}`,
    image: `${SITE_URL}${appImage(app.slug)}`,
    description: app.metaDescription,
    publisher: { "@type": "Organization", name: "Kojalytics", url: SITE_URL },
    offers: [
      { "@type": "Offer", name: "Monthly, all 13 Koja apps", price: (PLANS.monthly.cents / 100).toFixed(2), priceCurrency: "EUR" },
      { "@type": "Offer", name: "Lifetime, all 13 Koja apps", price: (PLANS.lifetime.cents / 100).toFixed(2), priceCurrency: "EUR" },
    ],
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
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

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-28 md:px-6 md:pt-36 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <nav aria-label="Breadcrumb" className="eyebrow flex gap-2">
              <Link href="/software" className="hover:text-foreground">Software</Link>
              <span aria-hidden>/</span>
              <span className="text-accent">{app.name}</span>
            </nav>
            <h1 className="display mt-5 text-[clamp(2.75rem,7vw,5.5rem)]">{app.h1}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80">{app.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DownloadButton source={`app-${app.slug}`} />
              <Link href="#pricing" className="btn-secondary">
                {PLANS.monthly.label} / month · all 13 apps
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted">macOS · Free for {TRIAL_DAYS} days · Cancel in one click</p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-border">
            <Image src={appImage(app.slug)} alt={app.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-accent backdrop-blur">
              {app.kind}
            </span>
          </div>
        </section>

        <section className="border-t border-border bg-surface/40 px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">What {app.name} does</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl">
              {app.familiar ? (
                <>
                  A {app.familiar.product} alternative <span className="text-highlight">that feels familiar</span>
                </>
              ) : (
                <>
                  The essentials, <span className="text-highlight">where you expect them</span>
                </>
              )}
            </h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {app.features.map((f) => (
                <div key={f.title} className="rounded-[18px] border border-border bg-surface p-6">
                  <Check size={22} strokeWidth={3} className="text-accent" aria-hidden />
                  <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{f.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-14 grid gap-6 rounded-[18px] border border-border p-6 sm:p-8 md:grid-cols-[200px_1fr]">
              <h2 className="eyebrow text-foreground">Who it is for</h2>
              <p className="text-lg leading-relaxed">{app.forWho}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-28">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="display text-5xl sm:text-6xl">
              Plus 12 more apps. <span className="text-highlight">Same plan.</span>
            </h2>
            <Link href="/software#apps" className="inline-flex items-center gap-1.5 font-bold text-accent">
              See all apps <ArrowUpRight size={18} aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {others.map((o) => (
              <Link key={o.slug} href={`/software/${o.slug}`} className="group overflow-hidden rounded-[14px] border border-border bg-surface hover:border-accent/60">
                <div className="relative aspect-[4/5]">
                  <Image src={appImage(o.slug)} alt="" fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-[15px] font-extrabold">{o.name}</p>
                    <p className="text-xs text-muted">{o.kind}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 border-t border-border bg-surface/40 px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-5xl">
            <h2 className="display text-5xl sm:text-6xl">
              {app.name} and 12 more apps. <span className="text-highlight">One price.</span>
            </h2>
            <div className="mt-12">
              <PricingCards source={`app-${app.slug}-pricing`} />
            </div>
          </div>
        </section>

        <section className="px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-4xl">
            <h2 className="display mb-10 text-5xl sm:text-6xl">{app.name} questions</h2>
            <Faq items={faq} />
            {app.familiar && (
              <p className="mt-10 text-xs leading-relaxed text-muted">
                {app.familiar.product} is a trademark of {app.familiar.owner}. {app.name} is not affiliated with, sponsored or
                endorsed by {app.familiar.owner}. {app.name} is based on {app.upstream} by the ArtCraft team.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
