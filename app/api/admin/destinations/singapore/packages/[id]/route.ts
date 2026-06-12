import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';
import { processImageData } from '@/lib/imageUtils';

// GET - Fetch a specific Singapore package
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    console.log('GET request for Singapore package:', params.id);
    
    const packageData = await Package.findOne({ _id: params.id, destination: 'singapore' });
    
    if (!packageData) {
      return NextResponse.json({ error: 'Singapore package not found' }, { status: 404 });
    }

    // Transform MongoDB package to match expected format
    const transformedPackage = {
      id: packageData._id,
      _id: packageData._id,
      name: packageData.name,
      title: packageData.name,
      description: packageData.description,
      price: packageData.price,
      duration: packageData.duration,
      days: packageData.days || packageData.duration,
      destination: packageData.destination,
      location: packageData.location,
      image: packageData.image,
      category: packageData.category,
      type: packageData.type || packageData.category || 'romantic',
      hotelRating: packageData.hotelRating || 4,
      features: packageData.features || [],
      highlights: packageData.highlights || [],
      inclusions: packageData.inclusions || [],
      exclusions: packageData.exclusions || [],
      bestTimeToVisit: packageData.bestTimeToVisit || '',
      isActive: packageData.isActive,
      createdAt: packageData.createdAt,
      updatedAt: packageData.updatedAt
    };

    return NextResponse.json(transformedPackage);
  } catch (error) {
    console.error('Error fetching Singapore package:', error);
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific Singapore package
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    console.log('PUT request for Singapore package:', params.id);
    
    // Validate package ID
    if (!params.id || params.id.length !== 24) {
      console.error('Invalid package ID format:', params.id);
      return NextResponse.json(
        { error: 'Invalid package ID format' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    console.log('Update data received:', JSON.stringify(updateData, null, 2));
    console.log('Package ID from params:', params.id);
    console.log('Update data keys:', Object.keys(updateData));
    
    // Check if package exists first
    const existingPackage = await Package.findOne({ _id: params.id, destination: 'singapore' });
    if (!existingPackage) {
      console.error('Package not found:', params.id);
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
    
    console.log('Found existing package:', existingPackage._id);
    
    // Process image data if provided
    if (updateData.image) {
      updateData.image = await processImageData(updateData.image, 'singapore');
      console.log('Processed image path:', updateData.image);
    }
    
    // Update the package (ensure it's a Singapore package)
    const updatedPackage = await Package.findOneAndUpdate(
      { _id: params.id, destination: 'singapore' },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedPackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
    
    console.log('Singapore package updated successfully:', updatedPackage._id);
    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('Error updating Singapore package:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      { 
        error: 'Failed to update package',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific Singapore package
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    console.log('DELETE request for Singapore package:', params.id);
    
    const deletedPackage = await Package.findOneAndDelete({ _id: params.id, destination: 'singapore' });
    
    if (!deletedPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    console.log('Singapore package deleted successfully:', params.id);
    return NextResponse.json({ 
      message: 'Package deleted successfully',
      deletedPackage 
    });
  } catch (error) {
    console.error('Error deleting Singapore package:', error);
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    );
  }
} 