import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';

// GET single romantic package
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const validRomanticTypes = ['Honeymoon', 'Proposal', 'Candle Night', 'Beach Romance', 'Anniversary', 'Romantic'];
    const packageData = await Package.findOne({ 
      _id: id, 
      category: 'romantic',
      type: { $in: validRomanticTypes }
    });
    
    if (!packageData) {
      return NextResponse.json({ error: 'Romantic package not found' }, { status: 404 });
    }
    
    // Transform to match expected format
    const transformedPackage = {
      id: packageData._id,
      image: packageData.image,
      days: packageData.duration,
      title: packageData.name,
      location: packageData.destination,
      destination: packageData.destination,
      price: `₹${packageData.price.toLocaleString()}/-`,
      type: packageData.type || 'Romantic',
      hotelRating: 5,
      features: packageData.features || [],
      highlights: Array.isArray(packageData.highlights) ? packageData.highlights.join(' • ') : packageData.highlights || packageData.description,
      createdAt: packageData.createdAt,
      updatedAt: packageData.updatedAt
    };
    
    return NextResponse.json(transformedPackage);
  } catch (error) {
    console.error('Error fetching romantic package:', error);
    return NextResponse.json({ error: 'Failed to fetch romantic package' }, { status: 500 });
  }
}

// PUT update romantic package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    await connectDB();
    
    const { id } = await params;
    const validRomanticTypes = ['Honeymoon', 'Proposal', 'Candle Night', 'Beach Romance', 'Anniversary', 'Romantic'];
    
    // Validate the type being updated
    if (body.type && !validRomanticTypes.includes(body.type)) {
      return NextResponse.json({ error: 'Invalid romantic package type' }, { status: 400 });
    }
    
    // Update package in MongoDB
    const updatedPackage = await Package.findOneAndUpdate(
      { _id: id, category: 'romantic', type: { $in: validRomanticTypes } },
      {
        name: body.title || body.name,
        description: body.highlights || body.description,
        price: typeof body.price === 'string' ? parseInt(body.price.replace(/[₹,/-]/g, '')) : body.price,
        duration: body.days || body.duration,
        days: body.days || body.duration, // Both duration and days are required
        destination: body.destination || 'bali',
        location: body.location || body.destination, // Add location field
        image: body.image,
        imageType: 'url', // Set default image type
        category: 'romantic',
        type: body.type || 'Romantic',
        hotelRating: body.hotelRating || 5, // Add hotel rating
        features: body.features || [],
        highlights: body.highlights ? body.highlights.split(' • ') : [],
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    // Transform response to match expected format
    const transformedPackage = {
      id: updatedPackage._id,
      image: updatedPackage.image,
      days: updatedPackage.duration,
      title: updatedPackage.name,
      location: updatedPackage.destination,
      destination: updatedPackage.destination,
      price: `₹${updatedPackage.price.toLocaleString()}/-`,
      type: updatedPackage.type || 'Romantic',
      hotelRating: 5,
      features: updatedPackage.features || [],
      highlights: Array.isArray(updatedPackage.highlights) ? updatedPackage.highlights.join(' • ') : updatedPackage.highlights || updatedPackage.description,
      createdAt: updatedPackage.createdAt,
      updatedAt: updatedPackage.updatedAt
    };
    
    return NextResponse.json(transformedPackage);
  } catch (error) {
    console.error('Error updating romantic package:', error);
    return NextResponse.json({ error: 'Failed to update romantic package' }, { status: 500 });
  }
}

// DELETE romantic package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const validRomanticTypes = ['Honeymoon', 'Proposal', 'Candle Night', 'Beach Romance', 'Anniversary', 'Romantic'];
    const packageData = await Package.findOneAndDelete({ 
      _id: id, 
      category: 'romantic',
      type: { $in: validRomanticTypes }
    });
    
    if (!packageData) {
      return NextResponse.json({ error: 'Romantic package not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Package deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting romantic package:', error);
    return NextResponse.json({ error: 'Failed to delete romantic package' }, { status: 500 });
  }
}