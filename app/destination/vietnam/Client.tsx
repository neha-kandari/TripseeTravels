'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDuration, extractNights } from '../../utils/durationFormatter';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Reveal from '../../components/Reveal';
  // Helper function to parse price from string
  const parsePrice = (priceStr: string): number => {
    const match = priceStr.match(/₹?([\d,]+)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''), 10);
    }
    return 0;
  };

const VietnamPage = ({ initialPackages = [] }: { initialPackages?: any[] }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);

  const [selectedHotelRatings, setSelectedHotelRatings] = useState<number[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState('price-low');
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false); // State for showing all cities in filter
  const [selectedCities, setSelectedCities] = useState<string[]>([]); // State for selected cities
  const [showFilters, setShowFilters] = useState(false); // State for showing/hiding filters on mobile
  const [isRefreshing, setIsRefreshing] = useState(false); // State for refresh loading
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger for refreshing packages
  const [cityNames, setCityNames] = useState<string[]>([
    "Ho Chi Minh", "Da Nang", "Hanoi", "Ha Long Bay", 
    "Krong Siem Reap", "Phnom Penh", "Hoi An", "Phu Quoc", 
    "Sa Pa", "Mui Ne", "Nha Trang", "Hue"
  ]); // Default cities as fallback

  const sliderImages = [
    {
      src: "/Destination/veitnamHero/Halong Bay.webp",
      title: "Ha Long Bay",
      subtitle: "Mystical limestone karsts rising from emerald waters",
      description: "Experience the breathtaking beauty of Ha Long Bay, a UNESCO World Heritage site featuring thousands of limestone karsts and isles in various shapes and sizes. Cruise through emerald waters and explore hidden caves and floating villages."
    },
    {
      src: "/Destination/veitnamHero/Mekong River Delta.webp", 
      title: "Mekong River Delta",
      subtitle: "Floating markets and river life",
      description: "Discover the vibrant Mekong Delta, Vietnam's rice bowl. Navigate through narrow waterways, visit floating markets where locals trade from boats, and experience the authentic rural lifestyle of southern Vietnam."
    },
    {
      src: "/Destination/veitnamHero/Golden Bridge.webp",
      title: "Golden Bridge", 
      subtitle: "Iconic architectural marvel in the mountains",
      description: "Walk across the stunning Golden Bridge, held aloft by two giant stone hands emerging from the mountains. This architectural wonder offers spectacular views of the Ba Na Hills and the surrounding mountain landscape."
    },
    {
      src: "/Destination/veitnamHero/notre dame cathedral.webp",
      title: "Notre Dame Cathedral",
      subtitle: "Historic French colonial architecture in Ho Chi Minh",
      description: "Marvel at the Notre Dame Cathedral, a magnificent example of French colonial architecture in the heart of Ho Chi Minh City. Built with red bricks from Marseille, it stands as a symbol of the city's rich history."
    }
  ];

  // Function to get description based on current image index
  const getImageDescription = (index: number) => {
    return sliderImages[index].description;
  };

  const destinationCards = [
    {
      image: "/Destination/veitnamHero/Halong Bay.webp",
      subtitle: "Ha Long Bay",
      title: "VIETNAM BAY"
    },
    {
      image: "/Destination/veitnamHero/Mekong River Delta.webp",
      subtitle: "Mekong Delta",
      title: "RIVER LIFE"
    },
    {
      image: "/Destination/veitnamHero/Golden Bridge.webp",
      subtitle: "Golden Bridge",
      title: "MOUNTAIN VIEW"
    },
    {
      image: "/Destination/veitnamHero/notre dame cathedral.webp",
      subtitle: "Notre Dame",
      title: "HISTORIC"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        console.log('Fetching Vietnam cities from API...');
        const response = await fetch('/api/city-filters?destination=vietnam');
        const data = await response.json();
        console.log('Cities API response:', data);
        
        // The API returns cities directly as an array
        const cities = Array.isArray(data) ? data : (data.value || data.packages || data.package || []);
        console.log('Processed cities:', cities);
        
        const cityNames = cities.map((city: any) => typeof city === 'string' ? city : city.name);
        console.log('Setting city names:', cityNames);
        setCityNames(cityNames);
      } catch (error) {
        console.error('Error fetching cities:', error);
        // Keep default cities if API fails
      }
    };
    fetchCities();
  }, []);

  // Filter functions
  const toggleCity = (cityName: string) => {
    setSelectedCities(prev => 
      prev.includes(cityName) 
        ? prev.filter(c => c !== cityName)
        : [...prev, cityName]
    );
    setCurrentPackageIndex(0); // Reset to first page when filter changes
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

  const handlePriceChange = (value: number) => {
    setPriceRange(prev => ({ ...prev, max: value }));
    setCurrentPackageIndex(0);
  };

  // Package data - will be loaded from destinations API
  
  // Package data - will be loaded from destinations API
  const [allPackages, setAllPackages] = useState<Array<{
    id?: string;
    image: string;
    days: string;
    title: string;
    location: string;
    price: string;
    type: string;
    hotelRating: number;
    features: string[];
    highlights: string;
  }>>(initialPackages); // always start empty — localStorage is loaded after hydration in useEffect

  

  // Add a function to refresh packages and force re-render
  const refreshPackages = async () => {
    try {
      setIsRefreshing(true);
      console.log('Manually refreshing Vietnam packages from API...');
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/packages?destination=vietnam&t=${timestamp}`);
      
      if (response.ok) {
        const data = await response.json();
        const apiPackages = data.packages || data.package || data;
        console.log('Refreshed API packages:', apiPackages);
        
        // Transform MongoDB packages to match expected format
        const transformedPackages = apiPackages.map((pkg: any) => {
          return {
            id: pkg.id,
            title: pkg.name,
            name: pkg.name,
            description: pkg.description,
            price: `₹${pkg.price.toLocaleString()}/-`,
            duration: pkg.duration,
            days: pkg.days || pkg.duration, // Use days field if available, fallback to duration
            destination: pkg.destination,
            image: pkg.image,
            location: pkg.location || 'Location not specified',
            category: pkg.category || 'romantic',
            type: pkg.type || pkg.category || 'romantic', // Use type field if available
            hotelRating: pkg.hotelRating || 4, // Use actual hotelRating from database
            features: pkg.features || [],
            highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join(' â€¢ ') : pkg.highlights || pkg.description,
            itinerary: pkg.itinerary || [],
            inclusions: pkg.inclusions || [],
            exclusions: pkg.exclusions || [],
            bestTimeToVisit: pkg.bestTimeToVisit || '',
            isActive: pkg.isActive,
            createdAt: pkg.createdAt,
            updatedAt: pkg.updatedAt
          };
        });
        
        setAllPackages(transformedPackages);
        if (typeof window !== 'undefined' && Array.isArray(transformedPackages) && transformedPackages.length > 0) {
          localStorage.setItem('tripsee_packages_vietnam', JSON.stringify(transformedPackages));
        }
        setRefreshTrigger(prev => prev + 1);
      } else {
        console.error('Failed to refresh packages:', response.status);
      }
    } catch (error) {
      console.error('Error refreshing packages:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh functionality removed to prevent skeleton flashes on scroll

  // Fetch packages from destinations API
  // __seed_from_localStorage__
  // Hydrate-safe: empty initial state matches SSR HTML, then on mount we
  // sync-read localStorage and paint cached packages immediately so repeat
  // visits don't show a "loading..." flash before the API responds.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const cached = localStorage.getItem('tripsee_packages_vietnam');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllPackages(parsed);
          setIsLoading(false);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        console.log('Fetching Vietnam packages from API...');
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/admin/packages?destination=vietnam&t=${timestamp}`);
        
        if (response.ok) {
          const data = await response.json();
          const apiPackages = data.packages || data.package || data;
          console.log('API packages received:', apiPackages);
          console.log('Setting packages from API:', apiPackages.length);
          
          // Transform MongoDB packages to match expected format
          const transformedPackages = apiPackages.map((pkg: any) => {
            console.log('VIETNAM FRONTEND TRANSFORM: Raw package:', pkg);
            console.log('VIETNAM FRONTEND TRANSFORM: Package location:', pkg.location);
            console.log('VIETNAM FRONTEND TRANSFORM: Package hotelRating:', pkg.hotelRating);
            console.log('VIETNAM FRONTEND TRANSFORM: Package days:', pkg.days);
            
            return {
              id: pkg.id, // Use the already transformed id field from API
              title: pkg.name,
              name: pkg.name,
              description: pkg.description,
              price: `₹${pkg.price.toLocaleString()}/-`,
              duration: pkg.duration,
              days: pkg.days || pkg.duration, // Use days field if available, fallback to duration
              destination: pkg.destination,
              image: pkg.image,
              location: pkg.location || 'Location not specified', // Add fallback for missing location
              category: pkg.category || 'romantic',
              type: pkg.type || pkg.category || 'romantic', // Use type field if available
              hotelRating: pkg.hotelRating || 4, // Use actual hotelRating from database
              features: pkg.features || [],
              highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join(' â€¢ ') : pkg.highlights || pkg.description,
              itinerary: pkg.itinerary || [],
              inclusions: pkg.inclusions || [],
              exclusions: pkg.exclusions || [],
              bestTimeToVisit: pkg.bestTimeToVisit || '',
              isActive: pkg.isActive,
              createdAt: pkg.createdAt,
              updatedAt: pkg.updatedAt
            };
          });
          
          setAllPackages(transformedPackages);
        if (typeof window !== 'undefined' && Array.isArray(transformedPackages) && transformedPackages.length > 0) {
          localStorage.setItem('tripsee_packages_vietnam', JSON.stringify(transformedPackages));
        }
          
          // Log filter counts for debugging
          console.log('VIETNAM FILTER COUNTS UPDATE:');
          console.log('Total packages:', transformedPackages.length);
          console.log('Hotel ratings:', {
            3: transformedPackages.filter((pkg: any) => pkg.hotelRating === 3).length,
            4: transformedPackages.filter((pkg: any) => pkg.hotelRating === 4).length,
            5: transformedPackages.filter((pkg: any) => pkg.hotelRating === 5).length
          });
          console.log('Durations:', {
            '3 Nights': transformedPackages.filter((pkg: any) => pkg.days === '3 Nights').length,
            '4 Nights': transformedPackages.filter((pkg: any) => pkg.days === '4 Nights').length,
            '5 Nights': transformedPackages.filter((pkg: any) => pkg.days === '5 Nights').length,
            '6 Nights': transformedPackages.filter((pkg: any) => pkg.days === '6 Nights').length,
            '7 Nights': transformedPackages.filter((pkg: any) => pkg.days === '7 Nights').length
          });
        } else {
          console.error('API response not ok:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch Vietnam packages:', error);
      }
    };

    fetchPackages();
  }, [refreshTrigger]); // Add refreshTrigger as dependency

  // Update price range when packages change
  useEffect(() => {
    if (allPackages.length > 0) {
      const prices = allPackages.map(pkg => parsePrice(pkg.price)).filter(price => price > 0);
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ min: minPrice, max: maxPrice });
      }
    }
  }, [allPackages]);


  // Update price range when packages change
  useEffect(() => {
    if (allPackages.length > 0) {
      const prices = allPackages.map(pkg => parsePrice(pkg.price)).filter(price => price > 0);
      
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ min: minPrice, max: maxPrice });
      }
    }
  }, [allPackages]);

  // Filter and sort logic
  const filteredPackages = allPackages.filter(pkg => {
    // City filter
    if (selectedCities.length > 0) {
      const packageCities = pkg.location ? pkg.location.split(/[&,]/).map(city => city.trim()) : [];
      const hasSelectedCity = selectedCities.some(selectedCity => 
        packageCities.some(packageCity => 
          packageCity === selectedCity || 
          (selectedCity === "Ha Long Bay" && packageCity === "Ha Long") ||
          (selectedCity === "Ho Chi Minh" && packageCity === "Ho Chi Minh City")
        )
      );
      if (!hasSelectedCity) {
        return false;
      }
    }
    

    if (selectedHotelRatings.length > 0 && !selectedHotelRatings.includes(pkg.hotelRating)) {
      return false;
    }
    if (selectedDurations.length > 0) {
      if (!pkg.days) return false;
      const nightsPart = extractNights(pkg.days);
      const matchesDuration = selectedDurations.some(duration => {
        return nightsPart === duration;
      });
      if (!matchesDuration) return false;
    }
    // Handle both INR and ₹ price formats
    const priceNum = parsePrice(pkg.price);
    if (priceNum > priceRange.max) {
      return false;
    }
    return true;
  });

  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parsePrice(a.price) - parsePrice(b.price);
      case 'price-high':
        return parsePrice(b.price) - parsePrice(a.price);
      case 'duration':
        const daysA = parseInt(a.days.split(' ')[0]);
        const daysB = parseInt(b.days.split(' ')[0]);
        return daysA - daysB;
      case 'rating':
        return b.hotelRating - a.hotelRating;
      case 'popularity':
        const typeOrder: { [key: string]: number } = { 'Classic': 1, 'Cultural': 2, 'Luxury': 3, 'Complete': 4, 'Quick': 5 };
        return (typeOrder[a.type] || 6) - (typeOrder[b.type] || 6);
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

  const handlePackageClick = async (packageData: { title: string; id?: string }) => {
    console.log('Package clicked:', packageData); // Debug log
    
    try {
      // First, try to fetch itinerary from the API using packageId
      if (packageData.id) {
        // Add cache busting to ensure fresh data
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/admin/destinations/vietnam/itineraries?packageId=${packageData.id}&t=${timestamp}`, {
          cache: 'no-store', // Ensure no caching
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
        const packages = data.packages || data.package || data;
          const itineraries = data.packages || data.package || data;
          console.log('Fetched itineraries:', itineraries); // Debug log
          const matchingItinerary = itineraries.find((it: any) => it.packageId === packageData.id);
          
          if (matchingItinerary) {
            console.log('Found matching itinerary, navigating to dynamic page:', matchingItinerary); // Debug log
            // If we found an itinerary, navigate to a dynamic itinerary page
            router.push(`/itinerary/vietnam/dynamic/${packageData.id}`);
            return;
          } else {
            console.log('No matching itinerary found for packageId:', packageData.id); // Debug log
          }
        } else {
          console.error('API response not ok:', response.status); // Debug log
        }
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
    }
    
    // For packages without itineraries, show simple alert
    alert(`Detailed itinerary for ${packageData.title} coming soon!`);
  };

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

  return (
    <div className="min-h-screen bg-white vietnam-page">
      <Header />
      

      
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-amber-700 via-orange-800 to-rose-900 overflow-hidden">
        {/* Main Background Image */}
        <div className="absolute inset-0">
          {sliderImages.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.title || 'Vietnam destination'}
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
                href="https://wa.me/918595682910?text=Hi! I'm interested in discovering more about Vietnam destinations. Please help me plan my trip to this amazing country." 
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
                  className={`relative transition-all duration-700 ease-out cursor-pointer ${
                    index === 0 ? 'z-30 scale-105' : 'opacity-70 hover:opacity-90 z-20'
                  }`}
                  onClick={() => setCurrentImageIndex((destinationCards.findIndex(c => c.subtitle === card.subtitle)))}
                >
                  <div className="relative w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 lg:w-36 lg:h-48 xl:w-40 xl:h-52 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border-2 border-white/30">
                    <Image
                      src={card.image}
                      alt={card.title || 'Vietnam destination card'}
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Discover Your Perfect Vietnam Package</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              From cultural heritage to natural wonders, explore Vietnam&apos;s diverse beauty with our curated packages
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
              {(selectedCities.length > 0 || selectedHotelRatings.length > 0 || selectedDurations.length > 0 || priceRange.max < 110000) && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setSelectedCities([]);
                      setSelectedHotelRatings([]);
                      setSelectedDurations([]);
                      setPriceRange({ min: 48000, max: 110000 });
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
                      // Extract cities from package location (e.g., "Hanoi, Ha Long & Ho Chi Minh" -> ["Hanoi", "Ha Long", "Ho Chi Minh"])
                      if (pkg.location) {
                        const cities = pkg.location.split(/[&,]/).map(city => city.trim());
                        cities.forEach(city => {
                          // Handle special cases and normalize city names
                          let normalizedCity = city;
                          if (city === "Ha Long") normalizedCity = "Ha Long Bay";
                          if (city === "Ho Chi Minh City") normalizedCity = "Ho Chi Minh";
                          if (city === "North & South Vietnam") {
                            // Split this into multiple cities
                            ["Hanoi", "Ho Chi Minh"].forEach(c => {
                              acc[c] = (acc[c] || 0) + 1;
                            });
                            return;
                          }
                          acc[normalizedCity] = (acc[normalizedCity] || 0) + 1;
                        });
                      }
                      return acc;
                    }, {});

                    // Use cities from API state

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
                    // Calculate count dynamically based on actual packages - only count packages that actually have this hotelRating
                    const count = allPackages.filter(pkg => {
                      return pkg.hotelRating === stars;
                    }).length;
                    return (
                      <button
                        key={stars}
                        onClick={() => toggleHotelRating(stars)}
                        className={`px-3 py-2 border rounded-lg transition-colors relative ${
                          selectedHotelRatings.includes(stars)
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-gray-300 hover:bg-orange-100 hover:border-orange-300'
                        }`}
                      >
                        <span>{stars} Star</span>
                        <span className={`ml-1 text-xs ${
                          selectedHotelRatings.includes(stars) ? 'text-orange-200' : 'text-gray-500'
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
                      max="500000"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-orange-500"
                      style={{
                        background: `linear-gradient(to right, #fb923c 0%, #fb923c ${((priceRange.max - 0) / (500000 - 0)) * 100}%, #e5e7eb ${((priceRange.max - 0) / (500000 - 0)) * 100}%, #e5e7eb 100%)`
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
                        className={`px-3 py-2 border rounded-lg transition-colors text-sm ${
                          selectedDurations.includes(duration)
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-gray-300 hover:bg-orange-100 hover:border-orange-300'
                        }`}
                      >
                        <span>{duration}</span>
                        <span className={`ml-1 text-xs ${
                          selectedDurations.includes(duration) ? 'text-orange-200' : 'text-gray-500'
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
                {currentPackages.map((pkg, index) => {
                  // Debug logging
                  if (index === 0) {
                    console.log('Rendering packages:', currentPackages.length, 'packages');
                    console.log(`Package ${index}:`, pkg.title, 'Location:', pkg.location);
                  }
                  return (
                  <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Mobile: Stacked layout, Desktop: Horizontal layout */}
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                      <Image
                        src={pkg.image}
                        alt={pkg.title || 'Vietnam travel package'}
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pkg.type === 'Classic' ? 'bg-blue-100 text-blue-700' :
                            pkg.type === 'Cultural' ? 'bg-purple-100 text-purple-700' :
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
                          {pkg.features.map((feature) => (
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
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentPackageIndex
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

export default VietnamPage; 
