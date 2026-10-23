import type { MetadataRoute } from 'next';
import { APPS } from '@/lib/apps';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'monthly') => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page('', 1.0),
    page('/software', 1.0, 'weekly'),
    ...APPS.map((a) => page(`/software/${a.slug}`, 0.9, 'weekly')),
    page('/services', 0.8),
    page('/work', 0.7),
    page('/work/ai-headshot', 0.6),
    page('/about', 0.6),
    page('/contact', 0.6),
    page('/licensing', 0.6),
    page('/etsy-sync', 0.6),
    page('/support', 0.4),
    page('/cancel', 0.3, 'yearly'),
    page('/impressum', 0.2, 'yearly'),
    page('/datenschutz', 0.2, 'yearly'),
  ];
}
