import { processImageData as mongoProcessImageData } from '@/lib/imageUtils';

/**
 * Enhanced image processing utility for admin uploads
 * Now uses MongoDB for persistent storage instead of local filesystem
 */
export const processImageData = async (
  image: string | null | undefined, 
  destination: string = 'default',
  packageId?: string
): Promise<string> => {
  // Use the MongoDB-based image processing
  return await mongoProcessImageData(image, destination, packageId);
};

// Re-export MongoDB-based utilities
export { 
  getImageFromMongoDB, 
  deleteImageFromMongoDB, 
  getOptimizedImageUrl, 
  validateImagePath 
} from '@/lib/imageUtils';
