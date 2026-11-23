import type { Metadata } from "next";
import WithdrawView from "@/views/WithdrawView";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Vertrag widerrufen",
  description: "Widerrufe deinen Kauf der Koja-Apps online: Name und E-Mail eingeben, „Widerruf bestätigen“ klicken. Du bekommst sofort eine Eingangsbestätigung.",
  alternates: alternates("de", "/widerrufen"),
  robots: { index: false },
};

export default function WithdrawPage() {
  return <WithdrawView lang="de" />;
}
