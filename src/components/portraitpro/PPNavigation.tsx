'use client';

import { useState, useEffect } from 'react';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import type { Translations } from '@/i18n/translations/de';

export default function PPNavigation({ t, locale }: { t: Translations; locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`pp-nav ${scrolled ? 'pp-nav-scrolled' : ''}`}>
      <div className="pp-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          {/* Logo */}
          <a href={`/${locale}/portraitpro`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'var(--pp-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '1.1rem',
              fontFamily: 'var(--font-pp-heading)',
            }}>P</div>
            <span style={{
              fontWeight: 700, fontSize: '1.15rem', color: 'var(--pp-text)',
              fontFamily: 'var(--font-pp-heading)',
            }}>
              Portrait<span className="pp-gradient-text">Pro</span> AI
            </span>
          </a>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
            <a href="#funktionen" style={{ color: 'var(--pp-text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--pp-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--pp-text-secondary)')}
            >{t.nav.features}</a>
            <a href="#so-funktionierts" style={{ color: 'var(--pp-text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--pp-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--pp-text-secondary)')}
            >{t.nav.howItWorks}</a>
            <a href="#preise" style={{ color: 'var(--pp-text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--pp-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--pp-text-secondary)')}
            >{t.nav.pricing}</a>
            <a href="#faq" style={{ color: 'var(--pp-text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--pp-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--pp-text-secondary)')}
            >{t.nav.faq}</a>

            {/* Language switcher */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: '1px solid var(--pp-border)',
                  borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
                  fontSize: '0.85rem', color: 'var(--pp-text)',
                }}
              >
                {localeFlags[locale]} {localeNames[locale]}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: langOpen ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}>
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {langOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8,
                  background: 'var(--pp-bg-white)', border: '1px solid var(--pp-border)',
                  borderRadius: 12, boxShadow: 'var(--pp-shadow-lg)', overflow: 'hidden',
                  minWidth: 160, zIndex: 100,
                }}>
                  {locales.map(loc => (
                    <a
                      key={loc}
                      href={`/${loc}/portraitpro`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 16px', textDecoration: 'none',
                        color: loc === locale ? 'var(--pp-accent)' : 'var(--pp-text)',
                        fontWeight: loc === locale ? 600 : 400,
                        fontSize: '0.9rem',
                        background: loc === locale ? 'var(--pp-accent-soft)' : 'transparent',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => { if (loc !== locale) e.currentTarget.style.background = 'var(--pp-bg-warm)'; }}
                      onMouseLeave={e => { if (loc !== locale) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {localeFlags[loc]} {localeNames[loc]}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href={`/${locale}/portraitpro/app`} className="pp-btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              <span>{t.nav.cta}</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--pp-text)" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden" style={{
            padding: '16px 0 24px',
            display: 'flex', flexDirection: 'column', gap: 16,
            borderTop: '1px solid var(--pp-border-light)',
          }}>
            <a href="#funktionen" onClick={() => setMobileOpen(false)} style={{ color: 'var(--pp-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>{t.nav.features}</a>
            <a href="#so-funktionierts" onClick={() => setMobileOpen(false)} style={{ color: 'var(--pp-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>{t.nav.howItWorks}</a>
            <a href="#preise" onClick={() => setMobileOpen(false)} style={{ color: 'var(--pp-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>{t.nav.pricing}</a>
            <a href="#faq" onClick={() => setMobileOpen(false)} style={{ color: 'var(--pp-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>{t.nav.faq}</a>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 8 }}>
              {locales.map(loc => (
                <a key={loc} href={`/${loc}/portraitpro`} style={{
                  padding: '6px 12px', borderRadius: 8,
                  border: loc === locale ? '2px solid var(--pp-accent)' : '1px solid var(--pp-border)',
                  textDecoration: 'none', fontSize: '0.85rem',
                  color: loc === locale ? 'var(--pp-accent)' : 'var(--pp-text)',
                  fontWeight: loc === locale ? 600 : 400,
                }}>
                  {localeFlags[loc]} {localeNames[loc]}
                </a>
              ))}
            </div>
            <a href={`/${locale}/portraitpro/app`} className="pp-btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
              <span>{t.nav.cta}</span>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
