import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';

// GET all Andaman packages
export async function GET() {
  try {
    await connectDB();
    
    const packages = await (Package as any).find({ destination: 'andaman' }).sort({ createdAt: -1 });
    
    // Transform packages for frontend
    const transformedPackages = packages.map(pkg => ({
      id: pkg._id,
      _id: pkg._id,
      name: pkg.name,
      title: pkg.name,
      description: pkg.description,
      duration: pkg.duration,
      days: pkg.duration,
      price: pkg.price,
      location: pkg.location,
      destination: pkg.destination,
      category: pkg.category,
      type: pkg.type || pkg.category || 'Standard',
      hotelRating: pkg.hotelRating,
      features: pkg.features || [],
      highlights: pkg.highlights || pkg.description,
      image: pkg.image,
      images: pkg.images || [],
      isActive: pkg.isActive,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt
    }));
    
    return NextResponse.json({ packages: transformedPackages });
  } catch (error) {
    console.error('Error fetching Andaman packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

// POST new Andaman package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST request for Andaman package:', body);
    
    await connectDB();
    
    // Process image data if provided
    let processedImage = body.image;
    if (body.image && body.image.startsWith('data:image')) {
      // Handle base64 image data
      processedImage = body.image;
    }
    
    // Create new package
    const packageData = {
      ...body,
      destination: 'andaman', // Force destination to andaman
      image: processedImage,
      isActive: true
    };
    
    const newPackage = new (Package as any)(packageData);
    const savedPackage = await newPackage.save();
    
    console.log('Andaman package created successfully:', savedPackage);
    return NextResponse.json(savedPackage, { status: 201 });
  } catch (error) {
    console.error('Error creating Andaman package:', error);
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}