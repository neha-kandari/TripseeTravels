'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const destinations = [
  { name: 'Thailand', listings: '22 Listing', image: '/Destination/Thailand.webp' },
  { name: 'Vietnam', listings: '22 Listing', image: '/Destination/Vietnam.webp' },
  { name: 'Bali', listings: '22 Listing', image: '/Destination/Bali.webp' },
  { name: 'Singapore', listings: '22 Listing', image: '/Destination/Singapore.webp' },
  { name: 'Maldives', listings: '22 Listing', image: '/Destination/Maldives.webp' },
];

const PopularDestination = () => {
  return (
    <div className="py-12 md:py-16 px-4 bg-white text-center">
      <h3 className="text-lg md:text-xl text-green-800 mb-2 italic font-limelight">Top Destination</h3>
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-8 md:mb-12 font-limelight">Popular Destination</h2>
      </div>

      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
        pagination={{ clickable: true }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 2.5,
          slideShadows: false,
        }}
        modules={[EffectCoverflow, Pagination]}
        className="w-full max-w-6xl mx-auto"
      >
        {destinations.map((dest, index) => (
          <SwiperSlide
            key={index}
            className="rounded-xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition duration-500 w-[250px] md:w-[320px]"
          >
            <div className="relative group h-[450px]">
              <Image
                src={dest.image}
                alt={dest.name}
                fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority={index < 3}
                loading={index < 3 ? undefined : 'eager'}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:bg-black/40 transition duration-300"></div>

              <div className="absolute bottom-5 left-5 text-left text-white z-10">
                <h3 className="text-xl font-bold font-limelight">{dest.name}</h3>
                <p className="text-sm">{dest.listings}</p>
              </div>

              <button className="absolute bottom-5 right-5 z-10 bg-white/30 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm hover:bg-white/50 transition">
                View All →
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PopularDestination;
