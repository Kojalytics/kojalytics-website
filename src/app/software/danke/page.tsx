import Stripe from "stripe";
import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DownloadButton from "@/components/software/DownloadButton";
import TrackPurchase from "@/components/software/TrackPurchase";
import { issueLicenseForSession, LICENSE_DEVICES } from "@/lib/license-sales";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Danke für deinen Kauf", robots: { index: false } };

async function purchaseFor(sessionId: string | undefined) {
  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId) || !process.env.STRIPE_SECRET_KEY) return null;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const license = await issueLicenseForSession(session);
    if (!license) return null;
    // A non-secret order id for the ad reports (never the session id, which unlocks this page).
    const ref = license.subscription ? session.subscription : session.payment_intent;
    const orderId = typeof ref === "string" ? ref : (ref?.id ?? license.key.slice(0, 8));
    return { license, orderId, amount: (session.amount_total ?? 0) / 100 };
  } catch (e) {
    console.error("Success page: license lookup failed", e);
    return null;
  }
}

const steps = [
  "Öffne die geladene Datei und ziehe den Kojalytics Launcher in den Ordner „Programme“.",
  "Starte den Launcher und gehe zu Einstellungen › Lizenz.",
  "Füge deinen Schlüssel ein und klicke auf „Aktivieren“.",
  "Installiere die Koja-Apps, die du brauchst, direkt im Launcher.",
];

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  // Set by /software/danke/start; the query parameter only covers links from before that route existed.
  const session_id = (await cookies()).get("kj_session")?.value ?? (await searchParams).session_id;
  const purchase = await purchaseFor(session_id);

  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-28 md:pt-36">
        {purchase ? (
          <>
            <TrackPurchase orderId={purchase.orderId} value={purchase.amount} subscription={purchase.license.subscription} />
            <p className="eyebrow text-success">Zahlung erfolgreich</p>
            <h1 className="display mt-3 text-5xl sm:text-6xl">Danke! Hier ist dein Schlüssel.</h1>
            <div data-clarity-mask="true" className="mt-8 select-all break-all rounded-[16px] border border-border bg-surface p-5 font-mono text-lg tracking-wider">
              {purchase.license.key}
            </div>
            <p className="mt-3 text-sm text-muted">
              {purchase.license.email ? `Wir haben ihn auch an ${purchase.license.email} geschickt.` : "Bitte kopiere ihn jetzt und bewahre ihn gut auf."}
            </p>
            <div className="mt-8">
              <DownloadButton source="danke" label="Launcher laden · macOS" />
            </div>
            <ol className="mt-10 grid gap-3">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-4 rounded-[16px] border border-border p-4">
                  <span className="display text-2xl text-accent">{i + 1}</span>
                  <span className="pt-0.5 leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm leading-relaxed text-muted">
              {purchase.license.subscription
                ? `Dein Monatsabo gilt für alle Koja-Apps auf bis zu ${LICENSE_DEVICES} Macs. Kündigen kannst du jederzeit online unter `
                : `Deine dauerhafte Lizenz gilt für alle Koja-Apps auf bis zu ${LICENSE_DEVICES} Macs.`}
              {purchase.license.subscription && (
                <Link href="/kuendigen" className="text-foreground underline underline-offset-2">
                  Verträge hier kündigen
                </Link>
              )}
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow">Einen Moment</p>
            <h1 className="display mt-3 text-5xl sm:text-6xl">Wir finden deinen Kauf noch nicht.</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Wenn du gerade bezahlt hast, lade die Seite in ein paar Sekunden neu. Dein Schlüssel kommt außerdem per E-Mail. Fragen?
              Schreib an support@kojalytics.com oder nutze die{" "}
              <Link href="/kontakt" className="text-foreground underline underline-offset-2">
                Kontaktseite
              </Link>
              .
            </p>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
