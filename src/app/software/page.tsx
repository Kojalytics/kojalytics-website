import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CloudOff, FileText, Lock, MousePointerClick, ShieldCheck, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
import DownloadButton from "@/components/software/DownloadButton";
import PricingCards from "@/components/software/PricingCards";
import TrackView from "@/components/software/TrackView";
import Faq, { faqJsonLd } from "@/components/software/Faq";
import { APPS, APP_GROUPS, appImage } from "@/lib/apps";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";
import { SOFTWARE_FAQ } from "@/lib/software-faq";
import { SITE_URL, jsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: "Koja Apps: 13 Creative and Office Apps for Mac, €2.99",
  description:
    "Photo, video, design, audio, office and CAD apps for Mac. Offline, no account. €2.99 a month, cancel in one click, or €79 once. Try free for 3 days.",
  alternates: { canonical: "/software" },
  openGraph: {
    title: "13 pro apps for Mac. €2.99 a month. Cancel in one click.",
    description: "Photo, video, design, audio, office and CAD apps that run offline. Try all of them free for 3 days.",
    url: "/software",
    images: [{ url: "/software/og-software.jpg", width: 1200, height: 630, alt: "A creative workshop at night with photo, video and audio apps on several screens" }],
  },
};

const problems = [
  {
    pain: "Monthly bills that never stop, and a fee if you leave early.",
    fix: "€2.99 a month and one click to cancel. Or pay €79 once and keep it.",
  },
  {
    pain: "An account, a cloud and a login screen before you can open a file.",
    fix: "Native Mac apps that start offline. No account, no upload.",
  },
  {
    pain: "Learning a new tool from scratch when a deadline is due.",
    fix: "Layers, timelines, ribbons and shortcuts where your hands expect them.",
  },
];

const benefits = [
  { icon: Zap, title: "Native on your Mac", text: "Real Mac apps that start fast and keep working without internet." },
  { icon: FileText, title: "Your files just open", text: ".docx, .xlsx, .pptx and PDF from colleagues and clients open as they are." },
  { icon: CloudOff, title: "No account, no cloud", text: "Nothing to sign up for. Your work never leaves your computer." },
  { icon: MousePointerClick, title: "Cancel in one click", text: "On our website, without a fee, a form letter or a phone call." },
  { icon: Lock, title: "Open-source core", text: "Built on open code (MIT / Apache-2.0) that anyone can inspect." },
  { icon: ShieldCheck, title: "A real company behind it", text: "Kojalytics, a software studio in Germany. GDPR, Impressum, support by email." },
];

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Koja apps",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "macOS",
  url: `${SITE_URL}/software`,
  image: `${SITE_URL}/software/og-software.jpg`,
  description: "13 creative and office apps for Mac: photo, RAW, vector, layout, interface design, video, motion graphics, audio, word processing, spreadsheets, presentations, PDF and CAD.",
  publisher: { "@type": "Organization", name: "Kojalytics", url: SITE_URL },
  offers: [
    {
      "@type": "Offer",
      name: "Monthly",
      price: (PLANS.monthly.cents / 100).toFixed(2),
      priceCurrency: "EUR",
      priceSpecification: { "@type": "UnitPriceSpecification", price: (PLANS.monthly.cents / 100).toFixed(2), priceCurrency: "EUR", billingDuration: "P1M", unitCode: "MON" },
    },
    { "@type": "Offer", name: "Lifetime", price: (PLANS.lifetime.cents / 100).toFixed(2), priceCurrency: "EUR" },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Software", item: `${SITE_URL}/software` },
  ],
};

const tunnelItems = APPS.map((a) => ({ src: appImage(a.slug), alt: a.imageAlt, label: `${a.name} · ${a.kind}` }));

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
            <p className="eyebrow text-accent">Koja apps for Mac</p>
            <h1 className="display mt-4 text-[clamp(2.75rem,10vw,6.25rem)]">
              13 pro apps.
              <br />
              <span className="text-highlight">€2.99</span> a month.
              <br />
              Cancel in one click.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.9)] sm:text-lg">
              Edit photos, lay out pages, cut video, mix audio and write documents in native Mac apps that run offline,
              without an account. Try every app free for {TRIAL_DAYS} days.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <DownloadButton source="software-hero" />
              <Link href="#pricing" className="btn-secondary">
                See pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted">macOS · No card to start · Or €79 once, yours for life</p>
          </div>
        </PerspectiveTunnelHero>

        {/* Problem → solution */}
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-6 md:py-32">
          <p className="eyebrow">Why people switch</p>
          <h2 className="display mt-3 max-w-4xl text-5xl sm:text-6xl md:text-7xl">
            You wanted to make things. <span className="text-highlight">Not manage subscriptions.</span>
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[18px] border border-border bg-border">
            {problems.map((p) => (
              <div key={p.pain} className="grid gap-4 bg-background p-6 sm:p-8 md:grid-cols-2 md:gap-10">
                <p className="text-lg text-muted line-through decoration-muted/50">{p.pain}</p>
                <p className="flex items-start gap-3 text-lg font-semibold">
                  <ArrowRight className="mt-1 shrink-0 text-accent" size={20} aria-hidden />
                  {p.fix}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* App gallery */}
        <section id="apps" className="border-t border-border bg-surface/40 px-5 py-24 md:px-6 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">The apps</p>
                <h2 className="display mt-3 text-5xl sm:text-6xl md:text-7xl">
                  Thirteen apps. <span className="text-highlight">One plan.</span>
                </h2>
              </div>
              <p className="max-w-md text-muted">
                Everything from a quick PDF to a finished film. Install only the apps you need; they all come with the same plan.
              </p>
            </div>

            {APP_GROUPS.map((group) => {
              const apps = APPS.filter((a) => a.group === group);
              return (
                <div key={group} className="mt-16">
                  <h3 className="eyebrow mb-5 text-foreground">{group}</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {apps.map((app, i) => (
                      <Link
                        key={app.slug}
                        href={`/software/${app.slug}`}
                        className={`group relative overflow-hidden rounded-[18px] border border-border bg-surface transition-colors hover:border-accent/60 ${
                          i === 0 && apps.length > 3 ? "lg:col-span-2 lg:row-span-2" : ""
                        }`}
                      >
                        <div className={`relative ${i === 0 && apps.length > 3 ? "aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[640px]" : "aspect-[4/5]"}`}>
                          <Image
                            src={appImage(app.slug)}
                            alt={app.imageAlt}
                            fill
                            sizes={i === 0 && apps.length > 3 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-6">
                            <p className="eyebrow text-accent">{app.kind}</p>
                            <p className="display mt-2 text-4xl sm:text-5xl">{app.name}</p>
                            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-foreground/80">{app.benefit}</p>
                            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-accent">
                              Explore {app.name} <ArrowUpRight size={16} aria-hidden />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits */}
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-6 md:py-32">
          <p className="eyebrow">What you get</p>
          <h2 className="display mt-3 max-w-4xl text-5xl sm:text-6xl md:text-7xl">
            Built for your Mac. <span className="text-highlight">Not for a subscription dashboard.</span>
          </h2>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-[18px] border border-border bg-surface p-6">
                <Icon size={24} className="text-accent" aria-hidden />
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 border-t border-border bg-surface/40 px-5 py-24 md:px-6 md:py-32">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow">Pricing</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl md:text-7xl">
              Try free. <span className="text-highlight">Then pick a plan.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-muted">
              Use every app free for {TRIAL_DAYS} days. Then stay for €2.99 a month and leave whenever you want, or pay €79 once and
              never think about it again.
            </p>
            <div className="mt-12">
              <PricingCards source="software-pricing" />
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-6 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] border border-border">
              <Image
                src="/software/hero.webp"
                alt="A creative workshop at night with photo, video, vector and audio work on several monitors"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="eyebrow">Who is behind Koja</p>
              <h2 className="display mt-3 text-5xl sm:text-6xl">
                A small studio. <span className="text-highlight">Open code.</span>
              </h2>
              <p className="mt-6 leading-relaxed text-muted">
                Kojalytics is a software studio from Germany. The Koja apps are built on the open-source Craft apps by the
                ArtCraft team. We package them as signed Mac apps, keep them updated through the Kojalytics Launcher and
                answer your emails ourselves.
              </p>
              <ul className="mt-6 grid gap-2 text-[15px]">
                <li>Secure payment with Stripe</li>
                <li>GDPR-compliant, company based in Germany</li>
                <li>Support at support@kojalytics.com</li>
              </ul>
              {showPlaceholders && (
                <div className="mt-8 rounded-[18px] border border-dashed border-accent/60 p-5 text-sm text-accent">
                  [Placeholder, preview only] Add 2–3 real customer quotes with name and role here. Do not invent quotes.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-border px-5 py-24 md:px-6 md:py-32">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow">Questions</p>
            <h2 className="display mt-3 mb-10 text-5xl sm:text-6xl">Before you download</h2>
            <Faq items={SOFTWARE_FAQ} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden border-t border-border px-5 py-28 md:px-6 md:py-36">
          <Image src="/software/effect-koja.webp" alt="" fill sizes="100vw" className="object-cover opacity-25" />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <h2 className="display text-6xl sm:text-7xl md:text-8xl">
              Your whole studio <span className="text-highlight">for €2.99.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg text-foreground/80">
              13 apps, free for {TRIAL_DAYS} days, cancel in one click.
            </p>
            <div className="mt-8">
              <DownloadButton source="software-footer-cta" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
