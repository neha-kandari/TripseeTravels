import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET Bali itinerary by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    console.log('Fetching Bali itinerary with ID:', id);
    
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json({ error: 'Invalid itinerary ID' }, { status: 400 });
    }
    
    const itinerary = await Itinerary.findById(id);
    
    if (!itinerary) {
      console.log('Bali itinerary not found for ID:', id);
      return NextResponse.json({ error: 'Bali itinerary not found' }, { status: 404 });
    }
    
    console.log('Found Bali itinerary:', itinerary.title);
    return NextResponse.json({
      success: true,
      itinerary
    });
  } catch (error) {
    console.error('Error fetching Bali itinerary:', error);
    return NextResponse.json({ error: 'Failed to fetch Bali itinerary' }, { status: 500 });
  }
}

// PUT update Bali itinerary
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    await connectDB();
    
    const { id } = await params;
    
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      id,
      {
        title: body.title,
        destination: body.destination || 'bali',
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
        isActive: body.isActive !== undefined ? body.isActive : true,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedItinerary) {
      return NextResponse.json({ error: 'Bali itinerary not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      itinerary: updatedItinerary
    });
  } catch (error) {
    console.error('Error updating Bali itinerary:', error);
    return NextResponse.json({ error: 'Failed to update Bali itinerary' }, { status: 500 });
  }
}

// DELETE Bali itinerary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json({ error: 'Invalid itinerary ID' }, { status: 400 });
    }
    
    const itinerary = await Itinerary.findByIdAndDelete(id);
    
    if (!itinerary) {
      return NextResponse.json({ error: 'Bali itinerary not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Bali itinerary deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting Bali itinerary:', error);
    return NextResponse.json({ error: 'Failed to delete Bali itinerary' }, { status: 500 });
  }
}