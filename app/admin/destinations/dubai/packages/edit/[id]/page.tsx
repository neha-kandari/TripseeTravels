'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '../../../../../components/AdminLayout';
import PackageForm from '../../../../../components/PackageForm';

const EditExistingPackagePage = () => {
  const params = useParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      const packageId = params.id as string;
      
      console.log('Edit page - packageId from params:', packageId);
      console.log('Edit page - params object:', params);
      
      // Validate packageId before making API call
      if (!packageId || packageId === 'undefined' || packageId === 'null') {
        console.error('Invalid package ID:', packageId);
        alert('Invalid package ID. Redirecting to packages list.');
        router.push('/admin/destinations/dubai');
        return;
      }
      
      // Use packageId directly (no hardcoded package handling)
      const normalizedPackageId = packageId;
      console.log('Edit page - normalized package ID:', normalizedPackageId);
      
      try {
        // Fetch package from MongoDB API
        console.log('Edit page - fetching from API:', `/api/admin/packages/${normalizedPackageId}`);
        const response = await fetch(`/api/admin/packages/${normalizedPackageId}`);
        
        console.log('Edit page - API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Edit page - Raw API response:', data);
          const apiPackage = data.packages || data.package || data;
          console.log('Edit page - Fetched package for editing:', apiPackage);
          
          if (apiPackage && apiPackage.id) {
            setPackageData(apiPackage);
          } else {
            console.error('Edit page - Invalid package data received:', apiPackage);
            alert('Invalid package data received. Redirecting to packages list.');
            router.push('/admin/destinations/dubai');
          }
        } else {
          const errorData = await response.json();
          console.error('Edit page - Package not found:', response.status, errorData);
          alert(`Package not found: ${errorData.error || 'Unknown error'}. Redirecting to packages list.`);
          router.push('/admin/destinations/dubai');
        }
      } catch (error) {
        console.error('Edit page - Error fetching package:', error);
        alert('Network error while fetching package. Redirecting to packages list.');
        router.push('/admin/destinations/dubai');
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Package</h1>
          <p className="text-gray-600 mt-2">Update package details for Dubai</p>
        </div>
        
        <PackageForm 
          package={packageData} 
          mode="edit" 
          destination="dubai"
        />
      </div>
    </AdminLayout>
  );
};

export default EditExistingPackagePage; 