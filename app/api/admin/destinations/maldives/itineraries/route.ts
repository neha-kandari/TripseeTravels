import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET all Maldives itineraries or filter by packageId
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    
    // Build query
    const query: any = { destination: 'maldives' };
    if (packageId) {
      query.packageId = packageId;
    }
    
    const itineraries = await Itinerary.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ itineraries });
  } catch (error) {
    console.error('Error fetching Maldives itineraries:', error);
    return NextResponse.json({ error: 'Failed to fetch itineraries' }, { status: 500 });
  }
}

// POST new Maldives itinerary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST request for Maldives itinerary:', body);
    
    await connectDB();
    
    // Create new itinerary
    const itineraryData = {
      ...body,
      destination: 'maldives', // Force destination to maldives
      isActive: true
    };
    
    const newItinerary = new Itinerary(itineraryData);
    const savedItinerary = await newItinerary.save();
    
    console.log('Maldives itinerary created successfully:', savedItinerary);
    return NextResponse.json(savedItinerary, { status: 201 });
  } catch (error) {
    console.error('Error creating Maldives itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to create itinerary' },
      { status: 500 }
    );
  }
} 