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
    a: "Du wählst bis zu 5 Fotos von dir aus, und unsere KI erstellt daraus professionelle Porträts in verschiedenen Stilen. Das dauert nur wenige Minuten. Du bekommst hochauflösende Bilder für LinkedIn, Lebenslauf oder Social Media.",
  },
  {
    q: "Welche Pakete gibt es?",
    a: "Starter (9,99 €) mit 12 KI-Porträts und Premium (19,99 €) mit 24 Porträts und mehr Stilen. Beides sind Einmalkäufe, kein Abo.",
  },
  {
    q: "Kann ich mein Geld zurückbekommen?",
    a: "Käufe in der App laufen über Apple, deshalb erstattet auch Apple: Fordere die Erstattung unter reportaproblem.apple.com an. Wenn du mit deinen Porträts nicht zufrieden bist, schreib uns außerdem an support@kojalytics.com, wir helfen dir gern weiter.",
  },
  {
    q: "Sind meine Fotos sicher?",
    a: "Deine Fotos werden verschlüsselt übertragen und nur zur Erstellung deiner Porträts an unseren KI-Dienstleister Google (Gemini API) übermittelt, und zwar erst, nachdem du in der App eingewilligt hast. Nach der Erstellung werden sie auf unserem Server und bei Google gelöscht. Wir verkaufen deine Fotos nicht und nutzen sie nicht zum Training. Mehr dazu in der [Datenschutzerklärung](/datenschutz#ai-headshot).",
  },
  {
    q: "Auf welchen Geräten läuft AI Headshot?",
    a: "AI Headshot gibt es für das iPhone (ab iOS 17). iPad und Android sind in Planung.",
  },
  {
    q: "Brauche ich ein Konto, und wie lösche ich meine Daten?",
    a: "AI Headshot funktioniert ohne Konto, es gibt also keins zu löschen. Deine Fotos werden nach der Erstellung der Porträts automatisch von unserem Server gelöscht. Porträts, Tresor-Einträge und Einstellungen auf deinem iPhone löschst du in der App unter Einstellungen › „Alle meine Daten löschen“. Bei Fragen zu deinen Daten schreib an support@kojalytics.com.",
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
