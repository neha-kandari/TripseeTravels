'use client'; 

import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const destinations = [
  'Maldives',
  'Bali',
  'Vietnam',
  'Singapore',
  'Thailand',
  'Malaysia',
  'Dubai',
  'Andaman'
];

interface HeaderProps {
  isWhiteHeader?: boolean;
}

const Header = ({ isWhiteHeader }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDestinationDropdownOpen, setIsDestinationDropdownOpen] = useState(false);


  // Search functionality states
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  // Typewriter effect states
  const [searchText, setSearchText] = useState('');
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);



  // Check if we're on the Reviews page
  const isReviewsPage = pathname === '/reviews';
  // Check if we're on the Contact Us page
  const isContactPage = pathname === '/contact';
  // Check if we're on the About Us page
  const isAboutPage = pathname === '/about';
  // Check if we're on the Terms & Conditions page
  const isTermsPage = pathname === '/terms-and-conditions';

  const needsWhiteBg = isWhiteHeader || isAboutPage || isReviewsPage || isContactPage || isTermsPage;

  // Filter destinations based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDestinations([]);
      setShowSuggestions(false);
    } else {
      const filtered = destinations.filter(destination =>
        destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDestinations(filtered);
      setShowSuggestions(filtered.length > 0);
    }
    setSelectedSuggestionIndex(-1);
  }, [searchQuery]);

  // Typewriter effect for destinations (only when user is not typing)
  useEffect(() => {
    if (isUserTyping) return;
    
    const currentDestination = destinations[currentDestinationIndex];
    
    if (isDeleting) {
      // Deleting characters
      if (currentCharIndex > 0) {
        const timer = setTimeout(() => {
          setSearchText(currentDestination.substring(0, currentCharIndex - 1));
          setCurrentCharIndex(currentCharIndex - 1);
        }, 50);
        return () => clearTimeout(timer);
      } else {
        // Move to next destination
        setIsDeleting(false);
        setCurrentDestinationIndex((prev) => (prev + 1) % destinations.length);
      }
    } else {
      // Typing characters
      if (currentCharIndex < currentDestination.length) {
        const timer = setTimeout(() => {
          setSearchText(currentDestination.substring(0, currentCharIndex + 1));
          setCurrentCharIndex(currentCharIndex + 1);
        }, 100);
        return () => clearTimeout(timer);
      } else {
        // Wait before starting to delete
        const timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentCharIndex, currentDestinationIndex, isDeleting, isUserTyping]);

  // Handle search input change - memoized for performance
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsUserTyping(value.length > 0);
    setShowSuggestions(value.length > 0);
  }, []);

  // Handle search input focus - memoized for performance
  const handleSearchFocus = useCallback(() => {
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  }, [searchQuery.length]);

  // Handle search input blur - memoized for performance
  const handleSearchBlur = useCallback(() => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }, []);

  // Handle clear search - memoized for performance
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setShowSuggestions(false);
    setIsUserTyping(false);
    setSelectedSuggestionIndex(-1);
  }, []);

  // Handle suggestion click - memoized for performance
  const handleSuggestionClick = useCallback((destination: string) => {
    setSearchQuery('');
    setShowSuggestions(false);
    setIsUserTyping(false);
    router.push(`/destination/${destination.toLowerCase().replace(/\s/g, '-')}`);
  }, [router]);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const destination = destinations.find(dest => 
        dest.toLowerCase() === searchQuery.toLowerCase()
      );
      if (destination) {
        handleSuggestionClick(destination);
      } else if (filteredDestinations.length > 0) {
        handleSuggestionClick(filteredDestinations[0]);
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredDestinations.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(filteredDestinations[selectedSuggestionIndex]);
        } else if (filteredDestinations.length > 0) {
          handleSuggestionClick(filteredDestinations[0]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Destination', href: '/destination', hasDropdown: true },
    { name: 'Romantic Hideaway', href: '/romantic-hideaway' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleDestinationDropdown = useCallback(() => {
    setIsDestinationDropdownOpen(!isDestinationDropdownOpen);
  }, [isDestinationDropdownOpen]);

  const closeDestinationDropdown = useCallback(() => {
    setIsDestinationDropdownOpen(false);
  }, []);

  return (
    <header 
      className={`w-full absolute top-0 left-0 z-50 transition-all duration-300 m-0 p-0 ${needsWhiteBg ? 'bg-white shadow-sm' : 'bg-transparent'}`}
    >
      {/* Top Row - Logo, Search Bar, and Contact Us Button */}
      <div className="w-full flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 pt-3 sm:pt-4 pb-2">
        {/* Left Side - Logo */}
        <div className="flex items-center flex-shrink-0 ml-2 sm:ml-4 md:ml-8 lg:ml-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/assets/logo.webp"
                alt="Tripsee Logo"
                width={110}
                height={60}
                className="h-10 w-auto"
                priority
              />
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-[200px] sm:max-w-xs mx-2 sm:mx-4" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none z-10">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div 
              className="bg-white rounded-full shadow-lg px-3 py-1 sm:px-4 sm:py-2 pl-8 sm:pl-10 relative cursor-text"
              onClick={() => {
                if (!isUserTyping) {
                  setIsUserTyping(true);
                  setSearchQuery('');
                  setTimeout(() => {
                    searchInputRef.current?.focus();
                  }, 0);
                }
              }}
            >
              {isUserTyping ? (
                <div className="flex items-center">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Search destinations..."
                    className="flex-1 text-xs sm:text-sm text-black font-bold bg-transparent border-none outline-none placeholder-gray-400"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearSearch();
                      }}
                      className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-xs sm:text-sm">
                  <span className="text-gray-400">Explore & Discover </span>
                  <span className="text-black font-bold">{searchText}</span>
                  <span className="animate-pulse">|</span>
                </div>
              )}
            </div>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((destination, index) => (
                    <button
                      key={destination}
                      type="button"
                      onClick={() => handleSuggestionClick(destination)}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center ${
                        index === selectedSuggestionIndex ? 'bg-orange-50 text-orange-600' : 'text-gray-800'
                      }`}
                    >
                      <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {destination}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 flex items-center">
                    <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0112 4c-2.34 0-4.29 1.009-5.824 2.709" />
                    </svg>
                    No destinations found
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Right Side - Contact Us Button */}
        <div className="hidden lg:flex flex-shrink-0 mr-8 lg:mr-16">
          <a 
            href="https://wa.me/918595682910"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-lg transition-all duration-300 hover:bg-orange-600 hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Contact Us
          </a>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className={`w-full h-12 sm:h-14 md:h-16 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 m-0`}>
        {/* Center - Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.name} className="relative group">
                {item.hasDropdown ? (
                  <div
                    onMouseEnter={() => setIsDestinationDropdownOpen(true)}
                    onMouseLeave={() => setIsDestinationDropdownOpen(false)}
                    className="relative"
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDestinationDropdownOpen(true);
                      }}
                      className={`font-medium text-sm py-2 px-1 transition-all duration-300 hover:text-orange-300 relative ${
                        isReviewsPage || isContactPage || isAboutPage || isTermsPage ? 'text-black' : 'text-white'
                      }`}
                    >
                      {item.name}
                      {/* Subtle underline effect */}
                      <div className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 ${
                        isReviewsPage || isContactPage || isAboutPage || isTermsPage ? 'bg-black opacity-40 group-hover:opacity-80' : 'bg-white opacity-40 group-hover:opacity-80'
                      }`}></div>
                      <svg 
                        className={`inline-block ml-1 w-3 h-3 transition-transform duration-200 ${isDestinationDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Destination Dropdown */}
                    <div 
                      className={`absolute top-full left-0 mt-2 w-96 bg-gray-800/80 backdrop-blur-sm shadow-xl border border-gray-600/40 transition-all duration-200 z-50 ${
                        isDestinationDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                      }`}
                    >
                    <div className="p-6">
                      {/* Two Column Layout for Destinations */}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6">
                        {destinations.map((destination) => (
                          <a
                            key={destination}
                            href={`/destination/${destination.toLowerCase().replace(/\s/g, '-')}`}
                            className="flex items-center text-white hover:text-orange-400 transition-colors duration-200 group"
                            onClick={closeDestinationDropdown}
                          >
                            <span className="text-orange-400 mr-2 group-hover:translate-x-1 transition-transform duration-200">›</span>
                            <span className="font-medium">{destination}</span>
                          </a>
                        ))}
                      </div>

                      {/* Temple Image with Text Overlay */}
                      <div className="relative rounded-lg overflow-hidden">
                        <Image
                          src="/Destination/Bali.webp"
                          alt="Temple on lake"
                          width={400}
                          height={120}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                          <p className="text-sm font-medium">Explore Destination with</p>
                          <p className="text-lg font-bold">Tripsee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`font-medium text-sm py-2 px-1 transition-all duration-300 hover:text-orange-300 relative ${
                      isReviewsPage || isContactPage || isAboutPage || isTermsPage ? 'text-black' : 'text-white'
                    } ${isActive ? 'text-orange-300' : ''}`}
                  >
                    {item.name}
                    {/* Subtle underline effect */}
                    <div className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 ${
                      isActive ? 'bg-orange-400 opacity-100' : (isReviewsPage || isContactPage || isAboutPage || isTermsPage ? 'bg-black opacity-40 group-hover:opacity-80' : 'bg-white opacity-40 group-hover:opacity-80')
                    }`}></div>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile Hamburger Menu Button */}
        <div className="lg:hidden flex-shrink-0">
          <button
            onClick={toggleMobileMenu}
            className={`p-2 rounded-md transition-colors duration-200 ${needsWhiteBg ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-gray-700'}`}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 transition-all duration-300 ${needsWhiteBg ? 'bg-gray-800' : 'bg-white'} ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-5 h-0.5 my-1 transition-all duration-300 ${needsWhiteBg ? 'bg-gray-800' : 'bg-white'} ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 transition-all duration-300 ${needsWhiteBg ? 'bg-gray-800' : 'bg-white'} ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`lg:hidden fixed inset-0 z-[150] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={closeMobileMenu}
        ></div>
        
        {/* Mobile Menu Panel */}
        <div className={`fixed left-0 top-0 h-full w-72 max-w-[80vw] transform transition-all duration-300 ease-in-out bg-black/90 backdrop-blur-lg border-r border-gray-600/50 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 bg-black/95 backdrop-blur-lg border-b border-gray-600/50">
            <div className="flex items-center space-x-3">
              {/* Logo Image */}
              <Image
                src="/assets/logo.webp"
                alt="Tripsee Logo"
                width={96}
                height={60}
                style={{ width: "auto", height: "auto" }} className="w-24 h-14"
                priority
              />
            </div>
            <button
              onClick={closeMobileMenu}
              className="text-white hover:text-gray-300 p-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
              aria-label="Close mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Items */}
          <nav className="p-6 bg-white rounded-lg mx-4 my-2">
            <div className="space-y-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setIsDestinationDropdownOpen(!isDestinationDropdownOpen)}
                          className={`w-full flex items-center justify-between py-3 px-4 rounded-lg text-lg font-medium transition-all duration-200 ${
                            isActive 
                              ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500' 
                              : 'text-gray-800 hover:bg-gray-100'
                          }`}
                        >
                          <span>{item.name}</span>
                          <svg 
                            className={`w-5 h-5 transition-transform duration-200 ${isDestinationDropdownOpen ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {/* Mobile Destination Dropdown */}
                        <div className={`mt-2 ml-4 space-y-2 transition-all duration-200 ${isDestinationDropdownOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                          {destinations.map((destination) => (
                            <a
                              key={destination}
                              href={`/destination/${destination.toLowerCase().replace(/\s/g, '-')}`}
                              onClick={closeMobileMenu}
                              className="block py-2 px-4 text-base text-gray-700 hover:text-orange-600 transition-colors duration-200"
                            >
                              {destination}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`block py-3 px-4 rounded-lg text-lg font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500' 
                            : 'text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        {item.name}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Contact Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href="https://wa.me/918595682910"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:from-orange-500 hover:to-orange-700 active:scale-95 inline-flex items-center justify-center gap-2"
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Contact Us
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;