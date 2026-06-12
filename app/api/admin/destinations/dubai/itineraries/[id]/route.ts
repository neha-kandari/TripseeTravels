import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../../../lib/mongoose';
import Itinerary from '../../../../../../../lib/models/Itinerary';

// GET specific Dubai itinerary
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    console.log('GET request for Dubai itinerary:', params.id);
    
    const itinerary = await Itinerary.findById(params.id);
    
    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    console.log('Found Dubai itinerary:', itinerary._id);
    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error fetching Dubai itinerary:', error);
    return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });
  }
}

// PUT update specific Dubai itinerary
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const updateData = await request.json();
    console.log('PUT request for Dubai itinerary:', params.id, updateData);
    
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedItinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    console.log('Dubai itinerary updated successfully:', updatedItinerary._id);
    return NextResponse.json(updatedItinerary);
  } catch (error) {
    console.error('Error updating Dubai itinerary:', error);
    return NextResponse.json({ error: 'Failed to update itinerary' }, { status: 500 });
  }
}

// DELETE specific Dubai itinerary
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    console.log('DELETE request for Dubai itinerary:', params.id);
    
    const deletedItinerary = await Itinerary.findByIdAndDelete(params.id);
    
    if (!deletedItinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    console.log('Dubai itinerary deleted successfully:', params.id);
    return NextResponse.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error('Error deleting Dubai itinerary:', error);
    return NextResponse.json({ error: 'Failed to delete itinerary' }, { status: 500 });
  }
} 