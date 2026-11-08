"use client";

import { useState } from "react";

type Done = { receivedAt: string; emailSent: boolean };

// The confirmation page of the Kündigungsbutton (§ 312k BGB): all fields and the "Jetzt kündigen" button on one page.
export default function CancelForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [type, setType] = useState<"ordinary" | "extraordinary">("ordinary");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, reference, type, reason }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Das hat nicht geklappt. Bitte versuche es erneut.");
      setDone({ receivedAt: data.receivedAt ?? new Date().toISOString(), emailSent: Boolean(data.emailSent) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Das hat nicht geklappt. Bitte versuche es erneut.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    const at = new Date(done.receivedAt);
    const date = at.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin" });
    const time = at.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" });
    return (
      <div className="rounded-[22px] border border-success/40 bg-[#f0fdf4] p-6 sm:p-8" role="status">
        <p className="display text-3xl">Kündigung eingegangen</p>
        <p className="mt-4 font-semibold">
          Eingegangen am {date} um {time} Uhr
        </p>
        <dl className="mt-3 grid gap-1 text-[15px] text-muted">
          <div>
            <dt className="inline">Art: </dt>
            <dd className="inline text-foreground">
              {type === "extraordinary" ? "außerordentlich (aus wichtigem Grund)" : "ordentlich, zum nächstmöglichen Zeitpunkt"}
            </dd>
          </div>
          <div>
            <dt className="inline">Name: </dt>
            <dd className="inline text-foreground">{name}</dd>
          </div>
          <div>
            <dt className="inline">E-Mail: </dt>
            <dd className="inline text-foreground">{email}</dd>
          </div>
        </dl>
        <p className="mt-4 leading-relaxed text-muted">
          Gehört zu dieser Adresse ein Koja-Apps-Abo, endet es zum Ende des laufenden Abrechnungsmonats. Danach buchen wir nichts mehr ab.{" "}
          {done.emailSent
            ? "Eine Eingangsbestätigung mit dem genauen Enddatum haben wir dir per E-Mail geschickt."
            : "Die Bestätigung per E-Mail konnten wir gerade nicht senden. Bitte speichere oder drucke diese Seite."}
        </p>
        <button type="button" onClick={() => window.print()} className="btn-secondary mt-6">
          Seite drucken oder speichern
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-[12px] border border-[#d6d3d1] bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-foreground focus:outline-none";

  return (
    <form
      className="grid gap-5 rounded-[22px] border border-border bg-white p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="grid gap-2">
        <label htmlFor="cancel-name" className="text-sm font-semibold">
          Vor- und Nachname
        </label>
        <input id="cancel-name" required value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="cancel-email" className="text-sm font-semibold">
          E-Mail-Adresse deines Abos (dorthin schicken wir die Bestätigung)
        </label>
        <input id="cancel-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="cancel-reference" className="text-sm font-semibold">
          Lizenzschlüssel oder Rechnungsnummer <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="cancel-reference" value={reference} onChange={(e) => setReference(e.target.value)} className={field} autoComplete="off" />
      </div>
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-semibold">Art der Kündigung</legend>
        <label className="flex items-center gap-3 text-sm">
          <input type="radio" name="type" checked={type === "ordinary"} onChange={() => setType("ordinary")} className="h-4 w-4 accent-[#111113]" />
          Ordentlich, zum nächstmöglichen Zeitpunkt (Ende des laufenden Abrechnungsmonats)
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="radio" name="type" checked={type === "extraordinary"} onChange={() => setType("extraordinary")} className="h-4 w-4 accent-[#111113]" />
          Außerordentlich (aus wichtigem Grund)
        </label>
      </fieldset>
      {type === "extraordinary" && (
        <div className="grid gap-2">
          <label htmlFor="cancel-reason" className="text-sm font-semibold">
            Grund
          </label>
          <textarea id="cancel-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className={field} />
        </div>
      )}

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <div>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Wird gekündigt …" : "Jetzt kündigen"}
        </button>
      </div>
    </form>
  );
}
