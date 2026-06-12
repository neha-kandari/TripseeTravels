import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET specific romantic itinerary
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const itinerary = await Itinerary.findById(id);
    
    if (!itinerary) {
      return NextResponse.json({ error: 'Romantic itinerary not found' }, { status: 404 });
    }
    
    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error fetching romantic itinerary:', error);
    return NextResponse.json({ error: 'Failed to fetch romantic itinerary' }, { status: 500 });
  }
}

// PUT update romantic itinerary
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
        ...body,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedItinerary) {
      return NextResponse.json({ error: 'Romantic itinerary not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedItinerary);
  } catch (error) {
    console.error('Error updating romantic itinerary:', error);
    return NextResponse.json({ error: 'Failed to update romantic itinerary' }, { status: 500 });
  }
}

// DELETE romantic itinerary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const deletedItinerary = await Itinerary.findByIdAndDelete(id);
    
    if (!deletedItinerary) {
      return NextResponse.json({ error: 'Romantic itinerary not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Romantic itinerary deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting romantic itinerary:', error);
    return NextResponse.json({ error: 'Failed to delete romantic itinerary' }, { status: 500 });
  }
} 