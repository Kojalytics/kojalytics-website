import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Lightbulb } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RichText from "@/components/RichText";
import AppIcon from "@/components/ui/app-icon";
import MacWindow from "@/components/ui/mac-window";
import DownloadButton from "@/components/software/DownloadButton";
import Faq, { faqJsonLd } from "@/components/software/Faq";
import SectionBar from "@/components/instrument/SectionBar";
import { ARTICLES, getArticle, type Block } from "@/lib/ratgeber";
import { appInk, getApp, shotFor } from "@/lib/apps";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";
import { OG_BASE, SITE_URL, jsonLd } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: `/ratgeber/${article.slug}` },
    openGraph: {
      ...OG_BASE,
      type: "article",
      title: article.h1,
      description: article.metaDescription,
      url: `/ratgeber/${article.slug}`,
      modifiedTime: article.updated,
      images: [{ url: `/og/ratgeber/${article.slug}.jpg`, width: 1200, height: 630, alt: article.h1 }],
    },
  };
}

const pad = "px-5 md:px-10";
const two = (n: number) => String(n).padStart(2, "0");
/** Article layout: a narrow index column (breadcrumb, table of contents) and the reading column. */
const columns = "grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-20";

/** No line break between a number and its unit ("50 %", "79 €"). */
const keepUnits = (s: string) => s.replace(/ (%|€)/g, " $1");

const dateDE =(iso: string) => new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

function AppCallout({ slug, text }: { slug: string; text: string }) {
  const app = getApp(slug);
  if (!app) return null;
  const shot = shotFor(app);
  const ink = appInk(app.color);
  return (
    <aside className="not-prose my-10 border border-border">
      <div className="grid sm:grid-cols-[1fr_1.1fr]">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <AppIcon slug={app.slug} name={app.name} size={44} />
            <div>
              <p className="display !text-[1.25rem] !leading-tight">
                {app.name.slice(0, -4)}
                <span style={{ color: ink }}>Koja</span>
              </p>
              <p className="hud mt-1">{app.kind} für macOS</p>
            </div>
          </div>
          <p className="mt-5 !text-[15px] !leading-relaxed">
            <RichText text={text} />
          </p>
          <Link href={`/software/${app.slug}`} className="link-hud mt-2 min-h-11 !text-foreground !no-underline hover:!text-accent">
            {app.name} ansehen <ArrowUpRight size={14} aria-hidden />
          </Link>
        </div>
        {shot && (
          <div className="border-t border-border p-4 sm:border-l sm:border-t-0">
            <MacWindow src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 640px) 90vw, 380px" label={app.name} />
          </div>
        )}
      </div>
    </aside>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((t) => (
            <li key={t}>
              <RichText text={t} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((t) => (
            <li key={t}>
              <RichText text={t} />
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="my-8">
          {block.caption && <p className="mb-3 !text-sm !leading-relaxed !text-muted">{block.caption}</p>}
          {/* Phones: one card per row, so no column is hidden off-screen */}
          <div className="grid gap-3 sm:hidden">
            {block.rows.map((r, i) => (
              <dl key={i} className="border border-border p-4 text-[15px]">
                <dt className="flex items-start gap-3 font-semibold">
                  <span className="hud mt-[3px] shrink-0 text-faint">{two(i + 1)}</span>
                  <span>
                    <RichText text={r[0]} />
                  </span>
                </dt>
                {r.slice(1).map((c, j) => (
                  <dd key={j} className="mt-3 border-t border-border pt-3 leading-relaxed">
                    <span className="hud">{block.head[j + 1]}: </span>
                    <RichText text={c} />
                  </dd>
                ))}
              </dl>
            ))}
          </div>
          <div className="hidden overflow-x-auto border border-border sm:block">
            <table className="w-full text-left text-[15px]">
              <thead>
                <tr className="border-b border-border">
                  {block.head.map((h, j) => (
                    <th key={h} scope="col" className={`hud p-3 align-bottom !text-foreground ${j > 0 ? "border-l border-border" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((r, i) => (
                  <tr key={i} className="border-t border-border align-top first:border-t-0">
                    {r.map((c, j) => (
                      <td key={j} className={`p-3 leading-relaxed ${j === 0 ? "font-medium" : "border-l border-border"}`}>
                        <RichText text={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "tip":
      return (
        <div className="not-prose my-8 flex gap-4 border border-border p-5 sm:p-6">
          <span className="icon-box shrink-0">
            <Lightbulb size={18} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="hud !text-[11px] !leading-[1.4] !text-foreground">Tipp</p>
            <p className="mt-2">
              <RichText text={block.text} />
            </p>
          </div>
        </div>
      );
    case "app":
      return <AppCallout slug={block.app} text={block.text} />;
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const related = ARTICLES.filter((a) => a.slug !== article.slug && a.apps.some((s) => article.apps.includes(s))).slice(0, 3);
  const plainIntro = article.intro.join(" ").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.h1,
    description: article.metaDescription,
    inLanguage: "de",
    dateModified: article.updated,
    datePublished: article.updated,
    author: { "@type": "Organization", name: "Kojalytics", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Kojalytics", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` } },
    mainEntityOfPage: `${SITE_URL}/ratgeber/${article.slug}`,
    image: [`${SITE_URL}/og/ratgeber/${article.slug}.jpg`],
    abstract: plainIntro.slice(0, 300),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Ratgeber", item: `${SITE_URL}/ratgeber` },
      { "@type": "ListItem", position: 3, name: article.navTitle, item: `${SITE_URL}/ratgeber/${article.slug}` },
    ],
  };

  // Section numbers run on without gaps, whichever of the optional sections an article has.
  const optional = [article.faq.length > 0 && "faq", article.sources.length > 0 && "sources", related.length > 0 && "related"].filter(Boolean);
  const indexOf = (key: string) => two(3 + optional.indexOf(key));

  // One highlighted word per headline: the first word names the topic in every article title.
  const [firstWord, ...restWords] = keepUnits(article.h1).split(" ");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleJsonLd)} />
      {article.faq.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd(article.faq))} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <Navigation />

      <main className="pt-12">
        <article>
          {/* 01 Title, meta and intro */}
          <section className="rail">
            <SectionBar
              index="01"
              label="Ratgeber"
              meta={`${article.readingMinutes} Min. Lesezeit · ${article.sources.length} Quellen`}
            />
            <div className={`gap-6 py-14 md:py-20 ${pad} ${columns}`}>
              <nav aria-label="Brotkrumen" className="hud rise-in flex min-w-0 items-baseline gap-2">
                <Link href="/ratgeber" className="-my-3 inline-flex min-h-11 shrink-0 items-center hover:text-foreground">
                  Ratgeber
                </Link>
                <span aria-hidden className="text-faint">
                  /
                </span>
                <span className="truncate text-foreground lg:whitespace-normal">{article.navTitle}</span>
              </nav>
              <div className="min-w-0">
                <h1 className="display rise-in max-w-4xl text-[clamp(2rem,4vw,3.4rem)] [--i:1]">
                  <span className="text-highlight">{firstWord}</span> {restWords.join(" ")}
                </h1>
                <p className="hud rise-in mt-6 [--i:2]">
                  <span className="whitespace-nowrap">
                    Aktualisiert am <time dateTime={article.updated}>{dateDE(article.updated)}</time>
                  </span>{" "}
                  · <span className="whitespace-nowrap">{article.readingMinutes} Min. Lesezeit</span> ·{" "}
                  <span className="whitespace-nowrap">von der Kojalytics-Redaktion</span>
                </p>
                <div className="prose-de rise-in mt-10 max-w-3xl border-t border-border pt-8 [--i:3]">
                  {article.intro.map((p) => (
                    <p key={p} className="!text-lg">
                      <RichText text={p} />
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 02 Contents and body */}
          <section className="rail crosshairs">
            <SectionBar index="02" label={article.navTitle} meta={`${article.sections.length} Abschnitte`} />
            <div className={`gap-12 py-14 md:py-20 ${pad} ${columns}`}>
              <nav aria-label="Inhalt" className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto" data-reveal>
                <p className="hud">
                  <span className="text-foreground">Inhalt</span>
                </p>
                <ol className="mt-4 border-t border-border">
                  {article.sections.map((s, i) => (
                    <li key={s.id} className="border-b border-border">
                      <a href={`#${s.id}`} className="flex min-h-11 gap-4 py-3 text-[15px] leading-snug text-muted transition-colors hover:text-foreground">
                        <span className="hud mt-[3px] w-6 shrink-0 text-faint">{two(i + 1)}</span>
                        <span>{s.h2}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="min-w-0 max-w-3xl">
                <div className="prose-de [&>section:first-child>h2]:mt-0">
                  {article.sections.map((s) => (
                    <section key={s.id} aria-labelledby={s.id} data-reveal>
                      <h2 id={s.id}>{s.h2}</h2>
                      {s.blocks.map((b, i) => (
                        <BlockView key={i} block={b} />
                      ))}
                    </section>
                  ))}
                </div>

                <div className="mt-16 border border-foreground p-6 sm:p-10" data-reveal>
                  <div className="flex -space-x-2">
                    {article.apps.slice(0, 6).map((slug) => {
                      const app = getApp(slug);
                      return app ? <AppIcon key={slug} slug={slug} name={app.name} size={40} /> : null;
                    })}
                  </div>
                  <p className="display mt-7 text-[clamp(1.7rem,3.2vw,2.5rem)]">
                    Alle 13 <span className="whitespace-nowrap">Koja-Apps</span> <span className="whitespace-nowrap">{TRIAL_DAYS} Tage</span> <span className="text-highlight">kostenlos</span> testen
                  </p>
                  <p className="mt-4 leading-relaxed text-muted">
                    Danach {PLANS.monthly.label} im Monat, jederzeit online kündbar. Oder einmalig {PLANS.lifetime.label}. Für macOS, ohne Konto.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <DownloadButton source={`ratgeber-${article.slug}`} />
                    <Link href="/software" className="btn-secondary">
                      Alle Apps ansehen
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          {article.faq.length > 0 && (
            <section className="rail crosshairs" aria-labelledby="faq">
              <SectionBar index={indexOf("faq")} label="Fragen" meta={`${article.faq.length} Antworten`} />
              <div className={`gap-10 py-14 md:py-20 ${pad} ${columns}`}>
                <h2 id="faq" className="display text-[clamp(1.8rem,3.4vw,2.8rem)] lg:sticky lg:top-20 lg:self-start" data-reveal>
                  Häufige <span className="text-highlight">Fragen</span>
                </h2>
                <div className="min-w-0 max-w-3xl">
                  <Faq items={article.faq} />
                </div>
              </div>
            </section>
          )}

          {/* Sources */}
          {article.sources.length > 0 && (
            <section className="rail crosshairs" aria-labelledby="quellen">
              <SectionBar index={indexOf("sources")} label="Quellen" meta={`Stand ${dateDE(article.updated)}`} />
              <div className={`gap-4 py-14 md:py-20 ${pad} ${columns}`}>
                <h2 id="quellen" className="hud lg:sticky lg:top-20 lg:self-start lg:pt-3" data-reveal>
                  <span className="text-foreground">Quellen</span>
                </h2>
                <ol className="min-w-0 max-w-3xl border-t border-border" data-reveal>
                  {article.sources.map((s, i) => (
                    <li key={s.url} className="flex gap-4 border-b border-border py-2.5 text-sm leading-relaxed text-muted">
                      <span className="hud mt-[3px] w-6 shrink-0 text-faint">{two(i + 1)}</span>
                      <span className="min-w-0 [overflow-wrap:anywhere]">
                        {s.label}{" "}
                        <span className="font-mono text-[11.5px] text-faint">({new URL(s.url).hostname.replace(/^www\./, "")})</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}
        </article>

        {related.length > 0 && (
          <aside className="rail crosshairs" aria-labelledby="weiterlesen">
            <SectionBar index={indexOf("related")} label="Weiterlesen" meta="Passende Ratgeber" />
            <h2 id="weiterlesen" className="sr-only">
              Weiterlesen
            </h2>
            <div className={`cells ${related.length === 3 ? "md:grid-cols-3" : related.length === 2 ? "md:grid-cols-2" : ""}`}>
              {related.map((a, i) => (
                <Link key={a.slug} href={`/ratgeber/${a.slug}`} className="group flex flex-col p-6 md:p-8" data-reveal style={{ ["--i" as string]: i }}>
                  <p className="hud">
                    <span className="text-faint">{two(i + 1)}</span> · {a.readingMinutes} Min. Lesezeit
                  </p>
                  <h3 className="mt-5 flex-1 text-xl font-semibold leading-snug group-hover:text-accent">{keepUnits(a.h1)}</h3>
                  <span className="link-hud mt-6">
                    Lesen <ArrowUpRight size={14} aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </main>
      <Footer />
    </>
  );
}
