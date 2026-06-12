import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Itinerary from '@/lib/models/Itinerary';
import Package from '@/lib/models/Package';

// GET all romantic itineraries
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    
    // Build query - look for itineraries that are either:
    // 1. Category 'romantic' (for backward compatibility)
    // 2. Or have a packageId that matches a romantic package
    let query: any = {};
    let romanticPackageIds: string[] = [];
    
    if (packageId) {
      // If packageId is provided, find itinerary for that specific package
      query.packageId = packageId;
    } else {
      // If no packageId, find only romantic hideaway itineraries
      // We need to find itineraries whose packages have category: 'romantic' AND valid romantic types
      const validRomanticTypes = ['Honeymoon', 'Proposal', 'Candle Night', 'Beach Romance', 'Anniversary', 'Romantic'];
      const romanticPackages = await Package.find({ 
        category: 'romantic', 
        isActive: true,
        type: { $in: validRomanticTypes }
      }).select('_id');
      romanticPackageIds = romanticPackages.map(pkg => pkg._id.toString());
      
      // Only show itineraries that are linked to these specific romantic packages
      // (the same packages that are shown on the romantic hideaway page)
      if (romanticPackageIds.length > 0) {
        query.packageId = { $in: romanticPackageIds };
      } else {
        // If no romantic packages found, return empty array
        query.packageId = { $in: [] };
      }
    }
    
    const itineraries = await Itinerary.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(itineraries);
  } catch (error) {
    console.error('Error reading romantic itineraries:', error);
    return NextResponse.json({ error: 'Failed to fetch romantic itineraries' }, { status: 500 });
  }
}

// POST new romantic itinerary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDB();
    
    // Validate required fields
    if (!body.packageId) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!body.destination) {
      return NextResponse.json({ error: 'Destination is required' }, { status: 400 });
    }
    if (!body.duration) {
      return NextResponse.json({ error: 'Duration is required' }, { status: 400 });
    }
    if (!body.overview) {
      return NextResponse.json({ error: 'Overview is required' }, { status: 400 });
    }
    
    // Clean up arrays - remove empty strings
    const cleanDays = (body.days || []).map((day: any) => ({
      ...day,
      activities: (day.activities || []).filter((act: string) => act.trim() !== ''),
      meals: (day.meals || []).filter((meal: string) => meal.trim() !== '')
    })).filter((day: any) => day.title.trim() !== '' || day.description.trim() !== '');
    
    const cleanInclusions = (body.inclusions || []).filter((inc: string) => inc.trim() !== '');
    const cleanExclusions = (body.exclusions || []).filter((exc: string) => exc.trim() !== '');
    
    // Create new itinerary in MongoDB
    const newItinerary = new Itinerary({
      packageId: body.packageId,
      title: body.title,
      destination: body.destination,
      duration: body.duration,
      overview: body.overview,
      hotelName: body.hotelName,
      hotelRating: body.hotelRating,
      hotelDescription: body.hotelDescription,
      hotelImages: body.hotelImages || [],
      days: cleanDays,
      inclusions: cleanInclusions,
      exclusions: cleanExclusions,
      category: 'romantic',
      isActive: true
    });
    
    const savedItinerary = await newItinerary.save();
    
    return NextResponse.json(savedItinerary, { status: 201 });
  } catch (error) {
    console.error('Error creating romantic itinerary:', error);
    return NextResponse.json({ 
      error: 'Failed to create romantic itinerary', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 