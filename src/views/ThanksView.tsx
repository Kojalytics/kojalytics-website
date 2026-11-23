import Stripe from "stripe";
import Link from "next/link";
import { cookies } from "next/headers";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DownloadButton from "@/components/software/DownloadButton";
import TrackPurchase from "@/components/software/TrackPurchase";
import SectionBar from "@/components/instrument/SectionBar";
import { issueLicenseForSession, LICENSE_DEVICES } from "@/lib/license-sales";
import { href, type Lang } from "@/lib/i18n";

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

const de = {
  purchase: "Dein Kauf",
  purchaseMeta: "Lizenzschlüssel · Kojalytics Launcher",
  paid: "Zahlung erfolgreich",
  title: ["Danke! Hier ist dein ", "Schlüssel", "."],
  sentTo: (email: string) => `Wir haben ihn auch an ${email} geschickt.`,
  keep: "Bitte kopiere ihn jetzt und bewahre ihn gut auf.",
  download: "Launcher laden",
  setup: "Einrichtung",
  setupMeta: (n: number) => `${n} Schritte · Kojalytics Launcher`,
  steps: [
    "Öffne die geladene Datei. Mac: Ziehe den Kojalytics Launcher in den Ordner „Programme“. Windows: Folge dem Installations-Assistenten.",
    "Starte den Launcher und gehe zu Einstellungen › Lizenz.",
    "Füge deinen Schlüssel ein und klicke auf „Aktivieren“.",
    "Installiere die Koja-Apps, die du brauchst, direkt im Launcher.",
  ],
  monthly: `Dein Monatsabo gilt für alle Koja-Apps auf bis zu ${LICENSE_DEVICES} Geräten (Mac oder Windows-PC). Kündigen kannst du jederzeit online unter `,
  lifetime: `Deine dauerhafte Lizenz gilt für alle Koja-Apps auf bis zu ${LICENSE_DEVICES} Geräten (Mac oder Windows-PC).`,
  cancel: "Verträge hier kündigen",
  wait: "Einen Moment",
  notFound: ["Wir finden deinen Kauf ", "noch", " nicht."],
  notFoundText:
    "Wenn du gerade bezahlt hast, lade die Seite in ein paar Sekunden neu. Dein Schlüssel kommt außerdem per E-Mail. Fragen? Schreib an support@kojalytics.com oder nutze die",
  contact: "Kontaktseite",
};

const en: typeof de = {
  purchase: "Your purchase",
  purchaseMeta: "License key · Kojalytics Launcher",
  paid: "Payment successful",
  title: ["Thank you! Here's your ", "key", "."],
  sentTo: (email: string) => `We've also sent it to ${email}.`,
  keep: "Please copy it now and keep it somewhere safe.",
  download: "Download the launcher",
  setup: "Setup",
  setupMeta: (n: number) => `${n} steps · Kojalytics Launcher`,
  steps: [
    "Open the downloaded file. Mac: drag the Kojalytics Launcher into the Applications folder. Windows: follow the setup wizard.",
    "Start the launcher and go to Settings › License.",
    "Paste your key and click “Activate”.",
    "Install the Koja apps you need, right in the launcher.",
  ],
  monthly: `Your monthly subscription covers all Koja apps on up to ${LICENSE_DEVICES} devices (Mac or Windows PC). You can cancel online at any time: `,
  lifetime: `Your license (one-time purchase, no expiry date) covers all Koja apps on up to ${LICENSE_DEVICES} devices (Mac or Windows PC).`,
  cancel: "cancel your subscription here",
  wait: "One moment",
  notFound: ["We can't find your purchase ", "yet", "."],
  notFoundText:
    "If you've just paid, reload this page in a few seconds. Your key is also on its way by email. Questions? Write to support@kojalytics.com or use the",
  contact: "contact page",
};

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

/**
 * The thank-you page after Stripe Checkout (/software/danke, /en/thanks): the license key, the launcher download and
 * the setup steps. The checkout session id comes from the cookie set by …/start (or, for old links, ?session_id=).
 */
export default async function ThanksView({ lang, searchParams }: { lang: Lang; searchParams: Promise<{ session_id?: string }> }) {
  const t = lang === "de" ? de : en;
  // Set by /software/danke/start (/en/thanks/start); the query parameter only covers links from before that route existed.
  const session_id = (await cookies()).get("kj_session")?.value ?? (await searchParams).session_id;
  const purchase = await purchaseFor(session_id);

  return (
    <>
      <Navigation />
      <main className="pt-12">
        {purchase ? (
          <>
            <TrackPurchase orderId={purchase.orderId} value={purchase.amount} subscription={purchase.license.subscription} />
            {/* 01 License key and download */}
            <section className="rail">
              <SectionBar index="01" label={t.purchase} meta={t.purchaseMeta} />
              <div className={`py-14 md:py-20 ${pad}`}>
                <div className="max-w-3xl">
                  <p className="hud rise-in flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
                    <span className="text-success">{t.paid}</span>
                  </p>
                  <h1 className="display rise-in mt-5 text-[clamp(2rem,4vw,3.2rem)] [--i:1]">
                    {t.title[0]}<span className="text-highlight">{t.title[1]}</span>{t.title[2]}
                  </h1>
                  <div
                    data-clarity-mask="true"
                    className="rise-in mt-8 select-all border border-border-strong bg-surface p-5 font-mono text-base tracking-wider wrap-anywhere [--i:2] sm:text-lg"
                  >
                    {purchase.license.key}
                  </div>
                  <p className="rise-in mt-3 text-sm text-muted [--i:2]">
                    {purchase.license.email ? t.sentTo(purchase.license.email) : t.keep}
                  </p>
                  <div className="rise-in mt-8 [--i:3]">
                    <DownloadButton source="danke" label={t.download} mobile="send" />
                  </div>
                </div>
              </div>
            </section>

            {/* 02 Setup steps */}
            <section className="rail crosshairs">
              <SectionBar index="02" label={t.setup} meta={t.setupMeta(t.steps.length)} />
              <ol className="cells border-b border-border sm:grid-cols-2 lg:grid-cols-4">
                {t.steps.map((s, i) => (
                  <li key={s} className="flex flex-col gap-5 p-6 md:p-8" data-reveal style={{ ["--i" as string]: i }}>
                    <span className="hud text-faint">{two(i + 1)}</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
              <div className={`py-8 md:py-10 ${pad}`}>
                <p className="max-w-3xl text-[15px] leading-relaxed text-muted" data-reveal>
                  {purchase.license.subscription ? t.monthly : t.lifetime}
                  {purchase.license.subscription && (
                    <Link href={href(lang, "/kuendigen")} className="text-foreground underline underline-offset-4">
                      {t.cancel}
                    </Link>
                  )}
                </p>
              </div>
            </section>
          </>
        ) : (
          <section className="rail">
            <SectionBar index="01" label={t.purchase} meta={t.purchaseMeta} />
            <div className={`py-14 md:py-20 ${pad}`}>
              <div className="max-w-3xl">
                <p className="hud rise-in flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-faint" aria-hidden />
                  {t.wait}
                </p>
                <h1 className="display rise-in mt-5 text-[clamp(2rem,4vw,3.2rem)] [--i:1]">
                  {t.notFound[0]}<span className="text-highlight">{t.notFound[1]}</span>{t.notFound[2]}
                </h1>
                <p className="rise-in mt-6 text-lg leading-relaxed text-muted [--i:2]">
                  {t.notFoundText}{" "}
                  <Link href={href(lang, "/kontakt")} className="text-foreground underline underline-offset-4">
                    {t.contact}
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer offer={false} lang={lang} />
    </>
  );
}
