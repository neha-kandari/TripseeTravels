import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';
import { processImageData } from '@/lib/imageUtils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    
    // Build query
    const query: any = {};
    if (destination) query.destination = destination;
    if (category) query.category = category;
    if (isActive !== null) query.isActive = isActive === 'true';
    
    const mongoPackages = await (Package as any).find(query).sort({ createdAt: -1 }).lean().exec();
    
    // Transform MongoDB packages to match frontend expectations
    const transformedMongoPackages = mongoPackages.map(pkg => ({
      id: pkg._id.toString(), // Convert ObjectId to string
      title: pkg.name, // Map 'name' to 'title'
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toLocaleString(),
      days: pkg.days || pkg.duration, // Use 'days' field if available, fallback to 'duration'
      duration: pkg.duration,
      destination: pkg.destination,
      location: pkg.location,
      image: pkg.image,
      category: pkg.category || 'romantic',
      type: pkg.type || pkg.category || 'romantic', // Use 'type' field if available
      hotelRating: pkg.hotelRating || 4, // Use 'hotelRating' field if available, default to 4
      features: pkg.features || [],
      highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join(' • ') : pkg.highlights || pkg.description,
      itinerary: pkg.itinerary || [],
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      bestTimeToVisit: pkg.bestTimeToVisit || '',
      isActive: pkg.isActive,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt
    }));

    // Return only MongoDB packages (no hardcoded packages)
    return NextResponse.json({ packages: transformedMongoPackages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    // Return empty packages instead of 500 so destination pages don't break
    return NextResponse.json({ packages: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      name, 
      description, 
      price, 
      duration, 
      days, // New field for duration display
      destination, 
      location,
      image, 
      features, 
      itinerary, 
      inclusions, 
      exclusions, 
      highlights, 
      bestTimeToVisit, 
      category,
      type, // New field for package type
      hotelRating // New field for hotel rating
    } = body;

    // Fast validation
    if (!name || !price || !destination) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, price, destination' 
      }, { status: 400 });
    }

    await connectDB();

    // Process image data (optimized)
    const processedImage = await processImageData(image, destination);

    // Create new package with optimized data structure
    const packageData = {
      name,
      description,
      price: Number(price),
      duration: Number(duration) || 1,
      days: Number(days) || Number(duration) || 1,
      destination,
      location,
      image: processedImage,
      imageType: processedImage.startsWith('/api/images/') ? 'mongodb' : 'url',
      features: Array.isArray(features) ? features : [],
      itinerary: [], // Initialize as empty array - will be populated later
      inclusions: Array.isArray(inclusions) ? inclusions : [],
      exclusions: Array.isArray(exclusions) ? exclusions : [],
      highlights: Array.isArray(highlights) ? highlights : [],
      bestTimeToVisit: bestTimeToVisit || '',
      category: category || 'romantic',
      type: type || 'Standard',
      hotelRating: Number(hotelRating) || 4,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newPackage = new Package(packageData);
    const savedPackage = await newPackage.save();

    return NextResponse.json({ 
      success: true, 
      package: {
        id: savedPackage._id,
        name: savedPackage.name,
        destination: savedPackage.destination,
        price: savedPackage.price,
        days: savedPackage.days,
        type: savedPackage.type,
        hotelRating: savedPackage.hotelRating
      }
    });
  } catch (error) {
    console.error('Error creating package:', error);
    
    return NextResponse.json({ 
      error: 'Failed to create package',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}