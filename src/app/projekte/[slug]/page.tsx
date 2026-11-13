import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactCta from "@/components/studio/ContactCta";
import SectionBar from "@/components/instrument/SectionBar";
import { PROJECTS, getProject } from "@/lib/studio";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";

/**
 * One project, text only: what it is and what we built. On purpose without pictures and without links to the project
 * itself (the owner shows what we did, not the products); only our own Koja-Apps link to their shop page.
 */

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: `${project.title}: ${project.kind}`,
    description: project.summary,
    alternates: { canonical: `/projekte/${project.slug}` },
    openGraph: { ...OG_BASE, url: `/projekte/${project.slug}`, title: `${project.title} | Projekte von Kojalytics`, images: [DEFAULT_OG_IMAGE] },
  };
}

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const number = PROJECTS.indexOf(project) + 1;
  const facts = [
    { label: "Art", value: project.kind },
    { label: "Technik", value: project.tags.join(" · ") },
    { label: "Stand", value: project.status },
  ];

  return (
    <>
      <Navigation cta="contact" />
      <main className="pt-12">
        {/* 01 What it is */}
        <section className="rail">
          <SectionBar index="01" label={`Projekt ${two(number)}`} meta={project.kind} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <nav aria-label="Brotkrumen" className="hud rise-in flex items-center gap-2">
              <Link href="/projekte" className="-my-3 inline-flex min-h-11 items-center hover:text-foreground">
                Projekte
              </Link>
              <span aria-hidden className="text-faint">
                /
              </span>
              <span className="text-foreground">{project.title}</span>
            </nav>
            <h1 className="display rise-in mt-6 max-w-4xl text-[clamp(2.1rem,5.4vw,4.6rem)] [--i:1]">{project.title}</h1>
            <p className="rise-in mt-6 max-w-2xl text-lg leading-relaxed text-muted [--i:2]">{project.lead}</p>
            {project.productHref && (
              <div className="rise-in mt-8 [--i:3]">
                <Link href={project.productHref} className="btn-primary">
                  Zu den {project.title} <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
                </Link>
              </div>
            )}
          </div>
          <dl className="cells border-t border-border md:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className={`py-5 ${pad}`}>
                <dt className="hud text-faint">{f.label}</dt>
                <dd className="mt-2 font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 02 What we built */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Umsetzung" meta={`${project.built.length} Punkte`} />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-3xl text-[clamp(2rem,4.2vw,3.6rem)]" data-reveal>
              {project.builtTitle ?? (
                <>
                  Was wir <span className="text-highlight">gebaut</span> haben
                </>
              )}
            </h2>
          </div>
          <ul className="cells border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {project.built.map((b, i) => (
              <li key={b} className="p-6 md:p-8" data-reveal style={{ ["--i" as string]: i % 3 }}>
                <div className="flex items-start justify-between">
                  <Check size={18} strokeWidth={2.4} className="text-success" aria-hidden />
                  <span className="hud text-faint">{two(i + 1)}</span>
                </div>
                <p className="mt-5 text-lg leading-snug">{b}</p>
              </li>
            ))}
          </ul>
        </section>

        <ContactCta
          hud="Kontakt · Neues Projekt"
          title={
            <>
              Du planst etwas <span className="text-highlight">Ähnliches</span>? Erzähl uns davon.
            </>
          }
          text="Schreib uns ein paar Zeilen zu deiner Idee. Du bekommst eine persönliche Antwort mit Fragen und einem ersten Plan."
          href="/kontakt?thema=projekt"
        />
      </main>
      <Footer />
    </>
  );
}
