import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// Get home content for public consumption
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('homecontent');
    
    // Get the latest home content from MongoDB
    const homeContent = await collection.findOne({}, { sort: { createdAt: -1 } });
    
    if (!homeContent) {
      return NextResponse.json({ error: 'No home content found' }, { status: 404 });
    }
    
    return NextResponse.json(homeContent, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error reading home content:', error);
    return NextResponse.json({ error: 'Failed to read home content' }, { status: 500 });
  }
}
