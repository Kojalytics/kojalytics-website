'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { Locale } from '@/i18n/config';

const labels: Record<string, Record<Locale, string>> = {
  title: { de: 'Anmelden', en: 'Sign In', es: 'Iniciar sesión', fr: 'Se connecter', da: 'Log ind', nl: 'Inloggen', sv: 'Logga in' },
  subtitle: { de: 'Melde dich an um deine Bewerbungsfotos zu erstellen', en: 'Sign in to create your professional headshots', es: 'Inicia sesión para crear tus fotos profesionales', fr: 'Connectez-vous pour créer vos photos professionnelles', da: 'Log ind for at oprette dine ansøgningsfotos', nl: 'Log in om je sollicitatiefoto\'s te maken', sv: 'Logga in för att skapa dina CV-foton' },
  email: { de: 'E-Mail-Adresse', en: 'Email address', es: 'Correo electrónico', fr: 'Adresse email', da: 'E-mailadresse', nl: 'E-mailadres', sv: 'E-postadress' },
  sendLink: { de: 'Anmeldelink senden', en: 'Send sign-in link', es: 'Enviar enlace', fr: 'Envoyer le lien', da: 'Send login-link', nl: 'Stuur inloglink', sv: 'Skicka inloggningslänk' },
  orContinue: { de: 'Oder weiter mit', en: 'Or continue with', es: 'O continuar con', fr: 'Ou continuer avec', da: 'Eller fortsæt med', nl: 'Of ga verder met', sv: 'Eller fortsätt med' },
  checkEmail: { de: 'Prüfe dein Postfach! Wir haben dir einen Anmeldelink gesendet.', en: 'Check your inbox! We sent you a sign-in link.', es: '¡Revisa tu correo! Te enviamos un enlace.', fr: 'Vérifiez votre boîte mail !', da: 'Tjek din indbakke!', nl: 'Check je inbox!', sv: 'Kolla din inkorg!' },
  error: { de: 'Fehler beim Senden. Bitte versuche es erneut.', en: 'Error sending link. Please try again.', es: 'Error al enviar. Inténtalo de nuevo.', fr: 'Erreur d\'envoi. Réessayez.', da: 'Fejl ved afsendelse. Prøv igen.', nl: 'Fout bij verzenden. Probeer opnieuw.', sv: 'Fel vid sändning. Försök igen.' },
  close: { de: 'Schließen', en: 'Close', es: 'Cerrar', fr: 'Fermer', da: 'Luk', nl: 'Sluiten', sv: 'Stäng' },
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
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const supabase = createClient();

  const t = (key: string) => labels[key]?.[locale] || labels[key]?.['en'] || key;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/${locale}/portraitpro/app`,
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
        redirectTo: `${window.location.origin}/${locale}/portraitpro/app`,
      },
    });
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 24, padding: '48px 40px',
          maxWidth: 440, width: '90%', position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '1.2rem', color: '#888',
          }}
        >✕</button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #E94560, #F27121)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '1.5rem',
          }}>P</div>
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
            {/* OAuth */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <button
                onClick={() => handleOAuth('google')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  padding: '14px 24px', borderRadius: 12,
                  border: '1px solid #E8E6E1', background: 'white',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#1A1A2E',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <button
                onClick={() => handleOAuth('apple')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  padding: '14px 24px', borderRadius: 12,
                  border: 'none', background: '#000', color: 'white',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple
              </button>
            </div>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
            }}>
              <div style={{ flex: 1, height: 1, background: '#E8E6E1' }} />
              <span style={{ fontSize: '0.85rem', color: '#888' }}>{t('orContinue')}</span>
              <div style={{ flex: 1, height: 1, background: '#E8E6E1' }} />
            </div>

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
    </div>
  );
}
