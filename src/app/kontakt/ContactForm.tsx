"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const SUBJECTS = ["Frage vor dem Kauf", "Installation", "Lizenz und Aktivierung", "Rechnung", "Sonstiges"];

// Links like /kontakt?thema=lizenz open the form with the matching topic chosen.
const TOPICS: Record<string, string> = { kauf: "Frage vor dem Kauf", installation: "Installation", lizenz: "Lizenz und Aktivierung", rechnung: "Rechnung" };
const PLACEHOLDERS: Record<string, string> = {
  "Lizenz und Aktivierung": "Mit welcher E-Mail-Adresse hast du gekauft, und was passiert beim Aktivieren?",
  Installation: "Mac oder Windows, welche App, und welche Meldung siehst du?",
};

/** Writes the message into the visitor's own mail app: no data passes through our server. */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Frage vor dem Kauf");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const topic = TOPICS[new URLSearchParams(window.location.search).get("thema") ?? ""];
    // Reading the address only works in the browser; the server renders the default topic.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (topic) setSubject(topic);
  }, []);

  const field =
    "block min-h-12 w-full appearance-none border border-border-strong bg-white px-4 py-3 text-foreground placeholder:text-muted transition-colors hover:border-foreground/50 focus:border-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent";

  return (
    <form
      className="grid content-start gap-6 p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const body = `${message}\n\n${name}\n${email}`;
        window.location.href = `mailto:support@kojalytics.com?subject=${encodeURIComponent(`[${subject}] Anfrage von ${name}`)}&body=${encodeURIComponent(body)}`;
      }}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="c-name" className="hud">
            Name
          </label>
          <input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="c-email" className="hud">
            E-Mail
          </label>
          <input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
        </div>
      </div>
      <div className="grid gap-2">
        <label htmlFor="c-subject" className="hud">
          Worum geht es?
        </label>
        <div className="relative">
          <select id="c-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={`${field} pr-11`}>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
        </div>
      </div>
      <div className="grid gap-2">
        <label htmlFor="c-message" className="hud">
          Nachricht
        </label>
        <textarea
          id="c-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${field} resize-y`}
          placeholder={PLACEHOLDERS[subject] ?? "Wie können wir dir helfen?"}
        />
      </div>
      <button type="submit" className="btn-primary w-full text-center sm:w-auto sm:justify-self-start">
        Nachricht im Mailprogramm öffnen
      </button>
      <p className="text-xs leading-relaxed text-muted">Die Nachricht öffnet sich in deinem eigenen E-Mail-Programm. Über unseren Server werden keine Daten gesendet.</p>
    </form>
  );
}
