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
      if (!res.ok) throw new Error(data.error || "Das hat nicht geklappt. Bitte versuche es erneut.");
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Das hat nicht geklappt. Bitte versuche es erneut.");
    } finally {
      setBusy(false);
    }
  }

  if (step === "done") {
    return (
      <div className="rounded-[22px] border border-success/40 bg-[#f0fdf4] p-6 sm:p-8" role="status">
        <p className="display text-3xl">Kündigung eingegangen</p>
        <p className="mt-4 leading-relaxed text-muted">
          Falls zu <span className="text-foreground">{email}</span> ein aktives Koja-Abo gehört, ist es jetzt zum Ende des laufenden
          Abrechnungsmonats gekündigt. Wir buchen danach nichts mehr ab und haben dir eine Bestätigung an diese Adresse geschickt.
          Bewahre sie gut auf.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-[12px] border border-[#d6d3d1] bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-foreground focus:outline-none disabled:bg-surface";

  return (
    <form
      className="grid gap-5 rounded-[22px] border border-border bg-white p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (step === "form") setStep("confirm");
        else submit();
      }}
    >
      <div className="grid gap-2">
        <label htmlFor="cancel-name" className="text-sm font-semibold">
          Vor- und Nachname
        </label>
        <input id="cancel-name" required value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" disabled={step === "confirm"} />
      </div>
      <div className="grid gap-2">
        <label htmlFor="cancel-email" className="text-sm font-semibold">
          E-Mail-Adresse deines Abos
        </label>
        <input id="cancel-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" disabled={step === "confirm"} />
      </div>
      <fieldset className="grid gap-2" disabled={step === "confirm"}>
        <legend className="mb-2 text-sm font-semibold">Art der Kündigung</legend>
        <label className="flex items-center gap-3 text-sm">
          <input type="radio" name="type" checked={type === "ordinary"} onChange={() => setType("ordinary")} className="accent-[#111113]" />
          Ordentlich, zum Ende des laufenden Abrechnungsmonats
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="radio" name="type" checked={type === "extraordinary"} onChange={() => setType("extraordinary")} className="accent-[#111113]" />
          Außerordentlich (aus wichtigem Grund)
        </label>
      </fieldset>
      {type === "extraordinary" && (
        <div className="grid gap-2">
          <label htmlFor="cancel-reason" className="text-sm font-semibold">
            Grund
          </label>
          <textarea id="cancel-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className={field} disabled={step === "confirm"} />
        </div>
      )}

      {step === "confirm" && (
        <p className="rounded-[12px] bg-surface p-4 text-sm leading-relaxed text-muted">
          Bitte prüfe deine Angaben. Mit dem Button unten kündigst du dein Koja-Apps-Abo.
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={busy}>
          {step === "form" ? "Weiter" : busy ? "Wird gekündigt …" : "Jetzt kündigen"}
        </button>
        {step === "confirm" && (
          <button type="button" className="btn-secondary" onClick={() => setStep("form")}>
            Angaben ändern
          </button>
        )}
      </div>
    </form>
  );
}
