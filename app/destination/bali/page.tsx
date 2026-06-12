// Server Component: pre-fetches packages from MongoDB AND emits a <link
// rel="preload"> for the first hero image so the browser can start
// downloading it before HTML parsing finishes. Result: the hero photo is
// visible the instant the page paints, instead of flashing dark first.
import { getDestinationPackages } from '@/lib/packages';
import Client from './Client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const HERO_IMAGE = "/Destination/bali/Bali4.webp";

export default async function Page() {
  const initialPackages = await getDestinationPackages('bali');
  return (
    <>
      {/* Hoisted to <head>: highest-priority download, parallel to HTML parse */}
      <link
        rel="preload"
        as="image"
        href={HERO_IMAGE}
        fetchPriority="high"
      />
      <Client initialPackages={initialPackages} />
    </>
  );
}
