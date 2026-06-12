'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '../../../../components/AdminLayout';
import PackageForm from '../../../../components/PackageForm';

const EditPackagePage = () => {
  const params = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/admin/packages?destination=bali/${params.id}`);
        if (response.ok) {
          const data = await response.json();
        const packages = data.packages || data.package || data;
          setPackageData(data);
        } else {
          console.error('Failed to fetch package');
        }
      } catch (error) {
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPackage();
    }
  }, [params.id]);

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
          <p className="text-gray-600 mt-2">Update package details for Bali</p>
        </div>
        
        <PackageForm 
          package={packageData} 
          mode="edit" 
        />
      </div>
    </AdminLayout>
  );
};

export default EditPackagePage; 