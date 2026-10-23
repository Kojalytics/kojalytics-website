import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactCta from "@/components/studio/ContactCta";
import { SERVICES } from "@/lib/studio";

export const metadata: Metadata = {
  title: "App Development Studio in Germany: iOS, Web and AI",
  description:
    "Kojalytics builds iOS apps, Next.js web apps, AI features and backends for companies and founders. A small software studio from Germany.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services", images: [{ url: "/studio/services.webp", alt: "Developer desk with code, an iPhone app and app sketches" }] },
};

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-28 md:px-6 md:pt-36 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Services</p>
            <h1 className="display mt-4 text-[clamp(3rem,8vw,6.5rem)]">
              App development, <span className="text-highlight">start to finish.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80">
              We are a small software studio in Germany. You talk to the people who design and write your app, from the first
              sketch to the release and the updates after it.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-border">
            <Image src="/studio/services.webp" alt="Developer desk with code on a monitor, an iPhone app and paper sketches" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 md:px-6">
          <div className="grid gap-4">
            {SERVICES.map((s) => (
              <article key={s.slug} id={s.slug} className="scroll-mt-24 grid gap-6 rounded-[18px] border border-border bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
                <div>
                  <h2 className="display text-4xl sm:text-5xl">{s.title}</h2>
                  <p className="mt-4 max-w-md text-lg text-muted">{s.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {s.stack.map((t) => (
                      <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="grid content-start gap-3">
                  {s.details.map((d) => (
                    <li key={d} className="flex gap-3">
                      <Check size={18} strokeWidth={3} className="mt-1 shrink-0 text-accent" aria-hidden />
                      {d}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
