import type { Metadata } from "next";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactCta from "@/components/studio/ContactCta";

export const metadata: Metadata = {
  title: "About Kojalytics: a Small Software Studio from Germany",
  description:
    "Kojalytics is a small software studio from Germany. We build apps for clients and run our own products, from AI Headshot to the Koja apps for Mac.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", images: [{ url: "/studio/about.webp", alt: "Two people discussing app designs pinned to a studio wall" }] },
};

const principles = [
  { title: "We ship", text: "A product counts when people can use it. We plan for the release from the first week." },
  { title: "We run what we build", text: "Our own apps have real customers and payments. We know what happens after launch." },
  { title: "Small on purpose", text: "You talk to the people who design and write the code, not to an account manager." },
];

const stack = ["SwiftUI", "Next.js", "React", "TypeScript", "Supabase", "Postgres", "Stripe", "Vercel", "Gemini", "Claude"];

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-28 md:px-6 md:pt-36 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">About</p>
            <h1 className="display mt-4 text-[clamp(3rem,8vw,6.5rem)]">
              A small studio <span className="text-highlight">that ships.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80">
              Kojalytics is a software studio from Germany. We build apps and web platforms for clients, and we run our own
              products: AI Headshot, Etsy Sync and the Koja apps for Mac.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-border">
            <Image src="/studio/about.webp" alt="Two people discussing app designs pinned to a studio wall" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="rounded-[18px] border border-border bg-surface p-6 sm:p-8">
                <h2 className="display text-4xl">{p.title}</h2>
                <p className="mt-4 leading-relaxed text-muted">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <p className="eyebrow">What we build with</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {stack.map((t) => (
                <span key={t} className="rounded-full border border-border px-4 py-2 text-sm text-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
