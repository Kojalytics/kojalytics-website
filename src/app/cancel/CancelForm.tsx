"use client";

import { useState } from "react";

type Step = "form" | "confirm" | "done";

export default function CancelForm() {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"ordinary" | "extraordinary">("ordinary");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type, reason }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (step === "done") {
    return (
      <div className="rounded-[18px] border border-accent/40 bg-surface p-6 sm:p-8" role="status">
        <p className="display text-3xl sm:text-4xl">Cancellation received</p>
        <p className="mt-4 leading-relaxed text-muted">
          If an active Koja subscription belongs to <span className="text-foreground">{email}</span>, it is now cancelled at the end of
          the current billing month. You will not be charged again, and we have sent a confirmation to that address. Keep it for
          your records.
        </p>
      </div>
    );
  }

  const field = "w-full rounded-[10px] border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none";

  return (
    <form
      className="grid gap-5 rounded-[18px] border border-border bg-surface p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (step === "form") setStep("confirm");
        else submit();
      }}
    >
      <div className="grid gap-2">
        <label htmlFor="cancel-name" className="text-sm font-semibold">Full name</label>
        <input id="cancel-name" required value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" disabled={step === "confirm"} />
      </div>
      <div className="grid gap-2">
        <label htmlFor="cancel-email" className="text-sm font-semibold">Email address you subscribed with</label>
        <input id="cancel-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" disabled={step === "confirm"} />
      </div>
      <fieldset className="grid gap-2" disabled={step === "confirm"}>
        <legend className="mb-2 text-sm font-semibold">Type of cancellation</legend>
        <label className="flex items-center gap-3 text-sm">
          <input type="radio" name="type" checked={type === "ordinary"} onChange={() => setType("ordinary")} className="accent-[#d1fe17]" />
          Ordinary: at the end of the current billing month
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="radio" name="type" checked={type === "extraordinary"} onChange={() => setType("extraordinary")} className="accent-[#d1fe17]" />
          Extraordinary (for good cause)
        </label>
      </fieldset>
      {type === "extraordinary" && (
        <div className="grid gap-2">
          <label htmlFor="cancel-reason" className="text-sm font-semibold">Reason</label>
          <textarea id="cancel-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className={field} disabled={step === "confirm"} />
        </div>
      )}

      {step === "confirm" && (
        <p className="rounded-[10px] bg-background p-4 text-sm leading-relaxed text-muted">
          Please check your details. Clicking the button below cancels your Koja apps subscription.
        </p>
      )}
      {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={busy}>
          {step === "form" ? "Continue" : busy ? "Cancelling…" : "Cancel now (jetzt kündigen)"}
        </button>
        {step === "confirm" && (
          <button type="button" className="btn-secondary" onClick={() => setStep("form")}>
            Edit details
          </button>
        )}
      </div>
    </form>
  );
}
