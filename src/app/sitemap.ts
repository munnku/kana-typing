import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://kana-typing.vercel.app';
  const now = new Date();

  return [
    { url: base,                    lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/lessons`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/test`,          lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/how-to-use`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/faq`,           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/badges`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/stats`,         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${base}/privacy`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ];
}
