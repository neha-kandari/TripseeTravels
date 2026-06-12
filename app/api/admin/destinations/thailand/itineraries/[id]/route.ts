import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET single Thailand itinerary by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id: itineraryId } = await params;
    const mongoItinerary = await Itinerary.findOne({ _id: itineraryId, destination: 'thailand' });
    
    if (!mongoItinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }
    
    // Transform MongoDB itinerary to match frontend expectations
    const transformedItinerary = {
      id: mongoItinerary._id,
      title: mongoItinerary.title,
      destination: mongoItinerary.destination,
      duration: mongoItinerary.duration,
      overview: mongoItinerary.overview,
      packageId: mongoItinerary.packageId,
      hotelName: mongoItinerary.hotelName,
      hotelRating: mongoItinerary.hotelRating,
      hotelDescription: mongoItinerary.hotelDescription,
      hotelImages: mongoItinerary.hotelImages || [],
      days: mongoItinerary.days || [],
      inclusions: mongoItinerary.inclusions || [],
      exclusions: mongoItinerary.exclusions || [],
      isActive: mongoItinerary.isActive,
      createdAt: mongoItinerary.createdAt,
      updatedAt: mongoItinerary.updatedAt
    };

    return NextResponse.json(transformedItinerary);
  } catch (error) {
    console.error('Error fetching Thailand itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itinerary' },
      { status: 500 }
    );
  }
}

// PUT - Update existing Thailand itinerary by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    console.log('PUT Thailand itinerary request body:', body);
    
    const { id: itineraryId } = await params;
    const { 
      title,
      destination = 'thailand',
      duration,
      overview,
      packageId,
      hotelName,
      hotelRating,
      hotelDescription,
      hotelImages,
      days,
      inclusions,
      exclusions
    } = body;
    
    await connectDB();

    // Find and update the itinerary
    const updateData: any = {
      title,
      destination,
      duration,
      overview,
      packageId,
      hotelName,
      hotelRating,
      hotelDescription,
      hotelImages: hotelImages || [],
      days: days || [],
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      isActive: true
    };
    
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      itineraryId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedItinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }
    
    // Transform for response
    const transformedItinerary = {
      id: updatedItinerary._id,
      title: updatedItinerary.title,
      destination: updatedItinerary.destination,
      duration: updatedItinerary.duration,
      overview: updatedItinerary.overview,
      packageId: updatedItinerary.packageId,
      hotelName: updatedItinerary.hotelName,
      hotelRating: updatedItinerary.hotelRating,
      hotelDescription: updatedItinerary.hotelDescription,
      hotelImages: updatedItinerary.hotelImages || [],
      days: updatedItinerary.days || [],
      inclusions: updatedItinerary.inclusions || [],
      exclusions: updatedItinerary.exclusions || [],
      isActive: updatedItinerary.isActive,
      createdAt: updatedItinerary.createdAt,
      updatedAt: updatedItinerary.updatedAt
    };

    return NextResponse.json(transformedItinerary);
  } catch (error) {
    console.error('Error updating Thailand itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to update itinerary' },
      { status: 500 }
    );
  }
}

// DELETE - Delete Thailand itinerary by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: itineraryId } = await params;
    console.log('DELETE Thailand itinerary ID:', itineraryId);
    
    await connectDB();
    
    const deletedItinerary = await Itinerary.findByIdAndDelete(itineraryId);
    
    if (!deletedItinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error('Error deleting Thailand itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to delete itinerary' },
      { status: 500 }
    );
  }
}