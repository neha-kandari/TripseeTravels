'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Reveal from '../../components/Reveal';
import Accordion from '../../components/Accordion';
import HotelCard from '../../components/HotelCard';

const Bali7Night = () => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedHotelIndex, setExpandedHotelIndex] = useState(-1);

  // Function to handle hotel card toggle with proper accordion behavior
  const handleHotelToggle = (index: number) => {
    if (expandedHotelIndex === index) {
      // If clicking the same card, collapse it
      setExpandedHotelIndex(-1);
    } else if (expandedHotelIndex === -1) {
      // If no card is expanded, expand this one
      setExpandedHotelIndex(index);
    }
    // If another card is already expanded, do nothing (prevent multiple cards)
  };

  const sliderImages = [
    {
      src: "/Destination/BaliHero/Tirta Empul Temple.webp",
      alt: "Tirta Empul Temple",
      title: "Sacred Temples",
      subtitle: "Where Ancient Spirits Meet Divine Architecture",
      description: "Experience the spiritual beauty of ancient Balinese temples set against stunning natural backdrops."
    },
    {
      src: "/Destination/BaliHero/Pura Ulun Danu.webp", 
      alt: "Pura Ulun Danu",
      title: "Lake Temples",
      subtitle: "Paradise Reimagined in Ultimate Serenity",
      description: "Discover the iconic floating temple on Lake Bratan, a masterpiece of Balinese architecture."
    },
    {
      src: "/Destination/BaliHero/Kelingking Beach.webp",
      alt: "Kelingking Beach",
      title: "Pristine Beaches",
      subtitle: "Where Emerald Cliffs Touch Azure Waters",
      description: "Marvel at the dramatic coastal beauty and crystal-clear waters of Nusa Penida."
    },
    {
      src: "/Destination/BaliHero/Handara Gate.webp",
      alt: "Handara Gate",
      title: "Cultural Heritage",
      subtitle: "Timeless Traditions in Modern Harmony",
      description: "Walk through the iconic gates that frame Bali's magnificent mountain landscapes."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const packageDetails = {
    title: "7 NIGHTS BALI",
    duration: "7N / 8D",
    location: "Seminyak, Benoa & Ubud",
    rating: "4-5",
    price: "₹1,06,500/- For a Couple",
    excludes: "Including All Activities"
  };

  const hotels = [
    {
      name: "Puri Saron Hotel Seminyak",
      nights: "3 Nights",
      roomType: "Deluxe",
      location: "Seminyak, Bali",
      rating: 4,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center",
      link: "https://www.purisaronseminyak.com/accommodation"
    },
    {
      name: "Tijli Hotel Benoa",
      nights: "2 Nights",
      roomType: "Deluxe",
      location: "Benoa, Bali",
      rating: 4,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center",
      link: "https://tijilihotels.com/benoa/home/"
    },
    {
      name: "Desa Swan Villa",
      nights: "2 Nights",
      roomType: "One Bedroom Pool Villa",
      location: "Ubud, Bali",
      rating: 5,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&crop=center",
      link: "https://www.desaswan.com/accommodations/one-bedroom-private-pool-villa",
      benefits: [
        "Welcome mocktail upon arrival",
        "Welcome honeymoon cake",
        "Welcome fruit basket upon arrival",
        "Romantic rose petal & towel honeymoon decoration",
        "Candle light dinner",
        "Daily 2 bottle of small beer",
        "Daily snack",
        "Daily floating breakfast at the pool",
        "Daily motorcycle + helmet"
      ]
    }
  ];

  const itinerary = [
    {
      day: 1,
      title: "Arrival & Romance",
      activities: ["Arrival in Bali", "Romantic Candle Light Dinner"],
      highlight: "Welcome to Paradise"
    },
    {
      day: 2,
      title: "Water Adventures & Culture", 
      activities: [
        "Watersports (Banana Boat, Jet Ski, Parasailing)",
        "1 Hour Balinese Massage",
        "Uluwatu Temple",
        "Kecak Dance Performance"
      ],
      highlight: "Adventure & Wellness"
    },
    {
      day: 3,
      title: "West Nusa Penida Island Tour",
      activities: [
        "Broken Beach",
        "Angel Billabong", 
        "Kelingking Beach",
        "Bubu Beach",
        "Local Lunch",
        "Snorkelling"
      ],
      highlight: "Island Paradise"
    },
    {
      day: 4,
      title: "Temple Trail",
      activities: [
        "Ulun Danu Temple",
        "Handara Gate",
        "Tanah Lot Temple"
      ],
      highlight: "Sacred Journey"
    },
    {
      day: 5,
      title: "Ubud Nature Experience",
      activities: [
        "Kintamani Volcano View",
        "Ubud Market",
        "Tegenungan Waterfall",
        "Tegallalang Rice Terrace",
        "Ubud Jungle Swing",
        "Inter Hotel Transfer"
      ],
      highlight: "Nature & Culture"
    },
    {
      day: 6,
      title: "Adventure Day",
      activities: [
        "ATV RIDE",
        "WHITE WATER RAFTING"
      ],
      highlight: "Extreme Adventure"
    },
    {
      day: 7,
      title: "Leisure Day",
      activities: [
        "Day free for leisure"
      ],
      highlight: "Relaxation"
    },
    {
      day: 8,
      title: "Departure",
      activities: ["Check-out", "Departure Transfer"],
      highlight: "Farewell Bali"
    }
  ];

  const packageHighlights = [
    "4-5 Star Hotel Experience",
    "Private Pool Villa with Benefits",
    "ATV & White Water Rafting", 
    "Complete Water Sports Package",
    "Temple Tours & Cultural Shows",
    "Daily Complimentary Amenities"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="relative h-screen">
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

          {/* Dot Navigation */}
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
        </div>
      </section>

      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => router.push('/destination/bali')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Bali Packages</span>
          </button>
        </div>
      </div>

      <Reveal>
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-lg max-h-screen overflow-y-auto">
              
              <div className="mb-6 pb-6 border-b">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Section - Package Title & Duration */}
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">{packageDetails.title}</h2>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-rose-500">7 Days</p>
                      <p className="text-3xl font-bold text-gray-400">6 Nights</p>
                    </div>
                  </div>
                  
                  {/* Right Section - Price & Details */}
                  <div className="lg:border-l lg:border-gray-200 lg:pl-8">
                    <p className="text-2xl font-bold text-green-600 mb-2">{packageDetails.price}</p>
                    <p className="text-sm text-green-600 font-medium">{packageDetails.excludes}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">🏨 Hotel Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotels.map((hotel, index) => (
                    <HotelCard
                      key={index}
                      name={hotel.name}
                      image={hotel.image}
                      rating={hotel.rating}
                      location={hotel.location}
                      nights={hotel.nights}
                      roomType={hotel.roomType}
                      link={hotel.link}
                      benefits={hotel.benefits}
                      isExpanded={expandedHotelIndex === index}
                      onToggle={() => handleHotelToggle(index)}
                      isAnyCardExpanded={expandedHotelIndex !== -1}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">📅 Day Wise Itinerary</h3>
                <Accordion 
                  items={itinerary.map((day, index) => ({
                    title: day.title,
                    content: (
                      <div className="relative">
                        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                        <div className="space-y-3 pl-6">
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="relative">
                              <div className="absolute -left-6 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                              <div className="text-gray-700 text-sm leading-relaxed">{activity}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                    highlight: day.highlight,
                    dayNumber: day.day
                  }))}
                  allowMultiple={true}
                />
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">✨ Package Highlights</h3>
                <div className="grid md:grid-cols-2 gap-3">
                                      {packageHighlights.map((highlight, index) => (
                      <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-lg sticky top-4">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Book This Package</h3>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option>2 Adults</option>
                        <option>1 Adult</option>
                        <option>3 Adults</option>
                        <option>4 Adults</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option>0 Children</option>
                        <option>1 Child</option>
                        <option>2 Children</option>
                        <option>3 Children</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                    <textarea 
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Any special requests or requirements..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
                  >
                    Submit Inquiry
                  </button>
                </form>
                
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-2">Contact Info</h4>
                  <p className="text-sm text-gray-600">📧 info@tripsee.com</p>
                  <p className="text-sm text-gray-600">📞 +91 9876543210</p>
                  <p className="text-sm text-gray-600">💬 WhatsApp Support Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      <Footer />
    </div>
  );
};

export default Bali7Night; 