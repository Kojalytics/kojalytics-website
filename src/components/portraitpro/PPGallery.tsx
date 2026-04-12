'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Translations } from '@/i18n/translations/de';

const examples = [
  { id: 1, style: 'Business Formal',       src: '/portraitpro/examples/style-business.webp' },
  { id: 2, style: 'LinkedIn Professional',  src: '/portraitpro/examples/style-linkedin.webp' },
  { id: 3, style: 'Creative Modern',        src: '/portraitpro/examples/style-creative.webp' },
  { id: 4, style: 'Corporate Classic',      src: '/portraitpro/examples/style-corporate.webp' },
  { id: 5, style: 'Startup Casual',         src: '/portraitpro/examples/style-startup.webp' },
  { id: 6, style: 'Executive Premium',      src: '/portraitpro/examples/style-executive.webp' },
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
          {/* Before */}
          <div style={{
            background: 'var(--pp-bg-white)',
            borderRadius: 'var(--pp-radius)',
            padding: 24,
            border: '1px solid var(--pp-border-light)',
            boxShadow: 'var(--pp-shadow-md)',
            textAlign: 'center',
            maxWidth: 220,
          }}>
            <div style={{
              width: 180, height: 240, margin: '0 auto 12px',
              borderRadius: 12, overflow: 'hidden', position: 'relative',
              background: 'linear-gradient(135deg, #D4D2CD 0%, #C4C2BD 100%)',
            }}>
              <Image
                src="/portraitpro/examples/before.webp"
                alt="Before — casual selfie"
                fill
                sizes="180px"
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
              />
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

          {/* After */}
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
            <div style={{
              width: 180, height: 240, margin: '0 auto 12px',
              borderRadius: 12, overflow: 'hidden', position: 'relative',
            }}>
              <Image
                src="/portraitpro/examples/after.webp"
                alt="After — AI professional portrait"
                fill
                sizes="180px"
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
              />
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
              style={{
                aspectRatio: '3/4',
                borderRadius: 'var(--pp-radius-sm)',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <Image
                src={ex.src}
                alt={ex.style}
                fill
                sizes="(max-width: 768px) 50vw, 170px"
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
                loading="lazy"
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
                padding: '24px 12px 10px',
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'white',
                  letterSpacing: '0.02em',
                }}>
                  {ex.style}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
