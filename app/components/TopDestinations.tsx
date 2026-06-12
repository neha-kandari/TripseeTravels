import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const DEFAULT_DESTINATIONS = [
  { name: 'Bali', description: 'Island Paradise', image: '/Destination/bali/Bali1.webp', path: '/destination/bali' },
  { name: 'Vietnam', description: 'Timeless Charm', image: '/Destination/Vietnam.webp', path: '/destination/vietnam' },
  { name: 'Singapore', description: 'Modern Marvel', image: '/Destination/Singapore.webp', path: '/destination/singapore' },
  { name: 'Thailand', description: 'Land of Smiles', image: '/Destination/Thailand.webp', path: '/destination/thailand' },
  { name: 'Malaysia', description: 'Cultural Fusion', image: '/Destination/Malasia.webp', path: '/destination/malaysia' },
  { name: 'Dubai', description: 'Desert Dreams', image: '/Destination/Dubai.webp', path: '/destination/dubai' },
  { name: 'Maldives', description: 'Ocean Serenity', image: '/Destination/Maldives.webp', path: '/destination/maldives' },
  { name: 'Andaman', description: 'Tropical Bliss', image: '/Destination/andaman.webp', path: '/destination/andaman' }
];

interface TopDestinationsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

const TopDestinations = ({ initialData }: TopDestinationsProps) => {
  const serverDestinations = initialData?.topDestinations;
  const destinations =
    serverDestinations?.length > 0 ? serverDestinations : DEFAULT_DESTINATIONS;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <div className="text-orange-500 text-2xl md:text-3xl lg:text-4xl font-arizonia mb-1">top</div>
            <div className="text-gray-800 -mt-1 md:-mt-2">Destinations</div>
          </h2>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed px-4">
            It&apos;s hard enough deciding to move, you don&apos;t have to worry about where to move to.
            These are some of the most popular and best locations to move to based on a number of factors.
          </p>
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <Link
              key={index}
              href={destination.path}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64">
                  <Image
                    src={destination.image || '/Destination/Bali.webp'}
                    alt={destination.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />

                  {/* Base Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Orange Translucent Overlay - Visible on Hover */}
                  <div className="absolute inset-0 bg-orange-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                  {/* Destination Name and Description - Always Visible */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                    <h3 className="text-white text-2xl font-bold font-limelight mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-white/90 text-sm font-medium italic">
                      {destination.description}
                    </p>
                  </div>

                  {/* View Package Button - Visible on Hover */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="bg-gradient-to-b from-orange-400 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 whitespace-nowrap">
                      View Package
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDestinations;