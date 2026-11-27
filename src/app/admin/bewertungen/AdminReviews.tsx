"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeCheck, Eye, EyeOff, LogOut, Trash2, Upload } from "lucide-react";
import { Stars } from "@/components/reviews/Reviews";
import type { ReviewRow, ReviewStatus } from "@/lib/reviews";

/**
 * /admin/bewertungen: the owner manages the reviews. Password = REVIEWS_ADMIN_PASSWORD (Vercel env), kept in this tab only.
 * Publish, hide, mark "Verifizierter Kauf", delete, import.
 */

const KEY = "kj-reviews-admin";
const STATUS_LABEL: Record<ReviewStatus, string> = { pending: "Wartet", published: "Veröffentlicht", hidden: "Ausgeblendet" };
const FILTERS: { id: "all" | ReviewStatus; label: string }[] = [
  { id: "pending", label: "Wartet auf Freigabe" },
  { id: "published", label: "Veröffentlicht" },
  { id: "hidden", label: "Ausgeblendet" },
  { id: "all", label: "Alle" },
];

const field = "min-h-11 w-full border border-border-strong bg-white px-3 py-2 text-foreground placeholder:text-muted focus:border-foreground focus:outline-none";

/** CSV with a header row (comma or semicolon), quotes allowed; or a JSON array. */
function parseImport(text: string): Record<string, string>[] {
  const t = text.trim();
  if (!t) return [];
  if (t.startsWith("[")) return JSON.parse(t);
  const sep = (t.split("\n")[0].match(/;/g)?.length ?? 0) > (t.split("\n")[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (quoted) {
      if (c === '"' && t[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  row.push(cell);
  rows.push(row);
  const head = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).filter((r) => r.some((c) => c.trim())).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}

export default function AdminReviews() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [filter, setFilter] = useState<"all" | ReviewStatus>("pending");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState("");

  const call = useCallback(
    async (method: string, body?: unknown, pw = password) => {
      const res = await fetch("/api/admin/reviews", {
        method,
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(data?.error || `Fehler ${res.status}`), { status: res.status });
      return data;
    },
    [password],
  );

  const load = useCallback(
    async (pw = password) => {
      setError("");
      try {
        const data = await call("GET", undefined, pw);
        setReviews(data.reviews ?? []);
        setAuthed(true);
        try {
          sessionStorage.setItem(KEY, pw);
        } catch {}
      } catch (err) {
        setAuthed(false);
        setError((err as Error).message);
        if ((err as { status?: number }).status === 401) {
          try {
            sessionStorage.removeItem(KEY);
          } catch {}
        }
      }
    },
    [call, password],
  );

  useEffect(() => {
    let saved = "";
    try {
      saved = sessionStorage.getItem(KEY) ?? "";
    } catch {}
    if (saved) {
      setPassword(saved);
      load(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function change(r: ReviewRow, patch: { status?: ReviewStatus; verified?: boolean }) {
    if (patch.verified && !r.purchase_match && !confirm("Diese E-Mail-Adresse passt zu keinem Kauf auf kojalytics.com. Trotzdem als „Verifizierter Kauf“ markieren? Nur wenn du den Kauf anders belegen kannst (z. B. Rechnung).")) return;
    setBusy(r.id);
    try {
      const { review } = await call("PATCH", { id: r.id, ...patch });
      setReviews((all) => all.map((x) => (x.id === r.id ? review : x)));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function remove(r: ReviewRow) {
    if (!confirm(`Bewertung von „${r.name}“ endgültig löschen? Das lässt sich nicht rückgängig machen.`)) return;
    setBusy(r.id);
    try {
      await call("DELETE", { id: r.id });
      setReviews((all) => all.filter((x) => x.id !== r.id));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function runImport() {
    setImportMsg("");
    let rows: Record<string, string>[];
    try {
      rows = parseImport(importText);
    } catch {
      return setImportMsg("Das Format ist ungültig. CSV mit Kopfzeile oder JSON-Liste.");
    }
    if (!rows.length) return setImportMsg("Keine Zeilen gefunden.");
    setBusy("import");
    try {
      const { imported } = await call("POST", { rows });
      setImportMsg(`${imported} Bewertung(en) importiert. Sie warten auf Freigabe, wenn keine Spalte „status“ angegeben war.`);
      setImportText("");
      await load();
    } catch (err) {
      setImportMsg((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const counts = useMemo(() => {
    const c = { all: reviews.length, pending: 0, published: 0, hidden: 0 };
    for (const r of reviews) c[r.status]++;
    return c;
  }, [reviews]);
  const shown = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  if (!authed) {
    return (
      <main className="mx-auto max-w-md px-5 py-24">
        <p className="hud">Kojalytics · Admin</p>
        <h1 className="display mt-4 text-[1.8rem]">Bewertungen verwalten</h1>
        <form
          className="mt-8 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
        >
          <label htmlFor="pw" className="text-sm font-semibold">
            Admin-Passwort
          </label>
          <input id="pw" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
          {error && (
            <p className="border-l-2 border-red-700 pl-3 text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary">
            Anmelden
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="hud">Kojalytics · Admin</p>
          <h1 className="display mt-3 text-[clamp(1.6rem,3vw,2.2rem)]">Bewertungen verwalten</h1>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            try {
              sessionStorage.removeItem(KEY);
            } catch {}
            setAuthed(false);
            setPassword("");
          }}
        >
          <LogOut size={15} aria-hidden /> Abmelden
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" onClick={() => setFilter(f.id)} className={`tag !px-3 !py-2 ${filter === f.id ? "!border-foreground !bg-foreground !text-white" : ""}`}>
            {f.label} ({counts[f.id]})
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-px border border-border bg-border">
        {shown.length === 0 && <p className="bg-white p-6 text-muted">Keine Bewertungen in dieser Ansicht.</p>}
        {shown.map((r) => (
          <article key={r.id} className={`bg-white p-5 md:p-6 ${busy === r.id ? "opacity-50" : ""}`}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Stars value={r.rating} size={16} label={`${r.rating} von 5`} />
              <span className="font-semibold">{r.name}</span>
              <span className="text-sm text-muted">{r.email ?? "keine E-Mail"}</span>
              <span className="hud">
                {r.reviewed_on} · {r.lang.toUpperCase()} · {r.source}
              </span>
              <span className={`tag ml-auto ${r.status === "published" ? "!border-success/40 !text-success" : r.status === "pending" ? "!border-accent/40 !text-accent" : ""}`}>{STATUS_LABEL[r.status]}</span>
            </div>
            {r.title && <p className="mt-3 font-semibold">{r.title}</p>}
            <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed text-muted">{r.body}</p>
            <p className={`mt-3 text-sm ${r.purchase_match ? "text-success" : "text-muted"}`}>
              {r.purchase_match ? "✓ E-Mail passt zu einem Kauf auf kojalytics.com" : "E-Mail passt zu keinem Kauf auf kojalytics.com"}
              {r.verified && " · auf der Seite als „Verifizierter Kauf“ markiert"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {r.status !== "published" ? (
                <button type="button" className="btn-primary !min-h-10" disabled={busy === r.id} onClick={() => change(r, { status: "published" })}>
                  <Eye size={15} aria-hidden /> Veröffentlichen
                </button>
              ) : (
                <button type="button" className="btn-secondary !min-h-10" disabled={busy === r.id} onClick={() => change(r, { status: "hidden" })}>
                  <EyeOff size={15} aria-hidden /> Ausblenden
                </button>
              )}
              <button type="button" className="btn-secondary !min-h-10" disabled={busy === r.id} onClick={() => change(r, { verified: !r.verified })}>
                <BadgeCheck size={15} aria-hidden /> {r.verified ? "Verifiziert entfernen" : "Als verifiziert markieren"}
              </button>
              <button type="button" className="btn-secondary !min-h-10 !text-red-700" disabled={busy === r.id} onClick={() => remove(r)}>
                <Trash2 size={15} aria-hidden /> Löschen
              </button>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-14 border-t border-border pt-8">
        <h2 className="display text-[1.4rem]">Bewertungen importieren</h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">
          Für echte Bewertungen, die dich auf anderem Weg erreicht haben (z. B. per E-Mail an den Support oder von einer anderen Plattform). CSV mit Kopfzeile oder
          JSON-Liste. Pflicht: <code>name</code>, <code>rating</code> (1–5), <code>body</code>. Optional: <code>title</code>, <code>email</code>, <code>date</code> (JJJJ-MM-TT),{" "}
          <code>lang</code> (de/en), <code>source</code> (wird auf der Seite als „Quelle“ gezeigt), <code>verified</code> (ja/true), <code>status</code> (pending/published/hidden).
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Erfundene oder gekaufte Bewertungen sind verboten (UWG). „Verifiziert“ nur, wenn der Kauf belegt ist.
        </p>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={7}
          placeholder={'name,rating,title,body,email,date,lang,source\n"Thomas K.",5,"Endlich ohne Abo","Läuft auf meinem MacBook …",thomas@example.com,2026-11-20,de,"E-Mail an den Support"'}
          className={`${field} mt-5 font-mono text-[13px]`}
        />
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <button type="button" className="btn-primary" disabled={busy === "import" || !importText.trim()} onClick={runImport}>
            <Upload size={15} aria-hidden /> Importieren
          </button>
          {importMsg && <p className="whitespace-pre-line text-sm">{importMsg}</p>}
        </div>
      </section>
    </main>
  );
}
