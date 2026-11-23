"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Minus, X } from "lucide-react";
import { useDiscount } from "@/lib/discount-store";
import { PRICES, money } from "@/lib/currency";
import { useCurrency } from "@/lib/use-currency";
import { useLang } from "@/lib/use-lang";
import "./run-numbers.css";

/*
 * "Rechne selbst nach" on the home page (euro visitors only: German list prices). Five years of Adobe Creative Cloud Pro
 * and Microsoft 365 against one payment for Koja Office, as bars that fill year by year when the block scrolls into
 * view, then three plain yes/no facts. The full comparison table with its sources stays one click away
 * (src/content/software-compare*.json). Koja's price follows the active discount, like every other price on the page.
 */

const YEARS = 5;
const ADOBE_YEAR = 93588; // 12 × 77,99 € (annual plan billed monthly)
const MS_YEAR = 9900; // Microsoft 365 Single / Personal, paid yearly

type Mark = "yes" | "no" | "part";

const de = {
  year: (n: number) => `Jahr ${n}`,
  rows: [
    { name: "Adobe Creative Cloud Pro", note: "77,99 € im Monat, Jahres-Abo" },
    { name: "Microsoft 365 Single", note: "99 € im Jahr" },
    { name: "Koja Office", note: "einmal zahlen, kein Abo" },
  ],
  once: "einmal",
  after: (n: number) => `nach ${n} ${n === 1 ? "Jahr" : "Jahren"}`,
  save: (adobe: string, ms: string) => (
    <>
      In 5 Jahren sparst du <b>{adobe}</b> gegenüber Adobe und <b>{ms}</b> gegenüber Microsoft 365.
    </>
  ),
  apps: ["13 Apps", "20+ Programme", "5 Apps"],
  facts: [
    { label: "Einmal zahlen möglich", marks: ["yes", "no", "no"] as Mark[], notes: ["", "nur Abo", "nur Abo"] },
    { label: "Ohne Konto", marks: ["yes", "no", "no"] as Mark[], notes: ["", "Adobe-Konto", "Microsoft-Konto"] },
    { label: "Läuft offline", marks: ["yes", "part", "part"] as Mark[], notes: ["", "begrenzt", "alle 31 Tage online"] },
  ],
  details: "Alle Details und Quellen",
};

const en: typeof de = {
  year: (n: number) => `Year ${n}`,
  rows: [
    { name: "Adobe Creative Cloud Pro", note: "€77.99 a month, annual plan" },
    { name: "Microsoft 365 Personal", note: "€99 a year" },
    { name: "Koja Office", note: "pay once, no subscription" },
  ],
  once: "once",
  after: (n: number) => `after ${n} ${n === 1 ? "year" : "years"}`,
  save: (adobe: string, ms: string) => (
    <>
      Over 5 years you save <b>{adobe}</b> compared to Adobe and <b>{ms}</b> compared to Microsoft 365.
    </>
  ),
  apps: ["13 apps", "20+ programs", "5 apps"],
  facts: [
    { label: "Pay once", marks: ["yes", "no", "no"] as Mark[], notes: ["", "subscription only", "subscription only"] },
    { label: "No account", marks: ["yes", "no", "no"] as Mark[], notes: ["", "Adobe account", "Microsoft account"] },
    { label: "Works offline", marks: ["yes", "part", "part"] as Mark[], notes: ["", "limited", "online every 31 days"] },
  ],
  details: "All details and sources",
};

const ease = (x: number) => 1 - Math.pow(1 - x, 3);

function MarkIcon({ mark }: { mark: Mark }) {
  const Icon = mark === "yes" ? Check : mark === "no" ? X : Minus;
  return (
    <span className={`rn-mark rn-mark--${mark}`}>
      <Icon size={16} strokeWidth={3} aria-hidden />
    </span>
  );
}

export default function RunNumbers({ details }: { details: React.ReactNode }) {
  const lang = useLang();
  const t = lang === "de" ? de : en;
  const cur = useCurrency();
  const discount = useDiscount();
  const koja = discount?.prices.lifetime ?? PRICES[cur].lifetime;
  const eur = (c: number) => money(c, "EUR", lang);

  const ref = useRef<HTMLDivElement>(null);
  // 0 → 1 while the five years fill; starts at the end without JavaScript or with reduced motion.
  const [p, setP] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Back to year 0 right after hydration (the server paints the end state), then fill once it is in view.
    let raf = requestAnimationFrame(() => setP(0));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const x = Math.min(1, (now - t0) / 3200);
          setP(x);
          if (x < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const years = ease(p) * YEARS;
  const max = ADOBE_YEAR * YEARS;
  const totals = [ADOBE_YEAR * years, MS_YEAR * years, p > 0.04 ? koja : 0];
  const shownYear = Math.max(1, Math.ceil(years - 0.001));

  return (
    <div className="rn" ref={ref}>
      <div className="rn-chart">
        <div className="rn-scale" aria-hidden>
          {Array.from({ length: YEARS }, (_, i) => (
            <span key={i} className={i < shownYear ? "is-on" : ""}>
              {t.year(i + 1)}
            </span>
          ))}
        </div>

        {t.rows.map((row, i) => {
          const isKoja = i === 2;
          const yearCents = i === 0 ? ADOBE_YEAR : MS_YEAR;
          return (
            <div key={row.name} className={`rn-row ${isKoja ? "rn-row--koja" : ""}`}>
              <p className="rn-label">
                <b>{row.name}</b>
                <span>{row.note}</span>
                <small>{t.apps[i === 2 ? 0 : i === 0 ? 1 : 2]}</small>
              </p>
              <div className="rn-track" aria-hidden>
                {isKoja ? (
                  <i className="rn-bar rn-bar--koja" style={{ width: `max(10px, ${((totals[2] / max) * 100).toFixed(2)}%)`, opacity: p > 0.04 ? 1 : 0 }} />
                ) : (
                  Array.from({ length: YEARS }, (_, y) => {
                    const fill = Math.min(1, Math.max(0, years - y));
                    return <i key={y} className="rn-bar" style={{ width: `calc((100% - 12px) * ${((yearCents * fill) / max).toFixed(4)})` }} />;
                  })
                )}
                {isKoja && <span className="rn-once">{t.once}</span>}
              </div>
              <p className="rn-total">
                <b>{eur(isKoja ? koja : Math.round(totals[i] / 100) * 100)}</b>
                <span>{isKoja ? t.once : t.after(shownYear)}</span>
              </p>
            </div>
          );
        })}
      </div>

      <p className="rn-save">{t.save(eur(ADOBE_YEAR * YEARS - koja), eur(MS_YEAR * YEARS - koja))}</p>

      <div className="rn-facts" role="table">
        <div className="rn-facts-head" role="row">
          <span role="columnheader" />
          {["Koja Office", "Adobe CC Pro", "Microsoft 365"].map((n, i) => (
            <span key={n} role="columnheader" className={i === 0 ? "is-koja" : ""}>
              {n}
            </span>
          ))}
        </div>
        {t.facts.map((f) => (
          <div key={f.label} className="rn-fact" role="row">
            <span role="rowheader">{f.label}</span>
            {f.marks.map((m, i) => (
              <span key={i} role="cell" className={i === 0 ? "is-koja" : ""}>
                <MarkIcon mark={m} />
                {f.notes[i] && <small>{f.notes[i]}</small>}
              </span>
            ))}
          </div>
        ))}
      </div>

      <details className="rn-details">
        <summary>{t.details}</summary>
        {details}
      </details>
    </div>
  );
}
