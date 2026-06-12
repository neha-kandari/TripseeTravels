import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';
import { processImageData } from '@/lib/imageUtils';

export async function GET() {
  try {
    await connectDB();
    
    const mongoPackages = await Package.find({ destination: 'maldives' }).sort({ createdAt: -1 });
    
    // Transform MongoDB packages to match frontend expectations
    const transformedPackages = mongoPackages.map(pkg => ({
      id: pkg._id,
      title: pkg.name,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toLocaleString(),
      days: pkg.days || pkg.duration,
      duration: pkg.duration,
      destination: pkg.destination,
      location: pkg.location,
      image: pkg.image,
      category: pkg.category || 'romantic',
      type: pkg.type || pkg.category || 'romantic',
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

    console.log('Maldives packages returned:', transformedPackages.length);
    return NextResponse.json(transformedPackages);
  } catch (error) {
    console.error('Error fetching Maldives packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST request for Maldives package:', body);
    
    const { 
      name, 
      description, 
      price, 
      duration, 
      days,
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
      destination: 'maldives', // Force destination to maldives
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
    
    console.log('Maldives package created successfully:', savedPackage);
    return NextResponse.json(savedPackage);
  } catch (error) {
    console.error('Error creating Maldives package:', error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('PUT request for Maldives package:', body);

    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }

    await connectDB();

    // Process image data if provided
    if (updateData.image) {
      updateData.image = await processImageData(updateData.image, 'maldives');
    }

    // Update the package
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        destination: 'maldives', // Ensure destination is maldives
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    console.log('Maldives package updated successfully:', updatedPackage);
    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('Error updating Maldives package:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
} 