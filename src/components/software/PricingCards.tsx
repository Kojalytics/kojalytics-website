"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Tag, X } from "lucide-react";
import { TRIAL_DAYS, planText, type Plan } from "@/lib/pricing";
import { applyDiscount, clearDiscount, useDiscount } from "@/lib/discount-store";
import { PRICES, money, vatIncluded } from "@/lib/currency";
import { useCurrency } from "@/lib/use-currency";
import { discountLabel } from "@/lib/discount-text";
import { href } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";
import { track } from "@/lib/track";
import { isOfferCode, offerText } from "@/lib/offer";
import DownloadButton from "./DownloadButton";

// The one-time price pays off after this many months of the subscription.
const breakEven = (lifetimeCents: number, monthlyCents: number) => Math.ceil(lifetimeCents / monthlyCents);

const de = {
  included: {
    monthly: ["Alle 13 Koja-Apps", "Alle Updates inklusive", "Auf bis zu 3 Geräten (Mac oder Windows-PC)", "Jederzeit online kündbar"],
    lifetime: ["Alle 13 Koja-Apps, ohne Ablaufdatum", "Updates über den Kojalytics Launcher", "Auf bis zu 3 Geräten (Mac oder Windows-PC)", "Einmal zahlen, keine Verlängerung"],
  } as Record<Plan, string[]>,
  note: (plan: Plan, months: number, vat: boolean) =>
    plan === "monthly"
      ? `Abrechnung ab Kauf, monatlich kündbar.${vat ? " Inkl. MwSt." : ""}`
      : `Einmal zahlen, dauerhaft nutzen.${vat ? " Inkl. MwSt." : ""} Lohnt sich ab dem ${months}. Monat.`,
  cta: (plan: Plan, price: string) => (plan === "monthly" ? `Für ${price} im Monat abonnieren` : `Für ${price} dauerhaft kaufen`),
  ctaReduced: (plan: Plan, price: string) => `Für ${price} ${plan === "lifetime" ? "dauerhaft kaufen" : "abonnieren"}`,
  busy: "Sicherer Checkout öffnet sich …",
  firstMonths: (months: number) => `die ersten ${months} Monate`,
  firstMonth: "im ersten Monat",
  thenMonthly: (price: string, vat: boolean) => `Danach ${price} pro Monat, monatlich kündbar.${vat ? " Inkl. MwSt." : ""}`,
  recommended: "Empfohlen",
  compare: "Zum Vergleich: Adobe Creative Cloud Pro kostet 77,99 € im Monat, Microsoft 365 Single 99 € im Jahr.",
  compareAsOf: "(Stand November 2026)",
  applied: ["Rabattcode ", " angewendet:"],
  introUntil: "Einführungspreis bis ",
  remove: " Entfernen",
  redeemLabel: " Rabattcode einlösen",
  placeholder: "Code eingeben",
  checking: "Wird geprüft …",
  redeem: "Einlösen",
  codeFailed: "Der Code konnte nicht geprüft werden.",
  codeRetry: "Der Code konnte nicht geprüft werden. Bitte versuche es gleich noch einmal.",
  checkoutFailed: "Der Bezahlvorgang konnte nicht gestartet werden. Bitte versuche es gleich noch einmal.",
  legal: [
    "Die Koja-Apps werden laufend weiterentwickelt, Updates und neue Funktionen bekommst du automatisch und kostenlos. Sichere Zahlung über Stripe per Kredit- oder Debitkarte oder einer anderen dort angezeigten Zahlungsart. Es gelten unsere",
    "AGB mit Widerrufsbelehrung",
    ".",
  ],
  trialTitle: "Erst testen?",
  trial: ["Lade die Apps und nutze sie ", " Tage lang kostenlos, ohne Zahlungsdaten."],
  download: "Kostenlos laden",
};

const en: typeof de = {
  included: {
    monthly: ["All 13 Koja apps", "All updates included", "On up to 3 devices (Mac or Windows PC)", "Cancel online at any time"],
    lifetime: ["All 13 Koja apps, no expiry date", "Updates through the Kojalytics Launcher", "On up to 3 devices (Mac or Windows PC)", "Pay once, no renewal"],
  },
  note: (plan: Plan, months: number, vat: boolean) =>
    plan === "monthly"
      ? `Billed from the day you buy, cancel any month.${vat ? " Incl. VAT." : ""}`
      : `Pay once, no expiry date.${vat ? " Incl. VAT." : ""} Pays for itself from month ${months}.`,
  cta: (plan: Plan, price: string) => (plan === "monthly" ? `Subscribe for ${price} a month` : `Buy for ${price}`),
  ctaReduced: (plan: Plan, price: string) => (plan === "lifetime" ? `Buy for ${price}` : `Subscribe for ${price}`),
  busy: "Opening secure checkout…",
  firstMonths: (months: number) => `for the first ${months} months`,
  firstMonth: "for the first month",
  thenMonthly: (price: string, vat: boolean) => `Then ${price} a month, cancel any month.${vat ? " Incl. VAT." : ""}`,
  recommended: "Recommended",
  compare: "For comparison: Adobe Creative Cloud Pro costs €77.99 a month, Microsoft 365 Single €99 a year.",
  compareAsOf: "(German prices, November 2026)",
  applied: ["Discount code ", " applied:"],
  introUntil: "Introductory price until ",
  remove: " Remove",
  redeemLabel: " Redeem a discount code",
  placeholder: "Enter code",
  checking: "Checking…",
  redeem: "Redeem",
  codeFailed: "We couldn't check the code.",
  codeRetry: "We couldn't check the code. Please try again in a moment.",
  checkoutFailed: "We couldn't start the checkout. Please try again in a moment.",
  legal: [
    "The Koja apps are under continuous development: you get updates and new features automatically and free of charge. Secure payment through Stripe by credit or debit card or any other payment method shown there. Our",
    "terms and conditions, including the withdrawal policy,",
    " apply.",
  ],
  trialTitle: "Try first?",
  trial: ["Download the apps and use them free for ", " days, no payment details needed."],
  download: "Download free",
};

// The one-time purchase is the plan we recommend; it comes first and gets the dark button.
const ORDER: Plan[] = ["lifetime", "monthly"];

export default function PricingCards({ source }: { source: string }) {
  const lang = useLang();
  const cur = useCurrency();
  const vat = vatIncluded(cur);
  const t = lang === "de" ? de : en;
  const [busy, setBusy] = useState<Plan | null>(null);
  const [error, setError] = useState<{ plan: Plan; message: string } | null>(null);
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  // Shared with the other buy buttons; an ad link (?code=X) fills it on its own.
  const discount = useDiscount();

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
        body: JSON.stringify({ code, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCodeError(data.error || t.codeFailed);
        return;
      }
      applyDiscount(data);
    } catch {
      setCodeError(t.codeRetry);
    } finally {
      setChecking(false);
    }
  }

  async function checkout(plan: Plan) {
    const price = discount?.prices[plan] ?? PRICES[cur][plan];
    setBusy(plan);
    setError(null);
    track("InitiateCheckout", { value: price / 100, currency: cur, content_name: plan });
    try {
      const res = await fetch("/api/license/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, lang, ...(discount && discount.prices[plan] !== undefined ? { code: discount.code } : {}) }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "checkout failed");
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error && err.message !== "checkout failed" ? err.message : null;
      setError({ plan, message: message || t.checkoutFailed });
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
                {t.applied[0]}<span className="font-mono font-semibold tracking-[0.06em]">{discount.code}</span>{t.applied[1]}{" "}
                <span className="whitespace-nowrap font-semibold">{discountLabel(discount.label, lang)}</span>
                {isOfferCode(discount.code) && <span className="block text-muted">{t.introUntil}{offerText(lang, cur).endLong}</span>}
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                clearDiscount();
                setCode("");
              }}
              className="hud -my-2 inline-flex min-h-11 items-center gap-1.5 hover:text-foreground"
            >
              <X size={13} aria-hidden />{t.remove}
            </button>
          </div>
        ) : (
          <form onSubmit={redeem} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="discount-code" className="flex shrink-0 items-center gap-2 text-[15px] font-semibold text-foreground">
              <Tag size={17} className="text-buy" aria-hidden />{t.redeemLabel}
            </label>
            <input
              id="discount-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={64}
              placeholder={t.placeholder}
              aria-invalid={codeError ? true : undefined}
              aria-describedby={codeError ? "discount-error" : undefined}
              className="min-h-12 w-full flex-1 border border-border-strong bg-white px-4 font-mono uppercase tracking-[0.06em] text-foreground placeholder:normal-case placeholder:tracking-normal placeholder:text-muted focus:border-foreground focus:outline-none"
            />
            <button type="submit" disabled={checking || !code.trim()} className="btn-primary sm:w-auto">
              {checking ? t.checking : t.redeem}
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
          const p = planText(plan, lang, cur);
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
                {recommended && <span className="tag !border-buy bg-buy !text-white">{t.recommended}</span>}
              </div>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {reduced !== undefined && (
                  <span className="display whitespace-nowrap text-3xl text-faint line-through decoration-2">{p.label}</span>
                )}
                <span className="display whitespace-nowrap text-6xl">{reduced !== undefined ? money(reduced, cur, lang) : p.label}</span>
                <span className="hud">{firstMonthOnly ? (discount?.duration === "repeating" && discount.months ? t.firstMonths(discount.months) : t.firstMonth) : p.per}</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {firstMonthOnly ? t.thenMonthly(p.label, vat) : t.note(plan, breakEven(reduced ?? p.cents, PRICES[cur].monthly), vat)}
              </p>
              {/* German list prices of Adobe and Microsoft: only next to euro prices */}
              {recommended && cur === "EUR" && (
                <p className="mt-3 border-l-2 border-buy pl-3 text-sm leading-relaxed text-foreground">
                  {t.compare}{" "}
                  <span className="text-muted">{t.compareAsOf}</span>
                </p>
              )}
              <ul className="mb-8 mt-6 grid gap-3">
                {t.included[plan].map((item) => (
                  <li key={item} className="flex gap-3 text-[15px]">
                    <Check size={18} strokeWidth={2.6} className="mt-0.5 shrink-0 text-success" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto grid gap-3">
                <button onClick={() => checkout(plan)} disabled={busy !== null} className={`w-full ${recommended ? "btn-buy" : "btn-secondary"}`}>
                  {busy === plan ? t.busy : reduced !== undefined ? t.ctaReduced(plan, money(reduced, cur, lang)) : t.cta(plan, p.label)}
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
        {t.legal[0]}{" "}
        <Link href={href(lang, "/agb")} className="text-foreground underline underline-offset-2">
          {t.legal[1]}
        </Link>
        {t.legal[2]}
      </p>

      <div className="flex flex-col items-start gap-4 border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px]">
          <span className="hud mr-2 text-foreground">{t.trialTitle}</span>
          <span className="text-muted">{t.trial[0]}{TRIAL_DAYS}{t.trial[1]}</span>
        </p>
        <DownloadButton source={source} label={t.download} />
      </div>
    </div>
  );
}
