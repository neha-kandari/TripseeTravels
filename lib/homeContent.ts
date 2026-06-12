// Safe server-side fetcher — never throws, caps at 3 s so the page never hangs
export async function getHomeContent() {
  if (!process.env.MONGODB_URI) return null;
  try {
    const { getDatabase } = await import('./mongodb');

    const dbPromise = getDatabase().then(db =>
      db.collection('homecontent').findOne({}, { sort: { createdAt: -1 } })
    );
    // Bail out quickly when MongoDB is unreachable (preview / CI)
    const timeout = new Promise<null>(resolve =>
      setTimeout(() => resolve(null), 3000)
    );

    const doc = await Promise.race([dbPromise, timeout]);
    if (!doc) return null;
    // Serialize MongoDB types (ObjectId, Date) so props are plain JSON
    return JSON.parse(JSON.stringify(doc));
  } catch {
    return null;
  }
}
