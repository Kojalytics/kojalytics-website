import type { Metadata } from "next";
import { Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactCta from "@/components/studio/ContactCta";
import { SERVICES } from "@/lib/studio";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "App-Entwicklung aus Deutschland: iOS, Web und KI",
  description:
    "Kojalytics entwickelt iOS-Apps, Web-Apps mit Next.js, KI-Funktionen und Backends für Unternehmen und Gründer. Ein kleines Software-Studio aus Deutschland.",
  alternates: { canonical: "/leistungen" },
  openGraph: { url: "/leistungen", images: [DEFAULT_OG_IMAGE] },
};

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="bg-[linear-gradient(180deg,#f5f5f4_0%,#ffffff_100%)] px-5 pb-16 pt-28 md:px-6 md:pt-36">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Leistungen</p>
            <h1 className="display mt-3 max-w-4xl text-[clamp(2.75rem,6.5vw,5rem)]">App-Entwicklung vom ersten Entwurf bis zum Release.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Wir sind ein kleines Software-Studio aus Deutschland. Du sprichst direkt mit den Menschen, die deine App gestalten und
              programmieren, von der ersten Skizze bis zum Release und den Updates danach.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-12 md:px-6">
          <div className="grid gap-4">
            {SERVICES.map((s) => (
              <article key={s.slug} id={s.slug} className="grid scroll-mt-24 gap-6 rounded-[22px] border border-border p-6 sm:p-8 lg:grid-cols-2">
                <div>
                  <h2 className="display text-3xl sm:text-4xl">{s.title}</h2>
                  <p className="mt-4 max-w-md text-lg text-muted">{s.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {s.stack.map((t) => (
                      <span key={t} className="rounded-full bg-surface px-3 py-1 text-xs text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="grid content-start gap-3">
                  {s.details.map((d) => (
                    <li key={d} className="flex gap-3">
                      <Check size={18} strokeWidth={2.6} className="mt-1 shrink-0 text-success" aria-hidden />
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
