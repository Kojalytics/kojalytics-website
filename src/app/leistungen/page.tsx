import type { Metadata } from "next";
import { Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactCta from "@/components/studio/ContactCta";
import SectionBar from "@/components/instrument/SectionBar";
import { SERVICES } from "@/lib/studio";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "App-Entwicklung aus Deutschland: iOS, Web und KI",
  description:
    "Kojalytics entwickelt iOS-Apps, Web-Apps mit Next.js, KI-Funktionen und Backends für Unternehmen und Gründer. Ein kleines Software-Studio aus Deutschland.",
  alternates: { canonical: "/leistungen" },
  openGraph: { ...OG_BASE, url: "/leistungen", images: [DEFAULT_OG_IMAGE] },
};

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Hero */}
        <section className="rail">
          <SectionBar index="01" label="Leistungen" meta="Skizze → Release → Updates" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in max-w-4xl text-[clamp(2.1rem,5.4vw,4.6rem)]">
              App-Entwicklung vom ersten Entwurf bis zum <span className="text-highlight">Release</span>.
            </h1>
            <p className="rise-in mt-6 max-w-2xl text-lg leading-relaxed text-muted [--i:1]">
              Wir sind ein kleines Software-Studio aus Deutschland. Du sprichst direkt mit den Menschen, die deine App gestalten und
              programmieren, von der ersten Skizze bis zum Release und den Updates danach.
            </p>
          </div>
        </section>

        {/* 02 Services */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Was wir bauen" meta={`${SERVICES.length} Leistungen · iOS · Web · KI · Design · Backend`} />
          <div className="cells">
            {SERVICES.map((s, i) => (
              <article key={s.slug} id={s.slug} className={`grid scroll-mt-12 gap-8 py-14 md:py-20 lg:grid-cols-2 lg:gap-12 ${pad}`} data-reveal>
                <div>
                  <p className="hud text-faint">{two(i + 1)}</p>
                  <h2 className="display mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)]">{s.title}</h2>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{s.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {s.stack.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="grid self-start divide-y divide-border border-y border-border">
                  {s.details.map((d) => (
                    <li key={d} className="flex gap-3 py-3.5">
                      <Check size={18} strokeWidth={2.4} className="mt-1 shrink-0 text-success" aria-hidden />
                      {d}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
