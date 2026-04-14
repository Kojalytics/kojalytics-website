'use client';

import FadeIn from './FadeIn';
import type { Translations } from '@/i18n/translations/de';

export default function PPAppPromo({ t }: { t: Translations }) {
  return (
    <section className="pp-app-promo">
      {/* Ambient background elements */}
      <div className="pp-app-promo-glow pp-app-promo-glow-1" />
      <div className="pp-app-promo-glow pp-app-promo-glow-2" />

      <div className="pp-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="pp-app-promo-grid">
          {/* Left: iPhone mockup */}
          <FadeIn delay={0.1} className="pp-app-promo-phone-col">
            <div className="pp-app-promo-phone">
              <div className="pp-app-promo-phone-frame">
                {/* Dynamic Island */}
                <div className="pp-app-promo-notch" />
                {/* Screen content */}
                <div className="pp-app-promo-screen">
                  <div className="pp-app-promo-screen-header">
                    <div className="pp-app-promo-app-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <rect width="24" height="24" rx="6" fill="url(#appIcon)" />
                        <path d="M7 8.5A1.5 1.5 0 018.5 7h7A1.5 1.5 0 0117 8.5v7a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 15.5v-7z" stroke="white" strokeWidth="1.2" />
                        <circle cx="10" cy="10.5" r="1.2" stroke="white" strokeWidth="1" />
                        <path d="M7 14.5l3-2.5 2 1.5 3-3 2 2" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                          <linearGradient id="appIcon" x1="0" y1="0" x2="24" y2="24">
                            <stop stopColor="#E94560" />
                            <stop offset="1" stopColor="#F27121" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>
                      PortraitPro AI
                    </span>
                  </div>
                  {/* Mock portrait grid */}
                  <div className="pp-app-promo-portrait-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="pp-app-promo-portrait-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/portraitpro/comparisons/after-${i}.webp`}
                          alt={`Portrait ${i}`}
                          width={120}
                          height={160}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Mock bottom bar */}
                  <div className="pp-app-promo-screen-bar">
                    <div className="pp-app-promo-bar-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    </div>
                    <div className="pp-app-promo-bar-btn pp-app-promo-bar-btn-active">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                    </div>
                    <div className="pp-app-promo-bar-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badges around phone */}
              <div className="pp-app-promo-float pp-app-promo-float-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L8.8 4.8L13 5.4L10 8.3L10.7 12.5L7 10.5L3.3 12.5L4 8.3L1 5.4L5.2 4.8L7 1Z" fill="#FFD700" />
                </svg>
                <span>4.9</span>
              </div>
              <div className="pp-app-promo-float pp-app-promo-float-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span>{t.appPromo.floatOffline}</span>
              </div>
            </div>
          </FadeIn>

          {/* Right: Content */}
          <FadeIn delay={0.2} className="pp-app-promo-content">
            <span className="pp-badge" style={{ marginBottom: 20 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginRight: 4 }}>
                <rect x="5" y="2" width="14" height="20" rx="3" />
                <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="3" />
              </svg>
              {t.appPromo.badge}
            </span>

            <h2 style={{
              fontFamily: 'var(--font-pp-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--pp-text)',
              marginBottom: 16,
            }}>
              {t.appPromo.title}{' '}
              <span className="pp-gradient-text">{t.appPromo.titleHighlight}</span>
            </h2>

            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              lineHeight: 1.7,
              color: 'var(--pp-text-secondary)',
              marginBottom: 32,
              maxWidth: 480,
            }}>
              {t.appPromo.description}
            </p>

            {/* Feature chips */}
            <div className="pp-app-promo-chips">
              {[
                { icon: '⚡', text: t.appPromo.chip1 },
                { icon: '📱', text: t.appPromo.chip2 },
                { icon: '🔒', text: t.appPromo.chip3 },
                { icon: '✨', text: t.appPromo.chip4 },
              ].map((chip, i) => (
                <div key={i} className="pp-app-promo-chip">
                  <span style={{ fontSize: '1rem' }}>{chip.icon}</span>
                  <span>{chip.text}</span>
                </div>
              ))}
            </div>

            {/* App Store button */}
            <a
              href="https://apps.apple.com/app/portraitpro-ai/id6743597845"
              target="_blank"
              rel="noopener noreferrer"
              className="pp-app-promo-store-btn"
              aria-label="Download on the App Store"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 16.56 2.93 11.3 4.7 7.72C5.57 5.94 7.36 4.86 9.28 4.84C10.56 4.81 11.78 5.72 12.55 5.72C13.33 5.72 14.79 4.62 16.36 4.81C17.01 4.84 18.82 5.08 19.97 6.75C19.88 6.81 17.67 8.09 17.7 10.77C17.73 13.97 20.5 15.02 20.53 15.03C20.5 15.1 20.09 16.55 19.07 18.06L18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
              </svg>
              <div className="pp-app-promo-store-text">
                <span className="pp-app-promo-store-label">{t.appPromo.storeLabel}</span>
                <span className="pp-app-promo-store-name">App Store</span>
              </div>
            </a>

            <p style={{
              fontSize: '0.8rem',
              color: 'var(--pp-text-muted)',
              marginTop: 16,
            }}>
              {t.appPromo.requirement}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
