import React from 'react';
import Image from 'next/image';

const DubaiExploration = () => {
  return (
    <section className="py-16 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 font-limelight">
            Explore Dubai
          </h2>
          <p className="text-orange-600 text-lg md:text-xl lg:text-2xl font-medium font-merienda">
            Desert Majesty
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto md:grid-rows-2 gap-4 md:gap-6">
          {/* Left Side */}
          <div className="col-span-1 row-span-1 md:row-span-2 flex flex-col gap-4">
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <Image
                src="/Destination/Dubai_images/Burj AI Arab Jumeirah.webp"
                alt="Dubai Skyline"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
              <div className="absolute bottom-2 left-2 text-white text-sm font-semibold group-hover:scale-105 transition-transform duration-300">
                Dubai Skyline
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1 h-24 md:h-28 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <Image
                  src="/Destination/Dubai_images/Dubai Mall.webp"
                  alt="Dubai Architecture"
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                <div className="absolute bottom-2 left-2 text-white text-xs font-semibold group-hover:scale-105 transition-transform duration-300">
                  Dubai Architecture
                </div>
              </div>

              <div className="relative flex-1 h-24 md:h-28 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <Image
                  src="/Destination/Dubai/Dubai2.webp"
                  alt="Dubai Luxury"
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                <div className="absolute bottom-2 left-2 text-white text-xs font-semibold group-hover:scale-105 transition-transform duration-300">
                  Dubai Luxury
                </div>
              </div>
            </div>
          </div>

          {/* Center Large */}
          <div className="col-span-1 row-span-1 md:row-span-2">
            <div className="relative h-64 md:h-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <Image
                src="/Destination/Dubai/Dubai1.webp"
                alt="Dubai Iconic Landmark"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 text-white group-hover:scale-105 transition-transform duration-300">
                <h3 className="text-base md:text-lg font-semibold font-limelight">Dubai Iconic Landmark</h3>
                <p className="text-xs md:text-sm opacity-90">Modern architectural marvel</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="col-span-1 row-span-1 md:row-span-2 flex flex-col gap-4">
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <Image
                src="/Destination/Dubai/image2.webp"
                alt="Dubai Adventure"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
              <div className="absolute bottom-2 left-2 text-white text-sm font-semibold group-hover:scale-105 transition-transform duration-300">
                Dubai Adventure
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1 h-24 md:h-28 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <Image
                  src="/Destination/Dubai/image3.webp"
                  alt="Dubai Culture"
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                <div className="absolute bottom-2 left-2 text-white text-xs font-semibold group-hover:scale-105 transition-transform duration-300">
                  Dubai Culture
                </div>
              </div>

              <div className="relative flex-1 h-24 md:h-28 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <Image
                  src="/Destination/Dubai/image4.webp"
                  alt="Dubai Experience"
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                <div className="absolute bottom-2 left-2 text-white text-xs font-semibold group-hover:scale-105 transition-transform duration-300">
                  Dubai Experience
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DubaiExploration;
