'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDuration, extractNights } from '../../utils/durationFormatter';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Reveal from '../../components/Reveal';

const SingaporePage = ({ initialPackages = [] }: { initialPackages?: any[] }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [selectedHotelRatings, setSelectedHotelRatings] = useState<number[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 55000, max: 120000 });
  const [sortBy, setSortBy] = useState('price-low');
  const [showAllCities, setShowAllCities] = useState(false); // State for showing all cities in filter
  const [selectedCities, setSelectedCities] = useState<string[]>([]); // State for selected cities
  const [showFilters, setShowFilters] = useState(false); // State for showing/hiding filters on mobile
  const [cityNames, setCityNames] = useState<string[]>([
    "Singapore City", "Sentosa", "Marina Bay", "Chinatown",
    "Little India", "Orchard Road", "Clarke Quay"
  ]); // Default cities as fallback
  const [citiesLoading, setCitiesLoading] = useState(false); // Loading state for cities
  
  // Store original price range for reset functionality
  const originalPriceRange = { min: 55000, max: 120000 };

  // Helper function to parse price from string
  const parsePrice = (priceStr: string): number => {
    const match = priceStr.match(/₹?([\d,]+)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
    return 0;
  };
  
  // Package data - will be loaded from destinations API
  const [allPackages, setAllPackages] = useState<Array<{
    id?: string;
    image: string;
    days: string;
    title: string;
    name?: string;
    location: string;
    price: string;
    type: string;
    hotelRating: number;
    features: string[];
    highlights: string;
  }>>(initialPackages); // always start empty — localStorage loaded after hydration

  

  // Fetch packages from MongoDB API
  // __seed_from_localStorage__
  // Hydrate-safe: empty initial state matches SSR HTML, then on mount we
  // sync-read localStorage and paint cached packages immediately so repeat
  // visits don't show a "loading..." flash before the API responds.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const cached = localStorage.getItem('tripsee_packages_singapore');
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
        console.log('Fetching Singapore packages from MongoDB API...');
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/admin/destinations/singapore/packages?t=${timestamp}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Raw API response:', data);
          const apiPackages = data.packages || data.package || data;
          console.log('API packages received:', apiPackages);
          
          // Transform MongoDB packages to match expected format
          const transformedPackages = apiPackages.map((pkg: any) => ({
            id: pkg._id,
            title: pkg.name,
            name: pkg.name,
            description: pkg.description,
            price: `₹${pkg.price.toLocaleString()}/-`,
            duration: pkg.duration,
            days: pkg.duration,
            destination: pkg.destination,
            location: pkg.location,
            image: pkg.image,
            category: pkg.category || 'romantic',
            type: pkg.type || pkg.category || 'Standard',
            hotelRating: pkg.hotelRating || 4, // Add hotelRating field
            features: pkg.features || [],
            highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join(' â€¢ ') : pkg.highlights || pkg.description,
            itinerary: pkg.itinerary || [],
            inclusions: pkg.inclusions || [],
            exclusions: pkg.exclusions || [],
            bestTimeToVisit: pkg.bestTimeToVisit || '',
            isActive: pkg.isActive,
            createdAt: pkg.createdAt,
            updatedAt: pkg.updatedAt
          }));
          
          console.log('Transformed packages:', transformedPackages);
          setAllPackages(transformedPackages);
        if (typeof window !== 'undefined' && Array.isArray(transformedPackages) && transformedPackages.length > 0) {
          localStorage.setItem('tripsee_packages_singapore', JSON.stringify(transformedPackages));
        }
        } else {
          console.error('API response not ok:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch Singapore packages:', error);
        // Keep existing packages if API fails
      }
    };

    fetchPackages();
  }, []); // Only run once on component mount

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

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/city-filters?destination=singapore');
        const data = await response.json();
        const cities = data.value || data.packages || data.package || data;
        setCityNames(cities.map((city: any) => typeof city === 'string' ? city : city.name));
      } catch (error) {
        console.error('Error fetching cities:', error);
        // Keep default cities if API fails
      }
    };
    fetchCities();
  }, []);

  // Add state for refresh functionality
   // Force re-render when packages change
   // Loading state for refresh

  


  // Update price range when packages change
  useEffect(() => {
    console.log('allPackages changed:', allPackages);
    if (allPackages.length > 0) {
      const prices = allPackages.map(pkg => parsePrice(pkg.price)).filter(price => price > 0);
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        console.log('Setting price range:', { min: minPrice, max: maxPrice });
        setPriceRange({ min: minPrice, max: maxPrice });
      }
    }
  }, [allPackages]);

  const sliderImages = [
    {
      src: "/Destination/singaporeHero/image1.webp",
      title: "Merlion Park",
      subtitle: "Singapore Iconic Merlion at night",
      description: "Experience the iconic Singapore Merlion at night."
    },
    {
      src: "/Destination/singaporeHero/image2.webp",
      title: "Jewel Changi Airport",
      subtitle: "World's Tallest indoor Waterfall",
      description: "Experience the world's tallest indoor waterfall in Changi Airport."
    },
    {
      src: "/Destination/singaporeHero/image3.webp",
      title: "Garden of Bay",
      subtitle: "Futuristic garden wonderland with towering Supertree structures",
      description: "Wander among Supertrees and biodomes in a world-class urban garden."
    },
    {
      src: "/Destination/singaporeHero/image4.webp",
       title: "Marina Bay Sands",
      subtitle: "Iconic infinity pool overlooking the stunning Singapore skyline",
      description: "Swim high above the city and soak in panoramic views at Marina Bay Sands."
    }
  ];

  const getImageDescription = (index: number) => {
    const item = sliderImages[index] as { description?: string };
    return item?.description || "";
  };

  const destinationCards = sliderImages.map(img => ({
    image: img.src,
    subtitle: img.title,
    title: img.title
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // Fetch cities from API and refresh periodically
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        console.log('Fetching cities from API...');
        const response = await fetch('/api/city-filters?destination=singapore');
        const data = await response.json();
        console.log('Cities API response:', data);
        const cities = data.value || data.packages || data.package || data;
        const cityNames = cities.map((city: any) => typeof city === 'string' ? city : city.name);
        console.log('Extracted city names:', cityNames);
        setCityNames(cityNames);
      } catch (error) {
        console.error('Error fetching cities:', error);
        // Keep default cities if API fails
      } finally {
        setCitiesLoading(false);
      }
    };
    
    // Fetch cities immediately
    fetchCities();
    
    // Refresh cities every 30 seconds to catch admin changes
    const interval = setInterval(fetchCities, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter functions (same as other pages)
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

  // Package data
  // const allPackages = [
  //   {
  //     image: "/destination/singaporeHero/image1.jpg",
  //     days: "4 Nights 5 Days",
  //     title: "LUXURY SINGAPORE - Marina Bay Experience",
  //     location: "Marina Bay & Orchard Road",
  //     price: "₹85,000/-",
  //     type: "Luxury",
  //     hotelRating: 5,
  //     features: ["5 Star Hotels", "Marina Bay Sands", "Universal Studios", "City Tour"],
  //     highlights: "Infinity pool â€¢ Gardens by the Bay â€¢ Singapore Flyer â€¢ Fine dining"
  //   },
  //   {
  //     image: "/destination/singaporeHero/image2.jpg",
  //     days: "3 Nights 4 Days",
  //     title: "QUICK SINGAPORE - City Highlights",
  //     location: "Downtown Singapore",
  //     price: "₹55,000/-",
  //     type: "Quick",
  //     hotelRating: 4,
  //     features: ["City Hotels", "Sentosa Island", "Cable Car", "River Cruise"],
  //     highlights: "Merlion Park â€¢ Chinatown â€¢ Little India â€¢ Arab Street"
  //   },
  //   {
  //     image: "/destination/singaporeHero/image3.jpg",
  //     days: "5 Nights 6 Days",
  //     title: "FAMILY SINGAPORE - Theme Parks & Fun",
  //     location: "Sentosa & Universal Studios",
  //     price: "₹95,000/-",
  //     type: "Family",
  //     hotelRating: 4,
  //     features: ["Family Hotels", "Theme Parks", "Wildlife Parks", "Adventure Cove"],
  //     highlights: "Universal Studios â€¢ S.E.A. Aquarium â€¢ Night Safari â€¢ Jurong Bird Park"
  //   },
  //   {
  //     image: "/destination/singaporeHero/image4.jpg",
  //     days: "6 Nights 7 Days",
  //     title: "COMPLETE SINGAPORE - Culture & Adventure",
  //     location: "Singapore Island",
  //     price: "₹1,10,000/-",
  //     type: "Complete",
  //     hotelRating: 4,
  //     features: ["Multiple Areas", "Cultural Tours", "Adventure Parks", "Food Tours"],
  //     highlights: "Hawker centers â€¢ Cultural districts â€¢ Sky diving â€¢ River safari"
  //   },
  //   {
  //     image: "/destination/singaporeHero/image1.jpg",
  //     days: "7 Nights 8 Days",
  //     title: "ULTIMATE SINGAPORE - Luxury & Experiences",
  //     location: "Premium Singapore",
  //     price: "₹1,20,000/-",
  //     type: "Ultimate",
  //     hotelRating: 5,
  //     features: ["Luxury Resorts", "Private Tours", "Fine Dining", "VIP Access"],
  //     highlights: "Michelin dining â€¢ Private yacht â€¢ Helicopter tour â€¢ Exclusive experiences"
  //   }
  // ];

  // Filter and sort logic (same as other pages)
  const filteredPackages = allPackages.filter(pkg => {
    // City filter
    if (selectedCities.length > 0) {
      const packageCities = pkg.location ? pkg.location.split(/[&,]/).map(city => city.trim()) : [];
      const hasSelectedCity = selectedCities.some(selectedCity => 
        packageCities.some(packageCity => 
          packageCity === selectedCity || 
          (selectedCity === "Singapore City" && packageCity === "Downtown Singapore") ||
          (selectedCity === "Singapore City" && packageCity === "Singapore Island")
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
      const pkgNights = extractNights(pkg.days);
      const matchesDuration = selectedDurations.some(duration => {
        const filterNights = duration.split(' ')[0];
        return pkgNights === filterNights;
      });
      if (!matchesDuration) return false;
    }
    const price = parsePrice(pkg.price);
    if (price > priceRange.max) {
      return false;
    }
    return true;
  });

  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        const priceA = parsePrice(a.price);
        const priceB = parsePrice(b.price);
        return priceA - priceB;
      case 'price-high':
        const priceA2 = parsePrice(a.price);
        const priceB2 = parsePrice(b.price);
        return priceB2 - priceA2;
      case 'duration':
        const daysA = parseInt(a.days.split(' ')[0]);
        const daysB = parseInt(b.days.split(' ')[0]);
        return daysA - daysB;
      case 'rating':
        return b.hotelRating - a.hotelRating;
      case 'popularity':
        const typeOrder: { [key: string]: number } = { 'Luxury': 1, 'Family': 2, 'Ultimate': 3, 'Complete': 4, 'Quick': 5 };
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
      // First, try to fetch itinerary from the MongoDB API using packageId
      if (packageData.id) {
        // Add cache busting to ensure fresh data
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/admin/destinations/singapore/itineraries?packageId=${packageData.id}&t=${timestamp}`, {
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
          console.log('Fetched itineraries:', itineraries); // Debug log
          const matchingItinerary = itineraries.find((it: any) => it.packageId === packageData.id);
          
          if (matchingItinerary) {
            console.log('Found matching itinerary, navigating to dynamic page:', matchingItinerary); // Debug log
            // If we found an itinerary, navigate to a dynamic itinerary page
            router.push(`/itinerary/singapore/dynamic/${packageData.id}`);
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
    
    // For packages without itineraries, show contact form or alert
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
              alt={img.title || 'singapore'}
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40"></div>
        </div>

        {/* Hero Content Layout - Left Side Content, Right Side Cards */}
        <div className="relative z-10 h-full flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between px-4 sm:px-6 md:px-8 lg:px-12 pt-16 sm:pt-20 lg:pt-0">
          {/* Left Side - Text Content */}
          <div className="text-white text-center lg:text-left mb-6 sm:mb-8 lg:mb-0 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl lg:mt-20 relative z-40 mx-auto lg:mx-0">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 mb-2 sm:mb-3 font-light">
              {sliderImages[currentImageIndex].subtitle}
            </p>
            <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-2xl leading-tight bg-gradient-to-r from-orange-500 to-red-400 bg-clip-text text-transparent font-limelight`}>
              {sliderImages[currentImageIndex].title.toUpperCase()}
            </h1>
            {getImageDescription(currentImageIndex) && (
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 mb-4 sm:mb-6 font-light max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg leading-relaxed">
                {getImageDescription(currentImageIndex)}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 1 0 001.555.832l3-2a1 1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <a 
                href="https://wa.me/918595682910?text=Hi! I'm interested in discovering more about Singapore destinations. Please help me plan my trip to this amazing city-state." 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-transparent border-2 border-white text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-gray-900 hover:scale-105"
              >
                DISCOVER LOCATION
              </a>
            </div>
          </div>

          {/* Right Side - Destination Cards */}
          <div className="flex-shrink-0 w-full lg:w-auto lg:absolute lg:bottom-24 xl:bottom-32 lg:right-8 xl:right-12 z-10">
            <div className="flex gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 items-center justify-center overflow-x-auto lg:overflow-hidden pb-6 lg:pb-0 px-2 sm:px-0">
              {destinationCards
                .slice(currentImageIndex)
                .concat(destinationCards.slice(0, currentImageIndex))
                .map((card, index) => (
                <div
                  key={`${card.subtitle}-${currentImageIndex}`}
                  className={`relative transition-all duration-700 ease-out cursor-pointer ${
                    index === 0 ? 'z-30' : 'opacity-70 hover:opacity-90 z-20'
                  }`}
                  onClick={() => setCurrentImageIndex((destinationCards.findIndex(c => c.subtitle === card.subtitle)))}
                >
                  <div className="relative w-20 h-28 sm:w-24 sm:h-32 md:w-32 md:h-40 lg:w-36 lg:h-48 xl:w-40 xl:h-52 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border-2 border-white/30">
                    <Image
                      src={card.image}
                      alt={card.title || 'singapore card'}
                      fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700"
                      loading="eager"
                      key={`${card.subtitle}-${currentImageIndex}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 md:bottom-3 md:left-3 text-white">
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
            <div className="flex justify-center gap-2 sm:gap-3 mt-3 sm:mt-4 w-full">
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)}
                className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length)}
                className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Current Slide Number */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-white text-2xl sm:text-3xl md:text-4xl font-bold z-20">
          {String(currentImageIndex + 1).padStart(2, '0')}
        </div>
      </section>

      {/* Packages Section */}
      <Reveal>
      <section id="packages-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Discover Your Perfect Singapore Package</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              From Marina Bay&apos;s luxury to Sentosa&apos;s adventures, explore Singapore&apos;s best with our curated packages
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
              {(selectedCities.length > 0 || selectedHotelRatings.length > 0 || selectedDurations.length > 0 || priceRange.max < originalPriceRange.max || showAllCities) && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setSelectedCities([]);
                      setSelectedHotelRatings([]);
                      setSelectedDurations([]);
                      setShowAllCities(false); // Reset city filter view
                      setPriceRange(originalPriceRange); // Reset to original values
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
                {citiesLoading && (
                  <div className="text-sm text-gray-500 mb-2">Loading cities...</div>
                )}
                <div className="space-y-3">
                  {(() => {
                    // Calculate city counts dynamically from actual packages
                    console.log('Current cityNames state:', cityNames);
                    const cityCounts = allPackages.reduce((acc: { [key: string]: number }, pkg) => {
                      // Extract cities from package location (e.g., "Marina Bay & Orchard Road" -> ["Marina Bay", "Orchard Road"])
                      if (pkg.location) {
                        const cities = pkg.location.split(/[&,]/).map(city => city.trim());
                        cities.forEach(city => {
                          // Handle special cases and normalize city names
                          let normalizedCity = city;
                          if (city === "Downtown Singapore") normalizedCity = "Singapore City";
                          if (city === "Singapore Island") normalizedCity = "Singapore City";
                          if (city === "Premium Singapore") {
                            // Split this into multiple cities
                            ["Singapore City", "Sentosa", "Marina Bay", "Chinatown"].forEach(c => {
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(() => {
                    // Calculate hotel rating counts dynamically from actual packages
                    const ratingCounts = allPackages.reduce((acc: { [key: number]: number }, pkg) => {
                      if (pkg.hotelRating) {
                        acc[pkg.hotelRating] = (acc[pkg.hotelRating] || 0) + 1;
                      }
                      return acc;
                    }, {});
                    
                    return [
                      { stars: 4, count: ratingCounts[4] || 0 },
                      { stars: 5, count: ratingCounts[5] || 0 }
                    ].map(({ stars, count }) => (
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
                    ));
                  })()}
                </div>
              </div>

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
                      min="55000"
                      max="500000"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-orange-500"
                      style={{
                        background: `linear-gradient(to right, #fb923c 0%, #fb923c ${((priceRange.max - 55000) / (500000 - 55000)) * 100}%, #e5e7eb ${((priceRange.max - 55000) / (500000 - 55000)) * 100}%, #e5e7eb 100%)`
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
                  {(() => {
                    // Calculate duration counts dynamically from actual packages
                    const durationCounts = allPackages.reduce((acc: { [key: string]: number }, pkg) => {
                      if (pkg.days) {
                        // Extract number from duration string (e.g., "3 Nights" -> 3)
                        const nights = extractNights(pkg.days);
                        if (nights !== 'N/A') {
                          acc[nights] = (acc[nights] || 0) + 1;
                        }
                      }
                      return acc;
                    }, {});
                    
                    return ['3 Nights', '4 Nights', '5 Nights', '6 Nights', '7 Nights'].map((duration) => {
                      const count = durationCounts[duration] || 0;
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
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Right Side - Packages Grid */}
            <div className="w-full lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                <span className="text-gray-600">Premium Packages Only</span>
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
                {currentPackages.map((pkg, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Mobile: Stacked layout, Desktop: Horizontal layout */}
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                      <Image
                        src={pkg.image}
                        alt={pkg.title || pkg.name || 'singapore package'}
                        fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>

                      <div className="w-full md:w-2/3 p-4 md:p-6 flex flex-col md:flex-row md:justify-between">
                      <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-sm text-gray-500">{formatDuration(pkg.days)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pkg.type === 'Luxury' ? 'bg-purple-100 text-purple-700' :
                            pkg.type === 'Family' ? 'bg-blue-100 text-blue-700' :
                            pkg.type === 'Complete' ? 'bg-green-100 text-green-700' :
                            pkg.type === 'Ultimate' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {pkg.type}
                          </span>
                          <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            <span className="text-yellow-500 mr-1">â­</span>
                            {pkg.hotelRating || 'N/A'} Star
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
                              className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                          >
                            View Details
                          </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

export default SingaporePage; 
