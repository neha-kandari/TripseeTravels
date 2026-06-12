'use client';

import React, { useState, useEffect } from 'react';

interface HotelSectionProps {
  hotelName: string;
  hotelRating?: string;
  hotelDescription?: string;
  hotelImages?: {
    src: string;
    alt: string;
    name: string;
    description: string;
  }[];
}

const HotelSection: React.FC<HotelSectionProps> = ({ 
  hotelName, 
  hotelRating = '3', 
  hotelDescription,
  hotelImages = []
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Default hotel images if none provided
  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Hotel Exterior",
      name: "Hotel Exterior View",
      description: "Beautiful hotel facade with modern architecture"
    },
    {
      src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Luxury Room",
      name: "Deluxe Room",
      description: "Spacious room with premium amenities and city view"
    },
    {
      src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
      alt: "Swimming Pool",
      name: "Infinity Pool",
      description: "Stunning infinity pool with panoramic views"
    },
    {
      src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Hotel Lobby",
      name: "Grand Lobby",
      description: "Elegant lobby with sophisticated design"
    },
    {
      src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Restaurant",
      name: "Fine Dining Restaurant",
      description: "World-class dining experience with local cuisine"
    },
    {
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Spa & Wellness",
      name: "Spa & Wellness Center",
      description: "Relaxing spa treatments and wellness facilities"
    }
  ];

  // Use provided images or fall back to defaults
  const imagesToUse = hotelImages.length > 0 ? hotelImages : defaultImages;

  // Auto-rotate carousel images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imagesToUse.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [imagesToUse.length]);

  return (
    <div className="mb-8">
      <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center font-limelight">
        <span className="mr-3">🏨</span>
        Hotel Information
      </h4>
      
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Hotel Image Carousel */}
        <div className="relative">
          <div className="h-80 bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
            {/* Main Carousel Display */}
            {imagesToUse.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentImageIndex 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {/* Image Overlay with Hotel Name and Description */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                  <h5 className="text-2xl font-bold text-white mb-2 font-limelight">{image.name}</h5>
                  <p className="text-white/90 text-sm">{image.description}</p>
                </div>
              </div>
            ))}
            
            {/* Image Overlay with Rating */}
            <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full flex items-center font-semibold z-10">
              <span className="mr-1">⭐</span>
              {hotelRating}/5
            </div>

            {/* Hotel Name Badge */}
            <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold z-10">
              {hotelName}
            </div>

            {/* Carousel Navigation Arrows */}
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + imagesToUse.length) % imagesToUse.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-200 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % imagesToUse.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-200 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {imagesToUse.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-orange-500 scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Hotel Details Grid */}
        <div className="p-6">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"> */}
            {/* Hotel Rating Badge */}
            {/* <div className="flex items-center justify-center">
              <div className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold text-lg">
              <span className="mr-1">⭐</span>
               {hotelRating} Star
              </div>
            </div> */}

            {/* Hotel Features */}
            {/* <div className="bg-gray-50 rounded-xl p-4">
              <h6 className="font-semibold text-gray-900 mb-2 font-limelight">Hotel Features</h6>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">🏊‍♂️</span>
                  <span>Swimming Pool</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">🍽️</span>
                  <span>Restaurant</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">🚗</span>
                  <span>Free Parking</span>
                </div>
              </div>
            </div> */}
          {/* </div> */}

          {/* Expandable Hotel Description */}
          <div className="border-t border-gray-200 pt-6">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h6 className="text-lg font-semibold text-gray-900 font-limelight">Hotel Description & Amenities</h6>
                <span className="text-orange-500 group-open:rotate-180 transition-transform duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 space-y-4">
                {hotelDescription && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h6 className="font-medium text-gray-900 mb-2 font-limelight">Description</h6>
                    <p className="text-gray-700">{hotelDescription}</p>
                  </div>
                )}
                
                {/* Hotel Image Gallery Grid */}
                <div>
                  <h6 className="font-medium text-gray-900 mb-3 font-limelight">Hotel Gallery</h6>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {imagesToUse.map((image, index) => (
                      <div key={index} className="relative group cursor-pointer" onClick={() => setCurrentImageIndex(index)}>
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-24 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                          <p className="text-white text-xs font-medium text-center px-2">{image.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Room Details */}
                {/* <div className="bg-green-50 rounded-xl p-4">
                  <h6 className="font-medium text-gray-900 mb-2 font-limelight">Room Information</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Room Type</p>
                      <p className="font-medium text-gray-900">Deluxe Room with Balcony</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Bed Configuration</p>
                      <p className="font-medium text-gray-900">1 King Bed or 2 Twin Beds</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Room Size</p>
                      <p className="font-medium text-gray-900">35 sqm</p>
                    </div>
                    <div>
                      <p className="text-gray-600">View</p>
                      <p className="font-medium text-gray-900">City View</p>
                    </div>
                  </div>
                </div> */}

                {/* Additional Amenities */}
                {/* <div className="bg-purple-50 rounded-xl p-4">
                  <h6 className="font-medium text-gray-900 mb-2 font-limelight">Additional Amenities</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <span className="mr-2">🛁</span>
                      <span>Private Bathroom</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📺</span>
                      <span>Flat-screen TV</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">❄️</span>
                      <span>Air Conditioning</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📶</span>
                      <span>Free WiFi</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">☕</span>
                      <span>Tea/Coffee Maker</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🛏️</span>
                      <span>Premium Bedding</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSection; 