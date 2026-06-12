import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';
import { processImageData } from '@/lib/imageUtils';

// GET - Fetch a specific package
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    await connectDB();
    const { packageId } = await params;
    
    if (!packageId || packageId === 'undefined' || packageId === 'null') {
      return NextResponse.json({ error: 'Invalid package ID' }, { status: 400 });
    }

    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const transformedPackage = {
      id: packageData._id,
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

    return NextResponse.json(transformedPackage);
  } catch (error) {
    console.error('Error fetching Vietnam package:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}

// PUT - Update a specific package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    const body = await request.json();
    const {
      name, description, price, duration, days, destination, location, image,
      features, itinerary, inclusions, exclusions, highlights, bestTimeToVisit,
      category, type, hotelRating, isActive
    } = body;

    await connectDB();
    const { packageId } = await params;
    
    if (!packageId || packageId === 'undefined' || packageId === 'null') {
      return NextResponse.json({ error: 'Invalid package ID' }, { status: 400 });
    }

    const existingPackage = await Package.findById(packageId);
    if (!existingPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    let processedImage = existingPackage.image;
    if (image && image !== existingPackage.image) {
      processedImage = await processImageData(image, destination, packageId);
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      {
        name,
        description,
        price,
        duration,
        days: days || duration,
        destination: destination || 'vietnam',
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
        type: type || 'Standard',
        hotelRating: hotelRating || 4,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json({ success: true, package: updatedPackage });
  } catch (error) {
    console.error('Error updating Vietnam package:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

// DELETE - Delete a specific package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    await connectDB();
    const { packageId } = await params;
    
    if (!packageId || packageId === 'undefined' || packageId === 'null') {
      return NextResponse.json({ error: 'Invalid package ID' }, { status: 400 });
    }

    const packageData = await Package.findByIdAndDelete(packageId);
    if (!packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // Clean up associated image if it's stored in MongoDB
    if (packageData.imageType === 'mongodb' && packageData.imageId) {
      try {
        const { deleteImageFromMongoDB } = await import('@/lib/imageUtils');
        await deleteImageFromMongoDB(packageData.imageId);
      } catch (error) {
        console.error('Error deleting associated image:', error);
      }
    }

    return NextResponse.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting Vietnam package:', error);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}
