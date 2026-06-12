import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';

// GET all romantic packages
export async function GET() {
  try {
    await connectDB();
    
    // Valid romantic package types
    const validRomanticTypes = ['Honeymoon', 'Proposal', 'Candle Night', 'Beach Romance', 'Anniversary', 'Romantic'];
    
    // Fetch romantic packages from MongoDB
    const packages = await Package.find({ 
      category: 'romantic',
      type: { $in: validRomanticTypes }
    }).sort({ createdAt: -1 });
    
    // Transform to match the expected format
    const transformedPackages = packages.map(pkg => ({
      id: pkg._id,
      image: pkg.image,
      days: pkg.duration,
      title: pkg.name,
      location: pkg.destination,
      destination: pkg.destination,
      price: `₹${pkg.price.toLocaleString()}/-`,
      type: pkg.type || 'Romantic', // Use type field or default to 'Romantic'
      hotelRating: 5,
      features: pkg.features || [],
      highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join(' • ') : pkg.highlights || pkg.description,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt
    }));
    
    return NextResponse.json(transformedPackages);
  } catch (error) {
    console.error('Error reading romantic packages:', error);
    return NextResponse.json({ error: 'Failed to fetch romantic packages' }, { status: 500 });
  }
}

// POST new romantic package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDB();
    
    // Validate required fields
    if (!body.title && !body.name) {
      return NextResponse.json({ error: 'Package title is required' }, { status: 400 });
    }
    if (!body.days && !body.duration) {
      return NextResponse.json({ error: 'Package duration is required' }, { status: 400 });
    }
    if (!body.price) {
      return NextResponse.json({ error: 'Package price is required' }, { status: 400 });
    }
    if (!body.destination) {
      return NextResponse.json({ error: 'Package destination is required' }, { status: 400 });
    }
    if (!body.image) {
      return NextResponse.json({ error: 'Package image is required' }, { status: 400 });
    }
    
    // Validate romantic package type
    const validRomanticTypes = ['Honeymoon', 'Proposal', 'Candle Night', 'Beach Romance', 'Anniversary', 'Romantic'];
    if (body.type && !validRomanticTypes.includes(body.type)) {
      return NextResponse.json({ error: 'Invalid romantic package type' }, { status: 400 });
    }
    
    // Create new package in MongoDB
    const packageData = {
      name: body.title || body.name,
      description: body.highlights || body.description,
      price: typeof body.price === 'string' ? parseInt(body.price.replace(/[₹,/-]/g, '')) : body.price,
      duration: body.days || body.duration,
      days: body.days || body.duration, // Both duration and days are required
      destination: body.destination || 'bali',
      location: body.location || body.destination, // Add location field
      image: body.image,
      imageType: 'url', // Set default image type
      category: 'romantic',
      type: body.type || 'Romantic', // Store the package type (Honeymoon, Proposal, etc.)
      hotelRating: body.hotelRating || 5, // Add hotel rating
      features: body.features || [],
      highlights: body.highlights ? body.highlights.split(' • ') : [],
      itinerary: [],
      inclusions: [],
      exclusions: [],
      bestTimeToVisit: '',
      isActive: true
    };
    
    const newPackage = new Package(packageData);
    const savedPackage = await newPackage.save();
    
    // Transform response to match expected format
    const transformedPackage = {
      id: savedPackage._id,
      image: savedPackage.image,
      days: savedPackage.duration,
      title: savedPackage.name,
      location: savedPackage.destination,
      destination: savedPackage.destination,
      price: `₹${savedPackage.price.toLocaleString()}/-`,
      type: savedPackage.type || 'Romantic',
      hotelRating: 5,
      features: savedPackage.features || [],
      highlights: Array.isArray(savedPackage.highlights) ? savedPackage.highlights.join(' • ') : savedPackage.highlights || savedPackage.description,
      createdAt: savedPackage.createdAt,
      updatedAt: savedPackage.updatedAt
    };
    
    return NextResponse.json(transformedPackage, { status: 201 });
  } catch (error) {
    console.error('Error creating romantic package:', error);
    return NextResponse.json({ 
      error: 'Failed to create romantic package', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}