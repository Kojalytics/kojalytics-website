import type { Metadata } from "next";
import AppView from "@/views/AppView";
import { APPS, getApp } from "@/lib/apps";
import { OG_BASE } from "@/lib/site";
import { alternates } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return APPS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const app = getApp((await params).slug);
  if (!app) return {};
  return {
    title: app.metaTitle,
    description: app.metaDescription,
    alternates: alternates("de", `/software/${app.slug}`),
    openGraph: {
      ...OG_BASE,
      title: `${app.name}: ${app.kind} für Mac und Windows`,
      description: app.metaDescription,
      url: `/software/${app.slug}`,
      images: [{ url: `/og/apps/${app.slug}.jpg`, width: 1200, height: 630, alt: `${app.name} auf dem Mac` }],
    },
  };
}

export default async function AppPage({ params }: Props) {
  return <AppView slug={(await params).slug} lang="de" />;
}
