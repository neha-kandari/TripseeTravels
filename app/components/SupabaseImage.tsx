'use client';

import React, { memo, useState } from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl, getResponsiveImageUrls } from '@/lib/supabaseImageUtils';

interface SupabaseImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const SupabaseImage = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  fill = false,
  quality = 80,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError
}: SupabaseImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate responsive URLs
  const responsiveUrls = getResponsiveImageUrls(src);
  
  // Generate optimized URL with specified dimensions
  const optimizedSrc = getOptimizedImageUrl(src, {
    width: width || 800,
    height: height,
    quality,
    format: 'webp'
  });

  // Generate blur placeholder
  const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  // If image failed to load, show fallback
  if (imageError) {
    return (
      <div 
        className={`${className} bg-gray-200 flex items-center justify-center`}
        style={fill ? {} : { width, height }}
      >
        <div className="text-gray-500 text-sm">Image not available</div>
      </div>
    );
  }

  const imageProps = {
    src: optimizedSrc,
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    priority,
    quality,
    placeholder: placeholder as 'blur' | 'empty',
    blurDataURL: blurDataURL || defaultBlurDataURL,
    onLoad: handleLoad,
    onError: handleError,
    ...(fill ? { fill: true } : { width, height }),
    ...(sizes && { sizes })
  };

  return (
    <div className="relative">
      <Image {...imageProps} />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
});

SupabaseImage.displayName = 'SupabaseImage';

export default SupabaseImage;
