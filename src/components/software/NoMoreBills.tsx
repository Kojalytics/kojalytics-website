import OfficeBox from "@/components/office/OfficeBox";
import type { Lang } from "@/lib/i18n";
import "./no-more-bills.css";

/*
 * "Und danach? Keine Rechnung mehr." on the home page: a paper receipt of nothing but zeros next to the 3D Koja Office
 * box on a soft indigo stage. Carried over from the old ad landing page /office, in the light look of the home page.
 */

const de = {
  head: ["Folgekosten", "Koja Office 2026"],
  rows: [
    { label: "Abo-Gebühr pro Jahr", note: "Einmalkauf: einmal zahlen, kein Abo." },
    { label: "Updates", note: "Kostenlos über den Kojalytics Launcher." },
    { label: "Zweiter und dritter Computer", note: "Bis zu 3 Geräte, Mac oder Windows-PC." },
  ],
  sum: "Folgekosten gesamt",
  stamp: "Bezahlt",
  drag: "Zum Drehen ziehen",
};

const en: typeof de = {
  head: ["Ongoing costs", "Koja Office 2026"],
  rows: [
    { label: "Subscription fee per year", note: "One-time purchase: pay once, no subscription." },
    { label: "Updates", note: "Free via the Kojalytics Launcher." },
    { label: "Second and third computer", note: "Up to 3 devices, Mac or Windows PC." },
  ],
  sum: "Total ongoing costs",
  stamp: "Paid",
  drag: "Drag to turn",
};

export default function NoMoreBills({ lang, zero }: { lang: Lang; zero: string }) {
  const t = lang === "de" ? de : en;
  return (
    <div className="nmb">
      <div className="nmb-paper" data-reveal>
        <p className="nmb-head" aria-hidden>
          <span>{t.head[0]}</span>
          <span>{t.head[1]}</span>
        </p>
        <dl>
          {t.rows.map((row, i) => (
            <div key={row.label} className="nmb-row" style={{ ["--i" as string]: i }}>
              <dt>
                {row.label}
                <small>{row.note}</small>
              </dt>
              <dd>{zero}</dd>
            </div>
          ))}
          <div className="nmb-row nmb-row--sum">
            <dt>{t.sum}</dt>
            <dd>{zero}</dd>
          </div>
        </dl>
        <div className="nmb-foot">
          <span className="nmb-stamp" aria-hidden>
            {t.stamp}
          </span>
          {/* Phones and tablets: the box sits on the receipt instead of alone on its own stage below it */}
          <div className="nmb-paper-box" aria-hidden>
            <OfficeBox width="128px" tone="light" />
          </div>
        </div>
      </div>
      <div className="nmb-stage" data-reveal style={{ ["--i" as string]: 1 }}>
        <OfficeBox width="clamp(170px, 26vw, 270px)" tone="light" />
        <p className="nmb-drag" aria-hidden>
          {t.drag}
        </p>
      </div>
    </div>
  );
}
