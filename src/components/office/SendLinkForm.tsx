"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Check, Send } from "lucide-react";
import DownloadButton from "@/components/software/DownloadButton";
import { HONEYPOT, MIN_FILL_MS } from "@/lib/form-guard";
import { TRIAL_DAYS } from "@/lib/pricing";
import { track } from "@/lib/track";

const FAILED = "Das hat nicht geklappt. Bitte versuche es erneut.";

const subscribe = () => () => {};
// Same test as DownloadButton: a Mac or a Windows PC can install the apps, everything else gets the link by e-mail.
const canInstall = () => /Windows NT/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints < 2);

/**
 * The second way on the ad landing page, visible without a tap: on a phone the visitor e-mails the download link to
 * their computer (/api/send-link, the same request as SendLinkDialog). On a Mac or a Windows PC the download button
 * stands here instead. The server renders the form, because almost every visitor of /office is on a phone.
 * Styles: src/app/office/office.css (.ko-form).
 */
export default function SendLinkForm({ source }: { source: string }) {
  const computer = useSyncExternalStore(subscribe, canInstall, () => false);
  const id = useId();
  const sentRef = useRef<HTMLDivElement>(null);
  // When the form appeared. The server takes a form sent within MIN_FILL_MS for a bot.
  const shownAt = useRef(0);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    shownAt.current = performance.now();
  }, []);

  useEffect(() => {
    if (sentTo) sentRef.current?.focus();
  }, [sentTo]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trap = String(new FormData(e.currentTarget).get(HONEYPOT) ?? "");
    setBusy(true);
    setError(null);
    try {
      // Someone very quick (e.g. with autofill) waits out the rest under "Wird gesendet …" and is never taken for a bot.
      const wait = MIN_FILL_MS + 250 - (performance.now() - shownAt.current);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      const res = await fetch("/api/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, remind: false, source, fillMs: Math.round(performance.now() - shownAt.current), [HONEYPOT]: trap }),
      }).catch(() => null);
      const data = res ? await res.json().catch(() => ({})) : {};
      if (!res?.ok) {
        setError(data.error || FAILED);
        return;
      }
      track("SendToMac", { content_name: source });
      setSentTo(email.trim());
    } finally {
      setBusy(false);
    }
  }

  if (computer) return <DownloadButton source={source} label={`${TRIAL_DAYS} Tage kostenlos testen`} className="ko-btn" />;

  if (sentTo)
    return (
      <div ref={sentRef} tabIndex={-1} role="status" className="ko-form-done">
        <Check size={24} strokeWidth={3} aria-hidden />
        <p>
          <b>
            Gesendet an <span>{sentTo}</span>.
          </b>
          Öffne die E-Mail an deinem Computer und lade dort den Kojalytics Launcher.
        </p>
      </div>
    );

  return (
    <form className="ko-form" onSubmit={submit}>
      {/* Trap for bots that fill every field: off-screen, out of the tab order, hidden from screen readers. */}
      <div aria-hidden="true" className="ko-form-trap">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <label htmlFor={`${id}-email`}>Deine E-Mail-Adresse</label>
      <input
        id={`${id}-email`}
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        required
        maxLength={254}
        placeholder="name@beispiel.de"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="ko-form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn-primary ko-btn" disabled={busy}>
        <Send size={15} strokeWidth={2.2} aria-hidden />
        {busy ? "Wird gesendet …" : "Link an meinen Computer schicken"}
      </button>
      <p className="ko-form-note">Am Computer {TRIAL_DAYS} Tage gratis testen, ohne Zahlungsdaten.</p>
      <p className="ko-form-legal">
        Wir nutzen deine Adresse nur dafür. Mehr in der{" "}
        <Link href="/datenschutz" prefetch={false}>
          Datenschutzerklärung
        </Link>
        .
      </p>
    </form>
  );
}
