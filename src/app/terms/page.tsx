import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Terms for the Koja apps",
  description: "Terms of purchase for the Koja apps: monthly plan, lifetime license, cancellation and right of withdrawal.",
  alternates: { canonical: "/terms" },
  robots: { index: false },
};

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. Provider",
    body: ["The Koja apps are sold by Kojalytics. Our full company details are listed in the Impressum."],
  },
  {
    title: "2. What you buy",
    body: [
      "A license to use all Koja apps for macOS on up to 3 devices of your own, delivered as a license key for the Kojalytics Launcher.",
      `You can test the apps free of charge for ${TRIAL_DAYS} days after download. The trial ends automatically and costs nothing.`,
    ],
  },
  {
    title: "3. Monthly plan",
    body: [
      `${PLANS.monthly.label} per month including VAT, billed in advance each month via Stripe.`,
      "The plan renews monthly until you cancel. You can cancel at any time at kojalytics.com/cancel without a fee; the plan then ends at the end of the month already paid. After it ends, the license key stops working.",
    ],
  },
  {
    title: "4. Lifetime license",
    body: [`${PLANS.lifetime.label} once including VAT. The license does not expire and does not renew.`],
  },
  {
    title: "5. Right of withdrawal",
    body: [
      "As a consumer you generally have a 14-day right of withdrawal. For digital content it ends early if you expressly agree that we start before the withdrawal period ends and confirm that you know you lose your right of withdrawal. We ask for this agreement before checkout and deliver the license key right after payment.",
    ],
  },
  {
    title: "6. Open-source software",
    body: [
      "The Koja apps are based on open-source software by the ArtCraft team, published under the MIT and Apache-2.0 licenses. Those licenses apply to the source code and remain unaffected by these terms.",
    ],
  },
];

export default function TermsPage() {
  const preview = process.env.VERCEL_ENV !== "production";
  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-32 md:pt-40">
        <p className="eyebrow">Terms</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Terms for the Koja apps</h1>
        {preview && (
          <p className="mt-6 rounded-[14px] border border-dashed border-accent/60 p-4 text-sm text-accent">
            [Preview only] Draft written by the website team. Have it reviewed by a lawyer, add the full withdrawal notice and
            model withdrawal form, and add a German version before launch.
          </p>
        )}
        <div className="mt-10 grid gap-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-bold">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-muted">{p}</p>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted">
          Questions about these terms: support@kojalytics.com. See also our <Link href="/impressum" className="underline underline-offset-2">Impressum</Link> and{" "}
          <Link href="/datenschutz" className="underline underline-offset-2">Datenschutz</Link>.
        </p>
      </main>
      <Footer />
    </>
  );
}
