import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactCta from "@/components/studio/ContactCta";
import SectionBar from "@/components/instrument/SectionBar";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Über Kojalytics: Software-Studio aus Deutschland",
  description:
    "Kojalytics ist ein kleines Software-Studio aus Hamburg. Wir bauen Apps für Kunden und betreiben eigene Produkte wie AI Headshot und die Koja-Apps für Mac und Windows.",
  alternates: { canonical: "/ueber-uns" },
  openGraph: { ...OG_BASE, url: "/ueber-uns", images: [DEFAULT_OG_IMAGE] },
};

const principles = [
  { title: "Wir liefern aus", text: "Ein Produkt zählt, wenn Menschen es benutzen können. Wir planen den Release ab der ersten Woche mit." },
  { title: "Wir betreiben, was wir bauen", text: "Unsere eigenen Apps haben echte Kunden und echte Zahlungen. Wir wissen, was nach dem Launch passiert." },
  { title: "Klein mit Absicht", text: "Du sprichst mit den Menschen, die gestalten und programmieren, nicht mit einem Account-Manager." },
];

const stack = ["SwiftUI", "Next.js", "React", "TypeScript", "Supabase", "Postgres", "Stripe", "Vercel", "Gemini", "Claude"];

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Hero */}
        <section className="rail">
          <SectionBar index="01" label="Über uns" meta="Kojalytics · Software-Studio aus Deutschland" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in max-w-4xl text-[clamp(2.1rem,5.4vw,4.6rem)]">
              Ein kleines Studio, das <span className="text-highlight">ausliefert</span>.
            </h1>
            <p className="rise-in mt-6 max-w-2xl text-lg leading-relaxed text-muted [--i:1]">
              Kojalytics ist ein Software-Studio aus Deutschland. Wir entwickeln Apps und Web-Plattformen für Kunden und betreiben eigene
              Produkte: AI Headshot, Etsy Sync und die Koja-Apps für Mac und Windows.
            </p>
          </div>
        </section>

        {/* 02 Principles */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Wie wir arbeiten" meta={`${principles.length} Grundsätze`} />
          <div className="cells lg:grid-cols-3">
            {principles.map((p, i) => (
              <div key={p.title} className="p-6 md:p-8" data-reveal style={{ ["--i" as string]: i }}>
                <p className="hud text-faint">{two(i + 1)}</p>
                <h2 className="display mt-6 text-[1.55rem]">{p.title}</h2>
                <p className="mt-3 max-w-xl leading-relaxed text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 03 Stack */}
        <section className="rail crosshairs">
          <SectionBar index="03" label="Womit wir bauen" meta={`${stack.length} Werkzeuge`} />
          <ul className="cells grid-cols-2 lg:grid-cols-5">
            {stack.map((t, i) => (
              <li key={t} className="flex items-baseline justify-between gap-3 px-5 py-6 md:px-8 md:py-8" data-reveal style={{ ["--i" as string]: i % 5 }}>
                <span className="text-lg font-semibold">{t}</span>
                <span className="hud text-faint">{two(i + 1)}</span>
              </li>
            ))}
          </ul>
        </section>

        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
