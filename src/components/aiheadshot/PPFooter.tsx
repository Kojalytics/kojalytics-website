'use client';

import type { Translations } from '@/i18n/translations/de';
import type { Locale } from '@/i18n/config';
import { privacyUrl } from '@/lib/privacy-slugs';

export default function PPFooter({ t, locale }: { t: Translations; locale: Locale }) {
  const year = new Date().getFullYear();
  const privacyHref = privacyUrl(locale);

  return (
    <footer style={{
      padding: '64px 0 32px',
      background: 'var(--pp-bg-white)',
      borderTop: '1px solid var(--pp-border-light)',
    }}>
      <div className="pp-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 'clamp(24px, 4vw, 40px)',
          marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--pp-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: '1rem',
                fontFamily: 'var(--font-pp-heading)',
              }}>AI</div>
              <span style={{
                fontWeight: 700, fontSize: '1.1rem', color: 'var(--pp-text)',
                fontFamily: 'var(--font-pp-heading)',
              }}>
                <span className="pp-gradient-text">AI</span> Headshot
              </span>
            </div>
            <p style={{ color: 'var(--pp-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {t.footer.tagline}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{
              fontWeight: 700, fontSize: '0.9rem', color: 'var(--pp-text)',
              marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {t.footer.product}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="#funktionen" style={{ color: 'var(--pp-text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--pp-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--pp-text-muted)')}
              >{t.nav.features}</a>
              <a href="#preise" style={{ color: 'var(--pp-text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--pp-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--pp-text-muted)')}
              >{t.nav.pricing}</a>
              <a href="#faq" style={{ color: 'var(--pp-text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--pp-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--pp-text-muted)')}
              >{t.nav.faq}</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{
              fontWeight: 700, fontSize: '0.9rem', color: 'var(--pp-text)',
              marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {t.footer.legal}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={privacyHref} style={{ color: 'var(--pp-text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--pp-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--pp-text-muted)')}
              >{t.footer.privacy}</a>
              <a href="/impressum" style={{ color: 'var(--pp-text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--pp-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--pp-text-muted)')}
              >{t.footer.imprint}</a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{
              fontWeight: 700, fontSize: '0.9rem', color: 'var(--pp-text)',
              marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {t.footer.company}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="/" style={{ color: 'var(--pp-text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--pp-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--pp-text-muted)')}
              >{t.footer.about}</a>
              <a href="/contact" style={{ color: 'var(--pp-text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--pp-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--pp-text-muted)')}
              >{t.footer.contact}</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--pp-border-light)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--pp-text-muted)' }}>
            {t.footer.copyright.replace('{year}', String(year))}
          </span>
          <a href="https://kojalytics.com" style={{
            fontSize: '0.85rem', color: 'var(--pp-text-muted)', textDecoration: 'none',
          }}>
            Kojalytics — Software That Moves
          </a>
        </div>
      </div>
    </footer>
  );
}
