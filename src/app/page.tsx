import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/studio/ProjectCard";
import ContactCta from "@/components/studio/ContactCta";
import { APPS, appImage } from "@/lib/apps";
import { PROJECTS, SERVICES } from "@/lib/studio";
import { TRIAL_DAYS } from "@/lib/pricing";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Kojalytics: Software Studio for iOS, Web and Mac Apps" },
  description:
    "Kojalytics is a software studio from Germany. We build iOS apps, web platforms and AI features for clients, and make the Koja apps for Mac.",
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: "Kojalytics: software studio from Germany", images: [DEFAULT_OG_IMAGE] },
};

const teaserApps = APPS.slice(0, 6);

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-28 md:px-6 md:pt-36 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">Software studio · Germany</p>
            <h1 className="display mt-4 text-[clamp(3.25rem,9vw,7.5rem)]">
              Apps for clients.
              <br />
              <span className="text-highlight">Apps of our own.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80">
              Kojalytics designs and builds iOS apps, web platforms and AI features for companies and founders. We also make the
              Koja apps: 13 creative and office apps for Mac.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary text-base">
                Start a project
              </Link>
              <Link href="/software" className="btn-secondary text-base">
                See the Koja apps
              </Link>
            </div>
          </div>
          <div className="relative aspect-[16/11] overflow-hidden rounded-[18px] border border-border">
            <Image
              src="/studio/services.webp"
              alt="Developer desk at night with code on a monitor, an iPhone app and paper sketches of app screens"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Software teaser */}
        <section className="px-5 py-16 md:px-6 md:py-24">
          <Link
            href="/software"
            className="group mx-auto grid max-w-7xl overflow-hidden rounded-[24px] border border-border bg-surface transition-colors hover:border-accent/60 lg:grid-cols-2"
          >
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="eyebrow text-accent">New · Koja apps for Mac</p>
              <h2 className="display mt-4 text-5xl sm:text-6xl md:text-7xl">
                13 pro apps. <span className="text-highlight">€2.99 a month.</span>
              </h2>
              <p className="mt-5 max-w-md text-lg text-muted">
                Photo, video, design, audio, office and CAD. Offline, no account, cancel in one click. Free for {TRIAL_DAYS} days.
              </p>
              <span className="mt-8 inline-flex items-center gap-2 font-bold text-accent">
                Explore the apps <ArrowUpRight size={18} aria-hidden />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1">
              {teaserApps.map((a) => (
                <div key={a.slug} className="relative aspect-[4/5] overflow-hidden rounded-[12px]">
                  <Image src={appImage(a.slug)} alt={a.imageAlt} fill sizes="(max-width: 1024px) 33vw, 17vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[11px] font-bold">{a.name}</span>
                </div>
              ))}
            </div>
          </Link>
        </section>

        {/* Services */}
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Services</p>
              <h2 className="display mt-3 text-5xl sm:text-6xl md:text-7xl">
                From idea <span className="text-highlight">to App Store.</span>
              </h2>
            </div>
            <Link href="/services" className="inline-flex items-center gap-1.5 font-bold text-accent">
              All services <ArrowUpRight size={18} aria-hidden />
            </Link>
          </div>
          <div className="mt-12 divide-y divide-border border-y border-border">
            {SERVICES.map((s) => (
              <Link key={s.slug} href={`/services#${s.slug}`} className="group grid gap-2 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] md:items-center md:gap-10">
                <h3 className="display text-3xl group-hover:text-accent sm:text-4xl">{s.title}</h3>
                <p className="text-muted">{s.summary}</p>
                <ArrowUpRight size={22} className="hidden text-muted group-hover:text-accent md:block" aria-hidden />
              </Link>
            ))}
          </div>
        </section>

        {/* Work */}
        <section className="border-t border-border bg-surface/40 px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Selected work</p>
                <h2 className="display mt-3 text-5xl sm:text-6xl md:text-7xl">
                  Shipped, <span className="text-highlight">not just designed.</span>
                </h2>
              </div>
              <Link href="/work" className="inline-flex items-center gap-1.5 font-bold text-accent">
                All projects <ArrowUpRight size={18} aria-hidden />
              </Link>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {PROJECTS.map((p) => (
                <ProjectCard key={p.slug} project={p} sizes="(max-width: 768px) 100vw, 33vw" />
              ))}
            </div>
          </div>
        </section>

        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
