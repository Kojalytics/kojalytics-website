import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AppIcon from "@/components/ui/app-icon";
import SectionBar from "@/components/instrument/SectionBar";
import { APPS } from "@/lib/apps";
import { WEB_APPS } from "@/lib/web-apps";
import { PLANS } from "@/lib/pricing";
import { OG_BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Koja-Apps im Browser testen – kostenlos, ohne Konto",
  description:
    "WordKoja, GridKoja, DeckKoja, PdfKoja und weitere Koja-Apps direkt im Browser ausprobieren. Kostenlos, ohne Konto, deine Dateien bleiben auf deinem Gerät.",
  alternates: { canonical: "/web" },
  openGraph: { ...OG_BASE, title: "Koja-Apps im Browser testen", url: "/web" },
};

const pad = "px-5 md:px-10";

export default function WebAppsPage() {
  const apps = APPS.filter((a) => WEB_APPS.includes(a.slug));
  return (
    <>
      <Navigation />
      <main className="pt-12">
        <section className="rail">
          <SectionBar index="01" label="Im Browser" meta="kostenlos · ohne Konto · ohne Installation" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display max-w-3xl text-[clamp(2rem,4.6vw,4rem)]">
              Koja-Apps im Browser <span className="text-highlight">testen</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Öffne eine App und leg los: kein Konto, keine Installation. Deine Dateien öffnest und speicherst du direkt auf deinem Gerät,
              nichts wird hochgeladen. Am besten am Computer in Chrome, Edge oder Safari.
            </p>

            <ul className="cells mt-12 grid-cols-1 border border-border sm:grid-cols-2 lg:grid-cols-5">
              {apps.map((app) => (
                <li key={app.slug}>
                  <a href={`/web/${app.slug}`} className="group flex h-full flex-col gap-4 p-6 transition-colors hover:bg-[#f6f6f4]">
                    <AppIcon slug={app.slug} name={app.name} size={56} />
                    <span>
                      <span className="display block text-xl">{app.name}</span>
                      <span className="mt-1 block text-sm text-muted">{app.kind}</span>
                    </span>
                    <span className="hud mt-auto flex items-center gap-1 text-foreground">
                      Im Browser öffnen <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <p className="text-[15px] leading-relaxed text-muted">
                <span className="text-foreground">Beim ersten Start</span> lädt die App einige Sekunden (rund 15–20 MB). Danach startet sie
                schneller.
              </p>
              <p className="text-[15px] leading-relaxed text-muted">
                <span className="text-foreground">Die Desktop-Version</span> läuft schneller, offline und mit allen Funktionen. Dazu gehören
                auch FilmKoja, EffectKoja und LightKoja.
              </p>
              <p className="text-[15px] leading-relaxed text-muted">
                <span className="text-foreground">Alle 13 Apps</span> für Mac und Windows bekommst du für einmal {PLANS.lifetime.label}, kein
                Abo.{" "}
                <Link href="/software#preise" className="text-foreground underline underline-offset-4">
                  Zu den Preisen
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
