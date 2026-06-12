import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/destinations.json');

// GET packages for a specific destination
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const destinations = JSON.parse(data);
    const destination = destinations[params.id];
    
    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    
    return NextResponse.json(destination.packages || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

// POST new package to a specific destination
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Read existing destinations
    const data = await fs.readFile(dataFilePath, 'utf8');
    const destinations = JSON.parse(data);
    
    if (!destinations[params.id]) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    
    // Generate new package ID
    const newPackageId = `${params.id}-${Date.now()}`;
    
    // Create new package
    const newPackage = {
      ...body,
      id: newPackageId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add package to destination
    if (!destinations[params.id].packages) {
      destinations[params.id].packages = [];
    }
    destinations[params.id].packages.push(newPackage);
    destinations[params.id].updatedAt = new Date().toISOString();
    
    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(destinations, null, 2));
    
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}

// DELETE package from a specific destination
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('id');
    
    if (!packageId) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }
    
    // Read existing destinations
    const data = await fs.readFile(dataFilePath, 'utf8');
    const destinations = JSON.parse(data);
    
    if (!destinations[params.id]) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    
    // Find and remove the package
    const packageIndex = destinations[params.id].packages?.findIndex((pkg: any) => pkg.id === packageId);
    
    if (packageIndex === -1 || packageIndex === undefined) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    // Remove the package
    destinations[params.id].packages.splice(packageIndex, 1);
    destinations[params.id].updatedAt = new Date().toISOString();
    
    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(destinations, null, 2));
    
    return NextResponse.json({ message: 'Package deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
} 