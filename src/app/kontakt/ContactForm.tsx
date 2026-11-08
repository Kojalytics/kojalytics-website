"use client";

import { useState } from "react";

const SUBJECTS = ["Neues Projekt", "Koja-Apps", "AI Headshot", "Software-Lizenzen", "Sonstiges"];

/** Writes the message into the visitor's own mail app: no data passes through our server. */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");

  const field = "w-full rounded-[12px] border border-[#d6d3d1] bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-foreground focus:outline-none";

  return (
    <form
      className="grid gap-5 rounded-[22px] border border-border bg-white p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const body = `${message}\n\n${name}\n${email}`;
        window.location.href = `mailto:support@kojalytics.com?subject=${encodeURIComponent(`[${subject}] Anfrage von ${name}`)}&body=${encodeURIComponent(body)}`;
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="c-name" className="text-sm font-semibold">
            Name
          </label>
          <input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="c-email" className="text-sm font-semibold">
            E-Mail
          </label>
          <input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
        </div>
      </div>
      <div className="grid gap-2">
        <label htmlFor="c-subject" className="text-sm font-semibold">
          Worum geht es?
        </label>
        <select id="c-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={field}>
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <label htmlFor="c-message" className="text-sm font-semibold">
          Nachricht
        </label>
        <textarea
          id="c-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${field} resize-y`}
          placeholder="Erzähl uns kurz von deinem Projekt oder deiner Frage."
        />
      </div>
      <button type="submit" className="btn-primary w-full sm:w-auto sm:justify-self-start">
        Nachricht im Mailprogramm öffnen
      </button>
      <p className="text-xs text-muted">Die Nachricht öffnet sich in deinem eigenen E-Mail-Programm. Über unseren Server werden keine Daten gesendet.</p>
    </form>
  );
}
