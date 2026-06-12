import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';
import romanticPackagesData from '@/app/data/romantic-packages.json';

function transformJsonPackages() {
  return (romanticPackagesData as any[]).map((pkg, index) => ({
    id: pkg.id || String(index),
    image: pkg.image,
    days: pkg.duration,
    title: pkg.title,
    location: pkg.destination,
    destination: pkg.destination,
    price: `₹${Number(pkg.price).toLocaleString('en-IN')}/-`,
    type: pkg.type || 'Romantic',
    hotelRating: pkg.hotelRating || 5,
    features: pkg.inclusions || [],
    highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join(' • ') : pkg.highlights || pkg.description || '',
  }));
}

// GET all romantic packages for public website
export async function GET() {
  try {
    await connectDB();

    const validRomanticTypes = ['Honeymoon', 'Proposal', 'Candle Night', 'Beach Romance', 'Anniversary', 'Romantic'];

    const packages = await Package.find({
      category: 'romantic',
      isActive: true,
      type: { $in: validRomanticTypes }
    }).sort({ createdAt: -1 });

    if (packages.length > 0) {
      const transformedPackages = packages.map(pkg => ({
        id: pkg._id,
        image: pkg.image,
        days: pkg.duration,
        title: pkg.name,
        location: pkg.destination,
        destination: pkg.destination,
        price: `₹${pkg.price.toLocaleString('en-IN')}/-`,
        type: pkg.type || 'Romantic',
        hotelRating: 5,
        features: pkg.features || [],
        highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join(' • ') : pkg.highlights || pkg.description,
      }));
      return NextResponse.json(transformedPackages);
    }

    // No packages in DB yet — serve from JSON
    return NextResponse.json(transformJsonPackages());
  } catch (error) {
    console.error('Error fetching romantic packages from DB, using JSON fallback:', error);
    return NextResponse.json(transformJsonPackages());
  }
}
