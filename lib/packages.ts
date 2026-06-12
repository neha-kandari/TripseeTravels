// Server-side fetcher for destination packages.
//
// Used by destination page Server Components to pre-render packages with the
// initial HTML — no client round-trip required for first paint. The client
// component then refreshes in the background to pick up any updates.
//
// Returns the same package shape that the existing API GET handlers transform
// to, so the client component can render it without further normalisation.

type RawPackage = Record<string, unknown> & {
  _id?: unknown;
  name?: string;
  description?: string;
  price?: number;
  duration?: string;
  days?: string;
  destination?: string;
  location?: string;
  image?: string;
  category?: string;
  type?: string;
  hotelRating?: number;
  features?: string[];
  highlights?: unknown;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface DestinationPackage {
  id: string;
  _id: string;
  name: string;
  title: string;
  description: string;
  // Pre-formatted as "₹X,XXX/-" so it matches what the Client's own fetchPackages
  // transform produces. This means SSR-seeded packages and client-fetched
  // packages share identical shape — parsePrice / filtering / display all
  // work without per-source branching.
  price: string;
  duration: string;
  days: string;
  destination: string;
  location: string;
  image: string;
  category: string;
  type: string;
  hotelRating: number;
  features: string[];
  highlights: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all active packages for a destination directly from MongoDB.
 *
 * Hard 3s timeout so a slow/down DB never blocks the page render. On any
 * failure the function returns `[]` rather than throwing — the client
 * component will still mount, attempt its own fetch, and degrade gracefully.
 */
export async function getDestinationPackages(slug: string): Promise<DestinationPackage[]> {
  if (!process.env.MONGODB_URI) return [];

  try {
    // Query through Mongoose using the SAME model the admin write paths use.
    // Guarantees we read from the exact database/collection the admin writes to,
    // regardless of how the connection string parses.
    const connectDB = (await import('./mongoose')).default;
    const PackageModel = (await import('./models/Package')).default;

    const dbPromise = (async () => {
      await connectDB();
      return PackageModel
        .find({ destination: slug })
        .sort({ createdAt: -1 })
        .lean()
        .exec() as Promise<RawPackage[]>;
    })();

    const timeout = new Promise<RawPackage[]>(resolve =>
      setTimeout(() => resolve([]), 3000)
    );

    const raw = await Promise.race([dbPromise, timeout]);
    if (!Array.isArray(raw) || raw.length === 0) return [];

    return raw.map(pkg => {
      const id = pkg._id ? String(pkg._id) : '';
      const highlights = Array.isArray(pkg.highlights)
        ? (pkg.highlights as string[]).join(' • ')
        : (pkg.highlights as string) || pkg.description || '';
      const priceNum = Number(pkg.price) || 0;
      // Match the Client fetchPackages transform: "₹50,000/-"
      const priceStr = `₹${priceNum.toLocaleString('en-IN')}/-`;
      return {
        id,
        _id: id,
        name: pkg.name || '',
        title: pkg.name || '',
        description: pkg.description || '',
        price: priceStr,
        duration: pkg.duration || '',
        days: pkg.days || pkg.duration || '',
        destination: pkg.destination || slug,
        location: pkg.location || '',
        image: pkg.image || '',
        category: pkg.category || 'romantic',
        type: pkg.type || pkg.category || 'Standard',
        hotelRating: Number(pkg.hotelRating) || 4,
        features: Array.isArray(pkg.features) ? pkg.features : [],
        highlights,
        isActive: pkg.isActive !== false,
        createdAt: pkg.createdAt ? String(pkg.createdAt) : '',
        updatedAt: pkg.updatedAt ? String(pkg.updatedAt) : '',
      };
    });
  } catch {
    return [];
  }
}
