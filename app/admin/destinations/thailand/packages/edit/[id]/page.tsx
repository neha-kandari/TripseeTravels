'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '../../../../../components/AdminLayout';
import PackageForm from '../../../../../components/PackageForm';

const EditThailandPackagePage = () => {
  const params = useParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const packageId = params.id as string;
    
    // Fetch package from Thailand MongoDB API
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/admin/destinations/thailand/packages/${packageId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched package data for editing:', data);
          
          // Transform the data to match the form expectations
          const transformedData = {
            id: data.id,
            name: data.title || data.name,
            description: data.description,
            price: data.price ? data.price.replace(/[₹,\/\-]/g, '') : '', // Remove formatting for form
            days: data.days || data.duration,
            duration: data.duration,
            destination: data.destination || 'thailand',
            location: data.location,
            image: data.image,
            category: data.category,
            type: data.type,
            hotelRating: data.hotelRating,
            features: data.features || [],
            highlights: data.highlights,
            itinerary: data.itinerary,
            inclusions: data.inclusions,
            exclusions: data.exclusions,
            bestTimeToVisit: data.bestTimeToVisit,
            isActive: data.isActive
          };
          
          setPackageData(transformedData);
        } else {
          console.error('Failed to fetch package from Thailand API');
          router.push('/admin/destinations/thailand');
        }
      } catch (error) {
        console.error('Error fetching package from Thailand API:', error);
        router.push('/admin/destinations/thailand');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [params.id, router]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading package...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!packageData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Package not found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Thailand Package</h1>
          <p className="text-gray-600 mt-2">Update package details for Thailand</p>
        </div>
        
        <PackageForm 
          package={packageData} 
          mode="edit" 
          destination="thailand"
        />
      </div>
    </AdminLayout>
  );
};

export default EditThailandPackagePage; 