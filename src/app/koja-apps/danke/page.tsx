import Stripe from "stripe";
import Link from "next/link";
import { issueLicenseForSession, LAUNCHER_DOWNLOAD_URL, LICENSE_DEVICES } from "@/lib/license-sales";
import "../koja-apps.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Danke für deinen Kauf | Kojalytics", robots: { index: false } };

async function licenseFor(sessionId: string | undefined) {
  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId) || !process.env.STRIPE_SECRET_KEY) return null;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return await issueLicenseForSession(session);
  } catch (e) {
    console.error("Success page: license lookup failed", e);
    return null;
  }
}

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const license = await licenseFor(session_id);

  return (
    <main className="koja">
      <section className="koja-hero koja-thanks">
        {license ? (
          <>
            <p className="koja-eyebrow">Zahlung erfolgreich</p>
            <h1>
              Danke! <span>Hier ist dein Schlüssel.</span>
            </h1>
            <div className="koja-key">{license.key}</div>
            <p className="koja-fine">
              {license.email
                ? `Wir haben ihn auch an ${license.email} geschickt.`
                : "Bitte kopiere ihn jetzt und bewahre ihn gut auf."}
            </p>
            <a className="koja-buy koja-download" href={LAUNCHER_DOWNLOAD_URL}>
              Kojalytics Launcher laden · macOS
            </a>
            <ol className="koja-steps">
              <li>Öffne die Datei und ziehe den Launcher in den Programme-Ordner.</li>
              <li>Starte den Launcher und gehe zu Einstellungen › Lizenz.</li>
              <li>Füge den Schlüssel ein und klicke auf „Aktivieren“.</li>
              <li>Installiere WordKoja, GridKoja und DeckKoja direkt im Launcher.</li>
            </ol>
            <p className="koja-fine">Gilt lebenslang für alle Koja-Apps auf bis zu {LICENSE_DEVICES} Geräten.</p>
          </>
        ) : (
          <>
            <p className="koja-eyebrow">Einen Moment</p>
            <h1>
              Wir finden <span>deinen Kauf nicht.</span>
            </h1>
            <p className="koja-lead">
              Falls du gerade bezahlt hast, lade die Seite in ein paar Sekunden neu. Dein Schlüssel kommt außerdem per E-Mail.
              Bei Fragen schreib uns über die <Link href="/contact">Kontaktseite</Link>.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
