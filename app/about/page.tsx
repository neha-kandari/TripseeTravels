'use client';

import React from 'react';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header isWhiteHeader={true} />
      
      {/* Hero Section with Photo Collage */}
      <section className="relative bg-gray-50 overflow-hidden pt-40 sm:pt-48 md:pt-60 min-h-[680px] md:h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-12 md:py-20 mt-4 md:mt-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center h-full gap-6 md:gap-8 lg:gap-12">
            
            {/* Hoisted preload tags — browser starts downloading hero images
                in parallel with HTML parsing, before any JS runs. */}
            <link rel="preload" as="image" href="/assets/aboutus/img3.webp" fetchPriority="high" />
            <link rel="preload" as="image" href="/assets/aboutus/434aca0b-4eeb-41c6-9871-83557652217d.webp" />
            <link rel="preload" as="image" href="/assets/aboutus/1b1a11b4-7417-4a0a-ba49-057a848912cf.webp" />
            <link rel="preload" as="image" href="/assets/aboutus/5ab1e4ca-e116-4349-9072-c2beacc4ed16.webp" />
            <link rel="preload" as="image" href="/assets/aboutus/3c895894-6499-4e4b-8807-23d49803f20c.webp" />

            {/* Left Side - Large Image (LCP) */}
            <div className="w-full md:w-1/2">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg group cursor-pointer bg-orange-50 p-4 md:p-6">
                <Image
                  src="/assets/aboutus/img3.webp"
                  alt="TripSee Travels Owner"
                  fill sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg"
                  priority
                  fetchPriority="high"
                  quality={75}
                />
              </div>
            </div>

            {/* Right Side - Four Equal Small Images (above-the-fold, eager) */}
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <div className="grid grid-cols-2 gap-4">

                {/* Top Left */}
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg group cursor-pointer bg-orange-50 p-3 md:p-4">
                  <Image
                    src="/assets/aboutus/434aca0b-4eeb-41c6-9871-83557652217d.webp"
                    alt="Tripsee team moment"
                    fill sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg"
                    loading="eager"
                    quality={60}
                  />
                </div>

                {/* Top Right */}
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg group cursor-pointer bg-orange-50 p-3 md:p-4">
                  <Image
                    src="/assets/aboutus/1b1a11b4-7417-4a0a-ba49-057a848912cf.webp"
                    alt="Tripsee team moment"
                    fill sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg"
                    loading="eager"
                    quality={60}
                  />
                </div>

                {/* Bottom Left */}
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg group cursor-pointer bg-orange-50 p-3 md:p-4">
                  <Image
                    src="/assets/aboutus/5ab1e4ca-e116-4349-9072-c2beacc4ed16.webp"
                    alt="Tripsee team moment"
                    fill sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg"
                    loading="eager"
                    quality={60}
                  />
                </div>

                {/* Bottom Right */}
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg group cursor-pointer bg-orange-50 p-3 md:p-4">
                  <Image
                    src="/assets/aboutus/3c895894-6499-4e4b-8807-23d49803f20c.webp"
                    alt="Tripsee team moment"
                    fill sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg"
                    loading="eager"
                    quality={60}
                  />
                </div>

              </div>
            </div>
          </div>
 
           {/* Hero Content Overlay */}
          {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-16 md:pt-32">
            <div className="text-center text-gray-900 bg-white/20 backdrop-blur-sm px-6 md:px-8 py-4 md:py-6 rounded-2xl shadow-xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-3">
                <span className="text-gray-800">About</span>
                <span className="text-orange-500 ml-3">Us</span>
              </h1>
              <p className="text-base md:text-lg text-gray-700 max-w-xl mx-auto leading-relaxed">
                We are passionate about creating unforgettable travel experiences that connect people with the world&apos;s most beautiful destinations.
              </p>
            </div>
          </div> */}
        </div>
      </section>

      {/* Our Story Section */}
      <Reveal>
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/20 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/20 rounded-full translate-y-40 -translate-x-40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Decorative line */}
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
              
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">TripSee</span> Travels
              </h2>
              
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  At TripSee Travels, we believe every journey is more than just reaching a destination—it's about creating <span className="text-orange-600 font-semibold">moments</span>, <span className="text-orange-600 font-semibold">memories</span>, and <span className="text-orange-600 font-semibold">experiences</span>.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our company is dedicated to making travel seamless, enjoyable, and personal for each and every client. Whether you're planning a relaxing getaway or an adventurous exploration, our goal is to offer attentive service and curated itineraries that transform your travel dreams into reality.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  From comfortable accommodations to immersive tours, TripSee Travels crafts trips that reflect your interests and passions, ensuring every journey is <span className="text-orange-600 font-semibold">unforgettable</span>.
                </p>
              </div>

              {/* Call to action button — opens the contact popup form */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-contact-popup'))}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Your Journey
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white p-2 rounded-3xl shadow-2xl">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image 
                    src="/assets/aboutus/owner.webp" 
                    alt="TripSee Travels Owner" 
                    fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                    className="object-cover hover:scale-105 transition-transform duration-700" 
                  />
                  {/* Overlay gradient for better visual appeal */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                </div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg animate-pulse">
                ✈️
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-bounce">
                🌍
              </div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Mission & Vision Section */}
      <Reveal>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide exceptional travel experiences that inspire, educate, and connect people with diverse cultures and breathtaking destinations around the world.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the world&apos;s most trusted travel partner, known for creating meaningful journeys that enrich lives and promote sustainable tourism practices.
              </p>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Statistics Section */}
      <Reveal>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600">
              Numbers that tell our story of growth and success
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">15+</div>
              <div className="text-gray-600">Years of Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">50K+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">100+</div>
              <div className="text-gray-600">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* CTA Section */}
      <Reveal>
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let us help you create memories that will last a lifetime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300">
              Explore Destinations
            </button>
            <a 
              href="https://wa.me/918595682910"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
      </Reveal>

      <Footer />
    </div>
  );
};

export default AboutUs; 