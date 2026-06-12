'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import Accordion from '../../../../components/Accordion';
import HotelSection from '../../../../components/HotelSection';

interface Itinerary {
  id: string;
  title: string;
  destination: string;
  duration: string;
  overview: string;
  packageId?: string;
  hotelName?: string;
  hotelRating?: string;
  hotelDescription?: string;
  hotelImages?: {
    src: string;
    alt: string;
    name: string;
    description: string;
  }[];
  days: any[];
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
  updatedAt: string;
}

const DynamicDubaiItineraryPage = () => {
  const params = useParams();
  const router = useRouter();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero images from Dubai
  const sliderImages = [
    {
      src: "/Destination/DubaiHero/Burj Khalifa.webp",
      alt: "Burj Khalifa",
      title: "Burj Khalifa",
      subtitle: "World's tallest building reaching the sky",
      description: "Experience the breathtaking views from the world's tallest building and iconic symbol of Dubai."
    },
    {
      src: "/Destination/DubaiHero/Dubai Fountain.webp", 
      alt: "Dubai Fountain",
      title: "Dubai Fountain",
      subtitle: "Spectacular water and light show",
      description: "Witness the mesmerizing Dubai Fountain show with water dancing to music against the city skyline."
    },
    {
      src: "/Destination/DubaiHero/Desert Safari.webp",
      alt: "Desert Safari",
      title: "Desert Safari",
      subtitle: "Adventure in golden sands",
      description: "Embark on an exciting desert safari with dune bashing, camel rides, and traditional entertainment."
    },
    {
      src: "/Destination/DubaiHero/Dubai Frame.webp",
      alt: "Dubai Frame",
      title: "Dubai Frame",
      subtitle: "Window to Dubai's past and future",
      description: "Step through the iconic Dubai Frame for panoramic views connecting old and new Dubai."
    }
  ];

  // Auto-rotate gallery images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  useEffect(() => {
    if (params.packageId) {
      fetchItinerary();
    }
  }, [params.packageId]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      // Add cache busting to ensure fresh data
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/itineraries?destination=dubai&packageId=${params.packageId}&t=${timestamp}`, {
        cache: 'no-store', // Ensure no caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const itineraries = data.itineraries || data.itinerary || data;
        const matchingItinerary = itineraries.find((it: any) => it.packageId === params.packageId);
        
        if (matchingItinerary) {
          console.log('Found matching itinerary:', matchingItinerary); // Debug log
          setItinerary(matchingItinerary);
        } else {
          console.log('No matching itinerary found for packageId:', params.packageId); // Debug log
          setError('No itinerary found for this package');
        }
      } else {
        console.error('API response not ok:', response.status); // Debug log
        setError('Failed to fetch itinerary');
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      setError('Failed to fetch itinerary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600 text-xl">Loading itinerary...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center text-gray-600">
            <div className="text-2xl mb-4">Itinerary Not Found</div>
            <div className="text-gray-500 mb-6">{error || 'The requested itinerary could not be found.'}</div>
            <button
              onClick={() => router.back()}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Convert itinerary days to accordion format
  const accordionItems = itinerary.days.map((day, index) => ({
    title: day.title,
    content: (
      <div className="relative">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-blue-200"></div>
        <div className="space-y-3 pl-6">
          <div className="relative">
            <div className="absolute -left-6 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
            <div className="text-gray-700 text-sm leading-relaxed">
              <div className="mb-2">
                <strong>Activities:</strong>
                <ul className="mt-1 space-y-1">
                  {day.activities.map((activity: string, actIndex: number) => (
                    <li key={actIndex} className="ml-4">• {activity}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <strong>Meals:</strong>
                <div className="mt-1 flex flex-wrap gap-2">
                  {day.meals.map((meal: string, mealIndex: number) => (
                    <span key={mealIndex} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                      {meal}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <strong>Accommodation:</strong>
                <p className="mt-1 text-gray-600">{day.accommodation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    dayNumber: day.day
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Gallery Hero Section */}
      <section className="relative h-screen">
        {/* Main Display */}
        <div className="relative h-full">
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentImageIndex 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white z-10">
                  <h1 className={`font-limelight text-6xl md:text-7xl lg:text-8xl mb-4 drop-shadow-2xl`}>
                    {image.title.toUpperCase()}
                  </h1>
                  <p className={`font-lalezar text-xl md:text-2xl lg:text-3xl mb-6 drop-shadow-xl`}>
                    {image.subtitle}
                  </p>
                  <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-lg">
                    {image.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Thumbnail Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-orange-500 scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dubai Packages
          </button>
        </div>
      </div>

      {/* Trip Overview & Booking Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Package Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{itinerary.title}</h2>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {itinerary.duration}
                  </span>
                  <span className="text-gray-600">{itinerary.destination}</span>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">{itinerary.overview}</p>
                
                {/* Enhanced Hotel Details */}
                {itinerary.hotelName && (
                  <HotelSection
                    hotelName={itinerary.hotelName}
                    hotelRating={itinerary.hotelRating}
                    hotelDescription={itinerary.hotelDescription}
                    hotelImages={itinerary.hotelImages}
                  />
                )}

                {/* Package Highlights */}
                <div className="border-t pt-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">✨ Package Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">What&apos;s Included:</h4>
                      <ul className="space-y-2">
                        {itinerary.inclusions.map((inclusion, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <span className="text-green-500 mr-2">✓</span>
                            {inclusion}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">What&apos;s Not Included:</h4>
                      <ul className="space-y-2">
                        {itinerary.exclusions.map((exclusion, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <span className="text-red-500 mr-2">✗</span>
                            {exclusion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Daily Itinerary */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">📅 Daily Itinerary</h3>
                  <Accordion items={accordionItems} />
                </div>
              </div>
            </div>

            {/* Right Side - Booking Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Book This Package</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5+">5+ People</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Any special requests or requirements..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200"
                  >
                    Request Quote
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Need immediate assistance?</p>
                  <a
                    href="tel:+919876543210"
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Call us: +91 98765 43210
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DynamicDubaiItineraryPage; 