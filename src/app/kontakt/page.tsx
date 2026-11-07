import { Mail, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="px-5 pb-24 pt-28 md:px-6 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Kontakt</p>
          <h1 className="display mt-3 max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)]">Erzähl uns von deinem Projekt.</h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Du planst eine App, brauchst eine Website oder hast eine Frage zu den Koja-Apps? Schreib uns. Es antworten die Menschen,
            die es auch bauen.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="grid content-start gap-4">
              <div className="flex items-start gap-4 rounded-[22px] bg-surface p-6">
                <Mail size={22} className="mt-0.5 shrink-0" aria-hidden />
                <div>
                  <h2 className="font-semibold">E-Mail</h2>
                  <p className="mt-1 select-all text-muted">support@kojalytics.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-[22px] bg-surface p-6">
                <MapPin size={22} className="mt-0.5 shrink-0" aria-hidden />
                <div>
                  <h2 className="font-semibold">Standort</h2>
                  <p className="mt-1 text-muted">Deutschland</p>
                </div>
              </div>
              <div className="rounded-[22px] border border-border p-6">
                <h2 className="font-semibold">So geht es weiter</h2>
                <ul className="mt-3 grid gap-2 text-muted">
                  <li>Kostenloses Erstgespräch zu deinem Projekt</li>
                  <li>Ein schriftliches Angebot mit klarem Umfang</li>
                  <li>Transparente Preise ohne versteckte Kosten</li>
                </ul>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
