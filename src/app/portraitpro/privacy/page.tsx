import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — PortraitPro AI",
  description: "Privacy Policy for PortraitPro AI. GDPR compliant. No tracking, no analytics, no user profiles.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent-light text-sm font-medium tracking-wide uppercase mb-3">
            PortraitPro AI
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-muted text-sm mb-10">
            Last updated: March 27, 2026
          </p>

          <div className="glass-card rounded-2xl p-10 space-y-10">
            {/* Highlight box */}
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
              <p className="text-accent-light font-medium text-sm leading-relaxed">
                PortraitPro AI does not collect personal data, does not create
                user profiles, and does not use any tracking or analytics tools.
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

            <Section title="2. What Data Is Processed?">
              <p className="text-muted leading-relaxed mb-3">
                PortraitPro AI only processes data that is strictly necessary for
                generating AI portraits:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Reference Photos:</strong>{" "}
                  The photos you select (max. 5) are transmitted to our server
                  and then forwarded to the{" "}
                  <strong className="text-foreground">
                    third-party AI service Google Gemini API
                  </strong>{" "}
                  (see sections 4 and 6).
                </li>
                <li>
                  <strong className="text-foreground">
                    Portrait Settings:
                  </strong>{" "}
                  Your chosen style options (e.g., style, framing, background).
                </li>
                <li>
                  <strong className="text-foreground">Purchase Data:</strong>{" "}
                  Transaction IDs for in-app purchases are stored locally on
                  your device. Payment processing is handled exclusively by
                  Apple.
                </li>
              </ul>
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 mt-4">
                <p className="text-accent-light font-medium text-sm leading-relaxed">
                  Important: Before your photos are transmitted to the AI
                  service for the first time, the app will ask for your explicit
                  consent. Without your approval, no photos will be sent to
                  third parties.
                </p>
              </div>
            </Section>

            <Section title="3. What Is NOT Collected?">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>No user accounts or registration required</li>
                <li>No email addresses, names, or phone numbers</li>
                <li>No location data</li>
                <li>
                  No analytics or tracking tools (no Google Analytics, Firebase,
                  etc.)
                </li>
                <li>No advertising or ad networks</li>
                <li>No sharing of data with third parties for marketing purposes</li>
              </ul>
            </Section>

            <Section title="4. How Are Your Photos Processed?">
              <p className="text-muted leading-relaxed mb-3">
                Your reference photos are processed as follows:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Photos are transmitted encrypted (HTTPS) to our server
                  (Supabase).
                </li>
                <li>
                  <strong className="text-foreground">
                    Third-Party AI Service:
                  </strong>{" "}
                  For image generation, your reference photos are forwarded to
                  the{" "}
                  <strong className="text-foreground">Google Gemini API</strong>{" "}
                  (a third-party AI service by Google LLC).
                  <ul className="mt-2 ml-4 space-y-1 list-disc list-inside">
                    <li>
                      <strong className="text-foreground">
                        Data Transmitted:
                      </strong>{" "}
                      Your reference photos (facial images) and style/formatting
                      instructions.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Purpose:
                      </strong>{" "}
                      Exclusively for generating your AI portraits.
                    </li>
                    <li>
                      <strong className="text-foreground">Consent:</strong>{" "}
                      Transmission only occurs after your explicit consent
                      during the app onboarding (legal basis: Art. 6(1)(a),
                      Art. 9(2)(a) GDPR).
                    </li>
                    <li>
                      Google processes images in accordance with the{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-light hover:underline"
                      >
                        Google Privacy Policy
                      </a>{" "}
                      and ensures equivalent data protection standards.
                    </li>
                  </ul>
                </li>
                <li>
                  After generation is complete, reference photos are deleted
                  from both our server and Google.
                </li>
                <li>
                  Generated portraits are made available via time-limited,
                  signed URLs (1-hour validity).
                </li>
              </ul>
            </Section>

            <Section title="5. Data Storage">
              <p className="text-muted leading-relaxed mb-3 font-medium text-foreground text-sm">
                On Your Device (local):
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed mb-4">
                <li>
                  Generated portraits and preview images in app storage
                </li>
                <li>
                  Purchase receipts and settings in the encrypted iOS Keychain
                </li>
                <li>
                  Vault data with automatic expiration (24 hours to 30 days
                  depending on package)
                </li>
              </ul>
              <p className="text-muted leading-relaxed mb-3 font-medium text-foreground text-sm">
                On Our Server:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Reference photos are deleted after processing
                </li>
                <li>
                  Generated portraits are stored temporarily and are only
                  accessible via time-limited URLs
                </li>
                <li>
                  Job metadata (status, timestamps) is stored — without
                  personal reference
                </li>
              </ul>
            </Section>

            <Section title="6. Third-Party Services">
              <p className="text-muted leading-relaxed mb-3">
                The app uses the following third-party services:
              </p>
              <ul className="text-muted space-y-3 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">
                    Google Gemini API (Third-Party AI Service):
                  </strong>{" "}
                  For AI-based image generation. Your reference photos (facial
                  images) are transmitted to Google LLC, exclusively for the
                  purpose of portrait generation. Transmission only occurs after
                  your explicit consent. Google processes data in accordance
                  with the{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-light hover:underline"
                  >
                    Google Privacy Policy
                  </a>{" "}
                  and ensures equivalent data protection. Photos are deleted at
                  Google after processing.
                </li>
                <li>
                  <strong className="text-foreground">Supabase:</strong>{" "}
                  Backend infrastructure for secure data processing and storage.
                  Servers located in the EU.
                </li>
                <li>
                  <strong className="text-foreground">Apple StoreKit:</strong>{" "}
                  For in-app purchases. Apple processes payment data in
                  accordance with the{" "}
                  <a
                    href="https://www.apple.com/legal/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-light hover:underline"
                  >
                    Apple Privacy Policy
                  </a>
                  .
                </li>
              </ul>
            </Section>

            <Section title="7. Data Security">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  All data transfers are encrypted via HTTPS
                </li>
                <li>
                  Local data is encrypted in the iOS Keychain
                </li>
                <li>
                  Access to generated portraits only via time-limited, signed
                  URLs
                </li>
                <li>
                  Security through unique, non-guessable job IDs
                </li>
              </ul>
            </Section>

            <Section title="8. Your Rights (GDPR)">
              <p className="text-muted leading-relaxed mb-3">
                As a user within the EU, you have the following rights:
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Access:</strong> You may
                  request information about what data is stored about you.
                </li>
                <li>
                  <strong className="text-foreground">Deletion:</strong> You may
                  request the deletion of your data.
                </li>
                <li>
                  <strong className="text-foreground">Objection:</strong> You
                  may object to the processing of your data.
                </li>
                <li>
                  <strong className="text-foreground">
                    Data Portability:
                  </strong>{" "}
                  You may request your data in a commonly used format.
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                Since the app does not use user accounts, no personal data is
                stored permanently. For questions or to exercise your rights,
                contact us at{" "}
                <a
                  href="mailto:support@kojalytics.com"
                  className="text-accent-light hover:underline"
                >
                  support@kojalytics.com
                </a>
                .
              </p>
            </Section>

            <Section title="9. Device Permissions">
              <ul className="text-muted space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">
                    Photo Library (Read):
                  </strong>{" "}
                  To select reference photos for portrait generation.
                </li>
                <li>
                  <strong className="text-foreground">
                    Photo Library (Write):
                  </strong>{" "}
                  To save generated portraits to your photo library.
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-3">
                No additional permissions are required (no camera, microphone,
                location, or contacts access).
              </p>
            </Section>

            <Section title="10. Children">
              <p className="text-muted leading-relaxed">
                PortraitPro AI is not directed at children under 16 years of
                age. We do not knowingly collect data from children.
              </p>
            </Section>

            <Section title="11. Changes to This Privacy Policy">
              <p className="text-muted leading-relaxed">
                We reserve the right to update this privacy policy as needed.
                The current version is always available at this URL.
              </p>
            </Section>

            <Section title="12. Contact">
              <p className="text-muted leading-relaxed">
                For privacy-related questions, reach us at:{" "}
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
