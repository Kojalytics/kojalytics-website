import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Copy Paste Pro",
  description:
    "Politique de confidentialité de l'app iOS Copy Paste Pro de Kojalytics. Toutes les données restent sur votre appareil — aucun suivi, aucune publicité.",
  alternates: {
    canonical: "https://kojalytics.com/copypastepro/fr/confidentialite",
    languages: {
      de: "https://kojalytics.com/copypastepro/de/datenschutz",
      en: "https://kojalytics.com/copypastepro/en/privacy",
      fr: "https://kojalytics.com/copypastepro/fr/confidentialite",
      es: "https://kojalytics.com/copypastepro/es/privacidad",
      nl: "https://kojalytics.com/copypastepro/nl/privacy",
    },
  },
};

export default function CopyPasteProConfidentialitePage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent-light text-sm font-medium tracking-wide uppercase mb-3">
            Copy Paste Pro
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Politique de confidentialité
          </h1>
          <p className="text-muted text-sm mb-10">
            Dernière mise à jour&nbsp;: 30 mai 2026
          </p>

          <div className="glass-card rounded-2xl p-10 space-y-10">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
              <p className="text-accent-light font-medium text-sm leading-relaxed">
                Copy Paste Pro stocke vos données exclusivement sur votre
                appareil. Aucune transmission serveur, aucune analyse, aucun
                suivi, aucune publicité.
              </p>
            </div>

            <Section title="1. Responsable du traitement">
              <p className="text-muted leading-relaxed">
                Kojalytics
                <br />
                E-mail&nbsp;:{" "}
                <a
                  href="mailto:support@kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  support@kojalytics.com
                </a>
                <br />
                Site web&nbsp;:{" "}
                <a
                  href="https://kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  kojalytics.com
                </a>
              </p>
            </Section>

            <Section title="2. Que fait Copy Paste Pro&nbsp;?">
              <p className="text-muted leading-relaxed">
                Copy Paste Pro est un gestionnaire de presse-papiers avec son
                propre clavier iOS en 12 langues, traduction intégrée via Apple
                Translation, intégration calendrier et correction automatique
                assistée par IA. Tout le traitement est local.
              </p>
            </Section>

            <Section title="3. Quelles données sont traitées localement&nbsp;?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">
                    Historique du presse-papiers&nbsp;:
                  </strong>{" "}
                  textes, URL et adresses copiés, enregistrés localement.
                </li>
                <li>
                  <strong className="text-foreground">
                    Dictionnaire personnel&nbsp;:
                  </strong>{" "}
                  mots fréquents appris localement pour améliorer la correction.
                </li>
                <li>
                  <strong className="text-foreground">Paramètres&nbsp;:</strong>{" "}
                  choix de langue, statut d'onboarding, plan choisi.
                </li>
              </ul>
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 mt-4">
                <p className="text-accent-light font-medium text-sm leading-relaxed">
                  Important&nbsp;: toutes les données restent exclusivement sur
                  votre iPhone. Aucune transmission à nos serveurs ou à des
                  tiers.
                </p>
              </div>
            </Section>

            <Section title="4. Ce qui N'EST PAS collecté">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>Aucun compte utilisateur ni inscription</li>
                <li>Aucune adresse e-mail, nom, numéro de téléphone</li>
                <li>Aucune donnée de localisation</li>
                <li>Aucune frappe (pas de keylogging)</li>
                <li>
                  Aucun outil d'analyse (pas de Google Analytics, Firebase,
                  Clarity)
                </li>
                <li>Aucune publicité, aucun réseau publicitaire</li>
                <li>Aucun partage avec des tiers</li>
              </ul>
            </Section>

            <Section title="5. Extension clavier & Accès complet">
              <p className="text-muted leading-relaxed mb-3">
                Le clavier est une extension iOS Custom Keyboard. Pour accéder à
                l'historique du presse-papiers, vous devez activer{" "}
                <strong className="text-foreground">
                  «&nbsp;Autoriser l'accès complet&nbsp;»
                </strong>{" "}
                dans les réglages iOS.
              </p>
              <p className="text-muted leading-relaxed mb-3 font-medium text-foreground text-sm">
                Pourquoi l'accès complet est-il nécessaire&nbsp;?
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Partage local de l'historique entre l'app et le clavier via
                  iOS App Groups.
                </li>
                <li>
                  Lecture du presse-papiers lors du tap sur l'icône presse-
                  papiers du clavier.
                </li>
                <li>
                  Roundtrip de traduction vers l'app hôte (le framework Apple
                  Translation ne tourne que dans l'app hôte).
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                L'accès complet est utilisé{" "}
                <strong className="text-foreground">
                  exclusivement en local
                </strong>
                . Le clavier n'envoie aucune donnée à des serveurs externes.
                Vous pouvez le révoquer à tout moment dans les réglages iOS.
              </p>
            </Section>

            <Section title="6. iCloud (CloudKit) — codes promo uniquement">
              <p className="text-muted leading-relaxed mb-3">
                Si vous utilisez un code promo, nous utilisons CloudKit Public
                Database d'Apple pour l'activation unique. Nous stockons&nbsp;:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Un identifiant d'appareil anonyme (UUID aléatoire — pas
                  d'identifiant Apple, pas de nom)
                </li>
                <li>
                  Un hachage du code (SHA-256) pour empêcher la double
                  utilisation
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Les données résident dans votre propre espace iCloud sous la
                responsabilité d'Apple. Nous pouvons demander leur suppression —
                voir contact ci-dessous.
              </p>
            </Section>

            <Section title="7. Apple Translation Framework">
              <p className="text-muted leading-relaxed">
                Les traductions passent par le framework Apple Translation.
                Apple traite le texte localement ou via ses serveurs — voir la
                politique d'Apple. Nous n'envoyons aucun texte à nos serveurs ou
                à des tiers.
              </p>
            </Section>

            <Section title="8. Calendrier">
              <p className="text-muted leading-relaxed">
                Si vous accordez l'accès au calendrier, les événements sont
                affichés uniquement dans l'app. Aucune transmission.
              </p>
            </Section>

            <Section title="9. Achats intégrés">
              <p className="text-muted leading-relaxed">
                Les achats passent par Apple StoreKit 2. Nous ne recevons aucune
                information de paiement. La politique d'Apple s'applique.
              </p>
            </Section>

            <Section title="10. Vos droits (RGPD)">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Accès&nbsp;:</strong>{" "}
                  comme nous ne collectons aucune donnée personnelle, nous n'y
                  avons pas accès.
                </li>
                <li>
                  <strong className="text-foreground">
                    Suppression locale&nbsp;:
                  </strong>{" "}
                  désinstallez l'app — toutes les données locales sont
                  supprimées par iOS.
                </li>
                <li>
                  <strong className="text-foreground">
                    Suppression CloudKit promo&nbsp;:
                  </strong>{" "}
                  envoyez un e-mail à support@kojalytics.com avec l'objet
                  «&nbsp;Suppression CloudKit Copy Paste Pro&nbsp;».
                </li>
              </ul>
            </Section>

            <Section title="11. Enfants">
              <p className="text-muted leading-relaxed">
                Copy Paste Pro ne s'adresse pas aux enfants de moins de 16 ans.
                Aucune donnée personnelle n'étant collectée, l'utilisation reste
                par ailleurs sans risque.
              </p>
            </Section>

            <Section title="12. Modifications">
              <p className="text-muted leading-relaxed">
                Nous pouvons mettre à jour cette politique si nécessaire. La
                version actuelle est toujours disponible à cette URL.
              </p>
            </Section>

            <Section title="13. Contact">
              <p className="text-muted leading-relaxed">
                Questions relatives à la confidentialité&nbsp;:{" "}
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
