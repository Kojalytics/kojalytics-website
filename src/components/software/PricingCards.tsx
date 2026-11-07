"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS, TRIAL_DAYS, type Plan } from "@/lib/pricing";
import { track } from "@/lib/track";
import DownloadButton from "./DownloadButton";

const included: Record<Plan, string[]> = {
  monthly: ["Alle 13 Koja-Apps", "Alle Updates inklusive", "Auf bis zu 3 Macs", "Jederzeit mit einem Klick kündbar"],
  lifetime: ["Alle 13 Koja-Apps, für immer", "Updates über den Kojalytics Launcher", "Auf bis zu 3 Macs", "Einmal zahlen, keine Verlängerung"],
};

export default function PricingCards({ source }: { source: string }) {
  const [waiver, setWaiver] = useState(false);
  const [busy, setBusy] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buy(plan: Plan) {
    if (!waiver) {
      setError("Bitte setze zuerst den Haken über den Buttons.");
      return;
    }
    setBusy(plan);
    setError(null);
    track("InitiateCheckout", { value: PLANS[plan].cents / 100, currency: "EUR", content_name: plan });
    try {
      const res = await fetch("/api/license/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, waiver }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "checkout failed");
      window.location.href = data.url;
    } catch {
      setError("Der Bezahlvorgang konnte nicht gestartet werden. Bitte versuche es gleich noch einmal.");
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        {(["monthly", "lifetime"] as const).map((plan) => {
          const p = PLANS[plan];
          const highlight = plan === "monthly";
          return (
            <div
              key={plan}
              className={`relative flex flex-col rounded-[22px] border bg-white p-6 sm:p-8 ${
                highlight ? "border-foreground shadow-[0_24px_60px_-30px_rgba(17,17,19,0.35)]" : "border-border"
              }`}
            >
              {highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-white">
                  Beliebtester Einstieg
                </span>
              )}
              <p className="text-sm font-semibold text-muted">{p.name}</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="display text-6xl">{p.label}</span>
                <span className="text-muted">{p.per}</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {plan === "monthly"
                  ? `Nach ${TRIAL_DAYS} Tagen kostenlosem Test. Inkl. MwSt.`
                  : "Einmal zahlen, dauerhaft nutzen. Inkl. MwSt. Lohnt sich ab dem 27. Monat."}
              </p>
              <ul className="mt-6 grid gap-3">
                {included[plan].map((item) => (
                  <li key={item} className="flex gap-3 text-[15px]">
                    <Check size={18} strokeWidth={2.6} className="mt-0.5 shrink-0 text-success" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => buy(plan)} disabled={busy !== null} className={`mt-8 w-full ${highlight ? "btn-primary" : "btn-secondary"}`}>
                {busy === plan
                  ? "Sicherer Checkout öffnet sich …"
                  : plan === "monthly"
                    ? "Für 2,99 € im Monat abonnieren"
                    : "Für 79 € dauerhaft kaufen"}
              </button>
            </div>
          );
        })}
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
        <input
          type="checkbox"
          checked={waiver}
          onChange={(e) => setWaiver(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[#111113]"
        />
        <span>
          Ich möchte, dass meine Lizenz sofort startet. Mir ist bekannt, dass mein Widerrufsrecht mit der Lieferung des
          Lizenzschlüssels erlischt. Zahlung über Stripe, es gelten unsere{" "}
          <Link href="/agb" className="text-foreground underline underline-offset-2">
            AGB
          </Link>
          .
        </span>
      </label>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col items-start gap-3 rounded-[22px] border border-dashed border-[#d6d3d1] bg-surface-light p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px]">
          <span className="font-semibold">Noch unsicher?</span>{" "}
          <span className="text-muted">Lade die Apps und nutze alle {TRIAL_DAYS} Tage kostenlos. Ohne Zahlungsdaten.</span>
        </p>
        <DownloadButton source={source} label="Kostenlos laden" />
      </div>
    </div>
  );
}
