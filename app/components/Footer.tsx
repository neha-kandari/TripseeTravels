import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="relative">
      {/* Beach Image Section */}
      <div className="relative h-32 sm:h-40 md:h-48">
        <Image
          src="/Footer.webp"
          alt="Beach aerial view"
          fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Footer Content */}
      <div className="bg-orange-50 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            
            {/* First Column - Logo & About */}
            <div className="sm:col-span-2 lg:col-span-1">
                            {/* Logo */}
              <div className="flex items-center mb-4">
                <Image
                  src="/assets/logo.webp"
                  alt="Tripsee Logo"
                  width={80}
                  height={60}
                  style={{ width: "auto", height: "auto" }} className="w-20 h-16 object-contain"
                />
               
              </div>
              
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                Create the best memories with us! We specialize in crafting unforgettable travel experiences across Asia and beyond. From pristine beaches to cultural wonders, let us turn your travel dreams into reality.
              </p>
              
              {/* Social Media Icons */}
              <div className="flex space-x-2 sm:space-x-3">
                <a href="https://www.facebook.com/share/1BTkq6JV4u/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/tripsee.in/" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Second Column - Quick Links */}
            <div className="sm:col-span-1">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-limelight">
                Quick Links
              </h4>
              <ul className="space-y-1 sm:space-y-2">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="/" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    Home
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="/about" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    About Us
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="/contact" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    Contact Us
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="https://wa.me/918595682910" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    WhatsApp Support
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="/terms-and-conditions" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Third Column - Destinations */}
            <div className="sm:col-span-1">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-limelight">
                Popular Destinations
              </h4>
              <ul className="space-y-1 sm:space-y-2">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="/destination/bali" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    Bali
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="/destination/vietnam" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    Vietnam
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="/destination/thailand" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    Thailand
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="/destination/singapore" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    Singapore
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="/destination/maldives" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    Maldives
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="/destination/dubai" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    Dubai
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="/destination/malaysia" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    Malaysia
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <a href="/destination/andaman" className="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors duration-300">
                    Andaman
                  </a>
                </li>
              </ul>
            </div>

            {/* Fourth Column - Contact Info */}
            <div className="sm:col-span-1">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-limelight">
                Get in Touch
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">+91-8595682910</p>
                    <p className="text-xs sm:text-sm text-gray-600">+91-9654145134</p>
                    {/* <p className="text-xs sm:text-sm text-gray-600">WhatsApp Available</p> */}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      <a href="mailto:tripsee.in@gmail.com" className="hover:text-orange-500 transition-colors duration-300">
                        tripsee.in@gmail.com
                      </a>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      <a href="mailto:support@tripsee.com" className="hover:text-orange-500 transition-colors duration-300">
                        sales@tripseetravel.in
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">
                      <a 
                        href="https://maps.google.com/?q=Jl.+Akasia,+III+No.+19+Denpasar+Bali"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-orange-500 transition-colors duration-300"
                      >
                        <strong>Bali Office:</strong> Jl. Akasia, III No. 19 Denpasar Bali
                      </a>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      <a 
                        href="https://maps.google.com/?q=A-100,+Second+Floor,+Sec-58,+Noida+-201301"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-orange-500 transition-colors duration-300"
                      >
                        <strong>Noida Office:</strong> A-100, Second Floor, Sec-58, Noida -201301
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              © 2025 Tripsee. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Website developed by{' '}
              <a 
                href="https://xpanix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-300"
              >
                Xpanix
              </a>
              {' '}(+91 8930005190)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 