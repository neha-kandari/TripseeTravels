'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const destinations = [
  {
    name: 'Bali',
    subtitle: 'Island of the Gods',
    image: '/mystical_coastline/Bali.webp',
    overlayColor: 'from-blue-400/80 to-cyan-500/80',
    path: '/destination/bali'
  },
  {
    name: 'Vietnam',
    subtitle: 'Timeless Charm',
    image: '/mystical_coastline/veitnam.webp',
    overlayColor: 'from-green-600/80 to-gray-700/80',
    path: '/destination/vietnam'
  },
  {
    name: 'Andaman',
    subtitle: "India's Hidden Paradise",
    image: '/mystical_coastline/andaman.webp',
    overlayColor: 'from-orange-500/80 to-amber-600/80',
    path: '/destination/andaman'
  },
  {
    name: 'Thailand',
    subtitle: 'Land of Smiles',
    image: '/mystical_coastline/thailand.webp',
    overlayColor: 'from-purple-500/80 to-pink-600/80',
    path: '/destination/thailand'
  },
  {
    name: 'Singapore',
    subtitle: 'Modern Marvel',
    image: '/mystical_coastline/singapore.webp',
    overlayColor: 'from-indigo-500/80 to-blue-600/80',
    path: '/destination/singapore'
  },
  {
    name: 'Malaysia',
    subtitle: 'Cultural Fusion',
    image: '/mystical_coastline/malaysia.webp',
    overlayColor: 'from-teal-500/80 to-green-600/80',
    path: '/destination/malaysia'
  },
  {
    name: 'Dubai',
    subtitle: 'Desert Dreams',
    image: '/mystical_coastline/dubai.webp',
    overlayColor: 'from-yellow-500/80 to-orange-600/80',
    path: '/destination/dubai'
  },
  {
    name: 'Maldives',
    subtitle: 'Ocean Serenity',
    image: '/mystical_coastline/Maldives.webp',
    overlayColor: 'from-cyan-500/80 to-blue-600/80',
    path: '/destination/maldives'
  }
];

const MysticCoastline = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const next = prev + 3;
      return next >= destinations.length ? 0 : next;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const next = prev - 3;
      return next < 0 ? Math.max(0, destinations.length - 3) : next;
    });
  };

  // Ensure we always show exactly 3 destinations, padding with the first ones if needed
  const getVisibleDestinations = () => {
    const start = currentIndex;
    const end = start + 3;
    let visible = destinations.slice(start, end);
    
    // If we don't have 3 destinations, wrap around to the beginning
    if (visible.length < 3) {
      const remaining = 3 - visible.length;
      visible = [...visible, ...destinations.slice(0, remaining)];
    }
    
    return visible;
  };

  const visibleDestinations = getVisibleDestinations();


  return (
    <section className="py-16 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 mb-2 font-limelight">
            Mystical Coastline
          </h2>
          <p className="text-orange-600 text-lg md:text-xl font-medium font-merienda">
            Breathe the Warm Breeze of the Tropics
          </p>
        </div>

        {/* Destination Cards */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {visibleDestinations.map((destination, index) => (
              <div
                key={`${destination.name}-${currentIndex}-${index}`}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <Link href={destination.path} className="block">
                  <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      onError={() => {
                        console.error(`Failed to load image: ${destination.image}`);
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${destination.overlayColor} via-transparent to-transparent`}></div>
                    
                    {/* Text Overlay */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-center">
                      <p className="text-sm font-medium opacity-90 mb-1 font-merienda">
                        {destination.subtitle}
                      </p>
                      <h3 className="text-2xl md:text-3xl font-bold font-limelight">
                        {destination.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center items-center space-x-3 md:space-x-4">
            <button
              onClick={prevSlide}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-400 hover:bg-orange-500 transition-colors duration-300 flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label="Previous destinations"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-400 hover:bg-orange-500 transition-colors duration-300 flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label="Next destinations"
            >
              ›
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-4 md:mt-6 space-x-1.5 md:space-x-2">
            {Array.from({ length: Math.ceil(destinations.length / 3) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * 3)}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${
                  currentIndex === i * 3 ? 'bg-orange-500' : 'bg-orange-300'
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MysticCoastline; 