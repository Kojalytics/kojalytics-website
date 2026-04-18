'use client';

import FadeIn from './FadeIn';
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
      padding: '40px 0',
      background: 'var(--pp-bg-white)',
      borderTop: '1px solid var(--pp-border-light)',
      borderBottom: '1px solid var(--pp-border-light)',
    }}>
      <div className="pp-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
          gap: '24px 16px',
          textAlign: 'center',
        }}>
          {stats.map((stat, i) => (
            <FadeIn
              key={i}
              delay={i * 0.08}
              duration={0.5}
              y={15}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
            >
              <span style={{ fontSize: '1.4rem' }}>{stat.icon}</span>
              <span style={{
                fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                fontWeight: 800,
                color: 'var(--pp-text)',
                fontFamily: 'var(--font-pp-heading)',
                letterSpacing: '-0.02em',
              }}>
                {stat.value}
              </span>
              <span style={{
                fontSize: '0.85rem',
                color: 'var(--pp-text-muted)',
                fontWeight: 500,
              }}>
                {stat.label}
              </span>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
