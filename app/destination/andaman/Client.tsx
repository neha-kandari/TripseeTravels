'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDuration, extractNights } from '../../utils/durationFormatter';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Reveal from '../../components/Reveal';

interface Package {
  id: string;
  image: string;
  days: string;
  title: string;
  location: string;
  price: string;
  type: string;
  hotelRating: number;
  features: string[];
  highlights: string;
  name?: string;
}

const AndamanPage = ({ initialPackages = [] }: { initialPackages?: any[] }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [selectedHotelRatings, setSelectedHotelRatings] = useState<number[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 38000, max: 95000 });
  const [sortBy, setSortBy] = useState('price-low');
  const [showAllCities, setShowAllCities] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [cityNames, setCityNames] = useState<string[]>([
    "Port Blair", "Havelock Island", "Neil Island", "Baratang",
    "Ross Island", "Viper Island", "North Bay"
  ]);

  const originalPriceRange = { min: 38000, max: 95000 };

  const [allPackages, setAllPackages] = useState(initialPackages);
  const [loading, setLoading] = useState(true);

  // __seed_from_localStorage__
  // Hydrate-safe: empty initial state matches SSR HTML, then on mount we
  // sync-read localStorage and paint cached packages immediately so repeat
  // visits don't show a "loading..." flash before the API responds.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const cached = localStorage.getItem('tripsee_packages_andaman');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllPackages(parsed);
          setLoading(false);
        }
      }
    } catch {}
  }, []);

  // Fetch packages from MongoDB
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/destinations/andaman/packages');
      if (response.ok) {
        const data = await response.json();
        const apiPackages = data.packages || [];

        // Transform MongoDB packages to match the expected format
        const transformedPackages = apiPackages.map((pkg: any) => ({
          id: pkg.id || pkg._id || 'unknown-id',
          image: pkg.image || '/placeholder-image.jpg',
          days: pkg.days || pkg.duration || 'N/A',
          title: pkg.title || pkg.name || 'Andaman Package',
          location: pkg.location || 'Andaman Islands',
          price: typeof pkg.price === 'number' ? `₹${pkg.price.toLocaleString()}/-` : (pkg.price || '₹0/-'),
          type: pkg.type || pkg.category || 'Package',
          hotelRating: pkg.hotelRating || 3,
          features: pkg.features || [],
          highlights: pkg.highlights || 'Amazing Andaman experience',
          name: pkg.name || 'Andaman Package'
        }));

        setAllPackages(transformedPackages);
        if (typeof window !== 'undefined' && Array.isArray(transformedPackages) && transformedPackages.length > 0) {
          localStorage.setItem('tripsee_packages_andaman', JSON.stringify(transformedPackages));
        }

        // Update city names from package locations
        const locations = transformedPackages.map((pkg: Package) => pkg.location).filter(Boolean);
        const uniqueCities = [...new Set(locations)] as string[];
        if (uniqueCities.length > 0) {
          setCityNames(uniqueCities);
        }
      } else {
        console.error('Failed to fetch packages from API');
        setAllPackages([]);
        // localStorage cache intentionally not updated on error
      }
    } catch (error) {
      console.error('Failed to fetch Andaman packages:', error);
      setAllPackages([]);
        // localStorage cache intentionally not updated on error
    } finally {
      setLoading(false);
    }
  };

  const refreshPackages = () => {
    if (allPackages.length === 0) setLoading(true);
    fetchPackages();
  };

  // Handle package click to navigate to dynamic itinerary
  const handlePackageClick = async (packageData: { title: string; id?: string }) => {
    console.log('Package clicked:', packageData);

    if (!packageData.id || packageData.id === 'undefined') {
      console.log('No valid package ID found');
      alert('No itinerary found for this package. Please contact us for more details.');
      return;
    }

    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/destinations/andaman/itineraries?packageId=${packageData.id}&t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const itineraries = data.itineraries || data.itinerary || data;
        console.log('Fetched itineraries:', itineraries);
        const matchingItinerary = itineraries.find((it: any) => it.packageId === packageData.id);

        if (matchingItinerary) {
          console.log('Found matching itinerary, navigating to dynamic page:', matchingItinerary);
          router.push(`/itinerary/andaman/dynamic/${packageData.id}`);
          return;
        } else {
          console.log('No matching itinerary found for packageId:', packageData.id);
          alert('No itinerary found for this package. Please contact us for more details.');
        }
      } else {
        console.error('API response not ok:', response.status);
        alert('Error loading package details. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      alert('Error loading package details. Please try again.');
    }
  };

  // Helper function to parse price from different formats
  const parsePrice = (priceString: string | number | undefined | null): number => {
    // Handle null/undefined cases
    if (priceString === null || priceString === undefined) {
      return 0;
    }

    // If it's already a number, return it
    if (typeof priceString === 'number') {
      return priceString;
    }

    // Convert to string and handle string prices
    let price = priceString.toString();

    if (price.includes('INR')) {
      price = price.replace('INR', '').replace(/,/g, '');
    } else {
      price = price.replace(/[₹,]/g, '').replace(/-/g, '');
    }

    return parseInt(price) || 0;
  };

  // Filter packages based on selected criteria
  const filteredPackages = allPackages.filter(pkg => {
    // City filter
    if (selectedCities.length > 0) {
      const packageCity = pkg.location.toLowerCase();
      const hasMatchingCity = selectedCities.some(selectedCity =>
        packageCity.includes(selectedCity.toLowerCase())
      );
      if (!hasMatchingCity) return false;
    }

    // Hotel rating filter
    if (selectedHotelRatings.length > 0) {
      if (!selectedHotelRatings.includes(pkg.hotelRating)) return false;
    }

    // Duration filter
    if (selectedDurations.length > 0) {
      const packageDuration = pkg.days.toLowerCase();
      const hasMatchingDuration = selectedDurations.some(duration =>
        packageDuration.includes(duration.toLowerCase())
      );
      if (!hasMatchingDuration) return false;
    }

    // Price range filter
    const packagePrice = parsePrice(pkg.price);
    if (packagePrice < priceRange.min || packagePrice > priceRange.max) return false;

    return true;
  });

  // Sort packages
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    const priceA = parsePrice(a.price);
    const priceB = parsePrice(b.price);

    switch (sortBy) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
      case 'duration':
        return a.days.localeCompare(b.days);
      default:
        return 0;
    }
  });

  // Pagination
  const packagesPerPage = 3;
  const totalPages = Math.ceil(sortedPackages.length / packagesPerPage);
  const startIndex = currentPackageIndex * packagesPerPage;
  const endIndex = startIndex + packagesPerPage;
  const currentPackages = sortedPackages.slice(startIndex, endIndex);

  // Navigation functions
  const nextPackages = () => {
    setCurrentPackageIndex(prev => (prev + 1) % totalPages);
  };

  const prevPackages = () => {
    setCurrentPackageIndex(prev => (prev - 1 + totalPages) % totalPages);
  };

  // Filter functions
  const toggleCity = (city: string) => {
    setSelectedCities(prev =>
      prev.includes(city)
        ? prev.filter(c => c !== city)
        : [...prev, city]
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

  const handlePriceRangeChange = (newRange: { min: number; max: number }) => {
    setPriceRange(newRange);
    setCurrentPackageIndex(0);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCities([]);
    setSelectedHotelRatings([]);
    setSelectedDurations([]);
    setPriceRange(originalPriceRange);
    setCurrentPackageIndex(0);
  };

  const sliderImages = [
    {
      src: "/Destination/AndamanHero/image1.webp",
      title: "Port Blair",
      subtitle: "Gateway to the Andaman Islands",
      description: "Discover the capital city with its rich history, colonial architecture, and vibrant culture. Port Blair serves as the perfect starting point for your Andaman adventure, offering a blend of historical significance and modern amenities."
    },
    {
      src: "/Destination/AndamanHero/image2.webp",
      title: "Havelock Island",
      subtitle: "Pristine beaches and crystal clear waters",
      description: "Experience the world-famous Radhanagar Beach and untouched natural beauty. Havelock Island is renowned for its stunning beaches, vibrant coral reefs, and perfect conditions for water sports and relaxation."
    },
    {
      src: "/Destination/AndamanHero/image3.webp",
      title: "Neil Island",
      subtitle: "Tranquil paradise for relaxation",
      description: "Unwind on serene beaches and explore the peaceful charm of this hidden gem. Neil Island offers a slower pace of life with pristine beaches, lush greenery, and a perfect escape from the hustle and bustle."
    },
    {
      src: "/Destination/AndamanHero/image4.webp",
      title: "Baratang Island",
      subtitle: "Limestone caves and tribal heritage",
      description: "Journey through mangrove creeks to discover ancient limestone caves and tribal culture. Baratang Island offers unique experiences including limestone caves, mud volcanoes, and glimpses into the indigenous Jarawa culture."
    }
  ];

  // Function to get description based on current image index
  const getImageDescription = (index: number) => {
    return sliderImages[index].description;
  };

  const destinationCards = [
    {
      image: "/Destination/AndamanHero/image1.webp",
      subtitle: "Port Blair",
      title: "GATEWAY"
    },
    {
      image: "/Destination/AndamanHero/image2.webp",
      subtitle: "Havelock Island",
      title: "BEACH PARADISE"
    },
    {
      image: "/Destination/AndamanHero/image3.webp",
      subtitle: "Neil Island",
      title: "TRANQUIL ESCAPE"
    },
    {
      image: "/Destination/AndamanHero/image4.webp",
      subtitle: "Baratang Island",
      title: "CAVE ADVENTURE"
    }
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-amber-700 via-orange-800 to-rose-900 overflow-hidden">
        {/* Main Background Image */}
        <div className="absolute inset-0">
          {sliderImages.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.title || 'Andaman destination'}
              fill
              sizes="100vw"
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "low"}
              quality={60}
              loading={i === 0 ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              className={`object-cover scale-105 transition-opacity duration-1000 ${i === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>

        {/* Hero Content Layout - Mobile First Design with Animations */}
        <div className="relative z-10 h-full flex flex-col justify-end lg:justify-center px-4 sm:px-6 md:px-8 lg:px-12 pb-8 sm:pb-12 lg:pb-0">
          {/* Text Content - Positioned at bottom on mobile, left on desktop */}
          <div className="text-white text-center lg:text-left mb-8 lg:mb-0 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl lg:mt-20 relative z-40 mx-auto lg:mx-0">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-orange-300 mb-2 sm:mb-3 font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {sliderImages[currentImageIndex].subtitle}
            </p>
            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-2xl leading-tight font-limelight text-orange-300 animate-fade-in-up`} style={{ animationDelay: '0.4s' }}>
              {sliderImages[currentImageIndex].title.toUpperCase()}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white mb-6 sm:mb-8 font-light max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              {getImageDescription(currentImageIndex)}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              {/* Play Button */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-all duration-300 hover:scale-110 shadow-lg animate-float">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 1 0 001.555.832l3-2a1 1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Discover Button */}
              <a
                href="https://wa.me/918595682910?text=Hi! I'm interested in discovering more about Andaman destinations. Please help me plan my trip to this amazing island paradise."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent border-2 border-cyan-400 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 hover:bg-cyan-400 hover:text-gray-900 hover:scale-105 shadow-lg"
              >
                DISCOVER LOCATION
              </a>
            </div>
          </div>

          {/* Destination Cards - Positioned below text on mobile, right side on desktop */}
          <div className="flex-shrink-0 w-full lg:w-auto lg:absolute lg:bottom-24 xl:bottom-32 lg:right-8 xl:right-12 z-10 mt-8 lg:mt-0">
            <div className="flex gap-2 sm:gap-3 items-center justify-center overflow-x-auto lg:overflow-hidden pb-2 lg:pb-0 px-2 sm:px-0">
              {destinationCards
                .slice(currentImageIndex)
                .concat(destinationCards.slice(0, currentImageIndex))
                .map((card, index) => (
                  <div
                    key={`${card.subtitle}-${currentImageIndex}`}
                    className={`relative transition-all duration-700 ease-out cursor-pointer ${index === 0 ? 'z-30 scale-105' : 'opacity-70 hover:opacity-90 z-20'
                      }`}
                    onClick={() => setCurrentImageIndex((destinationCards.findIndex(c => c.subtitle === card.subtitle)))}
                  >
                    <div className="relative w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 lg:w-36 lg:h-48 xl:w-40 xl:h-52 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border-2 border-white/30">
                      <Image
                        src={card.image}
                        alt={card.title || 'Andaman destination card'}
                        fill
                        className="object-cover transition-transform duration-700"
                        key={`${card.subtitle}-${currentImageIndex}`}
                        sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
                        quality={85}
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                      {/* Card Content */}
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 text-white">
                        <p className="text-xs sm:text-sm text-white mb-1 font-medium drop-shadow-lg">
                          {card.subtitle}
                        </p>
                        <h3 className="text-xs sm:text-sm md:text-base font-bold text-white drop-shadow-lg">
                          {card.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center gap-3 sm:gap-4 mt-4 w-full">
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Current Slide Number */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-white text-2xl sm:text-3xl md:text-4xl font-bold z-20 animate-float">
          {String(currentImageIndex + 1).padStart(2, '0')}
        </div>
      </section>

      {/* Packages Section */}
      <Reveal>
      <section id="packages-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Discover Your Perfect Andaman Package</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              From pristine beaches to rich marine life, explore Andaman&apos;s stunning beauty with our curated packages
            </p>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <span className="font-medium text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-1/4 bg-white rounded-lg p-4 lg:p-6 h-fit shadow-lg`}>
              {/* Clear Filters Button */}
              {(selectedCities.length > 0 || selectedHotelRatings.length > 0 || selectedDurations.length > 0 || priceRange.max < 95000) && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setSelectedCities([]);
                      setSelectedHotelRatings([]);
                      setSelectedDurations([]);
                      setPriceRange({ min: 38000, max: 95000 });
                      setSortBy('price-low');
                      setCurrentPackageIndex(0);
                    }}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* City Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cities</h3>
                <div className="space-y-3">
                  {(() => {
                    // Calculate city counts dynamically from actual packages
                    const cityCounts = allPackages.reduce((acc: { [key: string]: number }, pkg) => {
                      // Extract cities from package location
                      if (pkg.location) {
                        const cities = pkg.location.split(/[&,]/).map(city => city.trim());
                        cities.forEach(city => {
                          // Handle special cases and normalize city names
                          let normalizedCity = city;
                          if (city === "Havelock Island") normalizedCity = "Havelock Island";
                          if (city === "Port Blair") normalizedCity = "Port Blair";
                          if (city === "Neil Island") normalizedCity = "Neil Island";
                          if (city === "Baratang Island") normalizedCity = "Baratang Island";
                          acc[normalizedCity] = (acc[normalizedCity] || 0) + 1;
                        });
                      }
                      return acc;
                    }, {});

                    // Create city data with actual counts
                    const cityData = cityNames.map(name => ({
                      name,
                      count: cityCounts[name] || 0
                    }));

                    // Show only first 4 cities initially
                    const displayedCities = showAllCities ? cityData : cityData.slice(0, 4);

                    return (
                      <>
                        {displayedCities.map((city) => (
                          <label key={city.name} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-3 rounded text-orange-500 focus:ring-orange-500"
                                checked={selectedCities.includes(city.name)}
                                onChange={() => toggleCity(city.name)}
                              />
                              <span className="text-gray-700">{city.name}</span>
                            </div>
                            <span className="text-gray-500" suppressHydrationWarning>({city.count})</span>
                          </label>
                        ))}
                        {!showAllCities && cityData.length > 4 && (
                          <button
                            onClick={() => setShowAllCities(true)}
                            className="w-full text-left text-red-500 hover:text-red-600 text-sm font-medium mt-2"
                          >
                            Show More
                          </button>
                        )}
                        {showAllCities && cityData.length > 4 && (
                          <button
                            onClick={() => setShowAllCities(false)}
                            className="w-full text-left text-red-500 hover:text-red-600 text-sm font-medium mt-2"
                          >
                            See Less
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Hotel Rating Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Rating</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[3, 4, 5].map((stars) => {
                    // Calculate count dynamically based on actual packages
                    const count = allPackages.filter(pkg => {
                      return pkg.hotelRating === stars;
                    }).length;
                    return (
                      <button
                        key={stars}
                        onClick={() => toggleHotelRating(stars)}
                        className={`px-3 py-2 border rounded-lg transition-colors relative ${selectedHotelRatings.includes(stars)
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-gray-300 hover:bg-orange-100 hover:border-orange-300'
                          }`}
                      >
                        <span>{stars} Star</span>
                        <span className={`ml-1 text-xs ${selectedHotelRatings.includes(stars) ? 'text-orange-200' : 'text-gray-500'
                          }`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Min: ₹{priceRange.min.toLocaleString()}</span>
                    <span>Max: ₹{priceRange.max.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      value={priceRange.max}
                      onChange={(e) => handlePriceRangeChange({ min: 0, max: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-orange-500"
                      style={{
                        background: `linear-gradient(to right, #fb923c 0%, #fb923c ${((priceRange.max - 0) / (200000 - 0)) * 100}%, #e5e7eb ${((priceRange.max - 0) / (200000 - 0)) * 100}%, #e5e7eb 100%)`
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                  {['3 Nights', '4 Nights', '5 Nights', '6 Nights', '7 Nights'].map((duration) => {
                    // Calculate count dynamically based on actual packages
                    const count = allPackages.filter(pkg => {
                      if (!pkg.days) return false;
                      const nightsPart = extractNights(pkg.days);
                      return nightsPart === duration;
                    }).length;
                    return (
                      <button
                        key={duration}
                        onClick={() => toggleDuration(duration)}
                        className={`px-3 py-2 border rounded-lg transition-colors text-sm ${selectedDurations.includes(duration)
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-gray-300 hover:bg-orange-100 hover:border-orange-300'
                          }`}
                      >
                        <span>{duration}</span>
                        <span className={`ml-1 text-xs ${selectedDurations.includes(duration) ? 'text-orange-200' : 'text-gray-500'
                          }`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Packages Grid */}
            <div className="w-full lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                <span className="text-gray-600">Trending Packages Only</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Sorting</span>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
              <div className="h-[800px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-gray-100 hover:scrollbar-thumb-orange-400">
                <div className="space-y-6">
                  {loading && currentPackages.length === 0 ? (
                    // Loading skeleton — page is fully visible while packages load
                    <div className="space-y-6">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/3 h-48 bg-gray-200"></div>
                            <div className="w-full md:w-2/3 p-6">
                              <div className="h-4 bg-gray-200 rounded mb-3 w-1/4"></div>
                              <div className="h-6 bg-gray-200 rounded mb-2"></div>
                              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                              <div className="flex justify-between items-center mt-6">
                                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : currentPackages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-500 text-lg mb-4">No packages found</div>
                      <div className="text-gray-400 text-sm">Try adjusting your filters</div>
                    </div>
                  ) : null}
                  {!loading && currentPackages.map((pkg, index) => {
                    return (
                      <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Mobile: Stacked layout, Desktop: Horizontal layout */}
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                            <Image
                              src={pkg.image || '/placeholder-image.jpg'}
                              alt={pkg.title || 'Andaman travel package'}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                              quality={85}
                              loading="lazy"
                            />
                          </div>

                          <div className="w-full md:w-2/3 p-4 md:p-6 flex flex-col md:flex-row md:justify-between">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-sm text-gray-500">{formatDuration(pkg.days)}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${pkg.type === 'Classic' ? 'bg-blue-100 text-blue-700' :
                                    pkg.type === 'Adventure' ? 'bg-purple-100 text-purple-700' :
                                      pkg.type === 'Complete' ? 'bg-green-100 text-green-700' :
                                        pkg.type === 'Luxury' ? 'bg-indigo-100 text-indigo-700' :
                                          'bg-gray-100 text-gray-700'
                                  }`}>
                                  {pkg.type}
                                </span>
                                <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                  <span className="text-yellow-500 mr-1">â­</span>
                                  {pkg.hotelRating} Star
                                </span>
                              </div>
                              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 leading-tight">{pkg.title}</h3>
                              <div className="text-sm text-gray-600 mb-3">{pkg.location}</div>
                              <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                                {pkg.highlights}
                              </div>
                              <div className="flex flex-wrap gap-1 mb-4">
                                {(pkg.features || []).map((feature) => (
                                  <span
                                    key={feature}
                                    className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Price and Button */}
                            <div className="flex flex-col justify-between items-start md:items-end mt-4 md:mt-0 md:ml-6">
                              <div className="text-left md:text-right mb-4">
                                <div className="text-xs text-gray-500 mb-2">For 2 Adults</div>
                                <div className="text-xs text-gray-400">Excluding Flights</div>
                              </div>
                              <div className="text-left md:text-right w-full md:w-auto">
                                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{pkg.price}</div>
                                <button
                                  onClick={() => handlePackageClick(pkg)}
                                  className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center items-center mt-8 gap-4">
                <button
                  onClick={prevPackages}
                  className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentPackageIndex
                          ? 'bg-orange-500 scale-125'
                          : 'bg-gray-300'
                        }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextPackages}
                  className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="text-center mt-4 text-gray-600 text-sm">
                {sortedPackages.length > 0 ? (
                  <>Showing {currentPackageIndex * packagesPerPage + 1}-{Math.min((currentPackageIndex + 1) * packagesPerPage, sortedPackages.length)} of {sortedPackages.length} packages</>
                ) : (
                  <span className="text-orange-600 font-medium">No packages match your selected filters. Try adjusting your criteria.</span>
                )}
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

export default AndamanPage; 
