import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/studio/ProjectCard";
import ContactCta from "@/components/studio/ContactCta";
import { PROJECTS } from "@/lib/studio";

export const metadata: Metadata = {
  title: "Work: App Development Case Studies",
  description:
    "Apps we designed, built and shipped: AI Headshot for iOS and web, the Koja apps for Mac and Etsy Sync for Shopify.",
  alternates: { canonical: "/work" },
  openGraph: { url: "/work", images: [{ url: "/studio/services.webp", alt: "Developer desk with code and an iPhone app" }] },
};

export default function WorkPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="mx-auto max-w-7xl px-5 pb-12 pt-28 md:px-6 md:pt-36">
          <p className="eyebrow">Work</p>
          <h1 className="display mt-4 max-w-5xl text-[clamp(3rem,8vw,6.5rem)]">
            Products we built <span className="text-highlight">and still run.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/80">
            Every project here is live and maintained by us. That is the experience we bring to your app.
          </p>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-24 md:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.slug} project={p} sizes="(max-width: 768px) 100vw, 33vw" />
            ))}
          </div>
        </section>
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
