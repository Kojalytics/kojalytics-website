import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Licensing & Advisory | Kojalytics",
  description:
    "Office suites, operating systems and business software for companies and individuals. Tell us what you need and we'll recommend the right licenses.",
  openGraph: {
    title: "Software Licensing & Advisory | Kojalytics",
    description: "The right software licenses for your business, with personal advice from request to setup.",
    url: "https://www.kojalytics.com/software",
    siteName: "Kojalytics",
    type: "website",
  },
};

export default function SoftwareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
