import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "AGB für die Koja-Apps",
  description: "Allgemeine Geschäftsbedingungen für die Koja-Apps: Monatsabo, dauerhafte Lizenz, Kündigung und Widerrufsrecht.",
  alternates: { canonical: "/agb" },
  robots: { index: false },
};

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. Anbieter",
    body: ["Die Koja-Apps werden von Kojalytics angeboten. Die vollständigen Unternehmensangaben findest du im Impressum."],
  },
  {
    title: "2. Vertragsgegenstand",
    body: [
      "Gegenstand ist eine Lizenz zur Nutzung aller Koja-Apps für macOS auf bis zu 3 eigenen Geräten. Die Lizenz wird als Lizenzschlüssel für den Kojalytics Launcher geliefert.",
      `Nach dem Download kannst du die Apps ${TRIAL_DAYS} Tage kostenlos testen. Der Test endet automatisch und verursacht keine Kosten.`,
    ],
  },
  {
    title: "3. Monatsabo",
    body: [
      `${PLANS.monthly.label} pro Monat inklusive Mehrwertsteuer, monatlich im Voraus über Stripe abgerechnet.`,
      "Das Abo verlängert sich monatlich, bis du kündigst. Du kannst jederzeit ohne Gebühr unter kojalytics.com/kuendigen kündigen. Das Abo endet dann zum Ende des bereits bezahlten Monats. Danach funktioniert der Lizenzschlüssel nicht mehr.",
    ],
  },
  {
    title: "4. Dauerhafte Lizenz",
    body: [`${PLANS.lifetime.label} einmalig inklusive Mehrwertsteuer. Die Lizenz läuft nicht ab und verlängert sich nicht.`],
  },
  {
    title: "5. Widerrufsrecht",
    body: [
      "Als Verbraucher hast du grundsätzlich ein 14-tägiges Widerrufsrecht. Bei digitalen Inhalten erlischt es vorzeitig, wenn du ausdrücklich zustimmst, dass wir vor Ablauf der Widerrufsfrist mit der Ausführung beginnen, und bestätigst, dass du dadurch dein Widerrufsrecht verlierst. Diese Zustimmung holen wir vor dem Checkout ein und liefern den Lizenzschlüssel direkt nach der Zahlung.",
    ],
  },
  {
    title: "6. Open-Source-Software",
    body: [
      "Die Koja-Apps basieren auf Open-Source-Software des ArtCraft-Teams, die unter den Lizenzen MIT und Apache-2.0 veröffentlicht ist. Diese Lizenzen gelten für den Quellcode und bleiben von diesen AGB unberührt.",
    ],
  },
];

export default function TermsPage() {
  const preview = process.env.VERCEL_ENV !== "production";
  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-28 md:pt-36">
        <p className="eyebrow">Rechtliches</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">AGB für die Koja-Apps</h1>
        {preview && (
          <p className="mt-6 rounded-[16px] border border-dashed border-accent p-4 text-sm text-accent">
            [Nur in der Vorschau sichtbar] Entwurf. Vor dem Livegang von einem Anwalt prüfen lassen und um die vollständige
            Widerrufsbelehrung samt Muster-Widerrufsformular ergänzen.
          </p>
        )}
        <div className="mt-10 grid gap-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-semibold">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted">
          Fragen zu diesen AGB: support@kojalytics.com. Siehe auch{" "}
          <Link href="/impressum" className="underline underline-offset-2">
            Impressum
          </Link>{" "}
          und{" "}
          <Link href="/datenschutz" className="underline underline-offset-2">
            Datenschutz
          </Link>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
