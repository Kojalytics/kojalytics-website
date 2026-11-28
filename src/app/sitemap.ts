import type { MetadataRoute } from 'next';
import { APPS } from '@/lib/apps';
import { ARTICLES } from '@/lib/ratgeber';
import { SITE_URL } from '@/lib/site';
import { href } from '@/lib/i18n';

// Date of the last real content change of the non-article pages. Update it when they change, so
// lastModified stays meaningful instead of moving with every deploy.
const PAGES_UPDATED = new Date('2026-11-23');

type Freq = 'weekly' | 'monthly' | 'yearly';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`;
  const page = (path: string, priority: number, changeFrequency: Freq = 'monthly', lastModified: Date = PAGES_UPDATED) => ({
    url: url(path),
    lastModified,
    changeFrequency,
    priority,
  });
  // A page in German and English, both entries listing each other (hreflang); English is the default for other languages.
  const both = (path: string, priority: number, changeFrequency: Freq = 'monthly') => {
    const languages = { de: url(path), en: url(href('en', path)), 'x-default': url(href('en', path)) };
    return [
      { ...page(path, priority, changeFrequency), alternates: { languages } },
      { ...page(href('en', path), priority, changeFrequency), alternates: { languages } },
    ];
  };

  return [
    ...both('/', 1.0, 'weekly'),
    ...both('/web', 0.9, 'weekly'),
    ...APPS.flatMap((a) => both(`/software/${a.slug}`, 0.9, 'weekly')),
    page('/ratgeber', 0.8, 'weekly'),
    ...ARTICLES.map((a) => page(`/ratgeber/${a.slug}`, 0.8, 'monthly', new Date(a.updated))),
    ...both('/warum-koja', 0.6),
    ...both('/kontakt', 0.5),
    ...both('/support', 0.4),
    ...both('/support/windows-installation', 0.4),
    ...both('/kuendigen', 0.3, 'yearly'),
    ...both('/impressum', 0.2, 'yearly'),
    ...both('/datenschutz', 0.2, 'yearly'),
  ];
}
