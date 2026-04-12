import { ImageResponse } from 'next/og';

export const alt = 'PortraitPro AI — Professionelle Bewerbungsfotos mit KI';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(145deg, #FAFAF8 0%, #F0EDE8 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Gradient orbs */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,69,96,0.1), transparent 70%)', top: -200, right: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,113,33,0.08), transparent 70%)', bottom: -100, left: -50 }} />

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 72px', width: '100%', position: 'relative', zIndex: 2 }}>

          {/* Rating badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width: 22, height: 22, background: '#00B67A', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L8.8 4.8L13 5.4L10 8.3L10.7 12.5L7 10.5L3.3 12.5L4 8.3L1 5.4L5.2 4.8L7 1Z" fill="white" />
                  </svg>
                </div>
              ))}
            </div>
            <span style={{ fontSize: 18, color: '#4A4A68', fontWeight: 600, marginLeft: 4 }}>
              4,9/5 bei 312 Bewertungen
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
            <span style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#1A1A2E' }}>
              Dein professionelles
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #E94560, #F27121)', backgroundClip: 'text', color: 'transparent' }}>
                Bewerbungsfoto
              </span>
              <span style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#1A1A2E' }}>
                in 5 Min.
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p style={{ fontSize: 24, lineHeight: 1.5, color: '#4A4A68', marginBottom: 36, maxWidth: 700 }}>
            Lade ein Selfie hoch — erhalte ein Studio-Foto. Kein Fotograf, kein Termin, kein Abo. Ab 4,99 €.
          </p>

          {/* Trust row */}
          <div style={{ display: 'flex', gap: 28 }}>
            {['10.000+ Nutzer', 'Studio-Qualität', 'Sofort fertig'].map(text => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="#22C55E" opacity="0.15" />
                  <path d="M6 10L9 13L14 7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 17, fontWeight: 600, color: '#4A4A68' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Brand badge bottom-left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'absolute', bottom: 48, left: 72 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #E94560, #F27121)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 20 }}>
              P
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: '#1A1A2E' }}>
              PortraitPro AI
            </span>
            <span style={{ fontSize: 16, color: '#8888A0', marginLeft: 4 }}>
              by Kojalytics
            </span>
          </div>

          {/* Mockup photos — right side */}
          <div style={{ position: 'absolute', right: 56, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Before card */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 160, height: 213,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #E8E6E1 0%, #D4D2CD 100%)',
                border: '2px solid #E8E6E1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A0A0B0" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21a8 8 0 10-16 0" />
                </svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#8888A0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Selfie</span>
            </div>

            {/* Arrow */}
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #E94560, #F27121)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(233,69,96,0.35)', flexShrink: 0 }}>
              <span style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>→</span>
            </div>

            {/* After card */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 160, height: 213,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #F8F6F3 0%, #FFFFFF 100%)',
                border: '3px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #E94560, #F27121)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(233,69,96,0.15), 0 4px 12px rgba(0,0,0,0.06)',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E94560" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21a8 8 0 10-16 0" />
                  <path d="M16 3l2 2-6 6" stroke="#22C55E" strokeWidth="2" />
                </svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg, #E94560, #F27121)', backgroundClip: 'text', color: 'transparent', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Profi-Foto</span>
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg, #E94560, #F27121)' }} />
      </div>
    ),
    { ...size }
  );
}
