'use client';

import type { Translations } from '@/i18n/translations/de';

const COUNT = 10;
const PAIRS = Array.from({ length: COUNT }, (_, i) => ({
  id: i + 1,
  before: `/portraitpro/comparisons/before-${i + 1}.webp`,
  after: `/portraitpro/comparisons/after-${i + 1}.webp`,
}));

// Duplicate for seamless infinite scroll (needs 2× so translateX(-50%) loops)
const DOUBLED = [...PAIRS, ...PAIRS];

export default function PPComparisons({ t }: { t: Translations }) {
  return (
    <section style={{ padding: '80px 0 0', overflow: 'hidden' }}>
      {/* Header */}
      <div className="pp-container" style={{ textAlign: 'center', marginBottom: 48 }}>
        <span className="pp-badge">Echte Ergebnisse</span>
        <h2 style={{
          fontFamily: 'var(--font-pp-heading)',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 700,
          marginTop: 16,
          letterSpacing: '-0.02em',
          color: 'var(--pp-text)',
        }}>
          Von Selfie zu Studio-Qualität
        </h2>
        <p style={{
          color: 'var(--pp-text-secondary)',
          fontSize: '1.1rem',
          marginTop: 12,
          maxWidth: 600,
          margin: '12px auto 0',
        }}>
          Echte Fotos, echte Ergebnisse — perfekte Gesichtserkennung mit ultra-realistischen Details
        </p>
      </div>

      {/* Ticker Animation */}
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

        /* Center overlay */
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
          background: linear-gradient(to bottom, transparent, var(--pp-text) 20%, var(--pp-text) 80%, transparent);
          opacity: 0.7;
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
