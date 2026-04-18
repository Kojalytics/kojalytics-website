import type { Metadata } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
import { locales, seoKeywords, type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/get-translations';
import './aiheadshot.css';

const dmSans = DM_Sans({
  variable: '--font-pp-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-pp-heading',
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (locales.includes(localeParam as Locale) ? localeParam : 'de') as Locale;
  const t = await getTranslations(locale);
  const keywords = seoKeywords[locale];

  const baseUrl = 'https://kojalytics.com';

  const alternateLanguages: Record<string, string> = {};
  for (const loc of locales) {
    alternateLanguages[loc] = `${baseUrl}/${loc}/aiheadshot`;
  }

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords,
    authors: [{ name: 'Kojalytics' }],
    creator: 'Kojalytics',
    publisher: 'Kojalytics',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/aiheadshot`,
      languages: alternateLanguages,
    },
    openGraph: {
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      url: `${baseUrl}/${locale}/aiheadshot`,
      siteName: 'AI Headshot by Kojalytics',
      type: 'website',
      locale: locale === 'de' ? 'de_DE' : locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'fr' ? 'fr_FR' : locale === 'da' ? 'da_DK' : locale === 'nl' ? 'nl_NL' : 'sv_SE',
      // images auto-discovered from opengraph-image.tsx
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      // images auto-discovered from twitter-image.tsx
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function AIHeadshotLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (locales.includes(localeParam as Locale) ? localeParam : 'de') as Locale;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI Headshot',
    applicationCategory: 'PhotographyApplication',
    operatingSystem: 'Web, iOS',
    offers: [
      {
        '@type': 'Offer',
        name: 'Starter',
        price: '4.99',
        priceCurrency: 'EUR',
      },
      {
        '@type': 'Offer',
        name: 'Premium',
        price: '9.99',
        priceCurrency: 'EUR',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '312',
      bestRating: '5',
    },
    description: 'AI-powered professional headshot generator. Create studio-quality business photos in minutes.',
    url: `https://kojalytics.com/${locale}/aiheadshot`,
    publisher: {
      '@type': 'Organization',
      name: 'Kojalytics',
      url: 'https://kojalytics.com',
    },
  };

  return (
    <div className={`${dmSans.variable} ${spaceGrotesk.variable} pp-page`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </div>
  );
}
