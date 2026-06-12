import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';

// GET specific Andaman package
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const packageData = await Package.findOne({ 
      _id: id, 
      destination: 'andaman' 
    });

    if (!packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json(packageData);
  } catch (error) {
    console.error('Error fetching Andaman package:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}

// PUT update specific Andaman package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('PUT request for Andaman package:', id);
    
    // Validate params.id
    if (!id || id === 'undefined') {
      console.error('Invalid package ID:', id);
      return NextResponse.json({ 
        error: 'Invalid package ID',
        success: false 
      }, { status: 400 });
    }

    let updateData;
    try {
      // Get the raw body first to check its size
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
    
    // Process image data if provided
    if (updateData.image && updateData.image.startsWith('data:image')) {
      updateData.image = updateData.image;
    }
    
    // Validate required fields before update
    if (!updateData.name || !updateData.price || !updateData.duration) {
      console.error('Missing required fields:', { name: updateData.name, price: updateData.price, duration: updateData.duration });
      return NextResponse.json({ 
        error: 'Missing required fields: name, price, and duration are required',
        success: false 
      }, { status: 400 });
    }

    // Update the package
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        destination: 'andaman', // Ensure destination is andaman
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

    console.log('Andaman package updated successfully:', updatedPackage);
    return NextResponse.json({ 
      success: true,
      message: 'Package updated successfully',
      package: updatedPackage 
    });
  } catch (error) {
    console.error('Error updating Andaman package:', error);
    return NextResponse.json({ 
      error: 'Failed to update package',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE specific Andaman package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('DELETE request for Andaman package:', id);
    
    await connectDB();
    
    const deletedPackage = await Package.findOneAndDelete({ 
      _id: id, 
      destination: 'andaman' 
    });

    if (!deletedPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    console.log('Andaman package deleted successfully:', deletedPackage);
    return NextResponse.json({ 
      success: true, 
      message: 'Package deleted successfully',
      package: deletedPackage 
    });
  } catch (error) {
    console.error('Error deleting Andaman package:', error);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}