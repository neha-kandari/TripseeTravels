import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../../lib/mongoose';
import Package from '../../../../../../lib/models/Package';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch packages from MongoDB
    const packages = await Package.find({ destination: 'dubai' }).sort({ createdAt: -1 });
    
    // Transform packages to match expected format
    const transformedPackages = packages.map((pkg: any) => ({
      id: pkg._id.toString(),
      image: pkg.image,
      days: pkg.days || pkg.duration, // Use days field if available, fallback to duration
      title: pkg.name,
      location: pkg.location || 'Dubai',
      price: `₹${pkg.price.toLocaleString()}/-`,
      type: pkg.type || pkg.category || 'Luxury', // Use type field if available
      hotelRating: pkg.hotelRating || 4, // Use actual hotelRating from database
      features: pkg.features || [],
      highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join(' • ') : pkg.highlights || pkg.description,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt
    }));
    
    console.log('Dubai packages returned:', transformedPackages.length);
    return NextResponse.json(transformedPackages);
  } catch (error) {
    console.error('Error fetching Dubai packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('POST request for Dubai package:', body);

    const newPackage = new Package({
      name: body.name,
      description: body.description,
      price: body.price,
      duration: body.duration,
      days: body.days || body.duration, // Use days field if available, fallback to duration
      destination: 'dubai',
      image: body.image,
      location: body.location,
      category: body.category || 'Luxury',
      type: body.type || 'Standard', // Add type field
      hotelRating: body.hotelRating || 4, // Add hotelRating field
      features: body.features || [],
      highlights: body.highlights || [],
      itinerary: body.itinerary || [],
      inclusions: body.inclusions || [],
      exclusions: body.exclusions || [],
      bestTimeToVisit: body.bestTimeToVisit || '',
      isActive: body.isActive !== undefined ? body.isActive : true
    });

    const savedPackage = await newPackage.save();
    console.log('Dubai package created successfully:', savedPackage._id);
    
    return NextResponse.json(savedPackage);
  } catch (error) {
    console.error('Error creating Dubai package:', error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('PUT request for Dubai package:', body);

    const updatedPackage = await Package.findByIdAndUpdate(
      body.id,
      {
        name: body.name,
        description: body.description,
        price: body.price,
        duration: body.duration,
        days: body.days || body.duration, // Use days field if available, fallback to duration
        image: body.image,
        location: body.location,
        category: body.category,
        type: body.type || 'Standard', // Add type field
        hotelRating: body.hotelRating || 4, // Add hotelRating field
        features: body.features,
        highlights: body.highlights,
        itinerary: body.itinerary,
        inclusions: body.inclusions,
        exclusions: body.exclusions,
        bestTimeToVisit: body.bestTimeToVisit,
        isActive: body.isActive
      },
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    console.log('Dubai package updated successfully:', updatedPackage._id);
    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('Error updating Dubai package:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
} 