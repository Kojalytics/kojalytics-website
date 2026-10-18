import type { Metadata } from "next";
import { GoogleTag } from "@/components/GoogleTag";
import { MicrosoftClarity } from "@/components/MicrosoftClarity";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kojalytics — Software That Moves",
  description:
    "Kojalytics is a software development studio building world-class apps and custom solutions. From idea to deployment, we craft digital products that make an impact.",
  keywords: ["software development", "app development", "iOS apps", "custom software", "Kojalytics"],
  openGraph: {
    title: "Kojalytics — Software That Moves",
    description: "Software development studio building world-class apps and custom solutions.",
    url: "https://kojalytics.com",
    siteName: "Kojalytics",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <GoogleTag />
        <MicrosoftClarity />
      </head>
      <body className="antialiased">
        <div className="aurora-bg" />
        <div className="grid-pattern" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
