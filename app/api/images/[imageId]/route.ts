import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Image from '@/lib/models/Image';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    await connectDB();
    
    const { imageId } = await params;
    const image = await (Image as any).findById(imageId) as any;
    
    if (!image) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', image.contentType);
    headers.set('Content-Length', image.size.toString());
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('ETag', `"${image._id}"`);
    
    // Return the image data
    return new NextResponse(image.data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    await connectDB();
    
    const { imageId } = await params;
    const image = await (Image as any).findByIdAndDelete(imageId) as any;
    
    if (!image) {
      return new NextResponse('Image not found', { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
