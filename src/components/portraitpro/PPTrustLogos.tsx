'use client';

import { motion } from 'framer-motion';

const BRANDS = [
  { name: 'Google', weight: 500, spacing: '0.01em', scale: 1.05 },
  { name: 'Tesla', weight: 600, spacing: '0.12em', scale: 1, transform: 'uppercase' },
  { name: 'Disney', weight: 700, spacing: '0.02em', scale: 1.05 },
  { name: 'NVIDIA', weight: 700, spacing: '0.06em', scale: 0.95 },
  { name: 'Apple', weight: 500, spacing: '0.01em', scale: 1.05 },
  { name: 'Amazon', weight: 700, spacing: '0.01em', scale: 1 },
  { name: 'Microsoft', weight: 600, spacing: '0.02em', scale: 0.95 },
  { name: 'Walmart', weight: 700, spacing: '0.01em', scale: 0.95 },
  { name: 'Stripe', weight: 700, spacing: '0.01em', scale: 1 },
  { name: 'Airbnb', weight: 700, spacing: '0em', scale: 1 },
  { name: 'Salesforce', weight: 700, spacing: '0.01em', scale: 0.9 },
  { name: 'PayPal', weight: 700, spacing: '0em', scale: 1 },
  { name: 'Deloitte', weight: 400, spacing: '0.03em', scale: 1 },
  { name: 'Nike', weight: 800, spacing: '0.08em', scale: 1.05, transform: 'uppercase' },
  { name: 'Adobe', weight: 700, spacing: '0.02em', scale: 1 },
  { name: 'Bain', weight: 600, spacing: '0.04em', scale: 1 },
  { name: 'Cisco', weight: 700, spacing: '0.01em', scale: 1 },
  { name: 'McKinsey', weight: 400, spacing: '0.03em', scale: 1 },
  { name: 'PwC', weight: 700, spacing: '0.01em', scale: 1.1 },
  { name: 'Stanford', weight: 600, spacing: '0.02em', scale: 0.95 },
  { name: 'Siemens', weight: 500, spacing: '0.03em', scale: 0.95 },
  { name: 'SAP', weight: 700, spacing: '0.06em', scale: 1.1 },
  { name: 'BMW', weight: 700, spacing: '0.08em', scale: 1.05 },
  { name: 'Porsche', weight: 500, spacing: '0.06em', scale: 0.95, transform: 'uppercase' },
  { name: 'Bosch', weight: 700, spacing: '0.04em', scale: 1 },
];

export default function PPTrustLogos() {
  return (
    <section style={{
      padding: '56px 0 48px',
      background: 'var(--pp-bg)',
    }}>
      <div className="pp-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 36 }}
        >
          <p style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--pp-text-muted)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Vertraut von Profis bei
          </p>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--pp-text-secondary)',
          }}>
            Mitarbeiter der erfolgreichsten Unternehmen nutzen PortraitPro AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(12px, 2vw, 20px) clamp(16px, 3vw, 32px)',
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          {BRANDS.map((b, i) => (
            <motion.span
              key={b.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              style={{
                fontFamily: 'var(--font-pp-heading)',
                fontSize: `${0.95 * b.scale}rem`,
                fontWeight: b.weight,
                letterSpacing: b.spacing,
                color: 'var(--pp-text)',
                opacity: 0.3,
                textTransform: b.transform as 'uppercase' | undefined,
                transition: 'opacity 0.3s ease',
                userSelect: 'none',
              }}
              whileHover={{ opacity: 0.6 }}
            >
              {b.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
