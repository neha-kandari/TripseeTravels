import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/destinations.json');

// GET all destinations
export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const destinations = JSON.parse(data);
    return NextResponse.json(destinations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}

// POST new destination
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Read existing destinations
    const data = await fs.readFile(dataFilePath, 'utf8');
    const destinations = JSON.parse(data);
    
    // Generate new ID
    const newId = body.id || body.name.toLowerCase().replace(/\s+/g, '-');
    
    // Create new destination
    const newDestination = {
      ...body,
      id: newId,
      packages: body.packages || [],
      itineraries: body.itineraries || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to destinations
    destinations[newId] = newDestination;
    
    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(destinations, null, 2));
    
    return NextResponse.json(newDestination, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 });
  }
} 