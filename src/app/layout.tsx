import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Consent from "@/components/Consent";
import { ORGANIZATION_JSON_LD, SITE_NAME, SITE_URL, jsonLd } from "@/lib/site";
import "./globals.css";

// One variable family for everything: condensed width for headlines, normal width for text.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kojalytics | Software studio from Germany",
    template: "%s | Kojalytics",
  },
  description:
    "Kojalytics is a software studio from Germany. We build iOS apps, web platforms and AI features for clients, and make the Koja apps for Mac.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: "/software/og-software.jpg", width: 1200, height: 630, alt: "Kojalytics" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${archivo.variable}`}>
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ORGANIZATION_JSON_LD)} />
        <div className="aurora-bg" />
        <div className="relative z-10">{children}</div>
        <Consent />
      </body>
    </html>
  );
}
