import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";
import WithdrawForm from "./WithdrawForm";

export const metadata: Metadata = {
  title: "Vertrag widerrufen",
  description: "Widerrufe deinen Kauf der Koja-Apps online: Name und E-Mail eingeben, „Widerruf bestätigen“ klicken. Du bekommst sofort eine Eingangsbestätigung.",
  alternates: { canonical: "/widerrufen" },
  robots: { index: false },
};

export default function WithdrawPage() {
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Withdrawal: explanation left, the form right (stacked on phones) */}
        <section className="rail">
          <SectionBar index="01" label="Koja-Apps" meta="Widerrufsfunktion · Eingangsbestätigung per E-Mail" />
          <div className="grid gap-12 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <h1 className="display rise-in text-[clamp(2rem,4vw,3.2rem)]">
                Vertrag <span className="text-highlight">widerrufen</span>
              </h1>
              <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:1]">
                Hier erklärst du den Widerruf deines Kaufs. Ob dir das Widerrufsrecht noch zusteht, steht in unserer{" "}
                <Link href="/agb#widerruf" className="text-foreground underline underline-offset-4">
                  Widerrufsbelehrung
                </Link>
                . Du willst nur dein Abo beenden?{" "}
                <Link href="/kuendigen" className="text-foreground underline underline-offset-4">
                  Dann kündige es hier
                </Link>
                .
              </p>
            </div>
            <div className="rise-in [--i:2]">
              <WithdrawForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
