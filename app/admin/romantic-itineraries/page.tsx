'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import Link from 'next/link';

interface RomanticItinerary {
  id: string;
  _id?: string; // Add _id for MongoDB compatibility
  packageId: string;
  title: string;
  destination: string;
  duration: string;
  overview: string;
  hotelName?: string;
  hotelRating?: string;
  hotelDescription?: string;
  hotelImages?: {
    src: string;
    alt: string;
    name: string;
    description: string;
  }[];
  days: any[];
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
  updatedAt: string;
}

const RomanticItinerariesPage = () => {
  const [itineraries, setItineraries] = useState<RomanticItinerary[]>([]);
  const [filteredItineraries, setFilteredItineraries] = useState<RomanticItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<string>('all');

  // Fetch itineraries from API
  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/romantic-itineraries');
      if (response.ok) {
        const data = await response.json();
        // Transform data to ensure proper IDs
        const transformedData = data.map((item: any, index: number) => ({
          ...item,
          id: item.id || item._id || `itinerary-${index}`
        }));
        setItineraries(transformedData);
        setFilteredItineraries(transformedData);
      } else {
        console.error('Failed to fetch itineraries');
        setItineraries([]);
        setFilteredItineraries([]);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      setItineraries([]);
      setFilteredItineraries([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter itineraries based on selected filters
  useEffect(() => {
    let filtered = itineraries;

    if (selectedDestination !== 'all') {
      filtered = filtered.filter(it => it.destination === selectedDestination);
    }

    setFilteredItineraries(filtered);
  }, [selectedDestination, itineraries]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this itinerary?')) {
      try {
        const response = await fetch(`/api/admin/romantic-itineraries/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedItineraries = itineraries.filter(it => it.id !== id);
          setItineraries(updatedItineraries);
          setFilteredItineraries(updatedItineraries);
          alert('Itinerary deleted successfully');
        } else {
          const errorData = await response.json();
          alert(`Failed to delete itinerary: ${errorData.message || response.statusText}`);
        }
      } catch (error) {
        console.error('Failed to delete itinerary:', error);
        alert('Failed to delete itinerary');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading romantic itineraries...</div>
        </div>
      </AdminLayout>
    );
  }

  // Get unique destinations for filters
  const destinations = ['all', ...Array.from(new Set(itineraries.map(it => it.destination)))];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Romantic Itineraries</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/romantic-packages"
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              View Packages
            </Link>
            <button
              onClick={fetchItineraries}
              disabled={loading}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Itineraries</p>
                <p className="text-2xl font-bold text-gray-900">{itineraries.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-pink-500">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg">
                <span className="text-2xl">💕</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Romantic</p>
                <p className="text-2xl font-bold text-gray-900">{itineraries.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">🏨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">With Hotels</p>
                <p className="text-2xl font-bold text-gray-900">
                  {itineraries.filter(it => it.hotelName).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Destinations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(itineraries.map(it => it.destination)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {itineraries.length > 0 && !loading && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ Successfully loaded {itineraries.length} romantic itineraries from the database
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading romantic itineraries...</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Itineraries</h2>
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
          </div>
        </div>

        {/* Itineraries Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Romantic Itineraries ({filteredItineraries.length})
          </h2>
          
          {filteredItineraries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💕</div>
              <p className="text-gray-500">No itineraries match your filters</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItineraries.map((itinerary, index) => (
                <div key={itinerary.id || itinerary._id || `itinerary-${index}`} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Itinerary Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        Itinerary
                      </span>
                      <span className="text-sm text-gray-500">{itinerary.duration}</span>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{itinerary.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{itinerary.destination}</p>
                    
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Overview:</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{itinerary.overview}</p>
                    </div>

                    {/* Hotel Info */}
                    {itinerary.hotelName && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Hotel:</p>
                        <p className="text-sm font-medium text-gray-800">{itinerary.hotelName}</p>
                        {itinerary.hotelRating && (
                          <p className="text-xs text-gray-600">{itinerary.hotelRating} Star</p>
                        )}
                      </div>
                    )}

                    {/* Days Count */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500">Days: {itinerary.days?.length || 0}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(itinerary.id)}
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

export default RomanticItinerariesPage;