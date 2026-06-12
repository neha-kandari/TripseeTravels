import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/destinations.json');

// DELETE a specific package by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; packageId: string } }
) {
  try {
    const { id: destinationId, packageId } = params;
    
    if (!destinationId || !packageId) {
      return NextResponse.json({ error: 'Destination ID and Package ID are required' }, { status: 400 });
    }
    
    // Read existing destinations
    const data = await fs.readFile(dataFilePath, 'utf8');
    const destinations = JSON.parse(data);
    
    if (!destinations[destinationId]) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    
    // Find and remove the package
    const packageIndex = destinations[destinationId].packages?.findIndex((pkg: any) => pkg.id === packageId);
    
    if (packageIndex === -1 || packageIndex === undefined) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    // Remove the package
    destinations[destinationId].packages.splice(packageIndex, 1);
    destinations[destinationId].updatedAt = new Date().toISOString();
    
    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(destinations, null, 2));
    
    return NextResponse.json({ message: 'Package deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}

// GET a specific package by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; packageId: string } }
) {
  try {
    const { id: destinationId, packageId } = params;
    
    if (!destinationId || !packageId) {
      return NextResponse.json({ error: 'Destination ID and Package ID are required' }, { status: 400 });
    }
    
    // Read existing destinations
    const data = await fs.readFile(dataFilePath, 'utf8');
    const destinations = JSON.parse(data);
    
    if (!destinations[destinationId]) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    
    // Find the package
    const packageData = destinations[destinationId].packages?.find((pkg: any) => pkg.id === packageId);
    
    if (!packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    return NextResponse.json(packageData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}

// PUT - Update existing package
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; packageId: string } }
) {
  try {
    const { id: destinationId, packageId } = params;
    const body = await request.json();
    
    if (!destinationId || !packageId) {
      return NextResponse.json({ error: 'Destination ID and Package ID are required' }, { status: 400 });
    }
    
    // Read existing destinations
    const data = await fs.readFile(dataFilePath, 'utf8');
    const destinations = JSON.parse(data);
    
    if (!destinations[destinationId]) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    
    // Find the package
    const packageIndex = destinations[destinationId].packages?.findIndex((pkg: any) => pkg.id === packageId);
    
    if (packageIndex === -1 || packageIndex === undefined) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    // Update the package
    destinations[destinationId].packages[packageIndex] = {
      ...destinations[destinationId].packages[packageIndex],
      ...body,
      id: packageId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    destinations[destinationId].updatedAt = new Date().toISOString();
    
    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(destinations, null, 2));
    
    return NextResponse.json(destinations[destinationId].packages[packageIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
} 