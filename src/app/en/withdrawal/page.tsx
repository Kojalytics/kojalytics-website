import type { Metadata } from "next";
import WithdrawView from "@/views/WithdrawView";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Withdraw from a contract",
  description:
    "Withdraw from your purchase of the Koja apps online: enter your name and email, click “Confirm withdrawal”. You receive an acknowledgement of receipt straight away.",
  alternates: alternates("en", "/widerrufen"),
  robots: { index: false },
};

export default function WithdrawalPage() {
  return <WithdrawView lang="en" />;
}
