import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ImpressumPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-10">Impressum</h1>

          <div className="glass-card rounded-2xl p-10 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">Angaben gemäß § 5 TMG</h2>
              <p className="text-muted leading-relaxed">
                Kojalytics
                <br />
                [Deine Adresse hier eintragen]
                <br />
                [PLZ Stadt]
                <br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
              <p className="text-muted leading-relaxed">
                E-Mail:{" "}
                <a
                  href="mailto:support@kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  support@kojalytics.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p className="text-muted leading-relaxed">
                [Dein Name hier eintragen]
                <br />
                [Deine Adresse hier eintragen]
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Haftungsausschluss</h2>
              <p className="text-muted leading-relaxed">
                Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine
                Haftung für die Inhalte externer Links. Für den Inhalt der
                verlinkten Seiten sind ausschließlich deren Betreiber
                verantwortlich.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
