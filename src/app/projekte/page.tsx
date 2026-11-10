import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/studio/ProjectCard";
import ContactCta from "@/components/studio/ContactCta";
import SectionBar from "@/components/instrument/SectionBar";
import { PROJECTS } from "@/lib/studio";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projekte: Apps, die wir gebaut haben",
  description: "Apps, die wir entworfen, entwickelt und veröffentlicht haben: die Koja-Apps für Mac und Windows, AI Headshot für iOS und Web sowie Etsy Sync für Shopify.",
  alternates: { canonical: "/projekte" },
  openGraph: { ...OG_BASE, url: "/projekte", images: [DEFAULT_OG_IMAGE] },
};

const pad = "px-5 md:px-10";

export default function WorkPage() {
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Hero */}
        <section className="rail">
          <SectionBar index="01" label="Projekte" meta="Live und von uns gepflegt" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in max-w-4xl text-[clamp(2.1rem,5.4vw,4.6rem)]">
              Produkte, die wir gebaut haben und <span className="text-highlight">betreiben</span>.
            </h1>
            <p className="rise-in mt-6 max-w-2xl text-lg leading-relaxed text-muted [--i:1]">
              Jedes Projekt hier ist live und wird von uns gepflegt. Diese Erfahrung bringen wir in deine App ein.
            </p>
          </div>
        </section>

        {/* 02 Projects */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Auswahl" meta={`${PROJECTS.length} Projekte · iOS · Web · macOS · Windows · Shopify`} />
          <div className="cells md:grid-cols-3">
            {PROJECTS.map((p, i) => (
              <div key={p.slug} className="grid" data-reveal style={{ ["--i" as string]: i }}>
                <ProjectCard project={p} sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 427px" />
              </div>
            ))}
          </div>
        </section>

        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
