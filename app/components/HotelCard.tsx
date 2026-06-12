'use client';

import Image from 'next/image';
import { StarIcon, ChevronDownIcon, ChevronUpIcon, LockClosedIcon } from '@heroicons/react/24/solid';

interface HotelCardProps {
  name: string;
  image: string;
  rating: number;
  maxRating?: number;
  location: string;
  nights: string;
  roomType: string;
  link?: string;
  benefits?: string[];
  isExpanded: boolean;
  onToggle: () => void;
  isAnyCardExpanded: boolean;
}

export const HotelCard: React.FC<HotelCardProps> = ({
  name,
  image,
  rating,
  maxRating = 5,
  location,
  nights,
  roomType,
  link,
  benefits,
  isExpanded,
  onToggle,
  isAnyCardExpanded
}) => {
  // Determine if this card can be expanded
  const canExpand = isExpanded || !isAnyCardExpanded;
  
  return (
    <div className={`border border-amber-200 rounded-lg overflow-hidden mb-4 transition-all duration-300 hover:shadow-lg ${
      isExpanded ? 'bg-amber-50 shadow-lg' : 'bg-amber-50'
    } ${!canExpand && !isExpanded ? 'opacity-75' : ''}`}>
      {/* Initial View - Name and Image Only */}
      <div className="flex items-center p-4">
        {/* Hotel Image */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="80px"
          />
          {/* Rating Overlay */}
          <div className="absolute bottom-1 left-1 bg-white bg-opacity-90 rounded-full px-1.5 py-0.5 flex items-center space-x-1">
            <StarIcon className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-medium text-gray-800">{rating}/{maxRating}</span>
          </div>
          {/* Lock Overlay for locked cards */}
          {!canExpand && !isExpanded && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center">
              <LockClosedIcon className="w-6 h-6 text-gray-600" />
            </div>
          )}
        </div>
        
        {/* Hotel Name */}
        <div className="flex-1 ml-4">
          <h4 className={`font-semibold text-lg ${!canExpand && !isExpanded ? 'text-gray-500' : 'text-gray-900'}`}>
            {name}
          </h4>
        </div>
        
        {/* Expand/Collapse Button */}
        <button
          onClick={() => {
            if (canExpand) {
              onToggle();
            }
          }}
          disabled={!canExpand}
          className={`flex-shrink-0 p-2 rounded-full transition-colors duration-200 ${
            canExpand 
              ? 'hover:bg-amber-100 text-gray-600' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title={!canExpand ? 'Close other card first' : isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : !canExpand ? (
            <LockClosedIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-amber-200 bg-white px-4 pb-4">
          <div className="pt-4 space-y-3">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Location:</span>
                <p className="text-gray-600">{location}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <p className="text-gray-600">{nights}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Room Type:</span>
                <p className="text-gray-600">{roomType}</p>
              </div>
            </div>
            
            {/* Hotel Link */}
            {link && (
              <div className="pt-2">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  View Hotel Details →
                </a>
              </div>
            )}
            
            {/* Benefits */}
            {benefits && benefits.length > 0 && (
              <div className="pt-2">
                <h5 className="font-semibold text-green-700 mb-2 text-sm">✨ COMPLIMENTARY BENEFITS:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelCard; 