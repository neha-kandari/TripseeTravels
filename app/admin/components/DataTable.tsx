'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DataTableProps {
  data: any[];
  type: 'packages' | 'itineraries';
  onDelete: (id: string) => void;
  destination?: string; // Add destination prop for proper routing
}

const DataTable: React.FC<DataTableProps> = ({ data, type, onDelete, destination }) => {
  const renderPackageRow = (item: any, index: number) => (
    <div key={item.id || `package-${index}`} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex min-h-52">
        {/* Image Section - Left Side */}
        <div className="relative w-2/5 overflow-hidden">
          <Image
            src={item.image}
            alt={item.title || item.name || 'Package Image'}
            fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Fallback placeholder */}
          <div className="hidden absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-l-2xl items-center justify-center">
            <span className="text-2xl">🏝️</span>
          </div>
        </div>

        {/* Details Section - Right Side */}
        <div className="w-3/5 p-5 bg-gray-50 flex flex-col">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">{item.title || item.name}</h3>
            <p className="text-sm text-gray-600 mb-2 font-medium">{item.days || item.duration}</p>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">{item.features ? item.features.join(', ') : item.inclusions}</p>
            <p className="text-lg font-bold text-orange-600">{item.price}</p>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              {item.id && item.destination ? (
                <Link
                  href={`/admin/destinations/${item.destination}/packages/edit/${item.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 whitespace-nowrap shadow-sm hover:shadow-md"
                >
                  ✏️ Edit
                </Link>
              ) : (
                <span className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed whitespace-nowrap shadow-sm">
                  ✏️ Edit (No ID)
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400 ml-3 bg-gray-100 px-2 py-1 rounded">
              {new Date(item.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderItineraryRow = (item: any, index: number) => (
    <div key={item.id || `itinerary-${index}`} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{item.destination}</p>
            <p className="text-sm text-gray-500 mb-2">{item.duration}</p>
            <p className="text-gray-700">{item.overview}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Days: {item.days.length}</p>
            <p className="text-sm text-gray-500">Updated: {new Date(item.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Link
              href={item.id.startsWith('bali-') && (item.id.includes('premium-') || item.id.includes('honeymoon-') || item.id.includes('basic-') || item.id.includes('gili-')) 
                ? `/admin/destinations/bali/packages/edit/${item.id}` 
                : `/admin/destinations/bali/packages/${item.id}`}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
            >
              Edit
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            {item.days.length} day{item.days.length !== 1 ? 's' : ''} itinerary
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No {type} found.</p>
          <Link
            href={`/admin/${type}/new`}
            className="mt-4 inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200"
          >
            Create New {type.slice(0, -1)}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {type === 'packages' 
            ? data.map((item, index) => renderPackageRow(item, index))
            : data.map((item, index) => renderItineraryRow(item, index))
          }
        </div>
      )}
    </div>
  );
};

export default DataTable; 