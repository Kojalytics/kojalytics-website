'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { Locale } from '@/i18n/config';

const labels: Record<string, Record<Locale, string>> = {
  title: { de: 'Anmelden', en: 'Sign In', es: 'Iniciar sesión', fr: 'Se connecter', it: 'Accedi', da: 'Log ind', nl: 'Inloggen', sv: 'Logga in' },
  subtitle: { de: 'Melde dich an um deine Bewerbungsfotos zu erstellen', en: 'Sign in to create your professional headshots', es: 'Inicia sesión para crear tus fotos profesionales', fr: 'Connectez-vous pour créer vos photos professionnelles', it: 'Accedi per creare le tue foto professionali', da: 'Log ind for at oprette dine ansøgningsfotos', nl: 'Log in om je sollicitatiefoto\'s te maken', sv: 'Logga in för att skapa dina CV-foton' },
  email: { de: 'E-Mail-Adresse', en: 'Email address', es: 'Correo electrónico', fr: 'Adresse email', it: 'Indirizzo e-mail', da: 'E-mailadresse', nl: 'E-mailadres', sv: 'E-postadress' },
  sendLink: { de: 'Anmeldelink senden', en: 'Send sign-in link', es: 'Enviar enlace', fr: 'Envoyer le lien', it: 'Invia link di accesso', da: 'Send login-link', nl: 'Stuur inloglink', sv: 'Skicka inloggningslänk' },
  orContinue: { de: 'Oder weiter mit', en: 'Or continue with', es: 'O continuar con', fr: 'Ou continuer avec', it: 'Oppure continua con', da: 'Eller fortsæt med', nl: 'Of ga verder med', sv: 'Eller fortsätt med' },
  checkEmail: { de: 'Prüfe dein Postfach! Wir haben dir einen Anmeldelink gesendet.', en: 'Check your inbox! We sent you a sign-in link.', es: '¡Revisa tu correo! Te enviamos un enlace.', fr: 'Vérifiez votre boîte mail !', it: 'Controlla la tua casella di posta!', da: 'Tjek din indbakke!', nl: 'Check je inbox!', sv: 'Kolla din inkorg!' },
  error: { de: 'Fehler beim Senden. Bitte versuche es erneut.', en: 'Error sending link. Please try again.', es: 'Error al enviar. Inténtalo de nuevo.', fr: 'Erreur d\'envoi. Réessayez.', it: 'Errore di invio. Riprova.', da: 'Fejl ved afsendelse. Prøv igen.', nl: 'Fout bij verzenden. Probeer opnieuw.', sv: 'Fel vid sändning. Försök igen.' },
  close: { de: 'Schließen', en: 'Close', es: 'Cerrar', fr: 'Fermer', it: 'Chiudi', da: 'Luk', nl: 'Sluiten', sv: 'Stäng' },
  marketingOptIn: {
    de: 'Ich möchte gelegentlich Produkt-Updates und Angebote per E-Mail erhalten (jederzeit abbestellbar).',
    en: 'I\'d like to occasionally receive product updates and offers by email (unsubscribe anytime).',
    es: 'Quiero recibir ocasionalmente actualizaciones y ofertas por correo (cancelable en cualquier momento).',
    fr: 'Je souhaite recevoir occasionnellement des mises à jour et offres par e-mail (désinscription possible).',
    it: 'Desidero ricevere occasionalmente aggiornamenti e offerte via email (cancellabile in qualsiasi momento).',
    da: 'Jeg vil gerne lejlighedsvis modtage produktopdateringer og tilbud via e-mail (kan afmeldes når som helst).',
    nl: 'Ik ontvang graag af en toe productupdates en aanbiedingen per e-mail (op elk moment uitschrijfbaar).',
    sv: 'Jag vill gärna få produktuppdateringar och erbjudanden via e-post ibland (kan avsluta när som helst).',
  },
};

export default function AuthModal({
  locale,
  onClose,
  onAuth,
}: {
  locale: Locale;
  onClose: () => void;
  onAuth: () => void;
}) {
  const [email, setEmail] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const supabase = createClient();

  const t = (key: string) => labels[key]?.[locale] || labels[key]?.['en'] || key;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Stash opt-in intent in localStorage so we can persist it server-side
    // AFTER the magic-link round-trip, when a real session/JWT exists.
    // Storing consent pre-auth would be vulnerable to tampering and couldn't
    // be tied to a real user id.
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'aih_marketing_opt_in_intent',
        JSON.stringify({ opted_in: marketingOptIn, locale, at: Date.now() }),
      );
    }

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/${locale}/aiheadshot/app`,
      },
    });

    setLoading(false);
    if (err) {
      setError(true);
    } else {
      setSent(true);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/${locale}/aiheadshot/app`,
      },
    });
  };

  return (
    <div
      style={{
        background: 'white', borderRadius: 24, padding: '48px 40px',
        maxWidth: 440, width: '90%', position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
      }}
    >

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #E94560, #F27121)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '1.5rem',
          }}>AI</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>
            {t('title')}
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>{t('subtitle')}</p>
        </div>

        {sent ? (
          <div style={{
            textAlign: 'center', padding: '32px 16px',
            background: '#f0fdf4', borderRadius: 16, border: '1px solid #bbf7d0',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📧</div>
            <p style={{ color: '#166534', fontWeight: 600 }}>{t('checkEmail')}</p>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: 8 }}>{email}</p>
          </div>
        ) : (
          <>
            {/* Email */}
            <form onSubmit={handleEmailLogin}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('email')}
                required
                style={{
                  width: '100%', padding: '14px 18px', borderRadius: 12,
                  border: '1px solid #E8E6E1', fontSize: '1rem',
                  outline: 'none', marginBottom: 12, color: '#1A1A2E',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = '#E94560')}
                onBlur={e => (e.target.style.borderColor = '#E8E6E1')}
              />
              {/* GDPR-compliant opt-in — default unchecked, explicit consent */}
              <label style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                margin: '8px 2px 16px', cursor: 'pointer',
                fontSize: '0.82rem', lineHeight: 1.45, color: '#6b7280',
              }}>
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={e => setMarketingOptIn(e.target.checked)}
                  style={{ marginTop: 3, accentColor: '#E94560', flexShrink: 0 }}
                />
                <span>{t('marketingOptIn')}</span>
              </label>
              <button
                type="submit"
                disabled={loading || !email}
                className="pp-btn-primary"
                style={{
                  width: '100%', justifyContent: 'center', textDecoration: 'none',
                  opacity: loading || !email ? 0.6 : 1,
                }}
              >
                <span>{loading ? '...' : t('sendLink')}</span>
              </button>
            </form>

            {error && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 12, textAlign: 'center' }}>
                {t('error')}
              </p>
            )}
          </>
        )}
    </div>
  );
}
