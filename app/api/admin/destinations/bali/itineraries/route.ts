import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET all Bali itineraries or filter by packageId
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    
    // Build query for Bali itineraries
    const query: any = { destination: 'bali' };
    if (packageId) {
      query.packageId = packageId;
    }
    
    // Fetch itineraries from MongoDB
    const itineraries = await Itinerary.find(query).sort({ createdAt: -1 });
    
    // Set cache control headers to ensure fresh data
    const response = NextResponse.json({
      success: true,
      packages: itineraries, // Use 'packages' key to match frontend expectation
      itineraries,
      count: itineraries.length
    });
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching Bali itineraries:', error);
    return NextResponse.json({ error: 'Failed to fetch Bali itineraries' }, { status: 500 });
  }
}

// POST create new Bali itinerary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDB();
    
    // Create new itinerary
    const newItinerary = new Itinerary({
      ...body,
      destination: 'bali' // Always set destination to bali for this endpoint
    });
    
    const savedItinerary = await newItinerary.save();
    
    return NextResponse.json({
      success: true,
      itinerary: savedItinerary
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating Bali itinerary:', error);
    return NextResponse.json({ error: 'Failed to create Bali itinerary' }, { status: 500 });
  }
} 