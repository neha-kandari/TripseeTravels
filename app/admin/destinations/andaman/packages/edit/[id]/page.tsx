'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '../../../../../components/AdminLayout';
import PackageForm from '../../../../../components/PackageForm';

const EditAndamanPackagePage = () => {
  const params = useParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const packageId = params.id as string;
    
    // Fetch package from API
    const fetchPackage = async () => {
      try {
        console.log('Fetching package with ID:', packageId);
        const response = await fetch(`/api/admin/destinations/andaman/packages/${packageId}`);
        console.log('Fetch response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched package data:', data);
          const packageData = data.package || data;
          
          // Ensure the package has an 'id' field for the form
          if (packageData._id && !packageData.id) {
            packageData.id = packageData._id;
          }
          
          console.log('Processed package data with ID:', packageData.id);
          setPackageData(packageData);
        } else {
          console.error('Failed to fetch package, status:', response.status);
          const errorText = await response.text();
          console.error('Error response:', errorText);
          router.push('/admin/destinations/andaman');
        }
      } catch (error) {
        console.error('Error fetching package:', error);
        router.push('/admin/destinations/andaman');
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Andaman Package</h1>
          <p className="text-gray-600 mt-2">Update package details for Andaman</p>
        </div>
        
        <PackageForm 
          package={packageData} 
          mode="edit" 
          destination="andaman"
        />
      </div>
    </AdminLayout>
  );
};

export default EditAndamanPackagePage; 