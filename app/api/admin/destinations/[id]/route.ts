import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/destinations.json');

// GET destination by ID
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
    
    return NextResponse.json(destination);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 });
  }
}

// PUT update destination
export async function PUT(
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
    
    // Update destination
    destinations[params.id] = {
      ...destinations[params.id],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(destinations, null, 2));
    
    return NextResponse.json(destinations[params.id]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 });
  }
}

// DELETE destination
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Read existing destinations
    const data = await fs.readFile(dataFilePath, 'utf8');
    const destinations = JSON.parse(data);
    
    if (!destinations[params.id]) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    
    // Delete destination
    delete destinations[params.id];
    
    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(destinations, null, 2));
    
    return NextResponse.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 });
  }
} 