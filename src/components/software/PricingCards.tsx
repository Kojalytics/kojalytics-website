"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS, TRIAL_DAYS, type Plan } from "@/lib/pricing";
import { track } from "@/lib/track";
import DownloadButton from "./DownloadButton";

const included: Record<Plan, string[]> = {
  monthly: ["Alle 13 Koja-Apps", "Alle Updates inklusive", "Auf bis zu 3 Macs", "Jederzeit online kündbar"],
  lifetime: ["Alle 13 Koja-Apps, ohne Ablaufdatum", "Updates über den Kojalytics Launcher", "Auf bis zu 3 Macs", "Einmal zahlen, keine Verlängerung"],
};

const note: Record<Plan, string> = {
  monthly: "Abrechnung ab Kauf, monatlich kündbar. Inkl. MwSt.",
  lifetime: "Einmal zahlen, dauerhaft nutzen. Inkl. MwSt. Lohnt sich ab dem 27. Monat.",
};

const cta: Record<Plan, string> = {
  monthly: `Für ${PLANS.monthly.label} im Monat abonnieren`,
  lifetime: `Für ${PLANS.lifetime.label} dauerhaft kaufen`,
};

export default function PricingCards({ source }: { source: string }) {
  // The two declarations appear right in the card the visitor picked, so they are seen before paying.
  const [open, setOpen] = useState<Plan | null>(null);
  const [alpha, setAlpha] = useState(false);
  const [waiver, setWaiver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coming back from Stripe with the Back button restores this page from the back/forward cache: unlock it again.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setBusy(false);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  async function checkout(plan: Plan) {
    if (!alpha || !waiver) {
      setError("Bitte bestätige zuerst beide Punkte.");
      return;
    }
    setBusy(true);
    setError(null);
    track("InitiateCheckout", { value: PLANS[plan].cents / 100, currency: "EUR", content_name: plan });
    try {
      const res = await fetch("/api/license/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, waiver, alpha }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "checkout failed");
      window.location.href = data.url;
    } catch {
      setError("Der Bezahlvorgang konnte nicht gestartet werden. Bitte versuche es gleich noch einmal.");
      setBusy(false);
    }
  }

  const box = "mt-0.5 h-5 w-5 shrink-0 accent-[#111113]";

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
                  Flexibel starten
                </span>
              )}
              <p className="text-sm font-semibold text-muted">{p.name}</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="display whitespace-nowrap text-6xl">{p.label}</span>
                <span className="text-muted">{p.per}</span>
              </p>
              <p className="mt-2 text-sm text-muted">{note[plan]}</p>
              <ul className="mb-8 mt-6 grid gap-3">
                {included[plan].map((item) => (
                  <li key={item} className="flex gap-3 text-[15px]">
                    <Check size={18} strokeWidth={2.6} className="mt-0.5 shrink-0 text-success" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              {open === plan ? (
                <div className="mt-auto grid gap-4 rounded-[16px] bg-surface p-4 sm:p-5">
                  <label className="flex items-start gap-3 text-sm leading-relaxed">
                    <input type="checkbox" checked={alpha} onChange={(e) => setAlpha(e.target.checked)} className={box} />
                    <span>
                      Mir ist bekannt, dass die Koja-Apps frühe Versionen (Alpha, teils Pre-Alpha) sind: Einzelne Funktionen fehlen noch,
                      Fehler und Abstürze sind möglich. Mit dieser Abweichung von der üblichen Beschaffenheit bin ich einverstanden.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 text-sm leading-relaxed">
                    <input type="checkbox" checked={waiver} onChange={(e) => setWaiver(e.target.checked)} className={box} />
                    <span>
                      Ich verlange ausdrücklich, dass Kojalytics vor Ablauf der Widerrufsfrist mit der Ausführung des Vertrags beginnt und
                      mir den Lizenzschlüssel sofort nach der Zahlung liefert. Mir ist bekannt, dass ich dadurch mein Widerrufsrecht verliere.
                    </span>
                  </label>
                  {error && (
                    <p className="text-sm font-medium text-red-700" role="alert">
                      {error}
                    </p>
                  )}
                  <button onClick={() => checkout(plan)} disabled={busy} className="btn-primary w-full">
                    {busy ? "Sicherer Checkout öffnet sich …" : "Weiter zur Zahlung"}
                  </button>
                  <p className="text-xs leading-relaxed text-muted">
                    Zahlung über Stripe per Kredit- oder Debitkarte oder einer anderen dort angezeigten Zahlungsart. Es gelten unsere{" "}
                    <Link href="/agb" className="text-foreground underline underline-offset-2">
                      AGB mit Widerrufsbelehrung
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setOpen(plan);
                    setError(null);
                  }}
                  className={`mt-auto w-full ${highlight ? "btn-primary" : "btn-secondary"}`}
                >
                  {cta[plan]}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-start gap-3 rounded-[22px] border border-dashed border-[#d6d3d1] bg-surface-light p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px]">
          <span className="font-semibold">Erst testen?</span>{" "}
          <span className="text-muted">Lade die Apps und nutze sie {TRIAL_DAYS} Tage lang kostenlos, ohne Zahlungsdaten.</span>
        </p>
        <DownloadButton source={source} label="Kostenlos laden" />
      </div>
    </div>
  );
}
