import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET specific Singapore itinerary
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const itinerary = await Itinerary.findOne({ _id: params.id, destination: 'singapore' });
    
    if (!itinerary) {
      return NextResponse.json({ error: 'Singapore itinerary not found' }, { status: 404 });
    }
    
    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error fetching Singapore itinerary:', error);
    return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });
  }
}

// PUT update specific Singapore itinerary
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const updateData = await request.json();
    
    // Update the itinerary (ensure it's a Singapore itinerary)
    const updatedItinerary = await Itinerary.findOneAndUpdate(
      { _id: params.id, destination: 'singapore' },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedItinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedItinerary);
  } catch (error) {
    console.error('Error updating Singapore itinerary:', error);
    return NextResponse.json({ error: 'Failed to update itinerary' }, { status: 500 });
  }
}

// DELETE specific Singapore itinerary
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const deletedItinerary = await Itinerary.findOneAndDelete({ _id: params.id, destination: 'singapore' });
    
    if (!deletedItinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Itinerary deleted successfully', itinerary: deletedItinerary });
  } catch (error) {
    console.error('Error deleting Singapore itinerary:', error);
    return NextResponse.json({ error: 'Failed to delete itinerary' }, { status: 500 });
  }
} 