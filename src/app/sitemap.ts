import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kojalytics.com';

  const portraitProPages = locales.map(locale => ({
    url: `${baseUrl}/${locale}/portraitpro`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: locale === 'de' ? 1.0 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        locales.map(loc => [loc, `${baseUrl}/${loc}/portraitpro`])
      ),
    },
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...portraitProPages,
  ];
}
