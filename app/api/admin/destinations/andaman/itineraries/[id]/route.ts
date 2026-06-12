import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET specific Andaman itinerary
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const itinerary = await Itinerary.findOne({ 
      _id: params.id, 
      destination: 'andaman' 
    });

    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error fetching Andaman itinerary:', error);
    return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });
  }
}

// PUT update specific Andaman itinerary
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updateData = await request.json();
    console.log('PUT request for Andaman itinerary:', params.id, updateData);
    
    await connectDB();
    
    // Update the itinerary
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      params.id,
      { 
        ...updateData,
        destination: 'andaman', // Ensure destination is andaman
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedItinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    console.log('Andaman itinerary updated successfully:', updatedItinerary);
    return NextResponse.json(updatedItinerary);
  } catch (error) {
    console.error('Error updating Andaman itinerary:', error);
    return NextResponse.json({ error: 'Failed to update itinerary' }, { status: 500 });
  }
}

// DELETE specific Andaman itinerary
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE request for Andaman itinerary:', params.id);
    
    await connectDB();
    
    const deletedItinerary = await Itinerary.findOneAndDelete({ 
      _id: params.id, 
      destination: 'andaman' 
    });

    if (!deletedItinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    console.log('Andaman itinerary deleted successfully:', deletedItinerary);
    return NextResponse.json({ 
      success: true, 
      message: 'Itinerary deleted successfully',
      itinerary: deletedItinerary 
    });
  } catch (error) {
    console.error('Error deleting Andaman itinerary:', error);
    return NextResponse.json({ error: 'Failed to delete itinerary' }, { status: 500 });
  }
}