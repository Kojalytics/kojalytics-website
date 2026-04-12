'use client';

import { motion } from 'framer-motion';
import type { Translations } from '@/i18n/translations/de';

export default function PPPricing({ t, locale }: { t: Translations; locale: string }) {
  const plans = [
    {
      ...t.pricing.starter,
      highlighted: false,
      badge: null,
      icon: '🎯',
    },
    {
      ...t.pricing.premium,
      highlighted: true,
      badge: t.pricing.premium.popular,
      icon: '👑',
    },
    {
      ...t.pricing.photographer,
      highlighted: false,
      badge: t.pricing.photographer.expensive,
      strikethrough: true,
      icon: '📷',
    },
  ];

  return (
    <section id="preise" className="pp-section">
      <div className="pp-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}
        >
          <span className="pp-badge">{t.pricing.badge}</span>
          <h2 style={{
            fontFamily: 'var(--font-pp-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            marginTop: 16,
            letterSpacing: '-0.02em',
            color: 'var(--pp-text)',
          }}>
            {t.pricing.title}
          </h2>
          <p style={{
            color: 'var(--pp-text-secondary)',
            fontSize: '1.1rem',
            marginTop: 12,
          }}>
            {t.pricing.subtitle}
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 24,
          alignItems: 'start',
          maxWidth: 1000,
          margin: '0 auto',
        }}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`pp-card ${plan.highlighted ? 'pp-pricing-popular' : ''}`}
              style={{
                padding: 'clamp(24px, 4vw, 40px) clamp(20px, 3vw, 32px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                position: 'relative',
                ...( plan.highlighted ? { boxShadow: '0 12px 40px rgba(233, 69, 96, 0.15)' } : {}),
                ...( 'strikethrough' in plan ? { opacity: 0.7 } : {}),
              }}
            >
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: -14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '6px 20px',
                  borderRadius: 100,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  ...(plan.highlighted
                    ? { background: 'var(--pp-gradient)', color: 'white' }
                    : { background: 'var(--pp-bg-warm)', color: 'var(--pp-text-muted)', border: '1px solid var(--pp-border)' }
                  ),
                  whiteSpace: 'nowrap',
                }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '2rem' }}>{plan.icon}</span>
                <h3 style={{
                  fontFamily: 'var(--font-pp-heading)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: 'var(--pp-text)',
                  marginTop: 8,
                }}>
                  {plan.name}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--pp-text-muted)',
                  marginTop: 4,
                }}>
                  {plan.desc}
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{
                  fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                  fontWeight: 800,
                  color: 'var(--pp-text)',
                  fontFamily: 'var(--font-pp-heading)',
                  ...('strikethrough' in plan ? { textDecoration: 'line-through', color: 'var(--pp-text-muted)' } : {}),
                }}>
                  €{plan.price}
                </span>
                <span style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: 'var(--pp-text-muted)',
                  marginTop: 4,
                }}>
                  {plan.period}
                </span>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                {plan.features.map((feature, j) => (
                  <li key={j} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: '0.95rem',
                    color: 'var(--pp-text-secondary)',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="9" cy="9" r="9" fill={plan.highlighted ? 'var(--pp-accent)' : 'strikethrough' in plan ? 'var(--pp-text-muted)' : '#34D399'} opacity="0.15" />
                      <path d="M5.5 9L8 11.5L12.5 6.5" stroke={plan.highlighted ? 'var(--pp-accent)' : 'strikethrough' in plan ? 'var(--pp-text-muted)' : '#34D399'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {'strikethrough' in plan ? (
                <button
                  className="pp-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', cursor: 'default', opacity: 0.5 }}
                  disabled
                >
                  <span>{plan.cta}</span>
                </button>
              ) : (
                <a
                  href={`/${locale}/portraitpro/app`}
                  className={plan.highlighted ? 'pp-btn-primary' : 'pp-btn-secondary'}
                  style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', textDecoration: 'none' }}
                >
                  <span>{plan.cta}</span>
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
