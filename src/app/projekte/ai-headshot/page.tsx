import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactCta from "@/components/studio/ContactCta";

export const metadata: Metadata = {
  title: "AI Headshot: KI-Porträt-App für iOS und Web",
  description:
    "Wie Kojalytics AI Headshot gebaut hat: eine iOS-App und eine Web-App, die aus Selfies professionelle Porträts machen, mit Stripe-Zahlungen und 8 Sprachen.",
  alternates: { canonical: "/projekte/ai-headshot" },
  openGraph: { url: "/projekte/ai-headshot", images: [{ url: "/aiheadshot/comparisons/after-1.webp", width: 500, height: 600, alt: "Von KI erzeugtes Business-Porträt" }] },
};

const built = [
  "SwiftUI-App für das iPhone und eine Next.js-Web-App mit gemeinsamem Backend",
  "Selfie-Upload am Computer, per Webcam oder vom Handy per QR-Code",
  "Qualitätsprüfung der Selfies vor der Erzeugung",
  "KI-Porträts in mehreren professionellen Stilen",
  "Stripe-Checkout mit zwei Einmal-Paketen",
  "Landingpages in 8 Sprachen mit lokalisiertem SEO",
];

const pairs = [1, 2, 3];

export default function AiHeadshotCase() {
  return (
    <>
      <Navigation />
      <main>
        <section className="bg-[linear-gradient(180deg,#f5f5f4_0%,#ffffff_100%)] px-5 pb-12 pt-28 md:px-6 md:pt-36">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Brotkrumen" className="flex gap-2 text-sm text-muted">
              <Link href="/projekte" className="hover:text-foreground">
                Projekte
              </Link>
              <span aria-hidden>/</span>
              <span className="text-foreground">AI Headshot</span>
            </nav>
            <h1 className="display mt-5 max-w-4xl text-[clamp(2.75rem,6.5vw,5rem)]">Vom Selfie zum Business-Porträt in Minuten.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              AI Headshot macht aus ein paar Selfies professionelle Porträts für LinkedIn, Lebenslauf und Firmenwebsite. Ohne Fotograf,
              ohne Termin. Wir haben die iOS-App, die Web-App und das Backend dahinter entworfen und entwickelt.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["iOS-App", "Web-App", "SwiftUI", "Next.js", "Supabase", "Gemini", "Stripe"].map((t) => (
                <span key={t} className="rounded-full border border-border bg-white px-3 py-1 text-xs text-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 md:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {pairs.map((n) => (
              <figure key={n} className="m-0 grid grid-cols-2 gap-1 overflow-hidden rounded-[22px] border border-border p-1">
                <div className="relative aspect-[5/6] overflow-hidden rounded-[18px]">
                  <Image src={`/aiheadshot/comparisons/before-${n}.webp`} alt="Selfie als Ausgangsbild" fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover" />
                  <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold">Selfie</span>
                </div>
                <div className="relative aspect-[5/6] overflow-hidden rounded-[18px]">
                  <Image src={`/aiheadshot/comparisons/after-${n}.webp`} alt="Daraus erzeugtes professionelles Porträt" fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover" />
                  <span className="absolute left-2 top-2 rounded-full bg-foreground px-2 py-0.5 text-[11px] font-semibold text-white">KI-Porträt</span>
                </div>
              </figure>
            ))}
          </div>
        </section>

        <section className="bg-surface px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            <div>
              <h2 className="display text-4xl sm:text-5xl">Ein Studiofoto ohne Studio</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Ein professionelles Porträt heißt normalerweise: Fotografen buchen und für das Shooting bezahlen. AI Headshot ersetzt das
                durch ein paar Selfies und wenige Minuten Wartezeit, zum Festpreis statt im Abo.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Was wir gebaut haben</h2>
              <ul className="mt-5 grid gap-3">
                {built.map((b) => (
                  <li key={b} className="flex gap-3 text-lg">
                    <Check size={20} strokeWidth={2.6} className="mt-1 shrink-0 text-success" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/de/aiheadshot/app" className="btn-secondary mt-8">
                AI-Headshot-Web-App öffnen
              </Link>
            </div>
          </div>
        </section>
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
