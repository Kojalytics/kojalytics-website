'use client';

import FadeIn from './FadeIn';
import type { Translations } from '@/i18n/translations/de';

export default function PPHowItWorks({ t }: { t: Translations }) {
  const steps = [
    {
      num: '1',
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
    },
    {
      num: '2',
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2a5 5 0 015 5c0 4-5 11-5 11S7 11 7 7a5 5 0 015-5z" />
          <circle cx="12" cy="7" r="1.5" fill="white" />
          <path d="M2 16l5 2 5-4 5 4 5-2" />
        </svg>
      ),
    },
    {
      num: '3',
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
    },
  ];

  return (
    <section id="so-funktionierts" className="pp-section" style={{ background: 'var(--pp-bg-warm)' }}>
      <div className="pp-container">
        <FadeIn style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="pp-badge">{t.howItWorks.badge}</span>
          <h2 style={{
            fontFamily: 'var(--font-pp-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            marginTop: 16,
            letterSpacing: '-0.02em',
            color: 'var(--pp-text)',
          }}>
            {t.howItWorks.title}
          </h2>
        </FadeIn>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 32,
          position: 'relative',
        }}>
          {/* Connecting line */}
          <div style={{
            display: 'none',
            position: 'absolute',
            top: 28,
            left: '20%',
            right: '20%',
            height: 2,
            background: 'linear-gradient(90deg, var(--pp-accent), var(--pp-accent-end))',
            opacity: 0.2,
          }} className="lg:block-custom" />

          {steps.map((step, i) => (
            <FadeIn
              key={i}
              delay={i * 0.12}
              className="pp-card"
              style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                padding: 'clamp(24px, 4vw, 40px) clamp(20px, 3vw, 32px)',
              }}
            >
              <div className="pp-step-number">
                {step.icon}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-pp-heading)',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--pp-text)',
              }}>
                {step.title}
              </h3>
              <p style={{
                color: 'var(--pp-text-secondary)',
                lineHeight: 1.7,
                fontSize: '0.95rem',
              }}>
                {step.desc}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg\\:block-custom { display: block !important; }
        }
      `}</style>
    </section>
  );
}
