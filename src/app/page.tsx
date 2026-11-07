import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MacWindow from "@/components/ui/mac-window";
import AppIcon from "@/components/ui/app-icon";
import ProjectCard from "@/components/studio/ProjectCard";
import ContactCta from "@/components/studio/ContactCta";
import { APPS, getApp, shotFor } from "@/lib/apps";
import { ARTICLES } from "@/lib/ratgeber";
import { PROJECTS, SERVICES } from "@/lib/studio";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Kojalytics: Mac-Apps statt Abo und App-Entwicklung" },
  description:
    "Kojalytics ist ein Software-Studio aus Deutschland. Wir machen die Koja-Apps für den Mac und entwickeln iOS-Apps, Web-Plattformen und KI-Funktionen.",
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: "Kojalytics: Software-Studio aus Deutschland", images: [DEFAULT_OG_IMAGE] },
};

function Shot({ slug, className, priority = false, sizes }: { slug: string; className?: string; priority?: boolean; sizes: string }) {
  const app = getApp(slug);
  const shot = app && shotFor(app);
  if (!shot) return null;
  return <MacWindow src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} priority={priority} sizes={sizes} className={className} />;
}

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="overflow-hidden bg-[linear-gradient(180deg,#f5f5f4_0%,#ffffff_100%)] px-5 pb-20 pt-28 md:px-6 md:pt-36">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="rounded-full border border-border bg-white px-3 py-1 text-sm font-medium text-muted w-fit">Software-Studio aus Deutschland</p>
              <h1 className="display mt-6 text-[clamp(2.75rem,6.5vw,5.25rem)]">Wir bauen Apps. Für Kunden und für deinen Mac.</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Kojalytics entwickelt iOS-Apps, Web-Plattformen und KI-Funktionen für Unternehmen und Gründer. Und wir machen die
                Koja-Apps: 13 Mac-Apps für Kreativ- und Büroarbeit, für {PLANS.monthly.label} im Monat.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/software" className="btn-primary text-base">
                  Koja-Apps entdecken <ArrowRight size={18} aria-hidden />
                </Link>
                <Link href="/kontakt" className="btn-secondary text-base">
                  Projekt anfragen
                </Link>
              </div>
            </div>
            <div className="relative">
              <Shot slug="photo-koja" priority sizes="(max-width: 1024px) 92vw, 50vw" className="relative z-10" />
              <Shot slug="grid-koja" sizes="(max-width: 1024px) 50vw, 26vw" className="absolute -bottom-10 -left-6 z-20 hidden w-[46%] sm:block" />
              <Shot slug="film-koja" sizes="(max-width: 1024px) 50vw, 26vw" className="absolute -right-6 -top-8 z-0 hidden w-[44%] sm:block" />
            </div>
          </div>
        </section>

        {/* Koja apps */}
        <section className="px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
              <div>
                <p className="eyebrow">Koja-Apps für den Mac</p>
                <h2 className="display mt-3 text-4xl sm:text-5xl md:text-6xl">13 Profi-Apps. {PLANS.monthly.label} im Monat.</h2>
              </div>
              <p className="text-lg leading-relaxed text-muted">
                Bildbearbeitung, Video, Layout, Audio, Office, PDF und CAD. Offline, ohne Konto, mit einem Klick kündbar. Teste alle Apps{" "}
                {TRIAL_DAYS} Tage kostenlos oder zahle einmalig {PLANS.lifetime.label}.
              </p>
            </div>
            <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {APPS.map((a) => (
                <li key={a.slug}>
                  <Link href={`/software/${a.slug}`} className="flex h-full items-center gap-3 rounded-[16px] border border-border p-3 transition-colors hover:border-foreground/40">
                    <AppIcon slug={a.slug} name={a.name} size={40} />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{a.name}</span>
                      <span className="block truncate text-sm text-muted">{a.kind}</span>
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/software" className="flex h-full items-center justify-center gap-2 rounded-[16px] bg-foreground p-3 font-semibold text-white">
                  Alle ansehen <ArrowRight size={16} aria-hidden />
                </Link>
              </li>
            </ul>
          </div>
        </section>

        {/* Services */}
        <section className="bg-surface px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Leistungen</p>
                <h2 className="display mt-3 text-4xl sm:text-5xl md:text-6xl">Von der Idee bis in den App Store.</h2>
              </div>
              <Link href="/leistungen" className="inline-flex items-center gap-1.5 font-semibold">
                Alle Leistungen <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {SERVICES.map((s) => (
                <Link key={s.slug} href={`/leistungen#${s.slug}`} className="rounded-[22px] bg-white p-6 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(17,17,19,0.3)]">
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Work */}
        <section className="px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Projekte</p>
                <h2 className="display mt-3 text-4xl sm:text-5xl md:text-6xl">Ausgeliefert, nicht nur entworfen.</h2>
              </div>
              <Link href="/projekte" className="inline-flex items-center gap-1.5 font-semibold">
                Alle Projekte <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {PROJECTS.map((p) => (
                <ProjectCard key={p.slug} project={p} sizes="(max-width: 768px) 100vw, 33vw" />
              ))}
            </div>
          </div>
        </section>

        {/* Guides */}
        {ARTICLES.length > 0 && (
          <section className="border-t border-border px-5 py-20 md:px-6 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <h2 className="display text-4xl sm:text-5xl">Aus dem Ratgeber</h2>
                <Link href="/ratgeber" className="inline-flex items-center gap-1.5 font-semibold">
                  Alle Ratgeber <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {ARTICLES.slice(0, 3).map((a) => (
                  <Link key={a.slug} href={`/ratgeber/${a.slug}`} className="rounded-[22px] border border-border p-6 transition-colors hover:border-foreground/40">
                    <p className="text-sm text-muted">{a.readingMinutes} Min. Lesezeit</p>
                    <h3 className="mt-3 text-xl font-semibold leading-snug">{a.h1}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
