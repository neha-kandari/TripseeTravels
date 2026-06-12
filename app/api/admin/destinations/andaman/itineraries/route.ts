import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET all Andaman itineraries or filter by packageId
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    
    // Build query
    const query: any = { destination: 'andaman' };
    if (packageId) {
      query.packageId = packageId;
    }
    
    const itineraries = await Itinerary.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ itineraries });
  } catch (error) {
    console.error('Error fetching Andaman itineraries:', error);
    return NextResponse.json({ error: 'Failed to fetch itineraries' }, { status: 500 });
  }
}

// POST new Andaman itinerary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST request for Andaman itinerary:', body);
    
    await connectDB();
    
    // Create new itinerary
    const itineraryData = {
      ...body,
      destination: 'andaman', // Force destination to andaman
      isActive: true
    };
    
    const newItinerary = new Itinerary(itineraryData);
    const savedItinerary = await newItinerary.save();
    
    console.log('Andaman itinerary created successfully:', savedItinerary);
    return NextResponse.json(savedItinerary, { status: 201 });
  } catch (error) {
    console.error('Error creating Andaman itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to create itinerary' },
      { status: 500 }
    );
  }
}