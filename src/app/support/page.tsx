import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Faq from "@/components/software/Faq";

const kojaFaq = [
  {
    q: "Wie aktiviere ich meine Koja-Lizenz?",
    a: "Starte den Kojalytics Launcher, öffne Einstellungen › Lizenz, füge deinen Schlüssel aus der Kauf-E-Mail ein und klicke auf „Aktivieren“. Eine Lizenz gilt für bis zu 3 Macs.",
  },
  {
    q: "Wie kündige ich mein Koja-Abo?",
    a: "Unter [Verträge hier kündigen](/kuendigen), ohne Login und ohne Gebühr. Das Abo endet zum Ende des bezahlten Monats, die Bestätigung kommt sofort per E-Mail.",
  },
  {
    q: "Ich habe meinen Lizenzschlüssel verloren.",
    a: "Schreib an support@kojalytics.com mit der E-Mail-Adresse, mit der du bezahlt hast. Wir schicken dir den Schlüssel erneut.",
  },
];

const headshotFaq = [
  {
    q: "Wie funktioniert AI Headshot?",
    a: "Du lädst 5 bis 10 Selfies hoch, und unsere KI erstellt daraus professionelle Porträts in verschiedenen Stilen. Das dauert nur wenige Minuten. Du bekommst hochauflösende Bilder für LinkedIn, Lebenslauf oder Social Media.",
  },
  {
    q: "Welche Pakete gibt es?",
    a: "Starter (9,99 €) mit 12 KI-Porträts und Premium (19,99 €) mit 24 Porträts und mehr Stilen. Beides sind Einmalkäufe, kein Abo.",
  },
  {
    q: "Kann ich mein Geld zurückbekommen?",
    a: "Wenn du mit deinen Porträts nicht zufrieden bist, schreib uns innerhalb von 14 Tagen nach dem Kauf an support@kojalytics.com. Wir prüfen deinen Fall und erstatten den Betrag, wenn die Qualität nicht den Erwartungen entsprach.",
  },
  {
    q: "Sind meine Fotos sicher?",
    a: "Deine Fotos werden sicher verarbeitet und nach der Erstellung der Porträts automatisch von unseren Servern gelöscht. Wir geben sie nie weiter, verkaufen sie nicht und nutzen sie nicht zum Training.",
  },
  {
    q: "Auf welchen Geräten läuft AI Headshot?",
    a: "AI Headshot gibt es für das iPhone (ab iOS 16). iPad und Android sind in Planung.",
  },
  {
    q: "Wie lösche ich mein Konto und meine Daten?",
    a: "Direkt in der App unter Einstellungen › Konto › Konto löschen. Alle Daten werden innerhalb von 48 Stunden dauerhaft entfernt. Du kannst uns auch an support@kojalytics.com schreiben.",
  },
];

export default function SupportPage() {
  return (
    <>
      <Navigation />
      <main className="px-5 pb-24 pt-28 md:px-6 md:pt-36">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow">Hilfe & Support</p>
          <h1 className="display mt-3 text-[clamp(2.5rem,6vw,4.25rem)]">Wie können wir helfen?</h1>
          <p className="mt-5 max-w-xl text-lg text-muted">Antworten auf häufige Fragen zu den Koja-Apps und AI Headshot. Oder schreib uns direkt.</p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-[22px] bg-surface p-6">
              <Mail size={22} className="mt-0.5 shrink-0" aria-hidden />
              <div>
                <h2 className="font-semibold">E-Mail-Support</h2>
                <p className="mt-1 text-sm text-muted">Antwort in der Regel innerhalb von 24 Stunden</p>
                <p className="mt-2 select-all font-medium">support@kojalytics.com</p>
              </div>
            </div>
            <Link href="/kontakt" className="flex items-start gap-4 rounded-[22px] border border-border p-6 transition-colors hover:border-foreground/40">
              <MessageCircle size={22} className="mt-0.5 shrink-0" aria-hidden />
              <div>
                <h2 className="font-semibold">Kontaktformular</h2>
                <p className="mt-1 text-sm text-muted">Für ausführliche Anfragen</p>
                <p className="mt-2 font-medium">Zur Kontaktseite →</p>
              </div>
            </Link>
          </div>

          <h2 className="display mb-6 mt-16 text-3xl">Koja-Apps</h2>
          <Faq items={kojaFaq} />

          <h2 className="display mb-6 mt-16 text-3xl">AI Headshot</h2>
          <Faq items={headshotFaq} />
        </div>
      </main>
      <Footer />
    </>
  );
}
