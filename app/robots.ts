import type { MetadataRoute } from 'next';

const BASE_URL = 'https://tripseetravel.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Admin pages and API routes are not for crawlers.
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
