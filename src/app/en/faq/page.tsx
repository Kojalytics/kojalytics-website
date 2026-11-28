import type { Metadata } from "next";
import FaqView from "@/views/FaqView";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Koja Office FAQ: price, licence, devices",
  description: "Answers about Koja Office: what it costs, how many devices, whether you need an account, which file formats, how to cancel.",
  alternates: alternates("en", "/fragen"),
};

export default function FaqPageEn() {
  return <FaqView lang="en" />;
}
