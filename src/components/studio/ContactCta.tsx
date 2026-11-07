import Link from "next/link";

export default function ContactCta() {
  return (
    <section className="px-5 py-20 md:px-6 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 rounded-[28px] bg-foreground p-8 text-white sm:p-12 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="display text-4xl sm:text-5xl">Du hast eine App im Kopf? Erzähl uns davon.</h2>
          <p className="mt-5 max-w-xl text-lg text-white/75">
            Schreib uns ein paar Zeilen zu deiner Idee. Du bekommst eine Antwort von den Menschen, die sie bauen würden, mit Fragen und
            einem ersten Plan.
          </p>
        </div>
        <Link href="/kontakt" className="btn-secondary shrink-0 !border-white text-base">
          Projekt anfragen
        </Link>
      </div>
    </section>
  );
}
