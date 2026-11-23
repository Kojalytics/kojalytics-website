import type { Metadata } from "next";
import HomeView from "@/views/HomeView";
import { OG_BASE } from "@/lib/site";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: "Koja Office 2026: 13 Apps for Mac & Windows, No Subscription | Kojalytics" },
  description:
    "Koja Office: photo editing, video, layout, audio, office, PDF and CAD for Mac and Windows. Works offline, no account. €79 once instead of a subscription, or €19.99 a month. Try it free for 3 days.",
  alternates: alternates("en", "/"),
  openGraph: {
    ...OG_BASE,
    locale: "en_US",
    title: "Koja Office: 13 apps for Mac and Windows. €79 once, no subscription.",
    description: "Photo, video, design, audio, office, PDF and CAD. Works offline, no account, cancel online any time. Try it free for 3 days.",
    url: "/en",
    images: [{ url: "/og/software.jpg", width: 1200, height: 630, alt: "The Koja apps on a Mac" }],
  },
};

export default function HomePageEn() {
  return <HomeView lang="en" />;
}
