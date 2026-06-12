'use client';

import React from 'react';
import Link from 'next/link';
import AdminLayout from '../components/AdminLayout';

const destinations = [
  { 
    id: 'bali', 
    name: 'Bali', 
    country: 'Indonesia',
    image: '/mystical_coastline/Bali.webp',
    description: 'The Island of the Gods, known for its beautiful beaches, rich culture, and spiritual atmosphere.'
  },
  { 
    id: 'vietnam', 
    name: 'Vietnam', 
    country: 'Vietnam',
    image: '/Destination/Vietnam/Halong Bay.webp',
    description: 'A country of breathtaking natural beauty with a complex history and fascinating culture.'
  },
  { 
    id: 'singapore', 
    name: 'Singapore', 
    country: 'Singapore',
    image: '/mystical_coastline/singapore.webp',
    description: 'A modern city-state known for its clean streets, futuristic architecture, and diverse culture.'
  },
  { 
    id: 'thailand', 
    name: 'Thailand', 
    country: 'Thailand',
    image: '/mystical_coastline/thailand.webp',
    description: 'Land of smiles, offering stunning beaches, vibrant cities, and rich cultural heritage.'
  },
  { 
    id: 'malaysia', 
    name: 'Malaysia', 
    country: 'Malaysia',
    image: '/mystical_coastline/malaysia.webp',
    description: 'A melting pot of cultures with diverse landscapes, from bustling cities to pristine rainforests.'
  },
  { 
    id: 'dubai', 
    name: 'Dubai', 
    country: 'UAE',
    image: '/mystical_coastline/dubai.webp',
    description: 'The city of gold, featuring modern architecture, luxury shopping, and desert adventures.'
  },
  { 
    id: 'maldives', 
    name: 'Maldives', 
    country: 'Maldives',
    image: '/mystical_coastline/Maldives.webp',
    description: 'Paradise on earth with crystal clear waters, white sandy beaches, and luxurious overwater villas.'
  },
  { 
    id: 'andaman', 
    name: 'Andaman', 
    country: 'India',
    image: '/mystical_coastline/andaman.webp',
    description: 'Pristine islands with crystal clear waters, white sandy beaches, and rich marine life.'
  }
];

const DestinationsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Destinations</h1>
          <p className="text-gray-600 mt-2">Create and manage packages for all destinations</p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Use a data URI for a simple gray placeholder instead of a file that doesn't exist
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                  }}
                />
                <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {destination.country}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{destination.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{destination.description}</p>
                
                <div className="flex flex-col space-y-3">
                  <Link
                    href={`/admin/destinations/${destination.id}`}
                    className="w-full bg-orange-500 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Manage Packages
                  </Link>
                  <Link
                    href={`/admin/destinations/${destination.id}/itineraries`}
                    className="w-full bg-white text-gray-800 text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 border border-gray-300 shadow-md hover:shadow-lg"
                  >
                    Manage Itineraries
                  </Link>
                  <Link
                    href={`/admin/destinations/${destination.id}/packages/new`}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-center"
                  >
                    + Add Package
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
};

export default DestinationsPage; 