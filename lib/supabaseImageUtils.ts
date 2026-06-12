import { supabase, BUCKETS, IMAGE_OPTIMIZATION } from './supabase';

export interface ImageUploadResult {
  url: string;
  path: string;
  size: number;
  width?: number;
  height?: number;
}

export interface ImageOptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * Upload image to Supabase Storage with optimization
 */
export async function uploadImageToSupabase(
  file: File | Blob,
  path: string,
  options: ImageOptimizationOptions = {}
): Promise<ImageUploadResult> {
  try {
    // Generate optimized filename
    const timestamp = Date.now();
    const extension = options.format || 'webp';
    const optimizedPath = `${path}/${timestamp}.${extension}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKETS.IMAGES)
      .upload(optimizedPath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKETS.IMAGES)
      .getPublicUrl(optimizedPath);

    return {
      url: urlData.publicUrl,
      path: optimizedPath,
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    throw error;
  }
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedImageUrl(
  imagePath: string,
  options: ImageOptimizationOptions = {}
): string {
  const {
    width = IMAGE_OPTIMIZATION.SIZES.MEDIUM,
    height,
    quality = IMAGE_OPTIMIZATION.QUALITY,
    format = 'webp',
    resize = 'cover'
  } = options;

  // If it's already a Supabase URL, return as is
  if (imagePath.includes('supabase.co')) {
    return imagePath;
  }

  // If it's a local path, construct Supabase URL
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = BUCKETS.IMAGES;
  
  let url = `${baseUrl}/storage/v1/object/public/${bucket}/${imagePath}`;
  
  // Add transformation parameters
  const params = new URLSearchParams();
  params.set('width', width.toString());
  if (height) params.set('height', height.toString());
  params.set('quality', quality.toString());
  params.set('format', format);
  params.set('resize', resize);
  
  return `${url}?${params.toString()}`;
}

/**
 * Generate multiple image sizes for responsive loading
 */
export function getResponsiveImageUrls(imagePath: string): {
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  xlarge: string;
} {
  return {
    thumbnail: getOptimizedImageUrl(imagePath, { 
      width: IMAGE_OPTIMIZATION.SIZES.THUMBNAIL,
      quality: 60
    }),
    small: getOptimizedImageUrl(imagePath, { 
      width: 640,
      quality: 70
    }),
    medium: getOptimizedImageUrl(imagePath, { 
      width: IMAGE_OPTIMIZATION.SIZES.MEDIUM,
      quality: 80
    }),
    large: getOptimizedImageUrl(imagePath, { 
      width: IMAGE_OPTIMIZATION.SIZES.LARGE,
      quality: 85
    }),
    xlarge: getOptimizedImageUrl(imagePath, { 
      width: IMAGE_OPTIMIZATION.SIZES.XLARGE,
      quality: 90
    })
  };
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImageFromSupabase(imagePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(BUCKETS.IMAGES)
      .remove([imagePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image from Supabase:', error);
    return false;
  }
}

/**
 * Upload video to Supabase Storage
 */
export async function uploadVideoToSupabase(
  file: File | Blob,
  path: string
): Promise<ImageUploadResult> {
  try {
    const timestamp = Date.now();
    const extension = file.type.split('/')[1] || 'mp4';
    const videoPath = `${path}/${timestamp}.${extension}`;

    const { data, error } = await supabase.storage
      .from(BUCKETS.VIDEOS)
      .upload(videoPath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Video upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from(BUCKETS.VIDEOS)
      .getPublicUrl(videoPath);

    return {
      url: urlData.publicUrl,
      path: videoPath,
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading video to Supabase:', error);
    throw error;
  }
}

/**
 * Get video thumbnail URL (if generated)
 */
export function getVideoThumbnailUrl(videoPath: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = BUCKETS.THUMBNAILS;
  
  // Remove file extension and add .jpg
  const thumbnailPath = videoPath.replace(/\.[^/.]+$/, '.jpg');
  
  return `${baseUrl}/storage/v1/object/public/${bucket}/${thumbnailPath}`;
}
