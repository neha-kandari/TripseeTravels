import React from 'react';
import Image from 'next/image';
import MobileVibesCarousel from './MobileVibesCarousel';
import ContactCtaButton from './ContactCtaButton';

const travelBanners = [
  {
    id: 1,
    title: 'Family Vacation',
    background: '/TravelVibes/Family.webp',
    buttonText: 'Book Trip →',
    position: 'top-left'
  },
  {
    id: 2,
    title: 'Honey Moon',
    background: '/TravelVibes/honeyMoon.webp',
    buttonText: 'Book Trip →',
    position: 'top-right'
  },
  {
    id: 3,
    title: 'BEACH HOLIDAY',
    background: '/TravelVibes/BeachHoliday.webp',
    buttonText: 'Book Trip →',
    position: 'bottom-left'
  },
  {
    id: 4,
    title: 'Hill Station',
    background: '/TravelVibes/HillStation.webp',
    buttonText: 'Book Trip →',
    position: 'bottom-middle'
  },
  {
    id: 5,
    title: 'ADVENTURE',
    background: '/TravelVibes/Adventure.webp',
    buttonText: 'Book Trip →',
    position: 'bottom-right'
  }
];

const TravelVibes = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-limelight">
            Travel Vibes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover curated getaways crafted to match your travel vibe
          </p>
        </div>

        {/* Mobile + tablet: one-card-per-row auto-scrolling carousel.
            Client-side, lazy-mounted via the lg:hidden wrapper so the JS only
            kicks in for users who actually see it. */}
        <MobileVibesCarousel />

        {/* Desktop ≥1024 px: pure server-rendered static 5-card grid. No JS. */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Top Row - 2 Banners */}
          <div className="lg:col-span-2">
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <Image
                src={travelBanners[0].background}
                alt="Family Vacation"
                fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/30"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="text-white">
                  <h3 className="text-2xl font-light italic mb-4 font-limelight">
                    Adventure Awaits
                  </h3>
                </div>
                <div>
                                  <ContactCtaButton className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium transition-colors duration-300">{travelBanners[0].buttonText}</ContactCtaButton>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <Image
                src={travelBanners[1].background}
                alt="Honey Moon"
                fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
              />
              {/* Light overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="text-right">
                  <h3 className="text-2xl font-light italic text-white mb-4 font-limelight">
                    Cultural Immersion
                  </h3>
                </div>
                <div className="text-right">
                                  <ContactCtaButton className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium transition-colors duration-300">{travelBanners[1].buttonText}</ContactCtaButton>
                </div>
              </div>
              </div>
            </div>

          {/* Bottom Row - 3 Banners */}
          <div className="lg:col-span-2">
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <Image
                src={travelBanners[2].background}
                alt="Beach Holiday"
                      fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
                    />
                    
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-light italic text-white mb-4 font-limelight">
                    Nature's Beauty
                  </h3>
                    </div>
                    
                <div>
                                  <ContactCtaButton className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium transition-colors duration-300">{travelBanners[2].buttonText}</ContactCtaButton>
                          </div>
                          </div>
                      </div>
                    </div>
                    
          <div className="lg:col-span-1">
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <Image
                src={travelBanners[3].background}
                alt="Hill Station"
                fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
              />
              {/* Light overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-light italic text-white mb-4 font-limelight">
                    Urban Exploration
                  </h3>
                  </div>
                  
                <div className="text-center">
                  <ContactCtaButton className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium transition-colors duration-300">{travelBanners[3].buttonText}</ContactCtaButton>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <Image
                src={travelBanners[4].background}
                alt="Adventure"
                fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
              />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-light italic text-white mb-4 font-limelight">
                    Relaxation & Wellness
                  </h3>
            </div>

                <div className="text-center">
                  <ContactCtaButton className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium transition-colors duration-300">{travelBanners[4].buttonText}</ContactCtaButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelVibes; 