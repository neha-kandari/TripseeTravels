import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET all itineraries
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const packageId = searchParams.get('packageId');
    const isActive = searchParams.get('isActive');
    
    // Build query
    const query: any = {};
    if (destination) query.destination = destination;
    if (packageId) query.packageId = packageId;
    if (isActive !== null) query.isActive = isActive === 'true';
    
    const itineraries = await Itinerary.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      itineraries,
      count: itineraries.length
    });
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json({ error: 'Failed to fetch itineraries' }, { status: 500 });
  }
}

// POST new itinerary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received itinerary data:', body);
    await connectDB();
    
    // Create new itinerary
    const newItinerary = new Itinerary({
      title: body.title,
      destination: body.destination,
      duration: body.duration,
      overview: body.overview,
      packageId: body.packageId,
      hotelName: body.hotelName,
      hotelRating: body.hotelRating,
      hotelDescription: body.hotelDescription,
      hotelImages: body.hotelImages || [],
      days: body.days || [],
      inclusions: body.inclusions || [],
      exclusions: body.exclusions || [],
      isActive: body.isActive !== undefined ? body.isActive : true
    });
    
    console.log('Creating itinerary with data:', {
      title: body.title,
      destination: body.destination,
      duration: body.duration,
      overview: body.overview,
      packageId: body.packageId,
      days: body.days,
      inclusions: body.inclusions,
      exclusions: body.exclusions
    });
    
    const savedItinerary = await newItinerary.save();
    console.log('Itinerary saved successfully:', savedItinerary._id);
    
    return NextResponse.json({
      success: true,
      itinerary: savedItinerary
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json({ 
      error: 'Failed to create itinerary', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}