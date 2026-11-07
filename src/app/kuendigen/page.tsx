import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-28 md:pt-36">
        <p className="eyebrow">Koja-Apps-Abo</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Verträge hier kündigen</h1>
        <p className="mt-5 leading-relaxed text-muted">
          Ohne Login und ohne Gebühr: Gib deinen Namen und die E-Mail-Adresse deines Abos ein und klicke auf „Jetzt kündigen“. Dein
          Abo endet zum Ende des Monats, den du schon bezahlt hast, und du bekommst sofort eine Eingangsbestätigung per E-Mail.
        </p>
        <div className="mt-10">
          <CancelForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
