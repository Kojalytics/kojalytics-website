import type { MetadataRoute } from 'next';
import { APPS } from '@/lib/apps';
import { ARTICLES } from '@/lib/ratgeber';
import { SITE_URL } from '@/lib/site';
import { PROJECTS } from '@/lib/studio';

// Date of the last real content change of the non-article pages. Update it when they change, so
// lastModified stays meaningful instead of moving with every deploy.
const PAGES_UPDATED = new Date('2026-11-13');

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'monthly', lastModified: Date = PAGES_UPDATED) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page('', 1.0),
    page('/software', 1.0, 'weekly'),
    ...APPS.map((a) => page(`/software/${a.slug}`, 0.9, 'weekly')),
    page('/ratgeber', 0.8, 'weekly'),
    ...ARTICLES.map((a) => page(`/ratgeber/${a.slug}`, 0.8, 'monthly', new Date(a.updated))),
    page('/leistungen', 0.7),
    page('/projekte', 0.6),
    ...PROJECTS.map((p) => page(`/projekte/${p.slug}`, 0.4)),
    page('/ueber-uns', 0.5),
    page('/kontakt', 0.5),
    page('/lizenzen', 0.8),
    page('/support', 0.4),
    page('/support/windows-installation', 0.4),
    page('/kuendigen', 0.3, 'yearly'),
    page('/impressum', 0.2, 'yearly'),
    page('/datenschutz', 0.2, 'yearly'),
  ];
}
