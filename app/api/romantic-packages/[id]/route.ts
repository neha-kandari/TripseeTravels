import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';

// GET single romantic package for public website
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
      isActive: true,
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
