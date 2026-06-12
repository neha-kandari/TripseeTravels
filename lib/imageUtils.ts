import sharp from 'sharp';
import connectDB from './mongoose';
import Image from './models/Image';
import Package from './models/Package';

/**
 * Optimized image processing utility for MongoDB storage
 * Handles both data URLs and file uploads with MongoDB persistence
 * Performance optimizations: reduced DB calls, better error handling, async operations
 */
export const processImageData = async (
  image: string | null | undefined, 
  destination: string = 'default',
  packageId?: string
): Promise<string> => {
  if (!image) {
    return getFallbackImage(destination);
  }
  
  // If it's a data URL, save it to MongoDB
  if (image.startsWith('data:image/')) {
    try {
      // Extract file extension and data from data URL
      const matches = image.match(/data:image\/([a-zA-Z]+);base64,(.+)/);
      if (!matches) {
        return getFallbackImage(destination);
      }

      const [, extension, base64Data] = matches;
      const rawBuffer = Buffer.from(base64Data, 'base64');

      // Check image size before processing (fail fast)
      const imageSizeKB = Math.round(rawBuffer.length / 1024);
      if (imageSizeKB > 5000) { // 5MB limit
        console.warn(`Image too large: ${imageSizeKB}KB, using fallback`);
        return getFallbackImage(destination);
      }

      // Convert to WebP for consistent format and smaller file size
      const buffer = await sharp(rawBuffer).webp({ quality: 85 }).toBuffer();

      // Connect to DB only when needed
      await connectDB();

      // Generate unique filename
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const filename = `pkg_${timestamp}_${randomSuffix}.webp`;

      // Save image to MongoDB with optimized data structure
      const imageDoc = new Image({
        filename,
        originalName: `package_image.webp`,
        contentType: `image/webp`,
        size: buffer.length,
        data: buffer,
        destination,
        uploadedBy: 'admin',
        createdAt: new Date()
      });
      
      const savedImage = await imageDoc.save();
      
      // If packageId is provided, update the package with the image reference
      if (packageId) {
        // Use updateOne for better performance than findByIdAndUpdate
        await (Package as any).updateOne(
          { _id: packageId },
          {
            $set: {
              image: `/api/images/${savedImage._id}`,
              imageType: 'mongodb',
              imageId: savedImage._id.toString(),
              originalImageName: savedImage.originalName,
              imageSize: savedImage.size,
              updatedAt: new Date()
            }
          }
        ).exec();
      }
      
      return `/api/images/${savedImage._id}`;
    } catch (error) {
      console.error('Error processing image data:', error);
      return getFallbackImage(destination);
    }
  }
  
  // Normalize regular image paths (optimized)
  let normalizedPath = image;
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath;
  }
  
  // Remove query parameters
  if (normalizedPath.includes('?')) {
    normalizedPath = normalizedPath.split('?')[0];
  }
  
  // Check if path is valid
  if (normalizedPath === '/' || normalizedPath === '/null' || normalizedPath === '/undefined') {
    return getFallbackImage(destination);
  }
  
  return normalizedPath;
};

/**
 * Get fallback image for a destination
 */
const getFallbackImage = (destination: string): string => {
  const fallbackImages: { [key: string]: string } = {
    bali: '/Destination/Bali.webp',
    thailand: '/Destination/Thailand.webp',
    vietnam: '/Destination/Vietnam.webp',
    singapore: '/Destination/Singapore.webp',
    malaysia: '/Destination/Malasia.webp',
    dubai: '/Destination/Dubai.webp',
    andaman: '/Destination/andaman.webp',
    maldives: '/Destination/Maldives.webp',
    default: '/assets/flaticon.webp'
  };
  return fallbackImages[destination] || fallbackImages.default;
};

/**
 * Get image from MongoDB by ID
 */
export const getImageFromMongoDB = async (imageId: string) => {
  try {
    await connectDB();
    const image = await (Image as any).findById(imageId).exec();
    return image;
  } catch (error) {
    console.error('Error fetching image from MongoDB:', error);
    return null;
  }
};

/**
 * Delete image from MongoDB
 */
export const deleteImageFromMongoDB = async (imageId: string) => {
  try {
    await connectDB();
    await (Image as any).findByIdAndDelete(imageId).exec();
    console.log(`Image deleted from MongoDB: ${imageId}`);
    return true;
  } catch (error) {
    console.error('Error deleting image from MongoDB:', error);
    return false;
  }
};

/**
 * Get optimized image URL with fallback
 */
export const getOptimizedImageUrl = (imagePath: string, fallbackPath?: string): string => {
  // If it's a MongoDB image path, return as is
  if (imagePath.startsWith('/api/images/')) {
    return imagePath;
  }
  
  // If it's a data URL, return as is
  if (imagePath.startsWith('data:image/')) {
    return imagePath;
  }
  
  // For other paths, ensure they start with /
  if (!imagePath.startsWith('/')) {
    return '/' + imagePath;
  }
  
  return imagePath;
};

/**
 * Validate if an image path exists and is accessible
 */
export const validateImagePath = async (imagePath: string): Promise<boolean> => {
  try {
    if (imagePath.startsWith('/api/images/')) {
      const imageId = imagePath.replace('/api/images/', '');
      const image = await getImageFromMongoDB(imageId);
      return !!image;
    }
    return true; // Assume other paths are valid
  } catch (error) {
    console.error(`Image validation failed for ${imagePath}:`, error);
    return false;
  }
};
