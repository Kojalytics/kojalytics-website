import type { Metadata } from "next";
import AppView from "@/views/AppView";
import { appsFor } from "@/lib/apps";
import { OG_BASE } from "@/lib/site";
import { alternates } from "@/lib/i18n";
import { localizePrices } from "@/lib/currency";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return appsFor("en").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const app = appsFor("en").find((a) => a.slug === slug);
  if (!app) return {};
  // The English pages sell in US dollars (src/lib/currency.ts).
  const description = localizePrices(app.metaDescription, "en", "USD");
  return {
    title: app.metaTitle,
    description,
    alternates: alternates("en", `/software/${app.slug}`),
    openGraph: {
      ...OG_BASE,
      locale: "en_US",
      title: `${app.name}: ${app.kind} for Mac and Windows`,
      description,
      url: `/en/software/${app.slug}`,
      images: [{ url: `/og/apps/${app.slug}.jpg`, width: 1200, height: 630, alt: `${app.name} on a Mac` }],
    },
  };
}

export default async function AppPageEn({ params }: Props) {
  return <AppView slug={(await params).slug} lang="en" />;
}
