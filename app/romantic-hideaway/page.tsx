'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';

interface RomanticPackage {
  id: string;
  image: string;
  days: string;
  title: string;
  location: string;
  destination: string;
  price: string;
  type: string;
  hotelRating: number;
  features: string[];
  highlights: string;
}

const RomanticHideawayPage = () => {
  const router = useRouter();
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [selectedPackageTypes, setSelectedPackageTypes] = useState<string[]>([]);
  const [selectedHotelRatings, setSelectedHotelRatings] = useState<number[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 75000, max: 350000 });
  const [sortBy, setSortBy] = useState('price-low');
  const [allPackages, setAllPackages] = useState<RomanticPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false); // State for showing/hiding filters on mobile

  // Fetch packages from public API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/romantic-packages');
        if (response.ok) {
          const data = await response.json();
          setAllPackages(data);
        } else {
          console.error('Failed to fetch romantic packages:', response.status);
          setError('Failed to load romantic packages. Please try again later.');
          // Fallback to default packages if API fails
          setAllPackages(getDefaultPackages());
        }
      } catch (error) {
        console.error('Error fetching romantic packages:', error);
        setError('Unable to connect to our servers. Showing sample packages.');
        // Fallback to default packages if API fails
        setAllPackages(getDefaultPackages());
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Default packages as fallback
  const getDefaultPackages = (): RomanticPackage[] => [
    {
      id: "maldives-honeymoon",
      image: "/Destination/Maldives.webp",
      days: "4 Nights 5 Days",
      title: "MALDIVES HONEYMOON - Overwater Villa Paradise",
      location: "Maldives Private Resort",
      destination: "Maldives",
      price: "₹2,50,000/-",
      type: "Honeymoon",
      hotelRating: 5,
      features: ["Overwater Villa", "Private Pool", "Honeymoon Suite", "Candle Night Dinner"],
      highlights: "Private villa • Romantic dinners • Couple massage • Snorkeling together"
    },
    {
      id: "bali-romance",
      image: "/Destination/Bali.webp",
      days: "6 Nights 7 Days",
      title: "BALI ROMANTIC ESCAPE - Private Pool Villas",
      location: "Ubud & Seminyak",
      destination: "Bali",
      price: "₹1,25,000/-",
      type: "Candle Night",
      hotelRating: 5,
      features: ["Private Pool Villa", "Floating Breakfast", "Candle Night Dinner", "Proposal Setup"],
      highlights: "Jungle villas • Rice terrace walks • Temple visits • Romantic dinners"
    },
    {
      id: "thailand-romance",
      image: "/Destination/Thailand.webp",
      days: "5 Nights 6 Days",
      title: "THAILAND BEACH ROMANCE - Phi Phi & Phuket",
      location: "Phuket & Phi Phi Islands",
      destination: "Thailand",
      price: "₹95,000/-",
      type: "Beach Romance",
      hotelRating: 4,
      features: ["Beach Resort", "Island Hopping", "Sunset Cruise", "Candle Night Dinner"],
      highlights: "Maya Bay • James Bond Island • Beach dinners • Couple activities"
    },
    {
      id: "dubai-proposal",
      image: "/Destination/Dubai.webp",
      days: "4 Nights 5 Days",
      title: "DUBAI PROPOSAL PACKAGE - Burj Khalifa Romance",
      location: "Dubai Luxury Hotels",
      destination: "Dubai",
      price: "₹1,85,000/-",
      type: "Proposal",
      hotelRating: 5,
      features: ["Luxury Hotel", "Proposal Setup", "Professional Photography", "Desert Safari"],
      highlights: "Burj Khalifa • Desert romance • Luxury dining • Proposal memories"
    },
    {
      id: "singapore-romance",
      image: "/Destination/Singapore.webp",
      days: "3 Nights 4 Days",
      title: "SINGAPORE CITY ROMANCE - Marina Bay Sands",
      location: "Singapore City Center",
      destination: "Singapore",
      price: "₹1,15,000/-",
      type: "City Romance",
      hotelRating: 5,
      features: ["Marina Bay Sands", "Infinity Pool", "Gardens by the Bay", "Sentosa Island"],
      highlights: "City skyline • Infinity pool • Night gardens • Island adventure"
    }
  ];

  // Filter functions
  const togglePackageType = (type: string) => {
    setSelectedPackageTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    setCurrentPackageIndex(0);
  };

  const toggleHotelRating = (rating: number) => {
    setSelectedHotelRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
    setCurrentPackageIndex(0);
  };

  const toggleDuration = (duration: string) => {
    setSelectedDurations(prev =>
      prev.includes(duration)
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    );
    setCurrentPackageIndex(0);
  };

  const toggleDestination = (destination: string) => {
    setSelectedDestinations(prev =>
      prev.includes(destination)
        ? prev.filter(d => d !== destination)
        : [...prev, destination]
    );
    setCurrentPackageIndex(0);
  };

  const handlePriceChange = (value: number) => {
    setPriceRange(prev => ({ ...prev, max: value }));
    setCurrentPackageIndex(0);
  };

  // Fix image paths for packages
  const fixImagePaths = (packages: RomanticPackage[]) => {
    return packages.map(pkg => {
      let fixedImage = pkg.image;
      
      // Fix common wrong paths
      if (pkg.image === '/Destination/BaliHero/Handara Gate.webp') {
        fixedImage = '/Destination/Bali.webp';
      } else if (pkg.image === '/Destination/MaldivesHero/gulhi-falhu.webp') {
        fixedImage = '/Destination/Maldives.webp';
      }
      
      // Fix Pexels URLs that are webpage URLs instead of image URLs
      if (pkg.image && pkg.image.includes('pexels.com/photo/') && !pkg.image.includes('/images/')) {
        // Convert webpage URL to a fallback image
        fixedImage = '/Destination/Thailand.webp'; // Use a local image as fallback
      }
      
      return { ...pkg, image: fixedImage };
    });
  };

  // Valid romantic package types
  const validRomanticTypes = ['Honeymoon', 'Proposal', 'Candle Night', 'Beach Romance', 'Anniversary', 'Romantic'];

  // Filter packages based on selected filters
  const filteredPackages = fixImagePaths(allPackages).filter(pkg => {
    // First, ensure it's a valid romantic package type
    if (!validRomanticTypes.includes(pkg.type)) {
      return false;
    }
    
    if (selectedPackageTypes.length > 0 && !selectedPackageTypes.includes(pkg.type)) {
      return false;
    }
    if (selectedHotelRatings.length > 0 && !selectedHotelRatings.includes(pkg.hotelRating)) {
      return false;
    }
    if (selectedDestinations.length > 0 && !selectedDestinations.includes(pkg.destination)) {
      return false;
    }
    if (selectedDurations.length > 0) {
      const pkgNights = pkg.days.split(' ')[0];
      const matchesDuration = selectedDurations.some(duration => {
        const filterNights = duration.split(' ')[0];
        return pkgNights === filterNights;
      });
      if (!matchesDuration) return false;
    }
    const price = parseInt(pkg.price.replace(/[₹,/-]/g, ''));
    if (price > priceRange.max) {
      return false;
    }
    return true;
  });

  // Calculate counts directly to avoid dependency issues
  const calculateCounts = useCallback(() => {
    const destinationCounts: { [key: string]: number } = {};
    const packageTypeCounts: { [key: string]: number } = {};
    const hotelRatingCounts: { [key: string]: number } = {};
    const durationCounts: { [key: string]: number } = {};

    filteredPackages.forEach(pkg => {
      // Destination counts
      destinationCounts[pkg.destination] = (destinationCounts[pkg.destination] || 0) + 1;
      
      // Package type counts
      packageTypeCounts[pkg.type] = (packageTypeCounts[pkg.type] || 0) + 1;
      
      // Hotel rating counts
      hotelRatingCounts[pkg.hotelRating.toString()] = (hotelRatingCounts[pkg.hotelRating.toString()] || 0) + 1;
      
      // Duration counts
      const nights = pkg.days.split(' ')[0];
      durationCounts[nights] = (durationCounts[nights] || 0) + 1;
    });

    return { destinationCounts, packageTypeCounts, hotelRatingCounts, durationCounts };
  }, [filteredPackages]);

  const { destinationCounts, packageTypeCounts, hotelRatingCounts, durationCounts } = calculateCounts();

  // Sort packages based on selected sorting option
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        const priceA = parseInt(a.price.replace(/[₹,/-]/g, ''));
        const priceB = parseInt(b.price.replace(/[₹,/-]/g, ''));
        return priceA - priceB;
      case 'price-high':
        const priceA2 = parseInt(a.price.replace(/[₹,/-]/g, ''));
        const priceB2 = parseInt(b.price.replace(/[₹,/-]/g, ''));
        return priceB2 - priceA2;
      case 'duration':
        const daysA = parseInt(a.days.split(' ')[0]);
        const daysB = parseInt(b.days.split(' ')[0]);
        return daysA - daysB;
      case 'rating':
        return b.hotelRating - a.hotelRating;
      case 'popularity':
        const typeOrder: { [key: string]: number } = { 
          'Honeymoon': 1, 'Proposal': 2, 'Candle Night': 3, 'Beach Romance': 4
        };
        return (typeOrder[a.type] || 5) - (typeOrder[b.type] || 5);
      default:
        return 0;
    }
  });

  const packagesPerPage = 5;
  const totalPages = Math.ceil(sortedPackages.length / packagesPerPage);
  const currentPackages = sortedPackages.slice(
    currentPackageIndex * packagesPerPage,
    (currentPackageIndex + 1) * packagesPerPage
  );


  const nextPackages = () => {
    setCurrentPackageIndex((prev) => (prev + 1) % totalPages);
    setTimeout(() => {
      const packagesSection = document.getElementById('packages-section');
      if (packagesSection) {
        packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const prevPackages = () => {
    setCurrentPackageIndex((prev) => (prev - 1 + totalPages) % totalPages);
    setTimeout(() => {
      const packagesSection = document.getElementById('packages-section');
      if (packagesSection) {
        packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const refreshPackages = () => {
    setLoading(true);
    setError(null);
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/romantic-packages');
        if (response.ok) {
          const data = await response.json();
          setAllPackages(data);
          setError(null);
        } else {
          console.error('Failed to fetch romantic packages:', response.status);
          setError('Failed to load romantic packages. Please try again later.');
          // Fallback to default packages if API fails
          setAllPackages(getDefaultPackages());
        }
      } catch (error) {
        console.error('Error fetching romantic packages:', error);
        setError('Unable to connect to our servers. Showing sample packages.');
        // Fallback to default packages if API fails
        setAllPackages(getDefaultPackages());
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
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
        <div className="relative z-10 h-full flex items-center justify-center pt-28 sm:pt-32 md:pt-36">
          <div className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
            <p className="text-sm sm:text-lg md:text-xl text-orange-300 mb-4 font-light italic">
              From winding roads to wide skies —
            </p>
            <p className="text-sm sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 font-light">
              Your romantic getaway begins here.
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold mb-6 sm:mb-8 drop-shadow-2xl">
              <span className={"font-limelight"}>ROMANTIC</span>
              <br />
              <span className={`text-orange-400 font-lalezar`}>HIDEAWAY</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light mb-6 sm:mb-8 drop-shadow-lg max-w-2xl mx-auto leading-relaxed px-2">
              Escape to intimate destinations designed for love, where every moment becomes a cherished memory
            </p>
            <a 
              href="https://wa.me/918595682910?text=Hi! I'm interested in planning a romantic getaway. Please help me find the perfect escape for us." 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Find Your Perfect Escape
            </a>
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

      {/* Features Section */}
      <Reveal>
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-rose-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Choose Our <span className="text-orange-500">Romantic Escapes</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              We specialize in creating unforgettable romantic experiences that bring couples closer together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">🕯️</span>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Candle Night Dinners</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Romantic candlelit dining experiences under the stars, on the beach, or in private settings designed to create magical moments together.
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">💎</span>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Perfect Proposals</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Professionally planned proposal setups with stunning backdrops, photography, and all the details to make your engagement unforgettable.
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 md:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">💍</span>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Honeymoon Bliss</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Luxury honeymoon packages with private suites, couple activities, and romantic experiences to celebrate your new beginning together.
              </p>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Our Romantic Tropical Destinations Section */}
      <Reveal>
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
            {/* Left Side - Images */}
            <div className="w-full lg:w-1/2 relative order-2 lg:order-1">
              {/* Main image with floating circular overlays */}
              <div className="relative flex justify-center lg:justify-start">
                <div className="w-64 h-80 sm:w-72 sm:h-96 lg:w-80 lg:h-96 rounded-3xl overflow-hidden relative">
                  <Image
                    src="/tripPics.webp"
                    alt="Romantic tropical destinations"
                    fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                {/* Decorative heart element */}
                <div className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold transform -rotate-12">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Background decorative text - hidden on mobile */}
                <div className="hidden lg:block absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 text-gray-100 text-6xl xl:text-8xl font-bold opacity-30">
                  HONEYMOON
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="text-center lg:text-left">
                <div className="mb-4 sm:mb-6">
                  <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                    HONEYMOON SPECIALS
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                    Our Romantic <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                      Tropical
                    </span> <br />
                    Destinations
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 px-2 lg:px-0">
                    Discover handpicked romantic destinations to celebrate your honeymoon in style. 
                    Let us help you make memories that last forever in breathtaking tropical paradises.
                  </p>
                  <a 
                    href="https://wa.me/918595682910?text=Hi! I'm interested in your romantic tropical destinations and honeymoon packages. Please help me plan the perfect romantic getaway." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 items-center gap-2 mx-auto lg:mx-0"
                  >
                    Enquire Now
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Packages Section */}
      <Reveal>
      <section id="packages-section" className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Discover Your Perfect <span className="text-orange-500">Romantic Package</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              From intimate hideaways to luxury escapes, find the perfect romantic experience tailored for you and your loved one
            </p>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <span className="font-medium text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Sidebar - Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-1/4 bg-white rounded-lg p-4 lg:p-6 h-fit shadow-lg`}>
              {/* Clear Filters Button */}
              {(selectedPackageTypes.length > 0 || selectedHotelRatings.length > 0 || selectedDurations.length > 0 || selectedDestinations.length > 0 || priceRange.max < 350000) && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setSelectedPackageTypes([]);
                      setSelectedHotelRatings([]);
                      setSelectedDurations([]);
                      setSelectedDestinations([]);
                      setPriceRange({ min: 75000, max: 350000 });
                      setSortBy('price-low');
                      setCurrentPackageIndex(0);
                    }}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Destination Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Destination</h3>
                <div className="space-y-3">
                  {[
                    'Maldives', 'Bali', 'Thailand', 'Dubai', 'Singapore', 'Vietnam', 'Malaysia', 'Andaman'
                  ].map((destination) => (
                    <label key={destination} className="flex items-center justify-between cursor-pointer hover:bg-rose-50 p-2 rounded">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 rounded text-pink-500 focus:ring-pink-500"
                          checked={selectedDestinations.includes(destination)}
                          onChange={() => toggleDestination(destination)}
                        />
                        <span className="text-gray-700">{destination}</span>
                      </div>
                      <span className="text-gray-500">({destinationCounts[destination] || 0})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Package Type Filter */}
              {/* <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Romance Type</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Honeymoon', icon: '💍' },
                    { name: 'Proposal', icon: '💎' },
                    { name: 'Candle Night', icon: '🕯️' },
                    { name: 'Beach Romance', icon: '🏖️' }
                  ].map((type) => (
                    <label key={type.name} className="flex items-center justify-between cursor-pointer hover:bg-rose-50 p-2 rounded">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 rounded text-pink-500 focus:ring-pink-500"
                          checked={selectedPackageTypes.includes(type.name)}
                          onChange={() => togglePackageType(type.name)}
                        />
                        <span className="text-gray-700 flex items-center">
                          <span className="mr-2">{type.icon}</span>
                          {type.name}
                        </span>
                      </div>
                      <span className="text-gray-500">({packageTypeCounts[type.name] || 0})</span>
                    </label>
                  ))}
                </div>
              </div> */}

              {/* Hotel Rating Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Rating</h3>
                <div className="flex gap-2">
                  {[4, 5].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => toggleHotelRating(stars)}
                      className={`px-3 py-2 border rounded-lg transition-colors relative ${
                        selectedHotelRatings.includes(stars)
                          ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white border-transparent'
                          : 'border-gray-300 hover:border-pink-300 hover:bg-rose-50'
                      }`}
                    >
                      <span>{stars} Star</span>
                      <span className={`ml-1 text-xs ${
                        selectedHotelRatings.includes(stars) ? 'text-pink-100' : 'text-gray-500'
                      }`}>
                        ({hotelRatingCounts[stars.toString()] || 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Min: ₹75,000</span>
                    <span>Max: ₹{priceRange.max.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="75000"
                      max="500000"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-pink-500"
                      style={{
                        background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${((priceRange.max - 75000) / (500000 - 75000)) * 100}%, #e5e7eb ${((priceRange.max - 75000) / (500000 - 75000)) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Current Max: ₹{priceRange.max.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Duration (Nights)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['3 Nights', '4 Nights', '5 Nights', '6 Nights', '7 Nights'].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => toggleDuration(duration)}
                      className={`px-3 py-2 border rounded-lg transition-colors text-sm ${
                        selectedDurations.includes(duration)
                          ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white border-transparent'
                          : 'border-gray-300 hover:border-pink-300 hover:bg-rose-50'
                      }`}
                    >
                      {duration} ({durationCounts[duration.split(' ')[0]] || 0})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Packages Grid */}
            <div className="w-full lg:w-3/4">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600">⚠️</span>
                      <span className="text-yellow-800 text-sm">{error}</span>
                    </div>
                    <button
                      onClick={refreshPackages}
                      className="text-yellow-600 hover:text-yellow-800 text-sm font-medium underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Sorting */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Romantic Packages Only</span>
                  {!loading && (
                    <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                      {currentPackages.length} packages found
                    </span>
                  )}
                  {loading && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                      <span className="text-sm">Loading...</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Sorting</span>
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPackageIndex(0);
                    }}
                  >
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="duration">Duration: Short to Long</option>
                    <option value="rating">Rating: High to Low</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>
              </div>



              {/* Packages Scrollable Container */}
              <div className="h-[800px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-gray-100 hover:scrollbar-thumb-pink-400">
                <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading romantic packages...</p>
                    <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your perfect getaway options</p>
                  </div>
                ) : currentPackages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-4xl">💔</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Romantic Packages Found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      We couldn't find any packages matching your current filters. Try adjusting your search criteria or clear all filters to see more options.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedPackageTypes([]);
                        setSelectedHotelRatings([]);
                        setSelectedDurations([]);
                        setSelectedDestinations([]);
                        setPriceRange({ min: 75000, max: 350000 });
                        setSortBy('price-low');
                        setCurrentPackageIndex(0);
                      }}
                      className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  currentPackages.map((pkg, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col sm:flex-row hover:shadow-xl transition-shadow duration-300">
                    {/* Package Image */}
                    <div className="w-full sm:w-1/3 h-48 sm:h-auto relative">
                      {pkg.image && pkg.image.startsWith('http') ? (
                        <Image
                          src={pkg.image}
                          alt={pkg.title}
                          fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          onError={(e) => {
                            // Image failed to load
                          }}
                          onLoad={() => {
                            // Image loaded successfully
                          }}
                        />
                      ) : (
                        <Image
                          src={pkg.image}
                          alt={pkg.title}
                          fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          onError={(e) => {
                            // Image failed to load
                          }}
                          onLoad={() => {
                            // Image loaded successfully
                          }}
                        />
                      )}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        💕 Romantic
                      </div>

                    </div>

                    {/* Package Content */}
                    <div className="w-full sm:w-2/3 p-6 flex flex-col sm:flex-row justify-between">
                      <div className="flex-1 mb-4 sm:mb-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-sm text-gray-500">{pkg.days}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pkg.type === 'Honeymoon' ? 'bg-pink-100 text-pink-700' :
                            pkg.type === 'Proposal' ? 'bg-purple-100 text-purple-700' :
                            pkg.type === 'Candle Night' ? 'bg-orange-100 text-orange-700' :
                            pkg.type === 'Beach Romance' ? 'bg-cyan-100 text-cyan-700' :
                            'bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700'
                          }`}>
                            {pkg.type}
                          </span>
                          <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            <span className="text-yellow-500 mr-1">⭐</span>
                            {pkg.hotelRating} Star
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{pkg.title}</h3>
                        <div className="text-sm text-gray-600 mb-3 flex items-center">
                          <span className="mr-1">📍</span>
                          {pkg.location}
                        </div>

                        {/* Highlights */}
                        <div className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {pkg.highlights}
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {pkg.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 rounded-full text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price and Button */}
                      <div className="flex flex-col justify-between items-start sm:items-end ml-0 sm:ml-6">
                        <div className="text-left sm:text-right mb-4">
                          <div className="text-xs text-gray-500 mb-2">
                            For 2 Adults
                          </div>
                          <div className="text-xs text-gray-400">
                            Including Transfers
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-2xl font-bold text-gray-900 mb-3">{pkg.price}</div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button 
                              onClick={() => router.push(`/itinerary/romantic/${pkg.id}`)}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 text-sm"
                            >
                              View Itinerary
                            </button>
                            <button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 text-sm">
                              Book Romance
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))
                )}
                </div>
              </div>

              {/* Pagination */}
              {!loading && currentPackages.length > 0 && totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-4">
                  <button
                    onClick={prevPackages}
                    disabled={currentPackageIndex === 0}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      currentPackageIndex === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page indicators */}
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentPackageIndex
                            ? 'bg-gradient-to-r from-pink-500 to-orange-500 scale-125'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextPackages}
                    disabled={currentPackageIndex === totalPages - 1}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      currentPackageIndex === totalPages - 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Package counter */}
              {!loading && (
                <div className="text-center mt-4 text-gray-600 text-sm">
                  {sortedPackages.length > 0 ? (
                    <>Showing {currentPackageIndex * packagesPerPage + 1}-{Math.min((currentPackageIndex + 1) * packagesPerPage, sortedPackages.length)} of {sortedPackages.length} romantic packages</>
                  ) : (
                    <span className="text-pink-600 font-medium">No romantic packages match your selected filters. Try adjusting your criteria.</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      <Footer />
    </div>
  );
};

export default RomanticHideawayPage; 