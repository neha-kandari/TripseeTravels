import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Image from '@/lib/models/Image';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, fileName, destination } = body;

    if (!imageData || !fileName) {
      return NextResponse.json({ error: 'Image data and filename are required' }, { status: 400 });
    }

    // Check if it's a data URL
    if (!imageData.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image data format' }, { status: 400 });
    }

    // Extract file extension from data URL
    const matches = imageData.match(/data:image\/([a-zA-Z]+);base64,(.+)/);
    if (!matches) {
      return NextResponse.json({ error: 'Invalid data URL format' }, { status: 400 });
    }

    const [, extension, base64Data] = matches;
    const buffer = Buffer.from(base64Data, 'base64');

    // Connect to MongoDB
    await connectDB();

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const filename = `package_${timestamp}_${randomSuffix}.${extension}`;
    
    // Remove existing extension from filename if it exists
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Save image to MongoDB
    const imageDoc = new Image({
      filename,
      originalName: `${sanitizedFileName}.${extension}`,
      contentType: `image/${extension}`,
      size: buffer.length,
      data: buffer,
      destination: destination || 'packages',
      uploadedBy: 'admin'
    });
    
    const savedImage = await imageDoc.save();

    // Return the MongoDB image path
    const publicPath = `/api/images/${savedImage._id}`;

    return NextResponse.json({ 
      success: true, 
      imagePath: publicPath,
      fileName: filename,
      imageId: savedImage._id.toString(),
      imageType: 'mongodb'
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
} 