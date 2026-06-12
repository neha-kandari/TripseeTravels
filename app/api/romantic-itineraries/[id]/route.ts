import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET single romantic itinerary for public website
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const itinerary = await Itinerary.findById(id);
    
    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }
    
    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error fetching romantic itinerary:', error);
    return NextResponse.json({ error: 'Failed to fetch romantic itinerary' }, { status: 500 });
  }
}
