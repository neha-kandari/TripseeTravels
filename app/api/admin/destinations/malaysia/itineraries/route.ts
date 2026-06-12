import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET all Malaysia itineraries or filter by packageId
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    
    let query: any = { destination: 'malaysia' };
    if (packageId) {
      query.packageId = packageId;
    }
    
    const itineraries = await Itinerary.find(query).sort({ createdAt: -1 });
    
    console.log('Malaysia itineraries returned:', itineraries.length);
    return NextResponse.json({ itineraries });
  } catch (error) {
    console.error('Error fetching Malaysia itineraries:', error);
    return NextResponse.json({ error: 'Failed to fetch Malaysia itineraries' }, { status: 500 });
  }
}

// POST new Malaysia itinerary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST request for Malaysia itinerary:', body);

    await connectDB();

    const newItinerary = new Itinerary({
      ...body,
      destination: 'malaysia'
    });

    const savedItinerary = await newItinerary.save();
    console.log('Malaysia itinerary created successfully:', savedItinerary);

    return NextResponse.json({ 
      success: true,
      message: 'Itinerary created successfully',
      itinerary: savedItinerary 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating Malaysia itinerary:', error);
    return NextResponse.json({ 
      error: 'Failed to create itinerary',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 