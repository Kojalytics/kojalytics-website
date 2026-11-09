import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Closing call to action of the studio pages: a full rail section, centred, one button. */
export default function ContactCta() {
  return (
    <section className="rail crosshairs border-t border-border">
      <div className="flex flex-col items-center px-5 py-20 text-center md:px-10 md:py-28">
        <p className="hud">Kontakt · Neues Projekt</p>
        <h2 className="display mt-8 max-w-4xl text-[clamp(2.2rem,5vw,4.4rem)]" data-reveal>
          Du hast eine <span className="text-highlight">App</span> im Kopf? Erzähl uns davon.
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted" data-reveal>
          Schreib uns ein paar Zeilen zu deiner Idee. Du bekommst eine Antwort von den Menschen, die sie bauen würden, mit Fragen und
          einem ersten Plan.
        </p>
        <div className="mt-9" data-reveal>
          <Link href="/kontakt" className="btn-primary">
            Projekt anfragen <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
