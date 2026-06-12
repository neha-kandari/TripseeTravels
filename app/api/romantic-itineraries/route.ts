import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';
import Package from '@/lib/models/Package';

// GET all romantic itineraries for public website
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    
    // Build query - look for itineraries that are either:
    // 1. Category 'romantic' (for backward compatibility)
    // 2. Or have a packageId that matches a romantic package
    let query: any = { isActive: true };
    
    if (packageId) {
      // If packageId is provided, find itinerary for that specific package
      query.packageId = packageId;
    } else {
      // If no packageId, find only romantic hideaway itineraries
      // We need to find itineraries whose packages have category: 'romantic' AND valid romantic types
      const validRomanticTypes = ['Honeymoon', 'Proposal', 'Candle Night', 'Beach Romance', 'Anniversary', 'Romantic'];
      const romanticPackages = await Package.find({ 
        category: 'romantic', 
        isActive: true,
        type: { $in: validRomanticTypes }
      }).select('_id');
      const romanticPackageIds = romanticPackages.map(pkg => pkg._id.toString());
      
      // Only show itineraries that are linked to these specific romantic packages
      // (the same packages that are shown on the romantic hideaway page)
      if (romanticPackageIds.length > 0) {
        query.packageId = { $in: romanticPackageIds };
      } else {
        // If no romantic packages found, return empty array
        query.packageId = { $in: [] };
      }
    }
    
    const itineraries = await Itinerary.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(itineraries);
  } catch (error) {
    console.error('Error reading romantic itineraries:', error);
    return NextResponse.json({ error: 'Failed to fetch romantic itineraries' }, { status: 500 });
  }
}
