import type { Metadata } from "next";
import WhyView from "@/views/WhyView";
import { OG_BASE } from "@/lib/site";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Why Koja Office: pay once, offline, real support",
  description:
    "Why people switch from subscription software to Koja Office: pay once instead of a subscription, real desktop apps without an account or cloud, support from Kojalytics in Hamburg.",
  alternates: alternates("en", "/warum-koja"),
  openGraph: { ...OG_BASE, locale: "en_US", title: "Why Koja Office", url: "/en/why-koja", images: [{ url: "/og/software.jpg", width: 1200, height: 630, alt: "The Koja apps on a Mac" }] },
};

export default function WhyPageEn() {
  return <WhyView lang="en" />;
}
