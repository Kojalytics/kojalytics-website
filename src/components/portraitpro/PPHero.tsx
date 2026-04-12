'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Translations } from '@/i18n/translations/de';

const portraits = [
  { id: 1, style: 'Business',   src: '/portraitpro/examples/hero-1.webp' },
  { id: 2, style: 'Corporate',  src: '/portraitpro/examples/hero-2.webp' },
  { id: 3, style: 'Executive',  src: '/portraitpro/examples/hero-3.webp' },
  { id: 4, style: 'Modern',     src: '/portraitpro/examples/hero-4.webp' },
  { id: 5, style: 'Natural',    src: '/portraitpro/examples/hero-5.webp' },
  { id: 6, style: 'Creative',   src: '/portraitpro/examples/hero-6.webp' },
  { id: 7, style: 'LinkedIn',   src: '/portraitpro/examples/hero-7.webp' },
  { id: 8, style: 'Classic',    src: '/portraitpro/examples/hero-8.webp' },
];

export default function PPHero({ t, locale }: { t: Translations; locale: string }) {
  const appUrl = `/${locale}/portraitpro/app`;
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
              <a href={appUrl} className="pp-btn-primary" style={{ textDecoration: 'none' }}>
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
                style={{
                  aspectRatio: '3/4',
                  borderRadius: i === 0 ? '16px 8px 8px 8px' :
                    i === 3 ? '8px 16px 8px 8px' :
                    i === 4 ? '8px 8px 8px 16px' :
                    i === 7 ? '8px 8px 16px 8px' : '8px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                }}
              >
                <Image
                  src={p.src}
                  alt={`${p.style} Portrait`}
                  fill
                  sizes="(max-width: 768px) 25vw, 120px"
                  style={{ objectFit: 'cover', objectPosition: 'top center' }}
                  priority={i < 4}
                  loading={i < 4 ? 'eager' : 'lazy'}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
                  padding: '16px 8px 6px',
                }}>
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 600, color: 'white',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{p.style}</span>
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
