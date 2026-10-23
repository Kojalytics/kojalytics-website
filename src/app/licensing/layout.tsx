import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Software Licensing & Advisory",
  description:
    "Office suites, operating systems and business software for companies and individuals. Tell us what you need and we'll recommend the right licenses.",
  alternates: { canonical: "/licensing" },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: "Software Licensing & Advisory | Kojalytics",
    description: "The right software licenses for your business, with personal advice from request to setup.",
    url: "https://www.kojalytics.com/licensing",
    siteName: "Kojalytics",
    type: "website",
  },
};

export default function SoftwareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
