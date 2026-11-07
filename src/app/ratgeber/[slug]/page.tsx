import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Lightbulb } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RichText from "@/components/RichText";
import AppIcon from "@/components/ui/app-icon";
import MacWindow from "@/components/ui/mac-window";
import DownloadButton from "@/components/software/DownloadButton";
import Faq, { faqJsonLd } from "@/components/software/Faq";
import { ARTICLES, getArticle, type Block } from "@/lib/ratgeber";
import { getApp, shotFor } from "@/lib/apps";
import { PLANS, TRIAL_DAYS } from "@/lib/pricing";
import { SITE_URL, jsonLd } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  const app = article.apps[0] ? getApp(article.apps[0]) : undefined;
  const shot = app && shotFor(app);
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: `/ratgeber/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.h1,
      description: article.metaDescription,
      url: `/ratgeber/${article.slug}`,
      modifiedTime: article.updated,
      images: shot ? [{ url: shot.src, width: shot.width, height: shot.height, alt: shot.alt }] : undefined,
    },
  };
}

const dateDE = (iso: string) => new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

function AppCallout({ slug, text }: { slug: string; text: string }) {
  const app = getApp(slug);
  if (!app) return null;
  const shot = shotFor(app);
  return (
    <aside className="not-prose my-8 overflow-hidden rounded-[22px] border border-border bg-surface">
      <div className="grid gap-0 sm:grid-cols-[1fr_1.1fr]">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <AppIcon slug={app.slug} name={app.name} size={44} />
            <div>
              <p className="font-semibold">{app.name}</p>
              <p className="text-sm text-muted">{app.kind} für macOS</p>
            </div>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-[#2b2a29]">
            <RichText text={text} />
          </p>
          <Link href={`/software/${app.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
            {app.name} ansehen <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        {shot && (
          <div className="p-4 sm:pl-0">
            <MacWindow src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 640px) 90vw, 380px" />
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
        <div className="not-prose my-6 overflow-x-auto rounded-[18px] border border-border">
          <table className="w-full min-w-[480px] text-left text-[15px]">
            {block.caption && <caption className="p-4 text-left text-sm text-muted">{block.caption}</caption>}
            <thead className="bg-surface">
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col" className="p-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i} className="border-t border-border align-top">
                  {r.map((c, j) => (
                    <td key={j} className={`p-3 ${j === 0 ? "font-medium" : ""}`}>
                      <RichText text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "tip":
      return (
        <div className="not-prose my-6 flex gap-3 rounded-[18px] bg-[#eef4fe] p-5 text-[15px] leading-relaxed">
          <Lightbulb size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden />
          <p>
            <RichText text={block.text} />
          </p>
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleJsonLd)} />
      {article.faq.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd(article.faq))} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <Navigation />

      <main className="px-5 pb-20 pt-24 md:px-6 md:pt-32">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Brotkrumen" className="flex gap-2 text-sm text-muted">
            <Link href="/ratgeber" className="hover:text-foreground">
              Ratgeber
            </Link>
            <span aria-hidden>/</span>
            <span className="truncate text-foreground">{article.navTitle}</span>
          </nav>
          <h1 className="display mt-5 text-[clamp(2.3rem,5vw,3.6rem)]">{article.h1}</h1>
          <p className="mt-5 text-sm text-muted">
            Aktualisiert am <time dateTime={article.updated}>{dateDE(article.updated)}</time> · {article.readingMinutes} Min. Lesezeit · von der
            Kojalytics-Redaktion
          </p>

          <div className="prose-de mt-8">
            {article.intro.map((p) => (
              <p key={p} className="!text-lg">
                <RichText text={p} />
              </p>
            ))}
          </div>

          <nav aria-label="Inhalt" className="mt-10 rounded-[20px] bg-surface p-6">
            <p className="text-sm font-semibold">Inhalt</p>
            <ol className="mt-3 grid list-decimal gap-1.5 pl-5 text-[15px]">
              {article.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:underline">
                    {s.h2}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="prose-de">
            {article.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>{s.h2}</h2>
                {s.blocks.map((b, i) => (
                  <BlockView key={i} block={b} />
                ))}
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-[24px] bg-foreground p-8 text-white sm:p-10">
            <p className="display text-3xl sm:text-4xl">Alle 13 Koja-Apps {TRIAL_DAYS} Tage kostenlos testen</p>
            <p className="mt-3 text-white/75">
              Danach {PLANS.monthly.label} im Monat, mit einem Klick kündbar. Oder einmalig {PLANS.lifetime.label}. Für macOS, ohne Konto.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <DownloadButton source={`ratgeber-${article.slug}`} className="!bg-white !text-foreground hover:!bg-white/90" />
              <Link href="/software" className="btn-secondary !border-white/30 !bg-transparent !text-white">
                Alle Apps ansehen
              </Link>
            </div>
          </div>

          {article.faq.length > 0 && (
            <section className="mt-16" aria-labelledby="faq">
              <h2 id="faq" className="display mb-8 text-3xl sm:text-4xl">
                Häufige Fragen
              </h2>
              <Faq items={article.faq} />
            </section>
          )}

          {article.sources.length > 0 && (
            <section className="mt-12 text-sm text-muted" aria-labelledby="quellen">
              <h2 id="quellen" className="font-semibold text-foreground">
                Quellen
              </h2>
              <ul className="mt-3 grid gap-1.5">
                {article.sources.map((s) => (
                  <li key={s.url}>
                    {s.label}: <span className="break-all">{s.url.replace(/^https?:\/\//, "")}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        {related.length > 0 && (
          <aside className="mx-auto mt-20 max-w-7xl border-t border-border pt-12">
            <h2 className="display text-3xl">Weiterlesen</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {related.map((a) => (
                <Link key={a.slug} href={`/ratgeber/${a.slug}`} className="rounded-[22px] border border-border p-6 transition-colors hover:border-foreground/40">
                  <p className="text-sm text-muted">{a.readingMinutes} Min. Lesezeit</p>
                  <h3 className="mt-3 text-lg font-semibold leading-snug">{a.h1}</h3>
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
