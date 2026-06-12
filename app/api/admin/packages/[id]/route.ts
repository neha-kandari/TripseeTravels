import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';
import { processImageData } from '@/lib/imageUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // Validate ID before processing
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json({ error: 'Invalid package ID' }, { status: 400 });
    }
    
    // Find package in MongoDB
    const packageData = await (Package as any).findById(id).exec();
    
    if (!packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    // Transform package data to match expected format
    const transformedPackage = {
      id: packageData._id.toString(), // Convert ObjectId to string
      name: packageData.name,
      title: packageData.name,
      description: packageData.description,
      price: packageData.price.toLocaleString(),
      duration: packageData.duration,
      days: packageData.days || packageData.duration,
      destination: packageData.destination,
      location: packageData.location,
      image: packageData.image,
      category: packageData.category || 'romantic',
      type: packageData.type || packageData.category || 'romantic',
      hotelRating: packageData.hotelRating || 4,
      features: packageData.features || [],
      highlights: Array.isArray(packageData.highlights) ? packageData.highlights.join(' • ') : packageData.highlights || packageData.description,
      itinerary: packageData.itinerary || [],
      inclusions: packageData.inclusions || [],
      exclusions: packageData.exclusions || [],
      bestTimeToVisit: packageData.bestTimeToVisit || '',
      isActive: packageData.isActive,
      createdAt: packageData.createdAt,
      updatedAt: packageData.updatedAt
    };
    
    return NextResponse.json({ package: transformedPackage });
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    console.log('PUT request received:', body);
    const { 
      name, 
      description, 
      price, 
      duration, 
      days, // Add days field
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
      type, // Add type field
      hotelRating, // Add hotelRating field
      isActive 
    } = body;

    await connectDB();

    const { id } = await params;
    // Find existing package
    const existingPackage = await (Package as any).findById(id).exec();
    if (!existingPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // Process image data if it's new
    let processedImage = existingPackage.image;
    if (image && image !== existingPackage.image) {
      processedImage = await processImageData(image, destination, id);
    }

    // Update package
    const updatedPackage = await (Package as any).findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        duration,
        days: days || duration, // Use days if provided, fallback to duration
        destination,
        location,
        image: processedImage,
        imageType: processedImage.startsWith('/api/images/') ? 'mongodb' : 'url',
        features: features || [],
        itinerary: itinerary || [],
        inclusions: inclusions || [],
        exclusions: exclusions || [],
        highlights: highlights || [],
        bestTimeToVisit: bestTimeToVisit || '',
        category: category || 'romantic',
        type: type || 'Standard', // Add type field
        hotelRating: hotelRating || 4, // Add hotelRating field
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date()
      },
      { new: true }
    ).exec();

    return NextResponse.json({ 
      success: true, 
      package: updatedPackage 
    });
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // Validate ID before processing
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json({ error: 'Invalid package ID' }, { status: 400 });
    }
    
    const packageData = await (Package as any).findByIdAndDelete(id).exec();
    
    if (!packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // If the package had a MongoDB image, delete it
    if (packageData.imageType === 'mongodb' && packageData.imageId) {
      try {
        const { deleteImageFromMongoDB } = await import('@/lib/imageUtils');
        await deleteImageFromMongoDB(packageData.imageId);
      } catch (error) {
        console.error('Error deleting associated image:', error);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Package deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}