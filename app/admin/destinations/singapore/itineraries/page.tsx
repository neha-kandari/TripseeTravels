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
  packageId?: string; // Link to specific package
  hotelName?: string;
  hotelRating?: string;
  hotelDescription?: string;
  days: any[];
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
  updatedAt: string;
}

const SingaporeItinerariesPage = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await fetch('/api/admin/destinations/singapore/itineraries');
      if (response.ok) {
        const data = await response.json();
        const itineraries = data.itineraries || data.itinerary || data;
        console.log('Fetched itineraries:', itineraries);
        // Ensure each itinerary has a unique id
        const itinerariesWithIds = itineraries.map((itinerary: any, index: number) => ({
          ...itinerary,
          id: itinerary.id || itinerary._id || `temp-${index}`
        }));
        setItineraries(itinerariesWithIds);
      } else {
        setItineraries([]);
      }
    } catch (error) {
      console.error('Failed to fetch Singapore itineraries:', error);
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
      const response = await fetch(`/api/admin/destinations/singapore/itineraries/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setItineraries(itineraries.filter(it => it.id !== id));
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
          <div className="text-gray-500">Loading Singapore itineraries...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Singapore Itineraries</h1>
            <p className="text-gray-600 mt-2">Manage travel itineraries for Singapore</p>
          </div>
          <Link
            href="/admin/destinations/singapore/itineraries/new"
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
                  {itineraries.reduce((total, it) => total + it.days.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">🆕</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recently Added</p>
                <p className="text-2xl font-bold text-gray-900">
                  {itineraries.filter(it => {
                    const date = new Date(it.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return date > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Itineraries List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Itineraries</h3>
          </div>
          
          {itineraries.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">🗺️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No itineraries yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first Singapore itinerary</p>
              <Link
                href="/admin/destinations/singapore/itineraries/new"
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200"
              >
                Create First Itinerary
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {itineraries.map((itinerary) => (
                <div key={itinerary.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {itinerary.duration}
                        </span>
                        <span className="text-sm text-gray-500">{itinerary.days.length} days</span>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{itinerary.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{itinerary.overview}</p>
                      {itinerary.packageId && (
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mb-2">
                          📦 Linked to Package: {itinerary.packageId}
                        </div>
                      )}
                      {itinerary.hotelName && (
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-medium">🏨 Hotel:</span> {itinerary.hotelName}
                          {itinerary.hotelRating && (
                            <span className="ml-2 text-yellow-600">⭐ {itinerary.hotelRating} Stars</span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {itinerary.inclusions.slice(0, 3).map((inclusion, index) => (
                          <span key={`${itinerary.id}-inclusion-${index}`} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {inclusion}
                          </span>
                        ))}
                        {itinerary.inclusions.length > 3 && (
                          <span className="text-xs text-gray-500">+{itinerary.inclusions.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/destinations/singapore/itineraries/edit/${itinerary.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(itinerary.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
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

        {/* Back to Singapore Admin */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <Link
            href="/admin/destinations/singapore"
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
          >
            <span className="mr-2">←</span>
            Back to Singapore Packages
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SingaporeItinerariesPage; 