'use client';

import { useEffect } from 'react';

interface ImagePreloaderProps {
  images: string[];
  priority?: boolean;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ images, priority = false }) => {
  useEffect(() => {
    if (!priority) return;

    const preloadImages = () => {
      images.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Preload on component mount
    preloadImages();

    // Cleanup function
    return () => {
      const links = document.querySelectorAll('link[rel="preload"][as="image"]');
      links.forEach((link) => {
        if (images.includes(link.getAttribute('href') || '')) {
          document.head.removeChild(link);
        }
      });
    };
  }, [images, priority]);

  return null;
};

export default ImagePreloader;
