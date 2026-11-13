"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { HONEYPOT, MIN_FILL_MS } from "@/lib/form-guard";
import { TRIAL_DAYS } from "@/lib/pricing";
import { track } from "@/lib/track";

const FAILED = "Das hat nicht geklappt. Bitte versuche es erneut.";

/**
 * Phones and tablets cannot install the apps: the visitor e-mails the download links to themselves (/api/send-link)
 * or shares the page. A modal <dialog>: a bottom sheet on phones, centred from sm up. Escape closes it.
 */
export default function SendLinkDialog({ source, onClose }: { source: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  // When the dialog appeared. The server takes a form sent within MIN_FILL_MS for a bot.
  const shownAt = useRef(0);
  const [email, setEmail] = useState("");
  const [remind, setRemind] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    inputRef.current?.focus();
    shownAt.current = performance.now();
  }, []);

  useEffect(() => {
    if (sentTo) sentRef.current?.focus();
  }, [sentTo]);

  const close = () => dialogRef.current?.close();

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
        body: JSON.stringify({ email, remind, source, fillMs: Math.round(performance.now() - shownAt.current), [HONEYPOT]: trap }),
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

  // The earlier behaviour of the button: share sheet, else clipboard, else a prepared e-mail.
  async function share() {
    track("SendToMac", { content_name: source });
    const url = `${window.location.origin}/software`;
    const text = `Koja-Apps für Mac und Windows: laden und ${TRIAL_DAYS} Tage kostenlos testen.`;
    if (navigator.share) {
      await navigator.share({ title: "Koja-Apps für Mac und Windows", text, url }).then(close, () => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.location.href = `mailto:?subject=${encodeURIComponent("Koja-Apps für Mac und Windows")}&body=${encodeURIComponent(`${text}\n${url}`)}`;
    }
  }

  const field =
    "min-h-12 w-full border border-border-strong bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-foreground focus:outline-none";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="send-link-title"
      aria-describedby="send-link-text"
      onClose={onClose}
      // A tap on the dimmed backdrop closes the sheet.
      onClick={(e) => e.target === e.currentTarget && close()}
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[90dvh] w-full max-w-none overflow-y-auto border-0 border-t border-foreground bg-white p-0 text-foreground backdrop:bg-foreground/45 sm:inset-0 sm:m-auto sm:h-fit sm:max-w-[28rem] sm:border"
    >
      <div className="relative px-5 pt-6 sm:px-7 sm:pt-7" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>
        <button
          type="button"
          onClick={close}
          aria-label="Schließen"
          className="absolute right-1.5 top-1.5 grid h-11 w-11 place-items-center text-muted transition-colors hover:text-foreground"
        >
          <X size={18} aria-hidden />
        </button>
        <h2 id="send-link-title" className="display pr-10 text-[1.4rem] sm:text-[1.55rem]">
          Link an deinen Computer schicken
        </h2>
        <p id="send-link-text" className="mt-3 text-[15px] leading-relaxed text-muted">
          Die Apps laufen auf Mac und Windows. Wir schicken dir den Download-Link, öffne ihn am Computer.
        </p>

        {sentTo ? (
          <>
            <div ref={sentRef} tabIndex={-1} role="status" className="mt-5 border border-border border-t-2 border-t-success p-4 outline-none">
              <p className="font-semibold">
                Gesendet an <span className="break-all">{sentTo}</span>.
              </p>
              <p className="mt-1 text-muted">Öffne die E-Mail an deinem Computer.</p>
            </div>
            <button type="button" onClick={close} className="btn-secondary mt-4 w-full">
              Fertig
            </button>
          </>
        ) : (
          <>
            <form className="relative mt-5 grid gap-4" onSubmit={submit}>
              {/* Trap for bots that fill every field: off-screen, out of the tab order, hidden from screen readers. */}
              <div aria-hidden="true" className="absolute -left-[10000px] top-0 h-px w-px overflow-hidden">
                <label htmlFor="send-link-website">Website</label>
                <input id="send-link-website" name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="send-link-email" className="text-sm font-semibold">
                  Deine E-Mail-Adresse
                </label>
                <input
                  ref={inputRef}
                  id="send-link-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "send-link-error" : undefined}
                  className={field}
                />
              </div>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-muted has-[:checked]:text-foreground">
                <input
                  type="checkbox"
                  checked={remind}
                  onChange={(e) => setRemind(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-foreground"
                />
                Erinnere mich morgen noch einmal per E-Mail
              </label>
              {error && (
                <p id="send-link-error" className="border-l-2 border-red-700 pl-3 text-sm font-medium text-red-700" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="btn-primary w-full" disabled={busy}>
                {busy ? "Wird gesendet …" : "Link senden"}
              </button>
              <p className="text-xs leading-relaxed text-muted">
                Wir nutzen deine Adresse nur dafür. Mehr in der{" "}
                <Link href="/datenschutz" className="text-foreground underline underline-offset-2">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </form>
            <button
              type="button"
              onClick={share}
              className="mt-3 min-h-11 text-sm font-medium text-muted underline underline-offset-4 transition-colors hover:text-foreground"
            >
              <span aria-live="polite">{copied ? "Link kopiert, öffne ihn am Computer" : "Stattdessen teilen"}</span>
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}
