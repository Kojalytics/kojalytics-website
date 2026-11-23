import type { Metadata } from "next";
import CancelView from "@/views/CancelView";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Cancel contracts here",
  description:
    "Cancel your Koja apps subscription online: enter your name and email, click “Cancel now”. No login, no fee, with an acknowledgement of receipt by email.",
  alternates: alternates("en", "/kuendigen"),
};

export default function CancelPageEn() {
  return <CancelView lang="en" />;
}
