"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { BadgeCheck, PenLine, X } from "lucide-react";
import { HONEYPOT } from "@/lib/form-guard";
import { href, type Lang } from "@/lib/i18n";
import type { PublicReview, ReviewSummary } from "@/lib/reviews";

/**
 * Customer reviews on the home page: the average with the count per star, the published reviews and a form to write one.
 * New reviews wait for the admin (/admin/bewertungen); "Verifizierter Kauf" is shown only where the admin set it.
 * The home page renders the published reviews on the server; the browser refreshes them from /api/reviews.
 */

const T = {
  de: {
    outOf: "von 5",
    count: (n: number) => (n === 1 ? "1 Bewertung" : `${n} Bewertungen`),
    none: "Noch keine Bewertungen. Teile als Erste oder Erster deine Erfahrung mit Koja Office.",
    write: "Bewertung schreiben",
    more: "Weitere Bewertungen",
    verified: "Verifizierter Kauf",
    verifiedTip: "Die E-Mail-Adresse gehört zu einer Lizenz, die auf kojalytics.com gekauft wurde.",
    source: "Quelle",
    stars: (n: number) => `${n} von 5 Sternen`,
    how: "So prüfen wir Bewertungen: Wir lesen jede Bewertung vor der Veröffentlichung und veröffentlichen sie unabhängig davon, ob sie positiv oder negativ ist. „Verifizierter Kauf“ heißt: Die angegebene E-Mail-Adresse gehört zu einer Lizenz, die auf kojalytics.com gekauft wurde. Für Bewertungen gibt es keine Gegenleistung.",
    dialogTitle: "Deine Erfahrung mit Koja Office",
    dialogText: "Deine Bewertung erscheint nach einer kurzen Prüfung auf dieser Seite.",
    rating: "Deine Bewertung",
    name: "Name",
    namePh: "z. B. Thomas K.",
    nameHint: "Erscheint öffentlich. Vorname und Initial reichen.",
    email: "E-Mail-Adresse",
    emailHint: "Wird nicht veröffentlicht. Damit prüfen wir, ob du Koja Office gekauft hast.",
    title: "Überschrift (optional)",
    text: "Deine Erfahrung",
    textPh: "Was nutzt du, was gefällt dir, was fehlt dir?",
    consent: "Ich bin einverstanden, dass meine Bewertung mit meinem Namen auf kojalytics.com veröffentlicht wird.",
    privacy: "Mehr dazu in der",
    privacyLink: "Datenschutzerklärung",
    send: "Bewertung absenden",
    sending: "Wird gesendet …",
    thanks: "Danke für deine Bewertung!",
    thanksText: "Wir prüfen sie und veröffentlichen sie in Kürze.",
    close: "Schließen",
    pickStars: "Bitte wähle 1 bis 5 Sterne.",
    failed: "Das hat nicht geklappt. Bitte versuche es erneut.",
    locale: "de-DE",
  },
  en: {
    outOf: "out of 5",
    count: (n: number) => (n === 1 ? "1 review" : `${n} reviews`),
    none: "No reviews yet. Be the first to share your experience with Koja Office.",
    write: "Write a review",
    more: "More reviews",
    verified: "Verified purchase",
    verifiedTip: "The email address belongs to a licence bought on kojalytics.com.",
    source: "Source",
    stars: (n: number) => `${n} out of 5 stars`,
    how: "How we check reviews: we read every review before it is published and publish it whether it is positive or negative. “Verified purchase” means the email address given belongs to a licence bought on kojalytics.com. We give nothing in return for reviews.",
    dialogTitle: "Your experience with Koja Office",
    dialogText: "Your review will appear on this page after a short check.",
    rating: "Your rating",
    name: "Name",
    namePh: "e.g. Thomas K.",
    nameHint: "Shown publicly. First name and initial are enough.",
    email: "Email address",
    emailHint: "Not published. We use it to check whether you bought Koja Office.",
    title: "Headline (optional)",
    text: "Your experience",
    textPh: "What do you use it for, what do you like, what is missing?",
    consent: "I agree that my review is published with my name on kojalytics.com.",
    privacy: "More in our",
    privacyLink: "privacy policy",
    send: "Submit review",
    sending: "Sending …",
    thanks: "Thank you for your review!",
    thanksText: "We will check it and publish it shortly.",
    close: "Close",
    pickStars: "Please choose 1 to 5 stars.",
    failed: "That didn't work. Please try again.",
    locale: "en-GB",
  },
};

const STAR = "M12 2.5l2.94 6.06 6.66.9-4.85 4.62 1.2 6.62L12 17.5l-5.95 3.2 1.2-6.62L2.4 9.46l6.66-.9z";

/** Five stars, `value` of them filled (halves rounded to the nearest half). Ink, no colour: the site's one accent stays blue. */
export function Stars({ value, size = 16, label }: { value: number; size?: number; label?: string }) {
  const v = Math.round(value * 2) / 2;
  return (
    <span className="inline-flex items-center gap-[2px]" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = v >= i ? 1 : v >= i - 0.5 ? 0.5 : 0;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            <defs>
              <clipPath id={`half-${i}-${size}`}>
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
            <path d={STAR} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            {fill > 0 && <path d={STAR} fill="currentColor" clipPath={fill < 1 ? `url(#half-${i}-${size})` : undefined} />}
          </svg>
        );
      })}
    </span>
  );
}

function dateText(iso: string, locale: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

function ReviewCard({ r, t }: { r: PublicReview; t: (typeof T)["de"] }) {
  return (
    <article className="flex flex-col p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-foreground">
          <Stars value={r.rating} size={17} label={t.stars(r.rating)} />
        </span>
        <time className="hud" dateTime={r.reviewed_on}>
          {dateText(r.reviewed_on, t.locale)}
        </time>
      </div>
      {r.title && <h3 className="mt-4 text-[17px] font-semibold leading-snug">{r.title}</h3>}
      <p className={`${r.title ? "mt-2" : "mt-4"} flex-1 whitespace-pre-line text-[15px] leading-relaxed text-muted`}>{r.body}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-4">
        <span className="text-sm font-semibold">{r.name}</span>
        {r.verified && (
          <span className="tag !border-success/40 !text-success" title={t.verifiedTip}>
            <BadgeCheck size={13} strokeWidth={2.2} aria-hidden />
            {t.verified}
          </span>
        )}
        {r.source !== "website" && (
          <span className="hud text-faint">
            {t.source}: {r.source}
          </span>
        )}
      </div>
    </article>
  );
}

export default function Reviews({ lang, initial = null }: { lang: Lang; initial?: ReviewSummary | null }) {
  const t = T[lang];
  // Rendered on the server with the published reviews (for visitors and search engines), then refreshed in the browser.
  const [data, setData] = useState<ReviewSummary | null>(initial);
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && Array.isArray(d.reviews) && setData(d))
      .catch(() => {});
  }, []);

  // Reviews in the page's language first, the others after them.
  const reviews = data ? [...data.reviews].sort((a, b) => Number(b.lang === lang) - Number(a.lang === lang)) : [];
  const shown = all ? reviews : reviews.slice(0, 6);
  const count = data?.count ?? 0;

  return (
    <div className="grid border-t border-border lg:grid-cols-[0.75fr_1.25fr]">
      {/* Summary: the average, the count per star, the button and how reviews are checked */}
      <div className="border-b border-border p-6 md:p-8 lg:border-b-0 lg:border-r">
        {count > 0 ? (
          <>
            <div className="flex items-end gap-3">
              <span className="display text-[clamp(3.2rem,6vw,4.6rem)] leading-none">{data!.average.toLocaleString(t.locale, { minimumFractionDigits: 1 })}</span>
              <span className="hud mb-2">{t.outOf}</span>
            </div>
            <div className="mt-4 text-foreground">
              <Stars value={data!.average} size={22} label={t.stars(data!.average)} />
            </div>
            <p className="mt-2 text-sm text-muted">{t.count(count)}</p>
            <div className="mt-6 grid gap-2">
              {[5, 4, 3, 2, 1].map((s) => {
                const n = data!.stars[s - 1];
                return (
                  <div key={s} className="grid grid-cols-[2.2rem_1fr_2rem] items-center gap-3">
                    <span className="hud flex items-center gap-1 text-foreground">
                      {s}
                      <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden>
                        <path d={STAR} fill="currentColor" />
                      </svg>
                    </span>
                    <span className="h-[6px] bg-surface" aria-hidden>
                      <span className="block h-full bg-foreground" style={{ width: `${count ? (n / count) * 100 : 0}%` }} />
                    </span>
                    <span className="hud text-right">{n}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-[15px] leading-relaxed text-muted">{data ? t.none : " "}</p>
        )}
        <button type="button" className="btn-secondary mt-8 w-full sm:w-auto" onClick={() => setOpen(true)}>
          <PenLine size={15} aria-hidden />
          {t.write}
        </button>
        <p className="mt-8 border-t border-border pt-5 text-xs leading-relaxed text-muted">{t.how}</p>
      </div>

      {/* The reviews */}
      <div>
        {shown.length > 0 && (
          <div className="cells md:grid-cols-2">
            {shown.map((r) => (
              <ReviewCard key={r.id} r={r} t={t} />
            ))}
          </div>
        )}
        {!all && reviews.length > 6 && (
          <div className="border-t border-border p-6 md:p-8">
            <button type="button" className="btn-secondary" onClick={() => setAll(true)}>
              {t.more} ({reviews.length - 6})
            </button>
          </div>
        )}
      </div>

      {open && <ReviewDialog lang={lang} onClose={() => setOpen(false)} />}
    </div>
  );
}

function ReviewDialog({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const t = T[lang];
  const ref = useRef<HTMLDialogElement>(null);
  const shownAt = useRef(0);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    shownAt.current = performance.now();
    ref.current?.showModal();
  }, []);

  const close = () => ref.current?.close();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    if (!rating) return setError(t.pickStars);
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          name: f.get("name"),
          email: f.get("email"),
          title: f.get("title"),
          body: f.get("body"),
          consent: f.get("consent") === "on",
          lang,
          fillMs: Math.round(performance.now() - shownAt.current),
          [HONEYPOT]: String(f.get(HONEYPOT) ?? ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data?.error === "string" ? data.error : t.failed);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.failed);
    } finally {
      setBusy(false);
    }
  }

  const field = "min-h-12 w-full border border-border-strong bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-foreground focus:outline-none";
  const active = hover || rating;

  return (
    <dialog
      ref={ref}
      aria-labelledby="review-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && close()}
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[92dvh] w-full max-w-none overflow-y-auto border-0 border-t border-foreground bg-white p-0 text-foreground backdrop:bg-foreground/45 sm:inset-0 sm:m-auto sm:h-fit sm:max-w-[34rem] sm:border"
    >
      <div className="relative px-5 pt-6 sm:px-7 sm:pt-7" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>
        <button type="button" onClick={close} aria-label={t.close} className="absolute right-1.5 top-1.5 grid h-11 w-11 place-items-center text-muted transition-colors hover:text-foreground">
          <X size={20} aria-hidden />
        </button>
        <h2 id="review-title" className="display pr-10 text-[1.4rem] sm:text-[1.55rem]">
          {t.dialogTitle}
        </h2>
        {done ? (
          <>
            <div role="status" className="mt-5 border border-border border-t-2 border-t-success p-4">
              <p className="font-semibold">{t.thanks}</p>
              <p className="mt-1 text-muted">{t.thanksText}</p>
            </div>
            <button type="button" onClick={close} className="btn-secondary mt-4 w-full">
              {t.close}
            </button>
          </>
        ) : (
          <>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{t.dialogText}</p>
            <form className="relative mt-5 grid gap-4" onSubmit={submit} noValidate={false}>
              <div aria-hidden="true" className="absolute -left-[10000px] top-0 h-px w-px overflow-hidden">
                <label htmlFor="review-website">Website</label>
                <input id="review-website" name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>

              <fieldset className="grid gap-2">
                <legend className="mb-2 text-sm font-semibold">{t.rating}</legend>
                <div className="flex gap-1 text-foreground" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <label key={s} className="cursor-pointer p-1" onMouseEnter={() => setHover(s)}>
                      <input type="radio" name="rating" value={s} className="sr-only" checked={rating === s} onChange={() => setRating(s)} />
                      <span className="sr-only">{t.stars(s)}</span>
                      <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden className="transition-transform hover:scale-110">
                        <path d={STAR} fill={s <= active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-2">
                <label htmlFor="review-name" className="text-sm font-semibold">
                  {t.name}
                </label>
                <input id="review-name" name="name" required maxLength={60} autoComplete="name" placeholder={t.namePh} className={field} />
                <p className="text-xs text-muted">{t.nameHint}</p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="review-email" className="text-sm font-semibold">
                  {t.email}
                </label>
                <input id="review-email" name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
                <p className="text-xs text-muted">{t.emailHint}</p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="review-head" className="text-sm font-semibold">
                  {t.title}
                </label>
                <input id="review-head" name="title" maxLength={120} className={field} />
              </div>
              <div className="grid gap-2">
                <label htmlFor="review-body" className="text-sm font-semibold">
                  {t.text}
                </label>
                <textarea id="review-body" name="body" required minLength={3} maxLength={2000} rows={5} placeholder={t.textPh} className={`${field} resize-y`} />
              </div>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-muted has-[:checked]:text-foreground">
                <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-foreground" />
                <span>{t.consent}</span>
              </label>
              {error && (
                <p className="border-l-2 border-red-700 pl-3 text-sm font-medium text-red-700" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="btn-primary w-full" disabled={busy}>
                {busy ? t.sending : t.send}
              </button>
              <p className="text-xs leading-relaxed text-muted">
                {t.privacy}{" "}
                <Link href={href(lang, "/datenschutz")} className="text-foreground underline underline-offset-2">
                  {t.privacyLink}
                </Link>
                .
              </p>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
