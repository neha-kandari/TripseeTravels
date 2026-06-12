import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      return NextResponse.json(
        { 
          error: 'Google Places API not configured',
          fallback: true 
        },
        { status: 500 }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total,name,formatted_address,website&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return NextResponse.json({
        success: true,
        data: data.result
      });
    } else {
      return NextResponse.json(
        { 
          error: data.error_message || 'Failed to fetch reviews',
          fallback: true 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching Google Reviews:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        fallback: true 
      },
      { status: 500 }
    );
  }
} 