import type { Metadata } from "next";
import SupportView from "@/views/SupportView";
import { alternates, ogLocale } from "@/lib/i18n";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";

const title = "Help & support";
const description =
  "Help with the Koja apps and AI Headshot: activate your license, cancel a subscription, privacy. Write to support@kojalytics.com.";

export const metadata: Metadata = {
  title,
  description,
  alternates: alternates("en", "/support"),
  openGraph: {
    ...OG_BASE,
    locale: ogLocale("en"),
    title,
    description,
    url: "/en/support",
    images: [{ ...DEFAULT_OG_IMAGE, alt: "Koja Office on a Mac" }],
  },
};

export default function SupportPageEn() {
  return <SupportView lang="en" />;
}
