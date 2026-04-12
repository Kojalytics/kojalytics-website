'use client';

import { useState, useEffect } from 'react';
import type { Translations } from '@/i18n/translations/de';

/**
 * Floating CTA bar that appears when user scrolls past the hero.
 * Stays fixed at bottom on mobile, top on desktop.
 * Major conversion booster — always-visible CTA.
 */
export default function PPFloatingCTA({ t, locale }: { t: Translations; locale: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past 600px (roughly past hero)
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="pp-floating-cta"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--pp-border-light)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      }}
    >
      <span style={{
        fontSize: '0.9rem',
        fontWeight: 600,
        color: 'var(--pp-text)',
        fontFamily: 'var(--font-pp-heading)',
      }}
        className="pp-floating-cta-text"
      >
        {t.hero.title} {t.hero.titleHighlight}
      </span>
      <a
        href={`/${locale}/portraitpro/app`}
        className="pp-btn-primary"
        style={{
          padding: '10px 28px',
          fontSize: '0.88rem',
          textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        <span>{t.hero.cta}</span>
        <span style={{ position: 'relative', zIndex: 1 }}>→</span>
      </a>

      <style>{`
        @media (max-width: 640px) {
          .pp-floating-cta-text { display: none !important; }
          .pp-floating-cta { justify-content: stretch !important; }
          .pp-floating-cta .pp-btn-primary { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
