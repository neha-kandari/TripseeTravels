import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket names
export const BUCKETS = {
  IMAGES: 'images',
  VIDEOS: 'videos',
  THUMBNAILS: 'thumbnails'
} as const;

// Image optimization settings
export const IMAGE_OPTIMIZATION = {
  QUALITY: 80,
  FORMATS: ['webp', 'avif'],
  SIZES: {
    THUMBNAIL: 300,
    MEDIUM: 800,
    LARGE: 1200,
    XLARGE: 1920
  }
} as const;

// Video optimization settings
export const VIDEO_OPTIMIZATION = {
  QUALITY: 'medium',
  FORMATS: ['mp4', 'webm'],
  THUMBNAIL_GENERATION: true
} as const;
