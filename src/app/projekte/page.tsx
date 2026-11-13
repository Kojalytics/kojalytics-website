import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/studio/ProjectCard";
import ContactCta from "@/components/studio/ContactCta";
import SectionBar from "@/components/instrument/SectionBar";
import { PROJECTS } from "@/lib/studio";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projekte: Apps, Websites und Shops, die wir gebaut haben",
  description: "Was Kojalytics entwickelt hat: die Koja-Apps, Websites und Online-Shops, iOS-Apps mit KI wie AI Headshot und Koja-AI, Shopify-Apps und mehr.",
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
          <SectionBar index="01" label="Projekte" meta="Vom Prototyp bis zur fertigen App" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in max-w-4xl text-[clamp(2.1rem,5.4vw,4.6rem)]">
              Was wir schon <span className="text-highlight">gebaut</span> haben.
            </h1>
            <p className="rise-in mt-6 max-w-2xl text-lg leading-relaxed text-muted [--i:1]">
              Apps, Websites, Shops und KI-Funktionen: eigene Produkte und Projekte, vom Prototyp bis zur fertigen App. Bei jedem steht,
              wie weit es ist. Diese Erfahrung bringen wir in deine Beratung und dein Projekt ein.
            </p>
          </div>
        </section>

        {/* 02 Projects */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Auswahl" meta={`${PROJECTS.length} Projekte · iOS · Web · macOS · Windows · Shopify`} />
          <h2 className="sr-only">Alle Projekte</h2>
          <div className="cells md:grid-cols-3">
            {PROJECTS.map((p, i) => (
              <div key={p.slug} className="grid" data-reveal style={{ ["--i" as string]: i % 3 }}>
                <ProjectCard project={p} index={i} />
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
