import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Copy Paste Pro",
  description:
    "Privacy policy for the Copy Paste Pro iOS app by Kojalytics. All data stays on your device — no tracking, no ads.",
  alternates: {
    canonical: "https://kojalytics.com/copypastepro/en/privacy",
    languages: {
      de: "https://kojalytics.com/copypastepro/de/datenschutz",
      en: "https://kojalytics.com/copypastepro/en/privacy",
      fr: "https://kojalytics.com/copypastepro/fr/confidentialite",
      es: "https://kojalytics.com/copypastepro/es/privacidad",
      nl: "https://kojalytics.com/copypastepro/nl/privacy",
    },
  },
};

export default function CopyPasteProPrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent-light text-sm font-medium tracking-wide uppercase mb-3">
            Copy Paste Pro
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-muted text-sm mb-10">
            Last updated: May 30, 2026
          </p>

          <div className="glass-card rounded-2xl p-10 space-y-10">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
              <p className="text-accent-light font-medium text-sm leading-relaxed">
                Copy Paste Pro stores your data exclusively on your device. No
                server transmission, no analytics, no tracking, no ads.
              </p>
            </div>

            <Section title="1. Data Controller">
              <p className="text-muted leading-relaxed">
                Kojalytics
                <br />
                Email:{" "}
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

            <Section title="2. What does Copy Paste Pro do?">
              <p className="text-muted leading-relaxed">
                Copy Paste Pro is a clipboard manager with its own iOS keyboard
                in 12 languages, built-in translation via Apple Translation,
                calendar integration, and AI-assisted autocorrect. All
                processing runs locally on the device.
              </p>
            </Section>

            <Section title="3. What data is processed locally?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">
                    Clipboard history:
                  </strong>{" "}
                  texts, URLs, and addresses you copy are stored in a local
                  history on the device.
                </li>
                <li>
                  <strong className="text-foreground">
                    Personal dictionary:
                  </strong>{" "}
                  frequently used words are learned locally to improve
                  autocorrect.
                </li>
                <li>
                  <strong className="text-foreground">App settings:</strong>{" "}
                  language choice, onboarding state, selected plan.
                </li>
              </ul>
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 mt-4">
                <p className="text-accent-light font-medium text-sm leading-relaxed">
                  Important: all data remains exclusively on your iPhone. No
                  transmission to our or third-party servers.
                </p>
              </div>
            </Section>

            <Section title="4. What is NOT collected?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>No user accounts or registration</li>
                <li>No email addresses, names, phone numbers</li>
                <li>No location data</li>
                <li>
                  No keystrokes (explicit no-keylogging policy)
                </li>
                <li>
                  No analytics tools (no Google Analytics, Firebase, Clarity)
                </li>
                <li>No advertising, no ad networks</li>
                <li>No data sharing with third parties</li>
              </ul>
            </Section>

            <Section title="5. Keyboard Extension & Full Access">
              <p className="text-muted leading-relaxed mb-3">
                The keyboard is an iOS Custom Keyboard Extension. To access the
                clipboard history, you must enable{" "}
                <strong className="text-foreground">"Allow Full Access"</strong>{" "}
                in iOS Settings.
              </p>
              <p className="text-muted leading-relaxed mb-3 font-medium text-foreground text-sm">
                Why is Full Access needed?
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  To share the local clipboard history between the app and
                  keyboard via iOS App Groups.
                </li>
                <li>
                  To read the clipboard when you tap the clipboard icon in the
                  keyboard.
                </li>
                <li>
                  For the translation roundtrip to the host app (Apple
                  Translation Framework only runs in the host app).
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Full Access is used{" "}
                <strong className="text-foreground">exclusively locally</strong>
                . The keyboard does not send any data to external servers. You
                can revoke Full Access anytime in iOS Settings.
              </p>
            </Section>

            <Section title="6. iCloud (CloudKit) — promo codes only">
              <p className="text-muted leading-relaxed mb-3">
                If you redeem a promo code, we use Apple's CloudKit Public
                Database for one-time activation. We store:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  An anonymous device identifier (random UUID — no Apple ID, no
                  name)
                </li>
                <li>
                  A hash of the code (SHA-256) to prevent double redemption
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Data resides in your own iCloud area under Apple's
                responsibility. We can request deletion — see contact below.
              </p>
            </Section>

            <Section title="7. Apple Translation Framework">
              <p className="text-muted leading-relaxed">
                Translations are performed via the Apple Translation Framework.
                Apple processes text on-device or via Apple servers — see
                Apple's privacy policy. We do not send text to our own or
                third-party servers.
              </p>
            </Section>

            <Section title="8. Calendar">
              <p className="text-muted leading-relaxed">
                If you grant calendar access, events are displayed in the app
                only. No transmission takes place.
              </p>
            </Section>

            <Section title="9. In-App Purchases">
              <p className="text-muted leading-relaxed">
                Purchases are handled via Apple StoreKit 2. We receive no
                payment information. Apple's privacy policy applies.
              </p>
            </Section>

            <Section title="10. Your Rights (GDPR / CCPA)">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Access:</strong> since we
                  collect no personal data, we have no access to your data.
                </li>
                <li>
                  <strong className="text-foreground">
                    Local deletion:
                  </strong>{" "}
                  uninstall the app — all local data is removed by iOS.
                </li>
                <li>
                  <strong className="text-foreground">
                    CloudKit promo data deletion:
                  </strong>{" "}
                  email support@kojalytics.com with subject "CloudKit Deletion
                  Copy Paste Pro".
                </li>
              </ul>
            </Section>

            <Section title="11. Children">
              <p className="text-muted leading-relaxed">
                Copy Paste Pro is not directed at children under 16. Since no
                personal data is collected, use is otherwise unrestricted.
              </p>
            </Section>

            <Section title="12. Changes">
              <p className="text-muted leading-relaxed">
                We may update this policy as needed. The current version is
                always available at this URL.
              </p>
            </Section>

            <Section title="13. Contact">
              <p className="text-muted leading-relaxed">
                Privacy-related inquiries:{" "}
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
