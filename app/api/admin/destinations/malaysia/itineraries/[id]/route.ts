import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';

// GET specific Malaysia itinerary
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('GET request for Malaysia itinerary:', id);
    
    await connectDB();
    
    const itinerary = await Itinerary.findOne({ 
      _id: id, 
      destination: 'malaysia' 
    });
    
    if (!itinerary) {
      console.error('Malaysia itinerary not found with ID:', id);
      return NextResponse.json({ 
        error: 'Itinerary not found',
        success: false 
      }, { status: 404 });
    }

    console.log('Malaysia itinerary found:', itinerary.title);
    return NextResponse.json({ 
      success: true,
      itinerary 
    });
  } catch (error) {
    console.error('Error fetching Malaysia itinerary:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch itinerary',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT update specific Malaysia itinerary
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('PUT request for Malaysia itinerary:', id);
    
    const updateData = await request.json();
    console.log('Update data received:', updateData);
    
    await connectDB();

    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        destination: 'malaysia',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedItinerary) {
      console.error('Itinerary not found with ID:', id);
      return NextResponse.json({ 
        error: 'Itinerary not found',
        success: false 
      }, { status: 404 });
    }

    console.log('Malaysia itinerary updated successfully:', updatedItinerary);
    return NextResponse.json({ 
      success: true,
      message: 'Itinerary updated successfully',
      itinerary: updatedItinerary 
    });
  } catch (error) {
    console.error('Error updating Malaysia itinerary:', error);
    return NextResponse.json({ 
      error: 'Failed to update itinerary',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE specific Malaysia itinerary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('DELETE request for Malaysia itinerary:', id);
    
    await connectDB();
    
    const deletedItinerary = await Itinerary.findOneAndDelete({ 
      _id: id, 
      destination: 'malaysia' 
    });

    if (!deletedItinerary) {
      console.error('Itinerary not found with ID:', id);
      return NextResponse.json({ 
        error: 'Itinerary not found',
        success: false 
      }, { status: 404 });
    }

    console.log('Malaysia itinerary deleted successfully:', deletedItinerary);
    return NextResponse.json({ 
      success: true,
      message: 'Itinerary deleted successfully',
      itinerary: deletedItinerary 
    });
  } catch (error) {
    console.error('Error deleting Malaysia itinerary:', error);
    return NextResponse.json({ 
      error: 'Failed to delete itinerary',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 