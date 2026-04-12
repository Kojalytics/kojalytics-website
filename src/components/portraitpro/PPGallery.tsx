'use client';

import { motion } from 'framer-motion';
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ex.src}
                alt={ex.style}
                width={340}
                height={453}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
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
