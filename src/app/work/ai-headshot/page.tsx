import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactCta from "@/components/studio/ContactCta";

export const metadata: Metadata = {
  title: "AI Headshot Case Study: AI Portrait App for iOS and Web",
  description:
    "How Kojalytics built AI Headshot: an iOS app and web app that turn a few selfies into professional portraits, with Stripe payments and 8 languages.",
  alternates: { canonical: "/work/ai-headshot" },
  openGraph: { url: "/work/ai-headshot", images: [{ url: "/aiheadshot/comparisons/after-1.webp", alt: "AI-generated professional portrait" }] },
};

const built = [
  "SwiftUI iPhone app and a Next.js web app sharing one backend",
  "Selfie upload from desktop, webcam or phone via QR code",
  "Selfie quality check before generation",
  "AI portrait generation in several professional styles",
  "Stripe checkout with two one-time packages",
  "Landing pages in 8 languages with localized SEO",
];

const pairs = [1, 2, 3];

export default function AiHeadshotCase() {
  return (
    <>
      <Navigation />
      <main>
        <section className="mx-auto max-w-7xl px-5 pb-12 pt-28 md:px-6 md:pt-36">
          <nav aria-label="Breadcrumb" className="eyebrow flex gap-2">
            <Link href="/work" className="hover:text-foreground">Work</Link>
            <span aria-hidden>/</span>
            <span className="text-accent">AI Headshot</span>
          </nav>
          <h1 className="display mt-5 max-w-5xl text-[clamp(3rem,8vw,6.5rem)]">
            From selfie to business portrait <span className="text-highlight">in minutes.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/80">
            AI Headshot turns a few selfies into professional portraits for LinkedIn, CVs and company pages. No photographer, no
            appointment. We designed and built the iOS app, the web app and the backend behind both.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["iOS app", "Web app", "SwiftUI", "Next.js", "Supabase", "Gemini", "Stripe"].map((t) => (
              <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted">{t}</span>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 md:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {pairs.map((n) => (
              <figure key={n} className="m-0 grid grid-cols-2 gap-1 overflow-hidden rounded-[18px] border border-border bg-surface p-1">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[14px]">
                  <Image src={`/aiheadshot/comparisons/before-${n}.webp`} alt="Selfie used as input" fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover" />
                  <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[11px] font-bold">Selfie</span>
                </div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-[14px]">
                  <Image src={`/aiheadshot/comparisons/after-${n}.webp`} alt="Generated professional portrait" fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover" />
                  <span className="absolute left-2 top-2 rounded bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-ink">AI portrait</span>
                </div>
              </figure>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-surface/40 px-5 py-20 md:px-6 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow">The job</p>
              <h2 className="display mt-3 text-5xl sm:text-6xl">A studio photo <span className="text-highlight">without the studio</span></h2>
              <p className="mt-6 leading-relaxed text-muted">
                A professional headshot usually means booking a photographer and paying for a session. AI Headshot replaces that
                with a few selfies and a few minutes of waiting, at a fixed price instead of a subscription.
              </p>
            </div>
            <div>
              <p className="eyebrow">What we built</p>
              <ul className="mt-5 grid gap-3">
                {built.map((b) => (
                  <li key={b} className="flex gap-3 text-lg">
                    <Check size={20} strokeWidth={3} className="mt-1 shrink-0 text-accent" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/en/aiheadshot/app" className="btn-secondary mt-8">
                Open the AI Headshot web app
              </Link>
            </div>
          </div>
        </section>
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
