"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS, TRIAL_DAYS, type Plan } from "@/lib/pricing";
import { track } from "@/lib/track";
import DownloadButton from "./DownloadButton";

const included: Record<Plan, string[]> = {
  monthly: ["All 13 Koja apps", "Every update while subscribed", "Up to 3 Macs", "Cancel in one click, any time"],
  lifetime: ["All 13 Koja apps, forever", "Updates via the Kojalytics Launcher", "Up to 3 Macs", "One payment, no renewal"],
};

export default function PricingCards({ source }: { source: string }) {
  const [waiver, setWaiver] = useState(false);
  const [busy, setBusy] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buy(plan: Plan) {
    if (!waiver) {
      setError("Please tick the box above the buttons first.");
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
      setError("The checkout could not be started. Please try again in a moment.");
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
              className={`relative flex flex-col rounded-[18px] border p-6 sm:p-8 ${
                highlight ? "border-accent bg-surface" : "border-border bg-surface"
              }`}
            >
              {highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-accent-ink">
                  Start here
                </span>
              )}
              <p className="eyebrow">{p.name}</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="display text-6xl sm:text-7xl">{p.label}</span>
                <span className="text-muted">{p.per}</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {plan === "monthly" ? `After your free ${TRIAL_DAYS}-day trial. Incl. VAT.` : "Pay once, use forever. Incl. VAT. Pays off after 27 months."}
              </p>
              <ul className="mt-6 grid gap-3">
                {included[plan].map((item) => (
                  <li key={item} className="flex gap-3 text-[15px]">
                    <Check size={18} strokeWidth={3} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => buy(plan)}
                disabled={busy !== null}
                className={`mt-8 ${highlight ? "btn-primary" : "btn-secondary"} w-full`}
              >
                {busy === plan ? "Opening secure checkout…" : plan === "monthly" ? "Subscribe for €2.99 / month" : "Buy lifetime for €79"}
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
          className="mt-1 h-4 w-4 shrink-0 accent-[#d1fe17]"
        />
        <span>
          I want my license to start immediately. I know that my right of withdrawal ends once the license key has been
          delivered. Payment via Stripe, see our <Link href="/terms" className="text-foreground underline underline-offset-2">terms</Link>.
        </span>
      </label>
      {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

      <div className="flex flex-col items-start gap-3 rounded-[18px] border border-dashed border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px]">
          <span className="font-bold">Not sure yet?</span> <span className="text-muted">Download the apps and use all of them free for {TRIAL_DAYS} days first.</span>
        </p>
        <DownloadButton source={source} label="Download free" />
      </div>
    </div>
  );
}
