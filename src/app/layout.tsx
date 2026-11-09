import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import Consent from "@/components/Consent";
import { ORGANIZATION_JSON_LD, SITE_NAME, SITE_URL, jsonLd } from "@/lib/site";
import "./globals.css";

// Headlines: Archivo with its width axis, set wide in globals.css (.display).
const heading = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-heading",
  display: "swap",
});

const body = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Mono micro-labels (.hud, buttons, tags).
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-ui",
  display: "swap",
  // Small labels only: not worth a preload that competes with the headline font.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kojalytics | Software-Studio aus Deutschland",
    template: "%s | Kojalytics",
  },
  description:
    "Kojalytics ist ein Software-Studio aus Deutschland. Wir entwickeln Apps für Kunden und bieten die Koja-Apps für den Mac an.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "de_DE",
    images: [{ url: "/og/kojalytics.jpg", width: 1200, height: 630, alt: "Kojalytics" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the inline script below adds "js" and data-kj-consent to <html> before hydration.
    <html lang="de" className={`${heading.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        {/* Marks JS as available (for scroll reveals) and hides the server-rendered cookie banner before the
            first paint for visitors who already chose. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');try{if(localStorage.getItem('kj-consent-v1'))document.documentElement.setAttribute('data-kj-consent','')}catch(e){}",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ORGANIZATION_JSON_LD)} />
        {children}
        <Consent />
      </body>
    </html>
  );
}
