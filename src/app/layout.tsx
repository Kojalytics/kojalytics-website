import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

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
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <div className="aurora-bg" />
        <div className="grid-pattern" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
