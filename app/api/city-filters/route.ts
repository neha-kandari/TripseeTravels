import { NextRequest, NextResponse } from 'next/server';
import { cityFiltersManager } from '../../lib/cityFiltersData';
import connectDB from '@/lib/mongoose';
import Package from '@/lib/models/Package';

// GET - Fetch city filters for a specific destination with actual counts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination');

  if (!destination) {
    return NextResponse.json(
      { error: 'Destination parameter is required' },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    
    // Get packages for the destination
    const packages = await Package.find({ destination }).select('location');
    
    // Calculate city counts from actual packages
    const cityCounts: { [key: string]: number } = {};
    packages.forEach((pkg: any) => {
      if (pkg.location) {
        // Split location by common separators and count each city
        const cities = pkg.location.split(/[&,]/).map((city: string) => city.trim());
        cities.forEach((city: string) => {
          // Normalize city names
          let normalizedCity = city;
          if (city === "Private Resort Island") normalizedCity = "Resort Island";
          if (city === "3 Different Resorts") {
            // Split this into multiple cities
            ["Male", "Resort Island", "Multiple Atolls"].forEach(c => {
              cityCounts[c] = (cityCounts[c] || 0) + 1;
            });
            return;
          }
          cityCounts[normalizedCity] = (cityCounts[normalizedCity] || 0) + 1;
        });
      }
    });

    const filters = cityFiltersManager.getCities(destination);
    
    // Return active cities with actual counts, sorted by order
    const activeFilters = filters
      .filter((city: any) => city.isActive)
      .sort((a: any, b: any) => a.order - b.order)
      .map((city: any) => ({
        id: city.id,
        name: city.name,
        count: cityCounts[city.name] || 0,
        order: city.order
      }));

    return NextResponse.json(activeFilters);
  } catch (error) {
    console.error('Error fetching city filters with counts:', error);
    
    // Fallback to static data if MongoDB fails
    const filters = cityFiltersManager.getCities(destination);
    const activeFilters = filters
      .filter((city: any) => city.isActive)
      .sort((a: any, b: any) => a.order - b.order)
      .map((city: any) => ({
        id: city.id,
        name: city.name,
        count: 0,
        order: city.order
      }));

    return NextResponse.json(activeFilters);
  }
} 