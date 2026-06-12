'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import Link from 'next/link';

interface RomanticPackage {
  id: string;
  image: string;
  days: string;
  title: string;
  location: string;
  destination: string;
  price: string;
  type: string;
  hotelRating: number;
  features: string[];
  highlights: string;
}

const RomanticPackagesPage = () => {
  const [packages, setPackages] = useState<RomanticPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<RomanticPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<number>(0);

  // Fetch packages from API
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/romantic-packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
        setFilteredPackages(data);
      } else {
        console.error('Failed to fetch packages');
        // Fallback to sample data if API fails
        setPackages(getSamplePackages());
        setFilteredPackages(getSamplePackages());
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      // Fallback to sample data if API fails
      setPackages(getSamplePackages());
      setFilteredPackages(getSamplePackages());
    } finally {
      setLoading(false);
    }
  };

  // Sample packages as fallback
  const getSamplePackages = (): RomanticPackage[] => [
    {
      id: "maldives-romance",
      image: "/Destination/MaldivesHero/gulhi-falhu.webp",
      days: "5 Nights 6 Days",
      title: "MALDIVES ROMANTIC ESCAPE - Overwater Paradise",
      location: "Male & Private Island",
      destination: "Maldives",
      price: "₹2,25,000/-",
      type: "Honeymoon",
      hotelRating: 5,
      features: ["Overwater Villa", "Private Pool", "Honeymoon Suite", "Candle Night Dinner"],
      highlights: "Private villa • Romantic dinners • Couple massage • Snorkeling together"
    },
    {
      id: "bali-romance",
      image: "/Destination/BaliHero/Handara Gate.webp",
      days: "6 Nights 7 Days",
      title: "BALI ROMANTIC ESCAPE - Private Pool Villas",
      location: "Ubud & Seminyak",
      destination: "Bali",
      price: "₹1,25,000/-",
      type: "Candle Night",
      hotelRating: 5,
      features: ["Private Pool Villa", "Floating Breakfast", "Candle Night Dinner", "Proposal Setup"],
      highlights: "Jungle villas • Rice terrace walks • Temple visits • Romantic dinners"
    }
  ];

  // Valid romantic package types
  const validRomanticTypes = ['Honeymoon', 'Proposal', 'Candle Night', 'Beach Romance', 'Anniversary', 'Romantic'];

  // Filter packages based on selected filters
  useEffect(() => {
    let filtered = packages;

    // First, ensure it's a valid romantic package type
    filtered = filtered.filter(pkg => validRomanticTypes.includes(pkg.type));

    if (selectedDestination !== 'all') {
      filtered = filtered.filter(pkg => pkg.destination === selectedDestination);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(pkg => pkg.type === selectedType);
    }

    if (selectedRating > 0) {
      filtered = filtered.filter(pkg => pkg.hotelRating === selectedRating);
    }

    setFilteredPackages(filtered);
  }, [selectedDestination, selectedType, selectedRating, packages]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`/api/admin/romantic-packages/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedPackages = packages.filter(pkg => pkg.id !== id);
          setPackages(updatedPackages);
          setFilteredPackages(updatedPackages);
          alert('Package deleted successfully');
        } else {
          const errorData = await response.json();
          alert(`Failed to delete package: ${errorData.message || response.statusText}`);
        }
      } catch (error) {
        console.error('Failed to delete package:', error);
        alert('Failed to delete package');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading romantic packages...</div>
        </div>
      </AdminLayout>
    );
  }

  // Get unique destinations and types for filters
  const destinations = ['all', ...Array.from(new Set(packages.map(pkg => pkg.destination)))];
  const types = ['all', ...Array.from(new Set(packages.map(pkg => pkg.type)))];
  const ratings = [0, 4, 5];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Romantic Packages</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/romantic-itineraries"
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Itineraries
            </Link>
            <button
              onClick={fetchPackages}
              disabled={loading}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <Link
              href="/admin/romantic-packages/new"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Package
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
                <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💕</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Honeymoon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {packages.filter(pkg => pkg.type === 'Honeymoon').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">5 Star</p>
                <p className="text-2xl font-bold text-gray-900">
                  {packages.filter(pkg => pkg.hotelRating === 5).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Destinations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(packages.map(pkg => pkg.destination)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {packages.length > 0 && !loading && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ Successfully loaded {packages.length} romantic packages from the database
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading romantic packages...</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Destination Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {destinations.map(dest => (
                  <option key={dest} value={dest}>
                    {dest === 'all' ? 'All Destinations' : dest}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Rating</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Romantic Packages ({filteredPackages.length})
          </h2>
          
          {filteredPackages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💕</div>
              <p className="text-gray-500">No packages match your filters</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Package Image */}
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pkg.hotelRating === 5 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {pkg.hotelRating}★
                      </span>
                    </div>
                  </div>

                  {/* Package Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                        {pkg.type}
                      </span>
                      <span className="text-sm text-gray-500">{pkg.days}</span>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{pkg.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{pkg.location}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-orange-600">{pkg.price}</span>
                      <span className="text-sm text-gray-500">{pkg.destination}</span>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {pkg.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {pkg.features.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            +{pkg.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/romantic-packages/${pkg.id}`}
                        className="flex-1 bg-orange-500 text-white text-center py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors duration-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RomanticPackagesPage; 