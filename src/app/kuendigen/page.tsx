import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";
import CancelForm from "./CancelForm";

export const metadata: Metadata = {
  title: "Verträge hier kündigen",
  description: "Kündige dein Koja-Apps-Abo online: Name und E-Mail eingeben, „Jetzt kündigen“ klicken. Ohne Login, ohne Gebühr, mit Eingangsbestätigung per E-Mail.",
  alternates: { canonical: "/kuendigen" },
};

export default function CancelPage() {
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Cancellation: explanation left, the form right (stacked on phones) */}
        <section className="rail">
          <SectionBar index="01" label="Koja-Apps-Abo" meta="Ohne Login · ohne Gebühr · Bestätigung per E-Mail" />
          <div className="grid gap-12 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <h1 className="display rise-in text-[clamp(2rem,4vw,3.2rem)]">
                Verträge hier <span className="text-highlight">kündigen</span>
              </h1>
              <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:1]">
                Ohne Login und ohne Gebühr: Gib deinen Namen und die E-Mail-Adresse deines Abos ein und klicke auf „Jetzt kündigen“. Dein
                Abo endet zum Ende des Monats, den du schon bezahlt hast, und du bekommst sofort eine Eingangsbestätigung per E-Mail.
              </p>
            </div>
            <div className="rise-in [--i:2]">
              <CancelForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
