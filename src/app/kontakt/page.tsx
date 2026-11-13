import { Mail, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";
import ContactForm from "./ContactForm";

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

const next = ["Kostenloses Erstgespräch zu deinem Projekt", "Ein schriftliches Angebot mit klarem Umfang", "Transparente Preise ohne versteckte Kosten"];

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="pt-12">
        <section className="rail">
          <SectionBar index="01" label="Kontakt" meta="Es antworten die Menschen, die es bauen" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in max-w-3xl text-[clamp(2.1rem,5.4vw,4.6rem)]">
              Erzähl uns von deinem <span className="text-highlight">Projekt</span>.
            </h1>
            <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-muted [--i:1]">
              Du suchst Beratung, brauchst Software-Lizenzen, planst eine App oder hast eine Frage zu den Koja-Apps? Schreib uns. Es
              antworten die Menschen, die sich auch darum kümmern.
            </p>
          </div>

          <div className="cells rise-in border-t border-border lg:grid-cols-[0.8fr_1.2fr] [--i:2]">
            <div className="grid content-start divide-y divide-border">
              <div className="flex items-start gap-4 p-6 md:p-8">
                <span className="icon-box shrink-0">
                  <Mail size={18} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2 className="hud">E-Mail</h2>
                  <a
                    href="mailto:support@kojalytics.com"
                    className="-my-1.5 inline-flex min-h-11 items-center break-all text-lg font-semibold underline-offset-4 hover:text-accent hover:underline"
                  >
                    support@kojalytics.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 md:p-8">
                <span className="icon-box shrink-0">
                  <MapPin size={18} aria-hidden />
                </span>
                <div>
                  <h2 className="hud">Standort</h2>
                  <p className="-my-1.5 flex min-h-11 items-center text-lg font-semibold">Deutschland</p>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="hud">So geht es weiter</h2>
                <ul className="mt-4 grid gap-3 text-muted">
                  {next.map((t, i) => (
                    <li key={t} className="flex gap-3">
                      <span className="hud mt-1 shrink-0 text-faint">{two(i + 1)}</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
