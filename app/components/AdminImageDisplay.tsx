'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AdminImageDisplayProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

const AdminImageDisplay: React.FC<AdminImageDisplayProps> = ({
  src,
  alt,
  className = "w-20 h-20 rounded-lg object-cover",
  width = 80,
  height = 80,
  fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'
}) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    if (!imageError) {
      setImageError(true);
      if (fallbackSrc && fallbackSrc !== currentSrc) {
        setCurrentSrc(fallbackSrc);
      }
    }
  };

  // If it's a data URL, MongoDB image, or starts with /uploads/, use regular img tag
  if (src.startsWith('data:image/') || src.startsWith('/uploads/') || src.startsWith('/api/images/')) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onError={handleError}
        style={{ width, height }}
      />
    );
  }

  // For other images, use Next.js Image component
  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized={src.startsWith('/uploads/') || src.startsWith('/api/images/')}
      priority={false}
    />
  );
};

export default AdminImageDisplay;
