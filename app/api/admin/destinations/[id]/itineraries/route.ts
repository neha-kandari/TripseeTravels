import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/destinations.json');

// GET itineraries for a specific destination
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
    
    return NextResponse.json(destination.itineraries || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch itineraries' }, { status: 500 });
  }
}

// POST new itinerary to a specific destination
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
    
    // Generate new itinerary ID
    const newItineraryId = `${params.id}-itinerary-${Date.now()}`;
    
    // Create new itinerary
    const newItinerary = {
      ...body,
      id: newItineraryId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add itinerary to destination
    if (!destinations[params.id].itineraries) {
      destinations[params.id].itineraries = [];
    }
    destinations[params.id].itineraries.push(newItinerary);
    destinations[params.id].updatedAt = new Date().toISOString();
    
    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(destinations, null, 2));
    
    return NextResponse.json(newItinerary, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create itinerary' }, { status: 500 });
  }
} 