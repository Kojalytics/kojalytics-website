'use client';

import FadeIn from './FadeIn';

/* 25 brand logos: 22 SVG files + 3 inline SVGs (Microsoft, Amazon, Adobe) */
/* All SVG files from Simple Icons (MIT licensed), ~1-5KB each, zero network overhead */

type Brand = {
  name: string;
  file?: string;      // path to SVG in /portraitpro/logos/
  inline?: true;       // render inline SVG instead
  h?: number;          // display height override (default 28)
};

const BRANDS: Brand[] = [
  // Row 1
  { name: 'Google',     file: 'google.svg', h: 30 },
  { name: 'Tesla',      file: 'tesla.svg', h: 18 },
  { name: 'NVIDIA',     file: 'nvidia.svg', h: 28 },
  { name: 'Apple',      file: 'apple.svg', h: 32 },
  { name: 'Microsoft',  inline: true, h: 26 },
  // Row 2
  { name: 'Amazon',     inline: true, h: 26 },
  { name: 'Stripe',     file: 'stripe.svg', h: 28 },
  { name: 'Airbnb',     file: 'airbnb.svg', h: 30 },
  { name: 'Netflix',    file: 'netflix.svg', h: 28 },
  { name: 'Meta',       file: 'meta.svg', h: 26 },
  // Row 3
  { name: 'Nike',       file: 'nike.svg', h: 24 },
  { name: 'PayPal',     file: 'paypal.svg', h: 28 },
  { name: 'Cisco',      file: 'cisco.svg', h: 28 },
  { name: 'Adobe',      inline: true, h: 28 },
  { name: 'Spotify',    file: 'spotify.svg', h: 28 },
  // Row 4
  { name: 'BMW',        file: 'bmw.svg', h: 32 },
  { name: 'SAP',        file: 'sap.svg', h: 24 },
  { name: 'Siemens',    file: 'siemens.svg', h: 22 },
  { name: 'Bosch',      file: 'bosch.svg', h: 28 },
  { name: 'Uber',       file: 'uber.svg', h: 22 },
  // Row 5
  { name: 'Puma',       file: 'puma.svg', h: 26 },
  { name: 'Coca-Cola',  file: 'cocacola.svg', h: 26 },
  { name: 'Lenovo',     file: 'lenovo.svg', h: 20 },
  { name: 'Okta',       file: 'okta.svg', h: 24 },
  { name: 'Zoom',       file: 'zoom.svg', h: 26 },
];

/* Inline SVGs for brands not in Simple Icons */
function MicrosoftLogo({ h }: { h: number }) {
  return (
    <svg height={h} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022"/>
      <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00"/>
      <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF"/>
      <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900"/>
    </svg>
  );
}

function AmazonLogo({ h }: { h: number }) {
  return (
    <svg height={h} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.66.66 0 01-.753.077c-1.06-.879-1.247-1.287-1.829-2.125-1.747 1.783-2.983 2.315-5.249 2.315-2.681 0-4.768-1.655-4.768-4.967 0-2.586 1.402-4.346 3.398-5.206 1.73-.755 4.148-.891 5.995-1.1v-.41c0-.755.058-1.648-.385-2.3-.385-.58-1.124-.819-1.774-.819-1.205 0-2.277.618-2.54 1.897-.054.285-.261.565-.546.579l-3.065-.33c-.258-.058-.544-.266-.47-.66C6.057 1.926 9.311.787 12.243.787c1.5 0 3.46.399 4.64 1.539 1.5 1.402 1.357 3.27 1.357 5.307v4.806c0 1.443.599 2.076 1.163 2.856.198.277.241.611-.011.819-.63.527-1.752 1.506-2.369 2.055l-.003-.003-.876.63z" fill="#FF9900"/>
      <path d="M21.558 19.366c-2.869 2.118-7.027 3.244-10.608 3.244-5.02 0-9.538-1.855-12.95-4.94-.268-.242-.029-.573.294-.384 3.685 2.143 8.242 3.432 12.949 3.432 3.175 0 6.67-.657 9.886-2.015.485-.209.891.319.429.663z" fill="#FF9900"/>
      <path d="M22.601 18.098c-.365-.468-2.417-.221-3.338-.112-.28.034-.323-.21-.071-.385 1.635-1.149 4.316-.818 4.628-.433.314.39-.083 3.086-1.616 4.373-.235.198-.46.093-.356-.17.345-.862 1.118-2.805.753-3.273z" fill="#FF9900"/>
    </svg>
  );
}

function AdobeLogo({ h }: { h: number }) {
  return (
    <svg height={h} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM0 .64h9.053v22.72L0 .64zm14.568 0H24v22.72L14.568.64z" fill="#FA0F00"/>
    </svg>
  );
}

export default function PPTrustLogos() {
  return (
    <section style={{
      padding: 'clamp(36px, 6vw, 56px) 0 clamp(32px, 5vw, 48px)',
      background: 'var(--pp-bg)',
    }}>
      <div className="pp-container">
        <FadeIn style={{ textAlign: 'center', marginBottom: 'clamp(24px, 4vw, 36px)' }}>
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
        </FadeIn>

        <FadeIn
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 'clamp(16px, 3vw, 32px) clamp(12px, 2vw, 24px)',
            maxWidth: 1000,
            margin: '0 auto',
            alignItems: 'center',
            justifyItems: 'center',
          }}
          className="pp-logo-grid"
        >
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.55,
                filter: 'grayscale(1)',
                transition: 'all 0.3s ease',
                padding: '8px',
                minHeight: 44,
              }}
              title={brand.name}
            >
              {brand.inline ? (
                brand.name === 'Microsoft' ? <MicrosoftLogo h={brand.h || 28} /> :
                brand.name === 'Amazon' ? <AmazonLogo h={brand.h || 28} /> :
                <AdobeLogo h={brand.h || 28} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/portraitpro/logos/${brand.file}`}
                  alt={brand.name}
                  height={brand.h || 28}
                  width="auto"
                  loading="lazy"
                  decoding="async"
                  style={{
                    height: brand.h || 28,
                    width: 'auto',
                    maxWidth: '100%',
                    display: 'block',
                  }}
                />
              )}
            </div>
          ))}
        </FadeIn>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pp-logo-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .pp-logo-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 12px 8px !important;
          }
          .pp-logo-grid img {
            max-height: 22px !important;
          }
        }
      `}</style>
    </section>
  );
}
