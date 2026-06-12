import { NextRequest, NextResponse } from 'next/server';
import { cityFiltersManager } from '../../../lib/cityFiltersData';

// GET - Fetch all city filters or filters for a specific destination
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination');

  if (destination) {
    const filters = cityFiltersManager.getCities(destination);
    return NextResponse.json(filters);
  }

  return NextResponse.json(cityFiltersManager.getAllCities());
}

// POST - Add a new city filter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, name, order } = body;

    if (!destination || !name) {
      return NextResponse.json(
        { error: 'Destination and name are required' },
        { status: 400 }
      );
    }

    const newCity = cityFiltersManager.addCity(destination, name, order);
    return NextResponse.json(newCity, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create city filter' },
      { status: 500 }
    );
  }
}

// PUT - Update a city filter
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, id, name, isActive, order } = body;

    if (!destination || !id) {
      return NextResponse.json(
        { error: 'Destination and ID are required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (isActive !== undefined) updates.isActive = isActive;
    if (order !== undefined) updates.order = order;

    const updatedCity = cityFiltersManager.updateCity(destination, id, updates);
    return NextResponse.json(updatedCity);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update city filter' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a city filter
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const id = searchParams.get('id');

    if (!destination || !id) {
      return NextResponse.json(
        { error: 'Destination and ID are required' },
        { status: 400 }
      );
    }

    const deletedCity = cityFiltersManager.deleteCity(destination, parseInt(id));
    return NextResponse.json({ message: 'City filter deleted successfully', deletedCity });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete city filter' },
      { status: 500 }
    );
  }
} 