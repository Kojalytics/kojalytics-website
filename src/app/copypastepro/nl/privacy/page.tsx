import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacyverklaring — Copy Paste Pro",
  description:
    "Privacyverklaring voor de iOS-app Copy Paste Pro van Kojalytics. Alle gegevens blijven op je apparaat — geen tracking, geen advertenties.",
  alternates: {
    canonical: "https://kojalytics.com/copypastepro/nl/privacy",
    languages: {
      de: "https://kojalytics.com/copypastepro/de/datenschutz",
      en: "https://kojalytics.com/copypastepro/en/privacy",
      fr: "https://kojalytics.com/copypastepro/fr/confidentialite",
      es: "https://kojalytics.com/copypastepro/es/privacidad",
      nl: "https://kojalytics.com/copypastepro/nl/privacy",
    },
  },
};

export default function CopyPasteProPrivacyNLPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent-light text-sm font-medium tracking-wide uppercase mb-3">
            Copy Paste Pro
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Privacyverklaring
          </h1>
          <p className="text-muted text-sm mb-10">
            Laatst bijgewerkt: 30 mei 2026
          </p>

          <div className="glass-card rounded-2xl p-10 space-y-10">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
              <p className="text-accent-light font-medium text-sm leading-relaxed">
                Copy Paste Pro slaat je gegevens uitsluitend op je apparaat op.
                Geen serververzending, geen analyse, geen tracking, geen
                advertenties.
              </p>
            </div>

            <Section title="1. Verwerkingsverantwoordelijke">
              <p className="text-muted leading-relaxed">
                Kojalytics
                <br />
                E-mail:{" "}
                <a
                  href="mailto:support@kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  support@kojalytics.com
                </a>
                <br />
                Website:{" "}
                <a
                  href="https://kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  kojalytics.com
                </a>
              </p>
            </Section>

            <Section title="2. Wat doet Copy Paste Pro?">
              <p className="text-muted leading-relaxed">
                Copy Paste Pro is een klembordmanager met een eigen iOS-
                toetsenbord in 12 talen, ingebouwde vertaling via Apple
                Translation, agenda-integratie en AI-ondersteunde autocorrectie.
                Alle verwerking gebeurt lokaal.
              </p>
            </Section>

            <Section title="3. Welke gegevens worden lokaal verwerkt?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">
                    Klembordgeschiedenis:
                  </strong>{" "}
                  teksten, URL's en adressen die je kopieert worden lokaal
                  bewaard.
                </li>
                <li>
                  <strong className="text-foreground">
                    Persoonlijk woordenboek:
                  </strong>{" "}
                  veelgebruikte woorden worden lokaal geleerd om autocorrectie
                  te verbeteren.
                </li>
                <li>
                  <strong className="text-foreground">App-instellingen:</strong>{" "}
                  taalkeuze, onboardingstatus, gekozen abonnement.
                </li>
              </ul>
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 mt-4">
                <p className="text-accent-light font-medium text-sm leading-relaxed">
                  Belangrijk: alle gegevens blijven uitsluitend op je iPhone.
                  Geen verzending naar onze of externe servers.
                </p>
              </div>
            </Section>

            <Section title="4. Wat wordt NIET verzameld?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>Geen gebruikersaccounts of registratie</li>
                <li>Geen e-mailadressen, namen, telefoonnummers</li>
                <li>Geen locatiegegevens</li>
                <li>Geen toetsaanslagen (geen keylogging)</li>
                <li>
                  Geen analysetools (geen Google Analytics, Firebase, Clarity)
                </li>
                <li>Geen advertenties of advertentienetwerken</li>
                <li>Geen delen met derden</li>
              </ul>
            </Section>

            <Section title="5. Toetsenbordextensie & Volledige toegang">
              <p className="text-muted leading-relaxed mb-3">
                Het toetsenbord is een iOS Custom Keyboard Extension. Om
                toegang te krijgen tot de klembordgeschiedenis moet je{" "}
                <strong className="text-foreground">
                  „Volledige toegang toestaan"
                </strong>{" "}
                inschakelen in iOS-instellingen.
              </p>
              <p className="text-muted leading-relaxed mb-3 font-medium text-foreground text-sm">
                Waarvoor is Volledige toegang nodig?
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Om de lokale klembordgeschiedenis te delen tussen app en
                  toetsenbord via iOS App Groups.
                </li>
                <li>
                  Om het klembord te lezen wanneer je op het klembordicoon in
                  het toetsenbord tikt.
                </li>
                <li>
                  Voor de vertaal-roundtrip naar de host-app (het Apple
                  Translation Framework draait alleen in de host-app).
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Volledige toegang wordt{" "}
                <strong className="text-foreground">uitsluitend lokaal</strong>{" "}
                gebruikt. Het toetsenbord verzendt geen gegevens naar externe
                servers. Je kunt het op elk moment intrekken via iOS-instellingen.
              </p>
            </Section>

            <Section title="6. iCloud (CloudKit) — alleen voor promotiecodes">
              <p className="text-muted leading-relaxed mb-3">
                Als je een promotiecode inwisselt, gebruiken we Apple's CloudKit
                Public Database voor eenmalige activering. We slaan op:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Een anonieme apparaat-identifier (willekeurige UUID — geen
                  Apple ID, geen naam)
                </li>
                <li>
                  Een hash van de code (SHA-256) om dubbel gebruik te
                  voorkomen
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                De gegevens bevinden zich in je eigen iCloud-ruimte onder Apple's
                verantwoordelijkheid. We kunnen verwijdering aanvragen — zie
                contact hieronder.
              </p>
            </Section>

            <Section title="7. Apple Translation Framework">
              <p className="text-muted leading-relaxed">
                Vertalingen verlopen via het Apple Translation Framework. Apple
                verwerkt tekst op het apparaat of via Apple-servers — zie het
                privacybeleid van Apple. Wij sturen geen tekst naar eigen of
                externe servers.
              </p>
            </Section>

            <Section title="8. Agenda">
              <p className="text-muted leading-relaxed">
                Als je agenda-toegang verleent, worden afspraken alleen in de
                app getoond. Geen verzending.
              </p>
            </Section>

            <Section title="9. In-app aankopen">
              <p className="text-muted leading-relaxed">
                Aankopen worden afgehandeld via Apple StoreKit 2. Wij ontvangen
                geen betalingsinformatie. Het privacybeleid van Apple is van
                toepassing.
              </p>
            </Section>

            <Section title="10. Jouw rechten (AVG)">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Inzage:</strong> omdat we
                  geen persoonsgegevens verzamelen, hebben we geen toegang tot
                  je gegevens.
                </li>
                <li>
                  <strong className="text-foreground">
                    Lokale verwijdering:
                  </strong>{" "}
                  verwijder de app — alle lokale gegevens worden door iOS
                  verwijderd.
                </li>
                <li>
                  <strong className="text-foreground">
                    CloudKit-promo verwijderen:
                  </strong>{" "}
                  stuur een e-mail naar support@kojalytics.com met onderwerp
                  „CloudKit-verwijdering Copy Paste Pro".
                </li>
              </ul>
            </Section>

            <Section title="11. Kinderen">
              <p className="text-muted leading-relaxed">
                Copy Paste Pro richt zich niet op kinderen onder de 16 jaar.
                Omdat er geen persoonsgegevens worden verzameld, is het gebruik
                verder onbezwaard.
              </p>
            </Section>

            <Section title="12. Wijzigingen">
              <p className="text-muted leading-relaxed">
                We kunnen deze verklaring zo nodig bijwerken. De actuele versie
                is altijd beschikbaar op deze URL.
              </p>
            </Section>

            <Section title="13. Contact">
              <p className="text-muted leading-relaxed">
                Privacygerelateerde vragen:{" "}
                <a
                  href="mailto:support@kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  support@kojalytics.com
                </a>
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}
