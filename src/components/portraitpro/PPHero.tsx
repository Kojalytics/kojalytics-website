'use client';

import { motion } from 'framer-motion';
import type { Translations } from '@/i18n/translations/de';

const portraits = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  style: ['Business', 'Creative', 'LinkedIn', 'Corporate', 'Startup', 'Executive', 'Modern', 'Classic'][i],
}));

export default function PPHero({ t }: { t: Translations }) {
  return (
    <section style={{
      paddingTop: 120,
      paddingBottom: 80,
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, var(--pp-bg) 0%, var(--pp-bg-warm) 100%)',
    }}>
      {/* Decorative orbs */}
      <div className="pp-orb pp-orb-1" />
      <div className="pp-orb pp-orb-2" />

      <div className="pp-container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 60, alignItems: 'center' }}
          className="lg:grid-cols-2-custom"
        >
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="pp-badge" style={{ marginBottom: 24, display: 'inline-flex' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L10.1 5.9L15 6.5L11.5 9.9L12.4 15L8 12.6L3.6 15L4.5 9.9L1 6.5L5.9 5.9L8 1Z" fill="currentColor"/>
                </svg>
                {t.hero.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: 'var(--font-pp-heading)',
                fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                marginBottom: 24,
                color: 'var(--pp-text)',
              }}
            >
              {t.hero.title}{' '}
              <span className="pp-gradient-text">{t.hero.titleHighlight}</span>{' '}
              {t.hero.titleEnd}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontSize: '1.15rem',
                lineHeight: 1.7,
                color: 'var(--pp-text-secondary)',
                marginBottom: 36,
                maxWidth: 520,
              }}
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}
            >
              <a href="#upload" className="pp-btn-primary" style={{ textDecoration: 'none' }}>
                <span>{t.hero.cta}</span>
                <span style={{ position: 'relative', zIndex: 1 }}>→</span>
              </a>
              <a href="#beispiele" className="pp-btn-secondary" style={{ textDecoration: 'none' }}>
                {t.hero.ctaSecondary}
              </a>
            </motion.div>

            {/* Trust logos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--pp-text-muted)' }}>{t.hero.trustLine}</span>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', opacity: 0.4 }}>
                {['LinkedIn', 'Xing', 'Indeed', 'StepStone'].map(brand => (
                  <span key={brand} style={{
                    fontSize: '0.85rem', fontWeight: 700, color: 'var(--pp-text)',
                    fontFamily: 'var(--font-pp-heading)',
                    letterSpacing: '0.02em',
                  }}>
                    {brand}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Portrait Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            {portraits.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className="pp-portrait-placeholder"
                style={{
                  borderRadius: i === 0 ? '16px 8px 8px 8px' :
                    i === 3 ? '8px 16px 8px 8px' :
                    i === 4 ? '8px 8px 8px 16px' :
                    i === 7 ? '8px 8px 16px 8px' : '8px',
                }}
              >
                <div style={{ textAlign: 'center', padding: 8 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--pp-text-muted)" strokeWidth="1.5" style={{ opacity: 0.4 }}>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
                  </svg>
                  <div style={{ fontSize: '0.65rem', marginTop: 4, opacity: 0.6 }}>{p.style}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Custom breakpoint style */}
      <style>{`
        @media (min-width: 1024px) {
          .lg\\:grid-cols-2-custom {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
        }
      `}</style>
    </section>
  );
}
