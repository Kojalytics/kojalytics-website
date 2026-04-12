'use client';

import type { Translations } from '@/i18n/translations/de';

const COUNT = 10;
const PAIRS = Array.from({ length: COUNT }, (_, i) => ({
  id: i + 1,
  before: `/portraitpro/comparisons/before-${i + 1}.webp`,
  after: `/portraitpro/comparisons/after-${i + 1}.webp`,
}));
const DOUBLED = [...PAIRS, ...PAIRS];

export default function PPHero({ t, locale }: { t: Translations; locale: string }) {
  const appUrl = `/${locale}/portraitpro/app`;

  return (
    <section style={{
      paddingTop: 100,
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--pp-bg)',
    }}>
      {/* Centered text content */}
      <div className="pp-container" style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        maxWidth: 860,
        margin: '0 auto',
        padding: '0 24px',
      }}>
        {/* Trustpilot-style rating bar */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: 'white',
          border: '1px solid #E8E6E1',
          borderRadius: 100,
          padding: '8px 20px',
          marginBottom: 32,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                width: 20, height: 20,
                background: '#00B67A',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L8.8 4.8L13 5.4L10 8.3L10.7 12.5L7 10.5L3.3 12.5L4 8.3L1 5.4L5.2 4.8L7 1Z" fill="white" />
                </svg>
              </div>
            ))}
          </div>
          <span style={{
            fontSize: '0.82rem',
            color: 'var(--pp-text-secondary)',
          }}>
            4,9/5 bei <strong>312</strong> Bewertungen
          </span>
        </div>

        {/* Main headline */}
        <h1 style={{
          fontFamily: 'var(--font-pp-heading)',
          fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          marginBottom: 20,
          color: 'var(--pp-text)',
        }}>
          {t.hero.title}{' '}
          <span className="pp-gradient-text">{t.hero.titleHighlight}</span>{' '}
          {t.hero.titleEnd}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          lineHeight: 1.65,
          color: 'var(--pp-text-secondary)',
          marginBottom: 36,
          maxWidth: 620,
          margin: '0 auto 36px',
        }}>
          {t.hero.subtitle}
        </p>

        {/* CTA Button */}
        <div style={{ marginBottom: 16 }}>
          <a href={appUrl} className="pp-btn-primary" style={{
            textDecoration: 'none',
            padding: '18px 44px',
            fontSize: '1.1rem',
          }}>
            <span>{t.hero.cta}</span>
            <span style={{ position: 'relative', zIndex: 1 }}>→</span>
          </a>
        </div>

        {/* No credit card text */}
        <p style={{
          fontSize: '0.78rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--pp-text-muted)',
          marginBottom: 48,
        }}>
          Kein Abo · Kein Fotograf · Sofort fertig
        </p>
      </div>

      {/* Ticker Animation — directly below hero text, no gap */}
      <div className="pp-ticker-wrap">
        {/* Left half — before images */}
        <div className="pp-ticker-clip-left">
          <div className="pp-ticker">
            {DOUBLED.map((pair, i) => (
              <div key={`b-${i}`} className="pp-ticker-tile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pair.before}
                  alt={`Selfie ${pair.id}`}
                  width={320}
                  height={427}
                  loading={i < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right half — after images */}
        <div className="pp-ticker-clip-right">
          <div className="pp-ticker">
            {DOUBLED.map((pair, i) => (
              <div key={`a-${i}`} className="pp-ticker-tile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pair.after}
                  alt={`AI Portrait ${pair.id}`}
                  width={320}
                  height={427}
                  loading={i < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Center overlay — divider line + generating pill */}
        <div className="pp-ticker-center">
          <div className="pp-ticker-divider" />
          <div className="pp-ticker-pill">
            <span className="pp-ticker-dot" />
            Generating...
          </div>
        </div>
      </div>

      <style>{`
        .pp-ticker-wrap {
          --tile: clamp(160px, 17vw, 320px);
          --gap: 20px;
          position: relative;
          overflow: hidden;
          height: clamp(300px, calc(var(--tile) * 1.45), 520px);
        }

        .pp-ticker-clip-left {
          position: absolute;
          inset: 0;
          clip-path: inset(0 50% 0 0);
        }

        .pp-ticker-clip-right {
          position: absolute;
          inset: 0;
          clip-path: inset(0 0 0 50%);
        }

        .pp-ticker {
          position: absolute;
          inset: 0 auto 0 0;
          width: max-content;
          display: flex;
          align-items: center;
          gap: var(--gap);
          padding: 0 calc(var(--gap) * 2);
          animation: ppTickerScroll 45s linear infinite reverse;
          will-change: transform;
        }

        .pp-ticker-tile {
          position: relative;
          width: var(--tile);
          aspect-ratio: 3 / 4;
          overflow: hidden;
          border-radius: 20px;
          background: #f0ede8;
          flex: 0 0 auto;
        }

        .pp-ticker-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        .pp-ticker-center {
          pointer-events: none;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 5;
        }

        .pp-ticker-divider {
          width: 2px;
          height: calc(var(--tile) * 1.5);
          background: linear-gradient(to bottom, transparent, rgba(26,26,46,0.6) 20%, rgba(26,26,46,0.6) 80%, transparent);
        }

        .pp-ticker-pill {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 100px;
          padding: 7px 18px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #333;
          white-space: nowrap;
          font-family: var(--font-pp-sans);
        }

        .pp-ticker-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22C55E;
          display: inline-block;
          animation: ppTickerPulse 1.6s ease infinite;
        }

        @keyframes ppTickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes ppTickerPulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); }
          70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>
    </section>
  );
}
