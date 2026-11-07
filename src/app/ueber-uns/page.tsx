import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactCta from "@/components/studio/ContactCta";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Über Kojalytics: Software-Studio aus Deutschland",
  description:
    "Kojalytics ist ein kleines Software-Studio aus Hamburg. Wir bauen Apps für Kunden und betreiben eigene Produkte wie AI Headshot und die Koja-Apps für den Mac.",
  alternates: { canonical: "/ueber-uns" },
  openGraph: { ...OG_BASE, url: "/ueber-uns", images: [DEFAULT_OG_IMAGE] },
};

const principles = [
  { title: "Wir liefern aus", text: "Ein Produkt zählt, wenn Menschen es benutzen können. Wir planen den Release ab der ersten Woche mit." },
  { title: "Wir betreiben, was wir bauen", text: "Unsere eigenen Apps haben echte Kunden und echte Zahlungen. Wir wissen, was nach dem Launch passiert." },
  { title: "Klein mit Absicht", text: "Du sprichst mit den Menschen, die gestalten und programmieren, nicht mit einem Account-Manager." },
];

const stack = ["SwiftUI", "Next.js", "React", "TypeScript", "Supabase", "Postgres", "Stripe", "Vercel", "Gemini", "Claude"];

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="bg-[linear-gradient(180deg,#f5f5f4_0%,#ffffff_100%)] px-5 pb-16 pt-28 md:px-6 md:pt-36">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Über uns</p>
            <h1 className="display mt-3 max-w-4xl text-[clamp(2.75rem,6.5vw,5rem)]">Ein kleines Studio, das ausliefert.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Kojalytics ist ein Software-Studio aus Deutschland. Wir entwickeln Apps und Web-Plattformen für Kunden und betreiben eigene
              Produkte: AI Headshot, Etsy Sync und die Koja-Apps für den Mac.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 md:px-6 md:py-20">
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="rounded-[22px] border border-border p-6 sm:p-8">
                <h2 className="display text-3xl">{p.title}</h2>
                <p className="mt-4 leading-relaxed text-muted">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <p className="text-sm font-semibold">Womit wir bauen</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {stack.map((t) => (
                <span key={t} className="rounded-full bg-surface px-4 py-2 text-sm text-muted">
                  {t}
                </span>
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
