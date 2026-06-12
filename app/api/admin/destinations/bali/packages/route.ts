import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';
import { processImageData } from '@/lib/imageUtils';

// MongoDB-based Bali package routes

// GET all Bali packages
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const isActive = searchParams.get('isActive');
    
    // Build query - always filter by Bali destination
    const query: any = { destination: 'bali' };
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
    console.error('Error fetching Bali packages:', error);
    return NextResponse.json({ error: 'Failed to fetch Bali packages' }, { status: 500 });
  }
}

// POST new package to Bali
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST Bali package request body:', body);
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
    
    // Process image data if provided
    const processedImage = await processImageData(image, destination || 'bali');
    
    // Create new package
    const newPackage = new Package({
      name,
      description,
      price,
      duration,
      days: days || duration, // Use days field if available, fallback to duration
      destination: destination || 'bali',
      location,
      image: processedImage,
      imageType: processedImage.startsWith('/api/images/') ? 'mongodb' : 'url',
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
    console.log('Bali package saved successfully:', savedPackage._id);
    
    return NextResponse.json({
      success: true,
      package: savedPackage
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating Bali package:', error);
    return NextResponse.json({ 
      error: 'Failed to create Bali package', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT - Update existing package
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('PUT Bali package request body:', body);
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
    
    // Process image data if provided
    let processedImage = image;
    if (image && image !== '') {
      processedImage = await processImageData(image, destination || 'bali');
    }
    
    const updatedPackage = await (Package as any).findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        duration,
        days: days || duration, // Use days field if available, fallback to duration
        destination: destination || 'bali',
        location,
        image: processedImage,
        imageType: processedImage && processedImage.startsWith('/api/images/') ? 'mongodb' : 'url',
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
      return NextResponse.json({ error: 'Bali package not found' }, { status: 404 });
    }
    
    console.log('Bali package updated successfully:', updatedPackage._id);
    return NextResponse.json({
      success: true,
      package: updatedPackage
    });
  } catch (error) {
    console.error('Error updating Bali package:', error);
    return NextResponse.json({ 
      error: 'Failed to update Bali package', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Delete package
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }
    
    console.log('Deleting Bali package with ID:', id);
    await connectDB();
    
    const deletedPackage = await (Package as any).findByIdAndDelete(id);
    
    if (!deletedPackage) {
      return NextResponse.json({ error: 'Bali package not found' }, { status: 404 });
    }

    // If the package had a MongoDB image, delete it
    if (deletedPackage.imageType === 'mongodb' && deletedPackage.imageId) {
      try {
        const { deleteImageFromMongoDB } = await import('@/lib/imageUtils');
        await deleteImageFromMongoDB(deletedPackage.imageId);
      } catch (error) {
        console.error('Error deleting associated image:', error);
      }
    }
    
    console.log('Bali package deleted successfully:', id);
    return NextResponse.json({ 
      success: true,
      message: 'Package deleted successfully',
      deletedPackage: deletedPackage
    });
  } catch (error) {
    console.error('Error deleting Bali package:', error);
    return NextResponse.json({ 
      error: 'Failed to delete Bali package',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 