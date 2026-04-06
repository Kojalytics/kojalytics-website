'use client';

import { motion } from 'framer-motion';
import type { Translations } from '@/i18n/translations/de';

const examples = [
  { id: 1, style: 'Business Formal' },
  { id: 2, style: 'LinkedIn Professional' },
  { id: 3, style: 'Creative Modern' },
  { id: 4, style: 'Corporate Classic' },
  { id: 5, style: 'Startup Casual' },
  { id: 6, style: 'Executive Premium' },
];

export default function PPGallery({ t }: { t: Translations }) {
  return (
    <section id="beispiele" className="pp-section">
      <div className="pp-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <span className="pp-badge">{t.gallery.badge}</span>
          <h2 style={{
            fontFamily: 'var(--font-pp-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            marginTop: 16,
            letterSpacing: '-0.02em',
            color: 'var(--pp-text)',
          }}>
            {t.gallery.title}
          </h2>
          <p style={{
            color: 'var(--pp-text-secondary)',
            fontSize: '1.1rem',
            marginTop: 12,
            maxWidth: 600,
            margin: '12px auto 0',
          }}>
            {t.gallery.subtitle}
          </p>
        </motion.div>

        {/* Before/After showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            marginBottom: 48,
            flexWrap: 'wrap',
          }}
        >
          <div style={{
            background: 'var(--pp-bg-white)',
            borderRadius: 'var(--pp-radius)',
            padding: 24,
            border: '1px solid var(--pp-border-light)',
            boxShadow: 'var(--pp-shadow-md)',
            textAlign: 'center',
            maxWidth: 220,
          }}>
            <div className="pp-portrait-placeholder" style={{
              width: 180,
              height: 240,
              margin: '0 auto 12px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #D4D2CD 0%, #C4C2BD 100%)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--pp-text-muted)" strokeWidth="1.5" style={{ opacity: 0.3 }}>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
                </svg>
              </div>
            </div>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--pp-text-muted)',
              background: 'var(--pp-bg-warm)',
              padding: '4px 16px',
              borderRadius: 100,
            }}>
              {t.gallery.before}
            </span>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="var(--pp-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div style={{
            background: 'var(--pp-bg-white)',
            borderRadius: 'var(--pp-radius)',
            padding: 24,
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(white, white), var(--pp-gradient)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 8px 30px rgba(233, 69, 96, 0.15)',
            textAlign: 'center',
            maxWidth: 220,
          }}>
            <div className="pp-portrait-placeholder" style={{
              width: 180,
              height: 240,
              margin: '0 auto 12px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #E8E6E1 0%, #D4D2CD 100%)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--pp-accent)" strokeWidth="1.5" style={{ opacity: 0.5 }}>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
                </svg>
                <div style={{ fontSize: '0.6rem', color: 'var(--pp-accent)', fontWeight: 600, marginTop: 4 }}>AI Enhanced</div>
              </div>
            </div>
            <span className="pp-gradient-text" style={{
              fontSize: '0.85rem',
              fontWeight: 700,
            }}>
              {t.gallery.after} ✨
            </span>
          </div>
        </motion.div>

        {/* Style Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: 16,
        }}>
          {examples.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="pp-portrait-placeholder"
              style={{
                borderRadius: 'var(--pp-radius-sm)',
                cursor: 'pointer',
              }}
            >
              <div style={{ textAlign: 'center', padding: 12 }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--pp-text-muted)" strokeWidth="1.5" style={{ opacity: 0.3 }}>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
                </svg>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--pp-text-muted)',
                  marginTop: 8,
                }}>
                  {ex.style}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
