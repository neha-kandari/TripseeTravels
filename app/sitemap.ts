import type { MetadataRoute } from 'next';

const BASE_URL = 'https://tripseetravel.in';

const DESTINATIONS = [
  'bali',
  'vietnam',
  'singapore',
  'thailand',
  'malaysia',
  'dubai',
  'maldives',
  'andaman',
];

const ITINERARIES = [
  'bali-premium',
  'bali-7night',
  'bali-7night-basic',
  'bali-6night-honeymoon',
  'bali-6night-basic',
  'bali-6night-premium',
  'bali-5night-4star',
  'bali-8night-gili',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`,                      lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/about`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`,               lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/reviews`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE_URL}/romantic-hideaway`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/terms-and-conditions`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const destinationPages: MetadataRoute.Sitemap = DESTINATIONS.map(slug => ({
    url: `${BASE_URL}/destination/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const itineraryPages: MetadataRoute.Sitemap = ITINERARIES.map(slug => ({
    url: `${BASE_URL}/itinerary/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...destinationPages, ...itineraryPages];
}
