import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../../../lib/mongoose';
import Package from '../../../../../../../lib/models/Package';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    console.log('GET request for Dubai package:', params.id);
    
    const packageData = await Package.findById(params.id);
    
    if (!packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    console.log('Found Dubai package:', packageData._id);
    return NextResponse.json(packageData);
  } catch (error) {
    console.error('Error fetching Dubai package:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    const updateData = await request.json();
    console.log('PUT request for Dubai package:', params.id, updateData);
    
    const updatedPackage = await Package.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    console.log('Dubai package updated successfully:', updatedPackage._id);
    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('Error updating Dubai package:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    console.log('DELETE request for Dubai package:', params.id);
    
    const deletedPackage = await Package.findByIdAndDelete(params.id);
    
    if (!deletedPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    console.log('Dubai package deleted successfully:', params.id);
    return NextResponse.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting Dubai package:', error);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
} 