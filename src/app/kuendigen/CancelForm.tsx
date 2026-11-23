"use client";

import { useEffect, useRef, useState } from "react";
import { HONEYPOT, MIN_FILL_MS } from "@/lib/form-guard";
import type { Lang } from "@/lib/i18n";

type Done = { receivedAt: string; emailSent: boolean };

const de = {
  failed: "Das hat nicht geklappt. Bitte versuche es erneut.",
  locale: "de-DE",
  received: "Kündigung eingegangen",
  receivedAt: (date: string, time: string) => `Eingegangen am ${date} um ${time} Uhr`,
  typeShort: "Art: ",
  nameShort: "Name: ",
  emailShort: "E-Mail: ",
  kindOrdinary: "ordentlich, zum nächstmöglichen Zeitpunkt",
  kindExtraordinary: "außerordentlich (aus wichtigem Grund)",
  next: "Gehört zu dieser Adresse ein Koja-Apps-Abo, endet es zum Ende des laufenden Abrechnungsmonats. Danach buchen wir nichts mehr ab.",
  emailSent: "Eine Eingangsbestätigung mit dem genauen Enddatum haben wir dir per E-Mail geschickt.",
  emailFailed: "Die Bestätigung per E-Mail konnten wir gerade nicht senden. Bitte speichere oder drucke diese Seite.",
  print: "Seite drucken oder speichern",
  name: "Vor- und Nachname",
  email: "E-Mail-Adresse deines Abos (dorthin schicken wir die Bestätigung)",
  key: "Dein Lizenzschlüssel, falls zur Hand ",
  optional: "(optional)",
  keyHint: "Er steht in der E-Mail zu deinem Kauf. Ohne ihn finden wir deinen Vertrag über deine E-Mail-Adresse.",
  type: "Art der Kündigung",
  ordinary: "Ordentlich, zum nächstmöglichen Zeitpunkt (Ende des laufenden Abrechnungsmonats)",
  extraordinary: "Außerordentlich (aus wichtigem Grund)",
  reason: "Grund",
  sending: "Wird gekündigt …",
  submit: "Jetzt kündigen",
};
const en: typeof de = {
  failed: "That didn't work. Please try again.",
  locale: "en-GB",
  received: "Cancellation received",
  receivedAt: (date, time) => `Received on ${date} at ${time} (Berlin time)`,
  typeShort: "Type: ",
  nameShort: "Name: ",
  emailShort: "Email: ",
  kindOrdinary: "ordinary, at the earliest possible date",
  kindExtraordinary: "extraordinary (for good cause)",
  next: "If there is a Koja apps subscription for this address, it ends at the end of the current billing month. After that, we will not charge you again.",
  emailSent: "We have sent you an acknowledgement of receipt with the exact end date by email.",
  emailFailed: "We could not send the confirmation by email just now. Please save or print this page.",
  print: "Print or save this page",
  name: "First and last name",
  email: "Email address of your subscription (we will send the confirmation there)",
  key: "Your license key, if you have it to hand ",
  optional: "(optional)",
  keyHint: "You will find it in the email about your purchase. Without it, we will find your contract using your email address.",
  type: "Type of cancellation",
  ordinary: "Ordinary, at the earliest possible date (end of the current billing month)",
  extraordinary: "Extraordinary (for good cause)",
  reason: "Reason",
  sending: "Cancelling …",
  submit: "Cancel now",
};
const T = { de, en };

// The confirmation page of the Kündigungsbutton (§ 312k BGB): all fields and the "Jetzt kündigen" button on one page.
export default function CancelForm({ lang = "de" }: { lang?: Lang }) {
  const t = T[lang];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [type, setType] = useState<"ordinary" | "extraordinary">("ordinary");
  const [reason, setReason] = useState("");
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
      // Someone very quick (e.g. with autofill) waits out the rest under "Wird gekündigt …" and is never taken for a bot.
      const shown = shownAt.current;
      if (shown !== null) {
        const wait = MIN_FILL_MS + 250 - (performance.now() - shown);
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      }
      const fillMs = shown === null ? undefined : Math.round(performance.now() - shown);
      // `lang` makes the API answer and send its confirmation in the page's language.
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, reference, type, reason, lang, [HONEYPOT]: trap, fillMs }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t.failed);
      setDone({ receivedAt: data.receivedAt ?? new Date().toISOString(), emailSent: Boolean(data.emailSent) });
    } catch (e) {
      setError(e instanceof Error ? e.message : t.failed);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    const at = new Date(done.receivedAt);
    const date = at.toLocaleDateString(t.locale, { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin" });
    const time = at.toLocaleTimeString(t.locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" });
    return (
      <div className="border border-border border-t-2 border-t-success p-5 sm:p-8" role="status">
        <p className="display text-[clamp(1.6rem,3vw,2.1rem)]">{t.received}</p>
        <p className="mt-4 font-semibold">{t.receivedAt(date, time)}</p>
        <dl className="mt-5 border-t border-border text-[15px]">
          <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-b border-border py-2.5">
            <dt className="hud pt-[3px]">{t.typeShort}</dt>
            <dd className="break-words text-foreground">
              {type === "extraordinary" ? t.kindExtraordinary : t.kindOrdinary}
            </dd>
          </div>
          <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-b border-border py-2.5">
            <dt className="hud pt-[3px]">{t.nameShort}</dt>
            <dd className="break-words text-foreground">{name}</dd>
          </div>
          <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-b border-border py-2.5">
            <dt className="hud pt-[3px]">{t.emailShort}</dt>
            <dd className="break-words text-foreground">{email}</dd>
          </div>
        </dl>
        <p className="mt-5 leading-relaxed text-muted">
          {t.next} {done.emailSent ? t.emailSent : t.emailFailed}
        </p>
        <button type="button" onClick={() => window.print()} className="btn-secondary mt-6 w-full sm:w-auto">
          {t.print}
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
        <label htmlFor="cancel-website">Website</label>
        <input id="cancel-website" name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="cancel-name" className="text-sm font-semibold">
          {t.name}
        </label>
        <input id="cancel-name" required value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="cancel-email" className="text-sm font-semibold">
          {t.email}
        </label>
        <input id="cancel-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="cancel-reference" className="text-sm font-semibold">
          {t.key}<span className="font-normal text-muted">{t.optional}</span>
        </label>
        <input
          id="cancel-reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className={field}
          autoComplete="off"
          placeholder="KOJA-XXXXX-XXXXX-…"
          aria-describedby="cancel-reference-hint"
        />
        <p id="cancel-reference-hint" className="text-xs leading-relaxed text-muted">
          {t.keyHint}
        </p>
      </div>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">{t.type}</legend>
        <div className="cells border border-border">
          <label className="flex min-h-12 cursor-pointer items-start gap-3 px-4 py-3.5 text-sm leading-snug text-muted has-[:checked]:text-foreground">
            <input type="radio" name="type" checked={type === "ordinary"} onChange={() => setType("ordinary")} className="mt-0.5 h-4 w-4 shrink-0 accent-foreground" />
            {t.ordinary}
          </label>
          <label className="flex min-h-12 cursor-pointer items-start gap-3 px-4 py-3.5 text-sm leading-snug text-muted has-[:checked]:text-foreground">
            <input type="radio" name="type" checked={type === "extraordinary"} onChange={() => setType("extraordinary")} className="mt-0.5 h-4 w-4 shrink-0 accent-foreground" />
            {t.extraordinary}
          </label>
        </div>
      </fieldset>
      {type === "extraordinary" && (
        <div className="grid gap-2">
          <label htmlFor="cancel-reason" className="text-sm font-semibold">
            {t.reason}
          </label>
          <textarea id="cancel-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className={field} />
        </div>
      )}

      {error && (
        <p className="border-l-2 border-red-700 pl-3 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <div>
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={busy}>
          {busy ? t.sending : t.submit}
        </button>
      </div>
    </form>
  );
}
