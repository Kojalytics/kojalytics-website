import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import Consent from "@/components/Consent";
import { ORGANIZATION_JSON_LD, SITE_NAME, SITE_URL, jsonLd } from "@/lib/site";
import { OFFER_ENDS_MS } from "@/lib/offer";
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
    default: "Koja Office 2026: 13 Apps für Mac & Windows ohne Abo",
    template: "%s | Koja Office",
  },
  description:
    "Koja Office: 13 Apps für Mac und Windows, von Office und PDF bis Foto, Video und CAD. Einmal zahlen, kein Abo, läuft offline.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "de_DE",
    images: [{ url: "/og/software.jpg", width: 1200, height: 630, alt: "Koja Office auf dem Mac" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the inline script below adds "js", data-kj-consent and data-offer-over to <html> before hydration.
    <html lang="de" className={`${heading.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        {/* Marks JS as available (for scroll reveals), hides the server-rendered cookie banner before the
            first paint for visitors who already chose, and plays the 2-second logo intro once per visit
            (not when coming from another page of this site, not on the ad landing page /office, not for bots or with
            reduced motion). Once the Koja Office offer has ended (src/lib/offer.ts), it sets data-offer-over, so pages built
            before the end show the regular price from the first paint (.offer-live / .offer-over in globals.css). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js');" +
              `if(Date.now()>=${OFFER_ENDS_MS})d.setAttribute('data-offer-over','');` +
              "try{if(localStorage.getItem('kj-consent-v1'))d.setAttribute('data-kj-consent','')}catch(e){}" +
              "try{var r=document.referrer,s=false;try{s=!!r&&new URL(r).host===location.host}catch(e){}" +
              "if(!sessionStorage.getItem('kj-intro')&&!s&&location.pathname!=='/office'&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!/bot|crawl|spider|slurp|preview/i.test(navigator.userAgent)){d.classList.add('kj-intro');setTimeout(function(){d.classList.remove('kj-intro')},2250)}" +
              "sessionStorage.setItem('kj-intro','1')}catch(e){}})()",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ORGANIZATION_JSON_LD)} />
        {children}
        <Consent />
      </body>
    </html>
  );
}
