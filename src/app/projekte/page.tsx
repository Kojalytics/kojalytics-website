import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/studio/ProjectCard";
import ContactCta from "@/components/studio/ContactCta";
import { PROJECTS } from "@/lib/studio";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projekte: Apps, die wir gebaut haben",
  description: "Apps, die wir entworfen, entwickelt und veröffentlicht haben: die Koja-Apps für den Mac, AI Headshot für iOS und Web sowie Etsy Sync für Shopify.",
  alternates: { canonical: "/projekte" },
  openGraph: { url: "/projekte", images: [DEFAULT_OG_IMAGE] },
};

export default function WorkPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="bg-[linear-gradient(180deg,#f5f5f4_0%,#ffffff_100%)] px-5 pb-12 pt-28 md:px-6 md:pt-36">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Projekte</p>
            <h1 className="display mt-3 max-w-4xl text-[clamp(2.75rem,6.5vw,5rem)]">Produkte, die wir gebaut haben und betreiben.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Jedes Projekt hier ist live und wird von uns gepflegt. Diese Erfahrung bringen wir in deine App ein.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-12 md:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.slug} project={p} sizes="(max-width: 768px) 100vw, 33vw" />
            ))}
          </div>
        </section>
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
