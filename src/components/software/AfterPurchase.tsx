import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Check, Download, Headset, Lock, Mail, Receipt, RefreshCw, Undo2 } from "lucide-react";
import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_PHONE_HREF } from "@/lib/checkout-help";
import { LICENSE_DEVICES } from "@/lib/license-sales";
import { href, type Lang } from "@/lib/i18n";
import "./after-purchase.css";

/*
 * "Was nach dem Kauf passiert": the real way from paying to working apps, as five illustrated steps, plus the facts
 * that make buying safe. On the home page (near the prices) and on the ad landing page /office. The facts come from
 * the thank-you page (src/views/ThanksView.tsx), the license email (src/lib/license-email.ts) and the AGB. The small
 * pictures are drawn in HTML, decoration only: nothing in them looks like a control you could tap.
 * The English version can show the short film (public/office/after-purchase-en.mp4) above the steps.
 */

const SAMPLE_KEY = "KOJA-7Q2M-XXXX-XXXX";
const ICONS = ["word-koja", "grid-koja", "deck-koja", "pdf-koja", "photo-koja", "light-koja", "vector-koja", "design-koja", "fig-koja", "film-koja", "effect-koja", "sound-koja", "cad-koja"];

const de = {
  steps: [
    {
      tag: "Bezahlen",
      title: "Sicher bezahlen über Stripe",
      text: "Mit Karte, PayPal oder Klarna auf der Bezahlseite von Stripe. Deine Zahlungsdaten gibst du nur dort ein.",
    },
    {
      tag: "Sofort",
      title: "Dein Lizenzschlüssel ist da",
      text: "Direkt nach dem Bezahlen zeigt dir die Danke-Seite deinen Schlüssel. Zusätzlich kommt er per E‑Mail, mit Anleitung und deiner Bestellung.",
    },
    {
      tag: "Am Computer",
      title: "Kojalytics Launcher laden",
      text: "Für Mac (Apple-Chip und Intel) und Windows 10 und 11. Über den Launcher installierst und aktualisierst du alle Koja-Apps.",
    },
    {
      tag: "Aktivieren",
      title: "Schlüssel einfügen",
      text: "Im Launcher unter Einstellungen › Lizenz den Schlüssel einfügen und auf „Aktivieren“ klicken.",
    },
    {
      tag: "Fertig",
      title: "Apps installieren, loslegen",
      text: `Wähle die Apps, die du brauchst. Sie laufen offline auf deinem Computer, auf bis zu ${LICENSE_DEVICES} Geräten, Mac und Windows-PC gemischt.`,
    },
  ],
  pay: { cap: "Bezahlseite · Stripe", product: "Koja Office 2026", card: "Karte", paid: "Bezahlt" },
  key: { cap: "Danke-Seite", ok: "Zahlung erfolgreich", mail: "E-Mail", subject: "Dein Lizenzschlüssel" },
  launcher: { cap: "Download" },
  activate: { path: "Einstellungen › Lizenz", field: "Lizenzschlüssel", button: "Aktivieren" },
  apps: { offline: "Offline", devices: `${LICENSE_DEVICES} Geräte` },
  trustHud: "Sicher kaufen",
  trust: [
    { title: "14 Tage Widerrufsrecht", text: "Ohne Begründung, online erklärt. Du bekommst dein Geld zurück.", link: "Vertrag widerrufen", path: "/widerrufen" },
    { title: "Echtes Unternehmen aus Hamburg", text: "Kojalytics, Am Diggen 40i, 21077 Hamburg.", link: "Impressum", path: "/impressum" },
    { title: "Persönlicher Support", text: "Per E-Mail und Telefon, wir antworten selbst." },
    { title: "Keine versteckten Kosten", text: "Der angezeigte Preis ist der Endpreis. Der Einmalkauf ist kein Abo, es verlängert sich nichts." },
    { title: "Kostenlose Updates", text: "Updates und neue Funktionen kommen automatisch über den Launcher, ohne Aufpreis." },
  ],
  film: "Film ansehen: Was nach dem Kauf passiert",
};

const en: typeof de = {
  steps: [
    {
      tag: "Pay",
      title: "Pay securely via Stripe",
      text: "With card, PayPal or Klarna on Stripe's payment page. You only enter your payment details there.",
    },
    {
      tag: "Right away",
      title: "Your license key is here",
      text: "Right after you pay, the thank-you page shows your key. It also arrives by email, with the setup steps and your order.",
    },
    {
      tag: "On your computer",
      title: "Download the Kojalytics Launcher",
      text: "For Mac (Apple silicon and Intel) and Windows 10 and 11. The launcher installs and updates all Koja apps.",
    },
    {
      tag: "Activate",
      title: "Paste in your key",
      text: "In the launcher, go to Settings › License, paste your key and click “Activate”.",
    },
    {
      tag: "Done",
      title: "Install the apps, get started",
      text: `Choose the apps you need. They run offline on your computer, on up to ${LICENSE_DEVICES} devices, Mac and Windows PCs mixed.`,
    },
  ],
  pay: { cap: "Payment page · Stripe", product: "Koja Office 2026", card: "Card", paid: "Paid" },
  key: { cap: "Thank-you page", ok: "Payment successful", mail: "Email", subject: "Your license key" },
  launcher: { cap: "Download" },
  activate: { path: "Settings › License", field: "License key", button: "Activate" },
  apps: { offline: "Offline", devices: `${LICENSE_DEVICES} devices` },
  trustHud: "Buy with confidence",
  trust: [
    { title: "14-day right of withdrawal", text: "No reason needed, declared online. You get your money back.", link: "Withdraw from a contract", path: "/widerrufen" },
    { title: "A real company in Hamburg", text: "Kojalytics, Am Diggen 40i, 21077 Hamburg, Germany.", link: "Imprint", path: "/impressum" },
    { title: "Personal support", text: "By email and phone. We answer ourselves." },
    { title: "No hidden costs", text: "The price you see is the final price. The one-time purchase is no subscription, nothing renews." },
    { title: "Free updates", text: "Updates and new features arrive automatically through the launcher, at no extra cost." },
  ],
  film: "Watch: what happens after you buy",
};

const TRUST_ICONS = [Undo2, Building2, Headset, Receipt, RefreshCw];
const two = (n: number) => String(n).padStart(2, "0");

function PayScene({ t }: { t: typeof de }) {
  return (
    <div className="ap-win">
      <p className="ap-cap">
        <Lock size={12} strokeWidth={2.6} />
        {t.pay.cap}
      </p>
      <p className="ap-row">
        <Image src="/office/koja-office-icon.png" alt="" width={26} height={26} unoptimized />
        <b>{t.pay.product}</b>
      </p>
      <p className="ap-chips">
        <span>{t.pay.card}</span>
        <span>PayPal</span>
        <span>Klarna</span>
      </p>
      <p className="ap-paid">
        <Check size={14} strokeWidth={3} />
        {t.pay.paid}
      </p>
    </div>
  );
}

function KeyScene({ t }: { t: typeof de }) {
  return (
    <div className="ap-win">
      <p className="ap-cap">{t.key.cap}</p>
      <p className="ap-ok">
        <span aria-hidden />
        {t.key.ok}
      </p>
      <p className="ap-key">{SAMPLE_KEY}</p>
      <p className="ap-mail">
        <Mail size={13} strokeWidth={2.4} />
        <span>
          <b>{t.key.mail}</b> · {t.key.subject}
        </span>
      </p>
    </div>
  );
}

function LauncherScene({ t }: { t: typeof de }) {
  return (
    <div className="ap-launch">
      <span className="ap-dl">
        <Download size={18} strokeWidth={2.6} />
      </span>
      <span className="ap-k">K</span>
      <p className="ap-os">
        <span>
          <svg width="30" height="22" viewBox="0 0 30 22">
            <rect x="4" y="1" width="22" height="15" rx="2" fill="#fff" stroke="currentColor" strokeWidth="1.6" />
            <path d="M1 18h28l-2 3H3z" fill="currentColor" />
          </svg>
          Mac
        </span>
        <span>
          <svg width="30" height="22" viewBox="0 0 30 22">
            <rect x="2" y="1" width="26" height="16" rx="1.5" fill="#fff" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 17h6v3h-6zM9 20h12v1.6H9z" fill="currentColor" />
          </svg>
          Windows
        </span>
      </p>
    </div>
  );
}

function ActivateScene({ t }: { t: typeof de }) {
  return (
    <div className="ap-win">
      <p className="ap-cap">{t.activate.path}</p>
      <p className="ap-label">{t.activate.field}</p>
      <p className="ap-field">
        <code>{SAMPLE_KEY}</code>
      </p>
      <p className="ap-go">
        <Check size={14} strokeWidth={3} />
        {t.activate.button}
      </p>
    </div>
  );
}

function AppsScene({ t }: { t: typeof de }) {
  return (
    <div className="ap-apps">
      <p className="ap-grid">
        {ICONS.map((slug, i) => (
          <Image key={slug} src={`/apps/${slug}/icon.webp`} alt="" width={26} height={26} style={{ ["--d" as string]: i }} />
        ))}
      </p>
      <p className="ap-chips">
        <span>{t.apps.offline}</span>
        <span>{t.apps.devices}</span>
        <span>Mac · Windows</span>
      </p>
    </div>
  );
}

const SCENES = [PayScene, KeyScene, LauncherScene, ActivateScene, AppsScene];

export default function AfterPurchase({ lang, film = false }: { lang: Lang; film?: boolean }) {
  const t = lang === "de" ? de : en;
  return (
    <div className="ap">
      {film && (
        <figure className="ap-film" data-reveal>
          <video
            controls
            playsInline
            preload="none"
            poster="/office/after-purchase-en.jpg"
            width={1920}
            height={1080}
            aria-label={t.film}
          >
            <source src="/office/after-purchase-en.mp4" type="video/mp4" />
          </video>
          <figcaption>{t.film}</figcaption>
        </figure>
      )}

      <ol className="ap-steps">
        {t.steps.map((s, i) => {
          const Scene = SCENES[i];
          return (
            <li key={s.title} className="ap-step" data-reveal style={{ ["--i" as string]: i }}>
              <div className="ap-scene" aria-hidden>
                <Scene t={t} />
              </div>
              <p className="ap-head">
                <span className="ap-n">{two(i + 1)}</span>
                <span className="ap-tag">{s.tag}</span>
              </p>
              <h3 className="ap-title">{s.title}</h3>
              <p className="ap-text">{s.text}</p>
            </li>
          );
        })}
      </ol>

      <div className="ap-trust" data-reveal>
        <p className="ap-trust-hud">{t.trustHud}</p>
        <ul>
          {t.trust.map((item, i) => {
            const Icon = TRUST_ICONS[i];
            return (
              <li key={item.title}>
                <Icon size={22} strokeWidth={2.2} aria-hidden />
                <div>
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                  {i === 2 && (
                    <p className="ap-contact">
                      <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                      <a href={SUPPORT_PHONE_HREF} className="whitespace-nowrap">
                        {SUPPORT_PHONE}
                      </a>
                    </p>
                  )}
                  {item.link && item.path && (
                    <Link href={href(lang, item.path)} prefetch={false} className="ap-link">
                      {item.link}
                      <ArrowRight size={15} aria-hidden />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
