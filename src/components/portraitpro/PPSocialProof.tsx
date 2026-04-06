'use client';

import { motion } from 'framer-motion';
import type { Translations } from '@/i18n/translations/de';

export default function PPSocialProof({ t }: { t: Translations }) {
  const stats = [
    { value: t.socialProof.stat1Value, label: t.socialProof.stat1Label, icon: '📸' },
    { value: t.socialProof.stat2Value, label: t.socialProof.stat2Label, icon: '⚡' },
    { value: t.socialProof.stat3Value, label: t.socialProof.stat3Label, icon: '⭐' },
    { value: t.socialProof.stat4Value, label: t.socialProof.stat4Label, icon: '💰' },
  ];

  return (
    <section style={{
      padding: '48px 0',
      background: 'var(--pp-bg-white)',
      borderTop: '1px solid var(--pp-border-light)',
      borderBottom: '1px solid var(--pp-border-light)',
    }}>
      <div className="pp-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 32,
          textAlign: 'center',
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
              <span style={{
                fontSize: '1.8rem', fontWeight: 700, color: 'var(--pp-text)',
                fontFamily: 'var(--font-pp-heading)',
              }}>
                {stat.value}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--pp-text-muted)' }}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
