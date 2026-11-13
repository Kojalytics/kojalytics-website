"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Tag, X } from "lucide-react";
import { PLANS, TRIAL_DAYS, type Plan } from "@/lib/pricing";
import { track } from "@/lib/track";
import DownloadButton from "./DownloadButton";

const included: Record<Plan, string[]> = {
  monthly: ["Alle 13 Koja-Apps", "Alle Updates inklusive", "Auf bis zu 3 Geräten (Mac oder Windows-PC)", "Jederzeit online kündbar"],
  lifetime: ["Alle 13 Koja-Apps, ohne Ablaufdatum", "Updates über den Kojalytics Launcher", "Auf bis zu 3 Geräten (Mac oder Windows-PC)", "Einmal zahlen, keine Verlängerung"],
};

// The one-time price pays off after this many months of the subscription.
const breakEven = (lifetimeCents: number) => Math.ceil(lifetimeCents / PLANS.monthly.cents);

const note = (plan: Plan, price: number) =>
  plan === "monthly"
    ? "Abrechnung ab Kauf, monatlich kündbar. Inkl. MwSt."
    : `Einmal zahlen, dauerhaft nutzen. Inkl. MwSt. Lohnt sich ab dem ${breakEven(price)}. Monat.`;

const cta: Record<Plan, string> = {
  monthly: `Für ${PLANS.monthly.label} im Monat abonnieren`,
  lifetime: `Für ${PLANS.lifetime.label} dauerhaft kaufen`,
};

// The one-time purchase is the plan we recommend; it comes first and gets the dark button.
const ORDER: Plan[] = ["lifetime", "monthly"];

type Discount = {
  code: string;
  label: string;
  duration: "once" | "repeating" | "forever";
  months: number | null;
  prices: Partial<Record<Plan, number>>;
};

const euro = (cents: number) =>
  (cents / 100).toLocaleString("de-DE", { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 }) + " €";

export default function PricingCards({ source }: { source: string }) {
  const [busy, setBusy] = useState<Plan | null>(null);
  const [error, setError] = useState<{ plan: Plan; message: string } | null>(null);
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [discount, setDiscount] = useState<Discount | null>(null);

  // Coming back from Stripe with the Back button restores this page from the back/forward cache: unlock it again.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setBusy(null);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  async function redeem(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setChecking(true);
    setCodeError(null);
    try {
      const res = await fetch("/api/license/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCodeError(data.error || "Der Code konnte nicht geprüft werden.");
        return;
      }
      setDiscount(data);
    } catch {
      setCodeError("Der Code konnte nicht geprüft werden. Bitte versuche es gleich noch einmal.");
    } finally {
      setChecking(false);
    }
  }

  async function checkout(plan: Plan) {
    const price = discount?.prices[plan] ?? PLANS[plan].cents;
    setBusy(plan);
    setError(null);
    track("InitiateCheckout", { value: price / 100, currency: "EUR", content_name: plan });
    try {
      const res = await fetch("/api/license/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, ...(discount && discount.prices[plan] !== undefined ? { code: discount.code } : {}) }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "checkout failed");
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error && err.message !== "checkout failed" ? err.message : null;
      setError({ plan, message: message || "Der Bezahlvorgang konnte nicht gestartet werden. Bitte versuche es gleich noch einmal." });
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-6">
      {/* Discount code: checked with Stripe, the prices below change right away */}
      <div className="border-2 border-dashed border-buy bg-[color-mix(in_srgb,var(--color-buy)_5%,#fff)] p-4 sm:p-5">
        {discount ? (
          <div className="flex flex-wrap items-center justify-between gap-3" role="status">
            <p className="flex items-center gap-2.5 text-[15px]">
              <Tag size={16} className="shrink-0 text-success" aria-hidden />
              <span>
                Rabattcode <span className="font-mono font-semibold tracking-[0.06em]">{discount.code}</span> angewendet:{" "}
                <span className="font-semibold">{discount.label}</span>
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                setDiscount(null);
                setCode("");
              }}
              className="hud -my-2 inline-flex min-h-11 items-center gap-1.5 hover:text-foreground"
            >
              <X size={13} aria-hidden /> Entfernen
            </button>
          </div>
        ) : (
          <form onSubmit={redeem} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="discount-code" className="flex shrink-0 items-center gap-2 text-[15px] font-semibold text-foreground">
              <Tag size={17} className="text-buy" aria-hidden /> Rabattcode einlösen
            </label>
            <input
              id="discount-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={64}
              placeholder="Code eingeben"
              aria-invalid={codeError ? true : undefined}
              aria-describedby={codeError ? "discount-error" : undefined}
              className="min-h-12 w-full flex-1 border border-border-strong bg-white px-4 font-mono uppercase tracking-[0.06em] text-foreground placeholder:normal-case placeholder:tracking-normal placeholder:text-muted focus:border-foreground focus:outline-none"
            />
            <button type="submit" disabled={checking || !code.trim()} className="btn-primary sm:w-auto">
              {checking ? "Wird geprüft …" : "Einlösen"}
            </button>
          </form>
        )}
        {codeError && !discount && (
          <p id="discount-error" className="mt-3 text-sm font-medium text-red-700" role="alert">
            {codeError}
          </p>
        )}
      </div>

      <div className="cells border border-border md:grid-cols-2">
        {ORDER.map((plan, i) => {
          const p = PLANS[plan];
          const recommended = plan === "lifetime";
          const reduced = discount?.prices[plan];
          const firstMonthOnly = plan === "monthly" && reduced !== undefined && discount?.duration !== "forever";
          return (
            <div key={plan} className={`relative flex flex-col p-6 sm:p-8 ${recommended ? "outline outline-2 -outline-offset-1 outline-buy" : ""}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="hud">
                  <span className="text-faint">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mx-2 text-faint">/</span>
                  <span className="text-foreground">{p.name}</span>
                </p>
                {recommended && <span className="tag !border-buy bg-buy !text-white">Empfohlen</span>}
              </div>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {reduced !== undefined && (
                  <span className="display whitespace-nowrap text-3xl text-faint line-through decoration-2">{p.label}</span>
                )}
                <span className="display whitespace-nowrap text-6xl">{reduced !== undefined ? euro(reduced) : p.label}</span>
                <span className="hud">{firstMonthOnly ? (discount?.duration === "repeating" && discount.months ? `die ersten ${discount.months} Monate` : "im ersten Monat") : p.per}</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {firstMonthOnly ? `Danach ${p.label} pro Monat, monatlich kündbar. Inkl. MwSt.` : note(plan, reduced ?? p.cents)}
              </p>
              {recommended && (
                <p className="mt-3 border-l-2 border-buy pl-3 text-sm leading-relaxed text-foreground">
                  Zum Vergleich: Adobe Creative Cloud Pro kostet 77,99 € im Monat, Microsoft 365 Single 99 € im Jahr.{" "}
                  <span className="text-muted">(Stand November 2026)</span>
                </p>
              )}
              <ul className="mb-8 mt-6 grid gap-3">
                {included[plan].map((item) => (
                  <li key={item} className="flex gap-3 text-[15px]">
                    <Check size={18} strokeWidth={2.6} className="mt-0.5 shrink-0 text-success" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto grid gap-3">
                <button onClick={() => checkout(plan)} disabled={busy !== null} className={`w-full ${recommended ? "btn-buy" : "btn-secondary"}`}>
                  {busy === plan ? "Sicherer Checkout öffnet sich …" : reduced !== undefined ? `Für ${euro(reduced)} ${plan === "lifetime" ? "dauerhaft kaufen" : "abonnieren"}` : cta[plan]}
                </button>
                {error?.plan === plan && busy === null && (
                  <p className="text-sm font-medium text-red-700" role="alert">
                    {error.message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="-mt-2 text-xs leading-relaxed text-muted">
        Die Koja-Apps sind frühe Versionen (Alpha, teils Pre-Alpha) und werden mit Updates laufend weiterentwickelt. Sichere Zahlung über Stripe per Kredit- oder Debitkarte oder einer anderen dort angezeigten Zahlungsart. Es gelten unsere{" "}
        <Link href="/agb" className="text-foreground underline underline-offset-2">
          AGB mit Widerrufsbelehrung
        </Link>
        .
      </p>

      <div className="flex flex-col items-start gap-4 border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px]">
          <span className="hud mr-2 text-foreground">Erst testen?</span>
          <span className="text-muted">Lade die Apps und nutze sie {TRIAL_DAYS} Tage lang kostenlos, ohne Zahlungsdaten.</span>
        </p>
        <DownloadButton source={source} label="Kostenlos laden" />
      </div>
    </div>
  );
}
