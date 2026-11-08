import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Impressum von Kojalytics: Anbieterkennzeichnung nach § 5 DDG mit Anschrift, Kontakt und Verantwortlichem für die Inhalte dieser Website.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-10">Impressum</h1>

          <div className="glass-card rounded-2xl p-10 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">Angaben gemäß § 5 DDG</h2>
              <p className="text-muted leading-relaxed">
                Farzad Khojazada
                <br />
                Kojalytics (Einzelunternehmen)
                <br />
                Am Diggen 40i
                <br />
                21077 Hamburg
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
                Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
              </h2>
              <p className="text-muted leading-relaxed">
                Farzad Khojazada
                <br />
                Am Diggen 40i
                <br />
                21077 Hamburg
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Verbraucherstreitbeilegung</h2>
              <p className="text-muted leading-relaxed">
                Wir sind nicht bereit und nicht verpflichtet, an
                Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
                teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Haftung für Inhalte und Links</h2>
              <p className="text-muted leading-relaxed">
                Für eigene Inhalte auf dieser Website sind wir nach den
                allgemeinen Gesetzen verantwortlich. Für die Inhalte externer
                Websites, auf die wir verlinken, sind ausschließlich deren
                Betreiber verantwortlich. Werden uns Rechtsverletzungen bekannt,
                entfernen wir die betreffenden Inhalte oder Links umgehend.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
