'use client';

import React from 'react';
import AdminLayout from '../../../../components/AdminLayout';
import PackageForm from '../../../../components/PackageForm';

const NewVietnamPackagePage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Vietnam Package</h1>
          <p className="text-gray-600 mt-2">Create a new travel package for Vietnam</p>
        </div>
        
        <PackageForm mode="create" destination="vietnam" />
      </div>
    </AdminLayout>
  );
};

export default NewVietnamPackagePage; 