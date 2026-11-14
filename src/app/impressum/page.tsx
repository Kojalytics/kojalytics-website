import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Impressum von Kojalytics: Anbieterkennzeichnung nach § 5 DDG mit Anschrift, Kontakt und Verantwortlichem für die Inhalte dieser Website.",
  alternates: { canonical: "/impressum" },
};

const pad = "px-5 md:px-10";

export default function ImpressumPage() {
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Title */}
        <section className="rail">
          <SectionBar index="01" label="Rechtliches" meta="Anbieterkennzeichnung · § 5 DDG" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in text-[clamp(2rem,4vw,3.2rem)]">Impressum</h1>
          </div>
        </section>

        {/* 02 Details */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Angaben" meta="Kojalytics · Hamburg" />
          <div className="divide-y divide-border">
            <Row index="01" title="Angaben gemäß § 5 DDG">
              <p>
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
            </Row>

            <Row index="02" title="Kontakt">
              <p>
                Telefon: <a href="tel:+4915201482416">+49 1520 1482416</a>
                <br />
                E-Mail: <a href="mailto:support@kojalytics.com">support@kojalytics.com</a>
              </p>
            </Row>

            <Row index="03" title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
              <p>
                Farzad Khojazada
                <br />
                Am Diggen 40i
                <br />
                21077 Hamburg
              </p>
            </Row>

            <Row index="04" title="Verbraucherstreitbeilegung">
              <p>
                Wir sind nicht bereit und nicht verpflichtet, an
                Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
                teilzunehmen.
              </p>
            </Row>

            <Row index="05" title="Haftung für Inhalte und Links">
              <p>
                Für eigene Inhalte auf dieser Website sind wir nach den
                allgemeinen Gesetzen verantwortlich. Für die Inhalte externer
                Websites, auf die wir verlinken, sind ausschließlich deren
                Betreiber verantwortlich. Werden uns Rechtsverletzungen bekannt,
                entfernen wir die betreffenden Inhalte oder Links umgehend.
              </p>
            </Row>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/** One line of the imprint: label left, details right (stacked on phones). */
function Row({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className={`grid gap-3 py-8 md:py-10 lg:grid-cols-[17rem_minmax(0,48rem)] lg:gap-12 ${pad}`} data-reveal>
      <div>
        <p className="hud text-faint">{index}</p>
        <h2 className="mt-2 text-[1.125rem] font-semibold leading-snug">{title}</h2>
      </div>
      <div className="prose-de lg:pt-[22px]">{children}</div>
    </section>
  );
}
