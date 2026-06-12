/**
 * Update all image paths in MongoDB from .jpg/.jpeg/.png/.avif → .webp
 * Affects: homecontent, packages, itineraries, destinations collections
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join('D:/Tripsee2', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
  }
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

/** Convert any local file-path extension to .webp */
function toWebp(val) {
  if (typeof val !== 'string') return val;
  // Skip external URLs and MongoDB API paths
  if (val.startsWith('http') || val.startsWith('/api/')) return val;
  // Skip if already webp
  if (val.toLowerCase().endsWith('.webp')) return val;
  // Replace common image extensions
  return val.replace(/\.(jpg|jpeg|png|avif|gif|bmp|tiff)$/i, '.webp');
}

/** Recursively walk a document object and replace image extensions */
function normalizeDoc(obj, isRoot = false) {
  if (Array.isArray(obj)) return obj.map(item => normalizeDoc(item));
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      // Always preserve _id and other MongoDB internal fields as-is
      if (k === '_id' || k === '__v') {
        result[k] = v;
        continue;
      }
      if (typeof v === 'string' && (
        k === 'image' || k === 'src' || k === 'fallbackImage' ||
        k === 'thumbnail' || k === 'cover' || k === 'photo'
      )) {
        result[k] = toWebp(v);
      } else if (Array.isArray(v) || (v && typeof v === 'object')) {
        result[k] = normalizeDoc(v);
      } else {
        result[k] = v;
      }
    }
    return result;
  }
  return obj;
}

try {
  await client.connect();
  const db = client.db('tripsee');
  console.log('Connected to MongoDB\n');

  const collections = ['homecontent', 'packages', 'itineraries', 'destinations'];
  let totalDocs = 0;

  for (const collName of collections) {
    const coll = db.collection(collName);
    const docs = await coll.find({}).toArray();
    if (!docs.length) {
      console.log(`  ${collName}: empty, skipping`);
      continue;
    }

    let updated = 0;
    for (const doc of docs) {
      const normalized = normalizeDoc(doc);

      // Check if anything changed
      const before = JSON.stringify(doc);
      const after = JSON.stringify(normalized);
      if (before === after) continue;

      // Use updateOne with $set to avoid touching _id
      const { _id, ...fields } = normalized;
      await coll.updateOne({ _id: doc._id }, { $set: fields });
      updated++;
    }

    console.log(`  ${collName}: ${docs.length} docs checked, ${updated} updated`);
    totalDocs += updated;
  }

  console.log(`\nTotal documents updated: ${totalDocs}`);
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await client.close();
}
