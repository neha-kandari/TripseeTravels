'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

interface Itinerary {
  id: string;
  title: string;
  destination: string;
  duration: string;
  overview: string;
  packageId?: string;
  hotelName?: string;
  hotelRating?: string;
  hotelDescription?: string;
  days: {
    day: number;
    title: string;
    activities: string[];
    meals: string[];
    accommodation: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
  updatedAt: string;
}

const MaldivesItinerariesPage = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      console.log('Fetching Maldives itineraries...');
      const response = await fetch('/api/admin/destinations/maldives/itineraries');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Raw API response:', data);
        
        const apiItineraries = data.itineraries || data.itinerary || data;
        console.log('API itineraries:', apiItineraries);
        
        const transformedItineraries = apiItineraries.map((it: any) => ({
          id: it.id || it._id,
          title: it.title,
          destination: it.destination || 'maldives',
          duration: it.duration,
          overview: it.overview,
          packageId: it.packageId,
          hotelName: it.hotelName,
          hotelRating: it.hotelRating,
          hotelDescription: it.hotelDescription,
          days: it.days || [],
          inclusions: it.inclusions || [],
          exclusions: it.exclusions || [],
          createdAt: it.createdAt || new Date().toISOString(),
          updatedAt: it.updatedAt || new Date().toISOString()
        }));
        
        console.log('Transformed itineraries:', transformedItineraries);
        setItineraries(transformedItineraries);
      } else {
        console.error('Failed to fetch itineraries, status:', response.status);
        setItineraries([]);
      }
    } catch (error) {
      console.error('Failed to fetch Maldives itineraries:', error);
      setItineraries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this itinerary?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/destinations/maldives/itineraries/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setItineraries(itineraries.filter(it => it.id !== id));
        alert('Itinerary deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete itinerary: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to delete itinerary:', error);
      alert('Failed to delete itinerary: Network error');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading Maldives itineraries...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maldives Itineraries</h1>
            <p className="text-gray-600 mt-2">Manage travel itineraries for Maldives</p>
          </div>
          <Link
            href="/admin/destinations/maldives/itineraries/new"
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 flex items-center"
          >
            <span className="mr-2">🗺️</span>
            Add New Itinerary
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🗺️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Itineraries</p>
                <p className="text-2xl font-bold text-gray-900">{itineraries.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Days</p>
                <p className="text-2xl font-bold text-gray-900">
                  {itineraries.reduce((total: number, it: Itinerary) => total + it.days.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">✨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recently Added</p>
                <p className="text-2xl font-bold text-gray-900">
                  {itineraries.filter(it => {
                    const createdDate = new Date(it.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return createdDate > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Itineraries Grid */}
        {itineraries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <span className="text-6xl mb-4 block">🗺️</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No itineraries yet</h3>
            <p className="text-gray-600 mb-6">Create your first Maldives itinerary to get started</p>
            <Link
              href="/admin/destinations/maldives/itineraries/new"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 inline-flex items-center"
            >
              <span className="mr-2">🗺️</span>
              Add New Itinerary
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.filter(it => it.id && it.id !== 'undefined').map((itinerary, index) => (
              <div key={itinerary.id || `itinerary-${index}`} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{itinerary.title}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {itinerary.duration}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{itinerary.overview}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📅</span>
                      <span>{itinerary.days.length} days</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🏨</span>
                      <span>{itinerary.hotelRating || 'N/A'} star hotels</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">✅</span>
                      <span>{itinerary.inclusions.length} inclusions</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/destinations/maldives/itineraries/edit/${itinerary.id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors duration-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(itinerary.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(itinerary.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MaldivesItinerariesPage;
