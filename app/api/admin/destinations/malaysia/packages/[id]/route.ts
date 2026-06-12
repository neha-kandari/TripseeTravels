import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';

// GET - Fetch a specific package
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('GET request for Malaysia package:', id);
    
    await connectDB();
    
    const packageData = await Package.findOne({ 
      _id: id, 
      destination: 'malaysia' 
    });
    
    if (!packageData) {
      console.error('Malaysia package not found with ID:', id);
      return NextResponse.json({ 
        error: 'Package not found',
        success: false 
      }, { status: 404 });
    }

    const transformedPackage = {
      id: packageData._id.toString(),
      image: packageData.image || '/Destination/MalaysiaHero/img1.webp',
      days: packageData.days || packageData.duration || 'N/A',
      title: packageData.name || 'Malaysia Package',
      location: packageData.location || 'Malaysia',
      price: packageData.price ? `₹${packageData.price.toLocaleString()}/-` : '₹0/-',
      type: packageData.type || 'Standard',
      hotelRating: packageData.hotelRating || 3,
      features: packageData.features || [],
      highlights: packageData.highlights ? packageData.highlights.join(' • ') : '',
      createdAt: packageData.createdAt,
      updatedAt: packageData.updatedAt
    };

    console.log('Malaysia package found:', transformedPackage.title);
    return NextResponse.json({ 
      success: true,
      package: transformedPackage 
    });
  } catch (error) {
    console.error('Error fetching Malaysia package:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch package',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT - Update a specific package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('PUT request for Malaysia package:', id);
    
    let updateData;
    try {
      const body = await request.text();
      console.log('Raw request body length:', body.length);
      console.log('Raw request body preview:', body.substring(0, 200));
      
      if (!body || body.trim() === '') {
        console.error('Empty request body');
        return NextResponse.json({ 
          error: 'Empty request body',
          success: false 
        }, { status: 400 });
      }
      
      updateData = JSON.parse(body);
      console.log('Update data received:', updateData);
    } catch (jsonError) {
      console.error('Failed to parse request JSON:', jsonError);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        success: false,
        details: jsonError instanceof Error ? jsonError.message : 'Unknown parsing error'
      }, { status: 400 });
    }
    
    await connectDB();
    
    if (updateData.image && updateData.image.startsWith('data:image')) {
      updateData.image = updateData.image;
    }
    
    if (!updateData.name || !updateData.price || !updateData.duration) {
      console.error('Missing required fields:', { name: updateData.name, price: updateData.price, duration: updateData.duration });
      return NextResponse.json({ 
        error: 'Missing required fields: name, price, and duration are required',
        success: false 
      }, { status: 400 });
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        destination: 'malaysia',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      console.error('Package not found with ID:', id);
      return NextResponse.json({ 
        error: 'Package not found',
        success: false 
      }, { status: 404 });
    }

    console.log('Malaysia package updated successfully:', updatedPackage);
    return NextResponse.json({ 
      success: true,
      message: 'Package updated successfully',
      package: updatedPackage 
    });
  } catch (error) {
    console.error('Error updating Malaysia package:', error);
    return NextResponse.json({ 
      error: 'Failed to update package',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Delete a specific package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('DELETE request for Malaysia package:', id);
    
    await connectDB();
    
    const deletedPackage = await Package.findOneAndDelete({ 
      _id: id, 
      destination: 'malaysia' 
    });

    if (!deletedPackage) {
      console.error('Package not found with ID:', id);
      return NextResponse.json({ 
        error: 'Package not found',
        success: false 
      }, { status: 404 });
    }

    console.log('Malaysia package deleted successfully:', deletedPackage);
    return NextResponse.json({ 
      success: true,
      message: 'Package deleted successfully',
      package: deletedPackage 
    });
  } catch (error) {
    console.error('Error deleting Malaysia package:', error);
    return NextResponse.json({ 
      error: 'Failed to delete package',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 