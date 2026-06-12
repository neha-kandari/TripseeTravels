import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';
import { processImageData } from '@/lib/imageUtils';

// MongoDB-based Singapore package routes

// GET all Singapore packages
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const isActive = searchParams.get('isActive');
    
    // Build query - always filter by singapore destination
    const query: any = { destination: 'singapore' };
    if (isActive !== null) query.isActive = isActive === 'true';
    
    const packages = await Package.find(query).sort({ createdAt: -1 });
    
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
      packages: transformedPackages,
      count: transformedPackages.length
    });
  } catch (error) {
    console.error('Error fetching Singapore packages:', error);
    return NextResponse.json({ packages: [], count: 0 });
  }
}

// POST - Create new Singapore package
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('POST request for Singapore package:', body);

    // Process image data if provided
    if (body.image) {
      body.image = await processImageData(body.image, 'singapore');
      console.log('Processed image path:', body.image);
    }

    // Set destination to singapore
    body.destination = 'singapore';

    // Create new package
    const newPackage = new Package(body);
    const savedPackage = await newPackage.save();

    console.log('Singapore package created successfully:', savedPackage._id);
    return NextResponse.json(savedPackage, { status: 201 });
  } catch (error) {
    console.error('Error creating Singapore package:', error);
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}

// PUT - Update existing Singapore package
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('PUT request for Singapore package:', body);

    // Process image data if provided
    if (body.image) {
      body.image = await processImageData(body.image, 'singapore');
      console.log('Processed image path:', body.image);
    }

    const { id, ...updateData } = body;
    
    // Update the package
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    console.log('Singapore package updated successfully:', updatedPackage._id);
    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('Error updating Singapore package:', error);
    return NextResponse.json(
      { error: 'Failed to update package' },
      { status: 500 }
    );
  }
}

// DELETE - Delete all Singapore packages (bulk delete)
export async function DELETE() {
  try {
    await connectDB();
    
    console.log('DELETE request for all Singapore packages');
    
    // Delete all Singapore packages
    const result = await Package.deleteMany({ destination: 'singapore' });
    
    console.log(`Deleted ${result.deletedCount} Singapore packages successfully`);
    return NextResponse.json({ 
      message: `Successfully deleted ${result.deletedCount} packages`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting Singapore packages:', error);
    return NextResponse.json(
      { error: 'Failed to delete packages' },
      { status: 500 }
    );
  }
} 