"use client";

import { useEffect, useRef, useState } from "react";
import { HONEYPOT, MIN_FILL_MS } from "@/lib/form-guard";

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
  // When the form appeared. The server takes a form sent within MIN_FILL_MS for a bot.
  const shownAt = useRef<number | null>(null);
  useEffect(() => {
    shownAt.current = performance.now();
  }, []);

  async function submit(trap: string) {
    setBusy(true);
    setError(null);
    try {
      // Someone very quick (e.g. with autofill) waits out the rest under "Wird gesendet …" and is never taken for a bot.
      const shown = shownAt.current;
      if (shown !== null) {
        const wait = MIN_FILL_MS + 250 - (performance.now() - shown);
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      }
      const fillMs = shown === null ? undefined : Math.round(performance.now() - shown);
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, contract, reference, [HONEYPOT]: trap, fillMs }),
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
      <div className="border border-border border-t-2 border-t-success p-5 sm:p-8" role="status">
        <p className="display text-[clamp(1.6rem,3vw,2.1rem)]">Widerruf eingegangen</p>
        <p className="mt-4 font-semibold">
          Eingegangen am {date} um {time} Uhr
        </p>
        <dl className="mt-5 border-t border-border text-[15px]">
          <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-b border-border py-2.5">
            <dt className="hud pt-[3px]">Vertrag: </dt>
            <dd className="break-words text-foreground">{CONTRACT_LABEL[contract]}</dd>
          </div>
          <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-b border-border py-2.5">
            <dt className="hud pt-[3px]">Name: </dt>
            <dd className="break-words text-foreground">{name}</dd>
          </div>
          <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-b border-border py-2.5">
            <dt className="hud pt-[3px]">E-Mail: </dt>
            <dd className="break-words text-foreground">{email}</dd>
          </div>
        </dl>
        <p className="mt-5 leading-relaxed text-muted">
          Wir prüfen deinen Widerruf und melden uns innerhalb von drei Werktagen.{" "}
          {done.emailSent
            ? "Eine Eingangsbestätigung haben wir dir per E-Mail geschickt."
            : "Die Bestätigung per E-Mail konnten wir gerade nicht senden. Bitte speichere oder drucke diese Seite."}
        </p>
        <button type="button" onClick={() => window.print()} className="btn-secondary mt-6 w-full sm:w-auto">
          Seite drucken oder speichern
        </button>
      </div>
    );
  }

  const field =
    "min-h-12 w-full border border-border-strong bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-foreground focus:outline-none";

  return (
    <form
      className="relative grid gap-6 border border-border p-5 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        submit(String(new FormData(e.currentTarget).get(HONEYPOT) ?? ""));
      }}
    >
      {/* Trap for bots that fill every field: off-screen, out of the tab order, hidden from screen readers. */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-0 h-px w-px overflow-hidden">
        <label htmlFor="withdraw-website">Website</label>
        <input id="withdraw-website" name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
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
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Welchen Vertrag widerrufst du?</legend>
        <div className="cells border border-border">
          {(Object.keys(CONTRACT_LABEL) as Contract[]).map((c) => (
            <label key={c} className="flex min-h-12 cursor-pointer items-start gap-3 px-4 py-3.5 text-sm leading-snug text-muted has-[:checked]:text-foreground">
              <input type="radio" name="contract" checked={contract === c} onChange={() => setContract(c)} className="mt-0.5 h-4 w-4 shrink-0 accent-foreground" />
              {CONTRACT_LABEL[c]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-2">
        <label htmlFor="withdraw-reference" className="text-sm font-semibold">
          Lizenzschlüssel oder Rechnungsnummer <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="withdraw-reference" value={reference} onChange={(e) => setReference(e.target.value)} className={field} autoComplete="off" />
      </div>

      {error && (
        <p className="border-l-2 border-red-700 pl-3 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <div>
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={busy}>
          {busy ? "Wird gesendet …" : "Widerruf bestätigen"}
        </button>
      </div>
    </form>
  );
}
