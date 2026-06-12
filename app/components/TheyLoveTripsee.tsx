'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const googleReviews = [
  {
    name: 'Priya & Arjun Sharma',
    trip: 'Bali Romantic Escape',
    date: 'November 2023',
    content: 'Bali was a dream come true! The private pool villa in Ubud was surrounded by lush rice terraces. The floating breakfast and couple\'s spa treatments were highlights. Tripsee\'s local guides showed us hidden gems we never would have found on our own.',
    rating: 5,
    image: '/testimonials/priya.jpg',
    verified: true
  },
  {
    name: 'Rajesh & Meera Kumar',
    trip: 'Vietnam Cultural Journey',
    date: 'December 2023',
    content: 'Our Vietnam adventure was incredible! Ha Long Bay cruise was magical, Hoi An lanterns were enchanting, and the local food tours were unforgettable. Tripsee\'s attention to detail made every moment special.',
    rating: 5,
    image: '/testimonials/rajesh.jpg',
    verified: true
  },
  {
    name: 'Anita & Vikram Patel',
    trip: 'Maldives Luxury Getaway',
    date: 'January 2024',
    content: 'Maldives exceeded all expectations! The overwater villa was stunning, water sports were thrilling, and the spa treatments were heavenly. Tripsee\'s all-inclusive package was worth every penny.',
    rating: 5,
    image: '/testimonials/anita.jpg',
    verified: true
  },
  {
    name: 'Vikram & Priya Singh',
    trip: 'Singapore Family Adventure',
    date: 'February 2024',
    content: 'Perfect family vacation to Singapore! Universal Studios, Gardens by the Bay, and Sentosa Island were all amazing. Tripsee arranged everything perfectly including family-friendly hotels.',
    rating: 5,
    image: '/testimonials/vikram.jpg',
    verified: true
  },
  {
    name: 'Meera & Arjun Reddy',
    trip: 'Thailand Cultural Experience',
    date: 'March 2024',
    content: 'Our Thailand tour was culturally enriching! Bangkok temples, Ayutthaya ruins, and Chiang Mai old city were fascinating. The cooking class in Hoi An was a highlight.',
    rating: 5,
    image: '/testimonials/meera.jpg',
    verified: true
  },
  {
    name: 'Arjun & Meera Mehta',
    trip: 'Dubai Luxury Experience',
    date: 'April 2024',
    content: 'Tripsee delivered an unforgettable Dubai experience! Burj Khalifa views, desert safari adventure, and Palm Jumeirah luxury were all spectacular. The 5-star hotel exceeded expectations.',
    rating: 5,
    image: '/testimonials/arjun.jpg',
    verified: true
  },
  {
    name: 'Priya & Rajesh Sharma',
    trip: 'Andamans Island Hopping',
    date: 'May 2024',
    content: 'Andamans was a tropical paradise! Havelock Island beaches, Port Blair history, and Neil Island tranquility were perfect. Tripsee\'s island hopping package was perfectly organized.',
    rating: 5,
    image: '/testimonials/priya.jpg',
    verified: true
  },
  {
    name: 'Vikram & Anita Kumar',
    trip: 'Malaysia Heritage Tour',
    date: 'June 2024',
    content: 'Malaysia heritage tour was fascinating! Kuala Lumpur modernity, Penang culture, and Malacca history were perfectly balanced. Tripsee\'s local insights made it special.',
    rating: 5,
    image: '/testimonials/vikram.jpg',
    verified: true
  }
];

// Destination images for the carousel
const destinationImages = [
  {
    src: '/Destination/Bali.webp',
    alt: 'Bali - Island of the Gods',
    name: 'Bali',
    description: 'Island of the Gods'
  },
  {
    src: '/mystical_coastline/veitnam.webp',
    alt: 'Vietnam - Land of the Ascending Dragon',
    name: 'Vietnam',
    description: 'Land of the Ascending Dragon'
  },
  {
    src: '/mystical_coastline/singapore.webp',
    alt: 'Singapore - Lion City',
    name: 'Singapore',
    description: 'Lion City'
  },
  {
    src: '/mystical_coastline/thailand.webp',
    alt: 'Thailand - Land of Smiles',
    name: 'Thailand',
    description: 'Land of Smiles'
  },
  {
    src: '/mystical_coastline/malaysia.webp',
    alt: 'Malaysia - Truly Asia',
    name: 'Malaysia',
    description: 'Truly Asia'
  },
  {
    src: '/mystical_coastline/dubai.webp',
    alt: 'Dubai - City of Gold',
    name: 'Dubai',
    description: 'City of Gold'
  },
  {
    src: '/mystical_coastline/Maldives.webp',
    alt: 'Maldives - Tropical Paradise',
    name: 'Maldives',
    description: 'Tropical Paradise'
  },
  {
    src: '/mystical_coastline/andaman.webp',
    alt: 'Andamans - Island Archipelago',
    name: 'Andamans',
    description: 'Island Archipelago'
  }
];

const TheyLoveTripsee = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Auto-carousel effect for destination images and reviews (synchronized)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % destinationImages.length);
      setCurrentReviewIndex((prev) => (prev + 1) % googleReviews.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-medium">⭐ Trusted by 2,847+ travelers</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 font-limelight">
            They Love Tripsee
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover why thousands of travelers choose us for their dream vacations
          </p>
          
          {/* Google Reviews Badge */}
          <div className="flex items-center justify-center mt-8 space-x-3">
            <div className="flex items-center space-x-1 bg-white px-4 py-2 rounded-full shadow-lg">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <span className="text-gray-900 font-bold text-lg ml-2">4.9</span>
            </div>
            <span className="text-gray-600 font-medium">(2,847 Google Reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Destination Image Carousel */}
          <div className="relative">
            <div className="relative w-full h-[500px] rounded[250px] overflow-hidden shadow-2xl">
              {/* Destination Image */}
              <Image
                src={destinationImages[currentImageIndex].src}
                alt={destinationImages[currentImageIndex].alt}
                fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-all duration-1000 ease-in-out"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
              />
              
              {/* Image Overlay with Destination Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-3xl font-bold mb-2 drop-shadow-lg font-limelight">
                  {destinationImages[currentImageIndex].name}
                </h3>
                <p className="text-lg opacity-90 drop-shadow-lg">
                  {destinationImages[currentImageIndex].description}
                </p>
              </div>

              {/* Image Navigation Dots - Hidden */}
              {/* <div className="absolute top-6 right-6">
                <div className="flex space-x-2">
                  {destinationImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        index === currentImageIndex 
                          ? 'bg-white scale-125 shadow-lg' 
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div> */}
            </div>
          </div>

          {/* Right Side - Single Review Card */}
          <div className="space-y-8">
            {/* Review Navigation Dots */}
            <div className="flex justify-center space-x-3 mb-6">
              {googleReviews.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index === currentReviewIndex 
                      ? 'bg-orange-500 scale-125 shadow-lg' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Single Review Card - Matching Image Design */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 transition-all duration-1000 ease-in-out">
                <div className="space-y-4">
                  {/* Reviewer Information */}
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {googleReviews[currentReviewIndex].name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg font-limelight">
                        {googleReviews[currentReviewIndex].name}
                      </h4>
                      <p className="text-orange-500 font-semibold text-base">
                        {googleReviews[currentReviewIndex].trip}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {googleReviews[currentReviewIndex].date}
                      </p>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex space-x-1">
                    {[...Array(googleReviews[currentReviewIndex].rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  
                  {/* Review Content */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-gray-700 leading-relaxed text-base italic">
                      "{googleReviews[currentReviewIndex].content}"
                    </p>
                  </div>
                  
                  {/* Verification Badge */}
                  <div className="flex justify-start">
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Verified Traveler
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheyLoveTripsee; 