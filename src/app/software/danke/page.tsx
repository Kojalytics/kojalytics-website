import Stripe from "stripe";
import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DownloadButton from "@/components/software/DownloadButton";
import TrackPurchase from "@/components/software/TrackPurchase";
import SectionBar from "@/components/instrument/SectionBar";
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

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  // Set by /software/danke/start; the query parameter only covers links from before that route existed.
  const session_id = (await cookies()).get("kj_session")?.value ?? (await searchParams).session_id;
  const purchase = await purchaseFor(session_id);

  return (
    <>
      <Navigation />
      <main className="pt-12">
        {purchase ? (
          <>
            <TrackPurchase orderId={purchase.orderId} value={purchase.amount} subscription={purchase.license.subscription} />
            {/* 01 Licence key and download */}
            <section className="rail">
              <SectionBar index="01" label="Dein Kauf" meta="Lizenzschlüssel · Kojalytics Launcher" />
              <div className={`py-14 md:py-20 ${pad}`}>
                <div className="max-w-3xl">
                  <p className="hud rise-in flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
                    <span className="text-success">Zahlung erfolgreich</span>
                  </p>
                  <h1 className="display rise-in mt-5 text-[clamp(2rem,4vw,3.2rem)] [--i:1]">
                    Danke! Hier ist dein <span className="text-highlight">Schlüssel</span>.
                  </h1>
                  <div
                    data-clarity-mask="true"
                    className="rise-in mt-8 select-all border border-border-strong bg-surface p-5 font-mono text-base tracking-wider wrap-anywhere [--i:2] sm:text-lg"
                  >
                    {purchase.license.key}
                  </div>
                  <p className="rise-in mt-3 text-sm text-muted [--i:2]">
                    {purchase.license.email ? `Wir haben ihn auch an ${purchase.license.email} geschickt.` : "Bitte kopiere ihn jetzt und bewahre ihn gut auf."}
                  </p>
                  <div className="rise-in mt-8 [--i:3]">
                    <DownloadButton source="danke" label="Launcher laden · macOS" />
                  </div>
                </div>
              </div>
            </section>

            {/* 02 Setup steps */}
            <section className="rail crosshairs">
              <SectionBar index="02" label="Einrichtung" meta={`${steps.length} Schritte · Kojalytics Launcher`} />
              <ol className="cells border-b border-border sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((s, i) => (
                  <li key={s} className="flex flex-col gap-5 p-6 md:p-8" data-reveal style={{ ["--i" as string]: i }}>
                    <span className="hud text-faint">{two(i + 1)}</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
              <div className={`py-8 md:py-10 ${pad}`}>
                <p className="max-w-3xl text-[15px] leading-relaxed text-muted" data-reveal>
                  {purchase.license.subscription
                    ? `Dein Monatsabo gilt für alle Koja-Apps auf bis zu ${LICENSE_DEVICES} Macs. Kündigen kannst du jederzeit online unter `
                    : `Deine dauerhafte Lizenz gilt für alle Koja-Apps auf bis zu ${LICENSE_DEVICES} Macs.`}
                  {purchase.license.subscription && (
                    <Link href="/kuendigen" className="text-foreground underline underline-offset-4">
                      Verträge hier kündigen
                    </Link>
                  )}
                </p>
              </div>
            </section>
          </>
        ) : (
          <section className="rail">
            <SectionBar index="01" label="Dein Kauf" meta="Lizenzschlüssel · Kojalytics Launcher" />
            <div className={`py-14 md:py-20 ${pad}`}>
              <div className="max-w-3xl">
                <p className="hud rise-in flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-faint" aria-hidden />
                  Einen Moment
                </p>
                <h1 className="display rise-in mt-5 text-[clamp(2rem,4vw,3.2rem)] [--i:1]">
                  Wir finden deinen Kauf <span className="text-highlight">noch</span> nicht.
                </h1>
                <p className="rise-in mt-6 text-lg leading-relaxed text-muted [--i:2]">
                  Wenn du gerade bezahlt hast, lade die Seite in ein paar Sekunden neu. Dein Schlüssel kommt außerdem per E-Mail. Fragen?
                  Schreib an support@kojalytics.com oder nutze die{" "}
                  <Link href="/kontakt" className="text-foreground underline underline-offset-4">
                    Kontaktseite
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
