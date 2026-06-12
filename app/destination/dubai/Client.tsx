'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDuration, extractNights } from '../../utils/durationFormatter';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Reveal from '../../components/Reveal';

const DubaiPage = ({ initialPackages = [] }: { initialPackages?: any[] }) => {
  // Helper to parse price string to number for sorting/filtering
  const parsePrice = (priceStr: string | number): number => {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    return parseInt(priceStr.toString().replace(/[^0-9]/g, '')) || 0;
  };

  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [selectedHotelRatings, setSelectedHotelRatings] = useState<number[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 45000, max: 150000 });
  const [sortBy, setSortBy] = useState('price-low');
  const [showAllCities, setShowAllCities] = useState(false); // State for showing all cities in filter
  const [selectedCities, setSelectedCities] = useState<string[]>([]); // State for selected cities
  const [showFilters, setShowFilters] = useState(false); // State for showing/hiding filters on mobile
  const originalPriceRange = { min: 45000, max: 150000 };
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger to force package refresh
  const [cityNames, setCityNames] = useState<string[]>([
    "Dubai City", "Abu Dhabi", "Sharjah", "Ajman",
    "Fujairah", "Ras Al Khaimah", "Umm Al Quwain"
  ]); // Default cities as fallback
  const [isRefreshing, setIsRefreshing] = useState(false); // State for refresh loading
  const [isLoading, setIsLoading] = useState(true);
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
  }>>(initialPackages); // always start empty — no localStorage in useState (prevents hydration mismatch)

  // Refresh packages function
  const refreshPackages = async () => {
    setIsRefreshing(true);
    try {
      console.log('Refreshing Dubai packages...');
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/packages?destination=dubai&t=${timestamp}`);

      if (response.ok) {
        const data = await response.json();
        console.log('Refresh - Raw API response:', data);
        const apiPackages = data.packages || data.package || data;
        console.log('Refresh - API packages received:', apiPackages);

        // Filter out packages with invalid IDs and transform MongoDB packages to match expected format
        const validPackages = apiPackages.filter((pkg: any) => {
          const hasValidId = pkg.id && pkg.id !== 'undefined' && pkg.id !== 'null';
          if (!hasValidId) {
            console.warn('REFRESH - DUBAI WEBSITE FILTER: Skipping package with invalid ID:', pkg);
          }
          return hasValidId;
        });

        console.log(`REFRESH - DUBAI WEBSITE FILTER: ${apiPackages.length} total packages, ${validPackages.length} valid packages`);

        const transformedPackages = validPackages.map((pkg: any) => ({
          id: pkg.id,
          title: pkg.name,
          name: pkg.name,
          description: pkg.description,
          price: `₹${pkg.price.toLocaleString()}/-`,
          duration: pkg.duration,
          days: pkg.days || pkg.duration, // Use days field if available, fallback to duration
          destination: pkg.destination,
          image: pkg.image,
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
          updatedAt: pkg.updatedAt,
          location: pkg.location || 'Dubai'
        }));

        console.log('REFRESH - Transformed packages:', transformedPackages);
        setAllPackages(transformedPackages);
        if (typeof window !== 'undefined' && Array.isArray(transformedPackages) && transformedPackages.length > 0) {
          localStorage.setItem('tripsee_packages_dubai', JSON.stringify(transformedPackages));
        }
      } else {
        console.error('REFRESH - API response not ok:', response.status);
      }
    } catch (error) {
      console.error('REFRESH - Failed to fetch Dubai packages:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch packages from MongoDB API
  // __seed_from_localStorage__
  // Hydrate-safe: empty initial state matches SSR HTML, then on mount we
  // sync-read localStorage and paint cached packages immediately so repeat
  // visits don't show a "loading..." flash before the API responds.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const cached = localStorage.getItem('tripsee_packages_dubai');
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
        if (allPackages.length === 0) setIsLoading(true);
        console.log('Fetching Dubai packages from MongoDB API...');
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/admin/packages?destination=dubai&t=${timestamp}`);

        if (response.ok) {
          const data = await response.json();
          console.log('Raw API response:', data);
          const apiPackages = data.packages || data.package || data;
          console.log('API packages received:', apiPackages);

          // Filter out packages with invalid IDs and transform MongoDB packages to match expected format (exactly like admin panel)
          const validPackages = apiPackages.filter((pkg: any) => {
            const hasValidId = pkg.id && pkg.id !== 'undefined' && pkg.id !== 'null';
            if (!hasValidId) {
              console.warn('DUBAI WEBSITE FILTER: Skipping package with invalid ID:', pkg);
            }
            return hasValidId;
          });

          console.log(`DUBAI WEBSITE FILTER: ${apiPackages.length} total packages, ${validPackages.length} valid packages`);

          const transformedPackages = validPackages.map((pkg: any) => {
            console.log('DUBAI WEBSITE TRANSFORM: Raw package:', pkg);
            console.log('DUBAI WEBSITE TRANSFORM: Package _id:', pkg._id);
            console.log('DUBAI WEBSITE TRANSFORM: Package id:', pkg.id);
            console.log('DUBAI WEBSITE TRANSFORM: Package hotelRating:', pkg.hotelRating);
            console.log('DUBAI WEBSITE TRANSFORM: Package days:', pkg.days);

            return {
              id: pkg.id, // Use the already transformed id field (same as admin panel)
              title: pkg.name,
              name: pkg.name,
              description: pkg.description,
              price: `₹${pkg.price.toLocaleString()}/-`,
              duration: pkg.duration,
              days: pkg.days || pkg.duration, // Use days field if available, fallback to duration
              destination: pkg.destination,
              image: pkg.image,
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
              updatedAt: pkg.updatedAt,
              location: pkg.location || 'Dubai'
            };
          });

          console.log('Transformed packages:', transformedPackages);
          setAllPackages(transformedPackages);
        if (typeof window !== 'undefined' && Array.isArray(transformedPackages) && transformedPackages.length > 0) {
          localStorage.setItem('tripsee_packages_dubai', JSON.stringify(transformedPackages));
        }
          setIsLoading(false);
        } else {
          console.error('API response not ok:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch Dubai packages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [refreshTrigger]);

  // Auto-refresh functionality removed to prevent skeleton flashes on scroll

  // Update price range and log filter counts when packages change
  useEffect(() => {
    if (allPackages.length > 0) {
      const prices = allPackages.map(pkg => parsePrice(pkg.price)).filter(price => price > 0);
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ min: minPrice, max: maxPrice });
      }

      // Log filter counts for debugging
      console.log('DUBAI FILTER COUNTS UPDATE:');
      console.log('Total packages:', allPackages.length);
      console.log('Hotel ratings:', {
        3: allPackages.filter(pkg => pkg.hotelRating === 3).length,
        4: allPackages.filter(pkg => pkg.hotelRating === 4).length,
        5: allPackages.filter(pkg => pkg.hotelRating === 5).length
      });
      console.log('Durations:', {
        '3 Nights': allPackages.filter(pkg => {
          if (!pkg.days) return false;
          const nightsPart = extractNights(pkg.days);
          return nightsPart === '3 Nights';
        }).length,
        '4 Nights': allPackages.filter(pkg => {
          if (!pkg.days) return false;
          const nightsPart = extractNights(pkg.days);
          return nightsPart === '4 Nights';
        }).length,
        '5 Nights': allPackages.filter(pkg => {
          if (!pkg.days) return false;
          const nightsPart = extractNights(pkg.days);
          return nightsPart === '5 Nights';
        }).length,
        '6 Nights': allPackages.filter(pkg => {
          if (!pkg.days) return false;
          const nightsPart = extractNights(pkg.days);
          return nightsPart === '6 Nights';
        }).length,
        '7 Nights': allPackages.filter(pkg => {
          if (!pkg.days) return false;
          const nightsPart = extractNights(pkg.days);
          return nightsPart === '7 Nights';
        }).length
      });
    }
  }, [allPackages]);

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/city-filters?destination=dubai');
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

  // Handle package click to navigate to dynamic itinerary
  const handlePackageClick = async (packageData: { title: string; id?: string }) => {
    console.log('Package clicked:', packageData);

    try {
      // First, try to fetch itinerary from the API using packageId
      if (packageData.id) {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/admin/destinations/dubai/itineraries?packageId=${packageData.id}&t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched itineraries:', data);
          const matchingItinerary = data.find((it: any) => it.packageId === packageData.id);

          if (matchingItinerary) {
            console.log('Found matching itinerary, navigating to dynamic page:', matchingItinerary);
            router.push(`/itinerary/dubai/dynamic/${packageData.id}`);
            return;
          } else {
            console.log('No matching itinerary found for packageId:', packageData.id);
          }
        } else {
          console.error('API response not ok:', response.status);
        }
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
    }

    // For packages without itineraries, show contact form or alert
    alert(`Detailed itinerary for ${packageData.title} coming soon!`);
  };




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
      src: "/Destination/DubaiHero/Burj Khalifa.webp",
      title: "Burj Khalifa",
      subtitle: "Touch the sky at the world's tallest building with breathtaking views",
      description: "Ascend to the observation deck of the Burj Khalifa for panoramic views of Dubai's stunning skyline."
    },
    {
      src: "/Destination/DubaiHero/Dubai Fountain.webp",
      title: "Dubai Fountain",
      subtitle: "Dazzling water, light, and music spectacle at the Dubai Mall",
      description: "Enjoy the choreographed fountain show set against the iconic Burj Khalifa."
    },
    {
      src: "/Destination/DubaiHero/Desert Safari.webp",
      title: "Desert Safari",
      subtitle: "Adventure through golden sand dunes and traditional Bedouin culture",
      description: "Experience dune bashing, camel rides, and an unforgettable evening under the desert sky."
    },
    {
      src: "/Destination/DubaiHero/Dubai Frame.webp",
      title: "Dubai Frame",
      subtitle: "Architectural landmark offering views of old and new Dubai",
      description: "Walk across the glass bridge and take in city panoramas at Dubai Frame."
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

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        console.log('Fetching Dubai cities from API...');
        const response = await fetch('/api/city-filters?destination=dubai');
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

  // Package data
  // const allPackages = [
  //   {
  //     image: "/destination/DubaiHero/image.jpg",
  //     days: "4 Nights 5 Days",
  //     title: "LUXURY DUBAI - Burj Khalifa & Marina Experience",
  //     location: "Dubai City & Marina",
  //     price: "₹85,000/-",
  //     type: "Luxury",
  //     hotelRating: 5,
  //     features: ["5 Star Hotels", "Burj Khalifa", "Desert Safari", "Dubai Mall"],
  //     highlights: "Burj Khalifa tour â€¢ Luxury hotel â€¢ Gold Souk â€¢ Fountain show"
  //   },
  //   {
  //     image: "/destination/DubaiHero/image2.jpg",
  //     days: "5 Nights 6 Days",
  //     title: "FAMILY DUBAI - Theme Parks & Attractions",
  //     location: "Dubai & Abu Dhabi",
  //     price: "₹95,000/-",
  //     type: "Family",
  //     hotelRating: 4,
  //     features: ["Family Hotels", "Theme Parks", "City Tours", "Shopping"],
  //     highlights: "Dubai Parks â€¢ IMG Worlds â€¢ Ferrari World â€¢ Global Village"
  //   },
  //   {
  //     image: "/destination/DubaiHero/image3.jpg",
  //     days: "3 Nights 4 Days",
  //     title: "QUICK DUBAI - City Highlights",
  //     location: "Dubai City",
  //     price: "₹45,000/-",
  //     type: "Quick",
  //     hotelRating: 3,
  //     features: ["Budget Hotels", "City Tour", "Desert Safari", "Marina Cruise"],
  //     highlights: "Burj Al Arab â€¢ Old Dubai â€¢ Spice Souk â€¢ Dhow Cruise"
  //   },
  //   {
  //     image: "/destination/DubaiHero/image4.jpg",
  //     days: "6 Nights 7 Days",
  //     title: "COMPLETE DUBAI - City & Desert Adventure",
  //     location: "Dubai, Abu Dhabi & Desert",
  //     price: "₹1,20,000/-",
  //     type: "Adventure",
  //     hotelRating: 4,
  //     features: ["Desert Camp", "Adventure Sports", "City Tours", "Beach Time"],
  //     highlights: "Overnight desert â€¢ Camel riding â€¢ Skydiving â€¢ Water parks"
  //   },
  //   {
  //     image: "/destination/DubaiHero/image.jpg",
  //     days: "7 Nights 8 Days",
  //     title: "ULTIMATE DUBAI - Luxury & Adventure Combined",
  //     location: "Dubai, Abu Dhabi & Al Ain",
  //     price: "₹1,50,000/-",
  //     type: "Ultimate",
  //     hotelRating: 5,
  //     features: ["Luxury Resorts", "All Experiences", "Private Tours", "Fine Dining"],
  //     highlights: "Atlantis stay â€¢ Private yacht â€¢ Helicopter tour â€¢ VIP experiences"
  //   },
  //   {
  //     image: "/destination/DubaiHero/image2.jpg",
  //     days: "5 Nights 6 Days",
  //     title: "SHOPPING DUBAI - Mall & Souk Experience",
  //     location: "Dubai Shopping Districts",
  //     price: "₹75,000/-",
  //     type: "Shopping",
  //     hotelRating: 4,
  //     features: ["Shopping Tours", "Mall Access", "Souk Visits", "Tax Refunds"],
  //     highlights: "Dubai Mall â€¢ Mall of Emirates â€¢ Gold Souk â€¢ Outlet malls"
  //   }
  // ];

  // Filter packages based on selected filters
  const filteredPackages = allPackages.filter(pkg => {
    // City filter
    if (selectedCities.length > 0) {
      const packageCities = pkg.location ? pkg.location.split(/[&,]/).map(city => city.trim()) : [];
      const hasSelectedCity = selectedCities.some(selectedCity =>
        packageCities.some(packageCity =>
          packageCity === selectedCity ||
          (selectedCity === "Dubai City" && packageCity === "Dubai") ||
          (selectedCity === "Al Ain" && packageCity === "Al Ain")
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
      const nightsPart = pkg.days.split(' ').slice(0, 2).join(' '); // Get "5 Nights" from "5 Nights 6 Days"
      const matchesDuration = selectedDurations.some(duration => {
        return nightsPart === duration;
      });
      if (!matchesDuration) return false;
    }
    const price = parsePrice(pkg.price);
    if (price > priceRange.max) {
      return false;
    }
    return true;
  });

  // Sort packages based on selected sorting option
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
        const typeOrder: { [key: string]: number } = { 'Luxury': 1, 'Family': 2, 'Ultimate': 3, 'Adventure': 4, 'Shopping': 5, 'Quick': 6 };
        return (typeOrder[a.type] || 7) - (typeOrder[b.type] || 7);
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

  return (
    <div className="min-h-screen bg-white dubai-page">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-amber-700 via-orange-800 to-rose-900 overflow-hidden">
        {/* Main Background Image */}
        <div className="absolute inset-0">
          {sliderImages.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.title || 'Dubai destination'}
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
                href="https://wa.me/918595682910?text=Hi! I'm interested in discovering more about Dubai destinations. Please help me plan my trip to this amazing city."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent border-2 border-orange-500 text-orange-500 px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-lg text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 hover:bg-orange-500 hover:text-white hover:scale-105 shadow-lg"
              >
                DISCOVER LOCATION
              </a>
            </div>
          </div>

          {/* Right Side - Destination Cards */}
          <div className="flex-shrink-0 w-full lg:w-auto lg:absolute lg:bottom-24 xl:bottom-32 lg:right-8 xl:right-12 z-10">
            <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 items-center justify-center overflow-x-auto lg:overflow-hidden pb-6 lg:pb-0 px-2 sm:px-0">
              {destinationCards
                .slice(currentImageIndex)
                .concat(destinationCards.slice(0, currentImageIndex))
                .map((card, index) => (
                  <div
                    key={`${card.subtitle}-${currentImageIndex}`}
                    className={`relative transition-all duration-700 ease-out cursor-pointer transform hover:scale-105 ${index === 0 ? 'z-30 scale-110' : 'opacity-70 hover:opacity-90 z-20'
                      }`}
                    onClick={() => setCurrentImageIndex((destinationCards.findIndex(c => c.subtitle === card.subtitle)))}
                  >
                    <div className="relative w-24 h-32 sm:w-28 sm:h-36 md:w-36 md:h-44 lg:w-40 lg:h-52 xl:w-44 xl:h-56 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-300">
                      <Image
                        src={card.image}
                        alt={card.title || 'Dubai destination card'}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                        key={`${card.subtitle}-${currentImageIndex}`}
                        sizes="(max-width: 768px) 96px, (max-width: 1024px) 112px, (max-width: 1280px) 144px, 160px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4 text-white">
                        <p className="text-xs sm:text-sm text-orange-300 mb-1 font-medium drop-shadow-lg">
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
            <div className="flex justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full">
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/20 backdrop-blur-sm text-orange-300 rounded-full flex items-center justify-center hover:bg-orange-500/40 transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 border border-orange-500/30"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/20 backdrop-blur-sm text-orange-300 rounded-full flex items-center justify-center hover:bg-orange-500/40 transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 border border-orange-500/30"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Current Slide Number */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-white text-2xl sm:text-3xl md:text-4xl font-bold z-20 animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <span className="text-orange-500">{String(currentImageIndex + 1).padStart(2, '0')}</span>
          <span className="text-white/60">/{String(sliderImages.length).padStart(2, '0')}</span>
        </div>
      </section>

      {/* Packages Section */}
      <Reveal>
      <section id="packages-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Discover Your Perfect Dubai Package</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              From luxury skyscrapers to desert adventures, explore the best of Dubai with our curated packages
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
              {(selectedCities.length > 0 || selectedHotelRatings.length > 0 || selectedDurations.length > 0 || priceRange.max < originalPriceRange.max || showAllCities) && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setSelectedCities([]);
                      setSelectedHotelRatings([]);
                      setSelectedDurations([]);
                      setShowAllCities(false); // Reset city filter view
                      setPriceRange(originalPriceRange);
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
                      // Extract cities from package location (e.g., "Dubai City & Marina" -> ["Dubai City", "Marina"])
                      if (pkg.location) {
                        const cities = pkg.location.split(/[&,]/).map(city => city.trim());
                        cities.forEach(city => {
                          // Handle special cases and normalize city names
                          let normalizedCity = city;
                          if (city === "Dubai") normalizedCity = "Dubai City";
                          if (city === "Premium Dubai") {
                            // Split this into multiple cities
                            ["Dubai City", "Abu Dhabi", "Sharjah", "Ajman"].forEach(c => {
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
                      min="45000"
                      max="500000"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-orange-500"
                      style={{
                        background: `linear-gradient(to right, #fb923c 0%, #fb923c ${((priceRange.max - 45000) / (500000 - 45000)) * 100}%, #e5e7eb ${((priceRange.max - 45000) / (500000 - 45000)) * 100}%, #e5e7eb 100%)`
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
              {/* Sorting */}
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
                  {isLoading && currentPackages.length === 0 ? (
                    // Loading skeleton
                    <div className="space-y-6">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                          <div className="h-48 bg-gray-200"></div>
                          <div className="p-6">
                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                            <div className="flex justify-between items-center">
                              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : currentPackages.length === 0 ? (
                    // No packages found
                    <div className="text-center py-12">
                      <div className="text-gray-500 text-lg mb-4">No packages found</div>
                      <div className="text-gray-400 text-sm">Try adjusting your filters</div>
                    </div>
                  ) : (
                    currentPackages.map((pkg, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Mobile: Stacked layout, Desktop: Horizontal layout */}
                        <div className="flex flex-col md:flex-row">
                          {/* Package Image */}
                          <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                            <Image
                              src={pkg.image}
                              alt={pkg.title || 'dubai package'}
                              fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>

                          {/* Package Content */}
                          <div className="w-full md:w-2/3 p-4 md:p-6 flex flex-col md:flex-row md:justify-between">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-sm text-gray-500">{formatDuration(pkg.days)}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${pkg.type === 'Luxury' ? 'bg-purple-100 text-purple-700' :
                                    pkg.type === 'Family' ? 'bg-blue-100 text-blue-700' :
                                      pkg.type === 'Adventure' ? 'bg-green-100 text-green-700' :
                                        pkg.type === 'Shopping' ? 'bg-pink-100 text-pink-700' :
                                          pkg.type === 'Ultimate' ? 'bg-indigo-100 text-indigo-700' :
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

                              {/* Highlights */}
                              <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                                {pkg.highlights}
                              </div>

                              {/* Features */}
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
                                <div className="text-xs text-gray-500 mb-2">
                                  For 2 Adults
                                </div>
                                <div className="text-xs text-gray-400">
                                  Excluding Flights
                                </div>
                              </div>
                              <div className="text-left md:text-right w-full md:w-auto">
                                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{pkg.price}</div>
                                <button
                                  onClick={() => handlePackageClick(pkg)}
                                  className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                  View Details
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
              <div className="flex justify-center items-center mt-8 gap-4">
                <button
                  onClick={prevPackages}
                  className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
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

              {/* Package counter */}
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

export default DubaiPage; 
