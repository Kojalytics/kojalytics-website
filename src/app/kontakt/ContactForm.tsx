"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Lang } from "@/lib/i18n";

const de = {
  subjects: ["Frage vor dem Kauf", "Installation", "Lizenz und Aktivierung", "Rechnung", "Sonstiges"],
  // Links like /kontakt?thema=lizenz (and /en/contact?thema=lizenz) open the form with the matching topic chosen.
  topics: { kauf: "Frage vor dem Kauf", installation: "Installation", lizenz: "Lizenz und Aktivierung", rechnung: "Rechnung" } as Record<
    string,
    string
  >,
  placeholders: {
    "Lizenz und Aktivierung": "Mit welcher E-Mail-Adresse hast du gekauft, und was passiert beim Aktivieren?",
    Installation: "Mac oder Windows, welche App, und welche Meldung siehst du?",
  } as Record<string, string>,
  placeholder: "Wie können wir dir helfen?",
  mailSubject: (subject: string, name: string) => `[${subject}] Anfrage von ${name}`,
  name: "Name",
  email: "E-Mail",
  subject: "Worum geht es?",
  message: "Nachricht",
  submit: "Nachricht im Mailprogramm öffnen",
  note: "Die Nachricht öffnet sich in deinem eigenen E-Mail-Programm. Über unseren Server werden keine Daten gesendet.",
};

const en: typeof de = {
  subjects: ["Question before buying", "Installation", "License and activation", "Invoice", "Something else"],
  topics: { kauf: "Question before buying", installation: "Installation", lizenz: "License and activation", rechnung: "Invoice" },
  placeholders: {
    "License and activation": "Which email address did you buy with, and what happens when you activate?",
    Installation: "Mac or Windows, which app, and what message do you see?",
  },
  placeholder: "How can we help you?",
  mailSubject: (subject: string, name: string) => `[${subject}] Message from ${name}`,
  name: "Name",
  email: "Email",
  subject: "What is it about?",
  message: "Message",
  submit: "Open the message in your mail app",
  note: "The message opens in your own email program. No data is sent through our server.",
};

const T = { de, en };

/** Writes the message into the visitor's own mail app: no data passes through our server. */
export default function ContactForm({ lang = "de" }: { lang?: Lang }) {
  const t = T[lang];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(t.subjects[0]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const topic = t.topics[new URLSearchParams(window.location.search).get("thema") ?? ""];
    // Reading the address only works in the browser; the server renders the default topic.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (topic) setSubject(topic);
  }, [t]);

  const field =
    "block min-h-12 w-full appearance-none border border-border-strong bg-white px-4 py-3 text-foreground placeholder:text-muted transition-colors hover:border-foreground/50 focus:border-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent";

  return (
    <form
      className="grid content-start gap-6 p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const body = `${message}\n\n${name}\n${email}`;
        window.location.href = `mailto:support@kojalytics.com?subject=${encodeURIComponent(t.mailSubject(subject, name))}&body=${encodeURIComponent(body)}`;
      }}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="c-name" className="hud">
            {t.name}
          </label>
          <input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="c-email" className="hud">
            {t.email}
          </label>
          <input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
        </div>
      </div>
      <div className="grid gap-2">
        <label htmlFor="c-subject" className="hud">
          {t.subject}
        </label>
        <div className="relative">
          <select id="c-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={`${field} pr-11`}>
            {t.subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
        </div>
      </div>
      <div className="grid gap-2">
        <label htmlFor="c-message" className="hud">
          {t.message}
        </label>
        <textarea
          id="c-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${field} resize-y`}
          placeholder={t.placeholders[subject] ?? t.placeholder}
        />
      </div>
      <button type="submit" className="btn-primary w-full text-center sm:w-auto sm:justify-self-start">
        {t.submit}
      </button>
      <p className="text-xs leading-relaxed text-muted">{t.note}</p>
    </form>
  );
}
