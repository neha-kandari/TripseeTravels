'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Accordion from '../../../components/Accordion';
import HotelSection from '../../../components/HotelSection';

interface RomanticItinerary {
  id: string;
  title: string;
  destination: string;
  duration: string;
  overview: string;
  packageId: string;
  hotelName?: string;
  hotelRating?: string;
  hotelDescription?: string;
  hotelImages?: {
    src: string;
    alt: string;
    name: string;
    description: string;
  }[];
  days: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  price?: string;
  type?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

const DynamicRomanticItineraryPage = () => {
  const params = useParams();
  const router = useRouter();
  const [itinerary, setItinerary] = useState<RomanticItinerary | null>(null);
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    if (params.packageId) {
      fetchItinerary();
    }
  }, [params.packageId]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const packageId = params.packageId as string;
      
      // Fetch package and itinerary data in parallel for better performance
      const [packageResponse, itineraryResponse] = await Promise.all([
        fetch(`/api/romantic-packages/${packageId}`),
        fetch(`/api/romantic-itineraries?packageId=${packageId}`)
      ]);

      // Handle package data
      if (packageResponse.ok) {
        const packageData = await packageResponse.json();
        setPackageData(packageData);
      } else if (packageResponse.status === 404) {
        setError('Package not found');
        return;
      } else {
        console.error('Failed to fetch package:', packageResponse.status);
        setError('Failed to load package information');
        return;
      }

      // Handle itinerary data
      if (itineraryResponse.ok) {
        const itineraries = await itineraryResponse.json();
        const matchingItinerary = itineraries.find((it: any) => it.packageId === packageId);
        
        if (matchingItinerary) {
          setItinerary(matchingItinerary);
        } else {
          setError('No itinerary found for this package. Please contact support or check back later.');
        }
      } else {
        console.error('Failed to fetch itineraries:', itineraryResponse.status);
        setError('Failed to load itinerary information');
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      setError('Failed to load itinerary. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your romantic itinerary...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your perfect getaway details</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">💔</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {error?.includes('not found') ? 'Itinerary Not Found' : 'Something Went Wrong'}
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {error || 'The requested itinerary could not be found.'}
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => fetchItinerary()}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/romantic-hideaway')}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Back to Romantic Packages
              </button>
            </div>
            
            {packageData && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Package found:</p>
                <p className="font-medium text-gray-900">{packageData.title}</p>
                <p className="text-sm text-gray-600">{packageData.destination} • {packageData.days}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <br /> 
          <Image
            src="/RomanticBG.webp"
            alt="Romantic Hideaway Background"
            fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <p className="text-sm md:text-base text-orange-300 mb-3 font-light italic">
              From winding roads to wide skies —
            </p>
            <p className="text-sm md:text-base text-white/90 mb-6 font-light">
              Your romantic getaway begins here.
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl">
              <span className={"font-limelight"}>ROMANTIC</span>
              <br />
              <span className={`text-orange-400 font-lalezar`}>HIDEAWAY</span>
            </h1>
            <p className="text-base md:text-lg text-white/90 font-light mb-6 drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
              {itinerary.overview}
            </p>
            <p className="text-sm md:text-base text-white/80 font-medium mb-6 drop-shadow-lg max-w-3xl mx-auto">
              {itinerary.title}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm md:text-base mb-6 flex-wrap">
              <span className="flex items-center gap-2">
                <span>📍</span>
                {itinerary.destination}
              </span>
              <span className="flex items-center gap-2">
                <span>⏰</span>
                {itinerary.duration}
              </span>
              {packageData?.price && (
                <span className="flex items-center gap-2">
                  <span>💰</span>
                  {packageData.price}
                </span>
              )}
              {itinerary.type && (
                <span className="flex items-center gap-2">
                  <span>💕</span>
                  {itinerary.type}
                </span>
              )}
            </div>
            <button 
              onClick={() => router.push('/romantic-hideaway')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Back to Romantic Packages
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-white/30 animate-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>
      </section>

      {/* Itinerary Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Overview */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              <span className={"font-lalezar"}>Package Overview</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed text-center">
              {itinerary.overview}
            </p>
          </div>

          {/* Daily Itinerary */}
          {itinerary.days && itinerary.days.length > 0 ? (
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                <span className={"font-lalezar"}>Daily Itinerary</span>
              </h2>
              <Accordion
                items={itinerary.days
                  .filter(day => day && (day.title || day.description || day.activities?.length || day.meals?.length))
                  .map((day, index) => ({
                    title: `Day ${day.day || index + 1}: ${day.title || `Day ${day.day || index + 1}`}`,
                    content: (
                      <div className="space-y-4">
                        {day.description && (
                          <p className="text-gray-600 leading-relaxed">{day.description}</p>
                        )}
                        {day.activities && day.activities.length > 0 && day.activities.some(act => act.trim()) && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                              <span>🎯</span> Activities
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                              {day.activities.filter(act => act.trim()).map((activity: string, actIndex: number) => (
                                <li key={actIndex}>{activity}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {day.meals && day.meals.length > 0 && day.meals.some(meal => meal.trim()) && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                              <span>🍽️</span> Meals
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                              {day.meals.filter(meal => meal.trim()).map((meal: string, mealIndex: number) => (
                                <li key={mealIndex}>{meal}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {day.accommodation && day.accommodation.trim() && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                              <span>🏨</span> Accommodation
                            </h4>
                            <p className="text-gray-600">{day.accommodation}</p>
                          </div>
                        )}
                      </div>
                    ),
                    dayNumber: day.day || index + 1
                  }))}
                allowMultiple={true}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto mb-16 text-center">
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Itinerary Coming Soon</h3>
                <p className="text-gray-600">The detailed day-by-day itinerary for this package is being prepared. Please check back later or contact us for more information.</p>
              </div>
            </div>
          )}

          {/* Hotel Information */}
          {itinerary.hotelName && (
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                <span className={"font-lalezar"}>Accommodation</span>
              </h2>
              <HotelSection
                hotelName={itinerary.hotelName}
                hotelRating={itinerary.hotelRating || '5'}
                hotelDescription={itinerary.hotelDescription || 'Luxury accommodation for your romantic getaway'}
                hotelImages={itinerary.hotelImages || []}
              />
            </div>
          )}

          {/* Inclusions & Exclusions */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Inclusions */}
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                <span className={"font-lalezar"}>What's Included</span>
              </h3>
              {itinerary.inclusions && itinerary.inclusions.length > 0 && itinerary.inclusions.some(inc => inc.trim()) ? (
                <ul className="space-y-3">
                  {itinerary.inclusions.filter(inc => inc.trim()).map((inclusion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✅</span>
                      <span className="text-gray-700">{inclusion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <p>Inclusion details coming soon</p>
                </div>
              )}
            </div>

            {/* Exclusions */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                <span className={"font-lalezar"}>What's Not Included</span>
              </h3>
              {itinerary.exclusions && itinerary.exclusions.length > 0 && itinerary.exclusions.some(exc => exc.trim()) ? (
                <ul className="space-y-3">
                  {itinerary.exclusions.filter(exc => exc.trim()).map((exclusion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-red-500 text-xl">❌</span>
                      <span className="text-gray-700">{exclusion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <p>Exclusion details coming soon</p>
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <button
              onClick={() => router.push('/romantic-hideaway')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Book This Romantic Package
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DynamicRomanticItineraryPage; 