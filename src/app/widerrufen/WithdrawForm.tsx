"use client";

import { useState } from "react";

type Done = { receivedAt: string; emailSent: boolean };
type Contract = "monthly" | "lifetime" | "unknown";

const CONTRACT_LABEL: Record<Contract, string> = {
  monthly: "Koja-Apps · Monatlich (Abo)",
  lifetime: "Koja-Apps · Dauerhaft (Einmalkauf)",
  unknown: "Weiß ich nicht genau",
};

// Widerrufsfunktion (§ 356a BGB): all fields and the "Widerruf bestätigen" button on one page.
export default function WithdrawForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contract, setContract] = useState<Contract>("monthly");
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, contract, reference }),
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
        <p className="display text-3xl">Widerruf eingegangen</p>
        <p className="mt-4 font-semibold">
          Eingegangen am {date} um {time} Uhr
        </p>
        <dl className="mt-3 grid gap-1 text-[15px] text-muted">
          <div>
            <dt className="inline">Vertrag: </dt>
            <dd className="inline text-foreground">{CONTRACT_LABEL[contract]}</dd>
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
          Wir prüfen deinen Widerruf und melden uns innerhalb von drei Werktagen.{" "}
          {done.emailSent
            ? "Eine Eingangsbestätigung haben wir dir per E-Mail geschickt."
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
        <label htmlFor="withdraw-name" className="text-sm font-semibold">
          Vor- und Nachname
        </label>
        <input id="withdraw-name" required value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="withdraw-email" className="text-sm font-semibold">
          E-Mail-Adresse deines Kaufs (dorthin schicken wir die Bestätigung)
        </label>
        <input id="withdraw-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
      </div>
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-semibold">Welchen Vertrag widerrufst du?</legend>
        {(Object.keys(CONTRACT_LABEL) as Contract[]).map((c) => (
          <label key={c} className="flex items-center gap-3 text-sm">
            <input type="radio" name="contract" checked={contract === c} onChange={() => setContract(c)} className="h-4 w-4 accent-[#111113]" />
            {CONTRACT_LABEL[c]}
          </label>
        ))}
      </fieldset>
      <div className="grid gap-2">
        <label htmlFor="withdraw-reference" className="text-sm font-semibold">
          Lizenzschlüssel oder Rechnungsnummer <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="withdraw-reference" value={reference} onChange={(e) => setReference(e.target.value)} className={field} autoComplete="off" />
      </div>

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <div>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Wird gesendet …" : "Widerruf bestätigen"}
        </button>
      </div>
    </form>
  );
}
