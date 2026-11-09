import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Faq from "@/components/software/Faq";
import SectionBar from "@/components/instrument/SectionBar";

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

const pad = "px-5 md:px-10";

export default function SupportPage() {
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Hero + contact options */}
        <section className="rail">
          <SectionBar index="01" label="Hilfe & Support" meta="Koja-Apps · AI Headshot" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in max-w-4xl text-[clamp(2.1rem,5.4vw,4.6rem)]">
              Wie können wir <span className="text-highlight">helfen</span>?
            </h1>
            <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:1]">
              Antworten auf häufige Fragen zu den Koja-Apps und AI Headshot. Oder schreib uns direkt.
            </p>
          </div>

          <div className="cells rise-in border-t border-border md:grid-cols-2 [--i:2]">
            <div className="flex items-start gap-4 p-6 md:p-8">
              <span className="icon-box shrink-0">
                <Mail size={18} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="hud">E-Mail-Support</h2>
                <p className="mt-2 text-sm text-muted">Antwort in der Regel innerhalb von 24 Stunden</p>
                <p className="mt-3 select-all break-all text-lg font-semibold">support@kojalytics.com</p>
              </div>
            </div>
            <Link href="/kontakt" className="group flex items-start gap-4 p-6 transition-colors hover:bg-surface md:p-8">
              <span className="icon-box shrink-0">
                <MessageCircle size={18} aria-hidden />
              </span>
              <div>
                <h2 className="hud">Kontaktformular</h2>
                <p className="mt-2 text-sm text-muted">Für ausführliche Anfragen</p>
                <p className="mt-3 text-lg font-semibold group-hover:text-accent">Zur Kontaktseite →</p>
              </div>
            </Link>
          </div>
        </section>

        {/* 02 Koja-Apps */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Koja-Apps" meta="Lizenz · Abo · Schlüssel" />
          <div className={`grid gap-10 py-14 md:py-20 lg:grid-cols-[0.8fr_1.2fr] ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              Koja-<span className="text-highlight">Apps</span>
            </h2>
            <Faq items={kojaFaq} />
          </div>
        </section>

        {/* 03 AI Headshot */}
        <section className="rail crosshairs">
          <SectionBar index="03" label="AI Headshot" meta="Pakete · Erstattung · Datenschutz" />
          <div className={`grid gap-10 py-14 md:py-20 lg:grid-cols-[0.8fr_1.2fr] ${pad}`}>
            <h2 className="display text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              AI <span className="text-highlight">Headshot</span>
            </h2>
            <Faq items={headshotFaq} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
