'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';
import { formatDuration } from '../../../utils/durationFormatter';

interface Package {
  id: string;
  image: string;
  days: string;
  title: string;
  location: string;
  price: string;
  type: string;
  hotelRating: number;
  features: string[];
  highlights: string;
  createdAt: string;
  updatedAt: string;
}

const MaldivesAdminPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      // Fetch packages from MongoDB API
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/packages?destination=maldives&t=${timestamp}`);
      if (response.ok) {
        const data = await response.json();
        const apiPackages = data.packages || [];
        console.log('Fetched packages from MongoDB API:', apiPackages.length);
        
        // Transform MongoDB packages to match the expected format
        const transformedPackages = apiPackages.map((pkg: any) => ({
          id: pkg.id || pkg._id, // Use the transformed id field or fallback to _id
          image: pkg.image,
          days: pkg.days || pkg.duration,
          title: pkg.title || pkg.name,
          location: pkg.location || pkg.destination,
          price: pkg.price, // Already formatted in API
          type: pkg.type || pkg.category || 'Romantic',
          hotelRating: pkg.hotelRating || 4, // Use actual hotelRating from database
          features: pkg.features || [],
          highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join(' • ') : pkg.highlights || pkg.description,
          createdAt: pkg.createdAt,
          updatedAt: pkg.updatedAt
        }));
        
        // Filter out packages without valid IDs
        const validPackages = transformedPackages.filter((pkg: any) => pkg.id && pkg.id !== 'undefined');
        console.log('Valid packages for admin page:', validPackages.map((pkg: any) => ({ id: pkg.id, title: pkg.title })));
        setPackages(validPackages);
      } else {
        console.error('Failed to fetch packages from API');
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching API packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      // Delete from MongoDB API
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPackages(packages.filter(pkg => pkg.id !== id));
        alert('Package deleted successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete package: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to delete package:', error);
      alert('Failed to delete package: Network error');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading packages...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Maldives Packages</h1>
            <p className="text-gray-600 mt-2">Manage travel packages for Maldives</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/admin/destinations/maldives/itineraries"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 flex items-center"
            >
              <span className="mr-2">🗺️</span>
              Manage Itineraries
            </Link>
            <Link
              href="/admin/destinations/maldives/packages/new"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 flex items-center"
            >
              <span className="mr-2">➕</span>
              Add New Package
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
                <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Premium Packages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {packages.filter(pkg => pkg.type === 'Luxury' || pkg.type === 'Premium').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">🏨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">5 Star Hotels</p>
                <p className="text-2xl font-bold text-gray-900">
                  {packages.filter(pkg => pkg.hotelRating >= 5).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Packages List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Packages</h3>
          </div>
          
          {packages.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No packages yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first Maldives package</p>
              <Link
                href="/admin/destinations/maldives/packages/new"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200"
              >
                Create First Package
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {packages.filter((pkg: any) => {
                console.log('Package being filtered:', { id: pkg.id, title: pkg.title, isValid: pkg.id && pkg.id !== 'undefined' });
                return pkg.id && pkg.id !== 'undefined';
              }).map((packageData) => {
                console.log('Rendering package:', { id: packageData.id, title: packageData.title, type: typeof packageData.id });
                return (
                <div key={packageData.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={packageData.image}
                        alt={packageData.title}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {packageData.type}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {packageData.hotelRating}★
                        </span>
                        <span className="text-sm text-gray-500">{formatDuration(packageData.days)}</span>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{packageData.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{packageData.location}</p>
                      <p className="text-lg font-bold text-orange-600">{packageData.price}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {packageData.features.slice(0, 3).map((feature, index) => (
                          <span key={`${packageData.id}-feature-${index}`} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {packageData.features.length > 3 && (
                          <span className="text-xs text-gray-500">+{packageData.features.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/destinations/maldives/packages/edit/${packageData.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        onClick={() => console.log('Edit link clicked for package:', { id: packageData.id, title: packageData.title })}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(packageData.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default MaldivesAdminPage; 