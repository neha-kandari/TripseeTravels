import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET all Singapore itineraries or filter by packageId
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    
    // Build query
    const query: any = { destination: 'singapore' };
    if (packageId) {
      query.packageId = packageId;
    }
    
    const itineraries = await Itinerary.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({
      itineraries,
      count: itineraries.length
    });
  } catch (error) {
    console.error('Error fetching Singapore itineraries:', error);
    return NextResponse.json({ error: 'Failed to fetch Singapore itineraries' }, { status: 500 });
  }
}

// POST new Singapore itinerary
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Set destination to singapore
    body.destination = 'singapore';
    
    // Create new itinerary
    const newItinerary = new Itinerary(body);
    const savedItinerary = await newItinerary.save();
    
    console.log('Singapore itinerary created successfully:', savedItinerary._id);
    return NextResponse.json(savedItinerary, { status: 201 });
  } catch (error) {
    console.error('Error creating Singapore itinerary:', error);
    return NextResponse.json({ error: 'Failed to create Singapore itinerary' }, { status: 500 });
  }
} 