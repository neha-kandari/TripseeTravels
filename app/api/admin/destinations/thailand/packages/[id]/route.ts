import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';
import { processImageData } from '@/lib/imageUtils';

// GET single Thailand package by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const packageId = params.id;
    const mongoPackage = await Package.findOne({ _id: packageId, destination: 'thailand' });
    
    if (!mongoPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    // Transform MongoDB package to match frontend expectations
    const transformedPackage = {
      id: mongoPackage._id,
      title: mongoPackage.name,
      name: mongoPackage.name,
      description: mongoPackage.description,
      price: `₹${mongoPackage.price.toLocaleString()}/-`,
      days: mongoPackage.days || mongoPackage.duration,
      duration: mongoPackage.duration,
      destination: mongoPackage.destination,
      location: mongoPackage.location,
      image: mongoPackage.image,
      category: mongoPackage.category || 'romantic',
      type: mongoPackage.type || mongoPackage.category || 'Standard',
      hotelRating: mongoPackage.hotelRating || 4,
      features: mongoPackage.features || [],
      highlights: Array.isArray(mongoPackage.highlights) ? mongoPackage.highlights.join(' • ') : mongoPackage.highlights || mongoPackage.description,
      itinerary: mongoPackage.itinerary || [],
      inclusions: mongoPackage.inclusions || [],
      exclusions: mongoPackage.exclusions || [],
      bestTimeToVisit: mongoPackage.bestTimeToVisit || '',
      isActive: mongoPackage.isActive,
      createdAt: mongoPackage.createdAt,
      updatedAt: mongoPackage.updatedAt
    };

    return NextResponse.json(transformedPackage);
  } catch (error) {
    console.error('Error fetching Thailand package:', error);
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 }
    );
  }
}

// PUT - Update existing Thailand package by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    console.log('PUT Thailand package request body:', body);
    
    const packageId = params.id;
    const { 
      name, 
      description, 
      price, 
      duration, 
      days,
      destination = 'thailand', 
      location,
      image, 
      features, 
      itinerary, 
      inclusions, 
      exclusions, 
      highlights, 
      bestTimeToVisit, 
      category,
      type,
      hotelRating
    } = body;
    
    await connectDB();

    // Process image data if provided
    let processedImage = image;
    if (image) {
      processedImage = await processImageData(image, destination);
    }

    // Find and update the package
    const updateData: any = {
      name,
      description,
      price,
      duration,
      days: days || duration,
      destination,
      location,
      features: features || [],
      itinerary: itinerary || [],
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      highlights: highlights || [],
      bestTimeToVisit: bestTimeToVisit || '',
      category: category || 'romantic',
      type: type || 'Standard',
      hotelRating: hotelRating || 4,
      isActive: true
    };

    if (processedImage) {
      updateData.image = processedImage;
      updateData.imageType = processedImage.startsWith('/api/images/') ? 'mongodb' : 'url';
    }
    
    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    // Transform for response
    const transformedPackage = {
      id: updatedPackage._id,
      title: updatedPackage.name,
      name: updatedPackage.name,
      description: updatedPackage.description,
      price: `₹${updatedPackage.price.toLocaleString()}/-`,
      days: updatedPackage.days || updatedPackage.duration,
      duration: updatedPackage.duration,
      destination: updatedPackage.destination,
      location: updatedPackage.location,
      image: updatedPackage.image,
      category: updatedPackage.category,
      type: updatedPackage.type,
      hotelRating: updatedPackage.hotelRating,
      features: updatedPackage.features,
      highlights: Array.isArray(updatedPackage.highlights) ? updatedPackage.highlights.join(' • ') : updatedPackage.highlights,
      itinerary: updatedPackage.itinerary,
      inclusions: updatedPackage.inclusions,
      exclusions: updatedPackage.exclusions,
      bestTimeToVisit: updatedPackage.bestTimeToVisit,
      isActive: updatedPackage.isActive,
      createdAt: updatedPackage.createdAt,
      updatedAt: updatedPackage.updatedAt
    };

    return NextResponse.json(transformedPackage);
  } catch (error) {
    console.error('Error updating Thailand package:', error);
    return NextResponse.json(
      { error: 'Failed to update package' },
      { status: 500 }
    );
  }
}

// DELETE - Delete Thailand package by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const packageId = params.id;
    console.log('DELETE Thailand package ID:', packageId);
    
    await connectDB();
    
    const deletedPackage = await Package.findByIdAndDelete(packageId);
    
    if (!deletedPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting Thailand package:', error);
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    );
  }
}