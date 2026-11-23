import type { Metadata } from "next";
import ContactView from "@/views/ContactView";
import { alternates, ogLocale } from "@/lib/i18n";
import { DEFAULT_OG_IMAGE, OG_BASE } from "@/lib/site";

const title = "Contact: questions about Koja Office";
const description =
  "Questions about Koja Office before you buy, about installation or about your license? Write to us and you'll get a personal reply.";

export const metadata: Metadata = {
  title,
  description,
  alternates: alternates("en", "/kontakt"),
  openGraph: {
    ...OG_BASE,
    locale: ogLocale("en"),
    title,
    description,
    url: "/en/contact",
    images: [{ ...DEFAULT_OG_IMAGE, alt: "Koja Office on a Mac" }],
  },
};

export default function ContactPageEn() {
  return <ContactView lang="en" />;
}
