'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';
import RomanticPackageForm from '../../components/RomanticPackageForm';

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

const EditRomanticPackagePage = () => {
  const params = useParams();
  const [packageData, setPackageData] = useState<RomanticPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/romantic-packages/${params.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setPackageData(data);
        } else {
          setError('Failed to fetch package data');
          console.error('Failed to fetch package:', response.statusText);
        }
      } catch (error) {
        setError('Error fetching package data');
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [params.id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading package data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !packageData) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-700 mb-4">Failed to load package data</p>
          <p className="text-gray-500 mb-6">{error || 'Package not found'}</p>
          <a
            href="/admin/romantic-packages"
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Packages
          </a>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Romantic Package</h1>
          <p className="text-gray-600 mt-2">Update package information</p>
        </div>

        {/* Form */}
        <RomanticPackageForm package={packageData} mode="edit" />
      </div>
    </AdminLayout>
  );
};

export default EditRomanticPackagePage; 