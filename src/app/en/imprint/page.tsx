import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Imprint",
  description:
    "Imprint of Kojalytics: provider identification under § 5 DDG with address, contact details and the person responsible for the content of this website.",
  alternates: alternates("en", "/impressum"),
};

const pad = "px-5 md:px-10";

export default function ImprintPage() {
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Title */}
        <section className="rail">
          <SectionBar index="01" label="Legal" meta="Provider identification · § 5 DDG" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in text-[clamp(2rem,4vw,3.2rem)]">Imprint</h1>
            <p className="rise-in mt-8 max-w-3xl border border-border border-t-2 border-t-foreground p-4 text-sm leading-relaxed text-muted [--i:1]">
              This English version is a courtesy translation. Only the{" "}
              <Link href="/impressum" className="text-foreground underline underline-offset-4">
                German version (Impressum)
              </Link>{" "}
              is legally binding.
            </p>
          </div>
        </section>

        {/* 02 Details */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Details" meta="Kojalytics · Hamburg" />
          <div className="divide-y divide-border">
            <Row index="01" title="Information pursuant to § 5 DDG (German Digital Services Act)">
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

            <Row index="02" title="Contact">
              <p>
                Phone: <a href="tel:+4915201482416">+49 1520 1482416</a>
                <br />
                Email: <a href="mailto:support@kojalytics.com">support@kojalytics.com</a>
              </p>
            </Row>

            <Row index="03" title="Responsible for the content under § 18 (2) MStV (German Interstate Media Treaty)">
              <p>
                Farzad Khojazada
                <br />
                Am Diggen 40i
                <br />
                21077 Hamburg
              </p>
            </Row>

            <Row index="04" title="Consumer dispute resolution">
              <p>
                We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer
                arbitration board (Verbraucherschlichtungsstelle).
              </p>
            </Row>

            <Row index="05" title="Liability for content and links">
              <p>
                We are responsible for our own content on this website under the general laws. The operators of external
                websites we link to are solely responsible for the content of those websites. If we become aware of any
                infringement of the law, we will remove the content or links concerned without delay.
              </p>
            </Row>
          </div>
        </section>
      </main>
      <Footer offer={false} lang="en" />
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
