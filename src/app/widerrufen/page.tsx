import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-28 md:pt-36">
        <p className="eyebrow">Koja-Apps</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Vertrag widerrufen</h1>
        <p className="mt-5 leading-relaxed text-muted">
          Hier erklärst du den Widerruf deines Kaufs. Ob dir das Widerrufsrecht noch zusteht, steht in unserer{" "}
          <Link href="/agb#widerruf" className="text-foreground underline underline-offset-2">
            Widerrufsbelehrung
          </Link>
          . Du willst nur dein Abo beenden?{" "}
          <Link href="/kuendigen" className="text-foreground underline underline-offset-2">
            Dann kündige es hier
          </Link>
          .
        </p>
        <div className="mt-10">
          <WithdrawForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
