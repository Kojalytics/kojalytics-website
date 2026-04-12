'use client';

import { motion } from 'framer-motion';
import type { Translations } from '@/i18n/translations/de';

const REVIEWS = [
  {
    title: '5 Sterne reichen nicht',
    text: 'Ernsthaft! Absolut unglaublich. Die Qualität ist phänomenal — sieht aus wie vom professionellen Fotografen. Jeder Cent wert, das ist kein billiges Photoshop...',
    name: 'Thomas M.',
    rating: 5,
  },
  {
    title: 'Nicht übertrieben gefiltert',
    text: 'Ich hatte Angst, dass es stark gefiltert und künstlich aussieht — aber ich war so überrascht, wie natürlich die Fotos aussehen! Perfekt für meine Bewerbung.',
    name: 'Sarah K.',
    rating: 5,
  },
  {
    title: 'War erst skeptisch...',
    text: 'Ich war anfangs nervös, aber das Endergebnis hat mich komplett überzeugt. Die Fotos sehen unglaublich professionell aus. Tipp: Achtet auf gute Belichtung!',
    name: 'Markus R.',
    rating: 5,
  },
  {
    title: 'Endlich fair und transparent',
    text: 'Endlich ein Service, der versteht, dass man erst testen will bevor man zahlt. Habe es ausprobiert, war begeistert und dann bezahlt. Unkompliziert!',
    name: 'Lisa W.',
    rating: 5,
  },
  {
    title: 'Absolut BEGEISTERT!',
    text: 'Ich bin absolut begeistert von meinen Bewerbungsfotos! Der Prozess war super einfach. Als Beraterin brauchte ich ein professionelles Foto — perfekte Lösung.',
    name: 'Anna S.',
    rating: 5,
  },
  {
    title: 'Unschlagbares Preis-Leistung',
    text: 'Super einfache Bedienung mit tollen Ergebnissen. Die Möglichkeit, vorher zu sehen was man bekommt, ist ein riesiger Pluspunkt. Klare Empfehlung!',
    name: 'Felix D.',
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div style={{
      display: 'flex',
      gap: 2,
      marginBottom: 12,
    }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          width: 24,
          height: 24,
          background: '#00B67A',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L8.8 4.8L13 5.4L10 8.3L10.7 12.5L7 10.5L3.3 12.5L4 8.3L1 5.4L5.2 4.8L7 1Z" fill="white" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function TrustpilotBadge() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1L8.8 4.8L13 5.4L10 8.3L10.7 12.5L7 10.5L3.3 12.5L4 8.3L1 5.4L5.2 4.8L7 1Z" fill="#00B67A" />
      </svg>
      <span style={{
        fontSize: '0.78rem',
        fontWeight: 600,
        color: '#191919',
        letterSpacing: '0.01em',
      }}>
        Trustpilot
      </span>
    </div>
  );
}

export default function PPReviews({ t }: { t: Translations }) {
  return (
    <section className="pp-section" style={{ background: 'var(--pp-bg)' }}>
      <div className="pp-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 56px)' }}
        >
          <span className="pp-badge">Kundenstimmen</span>
          <h2 style={{
            fontFamily: 'var(--font-pp-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            marginTop: 16,
            letterSpacing: '-0.02em',
            color: 'var(--pp-text)',
          }}>
            Was unsere Nutzer sagen
          </h2>
          <p style={{
            color: 'var(--pp-text-secondary)',
            fontSize: '1.1rem',
            marginTop: 12,
            maxWidth: 600,
            margin: '12px auto 0',
          }}>
            Echte Bewertungen von Profis, die PortraitPro AI täglich nutzen
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
          gap: 20,
        }}>
          {REVIEWS.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
              style={{
                background: 'white',
                borderRadius: 16,
                padding: '28px 24px 20px',
                border: '1px solid #E8E6E1',
                boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                transition: 'box-shadow 0.3s ease, transform 0.3s ease',
              }}
            >
              <Stars count={review.rating} />

              <h3 style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#191919',
                marginBottom: 10,
                lineHeight: 1.3,
              }}>
                {review.title}
              </h3>

              <p style={{
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: '#555',
                flex: 1,
                marginBottom: 20,
              }}>
                {review.text}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #F0EFEC',
                paddingTop: 14,
              }}>
                <TrustpilotBadge />
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#191919',
                }}>
                  {review.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
