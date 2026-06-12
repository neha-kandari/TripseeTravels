import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';

// GET all Vietnam packages
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const isActive = searchParams.get('isActive');
    
    // Build query - always filter by Vietnam destination
    const query: any = { destination: 'vietnam' };
    if (isActive !== null) query.isActive = isActive === 'true';
    
    const packages = await (Package as any).find(query).sort({ createdAt: -1 });
    
    // Transform MongoDB packages to match expected format
    const transformedPackages = packages.map((pkg: any) => ({
      id: pkg._id,
      _id: pkg._id,
      name: pkg.name,
      title: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      days: pkg.days || pkg.duration, // Use days field if available, fallback to duration
      destination: pkg.destination,
      location: pkg.location,
      image: pkg.image,
      category: pkg.category,
      type: pkg.type || pkg.category || 'romantic', // Use type field if available
      hotelRating: pkg.hotelRating || 4, // Use actual hotelRating from database
      features: pkg.features || [],
      highlights: pkg.highlights || [],
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      bestTimeToVisit: pkg.bestTimeToVisit || '',
      isActive: pkg.isActive,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      packages: transformedPackages,
      count: transformedPackages.length
    });
  } catch (error) {
    console.error('Error fetching Vietnam packages:', error);
    return NextResponse.json({ error: 'Failed to fetch Vietnam packages' }, { status: 500 });
  }
}

// POST new Vietnam package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST Vietnam package request body:', body);
    await connectDB();
    
    const {
      name,
      description,
      price,
      duration,
      days, // Add days field
      destination,
      location,
      image,
      category,
      type, // Add type field
      hotelRating, // Add hotelRating field
      features,
      highlights,
      inclusions,
      exclusions,
      bestTimeToVisit,
      isActive
    } = body;
    
    // Create new package
    const newPackage = new Package({
      name,
      description,
      price,
      duration,
      days: days || duration, // Use days field if available, fallback to duration
      destination: destination || 'vietnam',
      location,
      image,
      category,
      type: type || 'Standard', // Add type field
      hotelRating: hotelRating || 4, // Add hotelRating field
      features: features || [],
      highlights: highlights || [],
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      bestTimeToVisit: bestTimeToVisit || '',
      isActive: isActive !== undefined ? isActive : true
    });
    
    const savedPackage = await newPackage.save();
    console.log('Vietnam package saved successfully:', savedPackage._id);
    
    return NextResponse.json({
      success: true,
      package: savedPackage
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating Vietnam package:', error);
    return NextResponse.json({ 
      error: 'Failed to create Vietnam package', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT - Update existing Vietnam package
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('PUT Vietnam package request body:', body);
    await connectDB();
    
    const {
      id,
      name,
      description,
      price,
      duration,
      days, // Add days field
      destination,
      location,
      image,
      category,
      type, // Add type field
      hotelRating, // Add hotelRating field
      features,
      highlights,
      inclusions,
      exclusions,
      bestTimeToVisit,
      isActive
    } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }
    
    const updatedPackage = await (Package as any).findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        duration,
        days: days || duration, // Use days field if available, fallback to duration
        destination: destination || 'vietnam',
        location,
        image,
        category,
        type: type || 'Standard', // Add type field
        hotelRating: hotelRating || 4, // Add hotelRating field
        features: features || [],
        highlights: highlights || [],
        inclusions: inclusions || [],
        exclusions: exclusions || [],
        bestTimeToVisit: bestTimeToVisit || '',
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedPackage) {
      return NextResponse.json({ error: 'Vietnam package not found' }, { status: 404 });
    }
    
    console.log('Vietnam package updated successfully:', updatedPackage._id);
    return NextResponse.json({
      success: true,
      package: updatedPackage
    });
  } catch (error) {
    console.error('Error updating Vietnam package:', error);
    return NextResponse.json({ 
      error: 'Failed to update Vietnam package', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}