import React from 'react';
import Image from 'next/image';

const features = [
  {
    icon: '🔄',
    title: 'Exclusive Trip',
    description: 'Experience unique and personalized travel packages tailored just for you.'
  },
  {
    icon: '👨‍💼',
    title: 'Professional Guide',
    description: 'Travel with experienced guides who know every destination inside out.'
  }
];

const PlanYourTrip = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-white via-orange-50/30 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-200 rounded-full opacity-10 blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-limelight">
            Plan Your Trip
          </h2>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-800 mb-3 md:mb-4 font-adlam">
            Let us help you create the perfect itinerary
          </h3>
          <p className="text-base md:text-lg text-orange-500 leading-relaxed mb-6 max-w-3xl mx-auto font-merienda">
            Embark on a journey of discovery with Tripsee, where every destination becomes a story waiting to be told. From the misty mountains of Vietnam to the pristine beaches of Bali, we craft experiences that go beyond ordinary travel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* Left Section - Image Collage */}
          <div className="lg:col-span-1">
            <div className="relative">
              <Image
                src="/Container.webp"
                alt="Travel collage"
                width={400}
                height={500}
                className="w-full h-auto rounded-2xl"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
              />
            </div>
          </div>

          {/* Middle Section - Features */}
          <div className="lg:col-span-1">
            <div className="space-y-4 md:space-y-6">
              {/* Features */}
              <div className="space-y-4 md:space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 md:space-x-4 p-4 rounded-xl hover:bg-orange-50/50 transition-all duration-300 group">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-lg md:text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 md:mb-2 group-hover:text-orange-600 transition-colors duration-300 font-limelight">
                        {feature.title}
                      </h4>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="pt-2 md:pt-4">
                <a 
                  href="https://wa.me/918595682910"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border-0"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          {/* Right Section - Person Image */}
          <div className="lg:col-span-1">
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Circular background with gradient */}
                <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-100 rounded-full flex items-center justify-center shadow-2xl border-8 border-white">
                  <Image
                    src="/Person.webp"
                    alt="Traveler"
                    width={300}
                    height={400}
                    className="w-auto h-auto max-w-full max-h-full object-contain drop-shadow-lg"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-400 rounded-full opacity-80 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-yellow-400 rounded-full opacity-60 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PlanYourTrip; 