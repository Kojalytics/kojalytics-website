import Stripe from "stripe";
import Link from "next/link";
import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DownloadButton from "@/components/software/DownloadButton";
import TrackPurchase from "@/components/software/TrackPurchase";
import { issueLicenseForSession, LICENSE_DEVICES } from "@/lib/license-sales";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

async function purchaseFor(sessionId: string | undefined) {
  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId) || !process.env.STRIPE_SECRET_KEY) return null;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const license = await issueLicenseForSession(session);
    return license ? { license, amount: (session.amount_total ?? 0) / 100 } : null;
  } catch (e) {
    console.error("Success page: license lookup failed", e);
    return null;
  }
}

const steps = [
  "Open the downloaded file and drag the Kojalytics Launcher into your Applications folder.",
  "Start the Launcher and go to Settings › License.",
  "Paste your key and click “Activate”.",
  "Install the Koja apps you need right in the Launcher.",
];

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const purchase = await purchaseFor(session_id);

  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-32 md:pt-40">
        {purchase && session_id ? (
          <>
            <TrackPurchase sessionId={session_id} value={purchase.amount} subscription={purchase.license.subscription} />
            <p className="eyebrow text-accent">Payment successful</p>
            <h1 className="display mt-3 text-6xl sm:text-7xl">
              Thank you. <span className="text-highlight">Here is your key.</span>
            </h1>
            <div className="mt-8 select-all break-all rounded-[14px] border border-accent/50 bg-surface p-5 font-mono text-lg tracking-wider">
              {purchase.license.key}
            </div>
            <p className="mt-3 text-sm text-muted">
              {purchase.license.email
                ? `We also sent it to ${purchase.license.email}.`
                : "Please copy it now and keep it somewhere safe."}
            </p>
            <div className="mt-8">
              <DownloadButton source="thanks" label="Download the Launcher · macOS" />
            </div>
            <ol className="mt-10 grid gap-4">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-4 rounded-[14px] border border-border bg-surface p-4">
                  <span className="display text-3xl text-accent">{i + 1}</span>
                  <span className="pt-1 leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm leading-relaxed text-muted">
              {purchase.license.subscription
                ? `Your monthly plan covers all Koja apps on up to ${LICENSE_DEVICES} Macs. You can cancel any time in one click on `
                : `Your lifetime license covers all Koja apps on up to ${LICENSE_DEVICES} Macs.`}
              {purchase.license.subscription && (
                <Link href="/cancel" className="text-foreground underline underline-offset-2">kojalytics.com/cancel</Link>
              )}
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow">One moment</p>
            <h1 className="display mt-3 text-6xl sm:text-7xl">
              We can&apos;t find <span className="text-highlight">your purchase yet.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              If you just paid, reload this page in a few seconds. Your key is also on its way by email. Questions? Write to
              support@kojalytics.com or use the <Link href="/contact" className="text-foreground underline underline-offset-2">contact page</Link>.
            </p>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
