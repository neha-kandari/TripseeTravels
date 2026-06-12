import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';
import { processImageData } from '@/lib/imageUtils';

// GET all Thailand packages
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    
    // Build query
    const query: any = { destination: 'thailand' };
    if (packageId) query._id = packageId;
    
    const mongoPackages = await (Package as any).find(query).sort({ createdAt: -1 }).exec();
    
    // Transform MongoDB packages to match frontend expectations
    const transformedPackages = mongoPackages.map(pkg => ({
      id: pkg._id,
      title: pkg.name,
      name: pkg.name,
      description: pkg.description,
      price: `₹${pkg.price.toLocaleString()}/-`,
      days: pkg.days || pkg.duration,
      duration: pkg.duration,
      destination: pkg.destination,
      location: pkg.location,
      image: pkg.image,
      category: pkg.category || 'romantic',
      type: pkg.type || pkg.category || 'Standard',
      hotelRating: pkg.hotelRating || 4,
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

    return NextResponse.json({ packages: transformedPackages });
  } catch (error) {
    console.error('Error fetching Thailand packages:', error);
    return NextResponse.json({ packages: [] });
  }
}

// POST new Thailand package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST Thailand package request body:', body);
    
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

    // Process image data
    const processedImage = await processImageData(image, destination);
      
      // Create new package
    const packageData = {
      name,
      description,
      price,
      duration,
      days: days || duration,
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
      type: type || 'Standard',
      hotelRating: hotelRating || 4,
      isActive: true
    };
    
    const newPackage = new Package(packageData);
    const savedPackage = await newPackage.save();
    
    // Transform for response
    const transformedPackage = {
      id: savedPackage._id,
      title: savedPackage.name,
      name: savedPackage.name,
      description: savedPackage.description,
      price: `₹${savedPackage.price.toLocaleString()}/-`,
      days: savedPackage.days || savedPackage.duration,
      duration: savedPackage.duration,
      destination: savedPackage.destination,
      location: savedPackage.location,
      image: savedPackage.image,
      category: savedPackage.category,
      type: savedPackage.type,
      hotelRating: savedPackage.hotelRating,
      features: savedPackage.features,
      highlights: Array.isArray(savedPackage.highlights) ? savedPackage.highlights.join(' • ') : savedPackage.highlights,
      itinerary: savedPackage.itinerary,
      inclusions: savedPackage.inclusions,
      exclusions: savedPackage.exclusions,
      bestTimeToVisit: savedPackage.bestTimeToVisit,
      isActive: savedPackage.isActive,
      createdAt: savedPackage.createdAt,
      updatedAt: savedPackage.updatedAt
    };

    return NextResponse.json(transformedPackage, { status: 201 });
  } catch (error) {
    console.error('Error creating Thailand package:', error);
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}

// PUT - Update existing Thailand package
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('PUT Thailand package request body:', body);
    
    const { 
      id,
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
    
    const updatedPackage = await (Package as any).findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).exec();
    
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

// DELETE - Delete Thailand package
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('DELETE Thailand package request body:', body);
    
    const { id } = body;
    
    await connectDB();
    
    const deletedPackage = await (Package as any).findByIdAndDelete(id).exec();
    
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