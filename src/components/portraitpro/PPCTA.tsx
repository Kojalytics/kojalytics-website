'use client';

import FadeIn from './FadeIn';
import type { Translations } from '@/i18n/translations/de';

export default function PPCTA({ t, locale }: { t: Translations; locale: string }) {
  return (
    <section style={{
      padding: 'clamp(48px, 8vw, 80px) 0',
      background: 'linear-gradient(135deg, #1A1A2E 0%, #0F0F1A 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Gradient orbs */}
      <div style={{
        position: 'absolute', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(233, 69, 96, 0.15), transparent 70%)',
        top: -100, right: -100, borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(242, 113, 33, 0.1), transparent 70%)',
        bottom: -80, left: -80, borderRadius: '50%',
      }} />

      <div className="pp-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <FadeIn>
          <h2 style={{
            fontFamily: 'var(--font-pp-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 700,
            color: 'white',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}>
            {t.cta.title}
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.1rem',
            marginBottom: 36,
            maxWidth: 500,
            margin: '0 auto 36px',
          }}>
            {t.cta.subtitle}
          </p>
          <a href={`/${locale}/portraitpro/app`} className="pp-btn-primary" style={{ textDecoration: 'none', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', padding: 'clamp(14px, 3vw, 18px) clamp(28px, 5vw, 48px)' }}>
            <span>{t.cta.button}</span>
            <span style={{ position: 'relative', zIndex: 1 }}>→</span>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
