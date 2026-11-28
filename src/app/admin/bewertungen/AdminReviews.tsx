"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeCheck, Download, Eye, EyeOff, FileUp, LogOut, Trash2, Upload } from "lucide-react";
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
  const head = rows[0].map((h) => h.replace(/^\uFEFF/, "").trim().toLowerCase());
  return rows.slice(1).filter((r) => r.some((c) => c.trim())).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}

/** The template's columns (German, as Excel shows them) and the API field each one fills. */
const TEMPLATE = ["Name", "Sterne", "Überschrift", "Text", "E-Mail", "Datum", "Sprache", "Quelle", "Verifiziert", "Status"];
const COLUMN: Record<string, string> = {
  name: "name",
  sterne: "rating",
  bewertung: "rating",
  rating: "rating",
  überschrift: "title",
  titel: "title",
  title: "title",
  text: "body",
  body: "body",
  "e-mail": "email",
  email: "email",
  datum: "date",
  date: "date",
  sprache: "lang",
  lang: "lang",
  quelle: "source",
  source: "source",
  verifiziert: "verified",
  verified: "verified",
  status: "status",
};
/** Rows whose name ends with "(Beispiel)" are the template's example and are never imported. */
const EXAMPLE = /\(beispiel\)\s*$/i;

/** One template row in the form the admin API takes: German column names and values (ja/nein, 24.11.2026, Deutsch …). */
function normalize(raw: Record<string, unknown>) {
  const r: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) r[COLUMN[k.trim().toLowerCase()] ?? k.trim().toLowerCase()] = String(v ?? "").trim();
  const stars = /★/.test(r.rating ?? "") ? (r.rating.match(/★/g) ?? []).length : Math.round(Number((r.rating ?? "").replace(",", ".")));
  const d = (r.date ?? "").match(/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/);
  const date = d ? `${d[3].length === 2 ? `20${d[3]}` : d[3]}-${d[2].padStart(2, "0")}-${d[1].padStart(2, "0")}` : r.date ?? "";
  const lang = /^(en|englisch|english)$/i.test(r.lang ?? "") ? "en" : "de";
  const verified = /^(ja|j|yes|y|true|wahr|1|x|✓)$/i.test(r.verified ?? "");
  const st = (r.status ?? "").toLowerCase();
  const status = /^(veröffentlicht|veroeffentlicht|published|live|online)$/.test(st) ? "published" : /^(ausgeblendet|versteckt|hidden)$/.test(st) ? "hidden" : "pending";
  return { name: r.name ?? "", rating: stars, title: r.title ?? "", body: r.body ?? "", email: r.email ?? "", date, lang, source: r.source ?? "", verified, status };
}

/** The template as a CSV file Excel opens directly (semicolons, UTF-8 with BOM), with one example row. */
function downloadTemplate() {
  const example = ["Max M. (Beispiel)", "5", "Endlich ohne Abo", "Läuft super auf meinem MacBook. Diese Beispielzeile wird nicht importiert.", "max@example.com", "24.11.2026", "Deutsch", "E-Mail an den Support", "nein", "wartet"];
  const line = (cells: string[]) => cells.map((c) => (/[;"\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(";");
  const csv = "\uFEFF" + [line(TEMPLATE), line(example)].join("\r\n") + "\r\n";
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "koja-bewertungen-vorlage.csv";
  a.click();
  URL.revokeObjectURL(url);
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

  async function change(r: ReviewRow, patch: { status?: ReviewStatus; verified?: boolean; reviewed_on?: string }) {
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
    let rows: ReturnType<typeof normalize>[];
    try {
      rows = parseImport(importText).map(normalize).filter((r) => !EXAMPLE.test(r.name));
    } catch {
      return setImportMsg("Das Format ist ungültig. Bitte die Vorlage verwenden (CSV) oder eine JSON-Liste.");
    }
    if (!rows.length) return setImportMsg("Keine Zeilen gefunden (die Beispielzeile wird übersprungen).");
    setBusy("import");
    try {
      const { imported } = await call("POST", { rows });
      setImportMsg(`${imported} Bewertung(en) importiert. Ohne Status „veröffentlicht“ warten sie oben unter „Wartet auf Freigabe“.`);
      setImportText("");
      await load();
    } catch (err) {
      setImportMsg((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const preview = useMemo(() => {
    try {
      return parseImport(importText).map(normalize).filter((r) => !EXAMPLE.test(r.name));
    } catch {
      return null;
    }
  }, [importText]);

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
              <label className="flex items-center gap-2 text-sm text-muted" title="Datum, das auf der Seite bei der Bewertung steht">
                <span className="hud">Datum</span>
                <input
                  type="date"
                  defaultValue={r.reviewed_on}
                  key={r.reviewed_on}
                  min="2020-01-01"
                  max={new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" })}
                  disabled={busy === r.id}
                  onBlur={(e) => e.target.value && e.target.value !== r.reviewed_on && change(r, { reviewed_on: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                  className="min-h-9 border border-border-strong bg-white px-2 py-1 font-mono text-[13px] text-foreground focus:border-foreground focus:outline-none"
                />
              </label>
              <span className="hud">
                {r.lang.toUpperCase()} · {r.source}
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
          Für echte Bewertungen, die dich auf anderem Weg erreicht haben, z. B. per E-Mail an den Support oder über eine andere Plattform.
        </p>
        <ol className="mt-5 grid max-w-3xl gap-2 text-[15px] leading-relaxed">
          <li>
            <span className="hud mr-2 text-faint">01</span>Vorlage herunterladen und in Excel oder Numbers öffnen.
          </li>
          <li>
            <span className="hud mr-2 text-faint">02</span>Pro Bewertung eine Zeile ausfüllen. Die Beispielzeile „Max M. (Beispiel)“ wird nie importiert.
          </li>
          <li>
            <span className="hud mr-2 text-faint">03</span>Als CSV speichern und hier hochladen, Vorschau prüfen, „Importieren“ klicken.
          </li>
        </ol>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="btn-secondary" onClick={downloadTemplate}>
            <Download size={15} aria-hidden /> Vorlage herunterladen (CSV)
          </button>
          <label className="btn-secondary cursor-pointer">
            <FileUp size={15} aria-hidden /> Datei hochladen
            <input
              type="file"
              accept=".csv,.txt,.json,text/csv,application/json"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) {
                  setImportMsg("");
                  setImportText(await file.text());
                }
              }}
            />
          </label>
        </div>

        <div className="mt-6 overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface">
              <tr>
                {["Spalte", "Pflicht", "Was eintragen"].map((h) => (
                  <th key={h} className="hud px-4 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Name", "ja", "Wie er auf der Seite steht, z. B. „Thomas K.“"],
                ["Sterne", "ja", "1 bis 5"],
                ["Überschrift", "", "Optional"],
                ["Text", "ja", "Die Bewertung, wörtlich wie erhalten"],
                ["E-Mail", "", "Wird nicht veröffentlicht; zeigt dir, ob sie zu einem Kauf passt"],
                ["Datum", "", "Datum der Bewertung, z. B. 24.11.2026 (leer = heute)"],
                ["Sprache", "", "Deutsch oder Englisch (leer = Deutsch)"],
                ["Quelle", "", "Woher die Bewertung kommt; steht auf der Seite, z. B. „E-Mail an den Support“"],
                ["Verifiziert", "", "ja = Siegel „Verifizierter Kauf“ (nur mit Kaufbeleg), sonst nein"],
                ["Status", "", "veröffentlicht, wartet oder ausgeblendet (leer = wartet)"],
              ].map(([c, req, what]) => (
                <tr key={c} className="border-t border-border">
                  <td className="px-4 py-2 font-semibold">{c}</td>
                  <td className="px-4 py-2">{req}</td>
                  <td className="px-4 py-2 text-muted">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          Erfundene oder gekaufte Bewertungen sind verboten (UWG). „Verifiziert: ja“ nur, wenn der Kauf belegt ist.
        </p>

        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={5}
          placeholder="Datei hochladen oder den Inhalt der Vorlage hier einfügen"
          className={`${field} mt-5 font-mono text-[13px]`}
        />

        {importText.trim() && (
          <div className="mt-4 border border-border">
            <p className="hud border-b border-border bg-surface px-4 py-2">
              {preview === null ? "Format ungültig" : `Vorschau: ${preview.length} Bewertung(en)`}
            </p>
            {preview && preview.length > 0 && (
              <ul className="divide-y divide-border">
                {preview.slice(0, 50).map((r, i) => {
                  const ok = r.name && r.body && r.rating >= 1 && r.rating <= 5;
                  return (
                    <li key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 text-sm">
                      {ok ? <Stars value={r.rating} size={13} /> : <span className="font-semibold text-red-700">Name, Sterne (1–5) oder Text fehlt</span>}
                      <span className="font-semibold">{r.name || "–"}</span>
                      <span className="text-muted">{r.date || "heute"} · {r.lang.toUpperCase()}</span>
                      {r.verified && (
                        <span className="tag !border-success/40 !text-success">
                          <BadgeCheck size={12} aria-hidden /> Verifiziert
                        </span>
                      )}
                      <span className="tag">{STATUS_LABEL[r.status as ReviewStatus]}</span>
                      <span className="w-full truncate text-muted">{r.body}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button type="button" className="btn-primary" disabled={busy === "import" || !preview?.length} onClick={runImport}>
            <Upload size={15} aria-hidden /> {preview?.length ? `${preview.length} importieren` : "Importieren"}
          </button>
          {importMsg && <p className="whitespace-pre-line text-sm">{importMsg}</p>}
        </div>
      </section>
    </main>
  );
}
