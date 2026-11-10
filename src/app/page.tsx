import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MacWindow from "@/components/ui/mac-window";
import AppIcon from "@/components/ui/app-icon";
import ProjectCard from "@/components/studio/ProjectCard";
import ContactCta from "@/components/studio/ContactCta";
import SectionBar from "@/components/instrument/SectionBar";
import { APPS, appInk, getApp, shotFor } from "@/lib/apps";
import { ARTICLES } from "@/lib/ratgeber";
import { PROJECTS, SERVICES } from "@/lib/studio";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";
import { DEFAULT_OG_IMAGE, OG_BASE, WEBSITE_JSON_LD, jsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Kojalytics: Mac- und Windows-Apps statt Abo und App-Entwicklung" },
  description:
    "Kojalytics ist ein Software-Studio aus Deutschland. Wir machen die Koja-Apps für Mac und Windows und entwickeln iOS-Apps, Web-Plattformen und KI-Funktionen.",
  alternates: { canonical: "/" },
  openGraph: { ...OG_BASE, url: "/", title: "Kojalytics: Software-Studio aus Deutschland", images: [DEFAULT_OG_IMAGE] },
};

/** The hero panel: one large window, two small ones below, each labelled like a figure. */
const heroShots = [
  { slug: "photo-koja", mark: "A", wide: true },
  { slug: "grid-koja", mark: "B", wide: false },
  { slug: "design-koja", mark: "C", wide: false },
];

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(WEBSITE_JSON_LD)} />
      <Navigation />
      <main className="pt-12">
        {/* 01 Hero: studio and Koja-Apps left, real screenshots as an instrument panel right */}
        <section className="rail">
          <SectionBar index="01" label="Software-Studio aus Deutschland" meta="Kundenprojekte · eigene Desktop-Apps" />
          <div className={`grid gap-12 py-14 md:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center ${pad}`}>
            <div>
              <h1 className="display rise-in text-[clamp(2.1rem,5.4vw,4.4rem)]">
                Wir bauen <span className="text-highlight">Apps</span>. <span className="whitespace-nowrap">Für Kunden</span> und für deinen Computer.
              </h1>
              <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:1]">
                Kojalytics entwickelt iOS-Apps, Web-Plattformen und KI-Funktionen für Unternehmen und Gründer. Und wir machen die
                Koja-Apps: 13 Apps für Kreativ- und Büroarbeit auf Mac und Windows, für {PLANS.monthly.label} im Monat.
              </p>
              <div className="rise-in mt-9 flex flex-col gap-3 [--i:2] sm:flex-row">
                <Link href="/software" className="btn-primary">
                  Koja-Apps entdecken <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
                </Link>
                <Link href="/kontakt" className="btn-secondary">
                  Projekt anfragen
                </Link>
              </div>
              <p className="hud rise-in mt-5 [--i:3]">iOS · Web · KI · 13 Desktop-Apps</p>
            </div>

            <figure className="rise-in m-0 border border-border [--i:2]">
              <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5">
                <span className="hud">
                  <span className="text-faint">Abb. 01</span> · Koja-Apps auf dem Mac
                </span>
                <span className="hud hidden text-faint sm:inline lg:hidden xl:inline">macOS</span>
              </div>
              <div className="cells grid-cols-2">
                {heroShots.map(({ slug, mark, wide }) => {
                  const app = getApp(slug);
                  const shot = app && shotFor(app);
                  if (!app || !shot) return null;
                  return (
                    <div key={slug} className={wide ? "col-span-2 p-4 sm:p-5" : "min-w-0 p-3 sm:p-4"}>
                      <p className="hud mb-3 truncate">
                        <span className="text-faint">{mark}</span>
                        <span className={wide ? "" : "hidden sm:inline lg:hidden xl:inline"}> · {app.kind}</span>
                      </p>
                      <MacWindow
                        src={shot.src}
                        alt={shot.alt}
                        width={shot.width}
                        height={shot.height}
                        label={app.name}
                        fixedRatio={!wide}
                        priority={wide}
                        sizes={wide ? "(max-width: 1024px) 92vw, 600px" : "(max-width: 1024px) 46vw, 300px"}
                      />
                    </div>
                  );
                })}
              </div>
              <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border px-4 py-2.5">
                <span className="hud whitespace-nowrap">13 Apps · offline · ohne Konto</span>
                <span className="hud whitespace-nowrap text-foreground">{PLANS.monthly.label} / Monat</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* 02 Koja-Apps */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Koja-Apps für Mac und Windows" meta="Offline · ohne Konto · jederzeit online kündbar" />
          <div className={`grid gap-6 py-14 md:py-20 lg:grid-cols-2 lg:items-end lg:gap-10 ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              13 Apps. <span className="whitespace-nowrap text-highlight">{PLANS.monthly.label}</span>{" "}
              <span className="whitespace-nowrap">im Monat.</span>
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-muted" data-reveal>
              Bildbearbeitung, Video, Layout, Audio, Office, PDF und CAD. Offline, ohne Konto, jederzeit online kündbar. Teste alle Apps{" "}
              {TRIAL_DAYS} Tage kostenlos oder zahle einmalig {PLANS.lifetime.label}.
            </p>
          </div>
          <ul className="cells grid-cols-2 border-t border-border sm:grid-cols-3 lg:grid-cols-4">
            {APPS.map((a, i) => (
              <li key={a.slug}>
                <Link
                  href={`/software/${a.slug}`}
                  prefetch={false}
                  data-reveal
                  style={{ ["--i" as string]: i % 4 }}
                  className="group flex h-full flex-col gap-6 p-4 transition-colors hover:bg-surface sm:p-6"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="transition-transform group-hover:-translate-y-0.5">
                      <AppIcon slug={a.slug} name={a.name} size={44} />
                    </span>
                    <span className="hud text-faint">{two(i + 1)}</span>
                  </span>
                  <span className="mt-auto block min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold">
                        {a.name.slice(0, -4)}
                        <span style={{ color: appInk(a.color) }}>Koja</span>
                      </span>
                      <ArrowUpRight size={14} className="shrink-0 text-faint transition-colors group-hover:text-accent" aria-hidden />
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-muted hyphens-auto">{a.kind}</span>
                  </span>
                </Link>
              </li>
            ))}
            <li className="sm:col-span-2 lg:col-span-3">
              <Link href="/software" data-reveal style={{ ["--i" as string]: 1 }} className="group flex h-full flex-col justify-between gap-6 p-4 transition-colors hover:bg-surface sm:p-6 lg:p-8">
                <span className="grid gap-1">
                  <span className="hud text-foreground">13 Apps · 1 Preis</span>
                  <span className="hud hidden sm:block">
                    {PLANS.monthly.label} / Monat · {PLANS.lifetime.label} einmalig
                  </span>
                </span>
                <span className="link-hud group-hover:text-accent">
                  Alle ansehen <ArrowUpRight size={14} aria-hidden />
                </span>
              </Link>
            </li>
          </ul>
        </section>

        {/* 03 Services */}
        <section className="rail crosshairs">
          <SectionBar index="03" label="Leistungen" meta="iOS · Web · KI · Design · Backend" />
          <div className={`flex flex-col justify-between gap-4 py-14 md:flex-row md:items-end md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Von der Idee bis in den <span className="whitespace-nowrap text-highlight">App Store</span>.
            </h2>
            <Link href="/leistungen" className="link-hud min-h-11 shrink-0">
              Alle Leistungen <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
          <ul className="cells border-t border-border">
            {SERVICES.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/leistungen#${s.slug}`}
                  data-reveal
                  style={{ ["--i" as string]: i }}
                  className={`group grid gap-3 py-6 transition-colors hover:bg-surface md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.25fr)_1.5rem] md:items-baseline md:gap-8 md:py-8 ${pad}`}
                >
                  <span className="hud text-faint">{two(i + 1)}</span>
                  <h3 className="display text-[1.35rem] transition-colors group-hover:text-accent md:text-[1.55rem]">{s.title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{s.summary}</p>
                  <ArrowUpRight size={16} className="hidden justify-self-end text-faint transition-colors group-hover:text-accent md:block" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 04 Projects */}
        <section className="rail crosshairs">
          <SectionBar index="04" label="Projekte" meta="macOS · Windows · iOS · Web · Shopify" />
          <div className={`flex flex-col justify-between gap-4 py-14 md:flex-row md:items-end md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              <span className="text-highlight">Ausgeliefert</span>, nicht nur entworfen.
            </h2>
            <Link href="/projekte" className="link-hud min-h-11 shrink-0">
              Alle Projekte <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
          <div className="cells border-t border-border md:grid-cols-3">
            {PROJECTS.map((p, i) => (
              <div key={p.slug}>
                <div className="h-full" data-reveal style={{ ["--i" as string]: i }}>
                  <ProjectCard project={p} sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 427px" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 05 Guides */}
        {ARTICLES.length > 0 && (
          <section className="rail crosshairs">
            <SectionBar index="05" label="Ratgeber" meta="Umstieg ohne Abo" />
            <div className={`flex flex-col justify-between gap-4 py-14 md:flex-row md:items-end md:py-20 ${pad}`}>
              <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
                Aus dem <span className="text-highlight">Ratgeber</span>
              </h2>
              <Link href="/ratgeber" className="link-hud min-h-11 shrink-0">
                Alle Ratgeber <ArrowUpRight size={14} aria-hidden />
              </Link>
            </div>
            <div className="cells border-t border-border md:grid-cols-3">
              {ARTICLES.slice(0, 3).map((a, i) => (
                <div key={a.slug}>
                  <Link href={`/ratgeber/${a.slug}`} className="group flex h-full flex-col p-6 md:p-8" data-reveal style={{ ["--i" as string]: i }}>
                    <p className="hud">
                      <span className="text-faint">{two(i + 1)}</span> · {a.readingMinutes} Min. Lesezeit
                    </p>
                    <h3 className="mt-5 flex-1 text-xl font-semibold leading-snug group-hover:text-accent">{a.h1}</h3>
                    <span className="link-hud mt-6 group-hover:text-accent">
                      Lesen <ArrowUpRight size={14} aria-hidden />
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
