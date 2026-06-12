'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '../../../../../components/AdminLayout';
import PackageForm from '../../../../../components/PackageForm';

const EditSingaporePackagePage = () => {
  const params = useParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const packageId = params.id as string;
    
    // Fetch package from API
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/admin/destinations/singapore/packages/${packageId}`);
        if (response.ok) {
          const data = await response.json();
          setPackageData(data);
        } else {
          console.error('Failed to fetch package');
          router.push('/admin/destinations/singapore');
        }
      } catch (error) {
        console.error('Error fetching package:', error);
        router.push('/admin/destinations/singapore');
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Singapore Package</h1>
          <p className="text-gray-600 mt-2">Update package details for Singapore</p>
        </div>
        
        <PackageForm 
          package={packageData} 
          mode="edit" 
          destination="singapore"
        />
      </div>
    </AdminLayout>
  );
};

export default EditSingaporePackagePage; 