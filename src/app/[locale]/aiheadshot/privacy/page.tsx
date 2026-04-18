import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/get-translations';
import { privacyContent } from './privacy-data';
import { privacyUrl } from '@/lib/privacy-slugs';
import PPNavigation from '@/components/aiheadshot/PPNavigation';
import PPFooter from '@/components/aiheadshot/PPFooter';
import '../aiheadshot.css';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const content = privacyContent[locale as Locale];
  return {
    title: `${content.pageTitle} — AI Headshot`,
    description: content.highlight,
    alternates: {
      canonical: `https://kojalytics.com${privacyUrl(locale as Locale)}`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `https://kojalytics.com${privacyUrl(loc)}`])
      ),
    },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const loc = locale as Locale;
  const content = privacyContent[loc];
  const t = await getTranslations(loc);

  return (
    <div style={{ background: 'var(--pp-bg)' }}>
      <PPNavigation t={t} locale={loc} />

      <main
        style={{
          padding: 'clamp(96px, 12vw, 140px) 0 clamp(60px, 8vw, 100px)',
          background: 'var(--pp-bg)',
        }}
      >
        <div className="pp-container" style={{ maxWidth: 820 }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              background: 'rgba(99,102,241,0.08)',
              borderRadius: 999,
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            <span className="pp-gradient-text">{content.productLabel}</span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--pp-text)',
              fontFamily: 'var(--font-pp-heading)',
              lineHeight: 1.15,
              margin: '0 0 12px',
            }}
          >
            {content.pageTitle}
          </h1>

          <p
            style={{
              color: 'var(--pp-text-muted)',
              fontSize: '0.95rem',
              margin: '0 0 40px',
            }}
          >
            {content.lastUpdated}
          </p>

          {/* Highlight card */}
          <div
            style={{
              padding: 'clamp(20px, 3vw, 28px)',
              borderRadius: 20,
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid var(--pp-border-light)',
              marginBottom: 48,
            }}
          >
            <p
              style={{
                margin: 0,
                color: 'var(--pp-text)',
                fontSize: '1rem',
                lineHeight: 1.65,
                fontWeight: 500,
              }}
            >
              {content.highlight}
            </p>
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {content.sections.map((section, i) => (
              <section key={i}>
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--pp-text)',
                    fontFamily: 'var(--font-pp-heading)',
                    margin: '0 0 14px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {section.title}
                </h2>
                <div
                  className="pp-privacy-content"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))}
          </div>

          {/* Contact footer */}
          <div
            style={{
              marginTop: 64,
              padding: 'clamp(20px, 3vw, 28px)',
              borderRadius: 20,
              background: 'var(--pp-bg-white)',
              border: '1px solid var(--pp-border-light)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: '0 0 6px',
                fontSize: '0.95rem',
                color: 'var(--pp-text-secondary)',
                fontWeight: 500,
              }}
            >
              {content.footerQuestions}
            </p>
            <a
              href={`mailto:${content.contactEmail}`}
              style={{
                color: 'var(--pp-accent)',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '1rem',
              }}
            >
              {content.contactEmail}
            </a>
          </div>
        </div>
      </main>

      <PPFooter t={t} locale={loc} />
    </div>
  );
}
