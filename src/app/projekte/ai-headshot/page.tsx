import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactCta from "@/components/studio/ContactCta";
import SectionBar from "@/components/instrument/SectionBar";

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

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

export default function AiHeadshotCase() {
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Hero */}
        <section className="rail">
          <SectionBar index="01" label="Fallstudie" meta="iOS-App · Web-App · Backend" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <nav aria-label="Brotkrumen" className="hud rise-in flex items-center gap-2">
              <Link href="/projekte" className="-my-3 inline-flex min-h-11 items-center hover:text-foreground">
                Projekte
              </Link>
              <span aria-hidden className="text-faint">
                /
              </span>
              <span className="text-foreground">AI Headshot</span>
            </nav>
            <h1 className="display rise-in mt-6 max-w-4xl text-[clamp(2.1rem,5.4vw,4.6rem)] [--i:1]">
              Vom Selfie zum Business-Porträt in <span className="text-highlight">Minuten</span>.
            </h1>
            <p className="rise-in mt-6 max-w-2xl text-lg leading-relaxed text-muted [--i:2]">
              AI Headshot macht aus ein paar Selfies professionelle Porträts für LinkedIn, Lebenslauf und Firmenwebsite. Ohne Fotograf,
              ohne Termin. Wir haben die iOS-App, die Web-App und das Backend dahinter entworfen und entwickelt.
            </p>
            <div className="rise-in mt-7 flex flex-wrap gap-1.5 [--i:3]">
              {["iOS-App", "Web-App", "SwiftUI", "Next.js", "Supabase", "Gemini", "Stripe"].map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 02 Before / after */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Vorher / Nachher" meta="Selfie → KI-Porträt" />
          <div className="cells md:grid-cols-3">
            {pairs.map((n, i) => (
              <figure key={n} className="m-0 p-3 md:p-4" data-reveal style={{ ["--i" as string]: i }}>
                <div className="grid grid-cols-2 gap-px border border-border bg-border">
                  <div className="relative aspect-[5/6] overflow-hidden bg-surface">
                    <Image src={`/aiheadshot/comparisons/before-${n}.webp`} alt="Selfie als Ausgangsbild" fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover" />
                    <span className="absolute left-2 top-2 bg-white px-1.5 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-foreground">
                      Selfie
                    </span>
                  </div>
                  <div className="relative aspect-[5/6] overflow-hidden bg-surface">
                    <Image src={`/aiheadshot/comparisons/after-${n}.webp`} alt="Daraus erzeugtes professionelles Porträt" fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover" />
                    <span className="absolute left-2 top-2 bg-foreground px-1.5 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-white">
                      KI-Porträt
                    </span>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </section>

        {/* 03 The idea */}
        <section className="rail crosshairs">
          <SectionBar index="03" label="Die Idee" meta="Festpreis statt Abo" />
          <div className={`grid gap-8 py-14 md:py-20 lg:grid-cols-2 lg:gap-12 ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Ein Studiofoto ohne <span className="text-highlight">Studio</span>
            </h2>
            <p className="text-lg leading-relaxed text-muted lg:pt-2" data-reveal>
              Ein professionelles Porträt heißt normalerweise: Fotografen buchen und für das Shooting bezahlen. AI Headshot ersetzt das durch
              ein paar Selfies und wenige Minuten Wartezeit, zum Festpreis statt im Abo.
            </p>
          </div>
        </section>

        {/* 04 What we built */}
        <section className="rail crosshairs">
          <SectionBar index="04" label="Umsetzung" meta="iOS · Web · Backend · Zahlungen" />
          <div className={`flex flex-col justify-between gap-6 py-14 md:flex-row md:items-end md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Was wir <span className="text-highlight">gebaut</span> haben
            </h2>
            <Link href="/de/aiheadshot/app" className="btn-secondary shrink-0">
              AI-Headshot-Web-App öffnen
            </Link>
          </div>
          <ul className="cells border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {built.map((b, i) => (
              <li key={b} className="p-6 md:p-8" data-reveal style={{ ["--i" as string]: i % 3 }}>
                <div className="flex items-start justify-between">
                  <Check size={18} strokeWidth={2.4} className="text-success" aria-hidden />
                  <span className="hud text-faint">{two(i + 1)}</span>
                </div>
                <p className="mt-5 text-lg leading-snug">{b}</p>
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
