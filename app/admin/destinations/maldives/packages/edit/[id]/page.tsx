'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '../../../../../components/AdminLayout';
import PackageForm from '../../../../../components/PackageForm';

const EditMaldivesPackagePage = () => {
  const params = useParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      const packageId = params.id as string;
      
      // Validate packageId before making API call
      if (!packageId || packageId === 'undefined') {
        console.error('Invalid package ID:', packageId);
        router.push('/admin/destinations/maldives');
        return;
      }
      
      // Use packageId directly (no hardcoded package handling)
      const normalizedPackageId = packageId;
      
      try {
        // Fetch package from MongoDB API
        const response = await fetch(`/api/admin/packages/${normalizedPackageId}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Raw API response:', data);
          const apiPackage = data.packages || data.package || data;
          console.log('Fetched package for editing:', apiPackage);
          setPackageData(apiPackage);
        } else {
          console.error('Package not found:', packageId);
          router.push('/admin/destinations/maldives');
        }
      } catch (error) {
        console.error('Error fetching package:', error);
        router.push('/admin/destinations/maldives');
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Maldives Package</h1>
          <p className="text-gray-600 mt-2">Update package details for Maldives</p>
        </div>
        
        <PackageForm 
          package={packageData} 
          mode="edit" 
          destination="maldives"
        />
      </div>
    </AdminLayout>
  );
};

export default EditMaldivesPackagePage; 