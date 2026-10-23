import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CancelForm from "./CancelForm";

export const metadata: Metadata = {
  title: "Cancel your Koja subscription (Verträge hier kündigen)",
  description: "Cancel your Koja apps subscription in one step. No login, no fee, confirmation by email.",
  alternates: { canonical: "/cancel" },
};

export default function CancelPage() {
  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-32 md:pt-40">
        <p className="eyebrow">Verträge hier kündigen</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Cancel your subscription</h1>
        <p className="mt-5 leading-relaxed text-muted">
          No login and no fee. Your plan ends at the end of the billing month you already paid for, and we confirm the
          cancellation by email right away.
        </p>
        <div className="mt-10">
          <CancelForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
