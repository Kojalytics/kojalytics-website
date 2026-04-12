'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Translations } from '@/i18n/translations/de';

const PAIRS = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  before: `/portraitpro/comparisons/before-${i + 1}.webp`,
  after: `/portraitpro/comparisons/after-${i + 1}.webp`,
}));

export default function PPComparisons({ t }: { t: Translations }) {
  const [activeHover, setActiveHover] = useState<number | null>(null);

  return (
    <section className="pp-section" style={{ overflow: 'hidden' }}>
      <div className="pp-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
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
        </motion.div>

        {/* Comparison Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 460px), 1fr))',
          gap: 24,
        }}>
          {PAIRS.map((pair, i) => (
            <motion.div
              key={pair.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                background: 'white',
                border: '1px solid #E8E6E1',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={() => setActiveHover(pair.id)}
              onMouseLeave={() => setActiveHover(null)}
            >
              {/* Split View Container */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                aspectRatio: '5/3',
                position: 'relative',
              }}>
                {/* Before half */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pair.before}
                    alt={`Selfie ${pair.id}`}
                    width={500}
                    height={600}
                    loading={i < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                      transform: activeHover === pair.id ? 'scale(1.03)' : 'scale(1)',
                    }}
                  />
                  {/* Before label */}
                  <div style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: 100,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    Vorher
                  </div>
                </div>

                {/* Center divider */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '50%',
                  width: 3,
                  background: 'white',
                  zIndex: 2,
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 8px rgba(0,0,0,0.15)',
                }} />

                {/* Generating pill — center overlay */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3,
                  background: 'white',
                  borderRadius: 100,
                  padding: '6px 16px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#333',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#34D399',
                    display: 'inline-block',
                    animation: 'ppPulse 1.5s ease-in-out infinite',
                  }} />
                  Generating...
                </div>

                {/* After half */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pair.after}
                    alt={`AI Portrait ${pair.id}`}
                    width={500}
                    height={600}
                    loading={i < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                      transform: activeHover === pair.id ? 'scale(1.03)' : 'scale(1)',
                    }}
                  />
                  {/* After label */}
                  <div style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    background: 'linear-gradient(135deg, #E94560, #F27121)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: 100,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    AI Generated ✨
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ppPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </section>
  );
}
