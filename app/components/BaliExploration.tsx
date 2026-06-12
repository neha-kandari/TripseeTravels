import React from 'react';
import Image from 'next/image';

const BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

const BaliExploration = () => {
  return (
    <section className="py-16 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 font-limelight">
            Explore Bali
          </h2>
          <p className="text-orange-600 text-lg md:text-xl lg:text-2xl font-medium font-merienda">
            Island Bliss
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto md:grid-rows-2 gap-4 md:gap-6">
          {/* Left Side - Large top image + 2 small side-by-side below */}
          <div className="col-span-1 row-span-1 md:row-span-2 flex flex-col gap-4">
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <Image
                src="/Destination/bali/Bali1.webp"
                alt="Bali Paradise"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                placeholder="blur"
                blurDataURL={BLUR}
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
              <div className="absolute bottom-2 left-2 text-white text-sm font-semibold group-hover:scale-105 transition-transform duration-300">
                Bali Paradise
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1 h-24 md:h-28 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <Image
                  src="/Destination/bali/Bali3.webp"
                  alt="Bali Culture"
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                <div className="absolute bottom-2 left-2 text-white text-xs font-semibold group-hover:scale-105 transition-transform duration-300">
                  Bali Culture
                </div>
              </div>

              <div className="relative flex-1 h-24 md:h-28 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <Image
                  src="/Destination/bali/Bali8.webp"
                  alt="Bali Nature"
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                <div className="absolute bottom-2 left-2 text-white text-xs font-semibold group-hover:scale-105 transition-transform duration-300">
                  Bali Nature
                </div>
              </div>
            </div>
          </div>

          {/* Center Large */}
          <div className="col-span-1 row-span-1 md:row-span-2">
            <div className="relative h-64 md:h-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <Image
                src="/Destination/bali/Bali4.webp"
                alt="Bali Temple"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                placeholder="blur"
                blurDataURL={BLUR}
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 text-white group-hover:scale-105 transition-transform duration-300">
                <h3 className="text-base md:text-lg font-semibold font-limelight">Bali Temple</h3>
                <p className="text-xs md:text-sm opacity-90">Sacred spiritual sites</p>
              </div>
            </div>
          </div>

          {/* Right Side - Large top image + 2 small side-by-side below */}
          <div className="col-span-1 row-span-1 md:row-span-2 flex flex-col gap-4">
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <Image
                src="/Destination/bali/Bali5.webp"
                alt="Bali Adventure"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                placeholder="blur"
                blurDataURL={BLUR}
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
              <div className="absolute bottom-2 left-2 text-white text-sm font-semibold group-hover:scale-105 transition-transform duration-300">
                Bali Adventure
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1 h-24 md:h-28 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <Image
                  src="/Destination/bali/Bali6.webp"
                  alt="Bali Beach"
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                <div className="absolute bottom-2 left-2 text-white text-xs font-semibold group-hover:scale-105 transition-transform duration-300">
                  Bali Beach
                </div>
              </div>

              <div className="relative flex-1 h-24 md:h-28 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <Image
                  src="/Destination/bali/Bali7.webp"
                  alt="Bali Sunset"
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                <div className="absolute bottom-2 left-2 text-white text-xs font-semibold group-hover:scale-105 transition-transform duration-300">
                  Bali Sunset
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BaliExploration;
