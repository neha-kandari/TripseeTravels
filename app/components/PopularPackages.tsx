'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Proper fallback component: uses React state so Next.js Image optimization handles it correctly
const ImageWithFallback = ({
  src,
  fallback = '/Destination/Bali.webp',
  alt,
  ...props
}: React.ComponentProps<typeof Image> & { fallback?: string }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  // Reset when src changes (e.g. destination switch)
  useEffect(() => {
    setImgSrc(src);
    setFailed(false);
  }, [src]);

  return (
    <Image
      {...props}
      src={failed ? fallback : imgSrc}
      alt={alt}
      onError={() => {
        if (!failed) {
          setFailed(true);
          setImgSrc(fallback);
        }
      }}
    />
  );
};

interface Destination {
  name: string;
  image: string;
  packages: Package[];
  topDestinations: Array<{
    name: string;
    description: string;
    image: string;
  }>;
}

interface Package {
  id: string;
  title: string;
  days: string;
  location: string;
  price: string;
  type: string;
  hotelRating: number;
  features: string[];
  highlights: string;
  image: string;
  destination: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PopularPackages = ({ initialData }: { initialData?: Record<string, any> | null }) => {
  const [selectedDestination, setSelectedDestination] = useState<string>('BALI');
  const [showTopDestinations, setShowTopDestinations] = useState(true);
  const [currentDestinationsIndex, setCurrentDestinationsIndex] = useState(0);
  // 1 card per page on mobile, 2 per page on tablet/desktop
  const [itemsPerPage, setItemsPerPage] = useState(2);
  // Disable carousel transition for one frame when we snap to 0 on destination change
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  // Auto-slide timer — held in a ref so user actions can reset it cleanly
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([
    {
      name: 'BALI',
      image: '/Destination/Bali.webp',
      packages: [],
      // All landscape (~1.3-1.78 aspect) so they fit a 3:2 card with no/minimal cropping.
      topDestinations: [
        { name: 'Handara Gate', description: 'Iconic temple gate entrance', image: '/Destination/BaliHero/Handara Gate.webp' },
        { name: 'Kelingking Beach', description: 'Dramatic cliff formations', image: '/Destination/BaliHero/Kelingking Beach.webp' },
        { name: 'Tirta Empul Temple', description: 'Sacred water purification', image: '/Destination/BaliHero/Tirta Empul Temple.webp' },
        { name: 'Pura Ulun Danu', description: 'Lake temple on Lake Bratan', image: '/Destination/Bali_images/Pura Ulun Danu.webp' },
        { name: 'Pura Penataran Agung', description: 'Besakih Mother Temple', image: '/Destination/Bali_images/Pura Penataran Agung.webp' },
        { name: 'Tanah Lot Temple', description: 'Iconic temple on the sea', image: '/Destination/Bali_images/Tanah Lot Temple.webp' },
        { name: 'Nusa Penida', description: 'Island paradise adventure', image: '/Destination/Bali_images/Nusa Penida.webp' },
        { name: 'Seminyak Beach', description: 'Luxury beach destination', image: '/Destination/Bali_images/Seminyak Beach.webp' }
      ]
    },
    {
      name: 'VIETNAM',
      image: '/Destination/Vietnam/Halong Bay.webp',
      packages: [],
      topDestinations: [
        { name: 'Ha Long Bay', description: 'Limestone islands and caves', image: '/Destination/Vietnam/Halong Bay.webp' },
        { name: 'Hoi An', description: 'Ancient trading port', image: '/Destination/Vietnam/photo-1533497394934-b33cd9695ba9.webp' },
        { name: 'Mekong Delta', description: 'Floating markets', image: '/Destination/Vietnam/Mekong River Delta.webp' },
        { name: 'Hoi An Lanterns', description: 'Lantern-lit nights', image: '/Destination/Vietnam/Hoi An Lantern.webp' },
        { name: 'Hoan Kiem Lake', description: 'Historic city center', image: '/Destination/Vietnam/hoan kiem lake.webp' },
        { name: 'Golden Bridge', description: 'Iconic architectural marvel', image: '/Destination/Vietnam/golden bridge.webp' },
        { name: 'Ngoc Son Temple', description: 'Sacred temple on the lake', image: '/Destination/Vietnam/ngoc sun temple.webp' },
        { name: 'Phu Quoc Beaches', description: 'Pristine island paradise', image: '/Destination/Vietnam/phu quoc beaches.webp' }
      ]
    },
    {
      name: 'SINGAPORE',
      image: '/Destination/Singapore.webp',
      packages: [],
      topDestinations: [
        { name: 'Marina Bay Sands', description: 'Iconic hotel and skyline', image: '/Destination/Singapore/marina bay sands.webp' },
        { name: 'Chinatown', description: 'Cultural heritage district', image: '/Destination/Singapore/Chinatown.webp' },
        { name: 'Singapore Flyer', description: 'Giant observation wheel', image: '/Destination/Singapore/singapore flyer.webp' },
        { name: 'Helix Bridge', description: 'Iconic pedestrian bridge', image: '/Destination/Singapore/helix brigde.webp' }
      ]
    },
    {
      name: 'DUBAI',
      image: '/Destination/Dubai.webp',
      packages: [],
      topDestinations: [
        { name: 'Burj Al Arab', description: 'Luxury sail-shaped hotel', image: '/Destination/Dubai_images/Burj AI Arab Jumeirah.webp' },
        { name: 'Dubai Mall', description: 'Shopping paradise', image: '/Destination/Dubai_images/Dubai Mall.webp' },
        { name: 'Desert Safari', description: 'Dune bashing adventure', image: '/Destination/Dubai_images/Desert Safari.webp' },
        { name: 'Dubai Fountain', description: "World's largest fountain", image: '/Destination/Dubai_images/Dubai Fountain.webp' }
      ]
    },
    {
      name: 'THAILAND',
      image: '/Destination/Thailand.webp',
      packages: [],
      topDestinations: [
        { name: 'Grand Palace', description: 'Royal palace complex', image: '/Destination/Thailand/grand palace.webp' },
        { name: 'Doi Suthep Temple', description: 'Chiang Mai mountain temple', image: '/Destination/Thailand/doi suthep temple.webp' },
        { name: 'Phi Phi Islands', description: 'Crystal clear waters', image: '/Destination/Thailand/phi phi island.webp' },
        { name: 'Krabi', description: 'Tropical cliffs and beaches', image: '/Destination/Thailand/krabi.webp' }
      ]
    },
    {
      name: 'MALDIVES',
      image: '/Destination/Maldives.webp',
      packages: [],
      topDestinations: [
        { name: 'Conrad Maldives', description: 'Luxury overwater resort', image: '/Destination/Maldives/conrad-maldives.webp' },
        { name: 'Gulhi Falhu', description: 'Pristine island paradise', image: '/Destination/MaldivesHero/gulhi-falhu.webp' },
        { name: 'North Malé Atoll', description: 'Crystal clear waters', image: '/Destination/Maldives/north-male-atoll.webp' },
        { name: 'Meedhoo', description: 'Remote island beauty', image: '/Destination/Maldives/meedhoo-raa-atoll.webp' }
      ]
    },
    {
      name: 'MALAYSIA',
      image: '/Destination/Malasia.webp',
      packages: [],
      topDestinations: [
        { name: 'Batu Caves', description: 'Hindu temple cave complex', image: '/Destination/Malaysia/batu-caves.webp' },
        { name: 'Cameron Highlands', description: 'Lush tea plantations & cool hills', image: '/Destination/Malaysia/cameron-highlands.webp' },
        { name: 'Tioman Island', description: 'Pristine island paradise for divers', image: '/Destination/Malaysia/tioman-island.webp' },
        { name: 'Kapas Island', description: 'Terengganu island beauty', image: '/Destination/Malaysia/kapas-island.webp' }
      ]
    },
    {
      name: 'ANDAMANS',
      image: '/Destination/andaman.webp',
      packages: [],
      topDestinations: [
        { name: 'Havelock Island', description: 'Swaraj Dweep paradise', image: '/Destination/Andamans/havelock-island.webp' },
        { name: 'Neil Island', description: 'Shaheed Dweep beauty', image: '/Destination/Andamans/neil-island.webp' },
        { name: 'Cellular Jail', description: 'Port Blair historical landmark', image: '/Destination/Andamans/cellular-jail.webp' },
        { name: 'North Bay Island', description: 'Coral reefs and water sports', image: '/Destination/Andamans/north-bay-island.webp' }
      ]
    }
  ]);

  // Normalize local image paths: always use .webp regardless of what MongoDB stored
  const normalizeImagePath = (url: string): string => {
    if (!url) return '/Destination/Bali.webp';
    // Keep external URLs and MongoDB API paths unchanged
    if (url.startsWith('http') || url.startsWith('/api/')) return url;
    // Replace any old image extension with .webp
    const withWebp = url.replace(/\.(jpg|jpeg|png|avif|gif|bmp)$/i, '.webp');
    // URL-encode spaces and special characters in each path segment so filenames
    // with spaces (e.g. "Burj Khalifa.webp") work on case-sensitive Linux servers
    return withWebp
      .split('/')
      .map((segment, i) => (i === 0 ? segment : encodeURIComponent(segment)))
      .join('/');
  };

  // Function to convert page URLs to direct image URLs or fallback
  const convertImageUrl = (url: string): string => {
    if (!url) return '/Destination/Bali.webp';
    if (url.includes('unsplash.com/photos/') || url.includes('istockphoto.com/photo/')) return '/Destination/Bali.webp';
    if (url.includes('/photo/') && (url.includes('istockphoto.com') || url.includes('shutterstock.com') || url.includes('gettyimages.com'))) {
      return '/Destination/Bali.webp';
    }
    return normalizeImagePath(url);
  };

  useEffect(() => {
    const serverDests = initialData?.popularPackages?.destinations;
    if (serverDests?.length > 0) {
      // Use server-fetched packages but keep local topDestinations for valid image paths
      setDestinations(prev => prev.map(defaultDest => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const serverDest = serverDests.find((sd: any) => sd.name === defaultDest.name);
        if (serverDest) {
          return {
            ...defaultDest,
            packages: serverDest.packages || []
          };
        }
        return defaultDest;
      }));
      setSelectedDestination(serverDests[0].name);
    }
    // When no server data, the hardcoded useState defaults are already shown — no fetch
  }, [initialData]);

  // Track viewport — 1/2/4 cards per page on mobile/tablet/desktop. Smaller cards
  // on wider screens means each image gets a smaller box, so any unavoidable
  // aspect mismatch is less visible (and all curated images are landscape).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tablet = window.matchMedia('(min-width: 768px)');
    const desktop = window.matchMedia('(min-width: 1024px)');
    const update = () => setItemsPerPage(desktop.matches ? 4 : tablet.matches ? 2 : 1);
    update();
    tablet.addEventListener?.('change', update);
    desktop.addEventListener?.('change', update);
    return () => {
      tablet.removeEventListener?.('change', update);
      desktop.removeEventListener?.('change', update);
    };
  }, []);

  // Whenever items-per-page changes, snap currentIndex to a valid page boundary
  useEffect(() => {
    setCurrentDestinationsIndex(prev => Math.floor(prev / itemsPerPage) * itemsPerPage);
  }, [itemsPerPage]);

  const currentDest = destinations.find(d => d.name === selectedDestination);
  const totalTopDestinations = currentDest?.topDestinations.length || 0;
  const totalPages = Math.ceil(totalTopDestinations / itemsPerPage);
  const currentPage = Math.floor(currentDestinationsIndex / itemsPerPage);

  // Auto-slide every 4s. Resets when destination, viewport, or manual nav changes.
  useEffect(() => {
    if (totalPages <= 1) return;
    autoSlideRef.current = setInterval(() => {
      setCurrentDestinationsIndex(prev => {
        const next = prev + itemsPerPage;
        return next >= totalTopDestinations ? 0 : next;
      });
    }, 4000);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [selectedDestination, itemsPerPage, totalPages, totalTopDestinations, currentDestinationsIndex]);

  // Real packages from destination pages
  const getPackagesForDestination = (destinationName: string) => {
    const destination = destinations.find(d => d.name === destinationName);
    return destination?.packages || [];
  };

  const handleDestinationClick = (destination: Destination) => {
    if (destination.name === selectedDestination) return;
    // Snap carousel to 0 WITHOUT transition so the swap feels instant
    setTransitionEnabled(false);
    setSelectedDestination(destination.name);
    setShowTopDestinations(true);
    setCurrentDestinationsIndex(0);
    // Re-enable transition on the next frame so future user nav still animates
    requestAnimationFrame(() => requestAnimationFrame(() => setTransitionEnabled(true)));
  };

  const nextDestinations = () => {
    setCurrentDestinationsIndex(prev => {
      const next = prev + itemsPerPage;
      return next >= totalTopDestinations ? 0 : next;
    });
  };

  const prevDestinations = () => {
    setCurrentDestinationsIndex(prev => {
      if (prev === 0) {
        return Math.max(0, (totalPages - 1) * itemsPerPage);
      }
      return prev - itemsPerPage;
    });
  };


  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-limelight tracking-wide">
              Popular Packages
            </h2>
          </div>

          {/* Destination Images Grid */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6 mb-12">
            {destinations.map((destination, index) => (
              <div
                key={destination.name}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => handleDestinationClick(destination)}
              >
                {/* Circular Image */}
                <div className={`relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden shadow-lg hover:shadow-xl bg-orange-50 transition-all duration-300 transform hover:scale-105 mb-3 ${
                  selectedDestination === destination.name ? 'ring-2 ring-orange-500 ring-offset-2' : ''
                }`}>
                  <ImageWithFallback
                    src={convertImageUrl(destination.image) || '/Destination/Bali.webp'}
                    fallback="/Destination/Bali.webp"
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-300"
                    sizes="112px"
                    quality={75}
                    priority
                    style={{ objectPosition: 'center' }}
                  />
                </div>
                {/* Destination Name */}
                <p className="text-xs md:text-sm font-bold text-gray-800 text-center font-libre-franklin tracking-wide">
                  {destination.name}
                </p>
              </div>
            ))}
          </div>

          {/* Package Cards - Show packages for selected destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {getPackagesForDestination(selectedDestination).map((pkg, index) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                {/* Mobile: Stacked layout, Desktop: Horizontal layout */}
                <div className="flex flex-col md:flex-row h-auto md:h-56">
                  {/* Image Section */}
                  <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
                    <ImageWithFallback
                      src={convertImageUrl(pkg.image) || '/Destination/Bali.webp'}
                      fallback="/Destination/Bali.webp"
                      alt={pkg.title || 'destination package'}
                      fill
                      className="object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-t-none"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                      quality={80}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
                    />
                  </div>

                  {/* Details Section */}
                  <div className="w-full md:w-3/5 p-3 md:p-3 bg-gray-50 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-800 mb-1 font-limelight tracking-wide">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1 font-libre-franklin font-medium">
                        {pkg.days}
                      </p>
                      <p className="text-xs text-gray-500 mb-2 font-libre-franklin">
                        {pkg.location}
                      </p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
                      <div className="text-base font-bold text-orange-600 font-libre-franklin">
                        {pkg.price}
                      </div>
                      <a
                        href={`https://wa.me/918595682910?text=Hi! I'm interested in the ${pkg.title} package for ${pkg.days} at ${pkg.location}. Price: ${pkg.price}. Please provide more details.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-32 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2 rounded text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 font-libre-franklin whitespace-nowrap text-center inline-block"
                      >
                        Enquire Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Top  Destinations Section - Shows when destination is clicked */}
          {showTopDestinations && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center font-limelight tracking-wide">
                Top Destinations in {selectedDestination}
              </h3>
              <div className="relative overflow-hidden">
                {/* Viewport: one page = itemsPerPage cards (1 mobile, 2 desktop).
                    Each group is `w-full` (= 100% of viewport). They lay out
                    horizontally inside the flex track and overflow off-screen;
                    `overflow-hidden` on the wrapper clips them. translateX moves
                    the whole track by container-width units. */}
                <div className="w-full overflow-hidden">
                  <div
                    className="flex"
                    style={{
                      transform: `translateX(-${currentPage * 100}%)`,
                      transition: transitionEnabled
                        ? 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)'
                        : 'none',
                    }}
                  >
                    {(() => {
                      if (!currentDest) return null;

                      // Build groups of `itemsPerPage` so each group fills one carousel page
                      const groups: typeof currentDest.topDestinations[] = [];
                      for (let i = 0; i < currentDest.topDestinations.length; i += itemsPerPage) {
                        groups.push(currentDest.topDestinations.slice(i, i + itemsPerPage));
                      }

                      const gridColsClass =
                        itemsPerPage === 4 ? 'grid-cols-4' :
                        itemsPerPage === 2 ? 'grid-cols-2' : 'grid-cols-1';
                      return groups.map((group, groupIndex) => (
                        <div key={`${selectedDestination}-${groupIndex}`} className="flex-shrink-0 w-full">
                          <div className={`grid ${gridColsClass} gap-4 md:gap-6 px-2`}>
                            {group.map((dest, index) => (
                              <div
                                key={index}
                                className="w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105"
                              >
                                {/* aspect-[3/2] matches the natural aspect of the curated landscape
                                    images, so object-cover fills the card with no/minimal cropping
                                    and no empty letterbox area. */}
                                <div className="relative aspect-[3/2] overflow-hidden">
                                  <ImageWithFallback
                                    src={convertImageUrl(dest.image) || '/Destination/Bali.webp'}
                                    fallback={convertImageUrl(currentDest.image || '/Destination/Bali.webp')}
                                    alt={dest.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    quality={75}
                                    loading="lazy"
                                  />
                                  {/* Bottom gradient + label for legibility. */}
                                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none"></div>
                                  <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <h4 className="text-sm md:text-base font-semibold mb-0.5 font-limelight tracking-wide drop-shadow-lg leading-tight">
                                      {dest.name}
                                    </h4>
                                    <p className="text-xs opacity-90 font-merienda drop-shadow-lg leading-tight">
                                      {dest.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
              {/* Carousel Navigation */}
              {totalPages > 1 && (
              <div className="flex flex-col items-center mt-8 space-y-4">
                {/* Navigation Buttons and Dots */}
                <div className="flex justify-center items-center space-x-6">
                  {/* Prev Button */}
                  <button
                    onClick={prevDestinations}
                    aria-label="Previous destinations"
                    className="w-10 h-10 bg-white border-2 border-orange-500 text-orange-500 rounded-full shadow-sm hover:bg-orange-50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>

                  {/* Pagination Dots */}
                  <div className="flex space-x-3">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Go to page ${i + 1}`}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
                          i === currentPage ? 'bg-orange-500 scale-125' : 'bg-gray-300'
                        }`}
                        onClick={() => setCurrentDestinationsIndex(i * itemsPerPage)}
                      />
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={nextDestinations}
                    aria-label="Next destinations"
                    className="w-10 h-10 bg-white border-2 border-orange-500 text-orange-500 rounded-full shadow-sm hover:bg-orange-50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>
              )}
            </div>
          )}

          {/* See More Link */}
          <div className="text-center">
            {/* <a
              href="#"
              className="text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-300 font-libre-franklin text-lg tracking-wide"
            >
              See more
            </a> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularPackages; 