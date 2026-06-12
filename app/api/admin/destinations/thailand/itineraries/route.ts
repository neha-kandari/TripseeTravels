import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET all Thailand itineraries or filter by packageId
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    
    // Build query
    const query: any = { destination: 'thailand' };
    if (packageId) query.packageId = packageId;
    
    const mongoItineraries = await Itinerary.find(query).sort({ createdAt: -1 });
    
    // Transform MongoDB itineraries to match frontend expectations
    const transformedItineraries = mongoItineraries.map(itinerary => ({
      id: itinerary._id,
      title: itinerary.title,
      destination: itinerary.destination,
      duration: itinerary.duration,
      overview: itinerary.overview,
      packageId: itinerary.packageId,
      hotelName: itinerary.hotelName,
      hotelRating: itinerary.hotelRating,
      hotelDescription: itinerary.hotelDescription,
      hotelImages: itinerary.hotelImages || [],
      days: itinerary.days || [],
      inclusions: itinerary.inclusions || [],
      exclusions: itinerary.exclusions || [],
      isActive: itinerary.isActive,
      createdAt: itinerary.createdAt,
      updatedAt: itinerary.updatedAt
    }));

    return NextResponse.json({ itineraries: transformedItineraries });
  } catch (error) {
    console.error('Error fetching Thailand itineraries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itineraries' },
      { status: 500 }
    );
  }
}

// POST new Thailand itinerary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST Thailand itinerary request body:', body);
    
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

    // Create new itinerary
    const itineraryData = {
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
    
    const newItinerary = new Itinerary(itineraryData);
    const savedItinerary = await newItinerary.save();
    
    // Transform for response
    const transformedItinerary = {
      id: savedItinerary._id,
      title: savedItinerary.title,
      destination: savedItinerary.destination,
      duration: savedItinerary.duration,
      overview: savedItinerary.overview,
      packageId: savedItinerary.packageId,
      hotelName: savedItinerary.hotelName,
      hotelRating: savedItinerary.hotelRating,
      hotelDescription: savedItinerary.hotelDescription,
      hotelImages: savedItinerary.hotelImages || [],
      days: savedItinerary.days || [],
      inclusions: savedItinerary.inclusions || [],
      exclusions: savedItinerary.exclusions || [],
      isActive: savedItinerary.isActive,
      createdAt: savedItinerary.createdAt,
      updatedAt: savedItinerary.updatedAt
    };

    return NextResponse.json(transformedItinerary, { status: 201 });
  } catch (error) {
    console.error('Error creating Thailand itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to create itinerary' },
      { status: 500 }
    );
  }
}

// PUT - Update existing Thailand itinerary
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('PUT Thailand itinerary request body:', body);
    
    const { 
      id,
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
      id,
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

// DELETE - Delete Thailand itinerary
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('DELETE Thailand itinerary request body:', body);
    
    const { id } = body;
    
    await connectDB();
    
    const deletedItinerary = await Itinerary.findByIdAndDelete(id);
    
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